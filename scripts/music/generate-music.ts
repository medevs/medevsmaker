/**
 * Background Music Generation — Generate or integrate background music for a video.
 *
 * Usage:
 *   node --experimental-strip-types --env-file=.env scripts/music/generate-music.ts <VideoName>
 *   node --experimental-strip-types --env-file=.env scripts/music/generate-music.ts <VideoName> --manual
 *   node --experimental-strip-types --env-file=.env scripts/music/generate-music.ts <VideoName> --prompt "dark ambient"
 *   node --experimental-strip-types --env-file=.env scripts/music/generate-music.ts <VideoName> --volume 0.25
 *   node --experimental-strip-types --env-file=.env scripts/music/generate-music.ts <VideoName> --no-loop
 *
 * Reads manifest.json + script.json for mood, generates music via ElevenLabs,
 * writes MP3 to public/music/<VideoName>/, and generates src/videos/<VideoName>/music.ts.
 */

import { readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import { join } from "node:path";
import type { VideoManifest, VideoScript } from "../tts/types.ts";
import { genreFromTones, DEFAULT_GENRE } from "./types.ts";

const ELEVENLABS_MUSIC_URL = "https://api.elevenlabs.io/v1/music";

// ─── Defaults ──────────────────────────────────────────────
const DEFAULT_VOLUME = 0.2;
const DEFAULT_DUCK_VOLUME = 0.06;
const DEFAULT_FADE_IN_FRAMES = 30; // 1s at 30fps
const DEFAULT_FADE_OUT_FRAMES = 60; // 2s at 30fps
const DEFAULT_DUCK_RAMP_FRAMES = 15; // 0.5s at 30fps

// ─── CLI Parsing ───────────────────────────────────────────

function parseArgs(argv: string[]) {
  const args = argv.slice(2);
  const flags = {
    manual: false,
    prompt: "",
    volume: parseFloat(process.env.MUSIC_VOLUME ?? String(DEFAULT_VOLUME)),
    duckVolume: parseFloat(process.env.MUSIC_DUCK_VOLUME ?? String(DEFAULT_DUCK_VOLUME)),
    noLoop: false,
    videoName: "",
  };

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if (arg === "--manual") {
      flags.manual = true;
    } else if (arg === "--prompt" && args[i + 1]) {
      flags.prompt = args[++i];
    } else if (arg === "--volume" && args[i + 1]) {
      flags.volume = parseFloat(args[++i]);
    } else if (arg === "--duck" && args[i + 1]) {
      flags.duckVolume = parseFloat(args[++i]);
    } else if (arg === "--no-loop") {
      flags.noLoop = true;
    } else if (!arg.startsWith("--")) {
      flags.videoName = arg;
    }
  }

  return flags;
}

// ─── Mood Extraction ───────────────────────────────────────

function buildMusicPrompt(
  manifest: VideoManifest,
  script: VideoScript | null,
  overridePrompt: string,
): string {
  if (overridePrompt) {
    return `${overridePrompt}, instrumental`;
  }

  // Collect section tones from script or manifest
  const tones: string[] = [];

  if (script) {
    for (const section of script.sections) {
      if (section.sectionTone) tones.push(section.sectionTone);
    }
  } else {
    for (const section of manifest.sections) {
      if (section.sectionTone) tones.push(section.sectionTone);
    }
  }

  const genre = genreFromTones(tones);
  const moodSummary = tones.length > 0
    ? tones.slice(0, 3).join(", ")
    : "focused and engaging";

  return `${genre} background music, ${moodSummary} mood, medium tempo, instrumental only, suitable for a tech explainer video`;
}

// ─── ElevenLabs Music API ──────────────────────────────────

