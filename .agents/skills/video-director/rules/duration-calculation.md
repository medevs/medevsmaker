---
name: duration-calculation
description: Duration calculation from narration word counts and transition assignment rules
metadata:
  tags: duration, timing, wpm, transitions
---

# Duration Calculation

In the script-first pipeline, scene durations are **computed from narration word counts** — not assigned upfront. This document defines the formula and transition assignment rules.

## WPM Formula

```
wordCount = narration.split(/\s+/).filter(Boolean).length
baseDuration = (wordCount / 155) * 60      // 155 WPM conservative
paddedDuration = baseDuration + 0.5         // visual breathing room
rounded = Math.ceil(paddedDuration * 2) / 2 // round UP to nearest 0.5s
finalDuration = max(rounded, MIN_DURATIONS[sceneType])
```

### Why 155 WPM?

- Neural TTS (ElevenLabs, Cartesia) speaks at roughly 145-170 WPM depending on content
- 155 WPM is conservative — ensures audio finishes within scene with room to spare
- The 0.5s padding adds visual breathing room after narration ends
- Rounding up to 0.5s keeps frame math clean (multiples of 15 at 30fps)

### Minimum Scene Durations

Some scene types need minimum time regardless of narration length (for animations to complete):

| Scene Type | Min Duration | Reason |
|------------|-------------|--------|
| SectionTitle | 3s | Badge pop-in + title animation |
| HookQuestion | 4s | Scale entrance + subtext |
| EndScreen | 5s | Logo + CTA + social links animation |
| DiagramFlow | 8s | Node stagger + arrow draw |
| CodeDisplay | 8s | Typewriter reveal |
| TimelineScene | 8s | Node pop-ins + line draw |
| ArchitectureDiagram | 8s | Center + satellite stagger |
| AnimatedDiagram | 8s | Curved bezier draw-on + node stagger |
| ThreeColumnCompare | 8s | Three cards + items stagger |
| FileTreeScene | 8s | Tree items stagger + annotation |
| ProcessAnimation | 8s | Stage stagger + item animation |
| SplitCodeComparison | 8s | Two code panels + VS divider |
| MetricDashboard | 6s | Multiple counter animations |
| QuoteCard | 4s | Glass card entrance + quote |
| (default) | 3s | Minimum for any scene |

### Overlay Duration Rules

Light leak overlays (`OVERLAYS.lightLeak`, `OVERLAYS.lightLeakBlue`) do NOT subtract from total timeline duration. Only `<TransitionSeries.Transition>` presentations subtract. Overlays are layered on top and render alongside the scenes.

### Example Calculations

| Narration | Words | Base (s) | Padded | Rounded | Min | Final |
|-----------|-------|----------|--------|---------|-----|-------|
| "Next up, DNS." | 3 | 1.16 | 1.66 | 2.0 | 3 (SectionTitle) | **3s** |
| "You click a link fifty times a day, but do you actually know what happens behind the scenes?" | 18 | 6.97 | 7.47 | 7.5 | 4 (HookQuestion) | **7.5s** |
| "Think of your browser as a waiter..." (25 words) | 25 | 9.68 | 10.18 | 10.5 | 3 (VisualMetaphor) | **10.5s** |
| (empty narration) | 0 | 0 | 0 | 0 | 8 (DiagramFlow) | **8s** |

## Transition Assignment Rules

After computing scene durations, assign transitions between scenes within each section:

### Default Transition Types

| Context | Transition | Frames | Duration |
|---------|-----------|--------|----------|
| Default between scenes | fade | 15 | 0.5s |
| After SectionTitle | slide (from-right) | 20 | 0.67s |
| After diagram/stat scenes | wipe (right) | 18 | 0.6s |
| Major section changes | clockWipe | 25 | 0.83s |
| Light/elegant transitions | springFade | 15 | 0.5s |

### Rules

- **Last scene in section**: no transition (sections are chained via `<Series>`)
- **Vary transitions**: don't use the same type 3+ times in a row within a section
- **Import from** `src/shared/transitions.ts`: fade, slideLeft, slideRight, slideUp, wipeRight, clockWipe, springFade
- **Total section frames** = sum(scene duration frames) - sum(transition frames within section)

### Section Duration Formula

```
sectionFrames = sum(scene_duration_in_frames) - sum(transition_frames_within_section)
totalFrames = sum(all sectionFrames)
```

Where `scene_duration_in_frames = finalDuration * fps`.

## Implementation

The `calculateDurationFromNarration()` function in `scripts/tts/utils.ts` implements this formula:

```typescript
import { calculateDurationFromNarration, MIN_SCENE_DURATIONS } from "../../scripts/tts/utils";

const duration = calculateDurationFromNarration(narration, sceneType);
const durationInFrames = duration * fps;
```
