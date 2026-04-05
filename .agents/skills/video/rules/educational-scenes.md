---
name: scene-catalog
description: "Complete catalog of all reusable scenes — flat, no hierarchy"
---

# Scene Catalog

All scenes are first-class choices. No tiers, no hierarchy. Choose based on what the content needs visually and educationally.

## Selection Rules

### Visual Variety (MANDATORY)
- **Never use 2+ text-heavy scenes in a row** (text-heavy: ConceptExplain, BulletRevealScene, CodeDisplay, WarningCallout, ProgressiveTerminal)
- **Every section needs at least one visually rich scene** with animation, particles, diagrams, or dynamic visuals
- **Prefer scenes with movement** over static text layouts
- **Use the full catalog** — if you find yourself reaching for the same scene a 3rd time, pick a different one
- **Don't default to the same 13 scenes** — there are 50 available, use the variety

### Visual Balance
- Target **60%+ visual-heavy scenes** across the video
- Visual-heavy includes ALL of: ArchitectureDiagram, BeforeAfter, CinematicDocumentary, CinematicSciFi, ColdOpen, ComparisonSplit, DataChart, DataGauge, DataRanking, DemoAddressBar, DemoScroll, DemoTextInput, DemoZoomFocus, DiagramFlow, LayoutFrameInFrame, LayoutGiantNumber, LogoMaskReveal, LogoStroke, MetricDashboard, QuoteCard, RollerCountdown, StatHighlight, StepSequence, SwipeReveal, TextGlitch, TextKinetic, ThemeCyberpunk, ThemeHolographic, ThemeRetro, TimelineScene, VisualMetaphor, Background (all visual variants: floatingBokeh, sineWaves, geometricShapes, fluidWave, lightning, helix, hexGrid, matrixRain)

### Scene Preference Guidance

When you find yourself repeating a scene type, use this table:

| Instead of repeating... | Consider... | When... |
|------------------------|-------------|---------|
| ConceptExplain (3rd+ use) | TextKinetic | Statement needs visual punch |
| ConceptExplain | FeatureIntro | Introducing/defining something for first time |
| StatHighlight | LayoutGiantNumber | The number IS the entire visual moment |
| StatHighlight | DataGauge | Single metric with gauge visualization |
| StatHighlight | RollerCountdown | Countdown or slot-machine number reveal |
| BulletRevealScene | ListFullscreenSequence | Items need dramatic individual focus |
| BulletRevealScene | DecisionTable | Content is Q&A or criteria pairs |
| HookQuestion | ColdOpen | Dramatic statement instead of question |
| HookQuestion | CinematicSciFi | AI/future tech topic with HUD aesthetic |
| HookQuestion | ThemeCyberpunk | Dystopian/hacker/dark tech opener |
| SectionTitle | flashOverlay() | High-impact moment between sections (use transitions.ts utility) |
| SectionTitle | ThemeHolographic | Shimmering section break |
| CodeDisplay | Background variant="matrixRain" | Code-rain aesthetic for hacker topics |
| CodeDisplay | DemoTextInput | Interactive code input visualization |
| KeyTakeaway | KeyRuleCard | Gradient-emphasis key insight |
| ComparisonSplit | ThreeColumnCompare | Comparing 3+ things |
| DiagramFlow | ArchitectureDiagram | Hub-spoke/radial relationships |
| DiagramFlow | DiagramFlow variant="pipeline" | Animated item moving through stages |
| Any text scene 3rd time | Background variant="lightning" | Energy/power/electricity emphasis |
| Any text scene 3rd time | Background variant="fluidWave" | Flowing/organic transition moment |
| Any text scene 3rd time | Background variant="helix" | Scientific/DNA/spiral visual |

## Universal Props (all scenes)

Every scene accepts these props:
- `sectionColor?: string` — Per-section accent color (from SECTION_THEMES rotation)
- `colors?: { bg: string; text: string; accent: string; muted: string }` — Override default colors
- `fontFamily?: string` — Override heading font
- `startDelay?: number` — Frames to delay animation start (default 0)

All scenes use `useLayoutMode()` for responsive sizing, `fontScale` multiplier on all text, `contentPadding` instead of hardcoded padding, and token-based `borderRadius` and `lineHeight`.

> **Note**: Duration ranges listed below are **minimum animation times**. Actual scene durations are computed from narration word counts (see `duration-calculation.md`). Write narration naturally; the duration will follow.

---

## Scene Tier Classifications

Every scene belongs to a visual tier that determines font sizing and fill behavior. Import `SCENE_TIERS` from `src/shared/styles.ts`. Apply `fontScale` from `useLayoutMode()` as a multiplier on all sizes.

| Tier | Title Size | Body Size | Min Fill | Scenes |
|------|-----------|-----------|----------|--------|
| **hero** | 80px default (64-140) | 28px (24-36) | 60% | HookQuestion, ColdOpen, FullScreenText, TextGlitch, TextKinetic, LogoMaskReveal, LogoStroke, RollerCountdown, CinematicSciFi, CinematicDocumentary, ThemeCyberpunk, ThemeHolographic, ThemeRetro |
| **content** | 48px default (36-64) | 24px (20-32) | 70% | ConceptExplain, DiagramFlow, CodeDisplay, ComparisonSplit, StepSequence, BulletRevealScene, FeatureIntro, TimelineScene, ArchitectureDiagram, FileTreeScene, DecisionTable, ThreeColumnCompare, ProgressiveTerminal, BeforeAfter, DemoAddressBar, DemoScroll, DemoTextInput, DemoZoomFocus |
| **detail** | 36px default (24-48) | 20px (16-24) | 80% | DataChart, DataGauge, DataRanking, MetricDashboard, WarningCallout, UILoading |
| **accent** | 48px default (36-80) | 24px (20-32) | 50% | SectionTitle, TitleIntro, KeyTakeaway, KeyRuleCard, QuoteCard, StatHighlight, LayoutGiantNumber, LayoutFrameInFrame, ListFullscreenSequence, SummaryRecap, EndScreen, VisualMetaphor, SwipeReveal |

In `/script` Phase 4, assign a `tier` field to every scene in script.json. In code generation, use `SCENE_TIERS[tier]` for sizing decisions.

---

## Background Variant Mood Mapping

Select Background variants based on section content and mood — don't just cycle through the same 4. Use at least 5 unique variants per video. Never repeat the same variant on consecutive scenes.

