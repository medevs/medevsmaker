---
name: video
description: "Converts video ideas into production-ready Remotion code via a script-first pipeline. Powers the /script command (6-phase: context gathering, web research, hook selection, scene planning, narration writing, quality review → script.json) and the /video command (duration calculation, code generation, manifest + transcript → working Remotion project). Use this skill whenever the user wants to create a video, generate a script, plan scenes, write narration, or produce Remotion animation code from a topic idea. Triggers on: /script, /video, 'make a video about', 'create a script for', 'generate video', 'scene plan', 'narration', video production workflows."
metadata:
  tags: video, remotion, animation, script, code-generation, educational
---

# Video Skill

You are an expert AI Video Director. This skill powers two commands in the script-first pipeline:

```
/script <idea>        → Phase 1-6: Context, Research, Hook, Scene Plan, Narration, Quality → script.json
/video <VideoName>    → Phase 7-9: Duration Calc, Code Gen, Manifest + Transcript → Remotion code
```

---

## /script MODE (Phases 1-6)

Triggered when the user runs `/script <idea>`. Takes a simple idea and produces a complete script.json with full narration.

### PHASE 1: CONTEXT GATHERING

**Goal**: Parse input, detect video type, apply defaults, read prior `/idea` output.

Full rules: [rules/context-gathering.md](rules/context-gathering.md)

1. Parse subject, type (short/news/explainer/tutorial), platform, style/duration hints
2. Detect `--format short` flag or auto-detect from platform/duration mentions (see [rules/context-gathering.md](rules/context-gathering.md))
3. Apply type defaults from [rules/video-types.md](rules/video-types.md) and audience from [rules/audience-profile.md](rules/audience-profile.md)
4. If `type: "short"`, load [rules/short-form.md](rules/short-form.md) for pacing, structure, and scene constraints
5. If `--from-idea` provided, read `idea.md` and extract competitive gaps, sources, angles

### PHASE 2: DEEP RESEARCH

**Goal**: Gather sourced facts to ground narration in real data.

Full rules: [rules/research-integration.md](rules/research-integration.md)

1. For `news`: research is **mandatory** — gather latest developments, key facts, sources
2. For `explainer`/`tutorial`: research **when claims involve stats, benchmarks, or current tech state**
3. Collect 5-10 sourced facts with claim, source name, URL, date
4. Reuse idea.md sources if `--from-idea` was used — don't re-research
5. Save findings to `productions/<date>-<slug>/research.md`

### PHASE 3: ANGLE & HOOK

**Goal**: Craft 3 hook variants using youtube hook frameworks, select the strongest.

Full rules: [rules/hook-selection.md](rules/hook-selection.md)

1. Generate 3 variants: Shock/Contradiction, Curiosity-Gap, + one rotating archetype
2. Map selected hook to HookQuestion (grab) + TitleIntro (promise)
3. For nano channel / search-first: prefer Curiosity-Gap or Shock/Contradiction
4. If `--from-idea`, use competitive gaps to differentiate from competitor hooks

### PHASE 4: SCENE PLANNING

**Goal**: Convert the production brief into a concrete scene plan. **No durations** — durations come from narration in Phase 7.

Full rules: [rules/educational-scenes.md](rules/educational-scenes.md) (scene catalog + selection priorities + sequencing)

For **short** (10-90s): flat TransitionSeries (3-8 scenes), single section, see [rules/short-form.md](rules/short-form.md).
For **news** (1-4 min): flat TransitionSeries (5-15 scenes) or section-based (one per news item).
For **explainer/tutorial** (3-10 min): section-based, 3-8 scenes per section.

Scene plan format:
```
### Section N: [Title] (N scenes)
| # | Scene Type | Content Summary | Visual Direction |
```

### PHASE 5: NARRATION WRITING

**Goal**: Write natural voiceover narration for every scene.

Full rules: [rules/narration-writing.md](rules/narration-writing.md) (patterns, TTS optimization, attribution, retention)

Key principles: write naturally (durations computed from word counts), never read on-screen text, conversational peer tone, vary rhythm, 1 humor beat per section, attribute sourced claims, forward hooks at section ends.

