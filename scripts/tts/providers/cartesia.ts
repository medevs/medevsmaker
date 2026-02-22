import type { TTSProvider, TTSRequest, TTSResult } from "../types.ts";
import { getAudioDuration } from "../utils.ts";
import { readFileSync, writeFileSync, unlinkSync } from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";

const API_BASE = "https://api.cartesia.ai";

export class CartesiaProvider implements TTSProvider {
  readonly name = "cartesia";
  private apiKey: string;
  private model: string;
  private speed: string;

  constructor() {
    const key = process.env.CARTESIA_API_KEY;
    if (!key) throw new Error("CARTESIA_API_KEY is not set in environment");
    this.apiKey = key;
    this.model = process.env.CARTESIA_MODEL ?? "sonic-2";
    this.speed = process.env.CARTESIA_SPEED ?? "normal";
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

    // Speed control: only reliable on sonic-3 via generation_config.
    // Sonic-2's legacy `speed` parameter is experimental and unreliable —
    // it overcorrects slow sentences into overflow while barely affecting fast ones.
    if (this.model.startsWith("sonic-3") && this.speed) {
      const numericSpeed = parseFloat(this.speed);
      if (!isNaN(numericSpeed)) {
        body.generation_config = { speed: numericSpeed };
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
    const audioBuffer = Buffer.from(arrayBuffer);

    // Validate minimum response size (empty/error responses are tiny)
    if (audioBuffer.byteLength < 1000) {
      throw new Error(
        `Cartesia returned suspiciously small audio (${audioBuffer.byteLength} bytes) ` +
        `for: "${request.text.slice(0, 60)}..."`,
      );
    }

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
