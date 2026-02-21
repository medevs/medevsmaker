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
| promo, ad, marketing, launch, promote, advertise | `promo` |
| tutorial, how to, guide, walkthrough, step by step, learn | `tutorial` |
| explainer, explain, how it works, what is, introduction | `explainer` |
| reel, tiktok, shorts, clip, social, viral | `social-clip` |
| announcing, announcement, new feature, release, update | `announcement` |
| demo, showcase, preview, product tour, walkthrough | `demo` |
| educational, teach, lesson, course, deep dive, understand, concepts, fundamentals | `educational` |

**Educational auto-detection**: If the topic is a conceptual subject (how something works, fundamentals of X, understanding Y) and no other type is explicitly mentioned, default to `educational` instead of `promo`.

If no type is detected, default to `promo` for product/service topics, `educational` for conceptual/learning topics.

### Content Plan Lookup

If a `youtube-content-plan.md` file exists in the project root, check if the user's topic matches any entry. If it does:
- Extract the content plan's bullet points and structure
- Use them as the basis for section planning
- Note the content plan match in the brief under "Content Source"

## Step 2: Apply Defaults

After detecting the type, apply defaults from `video-types.md`.

For educational type, also apply:
- Audience profile from `audience-profile.md`
- Scene types from `educational-scenes.md`
- Architecture from `long-form-architecture.md`

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
| 5-15s | 2-4 scenes | Short-form |
| 15-30s | 3-6 scenes | Short-form |
| 30-60s | 5-8 scenes | Short-form |
| 60-120s | 8-12 scenes | Short-form / Tutorial |
| 120-240s | 15-30 scenes | Educational |
| 240-420s | 25-45 scenes | Educational |
| 420-600s | 40-60 scenes | Educational |

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

For educational videos, use the medevsmaker-educational palette by default (see video-types.md).

### Background Style Decision

| Video Type | Default Background |
|-----------|-------------------|
| Promo | Gradient (primary → secondary, diagonal) |
| Tutorial | Solid dark with subtle grid pattern |
| Explainer | Animated gradient (slow hue shift) |
| Social Clip | Bold solid or gradient |
| Announcement | Gradient with subtle radial glow |
| Demo | Clean solid with accent border |
| Educational | Gradient (bg → bgLight, subtle) |

## Step 5: Output Format

Animation selection is handled in Phase 2/3. The brief only needs to note the pacing strategy (fast/medium/slow) — the code generator picks specific springs and timings.

### Short-Form Brief Format

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

### Educational Brief Format (Extended)

```markdown
## Production Brief

**Video Type**: educational
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

Before finalizing the brief, verify:

- [ ] Total scene durations + transitions = total video duration
- [ ] No scene has more than 3 simultaneously animating elements
- [ ] All text is concise (headings ≤ 6 words, body ≤ 15 words/line)
- [ ] Color palette has sufficient contrast (text on background)
- [ ] Font choices are available in Google Fonts
- [ ] Scene flow tells a coherent story
- [ ] CTA is included for promo/announcement types
- [ ] Pacing feels natural — no abrupt jumps or dragging sections
- [ ] (Educational) Every concept has an analogy
- [ ] (Educational) Sections start with SectionTitle, end with KeyTakeaway
- [ ] (Educational) No 3+ consecutive same scene type
- [ ] (Educational) Dense/light alternation is maintained
