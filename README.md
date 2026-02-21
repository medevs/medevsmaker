# medevsmaker — AI Video Director

One prompt, complete Remotion video. Educational content, promos, tutorials, and more.

## What This Does

Type `/video How the Web Actually Works` in Claude Code and get a complete, production-ready Remotion video project — scenes, animations, transitions, branding, and rendering instructions. No video editing knowledge required.

## Quick Start

```bash
# 1. Clone and install
git clone <repo-url> && cd medevsmaker
npm install

# 2. Generate a video (in Claude Code)
/video How the Web Actually Works

# 3. Preview in Remotion Studio
npx remotion studio

# 4. Render to MP4
npx remotion render src/index.ts HowTheWebWorks out/video.mp4
```

## How It Works

```
Your Idea → [Phase 1: Research & Expand] → Production Brief
         → [Phase 2: Scene Planning]     → Scene Manifest
         → [Phase 3: Code Generation]    → Remotion Code
```

1. **Research & Expand** — Detects video type, generates a production brief with sections, colors, typography, audience context, and engagement plan
2. **Scene Planning** — Maps every scene to one of 20 reusable templates with timing, content, and visual variety
3. **Code Generation** — Writes all Remotion files in dependency order: `styles.ts` → `sections/` → `index.tsx` → `Root.tsx`

## Video Types

| Type | Auto-detected keywords | Default Duration |
|------|----------------------|-----------------|
| Educational | conceptual topics, "how X works" | 3-10 min |
| Promo | "promo", "ad", "launch" | 15-30s |
| Tutorial | "tutorial", "how to", "guide" | 60-120s |
| Explainer | "explainer", "how it works" | 30-60s |
| Social Clip | "reel", "tiktok", "shorts" | 15-30s |
| Announcement | "announcing", "new feature" | 15-30s |
| Demo | "demo", "showcase", "preview" | 30-60s |

## What You Get

```
src/HowTheWebWorks/
  styles.ts              # Colors, fonts, timing tokens
  sections/
    Section1.tsx          # Introduction (HookQuestion + TitleIntro + content)
    Section2.tsx          # Core concept sections
    Section3.tsx
    ...
  index.tsx               # Main composition — chains sections
src/Root.tsx              # Updated with new Composition entry
```

## Shared Library

### Components (`src/shared/components/`) — 13 total

| Component | Description |
|-----------|-------------|
| AnimatedText | Text with fade-up spring animation |
| Background | Gradient background with particle/grid overlay |
| CodeBlock | Typewriter code reveal with line numbers |
| DiagramBox | Labeled box that scales in for flow diagrams |
| DiagramArrow | SVG arrow that draws itself between points |
| StatCounter | Number counter from 0 to target with spring |
| BulletReveal | Bullet points that stagger in from left |
| SectionBadge | Numbered badge (01, 02...) with pop-in |
| AccentBox | Colored card with left border (info/warning/success/danger) |
| ProgressBar | Section progress dots at screen bottom |
| Watermark | Persistent branding overlay (default: top-right) |
| ParticleField | Deterministic floating particle system |
| GridPattern | Subtle background grid |

### Scene Templates (`src/shared/scenes/`) — 20 total

| Scene | Duration | Used For |
|-------|----------|----------|
| HookQuestion | 4-5s | Opening question (always first) |
| TitleIntro | 6-8s | Title + objectives (always second) |
| SectionTitle | 3-4s | Chapter markers |
| ConceptExplain | 6-8s | Core teaching content |
| DiagramFlow | 8-12s | Processes, flows, architectures |
| CodeDisplay | 8-15s | Technical code content |
| ComparisonSplit | 6-10s | A vs B comparisons |
| StatHighlight | 4-6s | Key statistics |
| BulletRevealScene | 5-10s | Lists of items |
| VisualMetaphor | 5-8s | Analogies for abstract concepts |
| KeyTakeaway | 4-6s | Section summaries |
| SummaryRecap | 8-12s | Video recap |
| Outro | 4-6s | Channel branding + CTA |
| EndScreen | 4-6s | Polished end card with gradient text + glow CTA |
| WarningCallout | 5-7s | Mistakes, pitfalls |
| StepSequence | 8-12s | Numbered step-by-step processes |
| ColdOpen | 4-6s | Dramatic opening statements |
| BeforeAfter | 8-12s | Before/after comparisons with wipe |
| TimelineScene | 8-12s | Historical progressions, evolution |
| DataChart | 8-12s | Animated bar charts, statistics |

## Design System

### Color Palette (medevsmaker-educational)

| Color | Hex | Usage |
|-------|-----|-------|
| Indigo | `#6366f1` | Primary, section badges |
| Violet | `#8b5cf6` | Secondary, concept accents |
| Cyan | `#06b6d4` | Accent, bullet markers |
| Amber | `#f59e0b` | Warnings, highlights |
| Green | `#10b981` | Success, good examples |
| Red | `#ef4444` | Danger, bad examples |
| Background | `#0f0f1a` | Dark navy |
| Text | `#f8fafc` | Near white |

### Spring Configs

| Config | Settings | Use |
|--------|----------|-----|
| Smooth | `damping: 200` | Text, fade-ups, gentle entrances |
| Snappy | `damping: 20, stiffness: 200` | Badges, buttons, pop-ins |
| Bouncy | `damping: 8` | Dramatic entrances |
| Heavy | `damping: 15, stiffness: 80, mass: 2` | Impactful reveals |

### Transition Presets

| Transition | Frames | Use |
|------------|--------|-----|
| fade | 15 | Default, most transitions |
| slide | 20 | After section titles, conceptual shifts |
| wipe | 18 | After diagram/stat scenes |
| clockWipe | 25 | Major section changes (sparingly) |
| springFade | 15 | Smooth spring-based fade |

## For Contributors

### How skills work
Skills live in `.agents/skills/` with symlinks in `.claude/skills/`. Managed by `npx skills`:

```bash
npx skills list                    # Show installed skills
npx skills add <github-url>        # Install from GitHub
npx skills init <path>             # Create a new skill
```

### Adding a new scene template
1. Create `src/shared/scenes/YourScene.tsx` following the existing pattern
2. Add props type, use `useCurrentFrame()` + `spring()` for all animations
3. Document in `.agents/skills/video-director/rules/educational-scenes.md`
4. Classify as visual-heavy or text-heavy in the Scene Visual Classification table

### Key rule files
| File | What it controls |
|------|-----------------|
| `SKILL.md` | 3-phase workflow, constraints, code patterns |
| `rules/prompt-expansion.md` | Phase 1 — brief generation, engagement planning |
| `rules/video-types.md` | 7 video types — defaults, palettes |
| `rules/audience-profile.md` | Audience, tone, humor, engagement psychology |
| `rules/educational-scenes.md` | 20 scene types — props, usage, visual classification |
| `rules/long-form-architecture.md` | Section pattern, duration math |

## Commands

```bash
# Generate a video (Claude Code)
/video <your idea>

# Preview
npx remotion studio

# Render
npx remotion render src/index.ts <CompositionId> out/video.mp4
```
