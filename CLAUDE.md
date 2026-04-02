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

/music <VideoName>    → Background music + voiceover ducking ($$)
                        ElevenLabs Music API or manual MP3
                        User reviews music vibe + ducking levels

/assets <VideoName>   → Title, description, tags, chapters, thumbnail ($ for thumbnail)
                        5 title variants scored + SEO description + auto-chapters from manifest
                        Short-form mode: 4-6 word titles, hashtags, no thumbnail/chapters
                        Output: productions/<date>-<slug>/assets.md + thumbnail PNGs
                        User picks title + thumbnail, then uploads to YouTube

/repurpose <VideoName> → Extract 3-5 short-form clips from long-form (FREE)
                        Identifies standalone moments, rewrites hooks for vertical
                        Output: src/<VideoName>Short1-5/script.json
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

### video-director — Powers `/script` and `/video`

**`/script <idea>`**: Context Gathering → Deep Research → Angle & Hook → Scene Planning → Narration Writing → Quality Review → `script.json`
**`/video <VideoName>`**: Duration Calc → Code Generation → manifest.json + transcript.json (pre-populated)

**Supported video types**: short, news, explainer, tutorial (historical alias: `educational` → `explainer`)
**Short-form**: `--format short` flag on `/script`, or auto-detected from platform mentions (TikTok, Shorts, Reel). 1080x1920 portrait, 13-60s, flat TransitionSeries, CaptionOverlay always on.

### voiceover-director — Powers `/voiceover`

**`/voiceover <VideoName>`**: TTS Synthesis → Audio Integration

**Provider**: ElevenLabs (default), Cartesia, Edge TTS — switch via `TTS_PROVIDER` env var

### music-director — Powers `/music`

**`/music <VideoName>`**: Mood Analysis → Music Generation → Ducking Integration

**Provider**: ElevenLabs Music API (default), manual MP3 via `--manual` flag

### assets — Publishing Metadata + Thumbnail

**`/assets <VideoName>`**: Context Gathering → Titles (5 variants, scored) → Description + Tags + Chapters → Thumbnail Brief + A/B Variants → Optional AI Thumbnail Generation → `assets.md`

Self-contained command (no separate skill). Leverages youtube skill's sub-skills (seo, metadata, thumbnail) internally. Auto-generates chapter timestamps from manifest.json. Thumbnail generation via Replicate MCP (Flux 1.1 Pro) + Remotion `renderStill()` compositing.

### distribute — Content Cascade

**`/distribute <VideoName>`**: Context Gathering → Blog Post → Twitter Thread → LinkedIn Post → Email Newsletter → Community Post → Schedule → `distribute/`

Self-contained command (no separate skill). Reads script.json + assets.md + research.md, leverages youtube skill's repurpose sub-skill knowledge. Generates platform-native content (not transcript paste). Outputs to `productions/<date>-<slug>/distribute/` with `distribute-status.json` tracking.

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
  shared/                           # 22 components + 29 scenes (13 Core + 16 Advanced)
    styles.ts                       # baseTokens, BRAND, SECTION_THEMES, CARD, MONO
    animations.ts                   # EASINGS, entrances (fadeUpSlow, fadeLeftSlow), pulse
    transitions.ts                  # TRANSITIONS presets (fade, slide, wipe, clockWipe, shortFade)
    formats.ts                      # FORMAT_PRESETS, SAFE_ZONES, useLayoutMode() hook
    components/                     # AnimatedText, Background, CaptionOverlay, SafeZoneOverlay, etc.
    scenes/                         # HookQuestion, TitleIntro, FullScreenText, SwipeReveal, etc.
  <VideoName>/                      # Per-video: index.tsx, script.json, manifest.json, styles.ts, music.ts

.agents/skills/video-director/      # Powers /script (6 phases) and /video (3 phases)
  rules/                            # context-gathering, research-integration, hook-selection,
                                    # video-types, audience-profile, educational-scenes,
                                    # narration-writing, long-form-architecture, duration-calculation,
                                    # short-form
.agents/skills/voiceover-director/  # Powers /voiceover (TTS + audio integration)
.agents/skills/music-director/      # Powers /music (music generation + ducking)
.claude/agents/script-critic.md     # Read-only quality reviewer (8 checks)

scripts/tts/                        # TTS pipeline: types, utils, generate-transcript, generate-audio
scripts/music/                      # Music pipeline: types, generate-music
productions/                        # /idea output + /script research.md + script.json + /assets assets.md + /distribute distribute/
commands/                           # /idea, /script, /video, /voiceover, /music, /assets, /repurpose, /distribute
public/thumbnails/<VideoName>/      # AI-generated thumbnail images (from /assets)
```

## Remotion Conventions
- Always use `useCurrentFrame()` for animations — NEVER CSS transitions
- Spring configs: `{ damping: 200 }` smooth, `{ damping: 200, stiffness: 90 }` silky, `{ damping: 20, stiffness: 200 }` snappy, `{ damping: 8 }` bouncy, `{ damping: 15, stiffness: 80, mass: 2 }` heavy
- Always `extrapolateRight: 'clamp'` on interpolations
- Use `<AbsoluteFill>` + flexbox for layout
- Use `<TransitionSeries>` for scene sequencing within sections
- Use `<Series>` for chaining sections in explainer/tutorial videos
- Load fonts via `@remotion/google-fonts`
- Calculate `durationInFrames = seconds * fps`
- All videos import shared scenes from `src/shared/scenes/`
- Watermark position: `"top-right"` (avoids ProgressBar overlap)
- Visual-first: 60%+ content scenes should be visual-heavy
- Use `EndScreen` instead of basic `Outro` for polished end cards
- Script-first pipeline: narration drives scene durations (155 WPM formula)
- `/video` outputs `manifest.json` + `transcript.json` (pre-populated with narration from script.json)
- Voiceover: `<Audio>` from `@remotion/media`, placed inside `<Sequence>` via `VoiceoverLayer`
- Audio files in `public/vo/<VideoName>/`, referenced via `staticFile()`
- Background music: `<Audio>` with volume callback for ducking, placed via `BackgroundMusicLayer`
- Music files in `public/music/<VideoName>/`, referenced via `staticFile()`
- Per-section color theming: use `SECTION_THEMES.get(index)` for section accent colors
- Persistent overlays: `SectionTracker` (bottom-right), `FeatureCounter` (top-left, optional)
- Prefer `springSilky` + `fadeUpSlow`/`fadeLeftSlow` for polished, slower animations
- Use `ColorBorderCard` as the signature card element (left colored border)
- Use `PillBadge` for ALL CAPS monospace labels
- Use `GradientText` for key phrase emphasis
- Negative space: content in left 60-65% for FeatureIntro/KeyRuleCard, 80px+ outer padding
- **Short-form (9:16)**: `useLayoutMode()` from `formats.ts` provides responsive tokens
- Short-form: flat `TransitionSeries`, no `<Series>` sections, `shortFade` (8f) transitions
- Short-form: `CaptionOverlay` always on (bold style, 400ms combineMs)
- Short-form: no ProgressBar, SectionTracker, FeatureCounter, Watermark overlays
- Short-form: safe zones — 160px top, 350px bottom, 60px sides (auto via `useLayoutMode`)
- Short-form: 170 WPM pacing, max 8s/scene, visual change every 3s
- 6 scenes are responsive: CodeDisplay, ComparisonSplit, BeforeAfter, ThreeColumnCompare, MetricDashboard, SplitCodeComparison
