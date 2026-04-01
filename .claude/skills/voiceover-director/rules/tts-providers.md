# TTS Provider Configuration

## Architecture

The TTS system is provider-agnostic. All providers implement the `TTSProvider` interface from `scripts/tts/types.ts`. The factory in `scripts/tts/providers/index.ts` selects the active provider based on the `TTS_PROVIDER` environment variable.

## Environment Variables

```bash
# Provider selection (default: elevenlabs)
TTS_PROVIDER=elevenlabs

# ElevenLabs config
ELEVENLABS_API_KEY=<your-api-key>
ELEVENLABS_VOICE_ID=<voice-id-from-elevenlabs>
ELEVENLABS_MODEL=eleven_multilingual_v2   # eleven_multilingual_v2 (default) | eleven_turbo_v2_5 | eleven_flash_v2_5
ELEVENLABS_STABILITY=0.5                  # 0.0 to 1.0 (default: 0.5)
ELEVENLABS_SIMILARITY=0.75                # 0.0 to 1.0 (default: 0.75)
ELEVENLABS_STYLE=0.0                      # 0.0 to 1.0 (default: 0.0)
ELEVENLABS_SPEED=1.0                      # 0.7 to 1.2 (default: 1.0)

# Cartesia config (alternative provider: TTS_PROVIDER=cartesia)
CARTESIA_API_KEY=<your-api-key>
CARTESIA_VOICE_ID=<voice-id-from-cartesia>
CARTESIA_MODEL=sonic-3       # sonic-3 (default) | sonic-2 | sonic
CARTESIA_SPEED=0.95          # sonic-3 only: 0.6 to 1.5 (default: 0.95)
CARTESIA_EMOTION=neutral     # sonic-3 only: neutral | happy | sad | angry | surprise

# Word-level timestamps (for animated captions)
ELEVENLABS_TIMESTAMPS=true          # default: true — uses /with-timestamps endpoint
CARTESIA_TIMESTAMPS=true            # default: true — uses WebSocket API for word timestamps
```

## ElevenLabs (Default)

**API**: `POST https://api.elevenlabs.io/v1/text-to-speech/{voice_id}`

### Setup

1. Sign up at https://elevenlabs.io
2. Get your API key from Profile → API Keys
3. Add `ELEVENLABS_API_KEY=<key>` and `ELEVENLABS_VOICE_ID=<voice-id>` to `.env`

### Models

| Model | ID | Quality | Latency | Languages | Notes |
|-------|----|---------|---------|-----------|-------|
| Multilingual v2 | `eleven_multilingual_v2` | Highest | Normal | 29 | **Default** — best quality |
| Turbo v2.5 | `eleven_turbo_v2_5` | High | ~3x faster | 31 | Good for iteration |
| Flash v2.5 | `eleven_flash_v2_5` | Good | <75ms | 32 | Fastest, good for previews |

### Voice Settings

| Setting | Env Var | Default | Effect |
|---------|---------|---------|--------|
| Stability | `ELEVENLABS_STABILITY` | `0.5` | Higher = more consistent, lower = more expressive |
| Similarity Boost | `ELEVENLABS_SIMILARITY` | `0.75` | Higher = closer to original voice, may amplify artifacts |
| Style | `ELEVENLABS_STYLE` | `0.0` | Higher = more expressive, can reduce stability |
| Speed | `ELEVENLABS_SPEED` | `1.0` | `0.7` to `1.2` — pace of speech |

**Tips:**
- Start with defaults — they work well for narration
- Increase stability (0.7+) for educational narration that needs consistency
- Lower stability (0.3) for more dramatic, expressive delivery
- Keep similarity_boost at 0.75 for cloned voices
- Style exaggeration above 0.5 may sound unnatural

### Voice Cloning

ElevenLabs supports instant voice cloning from audio samples.

**Clone via dashboard:**
1. Go to https://elevenlabs.io → Voices → Add Voice → Instant Voice Cloning
2. Upload 1+ audio samples (10+ seconds recommended)
3. Name your voice and create
4. Copy the voice ID and add to `.env`: `ELEVENLABS_VOICE_ID=<voice-id>`

**Clone via API:**
```bash
curl -X POST https://api.elevenlabs.io/v1/voices/add \
  -H "xi-api-key: $ELEVENLABS_API_KEY" \
  -F "name=My Voice" \
  -F "files=@sample.mp3"
```
Returns `{ "voice_id": "<voice-id>" }`

### Audio Format

- Output: MP3 at 128kbps, 44.1kHz (`mp3_44100_128`)
- **No silence padding needed** — ElevenLabs produces clean audio with proper leading silence natively
- Files stored in `public/vo/<VideoName>/`

## Cartesia

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

## Word-Level Timestamps

Both ElevenLabs and Cartesia support word-level timestamps for animated captions.

- **ElevenLabs**: Uses `/with-timestamps` endpoint. Returns character-level alignment that is grouped into words. Controlled by `ELEVENLABS_TIMESTAMPS` env var (default: `true`).
- **Cartesia**: Uses WebSocket API with `word_timestamps: true`. Returns native word-level timestamps. Requires ffmpeg for PCM→MP3 conversion. Falls back to HTTP (no timestamps) on failure. Controlled by `CARTESIA_TIMESTAMPS` env var.
- **Edge TTS**: Does not support word timestamps. Captions will not be generated.

When timestamps are enabled, `generate-audio.ts` produces:
- `public/vo/<VideoName>/captions.json` — Combined Caption[] for all scenes (Remotion format)
- `CAPTIONS_FILE` export in `voiceover.ts` — Path to captions file

## Timing Auto-Sync

Run `generate-audio.ts` with `--auto-sync` to automatically extend scene durations when audio overflows:

```bash
node --env-file=.env --strip-types scripts/tts/generate-audio.ts <VideoName> --auto-sync
```

- Extends scenes where audio overflows by >0.3 seconds
- Updates `manifest.json` with new durations
- Reports all adjustments
- Large gaps (>2s) are reported but not auto-shrunk (may be intentional)

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
