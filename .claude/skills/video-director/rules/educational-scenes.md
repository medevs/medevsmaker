---
name: educational-scenes
description: Complete catalog of reusable scene types for educational videos
metadata:
  tags: scenes, educational, catalog, templates
---

# Scene Catalog

All scene types available for video production. Each scene is a reusable React component in `src/shared/scenes/`.

> **Note**: Duration ranges listed below are **minimum animation times** — the time needed for entrance animations to complete. Actual scene durations are computed from narration word counts (see `duration-calculation.md`). Write narration naturally; the duration will follow.

## Scene Tiers

Scenes are divided into two tiers. For daily production, prefer **Core** scenes. Use **Advanced** scenes for variety and specialized content.

### Core (13) — Use by default

| Scene | Category | Purpose |
|-------|----------|---------|
| HookQuestion | Structural | Opening hook |
| TitleIntro | Structural | Title + objectives |
| SectionTitle | Structural | Chapter marker |
| ConceptExplain | Text | Heading + body + analogy (the workhorse) |
| DiagramFlow | Visual | Animated process flow |
| CodeDisplay | Text | Code with annotations |
| ComparisonSplit | Visual | A vs B comparison |
| StatHighlight | Visual | Big animated number |
| BulletRevealScene | Text | Progressive bullet list |
| VisualMetaphor | Visual | Icon + analogy |
| KeyTakeaway | Structural | Section summary |
| SummaryRecap | Structural | Numbered recap |
| EndScreen | Structural | End card with CTA |

### Advanced (14) — Use for variety

| Scene | Category | Purpose |
|-------|----------|---------|
| ColdOpen | Visual | Dramatic opening statement |
| BeforeAfter | Visual | Before/after wipe reveal |
| TimelineScene | Visual | Horizontal/vertical timeline |
| DataChart | Visual | Animated bar chart |
| FeatureIntro | Visual | Feature with breadcrumb + pills |
| ProgressiveTerminal | Text | Terminal-style reveal |
| DecisionTable | Visual | Decision matrix |
| ThreeColumnCompare | Visual | Three-way comparison |
| FileTreeScene | Visual | Directory structure |
| KeyRuleCard | Visual | Key insight with gradient |
| ArchitectureDiagram | Visual | Hub-spoke layout |
| WarningCallout | Text | Danger callout |
| StepSequence | Visual | Numbered steps |
| Outro | Structural | Basic channel branding (**deprecated** — use EndScreen) |

### Scene Selection Rule

**Core-first**: For daily production, compose videos primarily from Core scenes. Use Advanced scenes for variety (max 30% of content scenes) unless the content specifically demands them (e.g., ArchitectureDiagram for architecture topics, TimelineScene for historical timelines).

---

## Scene Visual Classification

```
VISUAL-HEAVY (target 60%+ of content scenes):
  DiagramFlow, VisualMetaphor, ComparisonSplit, BeforeAfter,
  TimelineScene, DataChart, StepSequence, StatHighlight, ColdOpen

TEXT-HEAVY (target 40% max of content scenes):
  ConceptExplain, BulletRevealScene, CodeDisplay, WarningCallout

STRUCTURAL (don't count toward ratio):
  HookQuestion, TitleIntro, SectionTitle, KeyTakeaway,
  SummaryRecap, Outro, EndScreen
```

---

## 1. HookQuestion

**Purpose**: Provocative opening to grab attention. Always Scene 1.
**Tier**: Core
**Duration**: 4-5s (120-150 frames at 30fps)
**Layout**: Centered hero
**Animation**: Spring scale-in (0.9→1) + opacity fade
**Props**: `question`, `subtext?`, `entrance?: 'scale' | 'blur' | 'fadeUp'`

**When to use**: Every video's first scene. Ask a question the viewer thinks they know the answer to.

**narration example**: "Create curiosity gap — pose a question the viewer can't ignore"

**Content constraints**:
- Question max 8 words
- Subtext max 12 words
- Must create curiosity gap

**Example**:
```
question: "What actually happens when you click a link?"
subtext: "It's more complex than you think"
```

---

## 2. TitleIntro

