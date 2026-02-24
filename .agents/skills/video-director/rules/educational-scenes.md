---
name: educational-scenes
description: Complete catalog of reusable scene types for educational videos
metadata:
  tags: scenes, educational, catalog, templates
---

# Educational Scene Catalog

All scene types available for educational videos. Each scene is a reusable React component in `src/shared/scenes/`.

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
**Duration**: 4-5s (120-150 frames at 30fps)
**Layout**: Centered hero
**Animation**: Spring scale-in (0.9→1) + opacity fade
**Props**: `question`, `subtext?`, `entrance?: 'scale' | 'blur' | 'fadeUp'`

**When to use**: Every video's first scene. Ask a question the viewer thinks they know the answer to.

**narrationIntent example**: "Create curiosity gap — pose a question the viewer can't ignore"

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
**Duration**: 6-8s (180-240 frames)
**Layout**: Centered with underline divider
**Animation**: Title fade-up → underline expand → objectives stagger-in
**Props**: `title`, `objectives[]`, `entrance?: 'fadeUp' | 'scaleRotate' | 'splitReveal'`

**When to use**: Immediately after the hook. Sets expectations.

**narrationIntent example**: "Set expectations — tease what's coming without listing objectives verbatim"

**Content constraints**:
- Title max 8 words
- 2-4 objectives, each max 10 words
- Objectives should be outcomes ("Understand X", "Know when to use Y")

---

## 3. SectionTitle

**Purpose**: Chapter marker at the start of each section.
**Duration**: 3-4s (90-120 frames)
**Layout**: Centered with section badge
**Animation**: Badge pop-in → title fade-up → subtitle fade
**Props**: `sectionNumber`, `title`, `subtitle?`, `entrance?: 'fadeUp' | 'slideLeft' | 'scaleBlur'`

**When to use**: Start of every section (3-7 per video).

**narrationIntent example**: "Brief transition — connect previous section to what's coming next"

**Content constraints**:
- Title max 5 words
- Subtitle max 10 words

---

## 4. ConceptExplain

**Purpose**: Core teaching scene — heading + body text + optional analogy.
**Duration**: 6-8s (180-240 frames)
**Layout**: Left-aligned with padding
**Animation**: Head fade-up → body fade-up (12f delay) → analogy fade (25f delay)
**Props**: `heading`, `body`, `analogy?`, `icon?`, `headingEntrance?: 'fadeUp' | 'fadeLeft' | 'typewriter'`

**When to use**: The workhorse scene for explaining any concept.

**narrationIntent example**: "Explain concept in own words — use the analogy to make it click"

**Content constraints**:
- Heading max 6 words
- Body max 30 words (2 lines)
- Analogy max 20 words, must start with a relatable comparison

---

## 5. DiagramFlow

**Purpose**: Animated boxes + arrows showing processes/flows.
**Duration**: 8-12s (240-360 frames)
**Layout**: Title top, diagram centered
**Animation**: Nodes scale-in staggered → arrows draw-in between them
**Props**: `title`, `nodes[]`, `connections[]`, `direction?`

**When to use**: Any process, pipeline, data flow, request lifecycle.

**narrationIntent example**: "Walk through the flow step by step — connect each node to the next"

**Content constraints**:
- Max 5 nodes
- Each node label max 3 words
- Arrow labels optional, max 2 words
- Horizontal preferred for 3-4 nodes, vertical for 4-5

---

## 6. CodeDisplay

**Purpose**: Code block with typewriter reveal and optional annotations.
**Duration**: 8-15s (240-450 frames)
**Layout**: Title top, code left, annotations right
**Animation**: Title fade-up → code typewriter → annotations stagger-in
**Props**: `title`, `code`, `annotations?[]`, `highlightLines?[]`

**When to use**: Any time you show code, commands, or config.

**narrationIntent example**: "Explain what the code does and why it matters — never read syntax"

**Content constraints**:
- Code max 8 lines
- Each annotation max 10 words
- Annotations tied to specific line numbers
- Duration should scale with code length (1.5s per line)

---

## 7. ComparisonSplit

**Purpose**: Two-column A vs B comparison.
**Duration**: 6-10s (180-300 frames)
**Layout**: Heading top, two equal columns with VS divider
**Animation**: Heading fade → left slide-in-from-left → right slide-in-from-right → items stagger
**Props**: `heading`, `left: {title, items[], color}`, `right: {title, items[], color}`, `entranceStyle?: 'slide' | 'spring' | 'overshoot'`