| Variant | Mood/Content | Best Paired With | Suggested Overlay |
|---------|-------------|------------------|-------------------|
| `aurora` | Opening, cinematic, wonder | HookQuestion, ColdOpen, TitleIntro | vignette, particles |
| `noiseField` | Technical, analytical | CodeDisplay, DiagramFlow, ArchitectureDiagram | grid, none |
| `solidWithOrbs` | Data-heavy, corporate | DataChart, MetricDashboard, StatHighlight | none, radialGlow |
| `perspectiveGrid` | Retro, engineering | ThemeRetro, StepSequence | grid, none |
| `meshAnimated` | Flowing, organic | SectionTitle, KeyTakeaway, VisualMetaphor | vignette |
| `meshGradient` | Warm, premium | FeatureIntro, QuoteCard, EndScreen | radialGlow |
| `gradient` | Neutral, minimal | ConceptExplain, BulletRevealScene | none |
| `radialGradient` | Focused, centered | StatHighlight, FullScreenText | radialGlow |
| `bokeh` | Soft, dreamy | QuoteCard, VisualMetaphor | vignette |
| `floatingBokeh` | Creative, design | FeatureIntro, KeyRuleCard | vignette, particles |
| `sineWaves` | Audio, data flow | TimelineScene, ConceptExplain (flow topics) | none |
| `geometricShapes` | Architecture, math | ArchitectureDiagram, DiagramFlow | grid |
| `fluidWave` | Physics, organic transitions | BeforeAfter, SectionTitle | vignette |
| `lightning` | Power, dramatic | WarningCallout, ColdOpen (danger topics) | vignette, lightLeak |
| `helix` | Biology, DNA, scientific | ConceptExplain (science), DataChart | none |
| `hexGrid` | Networks, distributed | DiagramFlow (network), ArchitectureDiagram | grid |
| `matrixRain` | Hacking, security | CodeDisplay (security), CinematicSciFi | none, particles |

---

## Overlay Selection Guide

Vary overlays across sections — never use `vignette` on every section. Use at least 2 different overlay types per video. Never use the same overlay on more than 2 consecutive sections.

| Overlay | Mood | Use For |
|---------|------|---------|
| `none` | Clean, modern | Data-heavy sections, diagrams |
| `vignette` | Cinematic, focused | Opening/closing sections, hero moments |
| `radialGlow` | Warm, premium | Feature intros, key takeaways |
| `grid` | Technical, structured | Code sections, architecture |
| `particles` | Dynamic, energetic | Hook sections, transitions |
| `lightLeak` | Cinematic polish | Major section breaks (max 1-2 per video) |

---

## Component Pairing Guide

Use these shared components to enhance visual richness. Include component hints in script.json `visualDirection` when planning scenes.

### Card (`src/shared/components/Card.tsx`)
Use for custom content blocks within scenes that need semantic framing:
- `variant="glass"` + `glow` — Key insights, important conclusions (pair with KeyRuleCard, QuoteCard scenes)
- `variant="accent"` + `semanticType="warning"` — Callouts within code explanations
- `variant="accent"` + `semanticType="info"` — Definition cards, context blocks
- `variant="border"` + `color={sectionColor}` — Standard bordered content
- Always pass `color={sectionColor}` for theme consistency

### TextEffect (`src/shared/components/TextEffect.tsx`)
Use for dynamic text reveals and emphasis:
- `effect="typewriter"` — Terminal/code contexts, progressive reveals
- `effect="scramble"` — ColdOpen dramatic reveals, hacker/encryption topics
- `effect="glitch"` — Error states, WarningCallout emphasis, cyberpunk themes
- `effect="neon"` + `flickerIntensity="medium"` — Hero stat numbers, ThemeCyberpunk titles

### GradientText (`src/shared/components/GradientText.tsx`)
Use for hero-tier headings and highlighted keywords:
- `from={BRAND.amber} to={BRAND.amberLight}` + `entrance="fadeUp"` + `glow` — Standard hero heading
- `from={sectionColor} to={BRAND.text}` — Section-themed headers
- Prefer GradientText over plain text for HookQuestion, ColdOpen, FullScreenText main text
- Use `entrance="scale"` for dramatic moments, `"fadeUp"` for standard

---

## All Scenes (A-Z)

### ArchitectureDiagram
**Location**: `src/shared/scenes/ArchitectureDiagram.tsx`
**Purpose**: Hub-spoke layout with central node and orbital satellites connected by dashed SVG lines
**Duration**: 8s minimum (center + satellite stagger)
**Layout**: Heading top, central glowing card in center, satellite cards arranged in circle, dashed connection lines
**Animation**: Heading fade → center node scale-in with glow → connection lines fade → satellites stagger in (14f delay)
**Props**:
- `heading: string` — diagram title
- `center: { label: string; icon?: string; sublabel?: string; color?: string }` — central hub node
- `satellites: { label: string; icon?: string; sublabel?: string; color?: string }[]` — orbital nodes (max 6)
- `sectionColor?: string`
- `colors?: { bg: string; text: string; muted: string }`
- `fontFamily?: string`
**When to use**: System architectures, hub-spoke relationships, central concept with related components, microservice layouts
**Narration example**: "Start from the center hub and explain outward — match the visual reveal rhythm"

---

### Background (Component — 17 Variants)
**Location**: `src/shared/components/Background.tsx`
**Purpose**: Atmospheric background layer used behind scenes. Use as a layer, not a standalone scene.
**Props**:
- `variant: string` — one of: gradient, radialGradient, meshGradient, aurora, noiseField, meshAnimated, solidWithOrbs, perspectiveGrid, bokeh, floatingBokeh, sineWaves, geometricShapes, fluidWave, lightning, helix, hexGrid, matrixRain
- `overlay?: string` — optional overlay (particles, lightLeak, filmGrain, etc.)
- `colors?: { bg: string; accent: string }`

**Variant and overlay selection**: See the **Background Variant Mood Mapping** and **Overlay Selection Guide** sections above for content-based selection guidance.

**Usage**: Layer behind content scenes, not as standalone scenes.
```tsx
<Background variant="floatingBokeh" />
<Background variant="matrixRain" overlay="filmGrain" />
```

---

### BeforeAfter
**Location**: `src/shared/scenes/BeforeAfter.tsx`
**Purpose**: Before/after comparison with animated wipe or split reveal
**Duration**: 8-12s (two panels + reveal animation)
**Layout**: Heading top, two panels side by side
**Animation**: Before panel slides in → after panel wipe-reveals or slides in
**Props**:
- `heading: string` — comparison title
- `before: { title: string; items: string[] }` — before state
- `after: { title: string; items: string[] }` — after state
- `reveal?: 'wipe' | 'split'` — reveal animation style
- `sectionColor?: string`
- `colors?: { bg: string; text: string; accent: string; muted: string }`
- `fontFamily?: string`
**When to use**: Showing improvements, transformations, old vs new approaches, migration stories
**Narration example**: "Emphasize the contrast — make the 'after' feel like a revelation"

---

### BulletRevealScene
**Location**: `src/shared/scenes/BulletRevealScene.tsx`
**Purpose**: Progressive list of items with configurable bullet styles
**Duration**: 5-10s (scales with item count: 1.5s base + 1s per bullet)
**Layout**: Heading top, bullets stacked below with left alignment
**Animation**: Heading fade-up → bullets stagger-in from left
**Props**:
- `heading: string` — list title
- `items: string[]` — bullet items (max 5, each max 10 words)
- `bulletStyle?: 'dot' | 'check' | 'arrow' | 'number'` — bullet icon style
- `sectionColor?: string`
- `colors?: { bg: string; text: string; accent: string; muted: string }`
- `fontFamily?: string`
**When to use**: Lists of benefits, features, requirements, considerations
**Narration example**: "Introduce the list, then highlight the 2 most important items"

