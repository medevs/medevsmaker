import { execSync } from "node:child_process";
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { join } from "node:path";
import type { VideoManifest, VoiceoverScene, SceneTranscript, SceneManifest, SectionManifest, WordTimestamp } from "./types.ts";

// ─── Caption Types (Remotion @remotion/captions format) ─────

export type CaptionEntry = {
  text: string;
  startMs: number;
  endMs: number;
  timestampMs: number;
  confidence: number;
};

// ─── Constants ────────────────────────────────────────────

/** Safety frames added to audio Sequences — Remotion unmounts audio at Sequence boundary. */
export const BUFFER_FRAMES = 5;

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
    const duration = parseFloat(data.format.duration);
    if (!isNaN(duration)) return duration;

    // WebM/Opus from streaming sources often lack duration in the container header.
    // Decode the file with ffmpeg to get the actual duration.
    const ffmpegOut = execSync(
      `ffmpeg -i "${filePath}" -f null - 2>&1`,
      { encoding: "utf-8", shell: true },
    );
    const match = ffmpegOut.match(/time=(\d+):(\d+):(\d+\.\d+)/);
    if (match) {
      return parseInt(match[1]) * 3600 + parseInt(match[2]) * 60 + parseFloat(match[3]);
    }

    throw new Error("Could not parse duration from ffmpeg output");
  } catch {
    console.warn(
      "[WARNING] ffprobe/ffmpeg not found — using file-size estimate for audio duration.",
    );
    console.warn(
      "  Install ffmpeg (https://ffmpeg.org/) for accurate durations.",
    );
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
      frameInSection += Math.round(scene.durationSeconds * fps);

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

  // Safety clamp: prevent audio from bleeding into the next scene.
  // With syncTimings providing buffer-aware headroom, this should rarely trigger.
  // Only warn when real narration overflow occurs (beyond the safety buffer).
  for (let i = 0; i < voiceoverScenes.length - 1; i++) {
    const gap = voiceoverScenes[i + 1].fromFrame - voiceoverScenes[i].fromFrame;
    if (voiceoverScenes[i].durationInFrames > gap) {
      const overflowFrames = voiceoverScenes[i].durationInFrames - gap;
      if (overflowFrames > BUFFER_FRAMES) {
        console.warn(
          `[WARNING] Scene audio clamped: scene at frame ${voiceoverScenes[i].fromFrame} ` +
          `overflows by ${overflowFrames} frames (${(overflowFrames / fps).toFixed(2)}s). ` +
          `Narration may be cut off.`,
        );
      }
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

// ─── Caption Generation ─────────────────────────────────────

/**
 * Convert word-level timestamps from TTS providers into Remotion Caption[] format.
 * Each word becomes a Caption entry with absolute timing (scene offset applied).
 *
 * @param words       Word timestamps from TTS provider (relative to scene start)
 * @param sceneOffsetMs  Absolute start time of this scene in the video (milliseconds)
 * @returns Caption entries ready for @remotion/captions
 */
export function wordTimestampsToCaptions(
  words: WordTimestamp[],
  sceneOffsetMs: number,
): CaptionEntry[] {
  return words.map((w) => ({
    text: " " + w.word,
    startMs: sceneOffsetMs + w.startMs,
    endMs: sceneOffsetMs + w.endMs,
    timestampMs: sceneOffsetMs + w.startMs,
    confidence: 1.0,
  }));
}

/**
 * Sync scene durations to match actual TTS audio lengths.
 * Extends scenes where audio + buffer would overflow the effective duration.
 * Breathing room is added to the effective space so transitions don't eat it.
 */
export function syncTimings(
  scenes: SceneTranscript[],
  manifest: VideoManifest,
): { adjustedCount: number; report: string[] } {
  const fps = manifest.fps;
  const bufferSeconds = BUFFER_FRAMES / fps;
  const report: string[] = [];
  let adjustedCount = 0;

  // Positional map: flat index → { manifest scene, parent section }.
  // Transcript and manifest scenes are always in the same order
  // (generate-transcript.ts iterates manifest sections in order).
  const sceneMap: { mScene: SceneManifest; section: SectionManifest }[] = [];
  for (const section of manifest.sections) {
    for (const scene of section.scenes) {
      sceneMap.push({ mScene: scene, section });
    }
  }

  for (let i = 0; i < scenes.length; i++) {
    const scene = scenes[i];
    if (!scene.actualDurationSeconds || !scene.narration) continue;

    const transitionOverlap = scene.transitionAfterFrames / fps;
    const audioWithBuffer = scene.actualDurationSeconds + bufferSeconds;
    const overflow = audioWithBuffer - scene.effectiveDurationSeconds;

    if (overflow > 0) {
      // Effective space needed: audio + buffer + 0.3s breathing room.
      // Full duration: add transition overlap back (gets deducted for effective).
      const newDuration = scene.actualDurationSeconds + bufferSeconds + 0.3 + transitionOverlap;
      const oldDuration = scene.durationSeconds;
      const deltaSeconds = newDuration - oldDuration;
      const deltaFrames = Math.round(deltaSeconds * fps);

      // Update manifest scene and section frames (positional match)
      const { mScene, section } = sceneMap[i];
      mScene.durationSeconds = newDuration;
      section.durationFrames += deltaFrames;
      manifest.totalFrames += deltaFrames;

      // Update transcript scene
      scene.durationSeconds = newDuration;
      scene.effectiveDurationSeconds = newDuration - transitionOverlap;

      report.push(
        `  Scene ${i + 1} (${scene.sceneType}): extended ${oldDuration.toFixed(1)}s → ${newDuration.toFixed(1)}s ` +
        `(audio ${scene.actualDurationSeconds.toFixed(1)}s, overflow ${overflow.toFixed(2)}s)`,
      );
      adjustedCount++;
    }
  }

  return { adjustedCount, report };
}

/**
 * Sync Remotion source files (Section*.tsx, music.ts, Root.tsx) to match
 * updated manifest durations after auto-sync extends scenes.
 *
 * Updates hardcoded durationInFrames values, SECTION_N_DURATION_FRAMES exports,
 * music config, and Root.tsx Composition duration.
 */
export function syncSectionFiles(
  manifest: VideoManifest,
  rootDir: string,
): { updatedFiles: string[]; report: string[] } {
  const fps = manifest.fps;
  const videoDir = join(rootDir, "src", "videos", manifest.videoName);
  const sectionsDir = join(videoDir, "sections");
  const updatedFiles: string[] = [];
  const report: string[] = [];

  // ─── Update Section*.tsx files ────────────────────────────
  for (const section of manifest.sections) {
    const sectionFile = join(sectionsDir, `Section${section.sectionIndex}.tsx`);
    if (!existsSync(sectionFile)) {
      report.push(`⚠ Section${section.sectionIndex}.tsx not found, skipping`);
      continue;
    }

    let content = readFileSync(sectionFile, "utf-8");
    const original = content;

    // Update each scene's comment + durationInFrames
    for (const scene of section.scenes) {
      const newFrames = Math.round(scene.durationSeconds * fps);
      const newSeconds = scene.durationSeconds.toFixed(1);

      // Match: {/* Scene N: Type — Xs = Yf [optional text] */}\n...durationInFrames={Y}
      const commentAndFrames = new RegExp(
        `(\\{/\\* Scene ${scene.sceneIndex}: \\w+ — )[\\d.]+s = \\d+f[^*]*(\\*/\\}` +
        `\\s*<TransitionSeries\\.Sequence durationInFrames=\\{)\\d+(\\}>)`,
      );

      if (commentAndFrames.test(content)) {
        content = content.replace(
          commentAndFrames,
          `$1${newSeconds}s = ${newFrames}f $2${newFrames}$3`,
        );
      } else {
        // Fallback: try to match just the durationInFrames for this scene position
        // (older videos may have different comment styles)
        report.push(`⚠ Scene ${scene.sceneIndex} comment pattern not matched in Section${section.sectionIndex}.tsx`);
      }
    }

    // Recalculate SECTION_N_DURATION_FRAMES
    let totalSceneFrames = 0;
    let totalTransitionFrames = 0;
    const sceneFrameValues: number[] = [];
    const transitionValues: number[] = [];

    for (const scene of section.scenes) {
      const frames = Math.round(scene.durationSeconds * fps);
      totalSceneFrames += frames;
      sceneFrameValues.push(frames);
      if (scene.transitionAfter) {
        totalTransitionFrames += scene.transitionAfter.frames;
        transitionValues.push(scene.transitionAfter.frames);
      }
    }

    const sectionDurationFrames = totalSceneFrames - totalTransitionFrames;

    // Update the sum comment + export constant
    const sumLine = sceneFrameValues.join(" + ");
    const transLine = transitionValues.length > 0
      ? ` - (${transitionValues.join(" + ")}) = ${sectionDurationFrames}f`
      : ` = ${sectionDurationFrames}f`;
    const newComment = `// ${sumLine} = ${totalSceneFrames}f${transLine}`;

    const exportPattern = new RegExp(
      `// .+\\n(export const SECTION_${section.sectionIndex}_DURATION_FRAMES = )\\d+;`,
    );
    if (exportPattern.test(content)) {
      content = content.replace(
        exportPattern,
        `${newComment}\n$1${sectionDurationFrames};`,
      );
    } else {
      // Try without the comment line
      const exportOnly = new RegExp(
        `(export const SECTION_${section.sectionIndex}_DURATION_FRAMES = )\\d+;`,
      );
      if (exportOnly.test(content)) {
        content = content.replace(exportOnly, `$1${sectionDurationFrames};`);
      }
    }

    // Also update the section's durationFrames in the manifest object
    // so downstream code (music.ts, Root.tsx) uses consistent values
    section.durationFrames = sectionDurationFrames;

    if (content !== original) {
      writeFileSync(sectionFile, content);
      updatedFiles.push(`Section${section.sectionIndex}.tsx`);
    }
  }

  // Recalculate totalFrames from updated section durationFrames
  manifest.totalFrames = manifest.sections.reduce((sum, s) => sum + s.durationFrames, 0);

  // ─── Update music.ts ──────────────────────────────────────
  const musicFile = join(videoDir, "music.ts");
  if (existsSync(musicFile)) {
    let musicContent = readFileSync(musicFile, "utf-8");
    const musicOriginal = musicContent;

    // Update durationInFrames
    musicContent = musicContent.replace(
      /durationInFrames: \d+,/,
      `durationInFrames: ${manifest.totalFrames},`,
    );

    // Calculate new sectionStarts
    const sectionStarts: number[] = [0];
    let cumulative = 0;
    for (let i = 0; i < manifest.sections.length - 1; i++) {
      cumulative += manifest.sections[i].durationFrames;
      sectionStarts.push(cumulative);
    }

    musicContent = musicContent.replace(
      /sectionStarts: \[[^\]]+\],/,
      `sectionStarts: [${sectionStarts.join(", ")}],`,
    );

    if (musicContent !== musicOriginal) {
      writeFileSync(musicFile, musicContent);
      updatedFiles.push("music.ts");
    }
  }

  // ─── Update Root.tsx ──────────────────────────────────────
  const rootFile = join(rootDir, "src", "Root.tsx");
  if (existsSync(rootFile)) {
    let rootContent = readFileSync(rootFile, "utf-8");
    const rootOriginal = rootContent;

    // Match: id="VideoName" ... durationInFrames={N}
    const rootPattern = new RegExp(
      `(id="${manifest.videoName}"[\\s\\S]*?durationInFrames=\\{)\\d+(\\})`,
    );
    rootContent = rootContent.replace(rootPattern, `$1${manifest.totalFrames}$2`);

    if (rootContent !== rootOriginal) {
      writeFileSync(rootFile, rootContent);
      updatedFiles.push("Root.tsx");
    }
  }

  if (updatedFiles.length > 0) {
    report.push(`Updated: ${updatedFiles.join(", ")}`);
    report.push(`New total: ${manifest.totalFrames} frames (${(manifest.totalFrames / fps).toFixed(1)}s)`);
  }

  return { updatedFiles, report };
}
