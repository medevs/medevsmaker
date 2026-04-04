---
name: short-form
description: Rules for short-form vertical video (YouTube Shorts, TikTok, Reels) — scene catalog, pacing, structure, and platform constraints
metadata:
  tags: short, vertical, shorts, tiktok, reels, 9:16
---

# Short-Form Video Rules

Rules for `type: "short"` videos — 9:16 vertical format for YouTube Shorts, TikTok, and Reels.

## Format Specs

| Setting | Value |
|---------|-------|
| Resolution | 1080x1920 (9:16 portrait) |
| FPS | 30 |
| Duration sweet spots | **13s** or **60s** (bimodal peaks from 35B views study) |
| Duration range | 10-90s (avoid 30-45s dead zone) |
| Max duration | 180s (YouTube limit, but >90s rarely performs well) |
| Visual change cadence | Every **3 seconds minimum** |
| Hook window | First **1-3 seconds** — must create curiosity gap or pattern interrupt |

## Safe Zones

Platform UI overlays eat into the frame. Keep critical content inside these margins:

| Zone | Margin | Why |
|------|--------|-----|
| Top | 160px | Status bar + username overlay |
| Bottom | 350px | Comments, CTA buttons, description |
| Left | 60px | Edge overflow |
| Right | 60px | Like/share buttons |

Use `useLayoutMode()` from `src/shared/formats.ts` — it provides `contentPadding` that respects these zones.

## Structure: Hook → Value Bomb → Loop Setup

Shorts have ONE section. No SectionTitle scenes, no section markers.

```
Hook (0-3s)
  → ColdOpen or HookQuestion
  → Scroll-stopping statement or provocative question
  → Must create an open loop that demands resolution

Value Bomb (remaining time)
  → 2-6 content scenes with visual change every 3s
  → Each scene delivers ONE clear idea
  → Use: ConceptExplain, StatHighlight, DiagramFlow, BulletRevealScene,
    CodeDisplay, ComparisonSplit, KeyRuleCard, VisualMetaphor, BeforeAfter,
    FullScreenText, StepSequence, QuoteCard, WarningCallout

Loop Setup (final 1-2s)
  → KeyTakeaway or FullScreenText
  → Mirror or callback to the opening hook
  → Creates seamless replay feeling (loop rate boosts algorithm)
```

**Total**: 3-8 scenes. Never more than 8.

## Scene Catalog (Vertical-Compatible)

These scenes support vertical layout via `useLayoutMode()`:

### Always Works Vertically (centered/stacked layout)
- HookQuestion, ColdOpen, TitleIntro, SectionTitle
- ConceptExplain, VisualMetaphor, KeyRuleCard, FeatureIntro
- StatHighlight, KeyTakeaway, QuoteCard, WarningCallout
- BulletRevealScene, StepSequence, SummaryRecap
- FullScreenText, SwipeReveal (short-specific scenes)

### Works Vertically with Responsive Layout
- CodeDisplay (stacks code above annotations)
- ComparisonSplit (stacks columns vertically)
- BeforeAfter (stacks panels vertically)
- ThreeColumnCompare (stacks 3 cards vertically, 2 items max per card)
- MetricDashboard (single column, 3 metrics max)
- SplitCodeComparison (stacks panels vertically)

### Skip for Shorts
- ArchitectureDiagram (hardcoded center, unsuitable for portrait)
- EndScreen (no end screen on Shorts — loop instead)
- Outro (deprecated)
- SectionTitle (no sections in shorts)
- DataChart (complex charts hard to read on mobile)

### Extended Scenes for Shorts
For scroll-stopping visual enhancement (text effects, atmospheric backgrounds, emphasis moments), see [educational-scenes.md](educational-scenes.md). Useful for shorts: TextGlitch, TextKinetic (text effects), BackgroundBokeh, BackgroundWaves (atmosphere), CinematicSciFi (dramatic opens), TransitionFlash (impact moments).

## Pacing Rules

| Rule | Value | Why |
|------|-------|-----|
| WPM | **170** (vs 155 for long-form) | Faster pacing keeps attention |
| Max scene duration | **8s** | Prevent visual stagnation |
| Min scene duration | **3s** | Enough for one visual beat |
| Narration padding | 0.3s (vs 0.5s for long-form) | Tighter pacing |
| Transition duration | **8 frames / 0.27s** (shortFade) | Preserve content time |

### Duration Formula (Short-Form)

```
wordCount = narration.split(/\s+/).filter(Boolean).length
baseDuration = (wordCount / 170) * 60      // 170 WPM for shorts
paddedDuration = baseDuration + 0.3         // less padding than long-form
rounded = Math.ceil(paddedDuration * 2) / 2
finalDuration = clamp(rounded, 3, 8)        // 3s min, 8s max per scene
```