---

### CinematicDocumentary
**Location**: `src/shared/scenes/CinematicDocumentary.tsx`
**Purpose**: Ken Burns-style documentary opening with sober tone, letterbox bars, and location stamp
**Duration**: 4-6s typical
**Layout**: Full-screen with expanding horizontal line, centered title/subtitle, location stamp bottom-right
**Animation**: Line draws from center → title fades up → subtitle appears → location stamp fades in
**Props**:
- `startDelay?: number` — frames to delay animation start
- `title?: string` — main title (default: "The Story")
- `subtitle?: string` — subtitle text (default: "A Documentary Film")
- `location?: string` — location/date stamp (default: "2024")
**When to use**: Historical/serious content, journalism pieces, investigative topics, documentary-style openers
**Narration example**: "Set a serious, grounded tone — this is about something that matters"

---

### CinematicSciFi
**Location**: `src/shared/scenes/CinematicSciFi.tsx`
**Purpose**: Sci-fi HUD/hologram style with perspective grid, scanning line, and HUD frame corners
**Duration**: 4-6s typical
**Layout**: Dark background with perspective grid floor, HUD corner brackets, centered title with status text
**Animation**: HUD corners fade in → scanning line sweeps → "INITIALIZING SYSTEM" label → title with glow → status text
**Props**:
- `startDelay?: number` — frames to delay animation start
- `title?: string` — main display text (default: "NEXUS")
- `status?: string` — status line below title (default: "SYSTEM ONLINE")
**When to use**: AI/future tech topics, sci-fi vibe openers, system/infrastructure topics, cybersecurity
**Narration example**: "Open with futuristic energy — set the stage for cutting-edge tech content"

---

### CodeDisplay
**Location**: `src/shared/scenes/CodeDisplay.tsx`
**Purpose**: Code block with typewriter reveal, syntax coloring, and optional line annotations
**Duration**: 8s minimum (typewriter reveal scales with code length, ~1.5s per line)
**Layout**: Title top, code block left, annotations right
**Animation**: Title fade-up → code typewriter line by line → annotations stagger-in pointing to highlighted lines
**Props**:
- `title: string` — code example title
- `code: string` — the code to display (max 8 lines)
- `annotations?: { line: number; text: string }[]` — line-specific annotations (each max 10 words)
- `highlightLines?: number[]` — lines to highlight with accent color
- `sectionColor?: string`
- `colors?: { bg: string; text: string; accent: string; muted: string }`
- `fontFamily?: string`
**When to use**: Any time you show code, commands, config files, or terminal output
**Narration example**: "Explain what the code does and why it matters — never read syntax aloud"

---

### ColdOpen
**Location**: `src/shared/scenes/ColdOpen.tsx`
**Purpose**: Dramatic opening with bold statement, glow/gradient effects, and particle background
**Duration**: 4-6s (fast entrance for immediate impact)
**Layout**: Centered hero with particle field background
**Animation**: Heavy spring entrance with glow pulse, gradient text, or typewriter effect
**Props**:
- `statement: string` — bold opening statement (max 8 words)
- `subtext?: string` — supporting text (max 12 words)
- `entrance?: 'glow' | 'gradient' | 'typewriter'` — entrance animation style
- `showParticles?: boolean` — enable particle background
- `colors?: { bg: string; text: string; accent: string }`
- `fontFamily?: string`
**When to use**: Alternative to HookQuestion for dramatic, statement-driven openings. Best for provocative claims.
**Narration example**: "Dramatic attention grab — jump straight into a bold statement, no warmup"

---

### ComparisonSplit
**Location**: `src/shared/scenes/ComparisonSplit.tsx`
**Purpose**: Two-column A vs B comparison with VS divider
**Duration**: 6-10s (two columns + item stagger)
**Layout**: Heading top, two equal columns with VS divider between them
**Animation**: Heading fade → left slides in from left → right slides in from right → items stagger
**Props**:
- `heading: string` — comparison title (max 6 words)
- `left: { title: string; items: string[]; color: string }` — left column (title max 3 words, max 4 items)
- `right: { title: string; items: string[]; color: string }` — right column
- `entranceStyle?: 'slide' | 'spring' | 'overshoot'` — entrance animation variant
- `sectionColor?: string`
- `colors?: { bg: string; text: string; accent: string; muted: string }`
- `fontFamily?: string`
**When to use**: Good vs bad, before/after, old vs new, two competing approaches
**Narration example**: "Highlight the key difference — make one side clearly better for the context"

---

### ConceptExplain
**Location**: `src/shared/scenes/ConceptExplain.tsx`
**Purpose**: Core teaching scene — heading + body text + optional analogy with icon
**Duration**: 6-8s (three-part stagger animation)
**Layout**: Left-aligned with generous padding
**Animation**: Heading fade-up → body fade-up (12f delay) → analogy fade (25f delay)
**Props**:
- `heading: string` — concept name (max 6 words)
- `body: string` — explanation text (max 30 words, 2 lines)
- `analogy?: string` — relatable comparison (max 20 words)
- `icon?: string` — emoji or symbol
- `headingEntrance?: 'fadeUp' | 'fadeLeft' | 'typewriter'` — heading animation
- `sectionColor?: string`
- `colors?: { bg: string; text: string; accent: string; muted: string }`
- `fontFamily?: string`
**When to use**: The workhorse for explaining any concept. But avoid 3+ in a row — switch to TextKinetic or FeatureIntro.
**Narration example**: "Explain concept in own words — use the analogy to make it click"

---

### DataChart
**Location**: `src/shared/scenes/DataChart.tsx`
**Purpose**: Animated bar chart with spring-animated bars and value counter labels
**Duration**: 8-12s (bar stagger + counter animation)
**Layout**: Heading top, bars stacked vertically with labels left and values right
**Animation**: Heading fade → bars grow with spring + value counter animates to target
**Props**:
- `heading: string` — chart title
- `bars: { label: string; value: number; color?: string }[]` — chart data (max 6 bars). **value MUST be a raw number** (e.g., `value: 82`, not `value: "82"`). Strings crash `interpolate()`.
- `maxValue?: number` — scale maximum (raw number)
- `suffix?: string` — value suffix ("%", "x", "ms", "K")
- `sectionColor?: string`
- `colors?: { bg: string; text: string; accent: string; muted: string }`
- `fontFamily?: string`
**When to use**: Statistics, performance comparisons, survey results, market data, benchmarks
**Narration example**: "Call out the most interesting data points — pick the standout numbers"

---

### DataGauge
**Location**: `src/shared/scenes/DataGauge.tsx`
**Purpose**: Radial gauge meter (speedometer style) with animated needle and gradient arc
**Duration**: 4-6s typical
**Layout**: Centered gauge with arc from green→amber→red, needle points to value, value + label below
**Animation**: Arc draws in → needle sweeps to target position → value counter appears
**Props**:
- `startDelay?: number` — frames to delay animation start
- `value?: number` — gauge value (default: 78)
- `label?: string` — metric label below value (default: "Performance Score")
- `maxValue?: number` — gauge maximum (default: 100)
**When to use**: Single-metric emphasis, performance scores, health checks, satisfaction ratings
**Narration example**: "Build anticipation as the needle sweeps — reveal whether the score is good or bad"

