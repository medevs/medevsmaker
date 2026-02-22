/**
 * TTS Synthesis — Generate voiceover audio from transcript.
 *
 * Usage:
 *   node --experimental-strip-types --env-file=.env scripts/tts/generate-audio.ts <VideoName>
 *
 * Reads transcript.json, calls TTS for each scene, writes MP3 files
 * to public/vo/<VideoName>/, and generates src/<VideoName>/voiceover.ts.
 */

import { readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import { join } from "node:path";
import { createProvider } from "./providers/index.ts";
import { getAudioDuration, buildVoiceoverScenes } from "./utils.ts";
import type { VideoManifest, Transcript, VoiceoverScene } from "./types.ts";

async function main() {
  const videoName = process.argv[2];
  if (!videoName) {
    console.error("Usage: generate-audio <VideoName>");
    process.exit(1);
  }

  const rootDir = join(import.meta.dirname, "..", "..");
  const videoDir = join(rootDir, "src", videoName);
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

  // Resolve voice ID based on provider
  let voiceId: string;
  if (provider.name === "edge-tts") {
    voiceId = process.env.EDGE_TTS_VOICE ?? "en-US-AndrewNeural";
  } else {
    voiceId = transcript.voiceId || process.env.FISH_AUDIO_VOICE_ID || "";
    if (!voiceId) {
      console.error("No voiceId set. Set FISH_AUDIO_VOICE_ID in .env");
      process.exit(1);
    }
  }

  console.log(`Using TTS provider: ${provider.name}`);
  console.log(`Voice: ${voiceId}`);
  console.log(`Scenes to synthesize: ${transcript.scenes.length}\n`);

  let synthesized = 0;
  let skipped = 0;

  for (const scene of transcript.scenes) {
    const sceneNum = String(scene.sceneIndex).padStart(2, "0");
    const filename = `scene-${sceneNum}.mp3`;
    const filePath = join(audioDir, filename);
    const relativePath = `vo/${videoName}/${filename}`;

    if (!scene.narration) {
      console.log(`  [${sceneNum}] ${scene.sceneType} — no narration, skipping`);
      skipped++;
      continue;
    }

    console.log(
      `  [${sceneNum}] ${scene.sceneType} — "${scene.narration.slice(0, 50)}..."`,
    );

    const result = await provider.synthesize({
      text: scene.narration,
      voiceId: voiceId,
      format: "mp3",
    });

    writeFileSync(filePath, result.audioBuffer);
    const actualDuration = getAudioDuration(filePath);

    scene.audioFile = relativePath;
    scene.actualDurationSeconds = actualDuration;
    synthesized++;

    console.log(
      `         → ${filename} (${actualDuration.toFixed(1)}s, ${(result.audioBuffer.byteLength / 1024).toFixed(0)}KB)`,
    );

    // Small delay between requests
    await new Promise((r) => setTimeout(r, 300));
  }

  // Update transcript with audio file paths
  writeFileSync(transcriptPath, JSON.stringify(transcript, null, 2));
  console.log(`\nTranscript updated with audio paths.`);

  // Generate voiceover.ts
  const voiceoverScenes = buildVoiceoverScenes(transcript.scenes, manifest);
  const voiceoverCode = generateVoiceoverModule(voiceoverScenes);
  const voiceoverPath = join(videoDir, "voiceover.ts");
  writeFileSync(voiceoverPath, voiceoverCode);

  console.log(`Voiceover module written to ${voiceoverPath}`);
  console.log(
    `\nDone! ${synthesized} synthesized, ${skipped} skipped (no narration).`,
  );
  console.log(`\nNext: Add VoiceoverLayer to ${videoName}/index.tsx`);
}

function generateVoiceoverModule(scenes: VoiceoverScene[]): string {
  const lines = [
    `import type { VoiceoverScene } from "../shared/components/VoiceoverLayer";`,
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
  lines.push(``);

  return lines.join("\n");
}

main();
