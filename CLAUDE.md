# medevsmaker — AI Video Director Project

## 9-Command Pipeline

```
/idea [focus]         → trend scan + competitor check + ranked ideas (FREE)
                        3 parallel agents: trends, competitors, content plan
                        Output: productions/YYYY-MM-DD/idea.md
                        User picks a topic before proceeding

/script <idea>        → 6-phase pipeline: context → research → hooks → scenes → narration → critic (FREE)
                        Supports --from-idea and --format short flags
                        Output: productions/<date>-<slug>/research.md + script.json
                        User reviews hook variants + narration + scene plan + critic feedback

/video <VideoName>    → Remotion code + manifest.json + transcript.json (FREE)
                        Durations computed from narration word counts
                        Auto-detects format (landscape/portrait) from script.json
                        User reviews visuals in Remotion Studio

/voiceover <VideoName> → TTS synthesis + audio integration ($$)
                        User reviews final video with audio

/music <VideoName>    → Background music with breathing volume (FREE with library)
                        Royalty-free library (preferred) or ElevenLabs Music API
                        Continuous bed: rises at hook/transitions/outro, ducks during narration
                        User reviews music vibe + volume levels

/assets <VideoName>   → Title, description, tags, chapters, thumbnail ($ for thumbnail)
                        5 title variants scored + SEO description + auto-chapters from manifest
                        Short-form mode: 4-6 word titles, hashtags, no thumbnail/chapters
                        Output: productions/<date>-<slug>/assets.md + thumbnail PNGs
                        User picks title + thumbnail, then uploads to YouTube

/repurpose <VideoName> → Extract 3-5 short-form clips from long-form (FREE)
                        Identifies standalone moments, rewrites hooks for vertical
                        Output: src/videos/<VideoName>Short1-5/script.json
                        User reviews clips, then runs /video for each

/distribute <VideoName> → Cross-platform content cascade (FREE)
                        Blog post, Twitter thread, LinkedIn, email, community post
                        Output: productions/<date>-<slug>/distribute/ + distribute-status.json
                        User reviews content, then posts following the schedule

/sfx <VideoName>      → Sound effects (FUTURE)
```

Each step has a validation checkpoint. Review output before proceeding to the next command.

## Custom Skills

### idea — Topic Discovery

**`/idea [focus]`**: Trend Scan + Competitor Check + Content Plan Cross-Reference → `productions/YYYY-MM-DD/idea.md`

Self-contained command (no separate skill). Spawns 3 parallel research agents, scores ideas on 4 dimensions (search demand, gap opportunity, audience fit, timeliness), and outputs ranked ideas with source URLs.

### video — Powers `/script` and `/video`

**`/script <idea>`**: Context Gathering → Deep Research → Angle & Hook → Scene Planning → Narration Writing → Quality Review → `script.json`
**`/video <VideoName>`**: Duration Calc → Code Generation → manifest.json + transcript.json (pre-populated)

**Supported video types**: short, news, explainer, tutorial (historical alias: `educational` → `explainer`)
**Short-form**: `--format short` flag on `/script`, or auto-detected from platform mentions (TikTok, Shorts, Reel). 1080x1920 portrait, 13-60s, flat TransitionSeries, CaptionOverlay always on.

### voiceover — Powers `/voiceover`

**`/voiceover <VideoName>`**: TTS Synthesis → Audio Integration

**Provider**: ElevenLabs (default), Cartesia, Edge TTS — switch via `TTS_PROVIDER` env var

### music — Powers `/music`

**`/music <VideoName>`**: Mood Analysis → Track Selection → Breathing Music Integration

**Default mode**: Breathing — continuous music bed with volume that breathes (rises at hook/transitions/outro, ducks during narration). Uses `BreathingMusicLayer` component.
**Source**: Royalty-free library (preferred, free), manual MP3, or ElevenLabs Music API
**Volume zones**: Hook (0.18) → Narration (0.03) → Gaps (0.08) → Transitions (0.15) → Outro (0.18)

### assets — Publishing Metadata + Thumbnail

**`/assets <VideoName>`**: Context Gathering → Titles (5 variants, scored) → Description + Tags + Chapters → Thumbnail Brief + A/B Variants → Optional AI Thumbnail Generation → `assets.md`