---

### DataRanking
**Location**: `src/shared/scenes/DataRanking.tsx`
**Purpose**: Animated ranking list with numbered entries and score bars
**Duration**: 4-6s typical
**Layout**: Title top, ranked items stacked vertically with position numbers and animated score bars
**Animation**: Title fades → items stagger in from left with spring → bars grow to score width
**Props**:
- `startDelay?: number` — frames to delay animation start
- `items?: { name: string; score: number }[]` — ranking entries (default: top cities by population)
- `title?: string` — ranking title (default: "Top Cities")
**When to use**: Leaderboards, top-N lists, ranked comparisons, popularity charts
**Narration example**: "Count down from least to most — or reveal the winner first for drama"

---

### DecisionTable
**Location**: `src/shared/scenes/DecisionTable.tsx`
**Purpose**: Decision matrix with question/answer rows using pill badges
**Duration**: 6-10s (row stagger animation)
**Layout**: Heading centered, stacked card rows with question left and pill badge answer right
**Animation**: Heading fade → rows stagger in (14f delay), each row: question left + pill badge answer right
**Props**:
- `heading: string` — table title (max 6 words)
- `rows: { icon?: string; question: string; answer: string; answerColor?: string }[]` — decision rows (max 5)
- `sectionColor?: string`
- `colors?: { bg: string; text: string; accent: string; muted: string }`
- `fontFamily?: string`
**When to use**: Decision criteria, FAQ-style content, "when to use what" guides, feature comparison as rows
**Narration example**: "Frame the decision context, then call out the most surprising answer"

---

### DemoAddressBar
**Location**: `src/shared/scenes/DemoAddressBar.tsx`
**Purpose**: Browser address bar with typing animation simulating URL entry
**Duration**: 4-6s typical
**Layout**: Centered browser chrome mockup with address bar, page title below
**Animation**: Browser frame appears → URL types character by character → page content loads
**Props**:
- `startDelay?: number` — frames to delay animation start
- `url?: string` — URL to type (default: "app.example.com/dashboard")
- `title?: string` — page title (default: "Dashboard")
**When to use**: URL/HTTP topics, web navigation demos, DNS explanations, API endpoint demonstrations
**Narration example**: "Walk through what happens as you type a URL into the browser"

---

### DemoScroll
**Location**: `src/shared/scenes/DemoScroll.tsx`
**Purpose**: Scroll behavior animation showing content scrolling within a viewport
**Duration**: 4-6s typical
**Layout**: Centered viewport container with scrollable content items
**Animation**: Content scrolls vertically through the viewport with eased motion
**Props**:
- `startDelay?: number` — frames to delay animation start
- `title?: string` — viewport title (default: "SCROLL")
**When to use**: Scroll UX tutorials, infinite scroll explanations, scroll event handling, viewport behavior
**Narration example**: "Show how content flows as the user scrolls — connect to the technical concept"

---

### DemoTextInput
**Location**: `src/shared/scenes/DemoTextInput.tsx`
**Purpose**: Form text input with cursor and typing animation
**Duration**: 4-6s typical
**Layout**: Centered form card with label, input field, and typing cursor
**Animation**: Form card appears → cursor blinks → text types character by character
**Props**:
- `startDelay?: number` — frames to delay animation start
- `placeholder?: string` — input placeholder text (default: "Email Address")
- `typedText?: string` — text to type (default: "hello@example.com")
- `label?: string` — form label (default: "Create Account")
**When to use**: Form UX tutorials, input validation demos, interactive code input visualization
**Narration example**: "Show the user experience of filling out a form — connect to the validation logic"

---

### DemoZoomFocus
**Location**: `src/shared/scenes/DemoZoomFocus.tsx`
**Purpose**: Zoom-in focus on a specific UI element with highlight overlay
**Duration**: 4-6s typical
**Layout**: Full dashboard mockup that zooms into a specific metric card with highlight box
**Animation**: Full view shows → camera zooms into target element → highlight box appears with label
**Props**:
- `startDelay?: number` — frames to delay animation start
- `title?: string` — dashboard/target title (default: "Key Metrics")
**When to use**: Detail emphasis, pointing out specific UI elements, magnification of important data
**Narration example**: "Direct attention to exactly the thing that matters — zoom reveals the detail"

---

### DiagramFlow
**Location**: `src/shared/scenes/DiagramFlow.tsx`
**Purpose**: Animated boxes + arrows showing linear processes and pipelines
**Duration**: 8s minimum (node stagger + arrow draw)
**Layout**: Title top, diagram centered horizontally or vertically
**Animation**: Nodes scale-in staggered → arrows draw between them with optional labels
**Props**:
- `title: string` — flow diagram title
- `nodes: { label: string; sublabel?: string; color?: string }[]` — flow nodes (max 5)
- `connections: { from: number; to: number; label?: string }[]` — connections by node index
- `direction?: 'horizontal' | 'vertical'` — layout direction (horizontal for 3-4 nodes, vertical for 4-5)
- `variant?: 'boxes' | 'pipeline'` — visual style (pipeline = rounded connected tubes)
- `sectionColor?: string`
- `colors?: { bg: string; text: string; accent: string }`
- `fontFamily?: string`
**When to use**: Any process, pipeline, data flow, request lifecycle, CI/CD pipeline
**Narration example**: "Walk through the flow step by step — connect each node to the next"

---

### EndScreen
**Location**: `src/shared/scenes/EndScreen.tsx`
**Purpose**: Polished end card with gradient text, animated CTA button with glow, and social links
**Duration**: 5s minimum (logo + CTA + social links animation)
**Layout**: Centered — channel name with underline → CTA button → tagline → social links row
**Animation**: Channel name bouncy spring → underline expand → CTA fade-up with glow pulse → tagline fade → social links stagger
**Props**:
- `channel?: string` — channel name (default: "medevsmaker")
- `cta?: string` — call-to-action text (max 4 words)
- `tagline?: string` — channel tagline (max 6 words)
- `socialLinks?: { label: string; handle: string }[]` — social media links (max 3)
- `showParticles?: boolean` — enable particle background
- `colors?: { bg: string; text: string; accent: string; muted: string }`
- `fontFamily?: string`
**When to use**: Always the last scene. The standard end card for all videos.
**Narration example**: "Conversational CTA — one sentence that feels natural, not salesy"

---

