---
name: prompt-expansion
description: Rules for expanding a simple video idea into a structured production brief
metadata:
  tags: prompt, expansion, brief, planning
---

# Prompt Expansion Engine

This document defines how to transform a short user idea into a complete production brief.

## Step 1: Parse the Input

Extract from the user's text:
- **Subject**: What the video is about
- **Type**: Detect from keywords (see type detection table)
- **Platform**: Any platform mentions (YouTube, Instagram, TikTok, etc.)
- **Style hints**: Any adjectives like "minimal", "bold", "dark", "playful"
- **Duration hints**: Any time mentions like "30 second", "short", "long"
- **Content source**: Check if the topic matches a content plan entry

### Type Detection Table

| Keywords | Detected Type |
|----------|--------------|
| news, daily, roundup, coverage, weekly, digest, latest, trending, today, this week | `news` |
| tutorial, how to, guide, walkthrough, step by step, learn, build, setup, install | `tutorial` |
| everything else — conceptual topics, "how X works", "understanding Y", explain, deep dive, educational, fundamentals | `explainer` |

**Default**: If no type is detected, default to `explainer` for conceptual/learning topics, `news` for current events and announcements.

> **Historical alias**: `educational` maps to `explainer`. The two are treated identically.

### Content Plan Lookup

If a `youtube-content-plan.md` file exists in the project root, check if the user's topic matches any entry. If it does:
- Extract the content plan's bullet points and structure
- Use them as the basis for section planning
- Note the content plan match in the brief under "Content Source"

## Step 2: Apply Defaults

After detecting the type, apply defaults from `video-types.md`.

For `explainer` and `tutorial` types (section-based), also apply:
- Audience profile from `audience-profile.md`
- Scene types from `educational-scenes.md`
- Architecture from `long-form-architecture.md`

For `news` type, also apply audience profile but use flat or section-based structure depending on length.

### Per-Section Color Assignment (Explainer / Tutorial)

Assign a color from `SECTION_THEMES` to each section:
```
Section 1 → BRAND.indigo (#6366f1)
Section 2 → BRAND.cyan (#06b6d4)
Section 3 → BRAND.amber (#f59e0b)
Section 4 → BRAND.green (#10b981)
Section 5 → BRAND.violet (#8b5cf6)
Section 6 → BRAND.red (#ef4444)
```

Note the assigned color in each section's brief. All scenes within a section receive the section's color as `sectionColor` prop.

## Step 3: Generate Scene Breakdown

### Scene Structure Rules

Each scene MUST specify:

```
Scene [N]: [Name]
- Duration: [X] frames ([Y]s at [FPS]fps)
- Content: [What appears on screen]
- Text: [Exact text to display, if any]
- Animation: [Entry animation type]
- Exit: [How it leaves — fade out, slide out, or cut]
- Layout: [center | left-right | top-bottom | stacked | diagram | comparison | code]
```

### Scene Count Guidelines

| Video Duration | Scene Count | Type |
|---------------|-------------|------|
| 60-120s | 5-15 scenes | News (short) |
| 120-240s | 15-30 scenes | News / Tutorial / Explainer |
| 240-420s | 25-45 scenes | Explainer / Tutorial |
| 420-600s | 40-60 scenes | Explainer / Tutorial |

### Scene Pacing Rules

- **Opening scene**: 2-4 seconds — hook the viewer immediately
- **Content scenes**: 3-6 seconds each — enough to read and absorb
- **Transition scenes**: 0.5-1 second — keep momentum
- **Closing/CTA scene**: 3-5 seconds — give time to act
- Leave 0.5s breathing room between dense text scenes

### Educational Pacing Rules (Additional)

- **Alternate dense and light scenes**: Heavy concept → visual metaphor → next concept
- **Section titles are breathers**: 3-4s of clean visual before diving into content
- **DiagramFlow and CodeDisplay need extra time**: 8-15s to let animation complete
- **StatHighlight is a palate cleanser**: Use between heavy sections
- **Key Takeaways anchor each section**: Don't skip them

## Step 4: Choose Visual System

### Typography Selection

Pick fonts that match the tone:

| Tone | Heading Font | Body Font |
|------|-------------|-----------|
| Professional/SaaS | Inter, Manrope, Plus Jakarta Sans | Same as heading |
| Bold/Impactful | Bebas Neue, Oswald, Anton | Inter, DM Sans |
| Friendly/Casual | Poppins, Nunito, Quicksand | Same as heading |
| Technical/Dev | JetBrains Mono, Fira Code | Inter, Source Sans 3 |
| Elegant/Premium | Playfair Display, Cormorant | Lato, Open Sans |
| Educational | Inter, Manrope | Same + JetBrains Mono for code |

