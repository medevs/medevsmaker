/**
 * REFERENCE EXAMPLE: Educational video composition
 *
 * Demonstrates the section-based architecture for long-form educational videos.
 * This is a shortened version of "How the Web Actually Works" (~3 min).
 *
 * Structure:
 *   Section 1 (Intro): Hook → TitleIntro → SectionTitle → ConceptExplain → VisualMetaphor → KeyTakeaway
 *   Section 2 (The Server): SectionTitle → ConceptExplain → DiagramFlow → CodeDisplay → KeyTakeaway
 *   Section 3 (The Database): SectionTitle → ConceptExplain → ComparisonSplit → StatHighlight → WarningCallout → KeyTakeaway
 *   Section 4 (Wrap-up): SummaryRecap → Outro
 *
 *   Total: ~17 scenes across 4 sections
 *
 * Key patterns demonstrated:
 *   - <Series> for chaining sections
 *   - <TransitionSeries> within each section for scene transitions
 *   - Shared scene components imported from src/shared/scenes/
 *   - ProgressBar overlay on each section
 *   - Duration calculation per section and total
 */

import React from "react";
import {
  AbsoluteFill,
  Composition,
  Series,
  useVideoConfig,
} from "remotion";
import { TransitionSeries, linearTiming } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { loadFont } from "@remotion/google-fonts/Inter";

// ─── Shared Scene Imports ───────────────────────────────────────
// In a real video, these import from "../../shared/scenes/XYZ"
// Here they're shown as imports for reference.
import { HookQuestion } from "../../src/shared/scenes/HookQuestion";
import { TitleIntro } from "../../src/shared/scenes/TitleIntro";
import { SectionTitle } from "../../src/shared/scenes/SectionTitle";
import { ConceptExplain } from "../../src/shared/scenes/ConceptExplain";
import { DiagramFlow } from "../../src/shared/scenes/DiagramFlow";
import { CodeDisplay } from "../../src/shared/scenes/CodeDisplay";
import { ComparisonSplit } from "../../src/shared/scenes/ComparisonSplit";
import { StatHighlight } from "../../src/shared/scenes/StatHighlight";
import { VisualMetaphor } from "../../src/shared/scenes/VisualMetaphor";
import { KeyTakeaway } from "../../src/shared/scenes/KeyTakeaway";
import { WarningCallout } from "../../src/shared/scenes/WarningCallout";
import { SummaryRecap } from "../../src/shared/scenes/SummaryRecap";
import { Outro } from "../../src/shared/scenes/Outro";
import { ProgressBar } from "../../src/shared/components/ProgressBar";
import { Background } from "../../src/shared/components/Background";

// ─── Design Tokens ──────────────────────────────────────────────

const { fontFamily: mainFont } = loadFont("normal", {
  weights: ["400", "700", "800"],
  subsets: ["latin"],
});

const COLORS = {
  bg: "#0f0f1a",
  bgLight: "#1a1a2e",
  text: "#f8fafc",
  muted: "#94a3b8",
  indigo: "#6366f1",
  violet: "#8b5cf6",
  cyan: "#06b6d4",
  amber: "#f59e0b",
  green: "#10b981",
  red: "#ef4444",
};

const FPS = 30;
const T = 15; // transition frames

// ─── Section 1: Introduction (Hook + Title + "The Client") ──────

// Scene durations in seconds
const S1_HOOK = 4;
const S1_TITLE = 7;
const S1_SECTION_TITLE = 3;
const S1_CONCEPT = 7;
const S1_METAPHOR = 6;
const S1_TAKEAWAY = 5;

// Section 1 total frames = sum(durations) * FPS - numTransitions * T
// = (4+7+3+7+6+5)*30 - 5*15 = 960 - 75 = 885
const SECTION_1_FRAMES = (S1_HOOK + S1_TITLE + S1_SECTION_TITLE + S1_CONCEPT + S1_METAPHOR + S1_TAKEAWAY) * FPS - 5 * T;

