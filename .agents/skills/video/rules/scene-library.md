---
name: scene-library
description: Curated catalog of 30 extended scenes for video enhancement
metadata:
  tags: scenes, animation, catalog, visual-effects, backgrounds, transitions, particles, text
---

# Extended Scene Library (30 Curated Scenes)

This catalog covers the 30 curated extended animation scenes available for video enhancement. These are **visual enhancement scenes** designed for backgrounds, transitions, text effects, cinematic opens, and atmospheric overlays.

All scenes live in `src/shared/scenes/extended/` as a flat directory (no category subdirs).

> **Primary educational scene catalog** (for teaching content): See `educational-scenes.md`

## Universal Prop Interface

All extended scenes accept `startDelay?: number` (frames to delay animation start, default 0) plus content-specific props. Each scene uses the BRAND palette from `styles.ts`.

### Duration Guide

Most scenes run best at 60-120 frames (2-4 seconds at 30fps). Use `startDelay` to sync with narration timing.

---

## Background Scenes (3)

| Scene | Props | Description | Best Use Case |
|-------|-------|-------------|---------------|
| BackgroundBokeh | `colors?: string[]` | Floating bokeh light orbs with depth blur | Creative/design topics, soft aesthetic |
| BackgroundGeometric | `text?: string` | Animated geometric shapes on dark bg | Tech/engineering, architecture topics |
| BackgroundWaves | `text?: string`, `colors?: string[]` | Flowing sine-wave lines animation | Gentle/fluid content, sound/wave topics |

---

## Cinematic Scenes (2)

| Scene | Props | Description | Best Use Case |
|-------|-------|-------------|---------------|
| CinematicDocumentary | `title?`, `subtitle?`, `location?` | Ken Burns effect, sober documentary tone | Historical/serious content, journalism |
| CinematicSciFi | `title?`, `status?` | Sci-fi HUD/hologram style | AI/future tech, sci-fi vibe |

---

## Data Scenes (2)

| Scene | Props | Description | Best Use Case |
|-------|-------|-------------|---------------|
| DataGauge | `value?`, `label?`, `maxValue?` | Radial gauge meter animation | Single-metric emphasis, measurement |
| DataRanking | `items?: {name, score}[]`, `title?` | Animated ranking list | Leaderboard/rankings, top-N lists |

---

## Demo Scenes (4)

| Scene | Props | Description | Best Use Case |
|-------|-------|-------------|---------------|
| DemoAddressBar | `url?`, `title?` | Browser address bar typing | URL/HTTP topics, web navigation |
| DemoScroll | `title?` | Scroll behavior animation | Scroll UX tutorials, scroll events |
| DemoTextInput | `placeholder?`, `typedText?`, `label?` | Form text input with cursor | Form UX tutorials, input behavior |
| DemoZoomFocus | `title?` | Zoom focus on element | Detail emphasis, magnification |

---

## Effect Scenes (2)

| Scene | Props | Description | Best Use Case |
|-------|-------|-------------|---------------|
| EffectChromaticAberration | `text?` | RGB channel separation glitch | Glitch/error topics, digital artifacts |
| EffectMatrix | `text?` | Green code rain Matrix effect | Hacking/code topics, digital rain |

---

## Layout Scenes (2)

| Scene | Props | Description | Best Use Case |
|-------|-------|-------------|---------------|
| LayoutFrameInFrame | `title?`, `subtitle?` | Nested frame composition | Meta/recursion topics, nesting |
| LayoutGiantNumber | `number?`, `label?`, `description?` | Oversized number as design element | Stat/milestone moments, emphasis |

---

## Liquid Scene (1)

| Scene | Props | Description | Best Use Case |
|-------|-------|-------------|---------------|
| LiquidFluidWave | `text?`, `colors?: string[]` | Fluid wave distortion effect | Physics/wave topics, wave simulation |

---

## List Scene (1)

| Scene | Props | Description | Best Use Case |
|-------|-------|-------------|---------------|
| ListFullscreenSequence | `items?: string[]`, `title?` | Full-screen sequential item reveals | Step-by-step reveals, focused content |

---

## Logo Scenes (2)

| Scene | Props | Description | Best Use Case |
|-------|-------|-------------|---------------|
| LogoMaskReveal | `text?`, `subtitle?` | Masked wipe logo reveal | Clean brand reveals, professional |
| LogoStroke | `text?`, `subtitle?` | SVG stroke-draw reveal | Technical/clean brand, precision |

---

## Particle Scene (1)

| Scene | Props | Description | Best Use Case |
|-------|-------|-------------|---------------|
| ParticleLightning | `text?` | Electric lightning bolts | Power/energy topics, electricity |

---

## Roller Scene (1)