## Architecture: Flat TransitionSeries

Shorts use a **flat** `TransitionSeries` — no `<Series>` section wrapper, no section files.

```
src/videos/<VideoName>/
  index.tsx              # TransitionSeries of all scenes (no sections/)
  script.json            # type: "short", single section
  manifest.json          # Flat scene list
  transcript.json        # Pre-populated narration
  styles.ts              # Colors, fonts, tokens
```

### index.tsx Pattern

```tsx
import { AbsoluteFill } from "remotion";
import { TransitionSeries } from "@remotion/transitions";
import { linearTiming } from "@remotion/transitions";
import { TRANSITIONS } from "../../shared/transitions";
import { CaptionOverlay } from "../../shared/components/CaptionOverlay";
import { Background } from "../../shared/components/Background";

// Import shared scenes
import { ColdOpen } from "../../shared/scenes/ColdOpen";
import { ConceptExplain } from "../../shared/scenes/ConceptExplain";
// ... etc

export const ShortVideoName: React.FC = () => {
  return (
    <AbsoluteFill>
      <Background overlay="particles" />
      <TransitionSeries>
        <TransitionSeries.Sequence durationInFrames={90}>
          <ColdOpen ... />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition
          presentation={TRANSITIONS.shortFade.presentation}
          timing={linearTiming({ durationInFrames: 8 })}
        />
        {/* ... more scenes ... */}
      </TransitionSeries>
      <CaptionOverlay captions={[]} />
    </AbsoluteFill>
  );
};
```

## Overlays

| Overlay | Include? | Why |
|---------|----------|-----|
| CaptionOverlay | **YES** (always) | Essential for engagement — bold style default, word-by-word |
| Background | YES | Visual depth |
| Watermark | NO | Shorts have channel branding in the feed UI |
| ProgressBar | NO | No need — shorts are too short |
| SectionTracker | NO | No sections |
| FeatureCounter | NO | Not applicable |

## Transitions

Use `shortFade` (8 frames / 0.27s) as the default transition between scenes. Longer transitions eat into content time on shorts.

For variety, alternate between:
- `shortFade` (8f) — default
- `slideUp` (12f) — for reveals
- `fade` (10f) — slightly longer for emphasis

Do NOT use `clockWipe` (25f) or `springFade` (25f) — too long for shorts.

## CaptionOverlay Configuration

Shorts default to:
- Style: `bold` (large, centered, word-by-word highlighting)
- combineMs: `400` (more word-by-word than long-form's 800ms)
- Font scaling: 1.3x for vertical readability
- Position: above 350px bottom safe zone

These defaults are applied automatically when the composition is vertical — see `CaptionOverlay.tsx`.

## Music Guidance

**Default recommendation: no music** for shorts.

Why:
- Each music track costs 50% of your revenue share (YouTube Shorts monetization)
- 2 tracks = only 33% of revenue
- Shorts algorithm weights completion rate, not production quality
- If music is essential (mood piece, montage), use ONE track and warn about revenue impact

## script.json Format (Short-Form)

```json
{
  "videoName": "ShortMCPExplained",
  "type": "short",
  "fps": 30,
  "resolution": { "width": 1080, "height": 1920 },
  "meta": {
    "targetDuration": 60,
    "loopSetup": "mirrors opening question",
    "hookStrategy": "curiosity-gap",
    "shortGoal": "growth",
    "ideaSource": "productions/2026-04-01/idea.md",
    "researchFile": "productions/2026-04-01-mcp-explained/research.md"
  },
  "style": {
    "fontHeading": "Inter",
    "fontBody": "Inter",
    "fontMono": "JetBrains Mono",
    "background": "dark gradient"
  },
  "sections": [
    {
      "sectionIndex": 1,
      "title": "Main",
      "sectionTone": "urgent, punchy",
      "scenes": [
        {
          "sceneIndex": 1,
          "sceneType": "ColdOpen",
          "narration": "MCP is about to change everything you know about AI agents.",
          "narratorTone": "bold, urgent",
          "visualDirection": "Large text on dark background, particle field",
          "onScreenText": ["MCP changes everything"],
          "props": { "statement": "MCP changes everything", "subtext": "Here's why" }
        }
      ]
    }
  ]
}
```

Key differences from long-form script.json:
- `type: "short"` (not news/explainer/tutorial)
- `resolution: { width: 1080, height: 1920 }` (portrait)
- `meta.targetDuration` — target length in seconds
- `meta.loopSetup` — how the ending mirrors the opening
- `meta.hookStrategy` — which hook archetype was chosen
- `meta.shortGoal` — growth, monetisation, or long-form funnel
- Single section with title "Main"
- No `sectionColor` (no per-section theming in shorts)
- No `humorScene` (shorts are too fast for section-level humor planning)
