import React from "react";
import {
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
} from "remotion";
import { BRAND, SCENE_DEFAULTS, SHADOWS, GRADIENTS, baseTokens } from "../styles";
import { DramaticCounter } from "./DramaticCounter";

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
  mode?: "spring" | "slot" | "splitFlap";
};

export const StatCounter: React.FC<StatCounterProps> = ({
  target,
  suffix = "",
  prefix = "",
  label,
  delay = 0,
  color = BRAND.cyan,
  fontSize = baseTokens.fontSizes.display,
  labelFontSize = baseTokens.fontSizes.md,
  fontFamily = "Inter",
  glow = false,
  gradientText = false,
  mode = "spring",
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Safety: coerce string values to numbers (script.json may pass strings)
  const safeTarget = typeof target === "string" ? parseFloat(target) || 0 : target;

  if (mode === "slot" || mode === "splitFlap") {
    return (
      <DramaticCounter
        target={safeTarget}
        suffix={suffix}
        prefix={prefix}
        label={label}
        mode={mode}
        color={color}
        delay={delay}
        fontSize={fontSize}
        fontFamily={fontFamily}
      />
    );
  }

  const countProgress = spring({
    frame: frame - delay,
    fps,
    config: SCENE_DEFAULTS.springSmooth,
  });

  const displayNumber = Math.round(
    interpolate(countProgress, [0, 1], [0, safeTarget], {
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
        gap: baseTokens.spacing.xs,
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