const Section1: React.FC = () => {
  return (
    <TransitionSeries>
      {/* Scene 1: Hook */}
      <TransitionSeries.Sequence durationInFrames={S1_HOOK * FPS}>
        <HookQuestion
          question="What actually happens when you click a link?"
          subtext="It's way more complex than you think"
          fontFamily={mainFont}
        />
      </TransitionSeries.Sequence>

      <TransitionSeries.Transition
        presentation={fade()}
        timing={linearTiming({ durationInFrames: T })}
      />

      {/* Scene 2: Title Intro */}
      <TransitionSeries.Sequence durationInFrames={S1_TITLE * FPS}>
        <TitleIntro
          title="How the Web Actually Works"
          objectives={[
            "Understand the client-server model",
            "Know what happens in an HTTP request",
            "See how databases fit in",
          ]}
          fontFamily={mainFont}
        />
      </TransitionSeries.Sequence>

      <TransitionSeries.Transition
        presentation={fade()}
        timing={linearTiming({ durationInFrames: T })}
      />

      {/* Scene 3: Section Title */}
      <TransitionSeries.Sequence durationInFrames={S1_SECTION_TITLE * FPS}>
        <SectionTitle
          sectionNumber={1}
          title="The Client"
          subtitle="Your browser is smarter than you think"
          fontFamily={mainFont}
        />
      </TransitionSeries.Sequence>

      <TransitionSeries.Transition
        presentation={fade()}
        timing={linearTiming({ durationInFrames: T })}
      />

      {/* Scene 4: Concept Explain */}
      <TransitionSeries.Sequence durationInFrames={S1_CONCEPT * FPS}>
        <ConceptExplain
          heading="Your Browser = The Client"
          body="When you type a URL, your browser sends a request to a server somewhere on the internet. It's asking for a specific page."
          analogy="Think of it like ordering food — you tell the waiter what you want, and they bring it from the kitchen."
          icon="🌐"
          fontFamily={mainFont}
        />
      </TransitionSeries.Sequence>

      <TransitionSeries.Transition
        presentation={fade()}
        timing={linearTiming({ durationInFrames: T })}
      />

      {/* Scene 5: Visual Metaphor */}
      <TransitionSeries.Sequence durationInFrames={S1_METAPHOR * FPS}>
        <VisualMetaphor
          icon="📱"
          heading="You're Always the Client"
          analogy="Every app on your phone is a client. When you scroll Instagram, your phone asks Meta's servers for the next batch of posts."
          fontFamily={mainFont}
        />
      </TransitionSeries.Sequence>

      <TransitionSeries.Transition
        presentation={fade()}
        timing={linearTiming({ durationInFrames: T })}
      />

      {/* Scene 6: Key Takeaway */}
      <TransitionSeries.Sequence durationInFrames={S1_TAKEAWAY * FPS}>
        <KeyTakeaway
          takeaway="The client (your browser or app) sends requests. It never stores the real data — it just displays what the server sends back."
          fontFamily={mainFont}
        />
      </TransitionSeries.Sequence>
    </TransitionSeries>
  );
};

// ─── Section 2: The Server ──────────────────────────────────────

const S2_SECTION_TITLE = 3;
const S2_CONCEPT = 7;
const S2_DIAGRAM = 10;
const S2_CODE = 10;
const S2_TAKEAWAY = 5;

// = (3+7+10+10+5)*30 - 4*15 = 1050 - 60 = 990
const SECTION_2_FRAMES = (S2_SECTION_TITLE + S2_CONCEPT + S2_DIAGRAM + S2_CODE + S2_TAKEAWAY) * FPS - 4 * T;