**Purpose**: Video title + learning objectives. Always Scene 2.
**Tier**: Core
**Duration**: 6-8s (180-240 frames)
**Layout**: Centered with underline divider
**Animation**: Title fade-up → underline expand → objectives stagger-in
**Props**: `title`, `objectives[]`, `entrance?: 'fadeUp' | 'scaleRotate' | 'splitReveal'`

**When to use**: Immediately after the hook. Sets expectations.

**narration example**: "Set expectations — tease what's coming without listing objectives verbatim"

**Content constraints**:
- Title max 8 words
- 2-4 objectives, each max 10 words
- Objectives should be outcomes ("Understand X", "Know when to use Y")

---

## 3. SectionTitle

**Purpose**: Chapter marker at the start of each section.
**Tier**: Core
**Duration**: 3-4s (90-120 frames)
**Layout**: Centered with section badge
**Animation**: Badge pop-in → title fade-up → subtitle fade
**Props**: `sectionNumber`, `title`, `subtitle?`, `entrance?: 'fadeUp' | 'slideLeft' | 'scaleBlur'`

**When to use**: Start of every section (3-7 per video).

**narration example**: "Brief transition — connect previous section to what's coming next"

**Content constraints**:
- Title max 5 words
- Subtitle max 10 words

---

## 4. ConceptExplain

**Purpose**: Core teaching scene — heading + body text + optional analogy.
**Tier**: Core
**Duration**: 6-8s (180-240 frames)
**Layout**: Left-aligned with padding
**Animation**: Head fade-up → body fade-up (12f delay) → analogy fade (25f delay)
**Props**: `heading`, `body`, `analogy?`, `icon?`, `headingEntrance?: 'fadeUp' | 'fadeLeft' | 'typewriter'`

**When to use**: The workhorse scene for explaining any concept.

**narration example**: "Explain concept in own words — use the analogy to make it click"

**Content constraints**:
- Heading max 6 words
- Body max 30 words (2 lines)
- Analogy max 20 words, must start with a relatable comparison

---

## 5. DiagramFlow

**Purpose**: Animated boxes + arrows showing processes/flows.
**Tier**: Core
**Duration**: 8-12s (240-360 frames)
**Layout**: Title top, diagram centered
**Animation**: Nodes scale-in staggered → arrows draw-in between them
**Props**: `title`, `nodes[]`, `connections[]`, `direction?`

**When to use**: Any process, pipeline, data flow, request lifecycle.

**narration example**: "Walk through the flow step by step — connect each node to the next"

**Content constraints**:
- Max 5 nodes
- Each node label max 3 words
- Arrow labels optional, max 2 words
- Horizontal preferred for 3-4 nodes, vertical for 4-5

---

## 6. CodeDisplay

**Purpose**: Code block with typewriter reveal and optional annotations.
**Tier**: Core
**Duration**: 8-15s (240-450 frames)
**Layout**: Title top, code left, annotations right
**Animation**: Title fade-up → code typewriter → annotations stagger-in
**Props**: `title`, `code`, `annotations?[]`, `highlightLines?[]`

**When to use**: Any time you show code, commands, or config.

**narration example**: "Explain what the code does and why it matters — never read syntax"

**Content constraints**:
- Code max 8 lines
- Each annotation max 10 words
- Annotations tied to specific line numbers
- Duration should scale with code length (1.5s per line)

---

## 7. ComparisonSplit

**Purpose**: Two-column A vs B comparison.
**Tier**: Core
**Duration**: 6-10s (180-300 frames)
**Layout**: Heading top, two equal columns with VS divider
**Animation**: Heading fade → left slide-in-from-left → right slide-in-from-right → items stagger
**Props**: `heading`, `left: {title, items[], color}`, `right: {title, items[], color}`, `entranceStyle?: 'slide' | 'spring' | 'overshoot'`

**When to use**: Good vs bad, before/after, old vs new, two approaches.

**narration example**: "Highlight the key difference — make one side clearly better for the context"

**Content constraints**:
- Heading max 6 words
- Each side: title max 3 words, max 4 items, each item max 8 words
- Use red/amber for "bad" side, green/cyan for "good" side

