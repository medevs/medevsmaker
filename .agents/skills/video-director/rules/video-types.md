---
name: video-types
description: Unified video type reference — defaults, scene structures, creative rules, and color palettes
metadata:
  tags: video-type, defaults, templates, scenes
---

# Video Types

Four active types for the medevsmaker channel. Auto-detect from user input, default to `explainer`.

> **Historical alias**: `educational` maps to `explainer`. Existing script.json files with `type: "educational"` are treated as explainer.

---

## News

### When to Use
Daily AI news coverage, weekly roundups, trending topic breakdowns, tool/release announcements, industry developments. Fast-paced, current-events content.

### Defaults

| Setting | Value |
|---------|-------|
| Duration | 120s / 2 min (3600 frames) |
| Duration Range | 60-240s (1-4 min) |
| FPS | 30 |
| Resolution | 1920x1080 |
| Background | Subtle gradient (bg → bgLight) with particle overlay |
| Transitions | Mixed: fade(15), slide(20) — fast cuts |
| Pacing | fast |
| CTA | no (outro has subscribe CTA) |
| Typography | Heading: Inter / 800, Body: Inter / 400, Code: JetBrains Mono / 400 |

### Scene Structure

Durations are computed from narration word counts (see duration-calculation.md). The structure below shows scene order only:

```
ColdOpen or HookQuestion
  → Dramatic statement or provocative question about the news
  → Grab attention immediately

TitleIntro
  → Video title + what's covered today

─── News Item 1 ───
  SectionTitle → "01 — [Headline]"
  2-3 content scenes (ConceptExplain, StatHighlight, ComparisonSplit, DiagramFlow)
  KeyTakeaway → Why this matters

─── News Item 2-N ───
  (Same pattern, 3-6 news items total)

SummaryRecap
  → Quick recap of all items

EndScreen
  → Subscribe CTA
```

### Key Rules
- **Fast pacing** — shorter scenes, quicker transitions than explainer
- **Recency matters** — narration should reference dates, versions, sources
- **One headline per section** — don't combine news items
- **Visual-first** — StatHighlight for numbers, ComparisonSplit for before/after, DiagramFlow for how things connect
- **Attribution** — every claim needs a source (company blog, paper, announcement)
- **Max 6 news items, max 30 scenes** per video
- **Flat or section-based** — use flat TransitionSeries for short (1-2 min), section-based for longer
- **Humor** — 1 light beat per 2-3 items: dev reactions, absurd implications
- **Use shared scene components** — import from `src/shared/scenes/`

### Palette: medevsmaker-news
```
primary:    #6366f1 (indigo)
secondary:  #8b5cf6 (violet)
accent:     #06b6d4 (cyan)
background: #0f0f1a
bgLight:    #1a1a2e
text:       #f8fafc
textMuted:  #94a3b8
amber:      #f59e0b (highlights)
green:      #10b981 (positive news)
red:        #ef4444 (warnings, concerns)
```

---

## Explainer

### When to Use
Long-form conceptual teaching content: "How X Works", "Understanding Y", "Fundamentals of Z". Designed for the medevsmaker YouTube channel targeting vibe coders and non-technical AI builders. Uses the script-first pipeline: `/script` writes narration first, `/video` computes durations from word counts.

> This type also covers content previously labeled `educational`. They are the same.

### Defaults

| Setting | Value |
|---------|-------|
| Duration | 300s / 5 min (9000 frames) |
| Duration Range | 180-600s (3-8 min) |
| FPS | 30 |
| Resolution | 1920x1080 |
| Background | Subtle gradient (bg → bgLight) with particle overlay |
| Transitions | Mixed: fade(15), slide(20), wipe(18) — vary per section |
| Pacing | medium |
| CTA | no (outro has subscribe CTA) |
| Typography | Heading: Inter / 800, Body: Inter / 400, Code: JetBrains Mono / 400 |

### Scene Structure

Durations are computed from narration word counts (see duration-calculation.md). The structure below shows scene order only:

```
Hook
  → Provocative question or surprising stat
  → HookQuestion scene type

Title Intro
  → Video title + learning objectives
  → TitleIntro scene type

─── Section 1: [Topic] ───
  SectionTitle → "01 — [Title]"
  Content scenes (3-8 scenes)
    → Use: ConceptExplain, DiagramFlow, CodeDisplay,
      ComparisonSplit, StatHighlight, BulletRevealScene,
      VisualMetaphor, WarningCallout, StepSequence
  KeyTakeaway → Section summary

─── Section 2-N: [Topics] ───
  (Same pattern, 3-7 sections total)

Summary Recap
  → Numbered list of all sections covered
  → SummaryRecap scene type

EndScreen
  → Channel branding + subscribe CTA
  → EndScreen scene type (not basic Outro)
```

