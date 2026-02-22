# TTS Provider Configuration

## Architecture

The TTS system is provider-agnostic. All providers implement the `TTSProvider` interface from `scripts/tts/types.ts`. The factory in `scripts/tts/providers/index.ts` selects the active provider based on the `TTS_PROVIDER` environment variable.

## Environment Variables

```bash
# Provider selection (default: cartesia)
TTS_PROVIDER=cartesia

# Cartesia config
CARTESIA_API_KEY=<your-api-key>
CARTESIA_VOICE_ID=<voice-id-from-cartesia>
CARTESIA_MODEL=sonic-2       # sonic-2 (default) | sonic-3 | sonic
CARTESIA_SPEED=slow          # sonic-2: slow | normal | fast
                             # sonic-3: 0.6 to 1.5 (numeric)
```

## Cartesia (Default)

**API**: `POST https://api.cartesia.ai/tts/bytes`

### Setup

1. Sign up at https://cartesia.ai
2. Get your API key from the dashboard
3. Add `CARTESIA_API_KEY=<key>` to `.env`

### Voice Cloning

Cartesia supports voice cloning from as little as 5 seconds of audio.

**Tips for good voice clones:**
- **10+ seconds** of audio produces significantly better results than 5s
- **Quiet room** — no background noise, fan hum, or echo
- **Good microphone** — external mic over laptop mic
- **Natural speech** — read a paragraph naturally, don't perform
- **Consistent volume** — don't whisper then shout
- **Test first** — clone your voice and test with a single sentence before running full synthesis

**Clone via dashboard:**
1. Go to https://play.cartesia.ai → Voices → Clone
2. Upload your audio sample
3. Preview and test the voice with different sentences
4. Copy the voice ID and add to `.env`: `CARTESIA_VOICE_ID=<voice-id>`

**Clone via API:**
```bash
curl -X POST https://api.cartesia.ai/voices/clone \
  -H "Cartesia-Version: 2025-04-16" \
  -H "X-API-Key: $CARTESIA_API_KEY" \
  -F "clip=@sample.mp3" \
  -F "name=My Voice" \
  -F "language=en"
```
Returns `{ "id": "<voice-id>" }`

**Testing with pre-built voices:**
Before cloning, test the pipeline with a Cartesia stock voice to confirm the system works. Browse voices at https://play.cartesia.ai/voices.

### Models

| Model | Quality | Speed Control | Languages | Notes |
|-------|---------|---------------|-----------|-------|
| `sonic-2` | Highest | `slow` / `normal` / `fast` | 15 | Default — best voice cloning fidelity |
| `sonic-3` | High | `0.6` to `1.5` (numeric) | 42 | Emotion + volume + speed controls |
| `sonic` | Good | Same as sonic-2 | 15 | Previous generation |

**Speed control:**
- `CARTESIA_SPEED=slow` for sonic-2 — recommended for voiceover (clearer articulation)
- `CARTESIA_SPEED=0.85` for sonic-3 — numeric scale where 1.0 is default
- Cartesia's default pace (~160-170 WPM on short sentences) is faster than ideal for educational voiceover. Using `slow` brings it closer to the 130 WPM our word budgets target.

### Audio Format

- Output: MP3 at 128kbps, 44.1kHz
- Files stored in `public/vo/<VideoName>/`
- Referenced via `staticFile()` in Remotion

### Diagnostics

The `generate-audio.ts` script outputs per-scene diagnostics:
- **WPM**: actual words-per-minute for each scene
- **Gap**: silence gap between audio end and next scene start
- **Summary**: average WPM, total silence, overflow warnings

If average WPM > 160, the script suggests setting `CARTESIA_SPEED=slow`.

## Edge TTS (Free Alternative)

Edge TTS is a free, unlimited alternative that requires no API key. It uses Microsoft's text-to-speech service.

### Setup

No API key needed. Just set:

```bash
TTS_PROVIDER=edge-tts
EDGE_TTS_VOICE=en-US-AndrewNeural
EDGE_TTS_SPEED=1.0
```

### Limitations

- No voice cloning — limited to Microsoft's preset voices
- Quality is good but not as natural as Cartesia
- Best used as a fallback or for testing

## Adding a New Provider

1. Create `scripts/tts/providers/<name>.ts` implementing `TTSProvider`
2. Add a `case` in `scripts/tts/providers/index.ts`
3. Add voice ID env var mapping in `scripts/tts/generate-audio.ts` (`VOICE_ID_ENV`)
4. Add env vars for the new provider's config
5. Document in this file

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
