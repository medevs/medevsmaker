# medevsmaker — AI Video Director

Generate complete Remotion videos from a single prompt. Built for the medevsmaker YouTube channel — 65 educational videos targeting vibe coders and non-technical AI builders.

## Quick Start

```bash
# Install dependencies
npm install

# Preview videos in Remotion Studio
npx remotion studio

# Generate a video (in Claude Code)
/video How the Web Actually Works
```

## How It Works

The `/video` command triggers a 3-phase AI workflow that turns a simple idea into production-ready Remotion code.

### Phase 1: Research & Expand

You type a topic. Claude:

1. **Detects the video type** — educational (conceptual topics), promo, tutorial, explainer, social-clip, announcement, or demo
2. **Looks up the content plan** — if `youtube-content-plan.md` exists, pulls bullet points for the matching topic
3. **Generates a production brief** — duration, sections, learning objectives, color palette, typography, audience context

**Type detection examples:**
| Input | Detected Type |
|-------|--------------|
| `How the Web Actually Works` | educational |
| `Promo for AI note-taking app` | promo |
| `Tutorial: set up Next.js` | tutorial |
| `Instagram reel: 3 reasons to use TypeScript` | social-clip |

Educational is the default for conceptual/learning topics. Promo is the default for product/service topics.

### Phase 2: Scene Planning

Claude creates a **scene manifest** — a table mapping every scene to one of 15 reusable scene types.

```
Section 1: Introduction (~32s, 6 scenes)
| # | Scene Type      | Duration | Content                          |
|---|-----------------|----------|----------------------------------|
| 1 | HookQuestion    | 4s       | "What happens when you click..." |
| 2 | TitleIntro      | 7s       | Title + 3 learning objectives    |
| 3 | SectionTitle    | 3s       | "01 — The Client"                |
| 4 | ConceptExplain  | 7s       | Browser = client concept          |
| 5 | VisualMetaphor  | 6s       | Phone analogy                    |
| 6 | KeyTakeaway     | 5s       | Section summary                  |
```

**Rules enforced:**
- Video starts with HookQuestion + TitleIntro
- Video ends with SummaryRecap + Outro
- Each section bookended by SectionTitle and KeyTakeaway
- No 3+ consecutive same scene type
- Dense/light alternation (concept -> metaphor -> diagram)
- Every concept gets an analogy

### Phase 3: Batched Code Generation

Claude writes files in dependency order:

```
src/HowTheWebWorks/
  styles.ts              # 1st — colors, fonts, tokens
  sections/
    Section1.tsx          # 2nd — imports shared scene components
    Section2.tsx
    Section3.tsx
    Section4.tsx
  index.tsx               # 3rd — chains sections with <Series>

src/Root.tsx              # 4th — adds <Composition> entry
```

Then provides render commands:
```bash
npx remotion studio                                          # Preview
npx remotion render src/index.ts HowTheWebWorks out/video.mp4  # Export
```

---

## Project Structure

```
src/
  index.ts                          # registerRoot entry point
  Root.tsx                          # Composition registry (all videos)
  shared/                           # Reusable library
    styles.ts                       # baseTokens + BRAND palette + SCENE_DEFAULTS
    components/                     # 10 building-block components
      AnimatedText.tsx              # Fade-up text with spring animation
      Background.tsx                # Gradient background layer
      CodeBlock.tsx                 # Syntax-highlighted code with typewriter
      DiagramBox.tsx                # Labeled box for flow diagrams
      DiagramArrow.tsx              # SVG animated arrow between points
      StatCounter.tsx               # Animated number counter (0 -> target)
      BulletReveal.tsx              # Staggered bullet point list
      SectionBadge.tsx              # Section number badge (01, 02...)
      AccentBox.tsx                 # Colored-border card (info/warning/success/danger)
      ProgressBar.tsx               # Video progress indicator (section dots)
    scenes/                         # 15 scene templates
      HookQuestion.tsx              # Provocative opening question
      TitleIntro.tsx                # Video title + learning objectives
      SectionTitle.tsx              # Chapter marker (badge + title)
      ConceptExplain.tsx            # Heading + body + analogy
      DiagramFlow.tsx               # Animated boxes + arrows
      CodeDisplay.tsx               # Code block + annotations
      ComparisonSplit.tsx           # Two-column A vs B
      StatHighlight.tsx             # Big animated number
      BulletRevealScene.tsx         # Progressive bullet list
      VisualMetaphor.tsx            # Large emoji + analogy text
      KeyTakeaway.tsx               # Accent box summary
      SummaryRecap.tsx              # Numbered recap list
      Outro.tsx                     # Channel branding + CTA
      WarningCallout.tsx            # Red/amber danger callout
      StepSequence.tsx              # Numbered steps with badges
  <VideoName>/                      # One folder per generated video
    index.tsx                       # Main composition
    styles.ts                       # Video-specific design tokens
    sections/                       # Section files (educational)
    scenes/                         # Scene files (short-form)

.agents/skills/                     # Skills source (managed by npx skills)
  remotion-best-practices/          # Remotion API knowledge
  video-director/                   # Video Director workflow
    SKILL.md                        # Main skill definition (3-phase workflow)
    rules/
      prompt-expansion.md           # Phase 1 rules
      video-types.md                # 7 video types with defaults
      audience-profile.md           # Target audience + tone rules
      educational-scenes.md         # 15 scene type catalog
      long-form-architecture.md     # Section-based code architecture
      assets/
        promo-example.tsx           # Reference: short promo video
        tutorial-example.tsx        # Reference: tutorial video
        educational-example.tsx     # Reference: long-form educational video

commands/video/command.md           # /video slash command definition
```

