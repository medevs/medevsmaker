import React from "react";
import { TransitionSeries, linearTiming } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { slide } from "@remotion/transitions/slide";
import { SectionTitle } from "../../shared/scenes/SectionTitle";
import { DiagramFlow } from "../../shared/scenes/DiagramFlow";
import { BeforeAfter } from "../../shared/scenes/BeforeAfter";
import { WarningCallout } from "../../shared/scenes/WarningCallout";
import { KeyTakeaway } from "../../shared/scenes/KeyTakeaway";
import { FONTS, COLORS, FPS, T_FADE, T_SLIDE, TOTAL_SECTIONS } from "../styles";

export const Section4: React.FC = () => {
  return (
    <TransitionSeries>
      {/* Scene 19: Section Title */}
      <TransitionSeries.Sequence durationInFrames={3 * FPS}>
        <SectionTitle
          sectionNumber={4}
          title="The Server"
          subtitle="Where your request gets processed"
          totalSections={TOTAL_SECTIONS}
          fontFamily={FONTS.main}
          entrance="slideLeft"
        />
      </TransitionSeries.Sequence>

      <TransitionSeries.Transition
        presentation={slide({ direction: "from-right" })}
        timing={linearTiming({ durationInFrames: T_SLIDE })}
      />

      {/* Scene 20: Server Pipeline Diagram */}
      <TransitionSeries.Sequence durationInFrames={10 * FPS}>
        <DiagramFlow
          title="Inside the Server"
          nodes={[
            { label: "Request", sublabel: "Arrives", color: COLORS.cyan },
            { label: "Router", sublabel: "Match URL", color: COLORS.amber },
            { label: "Handler", sublabel: "Run Logic", color: COLORS.indigo },
            { label: "Database", sublabel: "Read/Write", color: COLORS.violet },
            { label: "Response", sublabel: "Send Back", color: COLORS.green },
          ]}
          connections={[
            { from: 0, to: 1 },
            { from: 1, to: 2 },
            { from: 2, to: 3 },
            { from: 3, to: 4 },
          ]}
          direction="horizontal"
          fontFamily={FONTS.main}
        />
      </TransitionSeries.Sequence>

      <TransitionSeries.Transition
        presentation={fade()}
        timing={linearTiming({ durationInFrames: T_FADE })}
      />

      {/* Scene 21: Before/After */}
      <TransitionSeries.Sequence durationInFrames={8 * FPS}>
        <BeforeAfter
          heading="Static vs Dynamic"
          before={{
            title: "Static",
            items: [
              "Pre-built HTML files",
              "Same for every user",
              "Fast, no processing",
            ],
          }}
          after={{
            title: "Dynamic",
            items: [
              "Generated on each request",
              "Personalized content",
              "Needs server + database",
            ],
          }}
          fontFamily={FONTS.main}
          reveal="wipe"
        />
      </TransitionSeries.Sequence>

      <TransitionSeries.Transition
        presentation={fade()}
        timing={linearTiming({ durationInFrames: T_FADE })}
      />

      {/* Scene 22: Warning */}
      <TransitionSeries.Sequence durationInFrames={6 * FPS}>
        <WarningCallout
          heading="Never Trust the Client"
          body="Users can modify anything in the browser. Always validate inputs on the server. Client checks are for UX, server checks are for security."
          severity="danger"
          fontFamily={FONTS.main}
        />
      </TransitionSeries.Sequence>

      <TransitionSeries.Transition
        presentation={fade()}
        timing={linearTiming({ durationInFrames: T_FADE })}
      />

      {/* Scene 23: Key Takeaway */}
      <TransitionSeries.Sequence durationInFrames={5 * FPS}>
        <KeyTakeaway
          takeaway="The server routes requests, runs business logic, talks to the database, and sends back responses. It's the brain of every web app."
          fontFamily={FONTS.main}
        />
      </TransitionSeries.Sequence>
    </TransitionSeries>
  );
};
