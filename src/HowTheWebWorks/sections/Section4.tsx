import React from "react";
import { TransitionSeries, linearTiming } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { SectionTitle } from "../../shared/scenes/SectionTitle";
import { ConceptExplain } from "../../shared/scenes/ConceptExplain";
import { ComparisonSplit } from "../../shared/scenes/ComparisonSplit";
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
        />
      </TransitionSeries.Sequence>

      <TransitionSeries.Transition
        presentation={fade()}
        timing={linearTiming({ durationInFrames: T })}
      />

      {/* Scene 21: Concept Explain */}
      <TransitionSeries.Sequence durationInFrames={7 * FPS}>
        <ConceptExplain
          heading="Persistent Storage"
          body="The server processes requests but doesn't remember anything between them. The database stores all the permanent data — users, posts, orders."
          analogy="If the server is the kitchen, the database is the pantry. The kitchen pulls ingredients from the pantry for every dish."
          icon="💾"
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

      {/* Scene 22: Comparison Split */}
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
        />
      </TransitionSeries.Sequence>

      <TransitionSeries.Transition
        presentation={fade()}
        timing={linearTiming({ durationInFrames: T })}
      />

      {/* Scene 23: Warning Callout */}
      <TransitionSeries.Sequence durationInFrames={6 * FPS}>
        <WarningCallout
          heading="Never Trust the Client"
          body="Always validate data on the server before writing to the database. Client-side validation can be bypassed — server-side cannot."
          severity="danger"
          colors={{ bg: COLORS.bg, text: COLORS.text }}
          fontFamily={FONTS.heading}
        />
      </TransitionSeries.Sequence>

      <TransitionSeries.Transition
        presentation={fade()}
        timing={linearTiming({ durationInFrames: T })}
      />

      {/* Scene 24: Visual Metaphor */}
      <TransitionSeries.Sequence durationInFrames={6 * FPS}>
        <VisualMetaphor
          icon="🗄️"
          heading="Your App's Memory"
          analogy="Without a database, every time the server restarts, all data disappears. The database is the long-term memory your app depends on."
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
