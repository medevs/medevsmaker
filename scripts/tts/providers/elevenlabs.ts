import type { TTSProvider, TTSRequest, TTSResult, WordTimestamp } from "../types.ts";
import { getAudioDuration } from "../utils.ts";
import { readFileSync, writeFileSync, unlinkSync } from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";

const API_BASE = "https://api.elevenlabs.io/v1";

export class ElevenLabsProvider implements TTSProvider {
  readonly name = "elevenlabs";
  private apiKey: string;
  private model: string;
  private stability: number;
  private similarityBoost: number;
  private style: number;
  private speed: number;
  private useTimestamps: boolean;

  constructor() {
    const key = process.env.ELEVENLABS_API_KEY;
    if (!key) throw new Error("ELEVENLABS_API_KEY is not set in environment");
    this.apiKey = key;
    this.model = process.env.ELEVENLABS_MODEL ?? "eleven_multilingual_v2";
    this.stability = parseFloat(process.env.ELEVENLABS_STABILITY ?? "0.5");
    this.similarityBoost = parseFloat(process.env.ELEVENLABS_SIMILARITY ?? "0.75");
    this.style = parseFloat(process.env.ELEVENLABS_STYLE ?? "0.0");
    this.speed = parseFloat(process.env.ELEVENLABS_SPEED ?? "1.0");
    this.useTimestamps =
      (process.env.ELEVENLABS_TIMESTAMPS ?? "true").toLowerCase() === "true";
  }

  async synthesize(request: TTSRequest): Promise<TTSResult> {
    const voiceId = request.voiceId;
    if (!voiceId) {
      throw new Error(
        "ElevenLabs requires a voice ID. Set ELEVENLABS_VOICE_ID in .env",
      );
    }

    const body = {
      text: request.text,
      model_id: this.model,
      output_format: "mp3_44100_128",
      voice_settings: {
        stability: this.stability,
        similarity_boost: this.similarityBoost,
        style: this.style,
        speed: this.speed,
      },
    };

    const url = this.useTimestamps
      ? `${API_BASE}/text-to-speech/${voiceId}/with-timestamps`
      : `${API_BASE}/text-to-speech/${voiceId}`;

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "xi-api-key": this.apiKey,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `ElevenLabs TTS failed (${response.status}): ${errorText}`,
      );
    }

    let audioBuffer: Buffer;
    let wordTimestamps: WordTimestamp[] | undefined;

    if (this.useTimestamps) {
      const data = (await response.json()) as {
        audio_base64: string;
        alignment: {
          characters: string[];
          character_start_times_seconds: number[];
          character_end_times_seconds: number[];
        };
      };
      audioBuffer = Buffer.from(data.audio_base64, "base64");
      wordTimestamps = this.parseCharacterAlignment(data.alignment);
    } else {
      const arrayBuffer = await response.arrayBuffer();
      audioBuffer = Buffer.from(arrayBuffer);
    }

    // Validate minimum response size (empty/error responses are tiny)
    if (audioBuffer.byteLength < 1000) {
      throw new Error(
        `ElevenLabs returned suspiciously small audio (${audioBuffer.byteLength} bytes) ` +
        `for: "${request.text.slice(0, 60)}..."`,
      );
    }

    // Write to temp file to measure duration, then clean up
    const tmpPath = join(tmpdir(), `elevenlabs-tts-${Date.now()}.mp3`);
    writeFileSync(tmpPath, audioBuffer);
    const durationSeconds = getAudioDuration(tmpPath);
    try { unlinkSync(tmpPath); } catch {}

    // Validate minimum duration (catches silent/corrupt audio)
    if (durationSeconds < 0.3) {
      throw new Error(
        `ElevenLabs returned near-silent audio (${durationSeconds.toFixed(2)}s) ` +
        `for: "${request.text.slice(0, 60)}..."`,
      );
    }

    return { audioBuffer, durationSeconds, wordTimestamps };
  }

  private parseCharacterAlignment(alignment: {
    characters: string[];
    character_start_times_seconds: number[];
    character_end_times_seconds: number[];
  }): WordTimestamp[] {
    const words: WordTimestamp[] = [];
    let currentWord = "";
    let wordStartMs = 0;
    let wordEndMs = 0;

    for (let i = 0; i < alignment.characters.length; i++) {
      const char = alignment.characters[i];
      const charStartMs = alignment.character_start_times_seconds[i] * 1000;
      const charEndMs = alignment.character_end_times_seconds[i] * 1000;

      if (char === " ") {
        if (currentWord.length > 0) {
          words.push({ word: currentWord, startMs: wordStartMs, endMs: wordEndMs });
          currentWord = "";
        }
      } else {
        if (currentWord.length === 0) {
          wordStartMs = charStartMs;
        }
        currentWord += char;
        wordEndMs = charEndMs;
      }
    }

    // Push the last word if any
    if (currentWord.length > 0) {
      words.push({ word: currentWord, startMs: wordStartMs, endMs: wordEndMs });
    }

    return words;
  }

  async cloneVoice(audioFilePath: string, name: string): Promise<string> {
    const audioData = readFileSync(audioFilePath);

    const formData = new FormData();
    formData.append("name", name);
    formData.append(
      "files",
      new Blob([audioData], { type: "audio/mpeg" }),
      "voice-sample.mp3",
    );

    const response = await fetch(`${API_BASE}/voices/add`, {
      method: "POST",
      headers: {
        "xi-api-key": this.apiKey,
      },
      body: formData,
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `ElevenLabs voice clone failed (${response.status}): ${errorText}`,
      );
    }

    const data = (await response.json()) as { voice_id: string };
    return data.voice_id;
  }
}
