import React from "react";
import { TransitionSeries, linearTiming } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { slide } from "@remotion/transitions/slide";
import { HookQuestion } from "../../shared/scenes/HookQuestion";
import { TitleIntro } from "../../shared/scenes/TitleIntro";
import { SectionTitle } from "../../shared/scenes/SectionTitle";
import { ConceptExplain } from "../../shared/scenes/ConceptExplain";
import { DiagramFlow } from "../../shared/scenes/DiagramFlow";
import { VisualMetaphor } from "../../shared/scenes/VisualMetaphor";
import { KeyTakeaway } from "../../shared/scenes/KeyTakeaway";
import { FONTS, COLORS, FPS, T_FADE, T_SLIDE, TOTAL_SECTIONS } from "../styles";

export const Section1: React.FC = () => {
  return (
    <TransitionSeries>
      {/* Scene 1: Hook */}
      <TransitionSeries.Sequence durationInFrames={5 * FPS}>
        <HookQuestion
          question="What happens when you click a link?"
          subtext="The answer involves more steps than you think"
          fontFamily={FONTS.main}
          entrance="blur"
        />
      </TransitionSeries.Sequence>

      <TransitionSeries.Transition
        presentation={fade()}
        timing={linearTiming({ durationInFrames: T_FADE })}
      />

      {/* Scene 2: Title Intro */}
      <TransitionSeries.Sequence durationInFrames={8 * FPS}>
        <TitleIntro
          title="How the Web Works"
          objectives={[
            "Understand DNS and IP addresses",
            "Know the TCP handshake",
            "See a full HTTP request cycle",
            "Watch the browser render a page",
          ]}
          fontFamily={FONTS.main}
          entrance="splitReveal"
        />
      </TransitionSeries.Sequence>

      <TransitionSeries.Transition
        presentation={fade()}
        timing={linearTiming({ durationInFrames: T_FADE })}
      />

      {/* Scene 3: Section Title */}
      <TransitionSeries.Sequence durationInFrames={3 * FPS}>
        <SectionTitle
          sectionNumber={1}
          title="DNS Resolution"
          subtitle="The internet's phone book"
          totalSections={TOTAL_SECTIONS}
          fontFamily={FONTS.main}
          entrance="slideLeft"
        />
      </TransitionSeries.Sequence>

      <TransitionSeries.Transition
        presentation={slide({ direction: "from-right" })}
        timing={linearTiming({ durationInFrames: T_SLIDE })}
      />

      {/* Scene 4: Concept Explain */}
      <TransitionSeries.Sequence durationInFrames={7 * FPS}>
        <ConceptExplain
          heading="Domains Are for Humans"
          body="Computers use IP addresses like 142.250.80.46 to find each other. DNS translates the domain name you type into the IP address the network needs."
          analogy="It's like looking up a contact name in your phone to find their number."
          icon="🌐"
          fontFamily={FONTS.main}
          headingEntrance="fadeLeft"
        />
      </TransitionSeries.Sequence>

      <TransitionSeries.Transition
        presentation={fade()}
        timing={linearTiming({ durationInFrames: T_FADE })}
      />

      {/* Scene 5: DNS Lookup Diagram */}
      <TransitionSeries.Sequence durationInFrames={10 * FPS}>
        <DiagramFlow
          title="The DNS Lookup Chain"
          nodes={[
            { label: "Browser", sublabel: "Cache", color: COLORS.cyan },
            { label: "OS", sublabel: "Cache", color: COLORS.amber },
            { label: "Router", sublabel: "Cache", color: COLORS.violet },
            { label: "ISP DNS", sublabel: "Resolver", color: COLORS.indigo },
            { label: "Root", sublabel: "Server", color: COLORS.green },
          ]}
          connections={[
            { from: 0, to: 1, label: "miss" },
            { from: 1, to: 2, label: "miss" },
            { from: 2, to: 3, label: "miss" },
            { from: 3, to: 4, label: "query" },
          ]}
          direction="horizontal"
          fontFamily={FONTS.main}
        />
      </TransitionSeries.Sequence>

      <TransitionSeries.Transition
        presentation={fade()}
        timing={linearTiming({ durationInFrames: T_FADE })}
      />

      {/* Scene 6: Visual Metaphor */}
      <TransitionSeries.Sequence durationInFrames={6 * FPS}>
        <VisualMetaphor
          icon="📖"
          heading="The Internet's Phone Book"
          analogy="DNS is a massive, distributed phone book. You give it a name, it gives you the number. And just like a phone book, it gets cached so you don't look up the same name twice."
          fontFamily={FONTS.main}
          iconEffect="pop"
        />
      </TransitionSeries.Sequence>

      <TransitionSeries.Transition
        presentation={fade()}
        timing={linearTiming({ durationInFrames: T_FADE })}
      />

      {/* Scene 7: Key Takeaway */}
      <TransitionSeries.Sequence durationInFrames={5 * FPS}>
        <KeyTakeaway
          takeaway="DNS converts human-readable domain names into machine-readable IP addresses. Every web request starts here."
          fontFamily={FONTS.main}
        />
      </TransitionSeries.Sequence>
    </TransitionSeries>
  );
};