const Section2: React.FC = () => {
  return (
    <TransitionSeries>
      {/* Scene 7: Section Title */}
      <TransitionSeries.Sequence durationInFrames={S2_SECTION_TITLE * FPS}>
        <SectionTitle
          sectionNumber={2}
          title="The Server"
          subtitle="Where the magic actually happens"
          fontFamily={mainFont}
        />
      </TransitionSeries.Sequence>

      <TransitionSeries.Transition
        presentation={fade()}
        timing={linearTiming({ durationInFrames: T })}
      />

      {/* Scene 8: Concept */}
      <TransitionSeries.Sequence durationInFrames={S2_CONCEPT * FPS}>
        <ConceptExplain
          heading="Servers Are Just Computers"
          body="A server is a computer that's always on, always connected, and waiting for requests. When one arrives, it processes it and sends back a response."
          analogy="It's the kitchen in our restaurant analogy — always ready to cook whatever's ordered."
          icon="🖥️"
          fontFamily={mainFont}
        />
      </TransitionSeries.Sequence>

      <TransitionSeries.Transition
        presentation={fade()}
        timing={linearTiming({ durationInFrames: T })}
      />

      {/* Scene 9: Diagram Flow */}
      <TransitionSeries.Sequence durationInFrames={S2_DIAGRAM * FPS}>
        <DiagramFlow
          title="The Request-Response Cycle"
          nodes={[
            { label: "Browser", sublabel: "Client", color: COLORS.cyan },
            { label: "DNS", sublabel: "Lookup", color: COLORS.amber },
            { label: "Server", sublabel: "Process", color: COLORS.indigo },
            { label: "Browser", sublabel: "Render", color: COLORS.green },
          ]}
          connections={[
            { from: 0, to: 1, label: "URL" },
            { from: 1, to: 2, label: "IP" },
            { from: 2, to: 3, label: "HTML" },
          ]}
          direction="horizontal"
          fontFamily={mainFont}
        />
      </TransitionSeries.Sequence>

      <TransitionSeries.Transition
        presentation={fade()}
        timing={linearTiming({ durationInFrames: T })}
      />

      {/* Scene 10: Code Display */}
      <TransitionSeries.Sequence durationInFrames={S2_CODE * FPS}>
        <CodeDisplay
          title="A Simple HTTP Response"
          code={`HTTP/1.1 200 OK
Content-Type: text/html

<html>
  <body>Hello World</body>
</html>`}
          annotations={[
            { line: 1, text: "Status code — 200 means success" },
            { line: 2, text: "Tells the browser it's HTML" },
            { line: 5, text: "The actual content you see" },
          ]}
          fontFamily={mainFont}
        />
      </TransitionSeries.Sequence>

      <TransitionSeries.Transition
        presentation={fade()}
        timing={linearTiming({ durationInFrames: T })}
      />

      {/* Scene 11: Key Takeaway */}
      <TransitionSeries.Sequence durationInFrames={S2_TAKEAWAY * FPS}>
        <KeyTakeaway
          takeaway="The server receives requests, processes them, and sends back responses. Every website you visit follows this exact pattern."
          fontFamily={mainFont}
        />
      </TransitionSeries.Sequence>
    </TransitionSeries>
  );
};

// ─── Section 3: The Database ────────────────────────────────────

const S3_SECTION_TITLE = 3;
const S3_CONCEPT = 7;
const S3_COMPARISON = 8;
const S3_STAT = 5;
const S3_WARNING = 6;
const S3_TAKEAWAY = 5;

// = (3+7+8+5+6+5)*30 - 5*15 = 1020 - 75 = 945
const SECTION_3_FRAMES = (S3_SECTION_TITLE + S3_CONCEPT + S3_COMPARISON + S3_STAT + S3_WARNING + S3_TAKEAWAY) * FPS - 5 * T;

const Section3: React.FC = () => {
  return (
    <TransitionSeries>
      {/* Scene 12: Section Title */}
      <TransitionSeries.Sequence durationInFrames={S3_SECTION_TITLE * FPS}>
        <SectionTitle
          sectionNumber={3}
          title="The Database"
          subtitle="Where your data actually lives"
          fontFamily={mainFont}
        />
      </TransitionSeries.Sequence>

      <TransitionSeries.Transition
        presentation={fade()}
        timing={linearTiming({ durationInFrames: T })}
      />

      {/* Scene 13: Concept */}
      <TransitionSeries.Sequence durationInFrames={S3_CONCEPT * FPS}>
        <ConceptExplain
          heading="Persistent Storage"
          body="The server processes requests, but it doesn't remember anything between them. The database stores all the permanent data — users, posts, orders."
          analogy="If the server is the kitchen, the database is the pantry. The kitchen uses ingredients from the pantry to make each dish."
          icon="💾"
          fontFamily={mainFont}
        />
      </TransitionSeries.Sequence>

      <TransitionSeries.Transition
        presentation={fade()}
        timing={linearTiming({ durationInFrames: T })}
      />

      {/* Scene 14: Comparison */}
      <TransitionSeries.Sequence durationInFrames={S3_COMPARISON * FPS}>
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
          fontFamily={mainFont}
        />
      </TransitionSeries.Sequence>

      <TransitionSeries.Transition
        presentation={fade()}
        timing={linearTiming({ durationInFrames: T })}
      />

      {/* Scene 15: Stat */}
      <TransitionSeries.Sequence durationInFrames={S3_STAT * FPS}>
        <StatHighlight
          stat={90}
          suffix="%"
          label="of web apps use a database"
          context="Even static-looking sites often pull content from a database behind the scenes"
          fontFamily={mainFont}
        />
      </TransitionSeries.Sequence>

      <TransitionSeries.Transition
        presentation={fade()}
        timing={linearTiming({ durationInFrames: T })}
      />

      {/* Scene 16: Warning */}
      <TransitionSeries.Sequence durationInFrames={S3_WARNING * FPS}>
        <WarningCallout
          heading="Never Trust the Client"
          body="Always validate data on the server before writing to the database. Client-side validation can be bypassed — server-side validation cannot."
          severity="danger"
          fontFamily={mainFont}
        />
      </TransitionSeries.Sequence>

      <TransitionSeries.Transition
        presentation={fade()}
        timing={linearTiming({ durationInFrames: T })}
      />

      {/* Scene 17: Takeaway */}
      <TransitionSeries.Sequence durationInFrames={S3_TAKEAWAY * FPS}>
        <KeyTakeaway
          takeaway="Databases store the permanent data. The server reads from and writes to the database on every request that needs data."
          fontFamily={mainFont}
        />
      </TransitionSeries.Sequence>
    </TransitionSeries>
  );
};

