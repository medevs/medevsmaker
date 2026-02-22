# medevsmaker — AI Video Director Project

## Custom Skills

### /video-director — AI Video Director
Slash command that converts a simple idea into a complete Remotion video.

**Usage**: `/video-director <idea>`

**Supported video types**: educational, promo, tutorial, explainer, social-clip, announcement, demo

**3-phase workflow**: Research & Expand -> Scene Planning -> Batched Code Generation (+ manifest.json)

### /voiceover-director — Voiceover Director
Adds voiceover narration to an existing video. Generates transcript, synthesizes TTS audio via Cartesia, and integrates into the composition.

**Usage**: `/voiceover <VideoName>`

**3-phase workflow**: Transcript Generation -> TTS Synthesis -> Audio Integration

**Provider**: Cartesia (provider-agnostic — switch via `TTS_PROVIDER` env var)

## Project Structure

```
src/                                # Remotion project
  index.ts                          # registerRoot entry point
  Root.tsx                          # Composition registry (all videos)
  shared/                           # Reusable component library
    styles.ts                       # baseTokens + BRAND palette + SCENE_DEFAULTS
    animations.ts                   # EASINGS + entrances + pulse + glowPulse
    transitions.ts                  # TRANSITIONS presets (fade, slide, wipe, clockWipe, springFade)
    components/                     # 13 building-block components
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
    scenes/                         # 20 reusable scene templates
      HookQuestion.tsx              # Opening question
      TitleIntro.tsx                # Title + objectives
      SectionTitle.tsx              # Chapter marker
      ConceptExplain.tsx            # Heading + body + analogy
      DiagramFlow.tsx               # Animated boxes + arrows
      CodeDisplay.tsx               # Code + annotations
      ComparisonSplit.tsx           # A vs B comparison
      StatHighlight.tsx             # Big number
      BulletRevealScene.tsx         # Progressive list
      VisualMetaphor.tsx            # Icon + analogy
      KeyTakeaway.tsx               # Section summary
      SummaryRecap.tsx              # Numbered recap
      Outro.tsx                     # Channel branding
      EndScreen.tsx                 # Polished end card with gradient text + glow CTA
      WarningCallout.tsx            # Danger callout
      StepSequence.tsx              # Numbered steps
      ColdOpen.tsx                  # Dramatic opening statement
      BeforeAfter.tsx               # Before/after comparison with wipe reveal
      TimelineScene.tsx             # Horizontal/vertical timeline with node pop-ins
      DataChart.tsx                 # Animated bar chart with spring bars
  <VideoName>/                      # One folder per generated video
    index.tsx                        # Main composition
    manifest.json                    # Scene data for voiceover pipeline
    styles.ts                        # Design tokens
    voiceover.ts                     # Generated: VOICEOVER_SCENES array
    transcript.json                  # Generated: narration text per scene
    sections/                        # Section files (educational)
    scenes/                          # Scene files (short-form)

.agents/skills/                     # Skills (managed by npx skills)
  remotion-best-practices/           # Remotion API knowledge (from GitHub)
  video-director/                    # Video Director workflow (local)
    SKILL.md                         # 3-phase workflow definition
    rules/
      prompt-expansion.md            # Phase 1 rules
      video-types.md                 # 7 video types with defaults
      audience-profile.md            # Target audience + tone + humor + engagement
      educational-scenes.md          # 20 scene type catalog
      long-form-architecture.md      # Section-based architecture
      assets/
        promo-example.tsx            # Reference: promo video
        tutorial-example.tsx         # Reference: tutorial video
        educational-example.tsx      # Reference: educational video
  voiceover-director/                # Voiceover Director workflow (local)
    SKILL.md                         # 3-phase workflow definition
    rules/
      transcript-generation.md       # Narration writing rules per scene type
      tts-providers.md               # Provider configuration guide
      audio-integration.md           # Remotion audio patterns

scripts/tts/                        # TTS synthesis pipeline
  types.ts                           # TTSProvider interface + manifest/transcript types
  utils.ts                           # Audio duration, word budget, frame offsets
  generate-transcript.ts             # Skeleton transcript generator
  generate-audio.ts                  # TTS synthesis runner
  providers/
    index.ts                         # Provider factory
    cartesia.ts                      # Cartesia implementation

public/vo/                          # Generated voiceover audio (gitignored)
  <VideoName>/                       # One folder per video
    scene-01.mp3                     # MP3 per scene

.claude/skills/                     # Symlinks -> .agents/skills/
commands/video/command.md            # /video slash command
commands/voiceover/command.md        # /voiceover slash command
```

## Remotion Conventions
- Always use `useCurrentFrame()` for animations — NEVER CSS transitions
- Spring configs: `{ damping: 200 }` smooth, `{ damping: 20, stiffness: 200 }` snappy, `{ damping: 8 }` bouncy, `{ damping: 15, stiffness: 80, mass: 2 }` heavy
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
- Phase 3 must output `manifest.json` alongside code (for voiceover pipeline)
- Voiceover: `<Audio>` from `@remotion/media`, placed inside `<Sequence>` via `VoiceoverLayer`
- Audio files in `public/vo/<VideoName>/`, referenced via `staticFile()`
- `npm run voiceover <VideoName>` synthesizes audio from transcript
