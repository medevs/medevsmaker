import React from "react";
import {
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
} from "remotion";
import { BRAND, GRADIENTS, SCENE_DEFAULTS, SHADOWS, baseTokens, TYPOGRAPHY } from "../styles";

type GradientTextEntrance = "fade" | "fadeUp" | "scale";

type GradientTextProps = {
  text: string;
  from?: string;
  to?: string;
  fontSize?: number;
  fontWeight?: number;
  fontFamily?: string;
  delay?: number;
  entrance?: GradientTextEntrance;
  glow?: boolean;
};

export const GradientText: React.FC<GradientTextProps> = ({
  text,
  from = BRAND.indigo,
  to = BRAND.violet,
  fontSize = baseTokens.fontSizes.xl,
  fontWeight = 800,
  fontFamily = "Inter",
  delay = 0,
  entrance = "fade",
  glow = false,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const progress = spring({
    frame: frame - delay,
    fps,
    config: SCENE_DEFAULTS.springSilky,
  });
  const opacity = interpolate(progress, [0, 1], [0, 1], {
    extrapolateRight: "clamp",
  });

  let transform = "none";
  if (entrance === "fadeUp") {
    const y = interpolate(progress, [0, 1], [20, 0], {
      extrapolateRight: "clamp",
    });
    transform = `translateY(${y}px)`;
  } else if (entrance === "scale") {
    const s = interpolate(progress, [0, 1], [0.9, 1], {
      extrapolateRight: "clamp",
    });
    transform = `scale(${s})`;
  }

  return (
    <span
      style={{
        display: "inline-block",
        opacity,
        transform,
        fontFamily,
        fontSize,
        fontWeight,
        lineHeight: TYPOGRAPHY.lineHeights.tight,
        background: GRADIENTS.textGradient(from, to),
        backgroundClip: "text",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
        textShadow: glow
          ? `0 0 30px ${from}44, 0 0 60px ${to}22`
          : "none",
      }}
    >
      {text}
    </span>
  );
};
