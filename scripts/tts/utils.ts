import { execSync } from "node:child_process";
import { readFileSync } from "node:fs";
import type { VideoManifest, VoiceoverScene, SceneTranscript } from "./types.ts";

// ─── Duration Calculation (script-first pipeline) ──────────

/** Minimum scene durations in seconds, by scene type. */
export const MIN_SCENE_DURATIONS: Record<string, number> = {
  SectionTitle: 3,
  HookQuestion: 4,
  EndScreen: 5,
  DiagramFlow: 8,
  CodeDisplay: 8,
  TimelineScene: 8,
  ArchitectureDiagram: 8,
  ThreeColumnCompare: 8,
  FileTreeScene: 8,
  default: 3,
};

/**
 * Calculate scene duration from narration word count.
 *
 * Uses 155 WPM (conservative) with 0.5s visual breathing room,
 * rounded up to nearest 0.5s, floored by MIN_SCENE_DURATIONS.
 *
 * @param narration  The narration text for the scene
 * @param sceneType  Scene type key (for minimum duration lookup)
 * @param wpm        Words per minute (default 155)
 * @returns Duration in seconds (rounded to nearest 0.5s)
 */
export function calculateDurationFromNarration(
  narration: string,
  sceneType: string,
  wpm = 155,
): number {
  const wordCount = narration.split(/\s+/).filter(Boolean).length;
  if (wordCount === 0) {
    return MIN_SCENE_DURATIONS[sceneType] ?? MIN_SCENE_DURATIONS.default;
  }
  const baseDuration = (wordCount / wpm) * 60;
  const paddedDuration = baseDuration + 0.5;
  const rounded = Math.ceil(paddedDuration * 2) / 2; // nearest 0.5s up
  const minDuration = MIN_SCENE_DURATIONS[sceneType] ?? MIN_SCENE_DURATIONS.default;
  return Math.max(rounded, minDuration);
}

/**
 * Get audio duration in seconds using ffprobe.
 * Falls back to rough estimation from file size if ffprobe is unavailable.
 */
export function getAudioDuration(filePath: string): number {
  try {
    const output = execSync(
      `ffprobe -v quiet -print_format json -show_format "${filePath}"`,
      { encoding: "utf-8" },
    );
    const data = JSON.parse(output);
    return parseFloat(data.format.duration);
  } catch {
    console.warn(
      "[WARNING] ffprobe not found — using file-size estimate for audio duration.",
    );
    console.warn(
      "  Install ffmpeg (https://ffmpeg.org/) for accurate durations.",
    );
    // Fallback: estimate from MP3 file size (~48kbps, typical for Edge TTS).
    // Uses low bitrate estimate to OVER-estimate duration (safer than under).
    // Under-estimating causes audio cutoff; over-estimating just adds silence.
    const stats = readFileSync(filePath);
    return (stats.byteLength * 8) / 48_000;
  }
}

/**
 * Adaptive WPM based on expected narration length.
 * Neural TTS speaks short sentences significantly faster than long ones:
 *   - Short (< 3s effective): ~190 WPM — quick phrases, section titles
 *   - Medium (3-7s effective): ~160 WPM — typical narration sentences
 *   - Long (> 7s effective): ~140 WPM — multi-sentence narrations
 *
 * Raised ~15% from original 170/145/125 thresholds based on measured data:
 * actual WPM across 30+ scenes was consistently higher than budgets allowed,
 * causing 2-3s silent gaps. Combined with sonic-3 speed 0.95 for more
 * controlled delivery.
 */
function adaptiveWPM(effectiveSeconds: number): number {
  if (effectiveSeconds < 3) return 190;
  if (effectiveSeconds < 7) return 160;
  return 140;
}

/**
 * Calculate word budget for a scene duration.
 * Uses adaptive WPM to match actual neural TTS pacing.
 */
export function wordBudget(seconds: number): number {
  return Math.floor((seconds * adaptiveWPM(seconds)) / 60);
}

/**
 * Calculate effective word budget accounting for transition overlaps.
 * TransitionSeries scenes share frames with neighbors, so the actual
 * audio time is shorter than the raw scene duration.
 * Uses adaptive WPM calibrated for neural TTS pacing.
 * The clamping mechanism in buildVoiceoverScenes handles minor overflow.
 */
export function effectiveWordBudget(
  durationSeconds: number,
  transitionAfterFrames: number,
  fps: number,
): number {
  const effectiveDuration = durationSeconds - transitionAfterFrames / fps;
  return Math.floor((effectiveDuration * adaptiveWPM(effectiveDuration)) / 60);
}

