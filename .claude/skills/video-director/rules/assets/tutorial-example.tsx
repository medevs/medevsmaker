/**
 * REFERENCE EXAMPLE: Tutorial video composition
 *
 * Demonstrates the correct patterns for a step-by-step tutorial video.
 * Uses numbered steps with section markers and a consistent layout.
 *
 * Structure:
 *   - IntroScene (5s) → slide → Step1 (8s) → slide → Step2 (8s)
 *     → slide → Step3 (8s) → slide → RecapScene (5s)
 */

import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { TransitionSeries, linearTiming } from "@remotion/transitions";
import { slide } from "@remotion/transitions/slide";
import { loadFont as loadHeading } from "@remotion/google-fonts/Inter";
import { loadFont as loadCode } from "@remotion/google-fonts/JetBrainsMono";

// ─── Design Tokens ───────────────────────────────────────────────
const { fontFamily: mainFont } = loadHeading("normal", {
  weights: ["400", "600", "700"],
  subsets: ["latin"],
});
const { fontFamily: codeFont } = loadCode("normal", {
  weights: ["400"],
  subsets: ["latin"],
});

const COLORS = {
  primary: "#3b82f6",
  secondary: "#1e293b",
  accent: "#22d3ee",
  bg: "#0a0a0f",
  text: "#e2e8f0",
  muted: "#94a3b8",
  codeBg: "#1e1e2e",
};

// ─── Grid Background ─────────────────────────────────────────────
const GridBackground: React.FC = () => (
  <AbsoluteFill>
    <AbsoluteFill style={{ backgroundColor: COLORS.bg }} />
    <AbsoluteFill
      style={{
        backgroundImage: `
          linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
          linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)
        `,
        backgroundSize: "60px 60px",
      }}
    />
  </AbsoluteFill>
);

// ─── Step Badge ──────────────────────────────────────────────────
const StepBadge: React.FC<{ step: number; frame: number; fps: number }> = ({
  step,
  frame,
  fps,
}) => {
  const progress = spring({
    frame,
    fps,
    config: { damping: 20, stiffness: 200 },
  });
  const scale = interpolate(progress, [0, 1], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <div
      style={{
        transform: `scale(${scale})`,
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        width: 48,
        height: 48,
        borderRadius: 12,
        backgroundColor: COLORS.primary,
        fontFamily: mainFont,
        fontSize: 24,
        fontWeight: 700,
        color: "#ffffff",
      }}
    >
      {step}
    </div>
  );
};

