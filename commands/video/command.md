---
name: video
description: "Generate Remotion video code from a production script. Computes durations from narration and outputs complete code + manifest + transcript."
user-invocable: true
skill: video-director
---

# /video — Generate Remotion Video Code

Reads a production script and generates complete Remotion video code with durations computed from narration word counts.

## Usage

```
/video <VideoName>
```

## Examples

```
/video HowTheWebWorks
/video TheAIStackExplained
/video UnderstandingDatabases
```

## Prerequisites

- Run `/script <idea>` first to generate `src/<VideoName>/script.json`
- The script must contain narration for every scene

## What happens

1. **Reads script.json** — scene types, props, narration, and style metadata
2. **Computes durations** — from narration word counts using 155 WPM formula
3. **Assigns transitions** — fade, slide, wipe, clockWipe per scene context
4. **Generates Remotion code** — compositions, sections, scenes, styles
5. **Outputs manifest.json** — structured scene data with computed durations
6. **Outputs transcript.json** — pre-populated with narration from script (ready for TTS)
7. You get **rendering instructions** to preview and export the video

## After reviewing visuals

Run `/voiceover <VideoName>` to synthesize TTS audio and integrate into the composition.
