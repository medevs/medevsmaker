import type { TTSProvider, TTSRequest, TTSResult } from "../types.ts";
import { getAudioDuration } from "../utils.ts";
import { readFileSync, unlinkSync, mkdirSync } from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { execSync } from "node:child_process";

/**
 * Kokoro TTS provider — free, local, CPU-based. Ranked #2 on TTS Arena.
 * Uses kokoro-js (ONNX) — no API key, no GPU, ~86MB model (cached after first run).
 *
 * Good voices for narration:
 *   af_heart   — warm female, natural (top-rated)
 *   af_bella   — clear female, bright
 *   am_michael — confident male
 *   am_puck    — casual male
 *   am_fenrir  — deep male
 *   bf_emma    — classic British female
 *   bm_george  — authoritative British male
 *
 * Env vars:
 *   KOKORO_VOICE — voice ID (default: af_heart)
 *   KOKORO_SPEED — speed multiplier (default: 1.0)
 *   KOKORO_MODEL — ONNX model repo (default: onnx-community/Kokoro-82M-v1.0-ONNX)
 *   KOKORO_DTYPE — quantization: fp32, fp16, q8, q4, q4f16 (default: q8)
 */
export class KokoroProvider implements TTSProvider {
  readonly name = "kokoro";
  private voice: string;
  private speed: number;
  private modelId: string;
  private dtype: string;
  private ttsInstance: any | null = null;

  constructor() {
    this.voice = process.env.KOKORO_VOICE ?? "af_heart";
    this.speed = parseFloat(process.env.KOKORO_SPEED ?? "1.0");
    this.modelId = process.env.KOKORO_MODEL ?? "onnx-community/Kokoro-82M-v1.0-ONNX";
    this.dtype = process.env.KOKORO_DTYPE ?? "q8";
  }

  private async getTTS() {
    if (!this.ttsInstance) {
      console.log(`  Kokoro: Loading model (${this.dtype})... first run downloads ~86MB`);
      const { KokoroTTS } = await import("kokoro-js");
      this.ttsInstance = await KokoroTTS.from_pretrained(this.modelId, {
        dtype: this.dtype,
        device: "cpu",
      });
      console.log("  Kokoro: Model loaded.");
    }
    return this.ttsInstance;
  }

  async synthesize(request: TTSRequest): Promise<TTSResult> {
    const voice = request.voiceId || this.voice;
    const speed = request.speed ?? this.speed;

    const tts = await this.getTTS();
    const audio = await tts.generate(request.text, { voice, speed });

    // Save WAV to temp, convert to MP3 via ffmpeg
    const tmpDir = join(tmpdir(), `kokoro-${Date.now()}`);
    mkdirSync(tmpDir, { recursive: true });
    const wavPath = join(tmpDir, "audio.wav");
    const mp3Path = join(tmpDir, "audio.mp3");

    await audio.save(wavPath);

    execSync(`ffmpeg -y -i "${wavPath}" -b:a 128k "${mp3Path}"`, {
      stdio: "pipe",
    });

    const audioBuffer = readFileSync(mp3Path);
    const durationSeconds = getAudioDuration(mp3Path);

    // Clean up
    try { unlinkSync(wavPath); } catch {}
    try { unlinkSync(mp3Path); } catch {}

    return { audioBuffer, durationSeconds };
  }
}