### Key Rules
- **One concept per scene** — never stack two ideas
- **Every concept needs an analogy** — connect to something they know
- **Alternate scene types** — no 3+ consecutive same type
- **Dense/light alternation** — heavy concept → visual metaphor → next concept
- **Visual-first** — 60%+ content scenes should be visual-heavy (diagrams, metaphors, charts, comparisons, timelines)
- **Humor** — 1 light humor beat per section: absurd analogies, dev jokes, unexpected consequences
- **Pattern interrupts** — break visual rhythm every 25-35 seconds (scene type change, humor, unexpected stat)
- **Section markers** — every section starts with SectionTitle, ends with KeyTakeaway
- **Max 60 scenes, max 7 sections** per video
- **Use shared scene components** — import from `src/shared/scenes/`
- **Section-based architecture** — `<Series>` for sections, `<TransitionSeries>` within
- **ProgressBar** on every section showing video progress

### Audience
See [audience-profile.md](audience-profile.md) for full audience definition and tone rules.

### Visual Polish
- Use `<Watermark position="top-right">` in index.tsx — top-right avoids ProgressBar overlap
- Use `<Background overlay="particles">` for visual depth
- Use `EndScreen` instead of `Outro` for polished end cards with gradient text and glow CTA
- Vary entrance props across scenes: typewriter hooks, scaleRotate titles, slideLeft section titles
- Use `glow` and `gradient` props on DiagramBox, AccentBox, StatCounter for emphasis
- Mix transition types across sections (don't use only fade)

### Per-Section Color Theming

Each section in an explainer video gets its own accent color from `SECTION_THEMES`:

```
Section 1: indigo (#6366f1)
Section 2: cyan (#06b6d4)
Section 3: amber (#f59e0b)
Section 4: green (#10b981)
Section 5: violet (#8b5cf6)
Section 6: red (#ef4444)
(cycles back for 7+ sections)
```

Pass `sectionColor` prop to all scenes and components within a section. This creates visual coherence within sections and contrast between them. The section color is used for:
- ColorBorderCard left borders
- PillBadge colors
- GradientText highlights
- SectionTracker active dot and label

### Persistent Overlays

Explainer videos use persistent overlays in `index.tsx`:
- **SectionTracker** (bottom-right) — shows current section name + dot progress
- **FeatureCounter** (top-left) — optional, shows "FEATURE X OF Y" for feature-focused videos
- **Watermark** (top-right) — medevsmaker branding
- **ProgressBar** (bottom) — video progress

The SectionTracker's `currentIndex` is computed from the current frame using cumulative section durations.

### Animation Style

Default animation style for polished explainer videos:
- **Spring**: `springSilky` (damping: 200, stiffness: 90) for most elements — slower, smoother than default
- **Stagger**: `staggerDelaySlow` (14 frames) between items — more deliberate pacing
- **Element entry**: `elementEntrySlow` (28 frames) for content elements
- **Entrances**: Prefer `fadeUpSlow` and `fadeLeftSlow` for subtler motion
- **Scale**: Cards enter at 0.97→1.0 scale, not 0.8→1.0 — barely perceptible but polished

### Scene Catalog
See [educational-scenes.md](educational-scenes.md) for all 27 reusable scene types with props, durations, and usage rules.

### Architecture
See [long-form-architecture.md](long-form-architecture.md) for the section-based file structure and code patterns.

### Palette: medevsmaker-explainer
```
primary:    #6366f1 (indigo)
secondary:  #8b5cf6 (violet)
accent:     #06b6d4 (cyan)
background: #0f0f1a
bgLight:    #1a1a2e
text:       #f8fafc
textMuted:  #94a3b8
amber:      #f59e0b (warnings, highlights)
green:      #10b981 (success, good examples)
red:        #ef4444 (danger, bad examples)
```

---

## Tutorial

### When to Use
Step-by-step guides, how-to content, walkthroughs, onboarding videos, coding tutorials.

### Defaults

| Setting | Value |
|---------|-------|
| Duration | 240s / 4 min (7200 frames) |
| Duration Range | 180-600s (3-10 min) |
| FPS | 30 |
| Resolution | 1920x1080 |
| Background | Solid dark with subtle grid overlay |
| Transitions | Mixed: slide-right(20), fade(15) |
| Pacing | slow-medium |
| Section markers | yes |
| Typography | Heading: Inter / 700, Body: Inter / 400, Code: JetBrains Mono / 400 |

### Scene Structure

Durations are computed from narration word counts (see duration-calculation.md).

```
HookQuestion or ColdOpen
  → What we're building / why this matters

TitleIntro
  → Tutorial title + what you'll learn

─── Section 1: Setup ───
  SectionTitle → "01 — Setup"
  Content scenes (2-4 scenes)
    → CodeDisplay, StepSequence, BulletRevealScene

─── Section 2-N: Steps ───
  SectionTitle → "02 — [Step Title]"
  Content scenes (2-5 scenes per section)
    → CodeDisplay (primary), ConceptExplain, DiagramFlow,
      WarningCallout, ProgressiveTerminal
  KeyTakeaway → What we achieved

─── Final Section: Wrap-up ───
  SummaryRecap → Steps covered
  EndScreen → Subscribe CTA
```

### Key Rules
- **Number every step clearly** — viewers need to follow along
- **Code is primary** — CodeDisplay and ProgressiveTerminal are the workhorse scenes
- **One concept per step** — don't overload
- **Show context** — use DiagramFlow to show where code fits in the bigger picture
- **Warnings before mistakes** — WarningCallout before common pitfalls
- **Section-based for 3+ min** — use sections for longer tutorials, flat TransitionSeries for short ones
- **Max 40 scenes, max 6 sections** per video
- **Use shared scene components** — import from `src/shared/scenes/`
- **Visual-first still applies** — don't make every scene CodeDisplay; alternate with diagrams and metaphors

### Per-Section Color Theming

Same as explainer — use `SECTION_THEMES` for section-based tutorials.

### Palette: clean-technical
```
primary:    #3b82f6 (blue)
secondary:  #1e293b (slate)
accent:     #22d3ee (cyan)
background: #0a0a0f
text:       #e2e8f0
code-bg:    #1e1e2e
```

---

## Short

### When to Use
YouTube Shorts, TikTok, Instagram Reels. Vertical 9:16 format. Triggered by `--format short` flag or auto-detected from platform mentions and duration hints.

### Defaults

| Setting | Value |
|---------|-------|
| Duration | 60s (1800 frames) |
| Duration Range | 10-90s (sweet spots: 13s or 60s) |
| FPS | 30 |
| Resolution | 1080x1920 (portrait) |
| Background | Dark gradient with particle overlay |
| Transitions | shortFade(8) — fast cuts |
| Pacing | very fast |
| CTA | no (loop setup instead) |
| Captions | always on (bold style) |
| Typography | Heading: Inter / 800, Body: Inter / 400, Code: JetBrains Mono / 400 |

### Scene Structure

Single section, flat TransitionSeries. No SectionTitle, no sections.

```
ColdOpen or HookQuestion
  → Scroll-stopping hook in 1-3 seconds
  → Must create curiosity gap or pattern interrupt

2-6 Content Scenes
  → Visual change every 3 seconds minimum
  → One idea per scene
  → Use vertical-compatible scenes (see short-form.md)

KeyTakeaway or FullScreenText
  → Loop setup: mirrors or callbacks to opening
  → Creates seamless replay (boosts loop rate metric)
```

### Key Rules
- **3-8 scenes total** — never more
- **170 WPM** narration pacing (faster than long-form 155)
- **Max 8s per scene**, min 3s
- **Visual change every 3s** — enforced by scene duration limits
- **No ProgressBar, SectionTracker, FeatureCounter, Watermark** overlays
- **CaptionOverlay always on** — bold style, word-by-word highlighting
- **Loop setup mandatory** — final 1-2s must mirror opening
- **Flat TransitionSeries** — no `<Series>` section wrapper
- **Safe zones**: 160px top, 350px bottom, 60px sides (platform UI overlays)
- **No music by default** — each track costs 50% revenue share

### Palette: medevsmaker-short
```
primary:    #6366f1 (indigo)
secondary:  #8b5cf6 (violet)
accent:     #06b6d4 (cyan)
background: #0f0f1a
bgLight:    #1a1a2e
text:       #f8fafc
textMuted:  #94a3b8
```

Full rules: [short-form.md](short-form.md)

---

## Archived Types

> These types are no longer auto-detected. They remain as reference for custom requests. If a user explicitly asks for one of these, use the definitions below.

### Promo
Product launches, feature announcements, marketing campaigns. 20s, 5 scenes (Hook → Problem → Solution → Benefits → CTA). Palette: modern-saas (indigo/violet/cyan).

### Social Clip
Instagram Reels, TikTok, YouTube Shorts. 15s, 1080x1920 portrait, fast pacing. 4 scenes (Hook → Content → CTA → Outro). Palette: bold-vibrant (red/orange/yellow).

### Announcement
Feature announcements, product releases. 20s, 5 scenes (Teaser → Reveal → Details → Availability → CTA). Palette: premium-launch (violet/indigo/emerald).

### Demo
Product walkthroughs, feature tours. 45s, 7 scenes (Title → Overview → 3 Features → Summary → CTA). Palette: clean-product (blue/violet/emerald).