**When to use**: Good vs bad, before/after, old vs new, two approaches.

**narrationIntent example**: "Highlight the key difference — make one side clearly better for the context"

**Content constraints**:
- Heading max 6 words
- Each side: title max 3 words, max 4 items, each item max 8 words
- Use red/amber for "bad" side, green/cyan for "good" side

---

## 8. StatHighlight

**Purpose**: Big animated number with context.
**Duration**: 4-6s (120-180 frames)
**Layout**: Centered hero
**Animation**: Number counts from 0 → target with spring scale → label fade-up → context fade
**Props**: `stat`, `suffix?`, `prefix?`, `label`, `context?`, `emphasis?: 'default' | 'glow' | 'gradient'`

**When to use**: Key statistics, percentages, performance numbers.

**narrationIntent example**: "Build up to the number — frame why this stat should blow their mind"

**Content constraints**:
- One number per scene
- Suffix: "%", "x", "ms", "K", "M"
- Label max 6 words
- Context max 15 words

---

## 9. BulletRevealScene

**Purpose**: Progressive list of items.
**Duration**: 5-10s (150-300 frames)
**Layout**: Heading top, bullets stacked below
**Animation**: Heading fade-up → bullets stagger-in from left
**Props**: `heading`, `items[]`, `bulletStyle?`

**When to use**: Lists of benefits, features, requirements, considerations.

**narrationIntent example**: "Introduce the list, then highlight the 2 most important items"

**Content constraints**:
- Heading max 5 words
- Max 5 bullets, each max 10 words
- Duration should scale: 1.5s base + 1s per bullet

---

## 10. VisualMetaphor

**Purpose**: Large emoji/icon + analogy text for abstract concepts.
**Duration**: 5-8s (150-240 frames)
**Layout**: Centered — icon on top, heading middle, analogy below
**Animation**: Icon pop-in (snappy spring) → heading fade-up → analogy fade
**Props**: `icon`, `heading`, `analogy`, `iconEffect?: 'pop' | 'rotate' | 'bounce'`

**When to use**: Breaking complex concepts with relatable analogies. Use after dense scenes.

**narrationIntent example**: "Deliver the analogy with personality — make it funny and memorable"

**Content constraints**:
- Icon: single emoji
- Heading max 5 words
- Analogy max 25 words
- Must connect to something the viewer already knows

---

## 11. KeyTakeaway

**Purpose**: End-of-section summary in an accent box.
**Duration**: 4-6s (120-180 frames)
**Layout**: Centered with accent box
**Animation**: Heading fade-up → accent box scale-in
**Props**: `heading?`, `takeaway`, `variant?`

**When to use**: Last scene of each section. Distills the section into one memorable statement.

**narrationIntent example**: "Reinforce the section's key point — one sentence the viewer remembers"

**Content constraints**:
- Takeaway max 25 words
- Must be independently understandable without section context

---

## 12. SummaryRecap

**Purpose**: Numbered recap of everything covered.
**Duration**: 8-12s (240-360 frames)
**Layout**: Heading top, numbered list stacked
**Animation**: Heading fade-up → items stagger-in with number badges
**Props**: `heading?`, `items[]`, `itemEntrance?: 'left' | 'scale' | 'fade'`

**When to use**: Near the end of the video, before the outro.

**narrationIntent example**: "Rapid-fire recap — hit the highlights from each section in order"

**Content constraints**:
- One item per section covered
- Each item max 10 words
- Should match section titles for recognition

---

## 13. Outro

**Purpose**: Channel branding + CTA.
**Duration**: 4-6s (120-180 frames)
**Layout**: Centered — logo top, CTA button middle, tagline bottom
**Animation**: Logo pop-in (snappy) → CTA button fade-up → tagline fade
**Props**: `channel?`, `cta?`, `tagline?`

**When to use**: Always the last scene.

**narrationIntent example**: "Brief sign-off — keep it short, no generic 'thanks for watching'"

**Content constraints**:
- CTA max 4 words ("Subscribe for more")
- Tagline max 6 words

---

## 14. WarningCallout

