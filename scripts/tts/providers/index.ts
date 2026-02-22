import type { TTSProvider } from "../types.ts";
import { CartesiaProvider } from "./cartesia.ts";
import { EdgeTTSProvider } from "./edge-tts.ts";

/**
 * Create a TTS provider based on environment config.
 * Add new providers here — nothing else changes.
 */
export function createProvider(): TTSProvider {
  const providerName = process.env.TTS_PROVIDER ?? "cartesia";

  switch (providerName) {
    case "edge-tts":
      return new EdgeTTSProvider();
    case "cartesia":
      return new CartesiaProvider();
    default:
      throw new Error(
        `Unknown TTS provider: "${providerName}". ` +
          `Supported: cartesia, edge-tts`,
      );
  }
}