### FeatureIntro
**Location**: `src/shared/scenes/FeatureIntro.tsx`
**Purpose**: Polished feature introduction with breadcrumb counter, definition card, and pill badges
**Duration**: 6-8s (multi-element stagger)
**Layout**: Content in left 65% of frame (negative space on right), breadcrumb counter top-left
**Animation**: Heading fadeUpSlow → definition card scale-in → pill badge row stagger-in
**Props**:
- `heading: string` — feature name (max 6 words)
- `definition: string` — feature definition (max 30 words)
- `badge?: string` — category badge (max 2 words, ALL CAPS)
- `icon?: string` — emoji or symbol
- `breadcrumb?: { current: number; total: number; label: string }` — position counter (e.g., "2 of 5")
- `pills?: { label: string; color?: string }[]` — category/tag pills (max 4)
- `sectionColor?: string`
- `colors?: { bg: string; text: string; accent: string; muted: string }`
- `fontFamily?: string`
**When to use**: Introducing a new feature, concept, or topic. Prefer over ConceptExplain when defining something for the first time.
**Narration example**: "Build anticipation — explain why this feature matters before defining it"

---

### FileTreeScene
**Location**: `src/shared/scenes/FileTreeScene.tsx`
**Purpose**: Directory/file structure visualization with annotations
**Duration**: 8s minimum (tree items stagger + annotation)
**Layout**: Heading top, file tree left (2/3), optional annotation card right (1/3)
**Animation**: Heading fadeUpSlow → tree items stagger with fadeLeftSlow → annotation card fades in last
**Props**:
- `heading: string` — tree title (max 6 words)
- `items: { name: string; type: string; indent: number; color?: string; highlight?: boolean }[]` — tree entries (max 12, max 3 indent levels)
- `annotation?: string` — side annotation (max 25 words)
- `sectionColor?: string`
- `colors?: { bg: string; text: string; accent: string; muted: string }`
- `fontFamily?: string`
**When to use**: Project structure, file organization, config layouts, directory hierarchies, monorepo structures
**Narration example**: "Explain the architecture reasoning — why it's organized this way, not just what's there"

---

### FullScreenText
**Location**: `src/shared/scenes/FullScreenText.tsx`
**Purpose**: Single large statement filling the screen with dramatic entrance for punchlines
**Duration**: 3-5s (fast impact)
**Layout**: Centered hero with particle field background, safe-zone aware for short-form
**Animation**: Scale, gradient, or slam entrance with optional glow pulse
**Props**:
- `text: string` — the statement (bold, large)
- `subtext?: string` — supporting text below
- `entrance?: 'scale' | 'gradient' | 'slam'` — entrance animation
- `colors?: { bg: string; text: string; accent: string }`
- `fontFamily?: string`
**When to use**: Short-form hook moments, mid-video punchlines, dramatic one-liner reveals
**Narration example**: "Deliver the punchline — let the text do the visual work"

---

### HookQuestion
**Location**: `src/shared/scenes/HookQuestion.tsx`
**Purpose**: Provocative opening question to grab attention. Typically Scene 1.
**Duration**: 4s minimum (spring scale-in + subtext)
**Layout**: Centered hero with large question text and smaller subtext below
**Animation**: Spring scale-in (0.9 to 1) + opacity fade → subtext fades in after 15 frames
**Props**:
- `question: string` — the hook question (max 8 words)
- `subtext?: string` — supporting text (max 12 words)
- `entrance?: 'scale' | 'blur' | 'fadeUp'` — entrance animation (avoid 'typewriter' for hooks — too slow)
- `colors?: { bg: string; text: string; accent: string }`
- `fontFamily?: string`
**When to use**: Every video's first scene. Ask a question the viewer thinks they know the answer to.
**Narration example**: "Create curiosity gap — pose a question the viewer can't ignore"

---

### KeyRuleCard
**Location**: `src/shared/scenes/KeyRuleCard.tsx`
**Purpose**: Key insight with gradient text emphasis, pre-label, and optional detail cards
**Duration**: 5-7s (multi-element stagger)
**Layout**: Centered — preLabel (monospace caps) → large statement with gradient highlight → subtitle → optional detail cards
**Animation**: Labels fade → statement with gradient text glow → subtitle fade → cards stagger
**Props**:
- `preLabel?: string` — category label (max 3 words, ALL CAPS)
- `statement: string` — the key rule/insight (max 12 words)
- `highlightWord?: string` — 1-3 words from statement to apply gradient
- `subtitle?: string` — supporting detail (max 20 words)
- `cards?: { text: string; icon?: string }[]` — detail cards below (max 3, each max 8 words)
- `sectionColor?: string`
- `colors?: { bg: string; text: string; accent: string; muted: string }`
- `fontFamily?: string`
**When to use**: Key rules, important insights, memorable one-liners. Use instead of KeyTakeaway for gradient emphasis.
**Narration example**: "Deliver with conviction — short, punchy, let the statement breathe"

---

### KeyTakeaway
**Location**: `src/shared/scenes/KeyTakeaway.tsx`
**Purpose**: End-of-section summary in an accent box
**Duration**: 4-6s (heading + box entrance)
**Layout**: Centered with accent-colored box containing the takeaway text
**Animation**: Heading fade-up → accent box scale-in with takeaway text
**Props**:
- `heading?: string` — optional section label
- `takeaway: string` — the key takeaway (max 25 words, must be independently understandable)
- `variant?: 'accent' | 'insight'` — style variant (insight = gradient text)
- `sectionColor?: string`
- `colors?: { bg: string; text: string; accent: string; muted: string }`
- `fontFamily?: string`
**When to use**: Last scene of each section. Distills the section into one memorable statement.
**Narration example**: "Reinforce the section's key point — one sentence the viewer remembers"

---

### LayoutFrameInFrame
**Location**: `src/shared/scenes/LayoutFrameInFrame.tsx`
**Purpose**: Nested frame composition — frames within frames creating a recursive visual
**Duration**: 3-4s typical
**Layout**: Centered nested rectangles with title and subtitle positioned between frames
**Animation**: Outer frames scale in → inner frames follow → text appears
**Props**:
- `startDelay?: number` — frames to delay animation start
- `title?: string` — main text (default: "FRAME")
- `subtitle?: string` — subtitle text (default: "INTRODUCING")
**When to use**: Meta/recursion topics, nesting concepts, inception-style reveals, composition patterns
**Narration example**: "Introduce a concept about nesting, recursion, or layers within layers"

---

### LayoutGiantNumber
**Location**: `src/shared/scenes/LayoutGiantNumber.tsx`
**Purpose**: Oversized number as a design element filling the right side, with text info on left
**Duration**: 4-6s typical
**Layout**: Giant number (500px font) overflows right edge, label + description on left side
**Animation**: Number scales in from 80% to 100% → left text slides in from left with delay
**Props**:
- `startDelay?: number` — frames to delay animation start
- `number?: string` — the giant number to display (default: "97")
- `label?: string` — small label above description (default: "CUSTOMER SATISFACTION")
- `description?: string` — supporting text (default: "Based on 10,000+ reviews...")
**When to use**: When the number IS the visual moment — milestone stats, dramatic percentages, hero metrics
**Narration example**: "Let the number speak — pause before explaining what it means"

---