**Purpose**: Red/amber callout for common mistakes or dangers.
**Duration**: 5-7s (150-210 frames)
**Layout**: Centered with accent box
**Animation**: Heading fade-up with subtle pulse → accent box scale-in
**Props**: `heading`, `body`, `severity?`

**When to use**: Common mistakes, pitfalls, security concerns, things to avoid.

**narrationIntent example**: "Deliver with urgency — this is the one thing they absolutely must remember"

**Content constraints**:
- Heading max 6 words, should feel urgent
- Body max 30 words
- Use `danger` severity for security/critical, `warning` for common mistakes

---

## 15. StepSequence

**Purpose**: Numbered steps with badges for how-to content.
**Duration**: 8-12s (240-360 frames)
**Layout**: Heading top, steps stacked with section badges
**Animation**: Heading fade-up → steps stagger-in with badge pop-ins
**Props**: `heading`, `steps: {title, description?}[]`

**When to use**: Step-by-step processes, setup instructions, workflows.

**narrationIntent example**: "Walk through steps in order — use connecting phrases, not just numbering"

**Content constraints**:
- Max 5 steps
- Each step title max 5 words
- Each step description max 12 words (optional)
- Duration scales: 2s per step minimum

---

## 16. EndScreen

**Purpose**: Polished end card with gradient text, animated CTA, and optional social links. Replaces basic Outro.
**Duration**: 4-6s (120-180 frames)
**Layout**: Centered — channel name + underline + CTA button + tagline + social links
**Animation**: Channel name bouncy spring → underline expand → CTA fade-up with glow pulse → tagline fade → social links stagger
**Props**: `channel?`, `cta?`, `tagline?`, `socialLinks?: {label, handle}[]`, `showParticles?`

**When to use**: As a premium replacement for Outro. Use for polished end cards with branding.

**narrationIntent example**: "Conversational CTA — one sentence that feels natural, not salesy"

**Content constraints**:
- CTA max 4 words
- Tagline max 6 words
- Max 3 social links

---

## 17. ColdOpen

**Purpose**: Dramatic opening with bold statement, glow/gradient effects, and particle background.
**Duration**: 4-6s (120-180 frames)
**Layout**: Centered hero
**Animation**: Heavy spring entrance with glow pulse or gradient text
**Props**: `statement`, `subtext?`, `entrance?: 'glow' | 'gradient' | 'typewriter'`, `showParticles?`

**When to use**: Alternative to HookQuestion for dramatic, statement-driven openings.

**narrationIntent example**: "Dramatic attention grab — jump straight into a bold statement, no warmup"

**Content constraints**:
- Statement max 8 words
- Subtext max 12 words

---

## 18. BeforeAfter

**Purpose**: Before/after comparison with animated wipe or split reveal.
**Duration**: 8-12s (240-360 frames)
**Layout**: Heading top, two panels side by side
**Animation**: Before panel slides in → after panel wipe-reveals or slides in
**Props**: `heading`, `before: {title, items[]}`, `after: {title, items[]}`, `reveal?: 'wipe' | 'split'`

**When to use**: Showing improvements, transformations, old vs new approaches.

**narrationIntent example**: "Emphasize the contrast — make the 'after' feel like a revelation"

**Content constraints**:
- Heading max 6 words
- Each panel: title max 3 words, max 4 items, each max 8 words

---

## 19. TimelineScene

**Purpose**: Horizontal or vertical timeline with progressively drawn line and node pop-ins.
**Duration**: 8-12s (240-360 frames)
**Layout**: Heading top, timeline centered
**Animation**: Nodes pop-in staggered with connecting lines drawing between them
**Props**: `heading`, `nodes: {label, description?}[]`, `layout?: 'horizontal' | 'vertical'`

**When to use**: Historical progressions, evolution of technology, step sequences over time.

**narrationIntent example**: "Narrate the progression — what happens at each stage and why it matters"

**Content constraints**:
- Horizontal layout: max 5 nodes, labels max 2 words. For 6+ nodes use vertical layout
- Vertical layout: max 6 nodes
- Each label max 3 words (vertical) / 2 words (horizontal)
- Each description max 10 words

---

## 20. DataChart

**Purpose**: Animated bar chart with staggered spring-animated bars and value labels.
**Duration**: 8-12s (240-360 frames)
**Layout**: Heading top, bars stacked vertically
**Animation**: Heading fade → bars grow with spring + value counter
**Props**: `heading`, `bars: {label, value, color?}[]`, `maxValue?`, `suffix?`

