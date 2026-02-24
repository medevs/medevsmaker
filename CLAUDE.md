# medevsmaker — AI Video Director Project

## 3-Command Pipeline

```
/script <idea>        → script.json with full narration + scene plan (FREE)
                        User reviews narration + scene structure

/video <VideoName>    → Remotion code + manifest.json + transcript.json (FREE)
                        Durations computed from narration word counts
                        User reviews visuals in Remotion Studio

/voiceover <VideoName> → TTS synthesis + audio integration ($$)
                        User reviews final video with audio

/sfx <VideoName>      → Sound effects + background music (FUTURE)
```

Each step has a validation checkpoint. Review output before proceeding to the next command.

## Custom Skills

### video-director — Powers `/script` and `/video`

**`/script <idea>`**: Research & Expand → Scene Planning → Narration Writing → `script.json`
**`/video <VideoName>`**: Duration Calc → Code Generation → manifest.json + transcript.json (pre-populated)

**Supported video types**: educational, promo, tutorial, explainer, social-clip, announcement, demo

### voiceover-director — Powers `/voiceover`

**`/voiceover <VideoName>`**: TTS Synthesis → Audio Integration

**Provider**: ElevenLabs (default), Cartesia, Edge TTS — switch via `TTS_PROVIDER` env var

## Project Structure

```
src/                                # Remotion project
  index.ts                          # registerRoot entry point
  Root.tsx                          # Composition registry (all videos)
  shared/                           # Reusable component library
    styles.ts                       # baseTokens + BRAND + SECTION_THEMES + CARD + MONO + SCENE_DEFAULTS
    animations.ts                   # EASINGS + entrances (incl. fadeUpSlow, fadeLeftSlow) + pulse + glowPulse
    transitions.ts                  # TRANSITIONS presets (fade, slide, wipe, clockWipe, springFade)
    components/                     # 20 building-block components
      AnimatedText.tsx              # Fade-up text
      Background.tsx                # Gradient background with overlay support
      CodeBlock.tsx                 # Typewriter code reveal
      DiagramBox.tsx                # Labeled box for diagrams
      DiagramArrow.tsx              # SVG animated arrow
      StatCounter.tsx               # Animated number counter
      BulletReveal.tsx              # Staggered bullet points
      SectionBadge.tsx              # Section number badge
      AccentBox.tsx                 # Colored-border card
      ProgressBar.tsx               # Video progress indicator
      Watermark.tsx                 # Persistent branding overlay (default: top-right)
      ParticleField.tsx             # Deterministic particle system
      GridPattern.tsx               # Subtle grid background
      VoiceoverLayer.tsx            # Audio layer for voiceover narration
      ColorBorderCard.tsx           # Left-colored-border card (signature element)
      PillBadge.tsx                 # ALL CAPS monospace badge pill
      SectionTracker.tsx            # Bottom-right persistent section overlay
      FeatureCounter.tsx            # Top-left feature breadcrumb
      FileTree.tsx                  # Directory structure visualization
      GradientText.tsx              # Inline gradient text with backgroundClip
    scenes/                         # 27 reusable scene templates
      HookQuestion.tsx              # Opening question
      TitleIntro.tsx                # Title + objectives
      SectionTitle.tsx              # Chapter marker
      ConceptExplain.tsx            # Heading + body + analogy
      DiagramFlow.tsx               # Animated boxes + arrows (+ pipeline variant)
      CodeDisplay.tsx               # Code + annotations (+ annotated layout)
      ComparisonSplit.tsx           # A vs B comparison (+ cards variant)
      StatHighlight.tsx             # Big number
      BulletRevealScene.tsx         # Progressive list
      VisualMetaphor.tsx            # Icon + analogy
      KeyTakeaway.tsx               # Section summary (+ insight variant)
      SummaryRecap.tsx              # Numbered recap
      Outro.tsx                     # Channel branding
      EndScreen.tsx                 # Polished end card with gradient text + glow CTA
      WarningCallout.tsx            # Danger callout
      StepSequence.tsx              # Numbered steps (+ card variant)
      ColdOpen.tsx                  # Dramatic opening statement
      BeforeAfter.tsx               # Before/after comparison with wipe reveal
      TimelineScene.tsx             # Horizontal/vertical timeline with node pop-ins
      DataChart.tsx                 # Animated bar chart (+ labeled variant)
      FeatureIntro.tsx              # Feature introduction with breadcrumb + pills
      ProgressiveTerminal.tsx       # Terminal-style progressive reveal
      DecisionTable.tsx             # Decision matrix with pill badge answers
      ThreeColumnCompare.tsx        # Three-way comparison cards
      FileTreeScene.tsx             # Directory structure scene
      KeyRuleCard.tsx               # Key insight with gradient emphasis
      ArchitectureDiagram.tsx       # Hub-spoke architecture layout
  <VideoName>/                      # One folder per generated video
    index.tsx                        # Main composition
    script.json                      # Production script with narration (from /script)
    manifest.json                    # Scene data with computed durations (from /video)
    styles.ts                        # Design tokens
    voiceover.ts                     # Generated: VOICEOVER_SCENES array
    transcript.json                  # Generated: narration pre-populated from script
    sections/                        # Section files (educational)
    scenes/                          # Scene files (short-form)

.agents/skills/                     # Skills (managed by npx skills)
  remotion-best-practices/           # Remotion API knowledge (from GitHub)
  video-director/                    # Powers /script and /video commands
    SKILL.md                         # Dual-mode workflow definition
    rules/
      prompt-expansion.md            # Phase 1 rules
      video-types.md                 # 7 video types with defaults
      audience-profile.md            # Target audience + tone + humor + engagement
      educational-scenes.md          # 27 scene type catalog
      long-form-architecture.md      # Section-based architecture
      narration-writing.md           # Narration writing rules (Phase 3)
      duration-calculation.md        # WPM formula + transition rules (Phase 4)
      assets/
        promo-example.tsx            # Reference: promo video
        tutorial-example.tsx         # Reference: tutorial video
        educational-example.tsx      # Reference: educational video
  voiceover-director/                # Powers /voiceover command
    SKILL.md                         # TTS synthesis + audio integration
    rules/
      transcript-generation.md       # Historical reference (narration rules moved to video-director)
      tts-providers.md               # Provider configuration guide
      audio-integration.md           # Remotion audio patterns

scripts/tts/                        # TTS synthesis pipeline
  types.ts                           # TTSProvider interface + manifest/transcript/script types
  utils.ts                           # Audio duration, word budget, frame offsets, duration calculation
  generate-transcript.ts             # Transcript generator (supports --from-script mode)
  generate-audio.ts                  # TTS synthesis runner
  providers/
    index.ts                         # Provider factory
    cartesia.ts                      # Cartesia implementation
    elevenlabs.ts                    # ElevenLabs implementation

public/vo/                          # Generated voiceover audio (gitignored)
  <VideoName>/                       # One folder per video
    scene-01.mp3                     # MP3 per scene

.claude/skills/                     # Symlinks -> .agents/skills/
commands/script/command.md           # /script slash command
commands/video/command.md            # /video slash command
commands/voiceover/command.md        # /voiceover slash command
```

