/**
 * Generate a skeleton transcript.json from a video manifest.
 *
 * Usage:
 *   node --env-file=.env --strip-types scripts/tts/generate-transcript.ts <VideoName> [--force]
 *
 * Reads manifest.json from src/<VideoName>/ and outputs transcript.json
 * to the same directory. The narration field is left empty — to be
 * filled by the /voiceover skill using Claude.
 *
 * If transcript.json already exists with narrations:
 *   - Default: MERGE mode — preserves existing narrations, only fills empty ones
 *   - --force: overwrites everything with a fresh skeleton
 */

import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { join } from "node:path";
import { effectiveWordBudget, extractOnScreenText } from "./utils.ts";
import type { VideoManifest, Transcript, SceneTranscript } from "./types.ts";

const videoName = process.argv[2];
if (!videoName) {
  console.error("Usage: generate-transcript <VideoName> [--force]");
  process.exit(1);
}

const forceOverwrite = process.argv.includes("--force");

const rootDir = join(import.meta.dirname, "..", "..");
const videoDir = join(rootDir, "src", videoName);
const manifestPath = join(videoDir, "manifest.json");
const transcriptPath = join(videoDir, "transcript.json");

if (!existsSync(manifestPath)) {
  console.error(`No manifest.json found at ${manifestPath}`);
  console.error(
    "Run /video first to generate the video, or create the manifest manually.",
  );
  process.exit(1);
}

const manifest: VideoManifest = JSON.parse(
  readFileSync(manifestPath, "utf-8"),
);

// Load existing transcript for merge mode
let existingNarrations: Map<number, string> = new Map();
let existingHasNarrations = false;

if (!forceOverwrite && existsSync(transcriptPath)) {
  try {
    const existing: Transcript = JSON.parse(
      readFileSync(transcriptPath, "utf-8"),
    );
    for (const scene of existing.scenes) {
      if (scene.narration) {
        existingNarrations.set(scene.sceneIndex, scene.narration);
        existingHasNarrations = true;
      }
    }
    if (existingHasNarrations) {
      console.log(
        `Found existing transcript with ${existingNarrations.size} narration(s) — merging (use --force to overwrite).`,
      );
    }
  } catch {
    // Existing file is corrupt — will be overwritten
  }
}

const voiceId = process.env.CARTESIA_VOICE_ID ?? process.env.EDGE_TTS_VOICE ?? "";

const fps = manifest.fps;
const scenes: SceneTranscript[] = [];
let globalSceneIndex = 0;
let preserved = 0;

for (const section of manifest.sections) {
  for (const scene of section.scenes) {
    globalSceneIndex++;
    const transitionFrames = scene.transitionAfter?.frames ?? 0;
    const effectiveDuration = scene.durationSeconds - transitionFrames / fps;

    // Preserve existing narration in merge mode
    const existingNarration = existingNarrations.get(globalSceneIndex) ?? "";
    if (existingNarration) preserved++;

    scenes.push({
      sceneIndex: globalSceneIndex,
      sectionIndex: section.sectionIndex,
      sceneType: scene.sceneType,
      durationSeconds: scene.durationSeconds,
      effectiveDurationSeconds: parseFloat(effectiveDuration.toFixed(2)),
      transitionAfterFrames: transitionFrames,
      wordBudget: effectiveWordBudget(scene.durationSeconds, transitionFrames, fps),
      onScreenText: extractOnScreenText(scene.sceneType, scene.props),
      narration: existingNarration,
    });
  }
}

const transcript: Transcript = {
  videoName: manifest.videoName,
  voiceId,
  scenes,
};

writeFileSync(transcriptPath, JSON.stringify(transcript, null, 2));

if (forceOverwrite) {
  console.log(`Transcript skeleton written (forced) to ${transcriptPath}`);
} else if (preserved > 0) {
  console.log(`Transcript merged to ${transcriptPath}`);
  console.log(`  ${preserved} narrations preserved, ${scenes.length - preserved} empty`);
} else {
  console.log(`Transcript skeleton written to ${transcriptPath}`);
}

console.log(`  ${scenes.length} scenes, voice ID: ${voiceId || "(not set)"}`);
console.log(
  "\nNext: Fill narration fields via /voiceover, then run generate-audio.ts",
);