### PHASE 6: QUALITY REVIEW

**Goal**: Run script-critic agent on the generated script.json.

The critic checks: unattributed claims, hook strength, pacing, missing visuals, tone, structure, source attribution, and retention patterns. Present findings alongside the script.

### script.json Output Format

```json
{
  "videoName": "HowTheWebWorks",
  "type": "educational",
  "fps": 30,
  "resolution": { "width": 1920, "height": 1080 },
  "meta": {
    "learningObjectives": ["Understand client-server model", "Know how DNS works"],
    "audienceProfile": "vibe-coders",
    "humorStyle": "dry-tech",
    "ideaSource": "productions/2026-04-01/idea.md",
    "researchFile": "productions/2026-04-01-how-the-web-works/research.md"
  },
  "style": {
    "fontHeading": "Inter",
    "fontBody": "Inter",
    "fontMono": "JetBrains Mono",
    "background": "dark gradient"
  },
  "sections": [
    {
      "sectionIndex": 1,
      "title": "Introduction + DNS",
      "sectionTone": "curious, building intrigue",
      "sectionColor": "#818CF8",
      "humorScene": 5,
      "scenes": [
        {
          "sceneIndex": 1,
          "sceneType": "HookQuestion",
          "narration": "Every time you click a link, an invisible chain reaction fires off across the entire planet, and it all happens before you even blink.",
          "narratorTone": "mysterious, playful",
          "visualDirection": "Big question on dark background with particle field",
          "onScreenText": ["What actually happens when you click a link?"],
          "props": {
            "question": "What actually happens when you click a link?",
            "subtext": "It's more complex than you think"
          },
          "sources": [
            {
              "claim": "1.1 trillion DNS queries per day",
              "source": "Cloudflare Radar",
              "url": "https://radar.cloudflare.com/",
              "date": "2026-03-28"
            }
          ]
        }
      ]
    }
  ]
}
```

**Key**: script.json has **no durations, no transitions**. Those are computed by `/video`. The `sources` and `meta.ideaSource`/`meta.researchFile` fields are optional.

For short-form script.json format, see [rules/short-form.md](rules/short-form.md). Key differences: `type: "short"`, `resolution: { width: 1080, height: 1920 }`, single section titled "Main", short-specific meta fields (`targetDuration`, `loopSetup`, `hookStrategy`, `shortGoal`).

### /script Execution Flow

1. **Context Gathering** (Phase 1) — Parse input, detect type, apply defaults, read idea.md if `--from-idea`
2. **Deep Research** (Phase 2) — Gather sourced facts via web search, save to research.md
3. **Angle & Hook** (Phase 3) — Generate 3 hook variants, select strongest for search-first
4. **Scene Planning** (Phase 4) — Create scene plan from [rules/educational-scenes.md](rules/educational-scenes.md)
5. **Narration Writing** (Phase 5) — Write narration per [rules/narration-writing.md](rules/narration-writing.md) with source attribution + retention patterns
6. **Output script.json** — Write to `src/videos/<VideoName>/script.json` (and copy to `productions/<date>-<slug>/`)
7. **Quality Review** (Phase 6) — Dispatch `script-critic` agent, present findings alongside script
8. **Present for review** — Show hook variants, scene plan, key narration excerpts, and critic feedback
9. **Suggest next step**: "After reviewing, run `/video <VideoName>` to generate Remotion code."

---

## /video MODE (Phases 7-9)

Triggered when the user runs `/video <VideoName>`. Reads script.json and generates complete Remotion code with computed durations.

### Prerequisites

- `src/videos/<VideoName>/script.json` must exist (generated by `/script`)
- If no script.json exists, tell the user to run `/script` first

### PHASE 7: DURATION CALCULATION

**Goal**: Compute scene durations from narration word counts.

Full rules: [rules/duration-calculation.md](rules/duration-calculation.md)

For each scene in script.json:
1. Count words in `narration`
2. Apply the WPM formula:
   - Long-form (news/explainer/tutorial): `baseDuration = (wordCount / 155) * 60`, padding 0.5s
   - Short-form (short): `baseDuration = (wordCount / 170) * 60`, padding 0.3s, clamp 3-8s
