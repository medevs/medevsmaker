import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
} from "remotion";
import { BRAND, SCENE_DEFAULTS, SHADOWS, GRADIENTS } from "../styles";
import { glowPulse } from "../animations";
import { useLayoutMode } from "../formats";
import { ParticleField } from "../components/ParticleField";

type FullScreenTextEntrance = "scale" | "gradient" | "slam";

type FullScreenTextProps = {
  text: string;
  subtext?: string;
  colors?: { bg: string; text: string; accent: string };
  fontFamily?: string;
  entrance?: FullScreenTextEntrance;
};

/**
 * FullScreenText — single large statement filling the screen.
 * Designed for short-form hook moments and punchlines.
 * Larger, bolder, and simpler than ColdOpen.
 */
export const FullScreenText: React.FC<FullScreenTextProps> = ({
  text,
  subtext,
  colors = { bg: BRAND.bg, text: BRAND.text, accent: BRAND.cyan },
  fontFamily = "Inter",
  entrance = "scale",
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { isVertical, contentPadding, fontScale } = useLayoutMode();

  const mainP = spring({
    frame,
    fps,
    config: entrance === "slam"
      ? SCENE_DEFAULTS.springBouncy
      : SCENE_DEFAULTS.springHeavy,
  });
  const clampedP = interpolate(mainP, [0, 1], [0, 1], {
    extrapolateRight: "clamp",
  });

  const subtextP = spring({
    frame: frame - 15,
    fps,
    config: SCENE_DEFAULTS.springSilky,
  });
  const subOpacity = interpolate(subtextP, [0, 1], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const baseFontSize = isVertical ? 90 : 100;
  const fontSize = Math.round(baseFontSize * fontScale);

  let mainStyle: React.CSSProperties = {};

  if (entrance === "gradient") {
    mainStyle = {
      opacity: clampedP,
      transform: `scale(${interpolate(clampedP, [0, 1], [0.85, 1], {
        extrapolateRight: "clamp",
      })})`,
      background: GRADIENTS.textGradient(colors.accent, BRAND.violet),
      backgroundClip: "text",
      WebkitBackgroundClip: "text",
      color: "transparent",
      WebkitTextFillColor: "transparent",
    };
  } else if (entrance === "slam") {
    mainStyle = {
      opacity: clampedP,
      transform: `scale(${interpolate(clampedP, [0, 1], [2, 1], {
        extrapolateRight: "clamp",
      })})`,
      color: colors.text,
      textShadow: SHADOWS.glowStrong(colors.accent),
    };
  } else {
    // Default "scale"
    mainStyle = {
      opacity: clampedP,
      transform: `scale(${interpolate(clampedP, [0, 1], [0.7, 1], {
        extrapolateRight: "clamp",
      })})`,
      color: colors.text,
      textShadow: glowPulse(frame, colors.accent, 60),
    };
  }

  return (
    <AbsoluteFill
      style={{
        backgroundColor: colors.bg,
        justifyContent: "center",
        alignItems: "center",
        padding: contentPadding,
      }}
    >
      <ParticleField count={20} color={colors.accent} opacity={0.1} />
      <div
        style={{
          ...mainStyle,
          fontFamily,
          fontSize,
          fontWeight: 900,
          textAlign: "center",
          lineHeight: 1.1,
          maxWidth: isVertical ? 900 : 1400,
          letterSpacing: -2,
        }}
      >
        {text}
      </div>
      {subtext && (
        <div
          style={{
            opacity: subOpacity,
            fontFamily,
            fontSize: Math.round(28 * fontScale),
            fontWeight: 600,
            color: colors.accent,
            textAlign: "center",
            marginTop: 20,
            letterSpacing: 2,
            textTransform: "uppercase",
          }}
        >
          {subtext}
        </div>
      )}
    </AbsoluteFill>
  );
};