---

## 8. StatHighlight

**Purpose**: Big animated number with context.
**Tier**: Core
**Duration**: 4-6s (120-180 frames)
**Layout**: Centered hero
**Animation**: Number counts from 0 → target with spring scale → label fade-up → context fade
**Props**: `stat`, `suffix?`, `prefix?`, `label`, `context?`, `emphasis?: 'default' | 'glow' | 'gradient'`

**When to use**: Key statistics, percentages, performance numbers.

**narration example**: "Build up to the number — frame why this stat should blow their mind"

**Content constraints**:
- One number per scene
- Suffix: "%", "x", "ms", "K", "M"
- Label max 6 words
- Context max 15 words

---

## 9. BulletRevealScene

**Purpose**: Progressive list of items.
**Tier**: Core
**Duration**: 5-10s (150-300 frames)
**Layout**: Heading top, bullets stacked below
**Animation**: Heading fade-up → bullets stagger-in from left
**Props**: `heading`, `items[]`, `bulletStyle?`

**When to use**: Lists of benefits, features, requirements, considerations.

**narration example**: "Introduce the list, then highlight the 2 most important items"

**Content constraints**:
- Heading max 5 words
- Max 5 bullets, each max 10 words
- Duration should scale: 1.5s base + 1s per bullet

---

## 10. VisualMetaphor

**Purpose**: Large emoji/icon + analogy text for abstract concepts.
**Tier**: Core
**Duration**: 5-8s (150-240 frames)
**Layout**: Centered — icon on top, heading middle, analogy below
**Animation**: Icon pop-in (snappy spring) → heading fade-up → analogy fade
**Props**: `icon`, `heading`, `analogy`, `iconEffect?: 'pop' | 'rotate' | 'bounce'`

**When to use**: Breaking complex concepts with relatable analogies. Use after dense scenes.

**narration example**: "Deliver the analogy with personality — make it funny and memorable"

**Content constraints**:
- Icon: single emoji
- Heading max 5 words
- Analogy max 25 words
- Must connect to something the viewer already knows

---

## 11. KeyTakeaway

**Purpose**: End-of-section summary in an accent box.
**Tier**: Core
**Duration**: 4-6s (120-180 frames)
**Layout**: Centered with accent box
**Animation**: Heading fade-up → accent box scale-in
**Props**: `heading?`, `takeaway`, `variant?`

**When to use**: Last scene of each section. Distills the section into one memorable statement.

**narration example**: "Reinforce the section's key point — one sentence the viewer remembers"

**Content constraints**:
- Takeaway max 25 words
- Must be independently understandable without section context

---

## 12. SummaryRecap

**Purpose**: Numbered recap of everything covered.
**Tier**: Core
**Duration**: 8-12s (240-360 frames)
**Layout**: Heading top, numbered list stacked
**Animation**: Heading fade-up → items stagger-in with number badges
**Props**: `heading?`, `items[]`, `itemEntrance?: 'left' | 'scale' | 'fade'`

**When to use**: Near the end of the video, before the outro.

**narration example**: "Rapid-fire recap — hit the highlights from each section in order"

**Content constraints**:
- One item per section covered
- Each item max 10 words
- Should match section titles for recognition

---

## 13. Outro (Deprecated)

**Purpose**: Channel branding + CTA. **Deprecated** — use `EndScreen` instead for polished end cards with gradient text and glow CTA.
**Tier**: Advanced
**Duration**: 4-6s (120-180 frames)
**Layout**: Centered — logo top, CTA button middle, tagline bottom
**Animation**: Logo pop-in (snappy) → CTA button fade-up → tagline fade
**Props**: `channel?`, `cta?`, `tagline?`

**When to use**: Always the last scene.

**narration example**: "Brief sign-off — keep it short, no generic 'thanks for watching'"

**Content constraints**:
- CTA max 4 words ("Subscribe for more")
- Tagline max 6 words

---

## 14. WarningCallout

**Purpose**: Red/amber callout for common mistakes or dangers.
**Tier**: Advanced
**Duration**: 5-7s (150-210 frames)
**Layout**: Centered with accent box
**Animation**: Heading fade-up with subtle pulse → accent box scale-in
**Props**: `heading`, `body`, `severity?`