3. Round up to nearest 0.5s: `rounded = Math.ceil(paddedDuration * 2) / 2`
4. Apply minimum: `finalDuration = max(rounded, MIN_DURATIONS[sceneType])`
5. Assign transitions between scenes (see duration-calculation.md — use `shortFade` for shorts)
6. Calculate section frame totals and video total frames

### PHASE 8: CODE GENERATION

**Goal**: Generate clean, working Remotion code from the script + computed durations.

#### Output File Structure — Short-Form (type: "short")

```
src/
  videos/
    VideoName/
    index.tsx              # Flat TransitionSeries — no sections/, no section files
    manifest.json          # Flat scene list with computed durations
    transcript.json        # Pre-populated with narration from script
    styles.ts              # Colors, fonts, tokens
  Root.tsx                 # Updated with Composition: width=1080, height=1920
```

**Short-form code generation rules:**
- Register Composition in Root.tsx with `width={1080} height={1920} fps={30}`
- Generate flat `TransitionSeries` (no `<Series>` section wrapper)
- Always include `<CaptionOverlay captions={[]} />` (populated by `/voiceover`)
- Always include `<Background overlay="particles" />`
- Use `shortFade` (8 frames) transitions between scenes
- NO ProgressBar, SectionTracker, FeatureCounter, or Watermark overlays
- All scenes get padding via `useLayoutMode().contentPadding` (safe zone aware)
- Import scenes from `src/shared/scenes/` — do NOT create video-specific scene files

#### Output File Structure — News/Promo (Short-Duration Long-Form)

```
src/
  videos/
    VideoName/
    index.tsx              # Main composition — wires scenes via TransitionSeries
    manifest.json          # Structured scene data for voiceover pipeline
    transcript.json        # Pre-populated with narration from script
    scenes/
      HeroScene.tsx        # One file per scene (if custom needed)
    styles.ts              # All constants: colors, fonts, sizes, timing
  Root.tsx                 # Updated with new Composition entry
```

#### Output File Structure — Explainer/Tutorial (Long-Form)

```
src/
  videos/
    VideoName/
    index.tsx              # Main composition — chains sections via <Series>
    manifest.json          # Structured scene data for voiceover pipeline
    transcript.json        # Pre-populated with narration from script
    styles.ts              # Video-specific colors, fonts, tokens
    sections/
      Section1.tsx         # Each section: TransitionSeries of shared scenes
      Section2.tsx
      Section3.tsx
      ...
    scenes/                # Optional: video-specific custom scenes (rare)
  Root.tsx                 # Updated with new Composition entry
```

Architecture details: [rules/long-form-architecture.md](rules/long-form-architecture.md)

#### Shared Components

All video types use shared building-block components from `src/shared/`:

**Components** (`src/shared/components/`): AnimatedText, Background, CodeBlock, DiagramBox, DiagramArrow, StatCounter, BulletReveal, SectionBadge, AccentBox, ProgressBar, Watermark, ParticleField, GridPattern, VoiceoverLayer, ColorBorderCard, PillBadge, SectionTracker, FeatureCounter, FileTree, GradientText, GlassCard, TextEffect, CaptionOverlay

**Scene Templates** (`src/shared/scenes/`): HookQuestion, TitleIntro, SectionTitle, ConceptExplain, DiagramFlow, CodeDisplay, ComparisonSplit, StatHighlight, BulletRevealScene, VisualMetaphor, KeyTakeaway, SummaryRecap, Outro, EndScreen, WarningCallout, StepSequence, ColdOpen, BeforeAfter, TimelineScene, DataChart, FeatureIntro, ProgressiveTerminal, DecisionTable, ThreeColumnCompare, FileTreeScene, KeyRuleCard, ArchitectureDiagram, QuoteCard, AnimatedDiagram, MetricDashboard, ProcessAnimation, SplitCodeComparison

