/**
 * TTS Synthesis — Generate voiceover audio from transcript.
 *
 * Usage:
 *   node --experimental-strip-types --env-file=.env scripts/tts/generate-audio.ts <VideoName>
 *
 * Reads transcript.json, calls TTS for each scene, writes MP3 files
 * to public/vo/<VideoName>/, and generates src/videos/<VideoName>/voiceover.ts.
 */

import { readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import { join } from "node:path";
import { createProvider } from "./providers/index.ts";
import { getAudioDuration, buildVoiceoverScenes, computeFrameOffsets, wordTimestampsToCaptions, syncTimings } from "./utils.ts";
import type { VideoManifest, Transcript, VoiceoverScene, WordTimestamp } from "./types.ts";
import type { CaptionEntry } from "./utils.ts";

// ─── Pronunciation dictionary ───────────────────────────────
function applyPronunciation(text: string): string {
  const dictPath = join(import.meta.dirname, "pronunciation.json");
  if (!existsSync(dictPath)) return text;
  const dict: Record<string, string> = JSON.parse(readFileSync(dictPath, "utf-8"));
  let result = text;
  for (const [word, replacement] of Object.entries(dict)) {
    result = result.replace(new RegExp(`\\b${word}\\b`, "g"), replacement);
  }
  return result;
}

// ─── Voice ID resolution per provider ────────────────────────
const VOICE_ID_ENV: Record<string, { envVar: string; fallback: string }> = {
  "elevenlabs": { envVar: "ELEVENLABS_VOICE_ID", fallback: "" },
  "cartesia": { envVar: "CARTESIA_VOICE_ID", fallback: "" },
  "edge-tts": { envVar: "EDGE_TTS_VOICE", fallback: "en-US-AndrewNeural" },
  "kokoro": { envVar: "KOKORO_VOICE", fallback: "af_heart" },
};

// ─── Per-scene diagnostics ───────────────────────────────────
type SceneDiag = {
  sceneNum: string;
  sceneType: string;
  words: number;
  audioDuration: number;
  sceneDuration: number;
  wpm: number;
  gapSeconds: number;
};

async function main() {
  const args = process.argv.slice(2);
  const autoSync = args.includes("--auto-sync");
  const videoName = args.find((a) => !a.startsWith("--"));
  if (!videoName) {
    console.error("Usage: generate-audio <VideoName> [--auto-sync]");
    process.exit(1);
  }

  const rootDir = join(import.meta.dirname, "..", "..");
  const videoDir = join(rootDir, "src", "videos", videoName);
  const transcriptPath = join(videoDir, "transcript.json");
  const manifestPath = join(videoDir, "manifest.json");
  const audioDir = join(rootDir, "public", "vo", videoName);

  if (!existsSync(transcriptPath)) {
    console.error(`No transcript.json found at ${transcriptPath}`);
    process.exit(1);
  }
  if (!existsSync(manifestPath)) {
    console.error(`No manifest.json found at ${manifestPath}`);
    process.exit(1);
  }

  const transcript: Transcript = JSON.parse(
    readFileSync(transcriptPath, "utf-8"),
  );
  const manifest: VideoManifest = JSON.parse(
    readFileSync(manifestPath, "utf-8"),
  );

  mkdirSync(audioDir, { recursive: true });

  const provider = createProvider();

  // Resolve voice ID
  const voiceConfig = VOICE_ID_ENV[provider.name];
  let voiceId: string;
  if (voiceConfig) {
    voiceId = transcript.voiceId || process.env[voiceConfig.envVar] || voiceConfig.fallback;
  } else {
    voiceId = transcript.voiceId || "";
  }

  if (!voiceId) {
    console.error(`No voiceId set. Set ${voiceConfig?.envVar ?? "voice ID"} in .env`);
    process.exit(1);
  }

  console.log(`Provider: ${provider.name}`);
  console.log(`Voice: ${voiceId}`);
  console.log(`Scenes: ${transcript.scenes.length}\n`);

  let synthesized = 0;
  let skipped = 0;
  let retried = 0;
  const diagnostics: SceneDiag[] = [];

  for (const scene of transcript.scenes) {
    const sectionNum = String(scene.sectionIndex).padStart(2, "0");
    const sceneNum = String(scene.sceneIndex).padStart(2, "0");
    const filename = `s${sectionNum}-scene-${sceneNum}.mp3`;
    const filePath = join(audioDir, filename);
    const relativePath = `vo/${videoName}/${filename}`;

    if (!scene.narration) {
      console.log(`  [${sceneNum}] ${scene.sceneType} — no narration, skipping`);
      skipped++;
      continue;
    }

    const wordCount = scene.narration.split(/\s+/).filter(Boolean).length;

    console.log(
      `  [${sceneNum}] ${scene.sceneType} (${wordCount}w, ${scene.effectiveDurationSeconds}s) — "${scene.narration.slice(0, 50)}..."`,
    );

    // Synthesize with 1 retry on failure
    let result;
    for (let attempt = 1; attempt <= 2; attempt++) {
      try {
        result = await provider.synthesize({
          text: applyPronunciation(scene.narration),
          voiceId: voiceId,
          format: "mp3",
        });
        break;
      } catch (err) {
        if (attempt === 1) {
          console.warn(`         ⚠ Attempt 1 failed, retrying... (${(err as Error).message})`);
          retried++;
          await new Promise((r) => setTimeout(r, 1000));
        } else {
          console.error(`         ✗ Failed after 2 attempts: ${(err as Error).message}`);
          throw err;
        }
      }
    }

    if (!result) throw new Error("Synthesis returned no result");

    writeFileSync(filePath, result.audioBuffer);
    const actualDuration = getAudioDuration(filePath);
    const actualWPM = wordCount > 0 ? Math.round((wordCount / actualDuration) * 60) : 0;
    const gapSeconds = scene.effectiveDurationSeconds - actualDuration;

    scene.audioFile = relativePath;
    scene.actualDurationSeconds = actualDuration;
    if (result.wordTimestamps && result.wordTimestamps.length > 0) {
      scene.wordTimestamps = result.wordTimestamps;
    }
    synthesized++;

    diagnostics.push({
      sceneNum,
      sceneType: scene.sceneType,
      words: wordCount,
      audioDuration: actualDuration,
      sceneDuration: scene.effectiveDurationSeconds,
      wpm: actualWPM,
      gapSeconds,
    });

    const sizeKB = (result.audioBuffer.byteLength / 1024).toFixed(0);
    const gapStr = gapSeconds > 0
      ? ` gap:${gapSeconds.toFixed(1)}s`
      : gapSeconds < -0.5
        ? ` ⚠OVERFLOW:${(-gapSeconds).toFixed(1)}s`
        : "";
    console.log(
      `         → ${filename} (${actualDuration.toFixed(1)}s, ${sizeKB}KB, ${actualWPM}wpm${gapStr})`,
    );

    // Small delay between requests
    await new Promise((r) => setTimeout(r, 300));
  }

  // ─── Auto-sync: extend scenes where audio overflows ───────
  if (autoSync) {
    const { adjustedCount, report } = syncTimings(transcript.scenes, manifest);
    if (adjustedCount > 0) {
      writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));
      console.log(`\n─── Auto-Sync ───`);
      console.log(`  Extended ${adjustedCount} scene(s) to fit audio:`);
      for (const line of report) console.log(line);
      console.log(`  manifest.json updated.`);
    } else {
      console.log(`\n  Auto-sync: no adjustments needed.`);
    }
  }

  // Update transcript with audio file paths + word timestamps
  writeFileSync(transcriptPath, JSON.stringify(transcript, null, 2));
  console.log(`\nTranscript updated with audio paths.`);

  // ─── Caption generation from word timestamps ─────────────
  const frameOffsets = computeFrameOffsets(manifest);
  const fps = manifest.fps;
  const allCaptions: CaptionEntry[] = [];
  let captionSceneCount = 0;

  for (let i = 0; i < transcript.scenes.length; i++) {
    const scene = transcript.scenes[i];
    if (!scene.wordTimestamps || scene.wordTimestamps.length === 0) continue;

    const sceneOffsetMs = (frameOffsets[i] / fps) * 1000;
    const sceneCaptions = wordTimestampsToCaptions(scene.wordTimestamps, sceneOffsetMs);
    allCaptions.push(...sceneCaptions);
    captionSceneCount++;
  }

  if (allCaptions.length > 0) {
    const captionsPath = join(audioDir, "captions.json");
    writeFileSync(captionsPath, JSON.stringify(allCaptions, null, 2));
    console.log(`Captions written: ${captionsPath} (${allCaptions.length} words from ${captionSceneCount} scenes)`);
  }

  // Generate voiceover.ts
  const voiceoverScenes = buildVoiceoverScenes(transcript.scenes, manifest);
  const captionsRelativePath = allCaptions.length > 0 ? `vo/${videoName}/captions.json` : null;
  const voiceoverCode = generateVoiceoverModule(voiceoverScenes, captionsRelativePath);
  const voiceoverPath = join(videoDir, "voiceover.ts");
  writeFileSync(voiceoverPath, voiceoverCode);

  console.log(`Voiceover module written to ${voiceoverPath}`);

  // ─── Diagnostic summary ──────────────────────────────────
  if (diagnostics.length > 0) {
    const totalAudio = diagnostics.reduce((s, d) => s + d.audioDuration, 0);
    const totalScene = diagnostics.reduce((s, d) => s + d.sceneDuration, 0);
    const totalGap = diagnostics.reduce((s, d) => s + Math.max(0, d.gapSeconds), 0);
    const avgWPM = Math.round(diagnostics.reduce((s, d) => s + d.wpm, 0) / diagnostics.length);
    const overflows = diagnostics.filter((d) => d.gapSeconds < -0.3);

    console.log(`\n─── Synthesis Summary ───`);
    console.log(`  Synthesized: ${synthesized}  Skipped: ${skipped}  Retried: ${retried}`);
    console.log(`  Total audio: ${totalAudio.toFixed(1)}s  Total scene time: ${totalScene.toFixed(1)}s`);
    console.log(`  Total silence gaps: ${totalGap.toFixed(1)}s  Avg WPM: ${avgWPM}`);

    if (avgWPM > 160) {
      console.warn(`\n  ⚠ Average WPM (${avgWPM}) is high — audio may sound rushed.`);
      console.warn(`    Try setting CARTESIA_SPEED=slow in .env to slow the voice down.`);
    }

    if (overflows.length > 0) {
      console.warn(`\n  ⚠ ${overflows.length} scene(s) overflow their effective duration:`);
      for (const d of overflows) {
        console.warn(`    Scene ${d.sceneNum} (${d.sceneType}): audio ${d.audioDuration.toFixed(1)}s > scene ${d.sceneDuration.toFixed(1)}s`);
      }
    }

    const bigGaps = diagnostics.filter((d) => d.gapSeconds > 2);
    if (bigGaps.length > 0) {
      console.warn(`\n  ⚠ ${bigGaps.length} scene(s) have large silence gaps (>2s):`);
      for (const d of bigGaps) {
        console.warn(`    Scene ${d.sceneNum} (${d.sceneType}): ${d.gapSeconds.toFixed(1)}s gap (${d.words}w in ${d.audioDuration.toFixed(1)}s, scene is ${d.sceneDuration.toFixed(1)}s)`);
      }
    }
  }

  console.log(
    `\nDone! ${synthesized} synthesized, ${skipped} skipped (no narration).`,
  );
  console.log(`\nNext: Add VoiceoverLayer to ${videoName}/index.tsx`);
}

function generateVoiceoverModule(scenes: VoiceoverScene[], captionsFile: string | null): string {
  const lines = [
    `import type { VoiceoverScene } from "../../shared/components/VoiceoverLayer";`,
    ``,
    `export const VOICEOVER_SCENES: VoiceoverScene[] = [`,
  ];

  for (const scene of scenes) {
    lines.push(`  {`);
    lines.push(`    src: "${scene.src}",`);
    lines.push(`    fromFrame: ${scene.fromFrame},`);
    lines.push(`    durationInFrames: ${scene.durationInFrames},`);
    lines.push(`  },`);
  }

  lines.push(`];`);

  if (captionsFile) {
    lines.push(``);
    lines.push(`/** Path to word-level captions JSON for CaptionOverlay (relative to public/) */`);
    lines.push(`export const CAPTIONS_FILE = "${captionsFile}";`);
  }

  lines.push(``);

  return lines.join("\n");
}

main();