**When to use**: Common mistakes, pitfalls, security concerns, things to avoid.

**narration example**: "Deliver with urgency — this is the one thing they absolutely must remember"

**Content constraints**:
- Heading max 6 words, should feel urgent
- Body max 30 words
- Use `danger` severity for security/critical, `warning` for common mistakes

---

## 15. StepSequence

**Purpose**: Numbered steps with badges for how-to content.
**Tier**: Advanced
**Duration**: 8-12s (240-360 frames)
**Layout**: Heading top, steps stacked with section badges
**Animation**: Heading fade-up → steps stagger-in with badge pop-ins
**Props**: `heading`, `steps: {title, description?}[]`

**When to use**: Step-by-step processes, setup instructions, workflows.

**narration example**: "Walk through steps in order — use connecting phrases, not just numbering"

**Content constraints**:
- Max 5 steps
- Each step title max 5 words
- Each step description max 12 words (optional)
- Duration scales: 2s per step minimum

---

## 16. EndScreen

**Purpose**: Polished end card with gradient text, animated CTA, and optional social links. Replaces basic Outro.
**Tier**: Core
**Duration**: 4-6s (120-180 frames)
**Layout**: Centered — channel name + underline + CTA button + tagline + social links
**Animation**: Channel name bouncy spring → underline expand → CTA fade-up with glow pulse → tagline fade → social links stagger
**Props**: `channel?`, `cta?`, `tagline?`, `socialLinks?: {label, handle}[]`, `showParticles?`

**When to use**: As a premium replacement for Outro. Use for polished end cards with branding.

**narration example**: "Conversational CTA — one sentence that feels natural, not salesy"

**Content constraints**:
- CTA max 4 words
- Tagline max 6 words
- Max 3 social links

---

## 17. ColdOpen

**Purpose**: Dramatic opening with bold statement, glow/gradient effects, and particle background.
**Tier**: Advanced
**Duration**: 4-6s (120-180 frames)
**Layout**: Centered hero
**Animation**: Heavy spring entrance with glow pulse or gradient text
**Props**: `statement`, `subtext?`, `entrance?: 'glow' | 'gradient' | 'typewriter'`, `showParticles?`

**When to use**: Alternative to HookQuestion for dramatic, statement-driven openings.

**narration example**: "Dramatic attention grab — jump straight into a bold statement, no warmup"

**Content constraints**:
- Statement max 8 words
- Subtext max 12 words

---

## 18. BeforeAfter

**Purpose**: Before/after comparison with animated wipe or split reveal.
**Tier**: Advanced
**Duration**: 8-12s (240-360 frames)
**Layout**: Heading top, two panels side by side
**Animation**: Before panel slides in → after panel wipe-reveals or slides in
**Props**: `heading`, `before: {title, items[]}`, `after: {title, items[]}`, `reveal?: 'wipe' | 'split'`

**When to use**: Showing improvements, transformations, old vs new approaches.

**narration example**: "Emphasize the contrast — make the 'after' feel like a revelation"

**Content constraints**:
- Heading max 6 words
- Each panel: title max 3 words, max 4 items, each max 8 words

---

## 19. TimelineScene

**Purpose**: Horizontal or vertical timeline with progressively drawn line and node pop-ins.
**Tier**: Advanced
**Duration**: 8-12s (240-360 frames)
**Layout**: Heading top, timeline centered
**Animation**: Nodes pop-in staggered with connecting lines drawing between them
**Props**: `heading`, `nodes: {label, description?}[]`, `layout?: 'horizontal' | 'vertical'`

**When to use**: Historical progressions, evolution of technology, step sequences over time.

**narration example**: "Narrate the progression — what happens at each stage and why it matters"

**Content constraints**:
- Horizontal layout: max 5 nodes, labels max 2 words. For 6+ nodes use vertical layout
- Vertical layout: max 6 nodes
- Each label max 3 words (vertical) / 2 words (horizontal)
- Each description max 10 words

---

## 20. DataChart

