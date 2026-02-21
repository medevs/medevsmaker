import React from "react";
import { TransitionSeries, linearTiming } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { slide } from "@remotion/transitions/slide";
import { wipe } from "@remotion/transitions/wipe";
import { SectionTitle } from "../../shared/scenes/SectionTitle";
import { DiagramFlow } from "../../shared/scenes/DiagramFlow";
import { StatHighlight } from "../../shared/scenes/StatHighlight";
import { VisualMetaphor } from "../../shared/scenes/VisualMetaphor";
import { TimelineScene } from "../../shared/scenes/TimelineScene";
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
          entrance="scaleBlur"
        />
      </TransitionSeries.Sequence>

      <TransitionSeries.Transition
        presentation={fade()}
        timing={linearTiming({ durationInFrames: T })}
      />

      {/* Scene 9: VisualMetaphor — humor beat: phone book analogy */}
      <TransitionSeries.Sequence durationInFrames={6 * FPS}>
        <VisualMetaphor
          icon="📖"
          heading="Names to Numbers"
          analogy="You type google.com but computers only speak numbers. DNS is your browser frantically flipping through a phone book at light speed."
          colors={{
            bg: COLORS.bg,
            text: COLORS.text,
            accent: COLORS.amber,
            muted: COLORS.muted,
          }}
          fontFamily={FONTS.heading}
          iconEffect="pop"
        />
      </TransitionSeries.Sequence>

      <TransitionSeries.Transition
        presentation={slide({ direction: "from-right" })}
        timing={linearTiming({ durationInFrames: 20 })}
      />

      {/* Scene 10: Diagram Flow — DNS resolution chain */}
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
        presentation={wipe({ direction: "from-left" })}
        timing={linearTiming({ durationInFrames: 18 })}
      />

      {/* Scene 11: Stat Highlight — glow emphasis, pattern interrupt */}
      <TransitionSeries.Sequence durationInFrames={5 * FPS}>
        <StatHighlight
          stat={1.1}
          suffix=" trillion"
          label="DNS queries per day"
          context="Every click, every API call, every image — starts with a DNS lookup"
          colors={{
            bg: COLORS.bg,
            text: COLORS.text,
            accent: COLORS.amber,
            muted: COLORS.muted,
          }}
          fontFamily={FONTS.heading}
          emphasis="glow"
        />
      </TransitionSeries.Sequence>

      <TransitionSeries.Transition
        presentation={fade()}
        timing={linearTiming({ durationInFrames: T })}
      />

      {/* Scene 12: Timeline — DNS caching layers */}
      <TransitionSeries.Sequence durationInFrames={10 * FPS}>
        <TimelineScene
          heading="DNS Caching Layers"
          nodes={[
            { label: "Browser", description: "Checks local cache first" },
            { label: "OS", description: "System-level DNS cache" },
            { label: "Router", description: "Your home network cache" },
            { label: "ISP", description: "Your provider's resolver" },
            { label: "Root", description: "Last resort — full lookup" },
          ]}
          colors={{
            bg: COLORS.bg,
            text: COLORS.text,
            accent: COLORS.amber,
            muted: COLORS.muted,
          }}
          fontFamily={FONTS.heading}
          layout="horizontal"
        />
      </TransitionSeries.Sequence>

      <TransitionSeries.Transition
        presentation={fade()}
        timing={linearTiming({ durationInFrames: T })}
      />

      {/* Scene 13: Key Takeaway */}
      <TransitionSeries.Sequence durationInFrames={5 * FPS}>
        <KeyTakeaway
          takeaway="DNS translates domain names into IP addresses. Multiple cache layers make it blazing fast — most lookups never reach the root."
          colors={{ bg: COLORS.bg, text: COLORS.text }}
          fontFamily={FONTS.heading}
        />
      </TransitionSeries.Sequence>
    </TransitionSeries>
  );
};