Leverages youtube skill's sub-skills (seo, metadata, thumbnail) internally. Auto-generates chapter timestamps from manifest.json. Thumbnail generation requires Replicate MCP configured in `.mcp.json`; without it, outputs a text-only thumbnail brief for manual creation.

### distribute — Content Cascade

**`/distribute <VideoName>`**: Context Gathering → Blog Post → Twitter Thread → LinkedIn Post → Email Newsletter → Community Post → Schedule → `distribute/`

Reads script.json + assets.md + research.md, leverages youtube skill's repurpose sub-skill knowledge. Generates platform-native content (not transcript paste). Outputs to `productions/<date>-<slug>/distribute/` with `distribute-status.json` tracking.

### youtube — YouTube Research & Strategy (installed)

YouTube-specific research: hooks, retention strategies, SEO, competitor analysis, content calendars.
Used internally by `/script` for research phase.

### research — Web Research (installed)

Structured web research with human-in-the-loop control. 5 modes: `/research`, `/research-add-items`, `/research-add-fields`, `/research-deep`, `/research-report`.
Used internally by `/script` for news topics and fact verification.

## Sub-Agents

### script-critic — Script Quality Reviewer

Read-only agent that reviews `script.json` after `/script` generation.
Checks: unattributed claims, weak hooks, pacing, missing visuals, tone, structure, source attribution, retention patterns.
Located at `.claude/agents/script-critic.md`.

## Project Structure

```
src/
  index.ts                          # registerRoot entry point
  Root.tsx                          # Composition registry (all videos)
  shared/
    styles.ts                       # baseTokens, BRAND, SECTION_THEMES, CARD, MONO, TYPOGRAPHY, CONTAINERS, SCENE_TIERS
    animations.ts                   # EASINGS, entrances, pulse, float, shimmer, breathe
    transitions.ts                  # TRANSITIONS presets (fade, slide, wipe, clockWipe, shortFade), flashOverlay()
    formats.ts                      # FORMAT_PRESETS, SAFE_ZONES, useLayoutMode() hook
    utils/                          # blobUtils (SVG blob path generation)
    components/                     # Core components (Background, Card, StatCounter, TextEffect, GradientText, etc.)
    scenes/                         # All scenes flat (HookQuestion, TitleIntro, CodeDisplay, TextGlitch, CinematicSciFi, etc.)
  videos/<VideoName>/               # Per-video: index.tsx, script.json, manifest.json, styles.ts, music.ts

.agents/skills/video/               # Powers /script (6 phases) and /video (3 phases)
.agents/skills/voiceover/           # Powers /voiceover (TTS + audio integration)
.agents/skills/music/               # Powers /music (music generation + ducking)
.claude/skills/                     # All 8 commands registered here (/idea, /script, /video, etc.)
.claude/agents/script-critic.md     # Read-only quality reviewer (8 checks)

scripts/tts/                        # TTS pipeline
scripts/music/                      # Music pipeline
productions/                        # Pipeline output (/idea, /script, /assets, /distribute)
public/thumbnails/<VideoName>/      # AI-generated thumbnails (requires Replicate MCP)
```

## Remotion Conventions
- Always use `useCurrentFrame()` + `interpolate()`/`spring()` — NEVER CSS transitions
- Always `extrapolateRight: 'clamp'` on interpolations
- `<AbsoluteFill>` + flexbox for layout, fonts via `@remotion/google-fonts`
- `<TransitionSeries>` for scenes within sections, `<Series>` for chaining sections
- Import all shared scenes from `src/shared/scenes/` (flat directory, no extended/ subdirectory)
- Script-first pipeline: narration drives scene durations (155 WPM long-form, 170 WPM short-form)
- `/video` outputs `manifest.json` + `transcript.json` (pre-populated from script.json)
- Voiceover via `VoiceoverLayer`, music via `BreathingMusicLayer`
- **Short-form (9:16)**: flat `TransitionSeries`, `useLayoutMode()` for safe zones, `CaptionOverlay` always on
- Style details (spring configs, component preferences, overlays) in `.agents/skills/video/` rules