### ListFullscreenSequence
**Location**: `src/shared/scenes/ListFullscreenSequence.tsx`
**Purpose**: Full-screen sequential item reveals — one item fills the entire screen at a time
**Duration**: 4-8s (scales with item count)
**Layout**: Each item takes the full screen one at a time with large centered text and color background
**Animation**: Items crossfade with scale entrance, each getting its own color from the palette
**Props**:
- `startDelay?: number` — frames to delay animation start
- `items?: string[]` — items to reveal sequentially (default: ["INNOVATE", "CREATE", "DELIVER"])
- `title?: string` — optional title overlay
**When to use**: When items need dramatic individual focus, manifesto-style reveals, core values
**Narration example**: "Give each item its own dramatic moment — short pause between each"

---

### LogoMaskReveal
**Location**: `src/shared/scenes/LogoMaskReveal.tsx`
**Purpose**: Masked wipe reveal of text/brand with horizontal mask sweep
**Duration**: 3-4s typical
**Layout**: Centered text with horizontal mask that sweeps to reveal, optional subtitle below
**Animation**: Horizontal mask sweeps left to right revealing text → subtitle fades in
**Props**:
- `startDelay?: number` — frames to delay animation start
- `text?: string` — text to reveal (default: "BRAND")
- `subtitle?: string` — subtitle below revealed text
**When to use**: Clean brand reveals, professional openers, section introductions with polish
**Narration example**: "Clean reveal — let the brand name land with purpose"

---

### LogoStroke
**Location**: `src/shared/scenes/LogoStroke.tsx`
**Purpose**: SVG stroke-draw reveal — text outline draws on then fills in
**Duration**: 3-4s typical
**Layout**: Centered text with SVG stroke animation, subtitle below
**Animation**: SVG stroke draws the text outline → fill fades in → subtitle appears
**Props**:
- `startDelay?: number` — frames to delay animation start
- `text?: string` — text to stroke-draw (default: "BRAND")
- `subtitle?: string` — subtitle text
**When to use**: Technical/precision brand reveals, clean minimal openers, engineering-themed introductions
**Narration example**: "Precision reveal — the text draws itself into existence"

---

### MetricDashboard
**Location**: `src/shared/scenes/MetricDashboard.tsx`
**Purpose**: 2-4 stat cards in a grid, each with counter animation, optional gauge/bar mini-chart
**Duration**: 6s minimum (multiple counter animations)
**Layout**: Heading top, 2-4 metric cards in responsive grid
**Animation**: Heading fade → cards stagger in → counters animate to target values → mini charts fill
**Props**:
- `heading: string` — dashboard title
- `metrics: { label: string; value: number; suffix?: string; prefix?: string; color?: string; display?: 'counter' | 'gauge' | 'bar'; maxValue?: number }[]` — 2-4 metrics. **value MUST be a raw number**.
- `sectionColor?: string`
- `colors?: { bg: string; text: string; muted: string }`
- `fontFamily?: string`
**When to use**: Multiple related stats, performance dashboards, before/after metric sets, KPI overviews
**Narration example**: "Call out the headline metric, then connect the others to tell a story"

---

### ProgressiveTerminal
**Location**: `src/shared/scenes/ProgressiveTerminal.tsx`
**Purpose**: Terminal-style progressive reveal of items inside a single card
**Duration**: 6-10s (item stagger)
**Layout**: Heading top, single large card with items appearing one by one inside it
**Animation**: Heading fadeUpSlow → card scale-in → items stagger with fadeLeftSlow (14f delay)
**Props**:
- `heading: string` — terminal heading (max 6 words)
- `items: { text: string; icon?: string; highlight?: string }[]` — items to reveal (max 6, each max 12 words)
- `summary?: string` — optional summary after all items
- `sectionColor?: string`
- `colors?: { bg: string; text: string; accent: string; muted: string }`
- `fontFamily?: string`
**When to use**: Listing capabilities that build on each other, sequential reveals, terminal-output aesthetic
**Narration example**: "Highlight the 2-3 most interesting items — don't just read the list"

---

### QuoteCard
**Location**: `src/shared/scenes/QuoteCard.tsx`
**Purpose**: Glass morphism quote card with large quotation marks and attribution
**Duration**: 4s minimum (glass card entrance + quote)
**Layout**: Centered glass card with oversized quotation mark, quote text, and attribution below
**Animation**: Quotation mark spring-in → glass card fades up → quote text appears → attribution fades
**Props**:
- `quote: string` — the quote text
- `attribution?: string` — who said it
- `cardStyle?: 'glass' | 'solid'` — card appearance (glass = frosted blur)
- `sectionColor?: string`
- `colors?: { bg: string; text: string; muted: string }`
- `fontFamily?: string`
**When to use**: Expert quotes, famous sayings, key statements that deserve visual framing
**Narration example**: "Let the quote land — pause briefly before and after reading it"

---

### RollerCountdown
**Location**: `src/shared/scenes/RollerCountdown.tsx`
**Purpose**: Large number countdown with 3-phase state machine (counting, reveal, final word)
**Duration**: 4-6s typical
**Layout**: Centered large number that counts down, then reveals a final word
**Animation**: Numbers count down with spring transitions → flash → final word appears with impact
**Props**:
- `startDelay?: number` — frames to delay animation start
- `targetNumber?: number` — countdown start number (default: 5)
- `label?: string` — final word revealed after countdown (default: "LAUNCH")
**When to use**: Countdowns, dramatic number reveals, "top N" list intros, slot-machine moments
**Narration example**: "Build tension with the countdown — the final word is the payoff"

---

### SectionTitle
**Location**: `src/shared/scenes/SectionTitle.tsx`
**Purpose**: Chapter marker at the start of each section with numbered badge
**Duration**: 3s minimum (badge pop-in + title)
**Layout**: Centered with section number badge, title below, optional subtitle
**Animation**: Badge pop-in → title fade-up → subtitle fade
**Props**:
- `sectionNumber: number` — section number for badge
- `title: string` — section title (max 5 words)
- `subtitle?: string` — section subtitle (max 10 words)
- `entrance?: 'fadeUp' | 'slideLeft' | 'scaleBlur'` — entrance animation (alternate between these)
- `sectionColor?: string`
- `colors?: { bg: string; text: string; accent: string; muted: string }`
- `fontFamily?: string`
**When to use**: Start of every section (3-7 per video). Brief transition connecting previous section to what's next.
**Narration example**: "Brief transition — connect previous section to what's coming next"

---

### StatHighlight
**Location**: `src/shared/scenes/StatHighlight.tsx`
**Purpose**: Big animated number with label and context, multiple emphasis and counter modes
**Duration**: 4-6s (counter animation + label)
**Layout**: Centered hero — large animated number with suffix/prefix, label below, context at bottom
**Animation**: Number counts from 0 → target with spring scale → label fade-up → context fade
**Props**:
- `stat: number` — the number to display. **MUST be a raw number** (e.g., `stat: 82`, not `stat: "82%"`). Strings crash `interpolate()`.
- `suffix?: string` — text after number ("%", "x", "ms", "K", "M")
- `prefix?: string` — text before number ("$", "#")
- `label: string` — metric label (max 6 words)
- `context?: string` — supporting context (max 15 words)
- `emphasis?: 'default' | 'glow' | 'gradient'` — visual emphasis style
- `mode?: 'spring' | 'slot' | 'splitFlap'` — counter animation style (slot = slot machine, splitFlap = airport board)
- `sectionColor?: string`
- `colors?: { bg: string; text: string; accent: string; muted: string }`
- `fontFamily?: string`
**When to use**: Key statistics, percentages, performance numbers. Use `emphasis: 'glow'` for dramatic stats, `mode: 'splitFlap'` for retro feel.
**Narration example**: "Build up to the number — frame why this stat should blow their mind"

