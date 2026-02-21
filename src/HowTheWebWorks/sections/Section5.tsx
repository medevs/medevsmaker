import React from "react";
import { TransitionSeries, linearTiming } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { slide } from "@remotion/transitions/slide";
import { SectionTitle } from "../../shared/scenes/SectionTitle";
import { DiagramFlow } from "../../shared/scenes/DiagramFlow";
import { BulletRevealScene } from "../../shared/scenes/BulletRevealScene";
import { SummaryRecap } from "../../shared/scenes/SummaryRecap";
import { EndScreen } from "../../shared/scenes/EndScreen";
import { FONTS, COLORS, FPS, T } from "../styles";

export const Section5: React.FC = () => {
  return (
    <TransitionSeries>
      {/* Scene 26: Section Title */}
      <TransitionSeries.Sequence durationInFrames={3 * FPS}>
        <SectionTitle
          sectionNumber={5}
          title="The Full Picture"
          subtitle="All the pieces working together"
          colors={{
            bg: COLORS.bg,
            text: COLORS.text,
            accent: COLORS.violet,
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

      {/* Scene 27: Full Lifecycle Diagram */}
      <TransitionSeries.Sequence durationInFrames={12 * FPS}>
        <DiagramFlow
          title="The Complete Request Lifecycle"
          nodes={[
            { label: "Browser", sublabel: "Click link", color: COLORS.cyan },
            { label: "DNS", sublabel: "Resolve IP", color: COLORS.amber },
            { label: "Server", sublabel: "Process", color: COLORS.indigo },
            { label: "Database", sublabel: "Query data", color: COLORS.green },
            { label: "Response", sublabel: "Send HTML", color: COLORS.violet },
          ]}
          connections={[
            { from: 0, to: 1, label: "URL" },
            { from: 1, to: 2, label: "IP" },
            { from: 2, to: 3, label: "query" },
            { from: 3, to: 4, label: "data" },
          ]}
          direction="horizontal"
          colors={{ bg: COLORS.bg, text: COLORS.text, accent: COLORS.cyan }}
          fontFamily={FONTS.heading}
        />
      </TransitionSeries.Sequence>

      <TransitionSeries.Transition
        presentation={slide({ direction: "from-bottom" })}
        timing={linearTiming({ durationInFrames: 20 })}
      />

      {/* Scene 28: Bullet Reveal */}
      <TransitionSeries.Sequence durationInFrames={8 * FPS}>
        <BulletRevealScene
          heading="What You Now Understand"
          items={[
            "Your browser is always the client",
            "DNS turns names into numbers",
            "Servers process every request",
            "Databases store the real data",
            "It all happens in milliseconds",
          ]}
          bulletStyle="check"
          colors={{
            bg: COLORS.bg,
            text: COLORS.text,
            accent: COLORS.green,
          }}
          fontFamily={FONTS.heading}
        />
      </TransitionSeries.Sequence>

      <TransitionSeries.Transition
        presentation={fade()}
        timing={linearTiming({ durationInFrames: T })}
      />

      {/* Scene 29: Summary Recap — scale entrance */}
      <TransitionSeries.Sequence durationInFrames={10 * FPS}>
        <SummaryRecap
          heading="Quick Recap"
          items={[
            "The client (browser) sends requests",
            "DNS translates URLs to IP addresses",
            "The server processes and responds",
            "The database stores persistent data",
            "This cycle repeats for every page load",
          ]}
          colors={{
            bg: COLORS.bg,
            text: COLORS.text,
            accent: COLORS.indigo,
            muted: COLORS.muted,
          }}
          fontFamily={FONTS.heading}
          itemEntrance="scale"
        />
      </TransitionSeries.Sequence>

      <TransitionSeries.Transition
        presentation={fade()}
        timing={linearTiming({ durationInFrames: T })}
      />

      {/* Scene 30: End Screen (replaces basic Outro) */}
      <TransitionSeries.Sequence durationInFrames={5 * FPS}>
        <EndScreen
          channel="medevsmaker"
          cta="Subscribe for more"
          tagline="Tech explained for builders"
          colors={{
            bg: COLORS.bg,
            text: COLORS.text,
            accent: COLORS.indigo,
            muted: COLORS.muted,
          }}
          fontFamily={FONTS.heading}
        />
      </TransitionSeries.Sequence>
    </TransitionSeries>
  );
};
