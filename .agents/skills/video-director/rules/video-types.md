---
name: video-types
description: Unified video type reference — defaults, scene structures, creative rules, and color palettes
metadata:
  tags: video-type, defaults, templates, scenes
---

# Video Types

Each section below is a complete reference for one video type: when to use it, technical defaults, default scene structure, creative rules, and palette.

---

## Educational

### When to Use
Long-form conceptual teaching content: "How X Works", "Understanding Y", "Fundamentals of Z". Designed for the medevsmaker YouTube channel targeting vibe coders and non-technical AI builders. All visual, no voice — ready for voiceover.

### Defaults

| Setting | Value |
|---------|-------|
| Duration | 300s / 5 min (9000 frames) |
| Duration Range | 180-600s (3-10 min) |
| FPS | 30 |
| Resolution | 1920x1080 |
| Background | Subtle gradient (bg → bgLight) with particle overlay |
| Transitions | Mixed: fade(15), slide(20), wipe(18) — vary per section |
| Pacing | medium |
| CTA | no (outro has subscribe CTA) |
| Typography | Heading: Inter / 800, Body: Inter / 400, Code: JetBrains Mono / 400 |

### Scene Structure

```
Hook (4-5s)
  → Provocative question or surprising stat
  → HookQuestion scene type

Title Intro (6-8s)
  → Video title + learning objectives
  → TitleIntro scene type

─── Section 1: [Topic] ───
  SectionTitle (3-4s) → "01 — [Title]"
  Content scenes (3-8 scenes, 5-12s each)
    → Use: ConceptExplain, DiagramFlow, CodeDisplay,
      ComparisonSplit, StatHighlight, BulletRevealScene,
      VisualMetaphor, WarningCallout, StepSequence
  KeyTakeaway (4-6s) → Section summary

─── Section 2-N: [Topics] ───
  (Same pattern, 3-7 sections total)

Summary Recap (8-12s)
  → Numbered list of all sections covered
  → SummaryRecap scene type

Outro (4-6s)
  → Channel branding + subscribe CTA
  → Outro scene type
```

### Key Rules
- **One concept per scene** — never stack two ideas
- **Every concept needs an analogy** — connect to something they know
- **Alternate scene types** — no 3+ consecutive same type
- **Dense/light alternation** — heavy concept → visual metaphor → next concept
- **Section markers** — every section starts with SectionTitle, ends with KeyTakeaway
- **Max 60 scenes, max 7 sections** per video
- **Use shared scene components** — import from `src/shared/scenes/`
- **Section-based architecture** — `<Series>` for sections, `<TransitionSeries>` within
- **ProgressBar** on every section showing video progress

### Audience
See [audience-profile.md](audience-profile.md) for full audience definition and tone rules.