**When to use**: Statistics, performance comparisons, survey results, market data.

**narrationIntent example**: "Call out the most interesting data points — pick the standout numbers"

**Content constraints**:
- Max 6 bars
- Each label max 3 words
- Suffix: "%", "x", "ms", "K", etc.

---

---

## 21. FeatureIntro

**Purpose**: Polished feature introduction with left-aligned content, breadcrumb counter, and pill badges.
**Duration**: 6-8s (180-240 frames)
**Layout**: Content in left 65% of frame (negative space on right), breadcrumb top-left
**Animation**: Heading fadeUpSlow → ColorBorderCard scale-in → PillBadge row stagger
**Props**: `heading`, `definition`, `badge?`, `icon?`, `breadcrumb?: {current, total, label}`, `pills?: {label, color?}[]`, `sectionColor?`

**When to use**: Introducing a new feature, concept, or topic at the start of a section. Prefer over ConceptExplain when defining something for the first time.

**narrationIntent example**: "Build anticipation — explain why this feature matters before defining it"

**Content constraints**:
- Heading max 6 words
- Definition max 30 words
- Max 4 pills
- Badge max 2 words (ALL CAPS)

---

## 22. ProgressiveTerminal

**Purpose**: Terminal-style progressive reveal of items inside a single card.
**Duration**: 6-10s (180-300 frames)
**Layout**: Heading top, single large ColorBorderCard with items appearing one by one
**Animation**: Heading fadeUpSlow → card scale-in → items stagger with fadeLeftSlow (14f delay)
**Props**: `heading`, `items: {text, icon?, highlight?}[]`, `summary?`, `sectionColor?`

**When to use**: Listing capabilities, features, or sequential points that build on each other.

**narrationIntent example**: "Highlight the 2-3 most interesting items — don't just read the list"

**Content constraints**:
- Heading max 6 words
- Max 6 items, each max 12 words
- Highlight keyword max 3 words per item

---

## 23. DecisionTable

**Purpose**: Decision matrix with question/answer rows using pill badges.
**Duration**: 6-10s (180-300 frames)
**Layout**: Heading centered, stacked ColorBorderCard rows
**Animation**: Heading fade → rows stagger in (14f delay), each row: question left + PillBadge answer right
**Props**: `heading`, `rows: {icon?, question, answer, answerColor?}[]`, `sectionColor?`

**When to use**: Decision criteria, FAQ-style content, when to use what, feature comparisons as rows.

**narrationIntent example**: "Frame the decision context, then call out the most surprising answer"

**Content constraints**:
- Heading max 6 words
- Max 5 rows
- Each question max 10 words
- Each answer max 3 words (pill badge)

---

## 24. ThreeColumnCompare

**Purpose**: Three-way comparison with colored cards side by side.
**Duration**: 8-12s (240-360 frames)
**Layout**: Heading top, three equal ColorBorderCards (gap 24px)
**Animation**: Heading fade → cards stagger in → items stagger within each card
**Props**: `heading`, `columns: [{title, icon?, items[], color}] x3`

**When to use**: Comparing three approaches, tools, or categories. When ComparisonSplit's two columns aren't enough.

**narrationIntent example**: "Highlight what makes each option distinct — create a narrative arc across the three"

**Content constraints**:
- Heading max 6 words
- Each column: title max 3 words, max 4 items, each item max 8 words
- Each column gets its own color

---

## 25. FileTreeScene

**Purpose**: Directory/file structure visualization with annotations.
**Duration**: 8-12s (240-360 frames)
**Layout**: Heading top, FileTree left (2/3), optional annotation card right (1/3)
**Animation**: Heading fadeUpSlow → tree items stagger with fadeLeftSlow → annotation card fades in last
**Props**: `heading`, `items: {name, type, indent, color?, highlight?}[]`, `annotation?`, `sectionColor?`

**When to use**: Showing project structure, file organization, config layouts, directory hierarchies.

**narrationIntent example**: "Explain the architecture reasoning — why it's organized this way, not just what's there"

**Content constraints**:
- Heading max 6 words
- Max 12 tree items
- Max 3 indent levels
- Annotation max 25 words

---

## 26. KeyRuleCard

