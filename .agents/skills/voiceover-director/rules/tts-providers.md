# TTS Provider Configuration

## Architecture

The TTS system is provider-agnostic. All providers implement the `TTSProvider` interface from `scripts/tts/types.ts`. The factory in `scripts/tts/providers/index.ts` selects the active provider based on the `TTS_PROVIDER` environment variable.

## Environment Variables

```bash
# Provider selection (default: fish-audio)
TTS_PROVIDER=fish-audio

# Fish Audio config
FISH_AUDIO_API_KEY=<your-api-key>
FISH_AUDIO_VOICE_ID=<model-id-from-fish-audio>
FISH_AUDIO_MODEL=s1          # s1 (default, emotion support) | speech-1.6 | speech-1.5
FISH_AUDIO_SPEED=1.0         # 0.5 to 2.0
```

## Fish Audio

**API**: `POST https://api.fish.audio/v1/tts`

### Setup

1. Sign up at https://fish.audio
2. Get your API key from the dashboard
3. Add `FISH_AUDIO_API_KEY=<key>` to `.env`

### Voice Cloning

1. **Record** 15-30 seconds of clear audio (quiet room, consistent volume, natural speech)
2. **Go to** https://fish.audio — create a voice model through their web UI
3. **Upload** your audio sample, preview and test the cloned voice
4. **Copy the model ID** from the platform dashboard
5. **Add to `.env`**: `FISH_AUDIO_VOICE_ID=<model-id>`

### Models

| Model | Speed | Quality | Emotion Support |
|-------|-------|---------|-----------------|
| `s1` | Fast | High | Yes — `(excited)`, `(serious)`, `(warm)`, `(sad)` |
| `speech-1.6` | Fast | Good | No |
| `speech-1.5` | Fast | Good | No |

### Rate Limits

- **Free tier**: 100 requests/minute
- **Paid**: 500+ requests/minute

The synthesis script includes a 650ms delay between requests to stay within free tier limits.

### Audio Format

- Output: MP3 at 128kbps
- Files stored in `public/vo/<VideoName>/`
- Referenced via `staticFile()` in Remotion

## Adding a New Provider

1. Create `scripts/tts/providers/<name>.ts` implementing `TTSProvider`
2. Add a `case` in `scripts/tts/providers/index.ts`
3. Add env vars for the new provider's config
4. Document in this file

Example skeleton:

```ts
import type { TTSProvider, TTSRequest, TTSResult } from "../types";

export class MyProvider implements TTSProvider {
  readonly name = "my-provider";

  constructor() {
    // Read config from process.env
  }

  async synthesize(request: TTSRequest): Promise<TTSResult> {
    // Call API, return audio buffer + duration
  }
}
```