**Visual Utilities** (`src/shared/`): animations.ts (EASINGS, entrances incl. fadeUpSlow/fadeLeftSlow/slideAndFade/dropBounce/zoomBlur, pulse, glowPulse, float, shimmer, breathe), transitions.ts (TRANSITIONS presets incl. flip, shortFade + OVERLAYS for light leaks), styles.ts (SHADOWS incl. deepGlow, GRADIENTS incl. aurora, SECTION_THEMES, CARD, GLASS, MONO, SCENE_ALTERNATION, spring configs incl. springSilky), formats.ts (FORMAT_PRESETS, SAFE_ZONES, useLayoutMode hook for responsive scenes)

Import these instead of re-implementing. See [rules/educational-scenes.md](rules/educational-scenes.md) for full prop documentation.

#### styles.ts Pattern

```tsx
import { loadFont } from "@remotion/google-fonts/PlusJakartaSans";

const { fontFamily: headingFont } = loadFont("normal", {
  weights: ["800"],
  subsets: ["latin"],
});

export const COLORS = {
  primary: "#6366f1",
  secondary: "#8b5cf6",
  accent: "#06b6d4",
  background: "#0f0f1a",
  text: "#f8fafc",
} as const;

export const FONTS = {
  heading: headingFont,
  body: headingFont, // or separate font
} as const;

export const SIZES = {
  headingLg: 76, headingMd: 56, headingSm: 40,
  body: 32, bodySmall: 24, caption: 18,
} as const;

export const TIMING = {
  sceneFade: 15,      // frames for scene transitions
  elementEntry: 20,   // frames for element entrance
  staggerDelay: 8,    // frames between staggered items
} as const;
```

### PHASE 9: MANIFEST + TRANSCRIPT GENERATION

**Goal**: Output manifest.json (for voiceover pipeline) and transcript.json (pre-populated with narration from script).

#### manifest.json

```json
{
  "videoName": "HowTheWebWorks",
  "fps": 30,
  "totalFrames": 5833,
  "meta": {
    "learningObjectives": ["Understand client-server model", "Know how DNS works"],
    "audienceProfile": "vibe-coders",
    "humorStyle": "dry-tech"
  },
  "sections": [
    {
      "sectionIndex": 1,
      "title": "The Client",
      "durationFrames": 1250,
      "sectionColor": "#6366f1",
      "sectionTone": "curious, building anticipation",
      "humorScene": 5,
      "scenes": [
        {
          "sceneIndex": 1,
          "sceneType": "HookQuestion",
          "durationSeconds": 7.5,
          "transitionAfter": { "type": "fade", "frames": 15 },
          "narrationIntent": "Create urgency — make them feel they're missing something",
          "onScreenText": ["What actually happens when you click a link?"],
          "narratorTone": "mysterious, slightly playful",
          "props": {
            "question": "What actually happens when you click a link?",
            "subtext": "It's more complex than you think"
          }
        }
      ]
    }
  ]
}
```

**Mapping from script.json to manifest.json**:
- `narrationIntent` ← copy `visualDirection` from script.json (documents what the scene accomplishes)
- `durationSeconds` ← computed from narration word count (Phase 4)
- `transitionAfter` ← assigned in Phase 4
- `onScreenText` ← copied from script.json
- `narratorTone` ← copied from script.json
- `props` ← copied from script.json
- Section-level fields ← copied from script.json

#### transcript.json (Pre-populated)

Generate `transcript.json` with narration already filled from script.json:

```json
{
  "videoName": "HowTheWebWorks",
  "voiceId": "",
  "scenes": [
    {
      "sceneIndex": 1,
      "sectionIndex": 1,
      "sceneType": "HookQuestion",
      "durationSeconds": 7.5,
      "effectiveDurationSeconds": 7.0,
      "transitionAfterFrames": 15,
      "wordBudget": 17,
      "onScreenText": ["What actually happens when you click a link?"],
      "narrationIntent": "Create urgency — make them feel they're missing something",
      "narratorTone": "mysterious, slightly playful",
      "narration": "Every time you click a link, an invisible chain reaction fires off across the entire planet, and it all happens before you even blink."
    }
  ]
}
```

The `narration` field is **pre-populated** from script.json — no need for a separate `/transcript` command.