**Purpose**: Key insight/rule with gradient text emphasis and optional detail cards.
**Duration**: 5-7s (150-210 frames)
**Layout**: Centered — preLabel (monospace caps) → large statement with gradient highlight → subtitle → optional detail cards
**Animation**: Labels fade → statement with gradient text glow → subtitle fade → cards stagger
**Props**: `preLabel?`, `statement`, `highlightWord?`, `subtitle?`, `cards?: {text, icon?}[]`, `sectionColor?`

**When to use**: Key rules, important insights, memorable one-liners. Use instead of KeyTakeaway when you want gradient emphasis.

**narrationIntent example**: "Deliver with conviction — short, punchy, let the statement breathe"

**Content constraints**:
- preLabel max 3 words (ALL CAPS)
- Statement max 12 words
- highlightWord: 1-3 words from the statement
- Subtitle max 20 words
- Max 3 detail cards, each max 8 words

---

## 27. ArchitectureDiagram

**Purpose**: Hub-spoke architecture layout with central node and satellites.
**Duration**: 8-12s (240-360 frames)
**Layout**: Heading top, central ColorBorderCard with glow, satellite cards arranged in circle, SVG dashed connection lines
**Animation**: Heading fade → center node scale-in → connection lines fade → satellites stagger in (14f delay)
**Props**: `heading`, `center: {label, icon?, sublabel?, color?}`, `satellites: {label, icon?, sublabel?, color?}[]`, `sectionColor?`

**When to use**: System architectures, hub-spoke relationships, central concept with related components.

**narrationIntent example**: "Start from the center hub and explain outward — match the visual reveal rhythm"

**Content constraints**:
- Heading max 6 words
- Center label max 3 words
- Max 6 satellites
- Each satellite label max 3 words

---

## Scene Visual Classification

```
VISUAL-HEAVY (target 60%+ of content scenes):
  DiagramFlow, VisualMetaphor, ComparisonSplit, BeforeAfter,
  TimelineScene, DataChart, StepSequence, StatHighlight, ColdOpen,
  FeatureIntro, ThreeColumnCompare, FileTreeScene,
  ArchitectureDiagram, DecisionTable

TEXT-HEAVY (target 40% max of content scenes):
  ConceptExplain, BulletRevealScene, CodeDisplay, WarningCallout,
  ProgressiveTerminal

STRUCTURAL (don't count toward ratio):
  HookQuestion, TitleIntro, SectionTitle, KeyTakeaway, KeyRuleCard,
  SummaryRecap, Outro, EndScreen
```

---

## Scene Sequencing Rules

1. **Never use the same scene type 3+ times in a row**
2. **Alternate dense and light**: ConceptExplain/CodeDisplay/DiagramFlow → VisualMetaphor/StatHighlight → next concept
3. **Every section starts with SectionTitle and ends with KeyTakeaway or KeyRuleCard**
4. **Video always starts with HookQuestion → TitleIntro**
5. **Video always ends with SummaryRecap → EndScreen** (use EndScreen, not basic Outro)
6. **DiagramFlow and CodeDisplay are "heavy" scenes** — follow with a lighter scene
7. **StatHighlight and VisualMetaphor are "palette cleansers"** — use between heavy scenes
8. **Visual ratio rule**: At least 60% of content scenes (excluding structural) must be visual-heavy
9. **No 2+ text-heavy scenes in a row** — always insert a visual scene between them
10. **DiagramFlow preference**: When explaining a process, always prefer DiagramFlow over ConceptExplain
11. **Replace pattern**: ConceptExplain with body > 20 words should be split into: short ConceptExplain (heading + 1 line) followed by DiagramFlow or VisualMetaphor
12. **Two-panel balance**: BeforeAfter and ComparisonSplit must have balanced item counts per side (±1 item max) for visual symmetry
13. **FeatureIntro over ConceptExplain**: When introducing/defining something for the first time, prefer FeatureIntro
14. **DecisionTable over BulletRevealScene**: When content is question/answer pairs, use DecisionTable
15. **ThreeColumnCompare over ComparisonSplit**: When comparing 3 things, use ThreeColumnCompare
16. **ArchitectureDiagram over DiagramFlow**: For hub-spoke/radial relationships, use ArchitectureDiagram
17. **KeyRuleCard over KeyTakeaway**: For gradient-emphasis key insights, use KeyRuleCard
