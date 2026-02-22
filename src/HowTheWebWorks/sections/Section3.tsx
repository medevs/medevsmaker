import React from "react";
import { TransitionSeries, linearTiming } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { slide } from "@remotion/transitions/slide";
import { wipe } from "@remotion/transitions/wipe";
import { SectionTitle } from "../../shared/scenes/SectionTitle";
import { ConceptExplain } from "../../shared/scenes/ConceptExplain";
import { ComparisonSplit } from "../../shared/scenes/ComparisonSplit";
import { CodeDisplay } from "../../shared/scenes/CodeDisplay";
import { StatHighlight } from "../../shared/scenes/StatHighlight";
import { KeyTakeaway } from "../../shared/scenes/KeyTakeaway";
import { FONTS, COLORS, FPS, T_FADE, T_SLIDE, T_WIPE, TOTAL_SECTIONS } from "../styles";

export const Section3: React.FC = () => {
  return (
    <TransitionSeries>
      {/* Scene 13: Section Title */}
      <TransitionSeries.Sequence durationInFrames={3 * FPS}>
        <SectionTitle
          sectionNumber={3}
          title="The Request"
          subtitle="Speaking HTTP to the server"
          totalSections={TOTAL_SECTIONS}
          fontFamily={FONTS.main}
          entrance="fadeUp"
        />
      </TransitionSeries.Sequence>

      <TransitionSeries.Transition
        presentation={slide({ direction: "from-right" })}
        timing={linearTiming({ durationInFrames: T_SLIDE })}
      />

      {/* Scene 14: Concept Explain */}
      <TransitionSeries.Sequence durationInFrames={7 * FPS}>
        <ConceptExplain
          heading="HTTP Is a Conversation"
          body="Your browser sends a request with a method, URL, and headers. The server reads it, does its work, and sends back a response with a status code and data."
          analogy="It's ordering at a restaurant. You say what you want, the kitchen makes it, and they bring it back."
          icon="💬"
          fontFamily={FONTS.main}
          headingEntrance="fadeLeft"
        />
      </TransitionSeries.Sequence>

      <TransitionSeries.Transition
        presentation={fade()}
        timing={linearTiming({ durationInFrames: T_FADE })}
      />

      {/* Scene 15: Comparison Split */}
      <TransitionSeries.Sequence durationInFrames={8 * FPS}>
        <ComparisonSplit
          heading="GET vs POST"
          left={{
            title: "GET",
            items: [
              "Reads data",
              "Parameters in URL",
              "Can be cached",
              "Bookmarkable",
            ],
            color: COLORS.cyan,
          }}
          right={{
            title: "POST",
            items: [
              "Sends data",
              "Parameters in body",
              "Never cached",
              "Form submissions",
            ],
            color: COLORS.violet,
          }}
          fontFamily={FONTS.main}
          entranceStyle="spring"
        />
      </TransitionSeries.Sequence>

      <TransitionSeries.Transition
        presentation={wipe({ direction: "from-left" })}
        timing={linearTiming({ durationInFrames: T_WIPE })}
      />

      {/* Scene 16: Code Display */}
      <TransitionSeries.Sequence durationInFrames={10 * FPS}>
        <CodeDisplay
          title="A Real HTTP Response"
          code={`HTTP/1.1 200 OK
Content-Type: text/html
Content-Length: 1256
Cache-Control: max-age=3600

<!DOCTYPE html>
<html lang="en">
  <body>Hello World</body>
</html>`}
          annotations={[
            { line: 1, text: "200 means everything worked" },
            { line: 2, text: "Tells browser it's HTML" },
            { line: 4, text: "Cache for 1 hour" },
          ]}
          fontFamily={FONTS.main}
        />
      </TransitionSeries.Sequence>

      <TransitionSeries.Transition
        presentation={fade()}
        timing={linearTiming({ durationInFrames: T_FADE })}
      />

      {/* Scene 17: Stat Highlight */}
      <TransitionSeries.Sequence durationInFrames={5 * FPS}>
        <StatHighlight
          stat={5}
          suffix="B+"
          label="HTTP requests per day globally"
          context="Every click, scroll, and page load fires at least one"
          fontFamily={FONTS.main}
          emphasis="glow"
        />
      </TransitionSeries.Sequence>

      <TransitionSeries.Transition
        presentation={fade()}
        timing={linearTiming({ durationInFrames: T_FADE })}
      />

      {/* Scene 18: Key Takeaway */}
      <TransitionSeries.Sequence durationInFrames={5 * FPS}>
        <KeyTakeaway
          takeaway="HTTP is the language browsers and servers speak. Every web interaction is a request-response pair."
          fontFamily={FONTS.main}
        />
      </TransitionSeries.Sequence>
    </TransitionSeries>
  );
};
