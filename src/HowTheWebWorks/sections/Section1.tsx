import React from "react";
import { TransitionSeries, linearTiming } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { HookQuestion } from "../../shared/scenes/HookQuestion";
import { TitleIntro } from "../../shared/scenes/TitleIntro";
import { SectionTitle } from "../../shared/scenes/SectionTitle";
import { ConceptExplain } from "../../shared/scenes/ConceptExplain";
import { StepSequence } from "../../shared/scenes/StepSequence";
import { VisualMetaphor } from "../../shared/scenes/VisualMetaphor";
import { KeyTakeaway } from "../../shared/scenes/KeyTakeaway";
import { FONTS, COLORS, FPS, T } from "../styles";

export const Section1: React.FC = () => {
  return (
    <TransitionSeries>
      {/* Scene 1: Hook */}
      <TransitionSeries.Sequence durationInFrames={5 * FPS}>
        <HookQuestion
          question="What actually happens when you click a link?"
          subtext="It's way more complex than you think"
          colors={{ bg: COLORS.bg, text: COLORS.text, accent: COLORS.cyan }}
          fontFamily={FONTS.heading}
        />
      </TransitionSeries.Sequence>

      <TransitionSeries.Transition
        presentation={fade()}
        timing={linearTiming({ durationInFrames: T })}
      />

      {/* Scene 2: Title Intro */}
      <TransitionSeries.Sequence durationInFrames={8 * FPS}>
        <TitleIntro
          title="How the Web Actually Works"
          objectives={[
            "Understand the client-server model",
            "Know how DNS translates URLs",
            "See what happens inside a server",
            "Learn where your data actually lives",
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
        />
      </TransitionSeries.Sequence>

      <TransitionSeries.Transition
        presentation={fade()}
        timing={linearTiming({ durationInFrames: T })}
      />

      {/* Scene 4: Concept Explain */}
      <TransitionSeries.Sequence durationInFrames={8 * FPS}>
        <ConceptExplain
          heading="Your Browser = The Client"
          body="When you type a URL, your browser sends a request to a server somewhere on the internet. It's asking for a specific page."
          analogy="Think of it like ordering food — you tell the waiter what you want, and they bring it from the kitchen."
          icon="🌐"
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

      {/* Scene 5: Step Sequence */}
      <TransitionSeries.Sequence durationInFrames={8 * FPS}>
        <StepSequence
          heading="What Your Browser Does"
          steps={[
            {
              title: "Reads the URL",
              description: "Parses the domain name from the address bar",
            },
            {
              title: "Finds the server",
              description: "Uses DNS to get the server's IP address",
            },
            {
              title: "Sends the request",
              description: "Asks the server for the page over HTTP",
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

      {/* Scene 6: Visual Metaphor */}
      <TransitionSeries.Sequence durationInFrames={6 * FPS}>
        <VisualMetaphor
          icon="🍽️"
          heading="You're the Customer"
          analogy="Every app on your phone is a client. When you scroll Instagram, your phone asks Meta's servers for the next batch of posts."
          colors={{
            bg: COLORS.bg,
            text: COLORS.text,
            accent: COLORS.amber,
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
          takeaway="The client (your browser or app) sends requests. It never stores the real data — it just displays what the server sends back."
          colors={{ bg: COLORS.bg, text: COLORS.text }}
          fontFamily={FONTS.heading}
        />
      </TransitionSeries.Sequence>
    </TransitionSeries>
  );
};