**Purpose**: Animated bar chart with staggered spring-animated bars and value labels.
**Tier**: Advanced
**Duration**: 8-12s (240-360 frames)
**Layout**: Heading top, bars stacked vertically
**Animation**: Heading fade → bars grow with spring + value counter
**Props**: `heading`, `bars: {label, value, color?}[]`, `maxValue?`, `suffix?`

**When to use**: Statistics, performance comparisons, survey results, market data.

**narration example**: "Call out the most interesting data points — pick the standout numbers"

**Content constraints**:
- Max 6 bars
- Each label max 3 words
- Suffix: "%", "x", "ms", "K", etc.

---

---

## 21. FeatureIntro

**Purpose**: Polished feature introduction with left-aligned content, breadcrumb counter, and pill badges.
**Tier**: Advanced
**Duration**: 6-8s (180-240 frames)
**Layout**: Content in left 65% of frame (negative space on right), breadcrumb top-left
**Animation**: Heading fadeUpSlow → ColorBorderCard scale-in → PillBadge row stagger
**Props**: `heading`, `definition`, `badge?`, `icon?`, `breadcrumb?: {current, total, label}`, `pills?: {label, color?}[]`, `sectionColor?`

**When to use**: Introducing a new feature, concept, or topic at the start of a section. Prefer over ConceptExplain when defining something for the first time.

**narration example**: "Build anticipation — explain why this feature matters before defining it"

**Content constraints**:
- Heading max 6 words
- Definition max 30 words
- Max 4 pills
- Badge max 2 words (ALL CAPS)

---

## 22. ProgressiveTerminal

**Purpose**: Terminal-style progressive reveal of items inside a single card.
**Tier**: Advanced
**Duration**: 6-10s (180-300 frames)
**Layout**: Heading top, single large ColorBorderCard with items appearing one by one
**Animation**: Heading fadeUpSlow → card scale-in → items stagger with fadeLeftSlow (14f delay)
**Props**: `heading`, `items: {text, icon?, highlight?}[]`, `summary?`, `sectionColor?`

**When to use**: Listing capabilities, features, or sequential points that build on each other.

**narration example**: "Highlight the 2-3 most interesting items — don't just read the list"

**Content constraints**:
- Heading max 6 words
- Max 6 items, each max 12 words
- Highlight keyword max 3 words per item

---

## 23. DecisionTable

**Purpose**: Decision matrix with question/answer rows using pill badges.
**Tier**: Advanced
**Duration**: 6-10s (180-300 frames)
**Layout**: Heading centered, stacked ColorBorderCard rows
**Animation**: Heading fade → rows stagger in (14f delay), each row: question left + PillBadge answer right
**Props**: `heading`, `rows: {icon?, question, answer, answerColor?}[]`, `sectionColor?`

**When to use**: Decision criteria, FAQ-style content, when to use what, feature comparisons as rows.

**narration example**: "Frame the decision context, then call out the most surprising answer"

**Content constraints**:
- Heading max 6 words
- Max 5 rows
- Each question max 10 words
- Each answer max 3 words (pill badge)

---

## 24. ThreeColumnCompare

**Purpose**: Three-way comparison with colored cards side by side.
**Tier**: Advanced
**Duration**: 8-12s (240-360 frames)
**Layout**: Heading top, three equal ColorBorderCards (gap 24px)
**Animation**: Heading fade → cards stagger in → items stagger within each card
**Props**: `heading`, `columns: [{title, icon?, items[], color}] x3`

**When to use**: Comparing three approaches, tools, or categories. When ComparisonSplit's two columns aren't enough.

**narration example**: "Highlight what makes each option distinct — create a narrative arc across the three"

**Content constraints**:
- Heading max 6 words
- Each column: title max 3 words, max 4 items, each item max 8 words
- Each column gets its own color

---

## 25. FileTreeScene

**Purpose**: Directory/file structure visualization with annotations.
**Tier**: Advanced
**Duration**: 8-12s (240-360 frames)
**Layout**: Heading top, FileTree left (2/3), optional annotation card right (1/3)
**Animation**: Heading fadeUpSlow → tree items stagger with fadeLeftSlow → annotation card fades in last
**Props**: `heading`, `items: {name, type, indent, color?, highlight?}[]`, `annotation?`, `sectionColor?`

