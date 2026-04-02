import { MsEdgeTTS, OUTPUT_FORMAT } from "msedge-tts";
import type { TTSProvider, TTSRequest, TTSResult } from "../types.ts";
import { getAudioDuration } from "../utils.ts";
import { readFileSync, unlinkSync, mkdirSync } from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";

/**
 * Edge TTS provider — uses Microsoft Edge's Read Aloud service via msedge-tts.
 * Completely free, unlimited, no API key required.
 * No voice cloning, but has 400+ high-quality neural voices.
 *
 * Good voices for narration:
 *   en-US-AndrewNeural     — warm male, conversational
 *   en-US-GuyNeural        — confident male, professional
 *   en-US-ChristopherNeural — clear male, educational
 *   en-US-AriaNeural       — friendly female, versatile
 *   en-US-JennyNeural      — natural female, narration
 */
export class EdgeTTSProvider implements TTSProvider {
  readonly name = "edge-tts";
  private voice: string;
  private rate: string;

  constructor() {
    this.voice = process.env.EDGE_TTS_VOICE ?? "en-US-AndrewNeural";
    const speed = parseFloat(process.env.EDGE_TTS_SPEED ?? "1.0");
    const pct = Math.round((speed - 1) * 100);
    this.rate = pct >= 0 ? `+${pct}%` : `${pct}%`;
  }

  async synthesize(request: TTSRequest): Promise<TTSResult> {
    const voice = request.voiceId || this.voice;

    const tts = new MsEdgeTTS();
    await tts.setMetadata(voice, OUTPUT_FORMAT.AUDIO_24KHZ_96KBITRATE_MONO_MP3);

    // msedge-tts writes to a directory as audio.<ext> based on format
    const tmpDir = join(tmpdir(), `edge-tts-${Date.now()}`);
    mkdirSync(tmpDir, { recursive: true });

    await tts.toFile(tmpDir, request.text);

    const audioPath = join(tmpDir, "audio.mp3");
    const audioBuffer = readFileSync(audioPath);
    const durationSeconds = getAudioDuration(audioPath);

    // Clean up temp file
    try { unlinkSync(audioPath); } catch {}

    return { audioBuffer, durationSeconds };
  }
}
