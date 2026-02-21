# medevsmaker — AI Video Director Project

## Custom Skills

### /video — AI Video Director
Slash command that converts a simple idea into a complete Remotion video.

**Usage**: `/video <idea>`

**Supported video types**: educational, promo, tutorial, explainer, social-clip, announcement, demo

**3-phase workflow**: Research & Expand -> Scene Planning -> Batched Code Generation

## Project Structure

```
src/                                # Remotion project
  index.ts                          # registerRoot entry point
  Root.tsx                          # Composition registry (all videos)
  shared/                           # Reusable component library
    styles.ts                       # baseTokens + BRAND palette + SCENE_DEFAULTS
    components/                     # 10 building-block components
      AnimatedText.tsx              # Fade-up text
      Background.tsx                # Gradient background
      CodeBlock.tsx                 # Typewriter code reveal
      DiagramBox.tsx                # Labeled box for diagrams
      DiagramArrow.tsx              # SVG animated arrow
      StatCounter.tsx               # Animated number counter
      BulletReveal.tsx              # Staggered bullet points
      SectionBadge.tsx              # Section number badge
      AccentBox.tsx                 # Colored-border card
      ProgressBar.tsx               # Video progress indicator
    scenes/                         # 15 reusable scene templates
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
      WarningCallout.tsx            # Danger callout
      StepSequence.tsx              # Numbered steps
  <VideoName>/                      # One folder per generated video
    index.tsx                        # Main composition
    styles.ts                        # Design tokens
    sections/                        # Section files (educational)
    scenes/                          # Scene files (short-form)

.agents/skills/                     # Skills (managed by npx skills)
  remotion-best-practices/           # Remotion API knowledge (from GitHub)
  video-director/                    # Video Director workflow (local)
    SKILL.md                         # 3-phase workflow definition
    rules/
      prompt-expansion.md            # Phase 1 rules
      video-types.md                 # 7 video types with defaults
      audience-profile.md            # Target audience + tone
      educational-scenes.md          # 15 scene type catalog
      long-form-architecture.md      # Section-based architecture
      assets/
        promo-example.tsx            # Reference: promo video
        tutorial-example.tsx         # Reference: tutorial video
        educational-example.tsx      # Reference: educational video

.claude/skills/                     # Symlinks -> .agents/skills/
commands/video/command.md            # /video slash command
```

## Remotion Conventions
- Always use `useCurrentFrame()` for animations — NEVER CSS transitions
- Use `spring()` with `{ damping: 200 }` for smooth entrances
- Use `<AbsoluteFill>` + flexbox for layout
- Use `<TransitionSeries>` for scene sequencing within sections
- Use `<Series>` for chaining sections in educational videos
- Load fonts via `@remotion/google-fonts`
- Calculate `durationInFrames = seconds * fps`
- Educational videos import shared scenes from `src/shared/scenes/`
