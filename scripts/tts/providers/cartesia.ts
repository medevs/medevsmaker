import type { TTSProvider, TTSRequest, TTSResult } from "../types.ts";
import { getAudioDuration } from "../utils.ts";
import { readFileSync, writeFileSync, unlinkSync } from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { execSync } from "node:child_process";

const API_BASE = "https://api.cartesia.ai";

/** Check if ffmpeg is available on the system. Cached after first check. */
let ffmpegAvailable: boolean | null = null;
function hasFfmpeg(): boolean {
  if (ffmpegAvailable !== null) return ffmpegAvailable;
  try {
    execSync("ffmpeg -version", { stdio: "ignore" });
    ffmpegAvailable = true;
  } catch {
    ffmpegAvailable = false;
  }
  return ffmpegAvailable;
}

/**
 * Prepend 100ms of silence to an MP3 file to prevent first-word cutoff.
 * Cartesia returns audio with no leading silence, and MP3 frame encoding
 * clips the first few milliseconds on playback.
 * Returns the padded buffer, or the original buffer if ffmpeg is unavailable.
 */
function prependSilence(audioBuffer: Buffer): Buffer {
  if (!hasFfmpeg()) {
    console.warn(
      "[WARNING] ffmpeg not found — skipping silence padding. First words may be clipped.",
    );
    console.warn(
      "  Install ffmpeg (https://ffmpeg.org/) to fix first-word cutoff.",
    );
    return audioBuffer;
  }

  const ts = Date.now();
  const inputPath = join(tmpdir(), `cartesia-raw-${ts}.mp3`);
  const outputPath = join(tmpdir(), `cartesia-padded-${ts}.mp3`);

  try {
    writeFileSync(inputPath, audioBuffer);
    // Use adelay filter to prepend 100ms silence.
    // The anullsrc+concat approach hangs on Windows due to infinite source issues.
    execSync(
      `ffmpeg -y -i "${inputPath}" -af "adelay=100|100" "${outputPath}"`,
      { stdio: "ignore", timeout: 10000 },
    );
    const padded = readFileSync(outputPath);
    return Buffer.from(padded);
  } catch (err) {
    console.warn(
      `[WARNING] ffmpeg silence padding failed — using raw audio. ${err}`,
    );
    return audioBuffer;
  } finally {
    try { unlinkSync(inputPath); } catch {}
    try { unlinkSync(outputPath); } catch {}
  }
}

export class CartesiaProvider implements TTSProvider {
  readonly name = "cartesia";
  private apiKey: string;
  private model: string;
  private speed: string | undefined;
  private emotion: string | undefined;

  constructor() {
    const key = process.env.CARTESIA_API_KEY;
    if (!key) throw new Error("CARTESIA_API_KEY is not set in environment");
    this.apiKey = key;
    this.model = process.env.CARTESIA_MODEL ?? "sonic-3";
    this.speed = process.env.CARTESIA_SPEED || undefined;
    this.emotion = process.env.CARTESIA_EMOTION || undefined;
  }

  async synthesize(request: TTSRequest): Promise<TTSResult> {
    const body: Record<string, unknown> = {
      model_id: this.model,
      transcript: request.text,
      voice: {
        mode: "id",
        id: request.voiceId,
      },
      output_format: {
        container: "mp3",
        sample_rate: 44100,
        bit_rate: 128000,
      },
      language: "en",
    };

    // generation_config: only supported on sonic-3.
    // sonic-2's speed parameter is experimental and unreliable.
    if (this.model.startsWith("sonic-3")) {
      const genConfig: Record<string, unknown> = {};

      // Speed: default 0.95 for slightly slower, more polished narration
      const speedVal = this.speed ? parseFloat(this.speed) : 0.95;
      if (!isNaN(speedVal)) {
        genConfig.speed = speedVal;
      }

      // Emotion: optional, e.g. "neutral", "happy", "sad", "angry"
      if (this.emotion) {
        genConfig.emotion = this.emotion;
      }

      if (Object.keys(genConfig).length > 0) {
        body.generation_config = genConfig;
      }
    }

    const response = await fetch(`${API_BASE}/tts/bytes`, {
      method: "POST",
      headers: {
        "Cartesia-Version": "2025-04-16",
        "X-API-Key": this.apiKey,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `Cartesia TTS failed (${response.status}): ${errorText}`,
      );
    }

    const arrayBuffer = await response.arrayBuffer();
    let audioBuffer = Buffer.from(arrayBuffer);

    // Validate minimum response size (empty/error responses are tiny)
    if (audioBuffer.byteLength < 1000) {
      throw new Error(
        `Cartesia returned suspiciously small audio (${audioBuffer.byteLength} bytes) ` +
        `for: "${request.text.slice(0, 60)}..."`,
      );
    }

    // Prepend 100ms silence to prevent first-word cutoff
    audioBuffer = prependSilence(audioBuffer) as Buffer<ArrayBuffer>;

    // Write to temp file to measure duration, then clean up
    const tmpPath = join(tmpdir(), `cartesia-tts-${Date.now()}.mp3`);
    writeFileSync(tmpPath, audioBuffer);
    const durationSeconds = getAudioDuration(tmpPath);
    try { unlinkSync(tmpPath); } catch {}

    // Validate minimum duration (catches silent/corrupt audio)
    if (durationSeconds < 0.3) {
      throw new Error(
        `Cartesia returned near-silent audio (${durationSeconds.toFixed(2)}s) ` +
        `for: "${request.text.slice(0, 60)}..."`,
      );
    }

    return { audioBuffer, durationSeconds };
  }

  async cloneVoice(audioFilePath: string, name: string): Promise<string> {
    const audioData = readFileSync(audioFilePath);

    const formData = new FormData();
    formData.append(
      "clip",
      new Blob([audioData], { type: "audio/mpeg" }),
      "voice-sample.mp3",
    );
    formData.append("name", name);
    formData.append("language", "en");

    const response = await fetch(`${API_BASE}/voices/clone`, {
      method: "POST",
      headers: {
        "Cartesia-Version": "2025-04-16",
        "X-API-Key": this.apiKey,
      },
      body: formData,
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `Cartesia voice clone failed (${response.status}): ${errorText}`,
      );
    }

    const data = (await response.json()) as { id: string };
    return data.id;
  }
}
