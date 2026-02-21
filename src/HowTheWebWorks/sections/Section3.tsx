import React from "react";
import { TransitionSeries, linearTiming } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { SectionTitle } from "../../shared/scenes/SectionTitle";
import { ConceptExplain } from "../../shared/scenes/ConceptExplain";
import { DiagramFlow } from "../../shared/scenes/DiagramFlow";
import { CodeDisplay } from "../../shared/scenes/CodeDisplay";
import { BulletRevealScene } from "../../shared/scenes/BulletRevealScene";
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
        />
      </TransitionSeries.Sequence>

      <TransitionSeries.Transition
        presentation={fade()}
        timing={linearTiming({ durationInFrames: T })}
      />

      {/* Scene 15: Concept Explain */}
      <TransitionSeries.Sequence durationInFrames={7 * FPS}>
        <ConceptExplain
          heading="Servers Are Just Computers"
          body="A server is a computer that's always on, always connected, and waiting for requests. When one arrives, it processes it and sends back a response."
          analogy="It's the kitchen in our restaurant — always ready to cook whatever's ordered."
          icon="🖥️"
          colors={{
            bg: COLORS.bg,
            text: COLORS.text,
            accent: COLORS.indigo,
            muted: COLORS.muted,
          }}
          fontFamily={FONTS.heading}
        />
      </TransitionSeries.Sequence>

      <TransitionSeries.Transition
        presentation={fade()}
        timing={linearTiming({ durationInFrames: T })}
      />

      {/* Scene 16: Diagram Flow */}
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

      {/* Scene 17: Code Display */}
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
        presentation={fade()}
        timing={linearTiming({ durationInFrames: T })}
      />

      {/* Scene 18: Bullet Reveal */}
      <TransitionSeries.Sequence durationInFrames={7 * FPS}>
        <BulletRevealScene
          heading="HTTP Status Codes"
          items={[
            "200 — OK, here's your page",
            "301 — It moved, follow this link",
            "404 — Page not found",
            "500 — Server broke, not your fault",
          ]}
          bulletStyle="number"
          colors={{
            bg: COLORS.bg,
            text: COLORS.text,
            accent: COLORS.amber,
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
          takeaway="The server receives requests, processes them, and sends back responses. Every website you visit follows this exact pattern."
          colors={{ bg: COLORS.bg, text: COLORS.text }}
          fontFamily={FONTS.heading}
        />
      </TransitionSeries.Sequence>
    </TransitionSeries>
  );
};
