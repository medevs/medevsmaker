import type { TTSProvider } from "../types.ts";
import { CartesiaProvider } from "./cartesia.ts";
import { EdgeTTSProvider } from "./edge-tts.ts";
import { ElevenLabsProvider } from "./elevenlabs.ts";
import { KokoroProvider } from "./kokoro.ts";

/**
 * Create a TTS provider based on environment config.
 * Add new providers here — nothing else changes.
 */
export function createProvider(): TTSProvider {
  const providerName = process.env.TTS_PROVIDER ?? "elevenlabs";

  switch (providerName) {
    case "elevenlabs":
      return new ElevenLabsProvider();
    case "edge-tts":
      return new EdgeTTSProvider();
    case "cartesia":
      return new CartesiaProvider();
    case "kokoro":
      return new KokoroProvider();
    default:
      throw new Error(
        `Unknown TTS provider: "${providerName}". ` +
          `Supported: elevenlabs, cartesia, edge-tts, kokoro`,
      );
  }
}