async function generateWithElevenLabs(
  prompt: string,
  durationMs: number,
): Promise<Buffer> {
  const apiKey = process.env.ELEVENLABS_API_KEY;
  if (!apiKey) {
    throw new Error(
      "ELEVENLABS_API_KEY is not set. Use --manual to skip generation.",
    );
  }

  // Clamp duration to API limits (3s–600s)
  const clampedMs = Math.max(3000, Math.min(600000, durationMs));

  console.log(`  Calling ElevenLabs Music API...`);
  console.log(`  Prompt: "${prompt}"`);
  console.log(`  Duration: ${(clampedMs / 1000).toFixed(0)}s`);

  const response = await fetch(
    `${ELEVENLABS_MUSIC_URL}?output_format=mp3_44100_128`,
    {
      method: "POST",
      headers: {
        "xi-api-key": apiKey,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        prompt,
        music_length_ms: clampedMs,
        model_id: "music_v1",
        force_instrumental: true,
      }),
    },
  );

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(
      `ElevenLabs Music API failed (${response.status}): ${errorText}`,
    );
  }

  const arrayBuffer = await response.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  if (buffer.byteLength < 5000) {
    throw new Error(
      `ElevenLabs returned suspiciously small audio (${buffer.byteLength} bytes)`,
    );
  }

  return buffer;
}

// ─── Voiceover Scenes Parsing ──────────────────────────────
// Parse VOICEOVER_SCENES from the generated voiceover.ts file.

type VoiceoverRegion = {
  fromFrame: number;
  durationInFrames: number;
};

function parseVoiceoverScenes(voiceoverPath: string): VoiceoverRegion[] {
  if (!existsSync(voiceoverPath)) return [];

  const content = readFileSync(voiceoverPath, "utf-8");
  const regions: VoiceoverRegion[] = [];

  // Match { src: "...", fromFrame: N, durationInFrames: N }
  const regex = /fromFrame:\s*(\d+),\s*\n\s*durationInFrames:\s*(\d+)/g;
  let match;
  while ((match = regex.exec(content)) !== null) {
    regions.push({
      fromFrame: parseInt(match[1], 10),
      durationInFrames: parseInt(match[2], 10),
    });
  }

  return regions;
}

// ─── Code Generation ───────────────────────────────────────

function generateMusicModule(
  src: string,
  durationInFrames: number,
  volume: number,
  duckVolume: number,
  loop: boolean,
): string {
  const lines = [
    `import type { MusicConfig } from "../../shared/components/BackgroundMusicLayer";`,
    ``,
    `export const MUSIC_CONFIG: MusicConfig = {`,
    `  src: "${src}",`,
    `  durationInFrames: ${durationInFrames},`,
    `  volume: ${volume},`,
    `  duckVolume: ${duckVolume},`,
    `  fadeInFrames: ${DEFAULT_FADE_IN_FRAMES},`,
    `  fadeOutFrames: ${DEFAULT_FADE_OUT_FRAMES},`,
    `  duckRampFrames: ${DEFAULT_DUCK_RAMP_FRAMES},`,
    `  loop: ${loop},`,
    `};`,
    ``,
  ];

  return lines.join("\n");
}

// ─── Main ──────────────────────────────────────────────────

