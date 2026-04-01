import type { TTSProvider, TTSRequest, TTSResult, WordTimestamp } from "../types.ts";
import { getAudioDuration } from "../utils.ts";
import { readFileSync, writeFileSync, unlinkSync } from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { execSync } from "node:child_process";
import { randomUUID } from "node:crypto";

const API_BASE = "https://api.cartesia.ai";
const WS_BASE = "wss://api.cartesia.ai/tts/websocket";
const CARTESIA_VERSION = "2025-04-16";
const SILENCE_PADDING_MS = 100;

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

/**
 * Convert raw PCM (f32le, 44100Hz) to MP3 via ffmpeg.
 * Returns the MP3 buffer, or throws if ffmpeg is unavailable.
 */
function pcmToMp3(pcmBuffer: Buffer, sampleRate = 44100): Buffer {
  if (!hasFfmpeg()) {
    throw new Error("ffmpeg is required for WebSocket PCM→MP3 conversion");
  }

  const ts = Date.now();
  const inputPath = join(tmpdir(), `cartesia-pcm-${ts}.raw`);
  const outputPath = join(tmpdir(), `cartesia-pcm-${ts}.mp3`);

  try {
    writeFileSync(inputPath, pcmBuffer);
    execSync(
      `ffmpeg -y -f f32le -ar ${sampleRate} -ac 1 -i "${inputPath}" -b:a 128k "${outputPath}"`,
      { stdio: "ignore", timeout: 15000 },
    );
    const mp3 = readFileSync(outputPath);
    return Buffer.from(mp3);
  } finally {
    try { unlinkSync(inputPath); } catch {}
    try { unlinkSync(outputPath); } catch {}
  }
}

/**
 * Resolve a WebSocket constructor. Prefers the Node.js built-in (Node 22+),
 * falls back to the `ws` npm package.
 */
async function getWebSocket(): Promise<typeof WebSocket> {
  if (typeof globalThis.WebSocket !== "undefined") {
    return globalThis.WebSocket;
  }
  try {
    // Dynamic import for the `ws` package as fallback
    const ws = await import("ws");
    return ws.default as unknown as typeof WebSocket;
  } catch {
    throw new Error(
      "No WebSocket implementation found. Use Node 22+ or install `ws` package.",
    );
  }
}

export class CartesiaProvider implements TTSProvider {
  readonly name = "cartesia";
  private apiKey: string;
  private model: string;
  private speed: string | undefined;
  private emotion: string | undefined;
  private useTimestamps: boolean;

  constructor() {
    const key = process.env.CARTESIA_API_KEY;
    if (!key) throw new Error("CARTESIA_API_KEY is not set in environment");
    this.apiKey = key;
    this.model = process.env.CARTESIA_MODEL ?? "sonic-3";
    this.speed = process.env.CARTESIA_SPEED || undefined;
    this.emotion = process.env.CARTESIA_EMOTION || undefined;
    this.useTimestamps = (process.env.CARTESIA_TIMESTAMPS ?? "true") === "true";
  }

  async synthesize(request: TTSRequest): Promise<TTSResult> {
    // Try WebSocket synthesis with word timestamps when enabled
    if (this.useTimestamps) {
      try {
        return await this.synthesizeWithTimestamps(request);
      } catch (err) {
        console.warn(
          `[WARNING] Cartesia WebSocket synthesis failed, falling back to HTTP: ${err}`,
        );
      }
    }

    return this.synthesizeHttp(request);
  }

