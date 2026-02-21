import React from "react";
import { TransitionSeries, linearTiming } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { slide } from "@remotion/transitions/slide";
import { wipe } from "@remotion/transitions/wipe";
import { SectionTitle } from "../../shared/scenes/SectionTitle";
import { ComparisonSplit } from "../../shared/scenes/ComparisonSplit";
import { BeforeAfter } from "../../shared/scenes/BeforeAfter";
import { WarningCallout } from "../../shared/scenes/WarningCallout";
import { VisualMetaphor } from "../../shared/scenes/VisualMetaphor";
import { KeyTakeaway } from "../../shared/scenes/KeyTakeaway";
import { FONTS, COLORS, FPS, T } from "../styles";

export const Section4: React.FC = () => {
  return (
    <TransitionSeries>
      {/* Scene 20: Section Title */}
      <TransitionSeries.Sequence durationInFrames={3 * FPS}>
        <SectionTitle
          sectionNumber={4}
          title="The Database"
          subtitle="Where your data actually lives"
          colors={{
            bg: COLORS.bg,
            text: COLORS.text,
            accent: COLORS.green,
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

      {/* Scene 21: BeforeAfter — with vs without database (visual) */}
      <TransitionSeries.Sequence durationInFrames={10 * FPS}>
        <BeforeAfter
          heading="With vs Without a Database"
          before={{
            title: "No Database",
            items: [
              "Data lost on restart",
              "No user accounts",
              "Everything temporary",
              "Basically a calculator",
            ],
          }}
          after={{
            title: "With Database",
            items: [
              "Data persists forever",
              "Users, posts, orders saved",
              "Survives crashes",
              "Actual useful app",
            ],
          }}
          colors={{
            bg: COLORS.bg,
            text: COLORS.text,
            beforeColor: COLORS.red,
            afterColor: COLORS.green,
            muted: COLORS.muted,
          }}
          fontFamily={FONTS.heading}
          reveal="wipe"
        />
      </TransitionSeries.Sequence>

      <TransitionSeries.Transition
        presentation={wipe({ direction: "from-left" })}
        timing={linearTiming({ durationInFrames: 18 })}
      />

      {/* Scene 22: Comparison Split — SQL vs NoSQL (visual) */}
      <TransitionSeries.Sequence durationInFrames={8 * FPS}>
        <ComparisonSplit
          heading="SQL vs NoSQL"
          left={{
            title: "SQL",
            items: [
              "Structured tables",
              "Fixed schema",
              "Great for relations",
              "PostgreSQL, MySQL",
            ],
            color: COLORS.cyan,
          }}
          right={{
            title: "NoSQL",
            items: [
              "Flexible documents",
              "Schema-free",
              "Great for scale",
              "MongoDB, Firebase",
            ],
            color: COLORS.violet,
          }}
          colors={{ bg: COLORS.bg, text: COLORS.text, muted: COLORS.muted }}
          fontFamily={FONTS.heading}
          entranceStyle="overshoot"
        />
      </TransitionSeries.Sequence>

      <TransitionSeries.Transition
        presentation={fade()}
        timing={linearTiming({ durationInFrames: T })}
      />

      {/* Scene 23: Visual Metaphor — humor beat */}
      <TransitionSeries.Sequence durationInFrames={6 * FPS}>
        <VisualMetaphor
          icon="🗄️"
          heading="Your App's Memory"
          analogy="Without a database, your app has amnesia. Every restart it forgets everything. Your users cry. Your boss sends a Slack."
          colors={{
            bg: COLORS.bg,
            text: COLORS.text,
            accent: COLORS.green,
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

      {/* Scene 24: Warning Callout — pattern interrupt */}
      <TransitionSeries.Sequence durationInFrames={6 * FPS}>
        <WarningCallout
          heading="Never Trust the Client"
          body="Always validate data on the server before writing to the database. Client-side validation can be bypassed in 5 seconds flat."
          severity="danger"
          colors={{ bg: COLORS.bg, text: COLORS.text }}
          fontFamily={FONTS.heading}
        />
      </TransitionSeries.Sequence>

      <TransitionSeries.Transition
        presentation={fade()}
        timing={linearTiming({ durationInFrames: T })}
      />

      {/* Scene 25: Key Takeaway */}
      <TransitionSeries.Sequence durationInFrames={5 * FPS}>
        <KeyTakeaway
          takeaway="Databases store the permanent data. The server reads from and writes to the database on every request that needs data."
          colors={{ bg: COLORS.bg, text: COLORS.text }}
          fontFamily={FONTS.heading}
        />
      </TransitionSeries.Sequence>
    </TransitionSeries>
  );
};
