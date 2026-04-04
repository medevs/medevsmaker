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
ELEVENLABS_SIMILARITY=0.75               # 0.0 to 1.0 (default: 0.75)
ELEVENLABS_STYLE=0.0                      # 0.0 to 1.0 (default: 0.0)
ELEVENLABS_SPEED=1.0                      # 0.7 to 1.2 (default: 1.0)

# Cartesia config (alternative provider: TTS_PROVIDER=cartesia)
CARTESIA_API_KEY=<your-api-key>
CARTESIA_VOICE_ID=<voice-id-from-cartesia>
CARTESIA_MODEL=sonic-3       # sonic-3 (default) | sonic-2 | sonic
CARTESIA_SPEED=0.95          # sonic-3 only: 0.6 to 1.5 (default: 0.95)
CARTESIA_EMOTION=neutral     # sonic-3 only: neutral | happy | sad | angry | surprise

# Word-level timestamps (for animated captions)
ELEVENLABS_TIMESTAMPS=true
CARTESIA_TIMESTAMPS=true
```

## ElevenLabs (Default)

**API**: `POST https://api.elevenlabs.io/v1/text-to-speech/{voice_id}`

Setup: Sign up at elevenlabs.io, get API key, add `ELEVENLABS_API_KEY` and `ELEVENLABS_VOICE_ID` to `.env`.

### Models

| Model | ID | Quality | Latency | Notes |
|-------|----|---------|---------|-------|
| Multilingual v2 | `eleven_multilingual_v2` | Highest | Normal | **Default** — best quality |
| Turbo v2.5 | `eleven_turbo_v2_5` | High | ~3x faster | Good for iteration |
| Flash v2.5 | `eleven_flash_v2_5` | Good | <75ms | Fastest, good for previews |

### Voice Settings

| Setting | Env Var | Default | Effect |
|---------|---------|---------|--------|
| Stability | `ELEVENLABS_STABILITY` | `0.5` | Higher = more consistent, lower = more expressive |
| Similarity | `ELEVENLABS_SIMILARITY` | `0.75` | Higher = closer to original voice |
| Style | `ELEVENLABS_STYLE` | `0.0` | Higher = more expressive, can reduce stability |
| Speed | `ELEVENLABS_SPEED` | `1.0` | `0.7` to `1.2` — pace of speech |

Increase stability to 0.7+ for educational narration consistency. Output: MP3 at 128kbps, 44.1kHz.

## Cartesia (Alternative)

**API**: `POST https://api.cartesia.ai/tts/bytes`

Setup: Sign up at cartesia.ai, get API key, add `CARTESIA_API_KEY` and `CARTESIA_VOICE_ID` to `.env`. Use sonic-3 model (default, best quality). Speed: `CARTESIA_SPEED=0.95` (default). Emotion: `CARTESIA_EMOTION=neutral` (default). ~73% cheaper than ElevenLabs. Requires ffmpeg for silence padding.

## Edge TTS (Free)

No API key needed. Set `TTS_PROVIDER=edge-tts`, `EDGE_TTS_VOICE=en-US-AndrewNeural`. No word timestamps, no voice cloning. Best for draft previews and testing.

## Word-Level Timestamps

Both ElevenLabs and Cartesia support word-level timestamps for animated captions. Enabled by default. When enabled, `generate-audio.ts` produces `public/vo/<VideoName>/captions.json` and a `CAPTIONS_FILE` export in `voiceover.ts`. Edge TTS does not support timestamps.

## Timing Auto-Sync

Run `generate-audio.ts` with `--auto-sync` to automatically extend scene durations when audio overflows by >0.3s. Updates `manifest.json` with new durations.