  /** Original HTTP-based synthesis via tts/bytes (no timestamps). */
  private async synthesizeHttp(request: TTSRequest): Promise<TTSResult> {
    const body = this.buildRequestBody(request);

    const response = await fetch(`${API_BASE}/tts/bytes`, {
      method: "POST",
      headers: {
        "Cartesia-Version": CARTESIA_VERSION,
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

  /**
   * WebSocket-based synthesis that returns word-level timestamps.
   * Connects to Cartesia's WebSocket API, collects PCM audio chunks
   * and timestamp data, converts PCM→MP3, prepends silence, and
   * offsets all timestamps by SILENCE_PADDING_MS.
   */
  private async synthesizeWithTimestamps(request: TTSRequest): Promise<TTSResult> {
    const WS = await getWebSocket();
    const url = `${WS_BASE}?api_key=${this.apiKey}&cartesia_version=${CARTESIA_VERSION}`;
    const contextId = randomUUID();

    const body = this.buildRequestBody(request);
    const wsMessage = {
      ...body,
      output_format: {
        container: "raw",
        sample_rate: 44100,
        encoding: "pcm_f32le",
      },
      word_timestamps: true,
      context_id: contextId,
    };

    return new Promise<TTSResult>((resolve, reject) => {
      const ws = new WS(url);
      const audioChunks: Buffer[] = [];
      const collectedWords: string[] = [];
      const collectedStarts: number[] = [];
      const collectedEnds: number[] = [];
      let settled = false;

      const timeout = setTimeout(() => {
        if (!settled) {
          settled = true;
          try { ws.close(); } catch {}
          reject(new Error("Cartesia WebSocket timed out after 30s"));
        }
      }, 30000);

      ws.onopen = () => {
        ws.send(JSON.stringify(wsMessage));
      };

      ws.onerror = (event: Event) => {
        if (!settled) {
          settled = true;
          clearTimeout(timeout);
          reject(new Error(`Cartesia WebSocket error: ${event}`));
        }
      };

      ws.onclose = (event: CloseEvent) => {
        if (!settled) {
          settled = true;
          clearTimeout(timeout);
          reject(new Error(
            `Cartesia WebSocket closed unexpectedly (code=${event.code}, reason=${event.reason})`,
          ));
        }
      };

      ws.onmessage = (event: MessageEvent) => {
        try {
          const msg = JSON.parse(String(event.data)) as {
            type: string;
            data?: string;
            word_timestamps?: {
              words: string[];
              start: number[];
              end: number[];
            };
            status_code?: number;
            done?: boolean;
          };

          if (msg.type === "chunk") {
            // Collect audio data
            if (msg.data) {
              audioChunks.push(Buffer.from(msg.data, "base64"));
            }
            // Some implementations send timestamps inline with chunks
            if (msg.word_timestamps) {
              collectedWords.push(...msg.word_timestamps.words);
              collectedStarts.push(...msg.word_timestamps.start);
              collectedEnds.push(...msg.word_timestamps.end);
            }
          } else if (msg.type === "timestamps") {
            if (msg.word_timestamps) {
              collectedWords.push(...msg.word_timestamps.words);
              collectedStarts.push(...msg.word_timestamps.start);
              collectedEnds.push(...msg.word_timestamps.end);
            }
          } else if (msg.type === "done") {
            if (settled) return;
            settled = true;
            clearTimeout(timeout);
            try { ws.close(); } catch {}

            // Process collected data
            this.finalizeWebSocketResult(audioChunks, collectedWords, collectedStarts, collectedEnds, request)
              .then(resolve)
              .catch(reject);
          } else if (msg.type === "error") {
            if (!settled) {
              settled = true;
              clearTimeout(timeout);
              try { ws.close(); } catch {}
              reject(new Error(
                `Cartesia WebSocket returned error: ${JSON.stringify(msg)}`,
              ));
            }
          }
        } catch (parseErr) {
          if (!settled) {
            settled = true;
            clearTimeout(timeout);
            try { ws.close(); } catch {}
            reject(new Error(`Failed to parse Cartesia WebSocket message: ${parseErr}`));
          }
        }
      };
    });
  }

  /**
   * Finalize WebSocket result: concatenate PCM chunks, convert to MP3,
   * prepend silence, build word timestamps with offset.
   */
  private async finalizeWebSocketResult(
    audioChunks: Buffer[],
    words: string[],
    starts: number[],
    ends: number[],
    request: TTSRequest,
  ): Promise<TTSResult> {
    if (audioChunks.length === 0) {
      throw new Error("Cartesia WebSocket returned no audio chunks");
    }

    // Concatenate PCM chunks and convert to MP3
    const pcmBuffer = Buffer.concat(audioChunks);
    let audioBuffer = pcmToMp3(pcmBuffer, 44100);

    // Validate minimum size
    if (audioBuffer.byteLength < 1000) {
      throw new Error(
        `Cartesia WebSocket returned suspiciously small audio (${audioBuffer.byteLength} bytes) ` +
        `for: "${request.text.slice(0, 60)}..."`,
      );
    }

    // Prepend 100ms silence to prevent first-word cutoff
    audioBuffer = prependSilence(audioBuffer) as Buffer<ArrayBuffer>;

    // Measure duration
    const tmpPath = join(tmpdir(), `cartesia-ws-${Date.now()}.mp3`);
    writeFileSync(tmpPath, audioBuffer);
    const durationSeconds = getAudioDuration(tmpPath);
    try { unlinkSync(tmpPath); } catch {}

    if (durationSeconds < 0.3) {
      throw new Error(
        `Cartesia WebSocket returned near-silent audio (${durationSeconds.toFixed(2)}s) ` +
        `for: "${request.text.slice(0, 60)}..."`,
      );
    }

    // Build word timestamps with silence padding offset.
    // Cartesia returns times in seconds; convert to milliseconds and add padding.
    const wordTimestamps: WordTimestamp[] = [];
    for (let i = 0; i < words.length; i++) {
      wordTimestamps.push({
        word: words[i],
        startMs: Math.round(starts[i] * 1000) + SILENCE_PADDING_MS,
        endMs: Math.round(ends[i] * 1000) + SILENCE_PADDING_MS,
      });
    }

    console.log(
      `  ✓ WebSocket synthesis complete: ${durationSeconds.toFixed(2)}s, ${wordTimestamps.length} word timestamps`,
    );

    return { audioBuffer, durationSeconds, wordTimestamps };
  }

  /** Build the common request body shared by HTTP and WebSocket paths. */
  private buildRequestBody(request: TTSRequest): Record<string, unknown> {
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

    return body;
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
        "Cartesia-Version": CARTESIA_VERSION,
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
