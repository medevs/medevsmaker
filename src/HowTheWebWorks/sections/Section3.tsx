import React from "react";
import { TransitionSeries, linearTiming } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { slide } from "@remotion/transitions/slide";
import { wipe } from "@remotion/transitions/wipe";
import { SectionTitle } from "../../shared/scenes/SectionTitle";
import { DiagramFlow } from "../../shared/scenes/DiagramFlow";
import { CodeDisplay } from "../../shared/scenes/CodeDisplay";
import { VisualMetaphor } from "../../shared/scenes/VisualMetaphor";
import { DataChart } from "../../shared/scenes/DataChart";
import { KeyTakeaway } from "../../shared/scenes/KeyTakeaway";
import { FONTS, COLORS, FPS, T } from "../styles";

export const Section3: React.FC = () => {
  return (
    <TransitionSeries>
      {/* Scene 14: Section Title */}
      <TransitionSeries.Sequence durationInFrames={3 * FPS}>
        <SectionTitle
          sectionNumber={3}
          title="The Server"
          subtitle="Where the magic actually happens"
          colors={{
            bg: COLORS.bg,
            text: COLORS.text,
            accent: COLORS.indigo,
            muted: COLORS.muted,
          }}
          fontFamily={FONTS.heading}
          entrance="slideLeft"
        />
      </TransitionSeries.Sequence>

      <TransitionSeries.Transition
        presentation={slide({ direction: "from-right" })}
        timing={linearTiming({ durationInFrames: 20 })}
      />

      {/* Scene 15: Diagram — request-response cycle (visual-heavy) */}
      <TransitionSeries.Sequence durationInFrames={10 * FPS}>
        <DiagramFlow
          title="The Request-Response Cycle"
          nodes={[
            { label: "Request", sublabel: "GET /page", color: COLORS.cyan },
            { label: "Router", sublabel: "Match path", color: COLORS.indigo },
            { label: "Logic", sublabel: "Process", color: COLORS.violet },
            { label: "Response", sublabel: "Send HTML", color: COLORS.green },
          ]}
          connections={[
            { from: 0, to: 1, label: "URL" },
            { from: 1, to: 2, label: "handler" },
            { from: 2, to: 3, label: "result" },
          ]}
          direction="horizontal"
          colors={{ bg: COLORS.bg, text: COLORS.text, accent: COLORS.cyan }}
          fontFamily={FONTS.heading}
        />
      </TransitionSeries.Sequence>

      <TransitionSeries.Transition
        presentation={fade()}
        timing={linearTiming({ durationInFrames: T })}
      />

      {/* Scene 16: Visual Metaphor — humor beat */}
      <TransitionSeries.Sequence durationInFrames={6 * FPS}>
        <VisualMetaphor
          icon="🍳"
          heading="The Kitchen Analogy"
          analogy="The server is a short-order cook. Request comes in, cook processes it, plates the response. No request? Cook just waits. Servers are patient."
          colors={{
            bg: COLORS.bg,
            text: COLORS.text,
            accent: COLORS.indigo,
            muted: COLORS.muted,
          }}
          fontFamily={FONTS.heading}
          iconEffect="bounce"
        />
      </TransitionSeries.Sequence>

      <TransitionSeries.Transition
        presentation={wipe({ direction: "from-left" })}
        timing={linearTiming({ durationInFrames: 18 })}
      />

      {/* Scene 17: Code Display — HTTP response */}
      <TransitionSeries.Sequence durationInFrames={12 * FPS}>
        <CodeDisplay
          title="A Simple HTTP Response"
          code={`HTTP/1.1 200 OK
Content-Type: text/html

<html>
  <body>Hello World</body>
</html>`}
          annotations={[
            { line: 1, text: "Status — 200 means success" },
            { line: 2, text: "Tells browser it's HTML" },
            { line: 5, text: "The actual page content" },
          ]}
          colors={{
            bg: COLORS.bg,
            text: COLORS.text,
            accent: COLORS.cyan,
            muted: COLORS.muted,
          }}
          fontFamily={FONTS.heading}
        />
      </TransitionSeries.Sequence>

      <TransitionSeries.Transition
        presentation={slide({ direction: "from-left" })}
        timing={linearTiming({ durationInFrames: 20 })}
      />

      {/* Scene 18: DataChart — HTTP status codes (visual, replaces BulletReveal) */}
      <TransitionSeries.Sequence durationInFrames={10 * FPS}>
        <DataChart
          heading="HTTP Status Codes"
          bars={[
            { label: "200 OK", value: 85, color: COLORS.green },
            { label: "301 Moved", value: 8, color: COLORS.amber },
            { label: "404 Missing", value: 5, color: COLORS.red },
            { label: "500 Broken", value: 2, color: COLORS.red },
          ]}
          maxValue={100}
          suffix="%"
          colors={{
            bg: COLORS.bg,
            text: COLORS.text,
            accent: COLORS.cyan,
            muted: COLORS.muted,
          }}
          fontFamily={FONTS.heading}
        />
      </TransitionSeries.Sequence>

      <TransitionSeries.Transition
        presentation={fade()}
        timing={linearTiming({ durationInFrames: T })}
      />

      {/* Scene 19: Key Takeaway */}
      <TransitionSeries.Sequence durationInFrames={5 * FPS}>
        <KeyTakeaway
          takeaway="The server receives requests, processes them, and sends back responses with status codes. Every website follows this exact pattern."
          colors={{ bg: COLORS.bg, text: COLORS.text }}
          fontFamily={FONTS.heading}
        />
      </TransitionSeries.Sequence>
    </TransitionSeries>
  );
};
