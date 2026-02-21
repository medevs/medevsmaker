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

### Type Detection Table

| Keywords | Detected Type |
|----------|--------------|
| promo, ad, marketing, launch, promote, advertise | `promo` |
| tutorial, how to, guide, walkthrough, step by step, learn | `tutorial` |
| explainer, explain, how it works, what is, introduction | `explainer` |
| reel, tiktok, shorts, clip, social, viral | `social-clip` |
| announcing, announcement, new feature, release, update | `announcement` |
| demo, showcase, preview, product tour, walkthrough | `demo` |

If no type is detected, default to `promo`.

## Step 2: Apply Defaults

After detecting the type, apply defaults from `video-types.md`.

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
- Layout: [center | left-right | top-bottom | stacked]
```

### Scene Count Guidelines

| Video Duration | Scene Count |
|---------------|-------------|
| 5-15s | 2-4 scenes |
| 15-30s | 3-6 scenes |
| 30-60s | 5-8 scenes |
| 60-120s | 8-12 scenes |

### Scene Pacing Rules

- **Opening scene**: 2-4 seconds — hook the viewer immediately
- **Content scenes**: 3-6 seconds each — enough to read and absorb
- **Transition scenes**: 0.5-1 second — keep momentum
- **Closing/CTA scene**: 3-5 seconds — give time to act
- Leave 0.5s breathing room between dense text scenes

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

### Color Palette Generation

Generate a 5-color palette:

1. **Primary**: The dominant brand/theme color
2. **Secondary**: Complementary or analogous to primary
3. **Accent**: High-contrast pop color for emphasis
4. **Background**: Dark (#0a0a0a to #1a1a2e) or light (#f8f9fa to #ffffff)
5. **Text**: High contrast against background (#ffffff on dark, #111827 on light)

Default to dark background unless the subject implies light (e.g., healthcare, children's content).

### Background Style Decision

| Video Type | Default Background |
|-----------|-------------------|
| Promo | Gradient (primary → secondary, diagonal) |
| Tutorial | Solid dark with subtle grid pattern |
| Explainer | Animated gradient (slow shift) |
| Social Clip | Bold solid or gradient |
| Announcement | Gradient with subtle radial glow |
| Demo | Clean solid with accent border |

## Step 5: Output Format

Animation selection is handled in Phase 2 (code generation). The brief only needs to note the pacing strategy (fast/medium/slow) — the code generator picks specific springs and timings.

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
