---
name: voiceover
description: "Synthesize TTS audio from a reviewed transcript and integrate voiceover into the Remotion composition."
user-invocable: true
skill: voiceover-director
---

# /voiceover — TTS Synthesis + Audio Integration

Synthesizes voiceover audio from a reviewed transcript and integrates it into the Remotion composition.

## Usage

```
/voiceover <VideoName>
```

## Examples

```
/voiceover HowTheWebWorks
/voiceover TheAIStackExplained
/voiceover UnderstandingDatabases
```

## What happens

1. **Transcript check** — Verifies `transcript.json` exists with non-empty narration fields
2. **TTS synthesis** — Calls Cartesia (or configured provider) to generate MP3 for each scene
3. **Audio integration** — Adds `VoiceoverLayer` to the video composition
4. **Rendering instructions** — Provides commands to preview and export with audio

## Prerequisites

- Run `/transcript <VideoName>` first and review the narration
- `transcript.json` must exist with narration filled for each scene
- `CARTESIA_API_KEY` must be set in `.env`
- `CARTESIA_VOICE_ID` must be set in `.env` (clone your voice at https://play.cartesia.ai first)

## Voice cloning

1. Record **10+ seconds** of clear audio (quiet room, good mic, natural speech)
2. Go to https://play.cartesia.ai → Voices → Clone
3. Upload your audio sample, preview and test the cloned voice
4. Copy the voice ID and add to `.env`:
   ```
   CARTESIA_VOICE_ID=<voice-id>
   ```

**Tip**: Test with a Cartesia stock voice first to verify the pipeline works, then switch to your clone.

## Environment variables

```bash
TTS_PROVIDER=cartesia              # default
CARTESIA_API_KEY=<key>             # required
CARTESIA_VOICE_ID=<voice-id>      # required — your cloned voice
CARTESIA_MODEL=sonic-3             # sonic-3 (default) | sonic-2 | sonic
CARTESIA_SPEED=0.95                # 0.95 (recommended) | 1.0 | 0.8
```
