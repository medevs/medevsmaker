# medevsmaker — AI Video Director

Automated YouTube video production with Claude Code + Remotion. From idea to published video in one workflow. No camera, no manual editing.

## Quick Start

```bash
# Install
git clone <repo-url> && cd medevsmaker
npm install

# Preview in Remotion Studio
npm run studio
```

## 9-Command Pipeline

Each command is a Claude Code slash command. Run them in order — each step has a validation checkpoint before proceeding.

```
/idea [focus]              Trend scan + competitor check + ranked ideas
/script <idea>             6-phase script: research, hooks, scenes, narration, critic review
/video <VideoName>         Remotion code generation from script.json
/voiceover <VideoName>     TTS synthesis (ElevenLabs, Cartesia, or Edge TTS)
/music <VideoName>         Background music + voiceover ducking
/assets <VideoName>        YouTube titles, description, tags, chapters, thumbnail
/repurpose <VideoName>     Extract 3-5 short-form clips from long-form
/distribute <VideoName>    Blog post, Twitter thread, LinkedIn, email, community post
```

## How It Works

```
/idea       → productions/YYYY-MM-DD/idea.md (pick a topic)
/script     → script.json + research.md (review narration + scenes)
/video      → src/<VideoName>/ with Remotion code + manifest.json + transcript.json
/voiceover  → public/vo/<VideoName>/*.mp3 (TTS audio per scene)
/music      → public/music/<VideoName>/background.mp3 (auto-ducking)
/assets     → assets.md (5 title variants, SEO description, chapters)
/distribute → distribute/ (platform-native content for 5 channels)
```

## Video Types

| Type | Description |
|------|-------------|
| **news** | AI/tech news coverage |
| **explainer** | Concept deep-dives ("how X works") |
| **tutorial** | Step-by-step guides |
| **short** | 13-60s vertical (TikTok, Shorts, Reels) |

## Project Structure

```
src/
  Root.tsx                    Composition registry
  shared/
    components/               25 reusable UI components
    scenes/                   35 scene templates
    styles.ts                 Brand palette, tokens, themes
    animations.ts             Spring configs, entrance animations
    transitions.ts            Transition presets
    formats.ts                Landscape/portrait format system
  <VideoName>/                Per-video generated code

scripts/
  tts/                        TTS pipeline (generate-manifest, transcript, audio)
  music/                      Music generation pipeline

productions/                  Output: ideas, research, scripts, assets
.agents/skills/               Skills: video, voiceover, music, youtube, research
.claude/skills/               All 8 slash commands registered here
.claude/agents/               Sub-agents: script-critic
```

## Environment Setup

```bash
# .env — TTS provider config
TTS_PROVIDER=edge-tts        # Free, no API key needed
# Or: elevenlabs (best quality, requires API key)
# Or: cartesia (alternative, requires API key)
```

## npm Scripts

```bash
npm run studio               # Remotion Studio (preview)
npm run render               # Render video
npm run manifest             # Generate manifest from script.json
npm run transcript           # Generate transcript from script.json
npm run voiceover            # Run TTS synthesis
npm run music                # Generate background music
```

## Skills

Managed by `npx skills`. Source of truth in `.agents/skills/`, junctions in `.claude/skills/`.

| Skill | Powers |
|-------|--------|
| **video** | `/script` + `/video` |
| **voiceover** | `/voiceover` |
| **music** | `/music` |
| **youtube** | SEO, hooks, retention (used by `/script` and `/assets`) |
| **research** | Web research (used by `/script`) |
| **remotion-best-practices** | Remotion API patterns |