| Scene | Props | Description | Best Use Case |
|-------|-------|-------------|---------------|
| RollerCountdown | `targetNumber?`, `label?` | Large number countdown (3-phase state machine) | Timer/deadline content, countdown moments |

---

## Shape Scenes (2)

| Scene | Props | Description | Best Use Case |
|-------|-------|-------------|---------------|
| ShapeHelix | `text?`, `color?` | DNA-style double helix rotation | Biology/structure topics, DNA |
| ShapeHexGrid | `text?`, `highlightColor?` | Animated hexagonal grid | Data/network topics, hex grids |

---

## Text Scenes (2)

| Scene | Props | Description | Best Use Case |
|-------|-------|-------------|---------------|
| TextGlitch | `text?` | RGB channel glitch effect on text | Tech/hacker topics, error themes |
| TextKinetic | `words?: string[]` | Kinetic word-by-word staggered animation | Narration highlights, impactful statements |

---

## Theme Scenes (3)

| Scene | Props | Description | Best Use Case |
|-------|-------|-------------|---------------|
| ThemeCyberpunk | `title?`, `subtitle?` | Neon grid cyberpunk aesthetic | Tech/future topics, cyberpunk fiction |
| ThemeHolographic | `text?` | Holographic foil shimmer effect | Premium/tech reveals, futuristic feel |
| ThemeRetro | `text?`, `subtitle?` | 70s-80s CRT retro visual style | Tech history, retro nostalgia |

---

## Transition Scene (1)

| Scene | Props | Description | Best Use Case |
|-------|-------|-------------|---------------|
| TransitionFlash | `text?` | White flash burst transition | Impact/reveal, flash cut |

---

## UI Scene (1)

| Scene | Props | Description | Best Use Case |
|-------|-------|-------------|---------------|
| UILoading | `text?` | Loading spinner/skeleton/dots variants | Loading state tutorials, spinners |

---

## Import Format & Usage

All scenes are located at: `src/shared/scenes/extended/SceneName.tsx`

**Import example from a video section file**:
```tsx
import { TextGlitch } from "../../../shared/scenes/extended/TextGlitch";
import { BackgroundBokeh } from "../../../shared/scenes/extended/BackgroundBokeh";
import { DataGauge } from "../../../shared/scenes/extended/DataGauge";
```

**Usage in component**:
```tsx
<TransitionSeries.Sequence durationInFrames={90}>
  <TextGlitch text="HACK THE PLANET" startDelay={0} />
</TransitionSeries.Sequence>
```

---

## New Shared Components (available for use in any scene)

These components were extracted from the extended scene library and are available for building custom scenes:

| Component | Props | Description |
|-----------|-------|-------------|
| NeonText | `text`, `color?`, `fontSize?`, `delay?`, `letterByLetter?`, `flickerIntensity?` | 4-layer glow text with flicker |
| DramaticCounter | `target`, `label`, `mode?: 'spring'\|'slot'\|'splitFlap'\|'countdown'` | Slot machine / split-flap counter |
| CinematicOverlay | `effect: 'filmGrain'\|'scanlines'\|'vignette'\|'vhs'\|'letterbox'`, `intensity?` | Post-processing overlays |
| BlobShape | `seed`, `color`, `animated?`, `glow?`, `radius?` | SVG organic blob shape |
| PerspectiveGrid | `color?`, `speed?`, `showHorizon?`, `showSun?` | Retro infinite grid background |
| Cursor | `x`, `y`, `clicking?` | Animated mouse cursor |
| Highlight | `x`, `y`, `width`, `height`, `progress`, `label?` | Highlight box overlay |

---

## Quick Reference by Video Type

### Explainer/Tutorial Videos
**Opening hooks**: CinematicSciFi, ThemeCyberpunk, LogoMaskReveal
**Section transitions**: TransitionFlash, RollerCountdown
**Data visualization**: DataGauge, DataRanking, LayoutGiantNumber
**Demo sections**: DemoAddressBar, DemoTextInput, DemoScroll, DemoZoomFocus
**Backgrounds**: BackgroundBokeh, BackgroundWaves, BackgroundGeometric

### Short-Form Hooks (TikTok/Reels)
**Scroll-stopping visuals**: TextGlitch, ThemeHolographic, EffectChromaticAberration
**Background atmosphere**: BackgroundBokeh, LiquidFluidWave
**Emphasis moments**: TransitionFlash, TextKinetic, LayoutGiantNumber

### News/Announcement Videos
**Impact openers**: ThemeCyberpunk, ParticleLightning, TransitionFlash
**Data presentation**: DataGauge, DataRanking, LayoutGiantNumber
**Backgrounds**: BackgroundGeometric, ShapeHexGrid

---

## Scene Count Summary

- **Extended scenes**: 30
- **Shared components**: 33 (27 original + 6 new)
- **Educational scenes**: 35 (see `educational-scenes.md`)
- **Total available scenes**: **65**
