import React from "react";
import { TransitionSeries, linearTiming } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { slide } from "@remotion/transitions/slide";
import { SectionTitle } from "../../shared/scenes/SectionTitle";
import { ConceptExplain } from "../../shared/scenes/ConceptExplain";
import { StepSequence } from "../../shared/scenes/StepSequence";
import { VisualMetaphor } from "../../shared/scenes/VisualMetaphor";
import { KeyTakeaway } from "../../shared/scenes/KeyTakeaway";
import { FONTS, FPS, T_FADE, T_SLIDE, TOTAL_SECTIONS } from "../styles";

export const Section2: React.FC = () => {
  return (
    <TransitionSeries>
      {/* Scene 8: Section Title */}
      <TransitionSeries.Sequence durationInFrames={3 * FPS}>
        <SectionTitle
          sectionNumber={2}
          title="The Connection"
          subtitle="TCP and the three-way handshake"
          totalSections={TOTAL_SECTIONS}
          fontFamily={FONTS.main}
          entrance="scaleBlur"
        />
      </TransitionSeries.Sequence>

      <TransitionSeries.Transition
        presentation={slide({ direction: "from-right" })}
        timing={linearTiming({ durationInFrames: T_SLIDE })}
      />

      {/* Scene 9: Concept Explain */}
      <TransitionSeries.Sequence durationInFrames={7 * FPS}>
        <ConceptExplain
          heading="Why TCP Matters"
          body="Before any data moves, your browser and the server need to agree they can talk. TCP guarantees that every packet arrives, in order, without corruption."
          analogy="Imagine calling someone. You don't just start talking, you wait for them to pick up first."
          icon="🤝"
          fontFamily={FONTS.main}
          headingEntrance="fadeUp"
        />
      </TransitionSeries.Sequence>

      <TransitionSeries.Transition
        presentation={fade()}
        timing={linearTiming({ durationInFrames: T_FADE })}
      />

      {/* Scene 10: Three-Way Handshake */}
      <TransitionSeries.Sequence durationInFrames={8 * FPS}>
        <StepSequence
          heading="The Three-Way Handshake"
          steps={[
            { title: "SYN", description: "Client says: I want to connect" },
            { title: "SYN-ACK", description: "Server says: Got it, I'm ready" },
            { title: "ACK", description: "Client says: Great, let's go" },
          ]}
          fontFamily={FONTS.main}
        />
      </TransitionSeries.Sequence>

      <TransitionSeries.Transition
        presentation={fade()}
        timing={linearTiming({ durationInFrames: T_FADE })}
      />

      {/* Scene 11: Visual Metaphor */}
      <TransitionSeries.Sequence durationInFrames={6 * FPS}>
        <VisualMetaphor
          icon="📞"
          heading="It's Like a Phone Call"
          analogy="You dial, they pick up and say hello, you confirm you hear them. Three steps before you say a single useful word. TCP works the same way."
          fontFamily={FONTS.main}
          iconEffect="bounce"
        />
      </TransitionSeries.Sequence>

      <TransitionSeries.Transition
        presentation={fade()}
        timing={linearTiming({ durationInFrames: T_FADE })}
      />

      {/* Scene 12: Key Takeaway */}
      <TransitionSeries.Sequence durationInFrames={5 * FPS}>
        <KeyTakeaway
          takeaway="TCP's three-way handshake ensures both sides are ready before any data is sent. It's slower, but nothing gets lost."
          fontFamily={FONTS.main}
        />
      </TransitionSeries.Sequence>
    </TransitionSeries>
  );
};
