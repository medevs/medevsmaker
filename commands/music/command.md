---
name: music
description: "Generate background music and integrate it into the Remotion composition with automatic voiceover ducking."
user-invocable: true
skill: music-director
---

# /music — Background Music Generation + Integration

Generates or imports background music and integrates it into the Remotion composition with automatic volume ducking during voiceover.

## Usage

```
/music <VideoName>
/music <VideoName> --manual
/music <VideoName> --prompt "dark ambient electronic"
```

## Examples

```
/music HowTheWebWorks
/music TheAIStackExplained --prompt "upbeat synthwave"
/music UnderstandingDatabases --manual
```

## What happens

1. **Mood analysis** — Reads script.json section tones to determine music mood
2. **Music generation** — Calls ElevenLabs Music API (or uses manual file)
3. **Audio integration** — Adds BackgroundMusicLayer with auto-ducking to index.tsx
4. **Preview instructions** — Commands to preview and render with music

## Prerequisites

- Run `/video <VideoName>` first — manifest.json must exist
- Run `/voiceover <VideoName>` for ducking (optional but recommended)
- `ELEVENLABS_API_KEY` must be set in `.env` (not needed with `--manual`)

## Flags

```
--manual          Skip generation; expect user-provided MP3 at public/music/<VideoName>/background.mp3
--prompt "..."    Override auto-detected mood with custom music prompt
--volume 0.20     Set base music volume (default 0.20)
--duck 0.06       Set ducked volume during voiceover (default 0.06)
--no-loop         Don't loop the track (for tracks matching video length)
```

## Environment variables

```bash
ELEVENLABS_API_KEY=<key>           # Required for generation
MUSIC_VOLUME=0.20                  # Base volume override
MUSIC_DUCK_VOLUME=0.06             # Ducked volume override
```
