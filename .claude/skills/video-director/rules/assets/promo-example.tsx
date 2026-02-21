/**
 * REFERENCE EXAMPLE: Complete promo video composition
 *
 * This is a reference implementation for the Video Director skill.
 * It demonstrates the correct patterns for a 20-second promo video.
 *
 * Structure:
 *   - HeroScene (4s) → fade → FeaturesScene (5s) → fade → CTAScene (3s)
 *   - Total: 12s of scenes - 2 transitions (0.5s each) = ~11s usable
 *   - Background layer renders behind all scenes
 */

import React from "react";
import {
  AbsoluteFill,
  Composition,
  Sequence,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { TransitionSeries, linearTiming } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { loadFont as loadHeading } from "@remotion/google-fonts/PlusJakartaSans";
import { loadFont as loadBody } from "@remotion/google-fonts/Inter";

// ─── Design Tokens ───────────────────────────────────────────────
const { fontFamily: headingFont } = loadHeading("normal", {
  weights: ["700", "800"],
  subsets: ["latin"],
});
const { fontFamily: bodyFont } = loadBody("normal", {
  weights: ["400", "500"],
  subsets: ["latin"],
});

const COLORS = {
  primary: "#6366f1",
  secondary: "#8b5cf6",
  accent: "#06b6d4",
  bg: "#0f0f1a",
  text: "#f8fafc",
};

// ─── Background ──────────────────────────────────────────────────
const Background: React.FC = () => (
  <AbsoluteFill
    style={{
      background: `linear-gradient(135deg, ${COLORS.primary}18, ${COLORS.bg}, ${COLORS.secondary}18)`,
    }}
  />
);

// ─── Hero Scene ──────────────────────────────────────────────────
const HeroScene: React.FC<{ title: string; tagline: string }> = ({
  title,
  tagline,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleProgress = spring({ frame, fps, config: { damping: 200 } });
  const titleOpacity = interpolate(titleProgress, [0, 1], [0, 1]);
  const titleY = interpolate(titleProgress, [0, 1], [40, 0]);

  const taglineProgress = spring({
    frame: frame - 12,
    fps,
    config: { damping: 200 },
  });
  const taglineOpacity = interpolate(taglineProgress, [0, 1], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        justifyContent: "center",
        alignItems: "center",
        padding: 80,
        gap: 24,
      }}
    >
      <div
        style={{
          opacity: titleOpacity,
          transform: `translateY(${titleY}px)`,
          fontFamily: headingFont,
          fontSize: 76,
          fontWeight: 800,
          color: COLORS.text,
          textAlign: "center",
          lineHeight: 1.1,
        }}
      >
        {title}
      </div>
      <div
        style={{
          opacity: taglineOpacity,
          fontFamily: bodyFont,
          fontSize: 32,
          color: `${COLORS.text}bb`,
          textAlign: "center",
        }}
      >
        {tagline}
      </div>
    </AbsoluteFill>
  );
};

// ─── Features Scene ──────────────────────────────────────────────
const FEATURES = ["AI-Powered Capture", "Instant Organization", "Smart Search"];

const FeaturesScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <AbsoluteFill
      style={{
        justifyContent: "center",
        padding: 80,
        gap: 28,
      }}
    >
      <div
        style={{
          fontFamily: headingFont,
          fontSize: 48,
          fontWeight: 700,
          color: COLORS.text,
          marginBottom: 16,
        }}
      >
        Why teams love it
      </div>
      {FEATURES.map((feature, i) => {
        const delay = i * 10;
        const progress = spring({
          frame: frame - delay,
          fps,
          config: { damping: 200 },
        });
        const opacity = interpolate(progress, [0, 1], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });
        const x = interpolate(progress, [0, 1], [-40, 0], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });

        return (
          <div
            key={feature}
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
                width: 12,
                height: 12,
                borderRadius: "50%",
                backgroundColor: COLORS.accent,
                flexShrink: 0,
              }}
            />
            <span
              style={{
                fontFamily: bodyFont,
                fontSize: 36,
                color: COLORS.text,
                fontWeight: 500,
              }}
            >
              {feature}
            </span>
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

// ─── CTA Scene ───────────────────────────────────────────────────
const CTAScene: React.FC<{ ctaText: string }> = ({ ctaText }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const progress = spring({ frame, fps, config: { damping: 200 } });
  const scale = interpolate(progress, [0, 1], [0.9, 1]);
  const opacity = interpolate(progress, [0, 1], [0, 1]);

  const buttonProgress = spring({
    frame: frame - 15,
    fps,
    config: { damping: 20, stiffness: 200 },
  });
  const buttonScale = interpolate(buttonProgress, [0, 1], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        justifyContent: "center",
        alignItems: "center",
        padding: 80,
        gap: 32,
      }}
    >
      <div
        style={{
          opacity,
          transform: `scale(${scale})`,
          fontFamily: headingFont,
          fontSize: 64,
          fontWeight: 800,
          color: COLORS.text,
          textAlign: "center",
        }}
      >
        {ctaText}
      </div>
      <div
        style={{
          transform: `scale(${buttonScale})`,
          padding: "16px 48px",
          borderRadius: 12,
          backgroundColor: COLORS.accent,
          fontFamily: bodyFont,
          fontSize: 28,
          fontWeight: 600,
          color: "#ffffff",
        }}
      >
        Get Started Free →
      </div>
    </AbsoluteFill>
  );
};

// ─── Main Composition ────────────────────────────────────────────
type PromoProps = {
  title: string;
  tagline: string;
  ctaText: string;
};

const TRANSITION_FRAMES = 15;

export const PromoVideo: React.FC<PromoProps> = ({
  title,
  tagline,
  ctaText,
}) => {
  const { fps } = useVideoConfig();

  return (
    <AbsoluteFill>
      <Background />
      <TransitionSeries>
        <TransitionSeries.Sequence durationInFrames={4 * fps}>
          <HeroScene title={title} tagline={tagline} />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({ durationInFrames: TRANSITION_FRAMES })}
        />
        <TransitionSeries.Sequence durationInFrames={5 * fps}>
          <FeaturesScene />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({ durationInFrames: TRANSITION_FRAMES })}
        />
        <TransitionSeries.Sequence durationInFrames={3 * fps}>
          <CTAScene ctaText={ctaText} />
        </TransitionSeries.Sequence>
      </TransitionSeries>
    </AbsoluteFill>
  );
};

// ─── Composition Registration (for Root.tsx) ─────────────────────
// Total = (4 + 5 + 3) * 30 - 2 * 15 = 360 - 30 = 330 frames = 11s
//
// <Composition
//   id="PromoVideo"
//   component={PromoVideo}
//   durationInFrames={330}
//   fps={30}
//   width={1920}
//   height={1080}
//   defaultProps={{
//     title: "Never Miss a Note",
//     tagline: "AI-powered note-taking for modern teams",
//     ctaText: "Try It Today",
//   } satisfies PromoProps}
// />