async function main() {
  const flags = parseArgs(process.argv);

  if (!flags.videoName) {
    console.error("Usage: generate-music <VideoName> [--manual] [--prompt '...'] [--volume 0.20] [--no-loop]");
    process.exit(1);
  }

  const rootDir = join(import.meta.dirname, "..", "..");
  const videoDir = join(rootDir, "src", "videos", flags.videoName);
  const manifestPath = join(videoDir, "manifest.json");
  const scriptPath = join(videoDir, "script.json");
  const voiceoverPath = join(videoDir, "voiceover.ts");
  const musicDir = join(rootDir, "public", "music", flags.videoName);
  const musicFilePath = join(musicDir, "background.mp3");
  const musicRelativePath = `music/${flags.videoName}/background.mp3`;

  // ─── Prerequisites ─────────────────────────────────────
  if (!existsSync(manifestPath)) {
    console.error(`No manifest.json found at ${manifestPath}`);
    console.error(`Run /video ${flags.videoName} first.`);
    process.exit(1);
  }

  const manifestRaw = JSON.parse(readFileSync(manifestPath, "utf-8"));
  const manifest: VideoManifest = manifestRaw;
  // Handle both field names (totalFrames in type, totalDurationFrames in some manifests)
  const totalFrames = manifest.totalFrames ?? manifestRaw.totalDurationFrames ?? 0;
  const fps = manifest.fps;
  const totalSeconds = totalFrames / fps;

  let script: VideoScript | null = null;
  if (existsSync(scriptPath)) {
    script = JSON.parse(readFileSync(scriptPath, "utf-8"));
  }

  console.log(`\n─── Music Generation: ${flags.videoName} ───`);
  console.log(`  Video: ${totalFrames} frames, ${fps}fps, ${totalSeconds.toFixed(1)}s`);

  // Check for voiceover data
  const voiceoverRegions = parseVoiceoverScenes(voiceoverPath);
  if (voiceoverRegions.length > 0) {
    console.log(`  Voiceover: ${voiceoverRegions.length} scenes (ducking enabled)`);
  } else {
    console.log(`  Voiceover: none found (no ducking)`);
  }

  // ─── Generate or Use Manual ────────────────────────────
  mkdirSync(musicDir, { recursive: true });

  if (flags.manual) {
    if (!existsSync(musicFilePath)) {
      console.error(`\n  --manual specified but no file found at:`);
      console.error(`  ${musicFilePath}`);
      console.error(`\n  Place your MP3 file there and re-run.`);
      process.exit(1);
    }
    console.log(`\n  Using manual file: ${musicFilePath}`);
  } else {
    const prompt = buildMusicPrompt(manifest, script, flags.prompt);
    const durationMs = Math.round(totalSeconds * 1000);

    try {
      const audioBuffer = await generateWithElevenLabs(prompt, durationMs);
      writeFileSync(musicFilePath, audioBuffer);
      const sizeKB = (audioBuffer.byteLength / 1024).toFixed(0);
      console.log(`\n  ✓ Music generated: ${musicFilePath} (${sizeKB}KB)`);
    } catch (err) {
      console.error(`\n  ✗ Generation failed: ${(err as Error).message}`);
      console.error(`\n  Fallback: place an MP3 at ${musicFilePath} and re-run with --manual`);
      process.exit(1);
    }
  }

  // ─── Generate music.ts ─────────────────────────────────
  const loop = !flags.noLoop;
  const musicCode = generateMusicModule(
    musicRelativePath,
    totalFrames,
    flags.volume,
    flags.duckVolume,
    loop,
  );
  const musicTsPath = join(videoDir, "music.ts");
  writeFileSync(musicTsPath, musicCode);
  console.log(`  ✓ Music module: ${musicTsPath}`);

  // ─── Summary ───────────────────────────────────────────
  console.log(`\n─── Summary ───`);
  console.log(`  Source: ${musicRelativePath}`);
  console.log(`  Volume: ${flags.volume} (base), ${flags.duckVolume} (ducked)`);
  console.log(`  Loop: ${loop}`);
  console.log(`  Ducking: ${voiceoverRegions.length > 0 ? "enabled" : "disabled (no voiceover)"}`);

  console.log(`\n─── Next Steps ───`);
  console.log(`  1. Add BackgroundMusicLayer to ${flags.videoName}/index.tsx:`);
  console.log(`     import { BackgroundMusicLayer } from "../../shared/components/BackgroundMusicLayer";`);
  console.log(`     import { MUSIC_CONFIG } from "./music";`);
  console.log(`     // Add after VoiceoverLayer:`);
  console.log(`     <BackgroundMusicLayer config={MUSIC_CONFIG} voiceoverScenes={VOICEOVER_SCENES} />`);
  console.log(`\n  2. Preview: npx remotion studio`);
  console.log(`  3. Render: npx remotion render ${flags.videoName}`);
}

main();