### Color Palette Generation

Generate a 5-color palette:

1. **Primary**: The dominant brand/theme color
2. **Secondary**: Complementary or analogous to primary
3. **Accent**: High-contrast pop color for emphasis
4. **Background**: Dark (#0a0a0a to #1a1a2e) or light (#f8f9fa to #ffffff)
5. **Text**: High contrast against background (#ffffff on dark, #111827 on light)

Default to dark background unless the subject implies light (e.g., healthcare, children's content).

For explainer and news videos, use the medevsmaker palette by default (see video-types.md).

### Background Style Decision

| Video Type | Default Background |
|-----------|-------------------|
| News | Gradient (bg → bgLight, subtle) with particle overlay |
| Explainer | Gradient (bg → bgLight, subtle) with particle overlay |
| Tutorial | Solid dark with subtle grid overlay |

## Step 5: Visual Effects

Choose visual polish settings for the production brief:

### Background Overlay
| Video Type | Default Overlay |
|-----------|----------------|
| News | particles |
| Explainer | particles |
| Tutorial | grid |

### Transition Variety
Plan 2-3 different transition types per video to avoid monotony:
- **fade** (15 frames) — default, use for most transitions
- **slideLeft/slideRight** (20 frames) — use after section titles or between conceptual shifts
- **slideUp** (20 frames) — use before summary/recap scenes
- **wipeRight** (18 frames) — use after diagram/stat scenes for dramatic reveal
- **clockWipe** (25 frames) — use sparingly for major section changes

### Entrance Variety
Assign entrance props to scenes for visual variety:
- HookQuestion: `fadeUp` for smooth reveals, `blur` for mysterious openings, `scale` for punchy hooks
- TitleIntro: `scaleRotate` for dynamic titles, `splitReveal` for dramatic reveals
- SectionTitle: alternate between `fadeUp`, `slideLeft`, `scaleBlur`
- ConceptExplain: use `fadeLeft` or `typewriter` occasionally
- VisualMetaphor: rotate `iconEffect` between `pop`, `rotate`, `bounce`
- StatHighlight: use `glow` or `gradient` emphasis for key stats
- ComparisonSplit: use `overshoot` for dramatic comparisons, `cards` variant for polished look

### Scene Type Selection Priorities (Explainer/Tutorial)
When planning scenes, prefer the new polished scene types:
- **FeatureIntro over ConceptExplain** — when introducing/defining something for the first time
- **DecisionTable over BulletRevealScene** — when content is question/answer or criteria pairs
- **ThreeColumnCompare over ComparisonSplit** — when comparing 3 things
- **ArchitectureDiagram over DiagramFlow** — for hub-spoke/radial relationships
- **KeyRuleCard over KeyTakeaway** — for gradient-emphasis key insights
- **FileTreeScene** — whenever showing project structure or file organization
- **ProgressiveTerminal** — when listing capabilities that build on each other
- **StepSequence variant="card"** — for polished step-by-step with card styling
- **DiagramFlow variant="pipeline"** — for linear horizontal pipelines
- **KeyTakeaway variant="insight"** — for gradient text takeaways

### Branding
- Always add `<Watermark position="top-right">` in index.tsx
- Use `EndScreen` instead of basic `Outro` for all video types

## Step 5.5: Engagement Planning

For explainer/tutorial/news videos, plan engagement hooks alongside the scene manifest:

### Humor Beats
- Plan 1 humor beat per section (assign to a specific scene — usually VisualMetaphor or WarningCallout)
- Humor types: absurd analogies, self-deprecating dev jokes, exaggerated consequences
- Opening HookQuestion should be surprising or slightly funny

### Pattern Interrupts
- Plan 1 pattern interrupt per 30 seconds (scene type change, unexpected stat, humor beat)
- No two consecutive sections should open with the same scene type after SectionTitle

### Open Loops
- In TitleIntro objectives, tease later content: "You'll be surprised by #3"
- In early sections, reference upcoming reveals: "We'll see why this matters in Section 3"

### Entrance Variety
- Assign entrance props per section — no two consecutive sections with the same entrance style
- Rotate through: fadeUp, slideLeft, scaleBlur for SectionTitle
- Rotate through: pop, rotate, bounce for VisualMetaphor iconEffect

## Step 6: Output Format

Animation selection is handled in Phase 2/3. The brief only needs to note the pacing strategy (fast/medium/slow) — the code generator picks specific springs and timings.

### News Brief Format

Present the brief in this exact format:

```markdown
## Production Brief

**Video Type**: [type]
**Duration**: [total seconds]s ([total frames] frames)
**FPS**: [fps]
**Resolution**: [width]x[height]
**Aspect Ratio**: [ratio]

### Visual System

**Typography**:
- Heading: [font] / [weight] / [size]px
- Body: [font] / [weight] / [size]px
- Accent: [font] / [weight] / [size]px

**Color Palette**:
- Primary: [hex]
- Secondary: [hex]
- Accent: [hex]
- Background: [hex]
- Text: [hex]

**Background**: [description]
**Transitions**: [type] ([duration] frames)

### Scenes

[Scene breakdown as specified above]

### Pacing
[Pacing strategy description]
```

### Explainer / Tutorial Brief Format (Extended)

```markdown
## Production Brief

**Video Type**: explainer
**Content Source**: [Content plan match or "Original topic"]
**Duration**: [total seconds]s ([total frames] frames)
**FPS**: 30
**Resolution**: 1920x1080

### Learning Objectives
1. [Outcome 1]
2. [Outcome 2]
3. [Outcome 3]

### Audience
[From audience-profile.md — vibe coders / non-technical AI builders]

### Sections Overview
1. **[Section Title]** (~Xs) — [What this section covers]
2. **[Section Title]** (~Xs) — [What this section covers]
3. **[Section Title]** (~Xs) — [What this section covers]
...

### Engagement Plan
- Hook style: [curiosity gap / surprising stat / absurd question]
- Humor beats: [1 per section, placed in VisualMetaphor or WarningCallout]
- Pattern interrupts: [scene types that break rhythm]
- Open loops: [teasers for later sections]

### Visual System

**Typography**:
- Heading: Inter / 800 / varies by scene type
- Body: Inter / 400 / varies by scene type
- Code: JetBrains Mono / 400 / 22px

**Color Palette**: medevsmaker-educational
- Primary: #6366f1 (indigo)
- Secondary: #8b5cf6 (violet)
- Accent: #06b6d4 (cyan)
- Background: #0f0f1a
- Text: #f8fafc
- Warning: #f59e0b (amber)
- Success: #10b981 (green)
- Danger: #ef4444 (red)

**Background**: Subtle gradient (bg → bgLight)
**Transitions**: fade, 15 frames

### Pacing
Medium — alternate dense concept scenes with lighter visual metaphors and stats.
```

## Quality Checklist

Before finalizing the script output, verify:

- [ ] Total scene durations + transitions = total video duration
- [ ] No scene has more than 3 simultaneously animating elements
- [ ] All text is concise (headings ≤ 6 words, body ≤ 15 words/line)
- [ ] Color palette has sufficient contrast (text on background)
- [ ] Font choices are available in Google Fonts
- [ ] Scene flow tells a coherent story
- [ ] CTA is included via EndScreen
- [ ] Pacing feels natural — no abrupt jumps or dragging sections
- [ ] (Explainer/Tutorial) Every concept has an analogy
- [ ] (Explainer/Tutorial) Sections start with SectionTitle, end with KeyTakeaway
- [ ] (Explainer/Tutorial) No 3+ consecutive same scene type
- [ ] (Explainer/Tutorial) Dense/light alternation is maintained
- [ ] (Explainer/Tutorial) Visual-heavy ratio: 60%+ content scenes are visual (diagram, metaphor, comparison, chart, timeline)
- [ ] (Explainer/Tutorial) No 2+ consecutive text-heavy scenes
- [ ] (Explainer/Tutorial) At least 1 humor beat per section
- [ ] (Explainer/Tutorial) Hook creates curiosity gap in under 3 seconds
- [ ] (Explainer/Tutorial) Pattern interrupt every 25-35 seconds
- [ ] (Explainer/Tutorial) EndScreen used instead of basic Outro
- [ ] HookQuestion uses scale, blur, or fadeUp entrance (not typewriter)
- [ ] TimelineScene horizontal has ≤5 nodes with short labels (≤2 words)
- [ ] Two-panel scenes (BeforeAfter, ComparisonSplit) have balanced item counts per side (±1)
- [ ] (Explainer/Tutorial) Per-section color theming applied — each section has a distinct sectionColor
- [ ] (Explainer/Tutorial) FeatureIntro used for first-time definitions (not ConceptExplain)
- [ ] (Explainer/Tutorial) Content in left 60-65% of frame with breathing room on right (for FeatureIntro, KeyRuleCard)
- [ ] Every scene has narration that complements (not duplicates) on-screen text
- [ ] `narratorTone` varies across scenes (not all "neutral")
- [ ] Section `humorScene` is assigned (1 per section)
- [ ] Narration uses contractions, no em-dashes, numbers spelled out
- [ ] No 3+ same-length sentences in a row (rhythm variety)