**When to use**: Showing project structure, file organization, config layouts, directory hierarchies.

**narration example**: "Explain the architecture reasoning — why it's organized this way, not just what's there"

**Content constraints**:
- Heading max 6 words
- Max 12 tree items
- Max 3 indent levels
- Annotation max 25 words

---

## 26. KeyRuleCard

**Purpose**: Key insight/rule with gradient text emphasis and optional detail cards.
**Tier**: Advanced
**Duration**: 5-7s (150-210 frames)
**Layout**: Centered — preLabel (monospace caps) → large statement with gradient highlight → subtitle → optional detail cards
**Animation**: Labels fade → statement with gradient text glow → subtitle fade → cards stagger
**Props**: `preLabel?`, `statement`, `highlightWord?`, `subtitle?`, `cards?: {text, icon?}[]`, `sectionColor?`

**When to use**: Key rules, important insights, memorable one-liners. Use instead of KeyTakeaway when you want gradient emphasis.

**narration example**: "Deliver with conviction — short, punchy, let the statement breathe"

**Content constraints**:
- preLabel max 3 words (ALL CAPS)
- Statement max 12 words
- highlightWord: 1-3 words from the statement
- Subtitle max 20 words
- Max 3 detail cards, each max 8 words

---

## 27. ArchitectureDiagram

**Purpose**: Hub-spoke architecture layout with central node and satellites.
**Tier**: Advanced
**Duration**: 8-12s (240-360 frames)
**Layout**: Heading top, central ColorBorderCard with glow, satellite cards arranged in circle, SVG dashed connection lines
**Animation**: Heading fade → center node scale-in → connection lines fade → satellites stagger in (14f delay)
**Props**: `heading`, `center: {label, icon?, sublabel?, color?}`, `satellites: {label, icon?, sublabel?, color?}[]`, `sectionColor?`

**When to use**: System architectures, hub-spoke relationships, central concept with related components.

**narration example**: "Start from the center hub and explain outward — match the visual reveal rhythm"

**Content constraints**:
- Heading max 6 words
- Center label max 3 words
- Max 6 satellites
- Each satellite label max 3 words

---

## Scene Selection Priorities

When planning scenes, prefer the polished Advanced scene types when the content fits:

| Instead of... | Prefer... | When... |
|--------------|-----------|---------|
| ConceptExplain | **FeatureIntro** | Introducing/defining something for the first time |
| BulletRevealScene | **DecisionTable** | Content is question/answer or criteria pairs |
| ComparisonSplit | **ThreeColumnCompare** | Comparing 3 things |
| DiagramFlow | **ArchitectureDiagram** | Hub-spoke/radial relationships |
| KeyTakeaway | **KeyRuleCard** | Gradient-emphasis key insights |
| — | **FileTreeScene** | Showing project structure or file organization |
| — | **ProgressiveTerminal** | Listing capabilities that build on each other |
| StepSequence | **StepSequence `variant="card"`** | Polished step-by-step with card styling |
| DiagramFlow | **DiagramFlow `variant="pipeline"`** | Linear horizontal pipelines |
| KeyTakeaway | **KeyTakeaway `variant="insight"`** | Gradient text takeaways |

### Transition Variety
Plan 2-3 different transition types per video:
- **fade** (15 frames) — default, most transitions
- **slideLeft/slideRight** (20 frames) — after section titles or conceptual shifts
- **slideUp** (20 frames) — before summary/recap scenes
- **wipeRight** (18 frames) — after diagram/stat scenes
- **clockWipe** (25 frames) — sparingly, for major section changes

### Entrance Variety
- HookQuestion: `fadeUp`, `blur`, or `scale` (never `typewriter` — too slow for hooks)
- TitleIntro: `scaleRotate` or `splitReveal`
- SectionTitle: alternate `fadeUp`, `slideLeft`, `scaleBlur`
- VisualMetaphor: rotate `iconEffect` between `pop`, `rotate`, `bounce`
- StatHighlight: use `glow` or `gradient` emphasis
