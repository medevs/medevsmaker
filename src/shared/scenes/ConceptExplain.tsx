import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
} from "remotion";
import { baseTokens, BRAND, GLASS, SCENE_DEFAULTS, SHADOWS, TYPOGRAPHY } from "../styles";
import { SceneBackground } from "../components/SceneBackground";
import { entrances, EASINGS, shimmer } from "../animations";
import { useLayoutMode } from "../formats";
import { loadFont } from "@remotion/google-fonts/Inter";

const { fontFamily: interFont } = loadFont();

type HeadingEntrance = "fadeUp" | "fadeLeft" | "typewriter";

type ConceptExplainProps = {
  heading: string;
  body: string;
  analogy?: string;
  icon?: string;
  sectionColor?: string;
  colors?: { bg: string; text: string; accent: string; muted: string };
  fontFamily?: string;
  headingEntrance?: HeadingEntrance;
};

export const ConceptExplain: React.FC<ConceptExplainProps> = ({
  heading,
  body,
  analogy,
  icon,
  colors = {
    bg: BRAND.bg,
    text: BRAND.text,
    accent: BRAND.violet,
    muted: BRAND.textMuted,
  },
  sectionColor,
  fontFamily = interFont,
  headingEntrance = "fadeUp",
}) => {
  const effectiveAccent = sectionColor || colors.accent;
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { contentPadding, fontScale } = useLayoutMode();

  const headP = spring({ frame, fps, config: SCENE_DEFAULTS.springSmooth });
  const clampedP = interpolate(headP, [0, 1], [0, 1], { extrapolateRight: "clamp" });

  const bodyP = spring({ frame: frame - 12, fps, config: SCENE_DEFAULTS.springSmooth });
  const bodyOpacity = interpolate(bodyP, [0, 1], [0, 1], { extrapolateRight: "clamp" });
  const bodyY = interpolate(bodyP, [0, 1], [16, 0], { extrapolateRight: "clamp", easing: EASINGS.decelerate });

  const analogyP = spring({ frame: frame - 25, fps, config: SCENE_DEFAULTS.springSilky });
  const analogyOpacity = interpolate(analogyP, [0, 1], [0, 1], { extrapolateRight: "clamp" });
  const analogyScale = interpolate(analogyP, [0, 1], [0.97, 1], { extrapolateRight: "clamp" });

  const lineShimmer = shimmer(frame, 100);

  // Heading style based on entrance type
  let headStyle: React.CSSProperties;
  let headingText: React.ReactNode = heading;

  if (headingEntrance === "fadeLeft") {
    const s = entrances.fadeLeft(clampedP);
    headStyle = { opacity: s.opacity, transform: s.transform };
  } else if (headingEntrance === "typewriter") {
    const charsToShow = Math.floor(
      interpolate(frame, [0, heading.length * 2], [0, heading.length], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      })
    );
    headStyle = { opacity: 1 };
    headingText = (
      <>
        {heading.slice(0, charsToShow)}
        <span style={{ opacity: frame % 30 < 15 ? 1 : 0, color: effectiveAccent }}>|</span>
      </>
    );
  } else {
    const headY = interpolate(headP, [0, 1], [20, 0], { extrapolateRight: "clamp" });
    headStyle = { opacity: clampedP, transform: `translateY(${headY}px)` };
  }

  return (
    <SceneBackground bg={colors.bg}>
    <AbsoluteFill
      style={{
        justifyContent: "center",
        alignItems: "center",
        padding: contentPadding,
      }}
    >
      {/* Ambient glow */}
      <div
        style={{
          position: "absolute",
          top: "25%",
          left: "50%",
          width: 600,
          height: 600,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${effectiveAccent}0a 0%, transparent 70%)`,
          transform: "translateX(-50%)",
          pointerEvents: "none",
        }}
      />

      <div
        style={{
          position: "relative",
          zIndex: 1,
          display: "flex",
          flexDirection: "column",
          gap: 28,
          maxWidth: 1000,
          width: "100%",
        }}
      >
        {/* Heading row */}
        <div
          style={{
            ...headStyle,
            display: "flex",
            alignItems: "center",
            gap: 18,
          }}
        >
          {icon && (
            <div
              style={{
                width: 64,
                height: 64,
                borderRadius: 16,
                backgroundColor: `${effectiveAccent}15`,
                border: `1px solid ${effectiveAccent}30`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: Math.round(36 * fontScale),
                flexShrink: 0,
                boxShadow: SHADOWS.glow(effectiveAccent),
              }}
            >
              {icon}
            </div>
          )}
          <div
            style={{
              fontFamily,
              fontSize: Math.round(52 * fontScale),
              fontWeight: 800,
              color: colors.text,
              lineHeight: TYPOGRAPHY.lineHeights.tight,
              letterSpacing: -0.5,
            }}
          >
            {headingText}
          </div>
        </div>

        {/* Body card */}
        <div
          style={{
            opacity: bodyOpacity,
            transform: `translateY(${bodyY}px)`,
            borderRadius: GLASS.radius,
            overflow: "hidden",
            background: GLASS.bg,
            border: `1px solid ${GLASS.border}`,
            borderLeft: `4px solid ${effectiveAccent}`,
            boxShadow: SHADOWS.md,
            padding: "28px 36px",
          }}
        >
          <div
            style={{
              fontFamily,
              fontSize: Math.round(30 * fontScale),
              fontWeight: 500,
              color: colors.text,
              lineHeight: TYPOGRAPHY.lineHeights.relaxed,
            }}
          >
            {body}
          </div>
        </div>

        {/* Analogy card */}
        {analogy && (
          <div
            style={{
              opacity: analogyOpacity,
              transform: `scale(${analogyScale})`,
              borderRadius: GLASS.radius,
              overflow: "hidden",
              background: `${effectiveAccent}08`,
              border: `1px solid ${effectiveAccent}20`,
              boxShadow: `0 0 ${16 + lineShimmer * 8}px ${effectiveAccent}10`,
              padding: "22px 32px",
              display: "flex",
              alignItems: "center",
              gap: 16,
            }}
          >
            <div
              style={{
                width: 4,
                height: 40,
                borderRadius: 2,
                backgroundColor: effectiveAccent,
                flexShrink: 0,
                opacity: 0.6,
              }}
            />
            <div
              style={{
                fontFamily,
                fontSize: Math.round(26 * fontScale),
                fontWeight: 500,
                color: effectiveAccent,
                fontStyle: "italic",
                lineHeight: TYPOGRAPHY.lineHeights.relaxed,
              }}
            >
              {analogy}
            </div>
          </div>
        )}
      </div>
    </AbsoluteFill>
    </SceneBackground>
  );
};
