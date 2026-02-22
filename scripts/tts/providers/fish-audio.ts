import { readFileSync } from "node:fs";
import type { TTSProvider, TTSRequest, TTSResult } from "../types.ts";
import { getAudioDuration } from "../utils.ts";
import { writeFileSync } from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";

const API_BASE = "https://api.fish.audio";

export class FishAudioProvider implements TTSProvider {
  readonly name = "fish-audio";
  private apiKey: string;
  private model: string;

  constructor() {
    const key = process.env.FISH_AUDIO_API_KEY;
    if (!key) throw new Error("FISH_AUDIO_API_KEY is not set in environment");
    this.apiKey = key;
    this.model = process.env.FISH_AUDIO_MODEL ?? "s1";
  }

  async synthesize(request: TTSRequest): Promise<TTSResult> {
    const speed = request.speed ?? parseFloat(process.env.FISH_AUDIO_SPEED ?? "1.0");

    // Prepend emotion tag for S1 model if provided
    const text =
      request.emotion && this.model === "s1"
        ? `${request.emotion} ${request.text}`
        : request.text;

    const body = {
      text,
      reference_id: request.voiceId,
      format: request.format ?? "mp3",
      prosody: { speed },
      latency: "normal",
      mp3_bitrate: 128,
    };

    const response = await fetch(`${API_BASE}/v1/tts`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${this.apiKey}`,
        "Content-Type": "application/json",
        "model": this.model,
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `Fish Audio TTS failed (${response.status}): ${errorText}`,
      );
    }

    // Collect streaming response into buffer
    const chunks: Uint8Array[] = [];
    const reader = response.body?.getReader();
    if (!reader) throw new Error("No response body from Fish Audio");

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      chunks.push(value);
    }

    const audioBuffer = Buffer.concat(chunks);

    // Write to temp file to measure duration
    const tmpPath = join(tmpdir(), `fish-tts-${Date.now()}.mp3`);
    writeFileSync(tmpPath, audioBuffer);
    const durationSeconds = getAudioDuration(tmpPath);

    return { audioBuffer, durationSeconds };
  }

  async cloneVoice(audioFilePath: string, name: string): Promise<string> {
    const audioData = readFileSync(audioFilePath);

    const formData = new FormData();
    formData.append("name", name);
    formData.append("description", `Voice clone: ${name}`);
    formData.append(
      "voices",
      new Blob([audioData], { type: "audio/mpeg" }),
      "voice-sample.mp3",
    );

    const response = await fetch(`${API_BASE}/model`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${this.apiKey}`,
      },
      body: formData,
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `Fish Audio voice clone failed (${response.status}): ${errorText}`,
      );
    }

    const data = (await response.json()) as { _id: string };
    return data._id;
  }
}
