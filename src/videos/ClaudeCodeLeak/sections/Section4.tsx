import React from "react";
import { TransitionSeries, linearTiming } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { slide } from "@remotion/transitions/slide";
import { SectionTitle } from "../../../shared/scenes/SectionTitle";
import { TextGlitch } from "../../../shared/scenes/TextGlitch";
import { QuoteCard } from "../../../shared/scenes/QuoteCard";
import { BeforeAfter } from "../../../shared/scenes/BeforeAfter";
import { KeyTakeaway } from "../../../shared/scenes/KeyTakeaway";
import { COLORS, FONTS, TIMING, SECTION_COLORS, TOTAL_SECTIONS } from "../styles";

const colors = {
  bg: COLORS.bg,
  text: COLORS.text,
  accent: SECTION_COLORS[3],
  muted: COLORS.textMuted,
};

export const Section4: React.FC = () => {
  return (
    <TransitionSeries>
      {/* Scene 1: SectionTitle — 4.0s = 120f */}
      <TransitionSeries.Sequence durationInFrames={120}>
        <SectionTitle
          sectionNumber={4}
          title="The DMCA Disaster"
          totalSections={TOTAL_SECTIONS}
          colors={colors}
          fontFamily={FONTS.heading}
          entrance="scaleBlur"
        />
      </TransitionSeries.Sequence>

      <TransitionSeries.Transition
        presentation={slide({ direction: "from-right" })}
        timing={linearTiming({ durationInFrames: TIMING.sceneSlide })}
      />

      {/* Scene 2: TextGlitch — 19.0s = 570f */}
      <TransitionSeries.Sequence durationInFrames={570}>
        <TextGlitch text="8,100 REPOS DOWN" />
      </TransitionSeries.Sequence>

      <TransitionSeries.Transition
        presentation={fade()}
        timing={linearTiming({ durationInFrames: TIMING.sceneFade })}
      />

      {/* Scene 3: QuoteCard — 18.0s = 540f */}
      <TransitionSeries.Sequence durationInFrames={540}>
        <QuoteCard
          quote="Anthropic DMCA'd my Claude Code fork... which did not have the Claude Code source. Absolutely pathetic."
          attribution="Theo Browne — Fork contained zero leaked code"
          sectionColor={SECTION_COLORS[3]}
          colors={colors}
          fontFamily={FONTS.heading}
        />
      </TransitionSeries.Sequence>

      <TransitionSeries.Transition
        presentation={fade()}
        timing={linearTiming({ durationInFrames: TIMING.sceneFade })}
      />

      {/* Scene 4: BeforeAfter — 17.0s = 510f */}
      <TransitionSeries.Sequence durationInFrames={510}>
        <BeforeAfter
          heading="The Retraction"
          before={{
            title: "DMCA Filed",
            items: ["8,100 repos disabled", "Developers locked out", "Widespread outrage"],
          }}
          after={{
            title: "Reality",
            items: ["96 repos had leaked code", "8,004 repos restored", "Trust already damaged"],
          }}
          sectionColor={SECTION_COLORS[3]}
          fontFamily={FONTS.heading}
          reveal="wipe"
        />
      </TransitionSeries.Sequence>

      <TransitionSeries.Transition
        presentation={fade()}
        timing={linearTiming({ durationInFrames: TIMING.sceneFade })}
      />

      {/* Scene 5: KeyTakeaway — 16.0s = 480f */}
      <TransitionSeries.Sequence durationInFrames={480}>
        <KeyTakeaway
          heading="The Irony"
          takeaway="The code is permanent — decentralized mirrors are beyond DMCA reach"
          sectionColor={SECTION_COLORS[3]}
          colors={colors}
          fontFamily={FONTS.heading}
        />
      </TransitionSeries.Sequence>
    </TransitionSeries>
  );
};

export const SECTION_4_DURATION_FRAMES = 2155;
