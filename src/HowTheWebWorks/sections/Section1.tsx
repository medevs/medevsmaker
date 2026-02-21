import React from "react";
import { TransitionSeries, linearTiming } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { slide } from "@remotion/transitions/slide";
import { HookQuestion } from "../../shared/scenes/HookQuestion";
import { TitleIntro } from "../../shared/scenes/TitleIntro";
import { SectionTitle } from "../../shared/scenes/SectionTitle";
import { DiagramFlow } from "../../shared/scenes/DiagramFlow";
import { StepSequence } from "../../shared/scenes/StepSequence";
import { VisualMetaphor } from "../../shared/scenes/VisualMetaphor";
import { KeyTakeaway } from "../../shared/scenes/KeyTakeaway";
import { FONTS, COLORS, FPS, T } from "../styles";

export const Section1: React.FC = () => {
  return (
    <TransitionSeries>
      {/* Scene 1: Hook — curiosity gap with humor */}
      <TransitionSeries.Sequence durationInFrames={5 * FPS}>
        <HookQuestion
          question="What actually happens when you click a link?"
          subtext="Spoiler: it's not magic, but it's close"
          colors={{ bg: COLORS.bg, text: COLORS.text, accent: COLORS.cyan }}
          fontFamily={FONTS.heading}
          entrance="fadeUp"
        />
      </TransitionSeries.Sequence>

      <TransitionSeries.Transition
        presentation={fade()}
        timing={linearTiming({ durationInFrames: T })}
      />

      {/* Scene 2: Title Intro — open loops in objectives */}
      <TransitionSeries.Sequence durationInFrames={8 * FPS}>
        <TitleIntro
          title="How the Web Actually Works"
          objectives={[
            "Understand the client-server model",
            "See how DNS translates URLs",
            "What happens inside a server",
            "Why your data survives a reboot",
          ]}
          colors={{
            bg: COLORS.bg,
            text: COLORS.text,
            accent: COLORS.indigo,
            muted: COLORS.muted,
          }}
          fontFamily={FONTS.heading}
          entrance="scaleRotate"
        />
      </TransitionSeries.Sequence>

      <TransitionSeries.Transition
        presentation={slide({ direction: "from-left" })}
        timing={linearTiming({ durationInFrames: 20 })}
      />

      {/* Scene 3: Section Title */}
      <TransitionSeries.Sequence durationInFrames={3 * FPS}>
        <SectionTitle
          sectionNumber={1}
          title="The Client"
          subtitle="Your browser is smarter than you think"
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
        presentation={fade()}
        timing={linearTiming({ durationInFrames: T })}
      />

      {/* Scene 4: Diagram — what the browser does (visual-heavy) */}
      <TransitionSeries.Sequence durationInFrames={10 * FPS}>
        <DiagramFlow
          title="What Your Browser Does"
          nodes={[
            { label: "URL", sublabel: "You type it", color: COLORS.cyan },
            { label: "DNS", sublabel: "Find server", color: COLORS.amber },
            { label: "Request", sublabel: "Ask for page", color: COLORS.indigo },
            { label: "Response", sublabel: "Get HTML", color: COLORS.green },
          ]}
          connections={[
            { from: 0, to: 1, label: "parse" },
            { from: 1, to: 2, label: "IP" },
            { from: 2, to: 3, label: "HTTP" },
          ]}
          direction="horizontal"
          colors={{ bg: COLORS.bg, text: COLORS.text, accent: COLORS.cyan }}
          fontFamily={FONTS.heading}
        />
      </TransitionSeries.Sequence>

      <TransitionSeries.Transition
        presentation={slide({ direction: "from-right" })}
        timing={linearTiming({ durationInFrames: 20 })}
      />

      {/* Scene 5: Visual Metaphor — humor beat */}
      <TransitionSeries.Sequence durationInFrames={6 * FPS}>
        <VisualMetaphor
          icon="🍽️"
          heading="You're the Customer"
          analogy="Your browser is the waiter. It takes your order, runs to the kitchen (server), and brings back your food (HTML). Tip not required."
          colors={{
            bg: COLORS.bg,
            text: COLORS.text,
            accent: COLORS.amber,
            muted: COLORS.muted,
          }}
          fontFamily={FONTS.heading}
          iconEffect="rotate"
        />
      </TransitionSeries.Sequence>

      <TransitionSeries.Transition
        presentation={fade()}
        timing={linearTiming({ durationInFrames: T })}
      />

      {/* Scene 6: Step Sequence — the request flow */}
      <TransitionSeries.Sequence durationInFrames={8 * FPS}>
        <StepSequence
          heading="Every Click, Same Dance"
          steps={[
            {
              title: "Parse the URL",
              description: "Extract the domain from the address bar",
            },
            {
              title: "Resolve the IP",
              description: "DNS translates the name to a number",
            },
            {
              title: "Send the request",
              description: "Browser asks the server over HTTP",
            },
          ]}
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

      {/* Scene 7: Key Takeaway */}
      <TransitionSeries.Sequence durationInFrames={5 * FPS}>
        <KeyTakeaway
          takeaway="The client (your browser) sends requests. It never stores the real data — it just displays what the server sends back."
          colors={{ bg: COLORS.bg, text: COLORS.text }}
          fontFamily={FONTS.heading}
        />
      </TransitionSeries.Sequence>
    </TransitionSeries>
  );
};