### Visual Polish
- Use `<Watermark>` in index.tsx for persistent branding
- Use `<Background overlay="particles">` for visual depth
- Use `EndScreen` instead of `Outro` for polished end cards with gradient text and glow CTA
- Vary entrance props across scenes: typewriter hooks, scaleRotate titles, slideLeft section titles
- Use `glow` and `gradient` props on DiagramBox, AccentBox, StatCounter for emphasis
- Mix transition types across sections (don't use only fade)
- New scenes available: ColdOpen, BeforeAfter, TimelineScene, DataChart

### Scene Catalog
See [educational-scenes.md](educational-scenes.md) for all 20 reusable scene types with props, durations, and usage rules.

### Architecture
See [long-form-architecture.md](long-form-architecture.md) for the section-based file structure and code patterns.

### Palette: medevsmaker-educational
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

## Promo

### When to Use
Product launches, feature announcements, marketing campaigns, app promos.

### Defaults

| Setting | Value |
|---------|-------|
| Duration | 20s (600 frames) |
| FPS | 30 |
| Resolution | 1920x1080 |
| Background | Diagonal gradient (primary → secondary) |
| Transitions | fade, 15 frames |
| Pacing | medium |
| CTA | yes |
| Typography | Heading: Plus Jakarta Sans / 800 / 72px, Body: Plus Jakarta Sans / 400 / 32px |

### Scene Structure

```
Scene 1: Hook (3-4s)
  → Bold headline that grabs attention
  → Optional animated logo/icon entrance
  → Spring scale-in + fade

Scene 2: Problem (3-4s)
  → Pain point statement
  → Empathize with the viewer
  → Fade-slide-up entrance

Scene 3: Solution (4-5s)
  → Product/feature name with visual
  → Show what it does in one sentence
  → Scale-in with glow effect

Scene 4: Key Benefits (4-5s)
  → 2-3 bullet points
  → Staggered slide-in from left
  → Accent dots as bullet markers

Scene 5: CTA (3-4s)
  → Call-to-action headline
  → Button with pop-in animation
  → URL or instruction below
```

### Key Rules
- Hook must be compelling in first 2 seconds
- Maximum 6 words per headline
- Benefits should be scannable (short phrases)
- CTA must be clear and actionable
- End on a strong visual — don't fade to black

### Palette: modern-saas
```
primary:    #6366f1 (indigo)
secondary:  #8b5cf6 (violet)
accent:     #06b6d4 (cyan)
background: #0f0f1a
text:       #f8fafc
```

---

## Tutorial

### When to Use
Step-by-step guides, how-to content, walkthroughs, onboarding videos.

### Defaults

| Setting | Value |
|---------|-------|
| Duration | 90s (2700 frames) |
| FPS | 30 |
| Resolution | 1920x1080 |
| Background | Solid dark with subtle grid overlay |
| Transitions | slide-right, 20 frames |
| Pacing | slow |
| Section markers | yes |
| Typography | Heading: Inter / 700 / 64px, Body: Inter / 400 / 28px, Code: JetBrains Mono / 400 / 24px |

### Scene Structure

```
Scene 1: Intro (4-5s)
  → Video title
  → "What you'll learn" subtitle
  → Fade-slide-up entrance

Scene 2-N: Steps (8-12s each)
  → Step number badge (pop-in)
  → Step title (slide from left)
  → Description text
  → Code block / visual with typewriter effect
  → Pause for readability

Scene N+1: Recap (5-6s)
  → "Recap" heading
  → Numbered list of all steps
  → Staggered entrance

Scene N+2: Outro (4-5s)
  → "Next steps" or CTA
  → Subscribe / follow prompt
```

### Key Rules
- Number every step clearly
- Code must use typewriter effect (character-by-character reveal)
- Keep code snippets short (max 3-4 lines)
- One concept per step — don't overload
- Recap scene must list all steps
- Section markers help navigation

### Palette: clean-technical
```
primary:    #3b82f6 (blue)
secondary:  #1e293b (slate)
accent:     #22d3ee (cyan)
background: #0a0a0f
text:       #e2e8f0
```

---

## Explainer

### When to Use
Concept explanations, "how it works" content, product overviews, educational videos.

### Defaults

| Setting | Value |
|---------|-------|
| Duration | 45s (1350 frames) |
| FPS | 30 |
| Resolution | 1920x1080 |
| Background | Animated gradient (slow hue shift) |
| Transitions | fade, 15 frames |
| Pacing | medium |
| Typography | Heading: Manrope / 700 / 68px, Body: Manrope / 400 / 30px |

### Scene Structure

```
Scene 1: Hook (3-4s)
  → Provocative question or surprising stat
  → Large centered text
  → Spring entrance

Scene 2: Context (5-6s)
  → Set up the problem or concept
  → Brief background
  → Slide-up entrance

Scene 3: Explanation (12-18s, split into 2-3 sub-scenes)
  → Core content broken into digestible pieces
  → Each sub-scene: one concept with visual
  → Use icons/diagrams where helpful
  → Staggered reveals for multi-part content

Scene 4: Key Takeaways (6-8s)
  → 2-4 bullet points summarizing the main ideas
  → Staggered entrance
  → Clean, scannable layout

Scene 5: CTA (3-4s)
  → "Learn more" / "Try it" / "Read the docs"
  → Button animation
```

### Key Rules
- Open with a question or surprising fact
- One concept per sub-scene
- Use visual hierarchy: bigger = more important
- Key takeaways should be independently valuable
- Avoid jargon unless the audience expects it
- End with a clear next step

### Palette: friendly-professional
```
primary:    #8b5cf6 (violet)
secondary:  #ec4899 (pink)
accent:     #fbbf24 (amber)
background: #1a1a2e
text:       #f1f5f9
```

---

## Social Clip

### When to Use
Instagram Reels, TikTok, YouTube Shorts, Twitter/X video clips.

### Defaults

| Setting | Value |
|---------|-------|
| Duration | 15s (450 frames) |
| FPS | 30 |
| Resolution | 1080x1920 (portrait 9:16) |
| Background | Bold solid or high-contrast gradient |
| Transitions | slide-up, 12 frames (fast) |
| Pacing | fast |
| CTA | yes |
| Typography | Heading: Bebas Neue / 400 / 96px, Body: DM Sans / 500 / 36px |

### Scene Structure

```
Scene 1: Hook (1.5-2s)
  → Bold statement or question
  → Large centered text
  → Fast scale-in entrance

Scene 2: Content (6-10s)
  → 2-3 rapid-fire points
  → Each point gets 2-3 seconds
  → Quick transitions between points

Scene 3: CTA (2-3s)
  → Follow / share / link in bio
  → Bold text with accent color

Scene 4: Outro (1-2s)
  → Logo or handle
  → Quick fade out
```

### Key Rules
- First 1.5 seconds must hook the viewer
- Text must be readable at phone size (large fonts!)
- No more than 10 words per screen
- Fast pacing — don't let attention drop
- Vertical layout: stack everything centered
- Safe area: account for phone notch and bottom bar (120px top/bottom padding)

### Palette: bold-vibrant
```
primary:    #ef4444 (red)
secondary:  #f97316 (orange)
accent:     #fbbf24 (yellow)
background: #0a0a0a
text:       #ffffff
```

---

## Announcement

### When to Use
Feature announcements, product releases, version updates, company news.

### Defaults

| Setting | Value |
|---------|-------|
| Duration | 20s (600 frames) |
| FPS | 30 |
| Resolution | 1920x1080 |
| Background | Gradient with radial glow |
| Transitions | fade, 15 frames |
| Pacing | medium |
| CTA | yes |
| Typography | Heading: Plus Jakarta Sans / 800 / 76px, Body: Plus Jakarta Sans / 400 / 32px |

### Scene Structure

```
Scene 1: Teaser (3s)
  → "Introducing..." or "New:"
  → Badge/label entrance

Scene 2: Reveal (5s)
  → Feature/product name with animation
  → Scale-in with emphasis

Scene 3: Details (6s)
  → Key highlights (2-3 points)
  → Staggered reveal

Scene 4: Availability (3s)
  → When/where/how
  → Clean centered layout

Scene 5: CTA (3s)
  → Try it now / sign up
  → Button animation
```

### Key Rules
- Build anticipation with the teaser
- Reveal should feel impactful (use scale or heavy spring)
- Keep details concise — save depth for landing pages
- Availability info must be specific

### Palette: premium-launch
```
primary:    #a78bfa (violet-light)
secondary:  #6366f1 (indigo)
accent:     #34d399 (emerald)
background: #0c0a1a
text:       #f8fafc
```

---

## Demo

### When to Use
Product walkthroughs, feature tours, UI showcases, preview videos.

### Defaults

| Setting | Value |
|---------|-------|
| Duration | 45s (1350 frames) |
| FPS | 30 |
| Resolution | 1920x1080 |
| Background | Clean solid dark |
| Transitions | slide-right, 20 frames |
| Pacing | medium |
| CTA | yes |
| Typography | Heading: Inter / 700 / 64px, Body: Inter / 400 / 28px |

### Scene Structure

```
Scene 1: Title (3s)
  → Product name + tagline

Scene 2: Overview (6s)
  → High-level what it does

Scene 3: Feature 1 (8s)
  → First key feature with visual

Scene 4: Feature 2 (8s)
  → Second key feature with visual

Scene 5: Feature 3 (8s)
  → Third key feature with visual

Scene 6: Summary (5s)
  → Recap + differentiator

Scene 7: CTA (4s)
  → Get started
```

### Key Rules
- Each feature should stand on its own
- Use consistent layout across feature scenes
- Summary should tie features together
- Don't show too many features — pick the top 3

### Palette: clean-product
```
primary:    #2563eb (blue)
secondary:  #7c3aed (violet)
accent:     #10b981 (emerald)
background: #09090b
text:       #fafafa
```
