---
name: educational-scenes
description: Complete catalog of reusable scene types for educational videos
metadata:
  tags: scenes, educational, catalog, templates
---

# Educational Scene Catalog

All scene types available for educational videos. Each scene is a reusable React component in `src/shared/scenes/`.

---

## 1. HookQuestion

**Purpose**: Provocative opening to grab attention. Always Scene 1.
**Duration**: 4-5s (120-150 frames at 30fps)
**Layout**: Centered hero
**Animation**: Spring scale-in (0.9→1) + opacity fade
**Props**: `question`, `subtext?`

**When to use**: Every video's first scene. Ask a question the viewer thinks they know the answer to.

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
**Props**: `title`, `objectives[]`

**When to use**: Immediately after the hook. Sets expectations.

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
**Props**: `sectionNumber`, `title`, `subtitle?`

**When to use**: Start of every section (3-7 per video).

**Content constraints**:
- Title max 5 words
- Subtitle max 10 words

---

## 4. ConceptExplain

**Purpose**: Core teaching scene — heading + body text + optional analogy.
**Duration**: 6-8s (180-240 frames)
**Layout**: Left-aligned with padding
**Animation**: Head fade-up → body fade-up (12f delay) → analogy fade (25f delay)
**Props**: `heading`, `body`, `analogy?`, `icon?`

**When to use**: The workhorse scene for explaining any concept.

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
**Props**: `heading`, `left: {title, items[], color}`, `right: {title, items[], color}`

**When to use**: Good vs bad, before/after, old vs new, two approaches.

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
**Props**: `stat`, `suffix?`, `prefix?`, `label`, `context?`

**When to use**: Key statistics, percentages, performance numbers.

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
**Props**: `icon`, `heading`, `analogy`

**When to use**: Breaking complex concepts with relatable analogies. Use after dense scenes.

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

**Content constraints**:
- Takeaway max 25 words
- Must be independently understandable without section context

---

## 12. SummaryRecap

**Purpose**: Numbered recap of everything covered.
**Duration**: 8-12s (240-360 frames)
**Layout**: Heading top, numbered list stacked
**Animation**: Heading fade-up → items stagger-in with number badges
**Props**: `heading?`, `items[]`

**When to use**: Near the end of the video, before the outro.

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

**Content constraints**:
- Max 5 steps
- Each step title max 5 words
- Each step description max 12 words (optional)
- Duration scales: 2s per step minimum

---

## Scene Sequencing Rules

1. **Never use the same scene type 3+ times in a row**
2. **Alternate dense and light**: ConceptExplain/CodeDisplay/DiagramFlow → VisualMetaphor/StatHighlight → next concept
3. **Every section starts with SectionTitle and ends with KeyTakeaway**
4. **Video always starts with HookQuestion → TitleIntro**
5. **Video always ends with SummaryRecap → Outro**
6. **DiagramFlow and CodeDisplay are "heavy" scenes** — follow with a lighter scene
7. **StatHighlight and VisualMetaphor are "palette cleansers"** — use between heavy scenes