---

## Video Types

### Educational (NEW — primary type)

| Setting | Value |
|---------|-------|
| Duration | 3-10 minutes (default 5 min) |
| Scenes | 15-60 |
| Sections | 3-7 |
| FPS | 30 |
| Resolution | 1920x1080 |
| Architecture | Section-based (`<Series>` + `<TransitionSeries>`) |

**Structure:** Hook -> Title Intro -> [Section 1..N] -> Summary Recap -> Outro

Each section: SectionTitle -> [Content Scenes] -> KeyTakeaway

### Short-Form Types

| Type | Default Duration | Scenes | Use Case |
|------|-----------------|--------|----------|
| Promo | 20s | 3-6 | Product launches, marketing |
| Tutorial | 90s | 8-12 | Step-by-step guides |
| Explainer | 45s | 5-8 | Concept explanations |
| Social Clip | 15s | 3-4 | Reels, TikTok, Shorts |
| Announcement | 20s | 5 | Feature releases |
| Demo | 45s | 5-7 | Product walkthroughs |

---

## Shared Component Library

### Building-Block Components (`src/shared/components/`)

| Component | What It Does |
|-----------|-------------|
| `AnimatedText` | Text with fade-up spring animation |
| `Background` | Gradient background (static or animated) |
| `CodeBlock` | Typewriter code reveal with line numbers and highlights |
| `DiagramBox` | Labeled box that scales in (for flow diagrams) |
| `DiagramArrow` | SVG arrow that draws itself between two points |
| `StatCounter` | Number that counts from 0 to target with spring |
| `BulletReveal` | Bullet points that stagger in from the left |
| `SectionBadge` | Numbered badge (01, 02...) with pop-in animation |
| `AccentBox` | Colored card with left border (info/warning/success/danger) |
| `ProgressBar` | Section dots at the bottom of the screen |

### Scene Templates (`src/shared/scenes/`)

| Scene | Duration | Layout | Used For |
|-------|----------|--------|----------|
| `HookQuestion` | 4-5s | Centered hero | Opening question (always first) |
| `TitleIntro` | 6-8s | Centered + divider | Title + objectives (always second) |
| `SectionTitle` | 3-4s | Centered + badge | Chapter markers |
| `ConceptExplain` | 6-8s | Left-aligned | Core teaching content |
| `DiagramFlow` | 8-12s | Title + diagram | Processes, flows, architectures |
| `CodeDisplay` | 8-15s | Code + annotations | Technical code content |
| `ComparisonSplit` | 6-10s | Two columns + VS | A vs B comparisons |
| `StatHighlight` | 4-6s | Centered number | Key statistics |
| `BulletRevealScene` | 5-10s | Heading + bullets | Lists of items |
| `VisualMetaphor` | 5-8s | Icon + text | Analogies for abstract concepts |
| `KeyTakeaway` | 4-6s | Centered + accent box | Section summaries (end of each section) |
| `SummaryRecap` | 8-12s | Numbered list | Video recap (near end) |
| `Outro` | 4-6s | Centered branding | Channel CTA (always last) |
| `WarningCallout` | 5-7s | Centered + danger box | Mistakes, pitfalls |
| `StepSequence` | 8-12s | Heading + numbered steps | How-to processes |

---

## Architecture: Educational Videos

Educational videos use a **section pattern** instead of one flat TransitionSeries.

### Why?

A 5-minute video at 30fps has ~25-35 scenes. Putting them all in one TransitionSeries makes the file enormous and hard to maintain. Instead:

- `index.tsx` uses `<Series>` to chain sections sequentially
- Each `sections/SectionN.tsx` uses `<TransitionSeries>` for its own scenes
- Shared scene components are imported from `src/shared/scenes/` — never re-implemented
- `<ProgressBar>` is overlaid on each section to show video progress

### Duration Calculation

```
Per section:  sectionFrames = sum(scene durations) - (numTransitions * 15)
Total video:  totalFrames = sum(all sectionFrames)
```

Note: `<Series>` has no transitions between sections. SectionTitle scenes act as natural visual breaks.

### Example (from `educational-example.tsx`)