## Remotion Conventions
- Always use `useCurrentFrame()` for animations — NEVER CSS transitions
- Spring configs: `{ damping: 200 }` smooth, `{ damping: 200, stiffness: 90 }` silky, `{ damping: 20, stiffness: 200 }` snappy, `{ damping: 8 }` bouncy, `{ damping: 15, stiffness: 80, mass: 2 }` heavy
- Always `extrapolateRight: 'clamp'` on interpolations
- Use `<AbsoluteFill>` + flexbox for layout
- Use `<TransitionSeries>` for scene sequencing within sections
- Use `<Series>` for chaining sections in educational videos
- Load fonts via `@remotion/google-fonts`
- Calculate `durationInFrames = seconds * fps`
- Educational videos import shared scenes from `src/shared/scenes/`
- Watermark position: `"top-right"` (avoids ProgressBar overlap)
- Visual-first: 60%+ content scenes should be visual-heavy
- Use `EndScreen` instead of basic `Outro` for polished end cards
- Script-first pipeline: narration drives scene durations (155 WPM formula)
- `/video` outputs `manifest.json` + `transcript.json` (pre-populated with narration from script.json)
- Voiceover: `<Audio>` from `@remotion/media`, placed inside `<Sequence>` via `VoiceoverLayer`
- Audio files in `public/vo/<VideoName>/`, referenced via `staticFile()`
- Per-section color theming: use `SECTION_THEMES.get(index)` for section accent colors
- Persistent overlays: `SectionTracker` (bottom-right), `FeatureCounter` (top-left, optional)
- Prefer `springSilky` + `fadeUpSlow`/`fadeLeftSlow` for polished, slower animations
- Use `ColorBorderCard` as the signature card element (left colored border)
- Use `PillBadge` for ALL CAPS monospace labels
- Use `GradientText` for key phrase emphasis
- Negative space: content in left 60-65% for FeatureIntro/KeyRuleCard, 80px+ outer padding
