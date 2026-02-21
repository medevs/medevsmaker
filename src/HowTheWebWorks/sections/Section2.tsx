import React from "react";
import { TransitionSeries, linearTiming } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { SectionTitle } from "../../shared/scenes/SectionTitle";
import { ConceptExplain } from "../../shared/scenes/ConceptExplain";
import { DiagramFlow } from "../../shared/scenes/DiagramFlow";
import { StatHighlight } from "../../shared/scenes/StatHighlight";
import { VisualMetaphor } from "../../shared/scenes/VisualMetaphor";
import { KeyTakeaway } from "../../shared/scenes/KeyTakeaway";
import { FONTS, COLORS, FPS, T } from "../styles";

export const Section2: React.FC = () => {
  return (
    <TransitionSeries>
      {/* Scene 8: Section Title */}
      <TransitionSeries.Sequence durationInFrames={3 * FPS}>
        <SectionTitle
          sectionNumber={2}
          title="DNS Lookup"
          subtitle="The internet's phone book"
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

      {/* Scene 9: Concept Explain */}
      <TransitionSeries.Sequence durationInFrames={7 * FPS}>
        <ConceptExplain
          heading="Names to Numbers"
          body="You type google.com, but computers only understand numbers. DNS converts that friendly name into an IP address like 142.250.80.46."
          analogy="It's like looking up a contact name in your phone — you know the name, DNS knows the number."
          icon="📖"
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

      {/* Scene 10: Diagram Flow */}
      <TransitionSeries.Sequence durationInFrames={10 * FPS}>
        <DiagramFlow
          title="How DNS Resolution Works"
          nodes={[
            { label: "Browser", sublabel: "Cache check", color: COLORS.cyan },
            { label: "Resolver", sublabel: "ISP lookup", color: COLORS.indigo },
            { label: "Root", sublabel: ".com zone", color: COLORS.violet },
            { label: "TLD", sublabel: "google.com", color: COLORS.amber },
            { label: "Auth", sublabel: "IP found", color: COLORS.green },
          ]}
          connections={[
            { from: 0, to: 1, label: "query" },
            { from: 1, to: 2, label: "ask" },
            { from: 2, to: 3, label: "refer" },
            { from: 3, to: 4, label: "resolve" },
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

      {/* Scene 11: Stat Highlight */}
      <TransitionSeries.Sequence durationInFrames={5 * FPS}>
        <StatHighlight
          stat={1.1}
          suffix=" trillion"
          label="DNS queries per day"
          context="Every link click, every API call, every image load starts with a DNS lookup"
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

      {/* Scene 12: Visual Metaphor */}
      <TransitionSeries.Sequence durationInFrames={6 * FPS}>
        <VisualMetaphor
          icon="📱"
          heading="Cached For Speed"
          analogy="Your browser remembers recent lookups so it doesn't ask DNS every single time. Like saving a frequent contact as a favorite."
          colors={{
            bg: COLORS.bg,
            text: COLORS.text,
            accent: COLORS.green,
            muted: COLORS.muted,
          }}
          fontFamily={FONTS.heading}
        />
      </TransitionSeries.Sequence>

      <TransitionSeries.Transition
        presentation={fade()}
        timing={linearTiming({ durationInFrames: T })}
      />

      {/* Scene 13: Key Takeaway */}
      <TransitionSeries.Sequence durationInFrames={5 * FPS}>
        <KeyTakeaway
          takeaway="DNS translates human-readable domain names into machine-readable IP addresses. Without it, you'd need to memorize numbers."
          colors={{ bg: COLORS.bg, text: COLORS.text }}
          fontFamily={FONTS.heading}
        />
      </TransitionSeries.Sequence>
    </TransitionSeries>
  );
};