/**
 * Compute absolute start frames for each scene in a video.
 * Accounts for TransitionSeries overlaps within sections
 * and Series sequencing between sections.
 */
export function computeFrameOffsets(manifest: VideoManifest): number[] {
  const fps = manifest.fps;
  const offsets: number[] = [];
  let sectionStartFrame = 0;

  for (const section of manifest.sections) {
    let frameInSection = 0;

    for (const scene of section.scenes) {
      offsets.push(sectionStartFrame + frameInSection);
      frameInSection += scene.durationSeconds * fps;

      // Subtract transition overlap (next scene starts earlier)
      if (scene.transitionAfter) {
        frameInSection -= scene.transitionAfter.frames;
      }
    }

    sectionStartFrame += section.durationFrames;
  }

  return offsets;
}

/**
 * Build the VOICEOVER_SCENES array from transcript + manifest.
 * Used to generate the voiceover.ts file for a video.
 */
export function buildVoiceoverScenes(
  scenes: SceneTranscript[],
  manifest: VideoManifest,
): VoiceoverScene[] {
  const fps = manifest.fps;
  const frameOffsets = computeFrameOffsets(manifest);
  const voiceoverScenes: VoiceoverScene[] = [];

  // Buffer frames added to each audio Sequence to prevent premature cutoff.
  // MP3 frame encoding can make actual playback slightly longer than ffprobe reports.
  const BUFFER_FRAMES = 5;

  for (let i = 0; i < scenes.length; i++) {
    const scene = scenes[i];
    if (!scene.audioFile || !scene.narration) continue;

    const durationSec = scene.actualDurationSeconds ?? scene.durationSeconds;

    voiceoverScenes.push({
      src: scene.audioFile,
      fromFrame: frameOffsets[i],
      durationInFrames: Math.round(durationSec * fps) + BUFFER_FRAMES,
    });
  }

  // Clamp durations so no audio overlaps with the next scene's audio.
  // Transition overlaps cause scenes to share frames visually, but
  // voiceover audio must not bleed across scene boundaries.
  for (let i = 0; i < voiceoverScenes.length - 1; i++) {
    const gap = voiceoverScenes[i + 1].fromFrame - voiceoverScenes[i].fromFrame;
    if (voiceoverScenes[i].durationInFrames > gap) {
      const overflowFrames = voiceoverScenes[i].durationInFrames - gap;
      console.warn(
        `[WARNING] Scene audio clamped: scene at frame ${voiceoverScenes[i].fromFrame} ` +
        `overflows by ${overflowFrames} frames (${(overflowFrames / fps).toFixed(2)}s). ` +
        `Narration may be cut off.`,
      );
      voiceoverScenes[i].durationInFrames = gap;
    }
  }

  return voiceoverScenes;
}

/**
 * Extract on-screen text from scene props based on scene type.
 * Used by transcript generation to know what's already visible.
 */
export function extractOnScreenText(
  sceneType: string,
  props: Record<string, unknown>,
): string[] {
  const texts: string[] = [];

  const textKeys = [
    "question",
    "subtext",
    "title",
    "subtitle",
    "heading",
    "body",
    "analogy",
    "takeaway",
    "statement",
    "code",
    "message",
    "callout",
  ];

  for (const key of textKeys) {
    if (typeof props[key] === "string") {
      texts.push(props[key] as string);
    }
  }

  // Array props: objectives, steps, items, nodes, etc.
  const arrayKeys = ["objectives", "steps", "items", "nodes", "bars"];
  for (const key of arrayKeys) {
    const arr = props[key];
    if (Array.isArray(arr)) {
      for (const item of arr) {
        if (typeof item === "string") {
          texts.push(item);
        } else if (typeof item === "object" && item !== null) {
          const obj = item as Record<string, unknown>;
          if (typeof obj.title === "string") texts.push(obj.title);
          if (typeof obj.label === "string") texts.push(obj.label);
          if (typeof obj.description === "string") texts.push(obj.description);
        }
      }
    }
  }

  // Comparison panels
  for (const key of ["before", "after", "left", "right"]) {
    const panel = props[key];
    if (typeof panel === "object" && panel !== null) {
      const obj = panel as Record<string, unknown>;
      if (typeof obj.title === "string") texts.push(obj.title);
      if (Array.isArray(obj.items)) {
        for (const item of obj.items) {
          if (typeof item === "string") texts.push(item);
        }
      }
    }
  }

  return texts;
}
