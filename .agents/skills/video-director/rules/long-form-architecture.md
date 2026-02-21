---
name: long-form-architecture
description: Technical architecture for 20-60 scene educational videos using the section pattern
metadata:
  tags: architecture, long-form, sections, educational
---

# Long-Form Video Architecture

Educational videos use a **section-based architecture** instead of a single flat TransitionSeries. This keeps files manageable and renders performant.

## File Structure

```
src/<VideoName>/
  index.tsx              # Main composition — chains sections via <Series>
  styles.ts              # Video-specific overrides (colors, fonts)
  sections/
    Section1.tsx          # Each section: SectionTitle + 3-10 content scenes
    Section2.tsx
    Section3.tsx
    ...
  scenes/                 # Optional: video-specific custom scenes (rare)
    CustomDiagram.tsx
```

## Section Pattern

### index.tsx — Main Composition

Uses `<Series>` to chain sections sequentially. Each section is a self-contained `<TransitionSeries>`.

```tsx
import { AbsoluteFill, Series } from "remotion";
import { Background } from "../shared/components/Background";
import { ProgressBar } from "../shared/components/ProgressBar";
import { Watermark } from "../shared/components/Watermark";
import { Section1 } from "./sections/Section1";
import { Section2 } from "./sections/Section2";
// ...

const TOTAL_SECTIONS = 4;

export const VideoName: React.FC = () => {
  return (
    <AbsoluteFill>
      <Background colors={["#0f0f1a", "#1a1a2e"]} overlay="particles" particles={{ count: 25, speed: 0.3, opacity: 0.1 }} />
      <Series>
        <Series.Sequence durationInFrames={SECTION_1_FRAMES}>
          <Section1 />
          <ProgressBar totalSections={TOTAL_SECTIONS} currentSection={1} />
        </Series.Sequence>
        <Series.Sequence durationInFrames={SECTION_2_FRAMES}>
          <Section2 />
          <ProgressBar totalSections={TOTAL_SECTIONS} currentSection={2} />
        </Series.Sequence>
        {/* ... more sections */}
      </Series>
      <Watermark position="top-right" delay={30} />
    </AbsoluteFill>
  );
};
```

### Section files — TransitionSeries per section

Each section uses `<TransitionSeries>` internally for its scenes:

```tsx
import { TransitionSeries, linearTiming } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { slide } from "@remotion/transitions/slide";
import { SectionTitle } from "../../shared/scenes/SectionTitle";
import { ConceptExplain } from "../../shared/scenes/ConceptExplain";
import { KeyTakeaway } from "../../shared/scenes/KeyTakeaway";

const T = 15; // default fade transition frames

export const Section1: React.FC = () => {
  return (
    <TransitionSeries>
      <TransitionSeries.Sequence durationInFrames={3 * 30}>
        <SectionTitle sectionNumber={1} title="The Client" entrance="slideLeft" />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition
        presentation={slide({ direction: "from-right" })}
        timing={linearTiming({ durationInFrames: 20 })}
      />
      <TransitionSeries.Sequence durationInFrames={7 * 30}>
        <ConceptExplain heading="Your Browser" body="..." analogy="..." headingEntrance="fadeLeft" />
      </TransitionSeries.Sequence>
      {/* ... more scenes — mix fade, slide, wipe transitions */}
      <TransitionSeries.Transition
        presentation={fade()}
        timing={linearTiming({ durationInFrames: T })}
      />
      <TransitionSeries.Sequence durationInFrames={5 * 30}>
        <KeyTakeaway takeaway="..." />
      </TransitionSeries.Sequence>
    </TransitionSeries>
  );
};
```

## Duration Calculation

### Per-section formula
```
sectionFrames = sum(scene durations in frames) - sum(each transition's durationInFrames)
```

**Note**: When using mixed transitions (fade=15, slide=20, wipe=18), sum each transition's actual duration — don't assume all transitions are the same length.

### Total video formula
```
totalFrames = sum(all sectionFrames)
```

Note: `<Series>` does NOT have transitions between sections — sections play back-to-back. The last scene of section N directly precedes the first scene of section N+1. This is intentional: SectionTitle scenes act as natural visual breaks.

### Duration targets

| Video Length | Sections | Scenes per Section | Total Scenes | Frames (30fps) |
|---|---|---|---|---|
| 3 min (180s) | 3-4 | 4-6 | 15-25 | 5,400 |
| 5 min (300s) | 4-5 | 5-7 | 25-35 | 9,000 |
| 7 min (420s) | 5-6 | 5-8 | 30-45 | 12,600 |
| 10 min (600s) | 6-7 | 6-8 | 40-60 | 18,000 |

## Batched Code Generation Order

Generate files in this order to resolve dependencies:

1. **styles.ts** — Colors, fonts, tokens
2. **sections/Section1.tsx** through **sections/SectionN.tsx** — All sections
3. **index.tsx** — Main composition that imports all sections
4. **Root.tsx update** — Register the new Composition

### Why this order?
- Sections import from `shared/` (already exists) and `./styles.ts` (written first)
- `index.tsx` imports sections (must be written already)
- `Root.tsx` imports the main component from `index.tsx`

## Video Structure Template

Every educational video follows this structure:

```
[Hook Scene] ─── 4-5s
[Title Intro] ─── 6-8s
─── Section 1 ───
  [SectionTitle] ─── 3-4s
  [Content scenes x 3-8] ─── 5-12s each
  [KeyTakeaway] ─── 4-6s
─── Section 2 ───
  [SectionTitle] ─── 3-4s
  [Content scenes x 3-8] ─── 5-12s each
  [KeyTakeaway] ─── 4-6s
─── ... (3-7 sections total) ───
[SummaryRecap] ─── 8-12s
[Outro] ─── 4-6s
```

The Hook and TitleIntro go in Section 1 (before the SectionTitle). The SummaryRecap and Outro go in the last section (after the KeyTakeaway).

## ProgressBar Integration

The `<ProgressBar>` component renders at the bottom of the screen, showing section progress. It's placed in the `index.tsx` as an overlay on each `<Series.Sequence>`:

```tsx
<Series.Sequence durationInFrames={SECTION_N_FRAMES}>
  <SectionN />
  <ProgressBar totalSections={TOTAL} currentSection={N} />
</Series.Sequence>
```

This gives viewers a sense of progress through the video — especially important for 5-10 minute content.

## Visual Balance

Educational videos target a **60/40 visual-to-text ratio** for content scenes:

- **60%+ visual-heavy**: DiagramFlow, VisualMetaphor, ComparisonSplit, BeforeAfter, TimelineScene, DataChart, StepSequence, StatHighlight, ColdOpen
- **40% max text-heavy**: ConceptExplain, BulletRevealScene, CodeDisplay, WarningCallout
- **Structural scenes** (HookQuestion, TitleIntro, SectionTitle, KeyTakeaway, SummaryRecap, EndScreen) don't count toward this ratio

### Humor Placement
Each section should have 1 humor beat — typically in a VisualMetaphor (absurd analogy) or WarningCallout (exaggerated consequence). Place it after a dense concept scene to act as a pattern interrupt and retention hook.

## Performance Notes

- Each section re-mounts its own component tree — this keeps React's reconciliation fast
- Shared scene components are stateless and purely frame-driven — no state or effects
- The `<Series>` component only mounts the current section, so 60-scene videos don't render all scenes at once
- Font loading happens once via `@remotion/google-fonts` (module-level side effect)