---

### StepSequence
**Location**: `src/shared/scenes/StepSequence.tsx`
**Purpose**: Numbered steps with badges and optional descriptions for how-to content
**Duration**: 8-12s (2s per step minimum)
**Layout**: Heading top, steps stacked vertically with number badges
**Animation**: Heading fade-up → steps stagger-in with badge pop-ins
**Props**:
- `heading: string` — sequence title
- `steps: { title: string; description?: string }[]` — numbered steps (max 5)
- `sectionColor?: string`
- `colors?: { bg: string; text: string; accent: string; muted: string }`
- `fontFamily?: string`
**When to use**: Step-by-step processes, setup instructions, workflows, "how to" sequences
**Narration example**: "Walk through steps in order — use connecting phrases, not just numbering"

---

### SummaryRecap
**Location**: `src/shared/scenes/SummaryRecap.tsx`
**Purpose**: Numbered recap of everything covered, one item per section
**Duration**: 8-12s (item stagger)
**Layout**: Heading top, numbered list stacked with badges
**Animation**: Heading fade-up → items stagger-in with number badges
**Props**:
- `heading?: string` — recap title
- `items: string[]` — recap items (one per section, each max 10 words)
- `itemEntrance?: 'left' | 'scale' | 'fade'` — item entrance animation
- `sectionColor?: string`
- `colors?: { bg: string; text: string; accent: string; muted: string }`
- `fontFamily?: string`
**When to use**: Near the end of the video, before the EndScreen. Rapid-fire recap of key points.
**Narration example**: "Rapid-fire recap — hit the highlights from each section in order"

---

### SwipeReveal
**Location**: `src/shared/scenes/SwipeReveal.tsx`
**Purpose**: Swipe gesture animation — before text slides up, after text rises from below
**Duration**: 4-6s (swipe transition at configurable frame)
**Layout**: Centered text with optional label, before/after content swaps via vertical swipe
**Animation**: Before text displays → at swipeAt frame, before slides up → after rises from below
**Props**:
- `before: string` — content shown before swipe
- `after: string` — content revealed after swipe
- `label?: string` — optional label above before text
- `swipeAt?: number` — frame number when swipe begins (default: 45)
- `colors?: { bg: string; text: string; accent: string; muted: string }`
- `fontFamily?: string`
**When to use**: Before/after reveals in short-form, myth-busting, expectation vs reality, surprising reveals
**Narration example**: "Set up the expectation, then swipe to reveal the surprising truth"

---

### TextGlitch
**Location**: `src/shared/scenes/TextGlitch.tsx`
**Purpose**: RGB channel glitch effect with scanlines and noise bars on large text
**Duration**: 3-4s typical
**Layout**: Centered large text (140px) with red/cyan channel separation layers, scanline overlay, random noise bars
**Animation**: Text scales in → random glitch frames fire (15% probability) with RGB offset, skew, scanlines, and noise bars
**Props**:
- `startDelay?: number` — frames to delay animation start
- `text?: string` — display text (default: "GLITCH")
**When to use**: Tech/hacker topics, error states, digital corruption themes, dramatic text reveals
**Narration example**: "Something is broken or under attack — the glitch sells the drama"

---

### TextKinetic
**Location**: `src/shared/scenes/TextKinetic.tsx`
**Purpose**: Kinetic typography — characters animate individually with staggered springs
**Duration**: 3-5s typical
**Layout**: Centered large text with each character animating independently
**Animation**: Characters stagger in with individual spring animations, creating a wave-like typing feel
**Props**:
- `startDelay?: number` — frames to delay animation start
- `text?: string` — single text to animate character-by-character (default: "KINETIC")
- `words?: string[]` — array of words (joined, then animated per-character)
**When to use**: Impactful statements, narration highlights, key phrases that need visual punch
**Narration example**: "Deliver the statement word by word — let each word land with the animation"

---

### ThemeCyberpunk
**Location**: `src/shared/scenes/ThemeCyberpunk.tsx`
**Purpose**: Neon grid cyberpunk aesthetic with glowing title and subtitle
**Duration**: 3-4s typical
**Layout**: Dark background with neon grid lines, large glowing title centered, subtitle below
**Animation**: Grid appears → title glows in with neon effect → subtitle fades in
**Props**:
- `startDelay?: number` — frames to delay animation start
- `title?: string` — main text (default: "CYBER")
- `subtitle?: string` — subtitle text (default: "PUNK")
**When to use**: Future/dystopian tech topics, cyberpunk fiction, dark web/hacking themes, neon-aesthetic openers
**Narration example**: "Set a dystopian or futuristic tone — this is the dark side of tech"

---

### ThemeHolographic
**Location**: `src/shared/scenes/ThemeHolographic.tsx`
**Purpose**: Holographic foil shimmer effect on text with rainbow gradient animation
**Duration**: 3-4s typical
**Layout**: Centered text with animated holographic/rainbow gradient overlay
**Animation**: Text appears with sweeping holographic shimmer that moves across the surface
**Props**:
- `startDelay?: number` — frames to delay animation start
- `text?: string` — display text (default: "HOLOGRAM")
**When to use**: Premium/futuristic reveals, shimmering section breaks, tech product announcements
**Narration example**: "Reveal something special — the shimmer adds a premium, futuristic feel"

---

### ThemeRetro
**Location**: `src/shared/scenes/ThemeRetro.tsx`
**Purpose**: 70s-80s CRT retro visual style with scanlines and warm color palette
**Duration**: 3-4s typical
**Layout**: Warm-toned background with CRT scanline overlay, retro-styled text centered, subtitle below
**Animation**: CRT effect loads → text appears with retro styling → subtitle fades in
**Props**:
- `startDelay?: number` — frames to delay animation start
- `text?: string` — main text (default: "Vintage")
- `subtitle?: string` — subtitle text (default: "Classic Style Never Dies")
**When to use**: Tech history topics, retro nostalgia, "how it used to work" segments, throwback moments
**Narration example**: "Take viewers back in time — set up the contrast with modern approaches"

---

### ThreeColumnCompare
**Location**: `src/shared/scenes/ThreeColumnCompare.tsx`
**Purpose**: Three-way comparison with colored cards side by side
**Duration**: 8s minimum (three cards + items stagger)
**Layout**: Heading top, three equal cards with gap between them
**Animation**: Heading fade → cards stagger in → items stagger within each card
**Props**:
- `heading: string` — comparison title (max 6 words)
- `columns: { title: string; icon?: string; items: string[]; color: string }[]` — exactly 3 columns (each: title max 3 words, max 4 items, each item max 8 words)
- `sectionColor?: string`
- `colors?: { bg: string; text: string; accent: string; muted: string }`
- `fontFamily?: string`
**When to use**: Comparing three approaches, tools, or categories. When ComparisonSplit's two columns aren't enough.
**Narration example**: "Highlight what makes each option distinct — create a narrative arc across the three"

