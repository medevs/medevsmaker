import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
} from "remotion";
import { BRAND, GLASS, SCENE_DEFAULTS, SHADOWS, TYPOGRAPHY } from "../styles";
import { SceneBackground } from "../components/SceneBackground";
import { StatCounter } from "../components/StatCounter";
import { useLayoutMode } from "../formats";
import { shimmer } from "../animations";
import { loadFont } from "@remotion/google-fonts/Inter";

const { fontFamily: interFont } = loadFont();

type StatEmphasis = "default" | "glow" | "gradient";

type StatHighlightProps = {
  stat: number;
  suffix?: string;
  prefix?: string;
  label: string;
  context?: string;
  sectionColor?: string;
  colors?: { bg: string; text: string; accent: string; muted: string };
  fontFamily?: string;
  emphasis?: StatEmphasis;
  mode?: "spring" | "slot" | "splitFlap";
};

export const StatHighlight: React.FC<StatHighlightProps> = ({
  stat,
  suffix = "",
  prefix = "",
  label,
  context,
  colors = {
    bg: BRAND.bg,
    text: BRAND.text,
    accent: BRAND.cyan,
    muted: BRAND.textMuted,
  },
  sectionColor,
  fontFamily = interFont,
  emphasis = "default",
  mode = "spring",
}) => {
  const effectiveAccent = sectionColor || colors.accent;
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { contentPadding, fontScale } = useLayoutMode();
  const lineShimmer = shimmer(frame, 90);

  const safeStat = typeof stat === "string" ? parseFloat(stat) || 0 : stat;

  const cardP = spring({ frame: frame - 5, fps, config: SCENE_DEFAULTS.springSilky });
  const cardOpacity = interpolate(cardP, [0, 1], [0, 1], { extrapolateRight: "clamp" });
  const cardScale = interpolate(cardP, [0, 1], [0.95, 1], { extrapolateRight: "clamp" });

  const contextP = spring({ frame: frame - 25, fps, config: SCENE_DEFAULTS.springSmooth });
  const contextOpacity = interpolate(contextP, [0, 1], [0, 1], { extrapolateRight: "clamp" });
  const contextY = interpolate(contextP, [0, 1], [12, 0], { extrapolateRight: "clamp" });

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
          top: "30%",
          left: "50%",
          width: 500,
          height: 500,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${effectiveAccent}10 0%, transparent 70%)`,
          transform: "translateX(-50%)",
          pointerEvents: "none",
        }}
      />

      {/* Main card */}
      <div
        style={{
          position: "relative",
          zIndex: 1,
          opacity: cardOpacity,
          transform: `scale(${cardScale})`,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 32,
          maxWidth: 800,
          width: "100%",
          borderRadius: GLASS.radius,
          background: GLASS.bg,
          border: `1px solid ${GLASS.border}`,
          boxShadow: `${SHADOWS.lg}, 0 0 ${24 + lineShimmer * 12}px ${effectiveAccent}15`,
          padding: "56px 64px",
        }}
      >
        {/* Accent top border glow */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 40,
            right: 40,
            height: 3,
            borderRadius: 2,
            background: `linear-gradient(90deg, transparent, ${effectiveAccent}, transparent)`,
            opacity: 0.5 + lineShimmer * 0.2,
          }}
        />

        {/* Stat counter */}
        <StatCounter
          target={safeStat}
          suffix={suffix}
          prefix={prefix}
          label={label}
          color={effectiveAccent}
          fontFamily={fontFamily}
          fontSize={Math.round(160 * fontScale)}
          labelFontSize={Math.round(32 * fontScale)}
          glow={emphasis === "glow"}
          gradientText={emphasis === "gradient"}
          mode={mode}
        />

        {/* Context text */}
        {context && (
          <>
            <div
              style={{
                width: 60,
                height: 2,
                borderRadius: 1,
                background: `${effectiveAccent}40`,
              }}
            />
            <div
              style={{
                opacity: contextOpacity,
                transform: `translateY(${contextY}px)`,
                fontFamily,
                fontSize: Math.round(28 * fontScale),
                fontWeight: 500,
                color: colors.muted,
                textAlign: "center",
                lineHeight: TYPOGRAPHY.lineHeights.normal,
              }}
            >
              {context}
            </div>
          </>
        )}
      </div>
    </AbsoluteFill>
    </SceneBackground>
  );
};
