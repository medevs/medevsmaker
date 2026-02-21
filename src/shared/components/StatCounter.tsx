import React from "react";
import {
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
} from "remotion";
import { BRAND, SCENE_DEFAULTS, SHADOWS, GRADIENTS } from "../styles";

type StatCounterProps = {
  target: number;
  suffix?: string;
  prefix?: string;
  label: string;
  delay?: number;
  color?: string;
  fontSize?: number;
  labelFontSize?: number;
  fontFamily?: string;
  glow?: boolean;
  gradientText?: boolean;
};

export const StatCounter: React.FC<StatCounterProps> = ({
  target,
  suffix = "",
  prefix = "",
  label,
  delay = 0,
  color = BRAND.cyan,
  fontSize = 120,
  labelFontSize = 28,
  fontFamily = "Inter",
  glow = false,
  gradientText = false,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const countProgress = spring({
    frame: frame - delay,
    fps,
    config: SCENE_DEFAULTS.springSmooth,
  });

  const displayNumber = Math.round(
    interpolate(countProgress, [0, 1], [0, target], {
      extrapolateRight: "clamp",
    })
  );

  const labelProgress = spring({
    frame: frame - delay - 10,
    fps,
    config: SCENE_DEFAULTS.springSmooth,
  });
  const labelOpacity = interpolate(labelProgress, [0, 1], [0, 1], {
    extrapolateRight: "clamp",
  });
  const labelY = interpolate(labelProgress, [0, 1], [15, 0], {
    extrapolateRight: "clamp",
  });

  const scaleProgress = spring({
    frame: frame - delay,
    fps,
    config: SCENE_DEFAULTS.springSnappy,
  });
  const scale = interpolate(scaleProgress, [0, 1], [0.8, 1], {
    extrapolateRight: "clamp",
  });

  const numberStyle: React.CSSProperties = {
    fontFamily,
    fontSize,
    fontWeight: 800,
    transform: `scale(${scale})`,
    lineHeight: 1,
  };

  if (gradientText) {
    numberStyle.background = GRADIENTS.textGradient(color, BRAND.violet);
    numberStyle.backgroundClip = "text";
    numberStyle.WebkitBackgroundClip = "text";
    numberStyle.color = "transparent";
    numberStyle.WebkitTextFillColor = "transparent";
  } else {
    numberStyle.color = color;
  }

  if (glow) {
    numberStyle.textShadow = SHADOWS.glow(color);
  }

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 8,
      }}
    >
      <div style={numberStyle}>
        {prefix}
        {displayNumber.toLocaleString()}
        {suffix}
      </div>
      <div
        style={{
          opacity: labelOpacity,
          transform: `translateY(${labelY}px)`,
          fontFamily,
          fontSize: labelFontSize,
          color: BRAND.textMuted,
        }}
      >
        {label}
      </div>
    </div>
  );
};
