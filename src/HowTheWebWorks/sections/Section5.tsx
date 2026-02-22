import React from "react";
import { TransitionSeries, linearTiming } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { slide } from "@remotion/transitions/slide";
import { SectionTitle } from "../../shared/scenes/SectionTitle";
import { TimelineScene } from "../../shared/scenes/TimelineScene";
import { ConceptExplain } from "../../shared/scenes/ConceptExplain";
import { DataChart } from "../../shared/scenes/DataChart";
import { KeyTakeaway } from "../../shared/scenes/KeyTakeaway";
import { FONTS, COLORS, FPS, T_FADE, T_SLIDE, TOTAL_SECTIONS } from "../styles";

export const Section5: React.FC = () => {
  return (
    <TransitionSeries>
      {/* Scene 24: Section Title */}
      <TransitionSeries.Sequence durationInFrames={3 * FPS}>
        <SectionTitle
          sectionNumber={5}
          title="The Render"
          subtitle="From raw HTML to pixels on screen"
          totalSections={TOTAL_SECTIONS}
          fontFamily={FONTS.main}
          entrance="scaleBlur"
        />
      </TransitionSeries.Sequence>

      <TransitionSeries.Transition
        presentation={slide({ direction: "from-right" })}
        timing={linearTiming({ durationInFrames: T_SLIDE })}
      />

      {/* Scene 25: Rendering Pipeline Timeline */}
      <TransitionSeries.Sequence durationInFrames={10 * FPS}>
        <TimelineScene
          heading="Browser Rendering Pipeline"
          nodes={[
            { label: "Parse HTML", description: "Build the DOM tree" },
            { label: "Parse CSS", description: "Build the CSSOM" },
            { label: "Render Tree", description: "Combine DOM + CSSOM" },
            { label: "Layout", description: "Calculate positions" },
            { label: "Paint", description: "Draw pixels" },
          ]}
          layout="horizontal"
          fontFamily={FONTS.main}
        />
      </TransitionSeries.Sequence>

      <TransitionSeries.Transition
        presentation={fade()}
        timing={linearTiming({ durationInFrames: T_FADE })}
      />

      {/* Scene 26: Concept Explain */}
      <TransitionSeries.Sequence durationInFrames={7 * FPS}>
        <ConceptExplain
          heading="The Critical Render Path"
          body="The browser can't show anything until it builds the DOM and CSSOM. That's why blocking CSS and JavaScript in the head slow down your page."
          analogy="You can't hang a painting until the wall is built and painted. Same idea."
          icon="🎨"
          fontFamily={FONTS.main}
          headingEntrance="fadeUp"
        />
      </TransitionSeries.Sequence>

      <TransitionSeries.Transition
        presentation={fade()}
        timing={linearTiming({ durationInFrames: T_FADE })}
      />

      {/* Scene 27: Data Chart */}
      <TransitionSeries.Sequence durationInFrames={8 * FPS}>
        <DataChart
          heading="What Takes the Longest"
          bars={[
            { label: "DNS", value: 20, color: COLORS.cyan },
            { label: "TCP", value: 30, color: COLORS.amber },
            { label: "Server", value: 100, color: COLORS.indigo },
            { label: "Download", value: 80, color: COLORS.violet },
            { label: "Render", value: 60, color: COLORS.green },
          ]}
          suffix="ms"
          fontFamily={FONTS.main}
        />
      </TransitionSeries.Sequence>

      <TransitionSeries.Transition
        presentation={fade()}
        timing={linearTiming({ durationInFrames: T_FADE })}
      />

      {/* Scene 28: Key Takeaway */}
      <TransitionSeries.Sequence durationInFrames={5 * FPS}>
        <KeyTakeaway
          takeaway="The browser parses HTML and CSS, builds a render tree, calculates layout, and paints pixels. This all happens in milliseconds."
          fontFamily={FONTS.main}
        />
      </TransitionSeries.Sequence>
    </TransitionSeries>
  );
};
