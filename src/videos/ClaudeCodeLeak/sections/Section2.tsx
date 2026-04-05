import React from "react";
import { TransitionSeries, linearTiming } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { slide } from "@remotion/transitions/slide";
import { wipe } from "@remotion/transitions/wipe";
import { SectionTitle } from "../../../shared/scenes/SectionTitle";
import { LayoutGiantNumber } from "../../../shared/scenes/LayoutGiantNumber";
import { CinematicSciFi } from "../../../shared/scenes/CinematicSciFi";
import { ConceptExplain } from "../../../shared/scenes/ConceptExplain";
import { CodeDisplay } from "../../../shared/scenes/CodeDisplay";
import { KeyTakeaway } from "../../../shared/scenes/KeyTakeaway";
import { COLORS, FONTS, TIMING, SECTION_COLORS, TOTAL_SECTIONS } from "../styles";

const colors = {
  bg: COLORS.bg,
  text: COLORS.text,
  accent: SECTION_COLORS[1],
  muted: COLORS.textMuted,
};

export const Section2: React.FC = () => {
  return (
    <TransitionSeries>
      {/* Scene 1: SectionTitle — 7.0s = 210f */}
      <TransitionSeries.Sequence durationInFrames={210}>
        <SectionTitle
          sectionNumber={2}
          title="Inside the Code"
          totalSections={TOTAL_SECTIONS}
          colors={colors}
          fontFamily={FONTS.heading}
          entrance="neon"
        />
      </TransitionSeries.Sequence>

      <TransitionSeries.Transition
        presentation={slide({ direction: "from-right" })}
        timing={linearTiming({ durationInFrames: TIMING.sceneSlide })}
      />

      {/* Scene 2: LayoutGiantNumber — 13.0s = 390f */}
      <TransitionSeries.Sequence durationInFrames={390}>
        <LayoutGiantNumber
          number="44"
          label="Hidden Feature Flags"
        />
      </TransitionSeries.Sequence>

      <TransitionSeries.Transition
        presentation={wipe({ direction: "from-left" })}
        timing={linearTiming({ durationInFrames: TIMING.sceneWipe })}
      />

      {/* Scene 3: CinematicSciFi — 17.0s = 510f */}
      <TransitionSeries.Sequence durationInFrames={510}>
        <CinematicSciFi
          title="KAIROS"
          status="AUTONOMOUS AGENT — STANDBY"
        />
      </TransitionSeries.Sequence>

      <TransitionSeries.Transition
        presentation={fade()}
        timing={linearTiming({ durationInFrames: TIMING.sceneFade })}
      />

      {/* Scene 4: ConceptExplain — 16.5s = 495f */}
      <TransitionSeries.Sequence durationInFrames={495}>
        <ConceptExplain
          heading="Claude Buddy"
          body="A terminal Tamagotchi with 18 species, 5 rarity tiers, and shiny variants generated from your user ID"
          analogy="Your childhood Tamagotchi, but it lives in your terminal"
          icon="🐾"
          sectionColor={SECTION_COLORS[1]}
          colors={colors}
          fontFamily={FONTS.heading}
        />
      </TransitionSeries.Sequence>

      <TransitionSeries.Transition
        presentation={fade()}
        timing={linearTiming({ durationInFrames: TIMING.sceneFade })}
      />

      {/* Scene 5: CodeDisplay — 24.5s = 735f */}
      <TransitionSeries.Sequence durationInFrames={735}>
        <CodeDisplay
          title="The Clever Bits"
          code={`// Anti-distillation\nanti_distillation: ['fake_tools']\n\n// Undercover mode\nif (isNonInternalRepo) {\n  stripAnthropicTraces()\n}\n\n// Frustration detection\nconst FRUSTRATION = /wtf|ffs|horrible/`}
          annotations={[
            { line: 2, text: "Poisons competitor training" },
            { line: 5, text: "Hides Anthropic from OSS" },
            { line: 9, text: "Sentiment analysis via regex" },
          ]}
          highlightLines={[2, 5, 9]}
          sectionColor={SECTION_COLORS[1]}
          colors={colors}
          fontFamily={FONTS.heading}
        />
      </TransitionSeries.Sequence>

      <TransitionSeries.Transition
        presentation={fade()}
        timing={linearTiming({ durationInFrames: TIMING.sceneFade })}
      />

      {/* Scene 6: KeyTakeaway — 17.0s = 510f */}
      <TransitionSeries.Sequence durationInFrames={510}>
        <KeyTakeaway
          heading="The Real Insight"
          takeaway="Only 1.6% of the code touches the AI model — the rest is pure software engineering"
          sectionColor={SECTION_COLORS[1]}
          colors={colors}
          fontFamily={FONTS.heading}
        />
      </TransitionSeries.Sequence>
    </TransitionSeries>
  );
};

export const SECTION_2_DURATION_FRAMES = 2767;