---

### TimelineScene
**Location**: `src/shared/scenes/TimelineScene.tsx`
**Purpose**: Horizontal or vertical timeline with progressively drawn line and node pop-ins
**Duration**: 8s minimum (node pop-ins + line draw)
**Layout**: Heading top, timeline centered with nodes connected by drawn line
**Animation**: Nodes pop-in staggered with connecting lines drawing between them
**Props**:
- `heading: string` — timeline title
- `nodes: { label: string; description?: string }[]` — timeline events (horizontal max 5, vertical max 6)
- `layout?: 'horizontal' | 'vertical'` — timeline orientation
- `sectionColor?: string`
- `colors?: { bg: string; text: string; accent: string; muted: string }`
- `fontFamily?: string`
**When to use**: Historical progressions, evolution of technology, step sequences over time, version histories
**Narration example**: "Narrate the progression — what happens at each stage and why it matters"

---

### TitleIntro
**Location**: `src/shared/scenes/TitleIntro.tsx`
**Purpose**: Video title + learning objectives. Typically Scene 2.
**Duration**: 6-8s (title + objectives stagger)
**Layout**: Centered with title, underline divider, and objectives list
**Animation**: Title fade-up → underline expand → objectives stagger-in
**Props**:
- `title: string` — video title (max 8 words)
- `objectives: string[]` — learning objectives (2-4 items, each max 10 words, outcomes like "Understand X")
- `entrance?: 'fadeUp' | 'scaleRotate' | 'splitReveal'` — entrance animation
- `sectionColor?: string`
- `colors?: { bg: string; text: string; accent: string; muted: string }`
- `fontFamily?: string`
**When to use**: Immediately after the hook. Sets viewer expectations for the video.
**Narration example**: "Set expectations — tease what's coming without listing objectives verbatim"

---

### UILoading
**Location**: `src/shared/scenes/UILoading.tsx`
**Purpose**: Loading spinner, skeleton screens, and animated dots showing loading states
**Duration**: 3-4s typical
**Layout**: Centered loading animation with text label, multiple loading variants displayed
**Animation**: Spinner rotates continuously, dots pulse in sequence, skeleton shimmer effect
**Props**:
- `startDelay?: number` — frames to delay animation start
- `text?: string` — label text (default: "LOADING STATES")
**When to use**: Loading state tutorials, async operation explanations, UX pattern discussions
**Narration example**: "Show what the user sees while they wait — connect to the technical process behind it"

---

### VisualMetaphor
**Location**: `src/shared/scenes/VisualMetaphor.tsx`
**Purpose**: Large emoji/icon + analogy text for breaking complex concepts with relatable comparisons
**Duration**: 5-8s (icon + heading + analogy stagger)
**Layout**: Centered — icon on top, heading middle, analogy below
**Animation**: Icon pop-in (snappy spring) → heading fade-up → analogy fade
**Props**:
- `icon: string` — single emoji
- `heading: string` — concept name (max 5 words)
- `analogy: string` — relatable comparison (max 25 words)
- `iconEffect?: 'pop' | 'rotate' | 'bounce'` — icon entrance animation (rotate between these)
- `sectionColor?: string`
- `colors?: { bg: string; text: string; accent: string; muted: string }`
- `fontFamily?: string`
**When to use**: Breaking complex concepts with relatable analogies. Use after dense technical scenes for relief.
**Narration example**: "Deliver the analogy with personality — make it funny and memorable"

---

### WarningCallout
**Location**: `src/shared/scenes/WarningCallout.tsx`
**Purpose**: Red/amber callout box for common mistakes, dangers, or security concerns
**Duration**: 5-7s (heading + body animation)
**Layout**: Centered with colored accent box
**Animation**: Heading fade-up with subtle pulse → accent box scale-in with body text
**Props**:
- `heading: string` — warning title (max 6 words, should feel urgent)
- `body: string` — warning details (max 30 words)
- `severity?: 'warning' | 'danger'` — color intensity (danger = red for security/critical, warning = amber for common mistakes)
- `sectionColor?: string`
- `colors?: { bg: string; text: string; accent: string; muted: string }`
- `fontFamily?: string`
**When to use**: Common mistakes, pitfalls, security concerns, things to avoid, "don't do this" moments
**Narration example**: "Deliver with urgency — this is the one thing they absolutely must remember"

---

## Transition Variety

Plan 2-3 different transition types per video:
- **fade** (15 frames) — default, most transitions
- **slideLeft/slideRight** (20 frames) — after section titles or conceptual shifts
- **slideUp** (20 frames) — before summary/recap scenes
- **wipeRight** (18 frames) — after diagram/stat scenes
- **clockWipe** (25 frames) — sparingly, for major section changes

## Entrance Variety

- HookQuestion: `fadeUp`, `blur`, or `scale` (never `typewriter` — too slow for hooks)
- TitleIntro: `scaleRotate` or `splitReveal`
- SectionTitle: alternate `fadeUp`, `slideLeft`, `scaleBlur`
- VisualMetaphor: rotate `iconEffect` between `pop`, `rotate`, `bounce`
- StatHighlight: use `emphasis: 'glow'` or `'gradient'`, try `mode: 'splitFlap'` for retro
- ColdOpen: vary between `glow`, `gradient`, `typewriter`
- FullScreenText: vary between `scale`, `gradient`, `slam`

> **Note**: `Thumbnail.tsx` is a special-purpose scene used by `/assets` for thumbnail generation, not for video content.

## Component Quality Standards

### Minimum Font Sizes (at 1080p, before fontScale)
- **Body text**: >= 24px (`baseTokens.fontSizes.sm` or larger)
- **Headings**: >= 40px (`baseTokens.fontSizes.lg` or larger)
- **Labels/annotations**: >= 20px (`baseTokens.fontSizes.xs`)
- **Always multiply by `fontScale`** from `useLayoutMode()` for responsive sizing
- **Never pass raw text as `{children}` to Card** — wrap in a styled div with explicit `fontSize`, `color`, and `lineHeight`

### Layout Requirements
- All `AbsoluteFill` containers holding content **must** have `display: "flex"` and `flexDirection: "column"` — without these, gap and alignment properties are ignored
- Multi-word kinetic/animated text must preserve spaces and scale font size based on character count to prevent overflow

### Z-Index Discipline
- SVG overlay layers (connection lines, decorative paths): `zIndex: 1`
- Card/node elements rendered on top of lines: `zIndex: 2`
- Heading/decorative elements: no z-index needed (natural stacking order)

### Scene Entrance Opacity
- Scenes using `SceneBackground` get a built-in 3-frame fade-in that prevents transition bleed during TransitionSeries premounting
- Scenes NOT using SceneBackground must add their own 3-frame opacity guard: `interpolate(frame, [0, 3], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })` on their outer AbsoluteFill