```
Section 1 (Intro):      885 frames  = (4+7+3+7+6+5)*30 - 5*15
Section 2 (The Server):  990 frames  = (3+7+10+10+5)*30 - 4*15
Section 3 (The Database): 945 frames  = (3+7+8+5+6+5)*30 - 5*15
Section 4 (Wrap-up):     435 frames  = (10+5)*30 - 1*15
Total:                  3255 frames  = 108.5 seconds (~1:49)
```

---

## Design System

### Brand Palette (medevsmaker-educational)

| Token | Color | Hex | Usage |
|-------|-------|-----|-------|
| indigo | Purple-blue | `#6366f1` | Primary, section badges |
| violet | Purple | `#8b5cf6` | Secondary, concept accents |
| cyan | Blue-green | `#06b6d4` | Accent, bullet markers, code text |
| amber | Yellow-orange | `#f59e0b` | Warnings, highlights |
| green | Emerald | `#10b981` | Success, "good" examples |
| red | Red | `#ef4444` | Danger, "bad" examples |
| bg | Dark navy | `#0f0f1a` | Background |
| text | Near white | `#f8fafc` | Primary text |
| textMuted | Slate gray | `#94a3b8` | Secondary text, labels |

### Animation Defaults

| Constant | Value | Usage |
|----------|-------|-------|
| `springSmooth` | `{ damping: 200 }` | Text, fade-ups, gentle entrances |
| `springSnappy` | `{ damping: 20, stiffness: 200 }` | Badges, buttons, pop-ins |
| `transitionFrames` | 15 (0.5s at 30fps) | Fade between scenes |
| `staggerDelay` | 8 frames | Between staggered list items |

### Remotion Rules

- All animations via `useCurrentFrame()` + `interpolate()` / `spring()` — NEVER CSS
- Always `extrapolateRight: 'clamp'` on interpolations
- `<AbsoluteFill>` + flexbox for layout — never manual `position: absolute`
- Fonts via `@remotion/google-fonts` — never CSS `@import`
- `durationInFrames = seconds * fps`

---

## Target Audience

**Vibe coders** — build with AI tools (Cursor, Claude, Copilot) but lack deep CS understanding.

**Non-technical AI builders** — PMs, designers, founders using no-code/low-code + AI.

### Tone
- Direct, not condescending
- Peer, not teacher
- Practical, not theoretical
- Every concept gets an analogy

### On-Screen Text Limits
- Headings: max 6 words
- Body: max 15 words per line, max 2 lines
- Code: max 5 lines
- Bullets: max 8 words each, max 5 per scene
- Minimum 3 seconds reading time for any text

---

## Testing

### Compile check
```bash
npx remotion studio
```
Starts Remotion Studio. If shared components have import or syntax errors, they surface immediately during the webpack build.

### Generate a test video
```
/video How the Web Actually Works
```

### Verify the output

1. **Phase 1** — Brief shows type `educational`, learning objectives, 3-5 sections, medevsmaker palette
2. **Phase 2** — Scene manifest has 25-35 scenes using varied scene types, no 3+ consecutive same type
3. **Phase 3** — Files written to `src/HowTheWebWorks/` with section pattern
4. **Render** — `npx remotion studio` -> select composition -> scrub through
5. **Visual checks:**
   - Duration is ~3-5 minutes
   - Scenes are visually diverse (not all the same layout)
   - Flow is correct: hook -> intro -> sections -> summary -> outro
   - Animations are smooth (spring-based)
   - Progress bar visible at the bottom
   - Text is readable (proper sizing and contrast)

### Render to file
```bash
npx remotion render src/index.ts HowTheWebWorks out/video.mp4
```

---

## Skill Management

Skills are managed by the `npx skills` CLI:

```bash
npx skills list                    # Show installed skills
npx skills add <github-url>        # Install a skill from GitHub
npx skills init <path>             # Create a new skill
```

Source of truth: `.agents/skills/` (with symlinks in `.claude/skills/`)

---

## File Reference

| File | Purpose |
|------|---------|
| `SKILL.md` | Main skill definition — 3-phase workflow, constraints, code patterns |
| `rules/prompt-expansion.md` | Phase 1 — type detection, content plan lookup, brief format |
| `rules/video-types.md` | All 7 video types — defaults, scene structures, palettes |
| `rules/audience-profile.md` | Target audience, tone rules, text constraints |
| `rules/educational-scenes.md` | 15 scene types — props, durations, layout, animation, usage rules |
| `rules/long-form-architecture.md` | Section pattern — file structure, Series/TransitionSeries, duration math |
| `rules/assets/promo-example.tsx` | Reference: 11s promo video (3 scenes) |
| `rules/assets/tutorial-example.tsx` | Reference: 31s tutorial (5 scenes) |
| `rules/assets/educational-example.tsx` | Reference: 109s educational (4 sections, 19 scenes) |