**CLI shortcut**: After generating manifest.json, you can run `node --strip-types scripts/tts/generate-transcript.ts <VideoName> --from-script` to auto-generate transcript.json with precise calculated fields (`effectiveDurationSeconds`, `wordBudget`). This is more reliable than writing transcript.json manually.

### Code Requirements Checklist

- [ ] All animations use `useCurrentFrame()` + `interpolate()` or `spring()` — NEVER CSS transitions
- [ ] `<AbsoluteFill>` as root layout for every scene
- [ ] `<TransitionSeries>` for scene sequencing within sections
- [ ] `<Series>` for chaining sections in explainer/tutorial videos
- [ ] `<Sequence>` with `premountFor` for element timing within scenes
- [ ] `extrapolateRight: 'clamp'` on all interpolations
- [ ] Fonts loaded via `@remotion/google-fonts`
- [ ] `type` declarations for props (not `interface`)
- [ ] `durationInFrames = seconds * fps` calculated from narration-derived durations
- [ ] TransitionSeries total = sum(scene durations) - sum(transition durations)
- [ ] Explainer/tutorial videos: ProgressBar overlay on each Series.Sequence
- [ ] `manifest.json` generated from script.json + computed durations
- [ ] `transcript.json` generated with narration pre-populated from script.json

### /video Execution Flow

1. **Read script.json** — Parse from `src/videos/<VideoName>/script.json`
2. **Compute durations** (Phase 7) — Apply WPM formula to each scene's narration
3. **Assign transitions** (Phase 7) — Apply transition rules per duration-calculation.md
4. **Generate Remotion code** (Phase 8) — Write all files: styles.ts → sections → index.tsx → Root.tsx update
5. **Generate manifest.json + transcript.json** (Phase 9) — Pre-populated with narration
6. **Provide rendering instructions**:

```bash
# Preview in Remotion Studio
npx remotion studio

# Render to MP4
npx remotion render src/index.ts <CompositionId> out/video.mp4
```

7. **Suggest next step**: "After reviewing visuals, run `/voiceover <VideoName>` to synthesize audio."

---

## Layout Patterns (Quick Reference)

| Pattern | Use For | Key Style |
|---------|---------|-----------|
| **Centered Hero** | Title screens, single statements | `justifyContent: "center", alignItems: "center", padding: 80` |
| **Split Left-Right** | Feature + visual, product showcase | `flexDirection: "row", gap: 60, padding: 80` |
| **Stacked List** | Bullet points, benefits, steps | `justifyContent: "center", padding: 80, gap: 24` |
| **Top Title + Center** | Tutorial steps, demos | Title at top, flex-1 centered content below |
| **CTA / Closing** | Call-to-action, closing | Centered with heading, subtext, button, `gap: 32` |
| **Stat Highlight** | Numbers, metrics, social proof | Centered, 120px number, label below |
| **Vertical (9:16)** | Reels, TikTok, Shorts | `padding: "120px 60px"`, scale text up 1.3x |
| **Diagram** | Flows, processes, architectures | Title top, boxes+arrows centered, absolute positioning |
| **Comparison** | A vs B, before/after | Two equal columns with divider |
| **Code + Annotation** | Technical content | Code left (3/4), annotations right (1/4) |

All layouts use `<AbsoluteFill>` + flexbox. Use 8px grid spacing: 8/16/24/32/48/80px.

## Composite Animations

**Title with Underline** — Title fades up, then underline expands 15 frames later:
```tsx
const titleProgress = spring({ frame, fps, config: { damping: 200 } });
const underlineProgress = spring({ frame: frame - 15, fps, config: { damping: 200 } });
const underlineWidth = interpolate(underlineProgress, [0, 1], [0, 200], {
  extrapolateLeft: "clamp", extrapolateRight: "clamp",
});
```

**Number Counter with Label** — Number counts up, label fades in 10 frames later:
```tsx
const countProgress = spring({ frame, fps, config: { damping: 200 } });
const displayNumber = Math.round(interpolate(countProgress, [0, 1], [0, targetNumber]));
const labelProgress = spring({ frame: frame - 10, fps, config: { damping: 200 } });
```

## Design Rules

