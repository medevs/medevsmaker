---
name: voiceover
description: "Synthesize TTS audio from a reviewed transcript and integrate voiceover into the Remotion composition."
user-invocable: true
skill: voiceover-director
---

# /voiceover — TTS Synthesis + Audio Integration

Synthesizes voiceover audio from transcript.json and integrates it into the Remotion composition.

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
2. **TTS synthesis** — Calls ElevenLabs (or configured provider) to generate MP3 for each scene
3. **Audio integration** — Adds `VoiceoverLayer` to the video composition
4. **Rendering instructions** — Provides commands to preview and export with audio

## Prerequisites

- Run `/video <VideoName>` first — this generates transcript.json with narration pre-populated from script.json
- `ELEVENLABS_API_KEY` must be set in `.env`
- `ELEVENLABS_VOICE_ID` must be set in `.env`

## Voice cloning

1. Record **10+ seconds** of clear audio (quiet room, good mic, natural speech)
2. Go to https://elevenlabs.io → Voices → Clone
3. Upload your audio sample, preview and test the cloned voice
4. Copy the voice ID and add to `.env`:
   ```
   ELEVENLABS_VOICE_ID=<voice-id>
   ```

**Tip**: Test with an ElevenLabs stock voice first to verify the pipeline works, then switch to your clone.

## Environment variables

```bash
TTS_PROVIDER=elevenlabs             # default
ELEVENLABS_API_KEY=<key>            # required
ELEVENLABS_VOICE_ID=<voice-id>     # required — your cloned voice
ELEVENLABS_MODEL=eleven_multilingual_v2  # default (highest quality)
ELEVENLABS_SPEED=1.0                # speech speed multiplier
```