// ─── Code Block ──────────────────────────────────────────────────
const CodeBlock: React.FC<{
  code: string;
  frame: number;
  fps: number;
}> = ({ code, frame, fps }) => {
  const progress = spring({
    frame: frame - 15,
    fps,
    config: { damping: 200 },
  });
  const opacity = interpolate(progress, [0, 1], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const y = interpolate(progress, [0, 1], [20, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Typewriter: reveal characters over time
  const charsToShow = Math.floor(
    interpolate(frame, [20, 20 + code.length * 1.5], [0, code.length], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    })
  );

  return (
    <div
      style={{
        opacity,
        transform: `translateY(${y}px)`,
        backgroundColor: COLORS.codeBg,
        borderRadius: 16,
        padding: "32px 40px",
        border: `1px solid ${COLORS.primary}33`,
      }}
    >
      <pre
        style={{
          fontFamily: codeFont,
          fontSize: 22,
          color: COLORS.accent,
          margin: 0,
          lineHeight: 1.6,
          whiteSpace: "pre-wrap",
        }}
      >
        {code.slice(0, charsToShow)}
      </pre>
    </div>
  );
};

// ─── Intro Scene ─────────────────────────────────────────────────
const IntroScene: React.FC<{ title: string; subtitle: string }> = ({
  title,
  subtitle,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleP = spring({ frame, fps, config: { damping: 200 } });
  const titleOpacity = interpolate(titleP, [0, 1], [0, 1]);
  const titleY = interpolate(titleP, [0, 1], [40, 0]);

  const subP = spring({ frame: frame - 12, fps, config: { damping: 200 } });
  const subOpacity = interpolate(subP, [0, 1], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{ justifyContent: "center", alignItems: "center", padding: 80 }}
    >
      <div style={{ textAlign: "center" }}>
        <div
          style={{
            opacity: titleOpacity,
            transform: `translateY(${titleY}px)`,
            fontFamily: mainFont,
            fontSize: 68,
            fontWeight: 700,
            color: COLORS.text,
            marginBottom: 20,
          }}
        >
          {title}
        </div>
        <div
          style={{
            opacity: subOpacity,
            fontFamily: mainFont,
            fontSize: 28,
            color: COLORS.muted,
          }}
        >
          {subtitle}
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ─── Step Scene ──────────────────────────────────────────────────
const StepScene: React.FC<{
  step: number;
  title: string;
  description: string;
  code: string;
}> = ({ step, title, description, code }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleP = spring({ frame: frame - 8, fps, config: { damping: 200 } });
  const titleOpacity = interpolate(titleP, [0, 1], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const titleX = interpolate(titleP, [0, 1], [-30, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ padding: 80, gap: 24 }}>
      {/* Top: Step badge + title */}
      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
        <StepBadge step={step} frame={frame} fps={fps} />
        <div
          style={{
            opacity: titleOpacity,
            transform: `translateX(${titleX}px)`,
            fontFamily: mainFont,
            fontSize: 48,
            fontWeight: 700,
            color: COLORS.text,
          }}
        >
          {title}
        </div>
      </div>

      {/* Description */}
      <div
        style={{
          opacity: titleOpacity,
          fontFamily: mainFont,
          fontSize: 26,
          color: COLORS.muted,
          maxWidth: 800,
          lineHeight: 1.5,
        }}
      >
        {description}
      </div>

      {/* Code block */}
      <div style={{ flex: 1, display: "flex", alignItems: "center" }}>
        <CodeBlock code={code} frame={frame} fps={fps} />
      </div>
    </AbsoluteFill>
  );
};

// ─── Recap Scene ─────────────────────────────────────────────────
const RecapScene: React.FC<{ steps: string[] }> = ({ steps }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const headP = spring({ frame, fps, config: { damping: 200 } });
  const headOpacity = interpolate(headP, [0, 1], [0, 1]);

  return (
    <AbsoluteFill
      style={{ justifyContent: "center", padding: 80, gap: 24 }}
    >
      <div
        style={{
          opacity: headOpacity,
          fontFamily: mainFont,
          fontSize: 52,
          fontWeight: 700,
          color: COLORS.text,
          marginBottom: 16,
        }}
      >
        Recap
      </div>
      {steps.map((step, i) => {
        const delay = 8 + i * 10;
        const p = spring({
          frame: frame - delay,
          fps,
          config: { damping: 200 },
        });
        const opacity = interpolate(p, [0, 1], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });
        const x = interpolate(p, [0, 1], [-30, 0], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });
        return (
          <div
            key={i}
            style={{
              opacity,
              transform: `translateX(${x}px)`,
              display: "flex",
              alignItems: "center",
              gap: 16,
            }}
          >
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: 8,
                backgroundColor: COLORS.primary,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontFamily: mainFont,
                fontSize: 16,
                fontWeight: 700,
                color: "#fff",
                flexShrink: 0,
              }}
            >
              {i + 1}
            </div>
            <span
              style={{
                fontFamily: mainFont,
                fontSize: 30,
                color: COLORS.text,
              }}
            >
              {step}
            </span>
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

// ─── Main Tutorial Composition ───────────────────────────────────
type TutorialProps = {
  title: string;
  subtitle: string;
};

const TRANSITION_FRAMES = 20;

export const TutorialVideo: React.FC<TutorialProps> = ({
  title,
  subtitle,
}) => {
  const { fps } = useVideoConfig();

  return (
    <AbsoluteFill>
      <GridBackground />
      <TransitionSeries>
        <TransitionSeries.Sequence durationInFrames={5 * fps}>
          <IntroScene title={title} subtitle={subtitle} />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={slide({ direction: "from-right" })}
          timing={linearTiming({ durationInFrames: TRANSITION_FRAMES })}
        />

        <TransitionSeries.Sequence durationInFrames={8 * fps}>
          <StepScene
            step={1}
            title="Create the project"
            description="Initialize a new project with the CLI tool."
            code="npx create-my-app@latest my-project"
          />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={slide({ direction: "from-right" })}
          timing={linearTiming({ durationInFrames: TRANSITION_FRAMES })}
        />

        <TransitionSeries.Sequence durationInFrames={8 * fps}>
          <StepScene
            step={2}
            title="Install dependencies"
            description="Add the packages you need for your project."
            code={`cd my-project\nnpm install`}
          />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={slide({ direction: "from-right" })}
          timing={linearTiming({ durationInFrames: TRANSITION_FRAMES })}
        />

        <TransitionSeries.Sequence durationInFrames={8 * fps}>
          <StepScene
            step={3}
            title="Start development"
            description="Launch the dev server and start building."
            code="npm run dev"
          />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={slide({ direction: "from-right" })}
          timing={linearTiming({ durationInFrames: TRANSITION_FRAMES })}
        />

        <TransitionSeries.Sequence durationInFrames={5 * fps}>
          <RecapScene
            steps={[
              "Create the project",
              "Install dependencies",
              "Start development",
            ]}
          />
        </TransitionSeries.Sequence>
      </TransitionSeries>
    </AbsoluteFill>
  );
};

// ─── Composition Registration ────────────────────────────────────
// Scenes: 5 + 8 + 8 + 8 + 5 = 34 seconds = 1020 frames
// Transitions: 4 * 20 = 80 frames subtracted
// Total: 1020 - 80 = 940 frames ≈ 31.3s
//
// <Composition
//   id="TutorialVideo"
//   component={TutorialVideo}
//   durationInFrames={940}
//   fps={30}
//   width={1920}
//   height={1080}
//   defaultProps={{
//     title: "Getting Started",
//     subtitle: "A step-by-step guide to set up your project",
//   } satisfies TutorialProps}
// />