- Modern SaaS aesthetic by default
- Consistent spacing: 4px/8px grid system
- Maximum 2 font families per video
- Text minimum: 24px body, 48px headings at 1080p
- Background should complement, not compete with, foreground
- Transitions: 15-20 frames (0.5-0.67s at 30fps)

## Remotion API Reference

For Remotion-specific patterns (spring configs, interpolation, TransitionSeries, Sequence/Series, font loading, text animations, compositions), use the **remotion-best-practices** skill.

---

## Remotion Code Generation Rules

These apply to `/video` (Phases 8-9). For `/script` rules, see each phase's linked rule file.

### Why frame-based animation matters
Remotion renders each frame independently — CSS animations and `setTimeout` break because they depend on real-time playback. Use `useCurrentFrame()` + `interpolate()`/`spring()` for all motion. Add `extrapolateRight: 'clamp'` to prevent values from overshooting, and `premountFor` on `<Sequence>` so components initialize before they appear.

### Layout and fonts
Use `<AbsoluteFill>` + flexbox for layout (not manual `position: absolute`) because Remotion compositions need deterministic sizing. Load fonts via `@remotion/google-fonts` — CSS `@import` fails in server-side rendering.

### Component architecture
- Keep files under 150 lines — extract sub-components to stay readable
- Import shared scenes from `src/shared/scenes/` rather than re-implementing — consistency across videos matters more than customization
- Use `frame - delayFrames` for staggered springs inside Sequences (not the `delay` param, which counts from composition start)

### Visual consistency
- `EndScreen` over basic `Outro` — gradient text + glow CTA looks polished
- `<Watermark position="top-right">` — avoids ProgressBar overlap at bottom
- `<Background variant="aurora">` for opening sections, `"noiseField"` for technical sections, `"solidWithOrbs"` for data-heavy sections
- `<Background overlay="lightLeak">` for cinematic polish (use sparingly)
- Use `GlassCard` for key insight scenes (QuoteCard, KeyRuleCard) — frosted glass with `backdropFilter`
- Use `TextEffect` for hook variety: `"scramble"` on ColdOpen, `"neon"` on StatHighlight, `"glitch"` on WarningCallout
- Per-section color via `SECTION_THEMES.get(sectionIndex)` → `sectionColor` prop
- Vary transitions: import presets from `src/shared/transitions.ts` — use `flip` for dramatic changes, light leak overlays for major section breaks (1-2 per video max)
- `DataChart` variants: `"bars"` (default), `"pie"`/`"donut"` for proportions, `"line"` for trends, `"gauge"` for single metrics
- `DiagramArrow curved` prop for organic-feeling flow diagrams
- Scene constraints: see `educational-scenes.md` for selection priorities and sequencing rules

## Reference Files

- [rules/context-gathering.md](rules/context-gathering.md) — Phase 1: input parsing, type detection, idea.md integration
- [rules/research-integration.md](rules/research-integration.md) — Phase 2: research skill integration, source tagging
- [rules/hook-selection.md](rules/hook-selection.md) — Phase 3: youtube hook frameworks, variant selection
- [rules/video-types.md](rules/video-types.md) — 3 active video types (news, explainer, tutorial) with defaults, scenes, rules, palettes
- [rules/audience-profile.md](rules/audience-profile.md) — Target audience, tone rules, retention engineering
- [rules/educational-scenes.md](rules/educational-scenes.md) — Scene catalog (27 types), selection priorities, sequencing
- [rules/narration-writing.md](rules/narration-writing.md) — Narration writing, source attribution, retention patterns
- [rules/long-form-architecture.md](rules/long-form-architecture.md) — Section-based architecture for explainer/tutorial videos
- [rules/duration-calculation.md](rules/duration-calculation.md) — Duration calculation from narration
- [rules/assets/promo-example.tsx](rules/assets/promo-example.tsx) — Complete promo reference implementation
- [rules/assets/tutorial-example.tsx](rules/assets/tutorial-example.tsx) — Complete tutorial reference implementation
- [rules/assets/educational-example.tsx](rules/assets/educational-example.tsx) — Complete educational reference implementation (section pattern)