// ─── Section 4: Wrap-up ─────────────────────────────────────────

const S4_SUMMARY = 10;
const S4_OUTRO = 5;

// = (10+5)*30 - 1*15 = 450 - 15 = 435
const SECTION_4_FRAMES = (S4_SUMMARY + S4_OUTRO) * FPS - 1 * T;

const Section4: React.FC = () => {
  return (
    <TransitionSeries>
      {/* Scene 18: Summary Recap */}
      <TransitionSeries.Sequence durationInFrames={S4_SUMMARY * FPS}>
        <SummaryRecap
          items={[
            "The client (browser) sends requests",
            "DNS translates URLs to IP addresses",
            "The server processes and responds",
            "The database stores persistent data",
            "Always validate on the server side",
          ]}
          fontFamily={mainFont}
        />
      </TransitionSeries.Sequence>

      <TransitionSeries.Transition
        presentation={fade()}
        timing={linearTiming({ durationInFrames: T })}
      />

      {/* Scene 19: Outro */}
      <TransitionSeries.Sequence durationInFrames={S4_OUTRO * FPS}>
        <Outro
          channel="medevsmaker"
          cta="Subscribe for more"
          tagline="AI tools for builders"
          fontFamily={mainFont}
        />
      </TransitionSeries.Sequence>
    </TransitionSeries>
  );
};

// ─── Main Composition ───────────────────────────────────────────

const TOTAL_SECTIONS = 4;

export const HowTheWebWorks: React.FC = () => {
  return (
    <AbsoluteFill>
      <Background colors={[COLORS.bg, COLORS.bgLight]} />
      <Series>
        <Series.Sequence durationInFrames={SECTION_1_FRAMES}>
          <Section1 />
          <ProgressBar totalSections={TOTAL_SECTIONS} currentSection={1} />
        </Series.Sequence>
        <Series.Sequence durationInFrames={SECTION_2_FRAMES}>
          <Section2 />
          <ProgressBar totalSections={TOTAL_SECTIONS} currentSection={2} />
        </Series.Sequence>
        <Series.Sequence durationInFrames={SECTION_3_FRAMES}>
          <Section3 />
          <ProgressBar totalSections={TOTAL_SECTIONS} currentSection={3} />
        </Series.Sequence>
        <Series.Sequence durationInFrames={SECTION_4_FRAMES}>
          <Section4 />
          <ProgressBar totalSections={TOTAL_SECTIONS} currentSection={4} />
        </Series.Sequence>
      </Series>
    </AbsoluteFill>
  );
};

// ─── Composition Registration (for Root.tsx) ─────────────────────
//
// Total frames = 885 + 990 + 945 + 435 = 3255 frames = 108.5s ≈ 1:49
//
// <Composition
//   id="HowTheWebWorks"
//   component={HowTheWebWorks}
//   durationInFrames={3255}
//   fps={30}
//   width={1920}
//   height={1080}
// />
