import type { TTSProvider } from "../types.ts";
import { FishAudioProvider } from "./fish-audio.ts";
import { EdgeTTSProvider } from "./edge-tts.ts";

/**
 * Create a TTS provider based on environment config.
 * Add new providers here — nothing else changes.
 */
export function createProvider(): TTSProvider {
  const providerName = process.env.TTS_PROVIDER ?? "edge-tts";

  switch (providerName) {
    case "edge-tts":
      return new EdgeTTSProvider();
    case "fish-audio":
      return new FishAudioProvider();
    default:
      throw new Error(
        `Unknown TTS provider: "${providerName}". ` +
          `Supported: edge-tts, fish-audio`,
      );
  }
}
