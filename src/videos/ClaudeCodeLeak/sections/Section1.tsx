import React from "react";
import { TransitionSeries, linearTiming } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { slide } from "@remotion/transitions/slide";
import { wipe } from "@remotion/transitions/wipe";
import { ColdOpen } from "../../../shared/scenes/ColdOpen";
import { TitleIntro } from "../../../shared/scenes/TitleIntro";
import { CinematicDocumentary } from "../../../shared/scenes/CinematicDocumentary";
import { ConceptExplain } from "../../../shared/scenes/ConceptExplain";
import { StatHighlight } from "../../../shared/scenes/StatHighlight";
import { COLORS, FONTS, TIMING, SECTION_COLORS } from "../styles";

const colors = {
  bg: COLORS.bg,
  text: COLORS.text,
  accent: SECTION_COLORS[0],
  muted: COLORS.textMuted,
};

export const Section1: React.FC = () => {
  return (
    <TransitionSeries>
      {/* Scene 1: ColdOpen — 15.0s = 450f */}
      <TransitionSeries.Sequence durationInFrames={450}>
        <ColdOpen
          statement="One missing line of code"
          subtext="512K lines leaked. Fastest repo ever. 8,100 repos destroyed."
          colors={colors}
          fontFamily={FONTS.heading}
          entrance="glow"
          showParticles
        />
      </TransitionSeries.Sequence>

      <TransitionSeries.Transition
        presentation={fade()}
        timing={linearTiming({ durationInFrames: TIMING.sceneFade })}
      />

      {/* Scene 2: TitleIntro — 14.5s = 435f */}
      <TransitionSeries.Sequence durationInFrames={435}>
        <TitleIntro
          title="The Claude Code Leak"
          objectives={[
            "How the source shipped to npm",
            "44 hidden features exposed",
            "Claw Code born overnight",
            "The DMCA and security fallout",
          ]}
          colors={colors}
          fontFamily={FONTS.heading}
          entrance="scaleRotate"
        />
      </TransitionSeries.Sequence>

      <TransitionSeries.Transition
        presentation={slide({ direction: "from-right" })}
        timing={linearTiming({ durationInFrames: TIMING.sceneSlide })}
      />

      {/* Scene 3: CinematicDocumentary — 15.5s = 465f */}
      <TransitionSeries.Sequence durationInFrames={465}>
        <CinematicDocumentary
          title="The Discovery"
          subtitle="A 59.8 MB file that shouldn't exist"
          location="March 31, 2026 — 4:23 AM ET"
        />
      </TransitionSeries.Sequence>

      <TransitionSeries.Transition
        presentation={fade()}
        timing={linearTiming({ durationInFrames: TIMING.sceneFade })}
      />

      {/* Scene 4: ConceptExplain — 21.5s = 645f */}
      <TransitionSeries.Sequence durationInFrames={645}>
        <ConceptExplain
          heading="The Root Cause"
          body="A missing .npmignore entry shipped a 59.8 MB source map to the public npm registry"
          analogy="Like accidentally emailing the entire company your private notes"
          icon="📦"
          sectionColor={SECTION_COLORS[0]}
          colors={colors}
          fontFamily={FONTS.heading}
        />
      </TransitionSeries.Sequence>

      <TransitionSeries.Transition
        presentation={wipe({ direction: "from-left" })}
        timing={linearTiming({ durationInFrames: TIMING.sceneWipe })}
      />

      {/* Scene 5: StatHighlight — 17.5s = 525f */}
      <TransitionSeries.Sequence durationInFrames={525}>
        <StatHighlight
          stat={2}
          label="leaks in 5 days"
          context="From the AI safety company"
          sectionColor={SECTION_COLORS[0]}
          colors={colors}
          fontFamily={FONTS.heading}
          emphasis="glow"
          mode="splitFlap"
        />
      </TransitionSeries.Sequence>
    </TransitionSeries>
  );
};

export const SECTION_1_DURATION_FRAMES = 2452;
