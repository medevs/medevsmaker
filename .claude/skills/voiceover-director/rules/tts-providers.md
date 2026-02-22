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
CARTESIA_MODEL=sonic-3       # sonic-3 (default) | sonic-2 | sonic
CARTESIA_SPEED=0.95          # sonic-3 only: 0.6 to 1.5 (default: 0.95)
CARTESIA_EMOTION=neutral     # sonic-3 only: neutral | happy | sad | angry | surprise
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

| Model | Quality | Speed Control | Emotion Control | Languages | Notes |
|-------|---------|---------------|-----------------|-----------|-------|
| `sonic-3` | Highest | `0.6` to `1.5` (numeric) | Yes | 42 | **Default** — best quality, full generation_config |
| `sonic-2` | High | Unreliable | No | 15 | Legacy — good voice cloning but no speed/emotion |
| `sonic` | Good | Same as sonic-2 | No | 15 | Previous generation |

**Why sonic-3 is the default:**
- Reliable `generation_config` support (speed, emotion, volume)
- Better naturalness and prosody
- Voice IDs are cross-compatible — your cloned voice works on sonic-3
- sonic-2's speed parameter is experimental and unreliable (overcorrects slow sentences, barely affects fast ones)

### Speed Control (sonic-3 only)

Set via `CARTESIA_SPEED` env var. Default: `0.95` (slightly slower for polished narration).

| Value | Effect |
|-------|--------|
| `0.6` | Very slow, dramatic |
| `0.8` | Noticeably slower |
| `0.95` | Slightly slower (default — polished narration) |
| `1.0` | Natural pace |
| `1.2` | Faster, energetic |
| `1.5` | Very fast |

Speed is "guidance" not strict override — the model maintains natural prosody. For sonic-2, speed config is ignored.

### Emotion Control (sonic-3 only)

Set via `CARTESIA_EMOTION` env var. Not set by default (model uses natural tone).

| Value | Best for |
|-------|----------|
| `neutral` | Educational narration, default tone |
| `happy` | Upbeat intros, positive stats |
| `sad` | Serious warnings, consequences |
| `angry` | Urgency, callouts |
| `surprise` | Shocking stats, reveals |

Emotion is applied as guidance — the model won't sound cartoonishly happy/sad.

### Silence Padding

The provider automatically prepends 100ms of silence to every audio file using ffmpeg. This prevents the first word from being clipped, which happens because Cartesia returns audio with no leading silence and MP3 frame encoding clips the first few milliseconds.

- **Requires ffmpeg** — install from https://ffmpeg.org/
- If ffmpeg is not available, falls back to raw audio with a warning
- The padding is model-agnostic and applies to all Cartesia models

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
