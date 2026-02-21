import React from "react";
import {
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
} from "remotion";
import { BRAND, SCENE_DEFAULTS, SHADOWS, GRADIENTS } from "../styles";
import { glowPulse } from "../animations";

type AccentBoxVariant = "info" | "warning" | "success" | "danger";

type AccentBoxProps = {
  title?: string;
  body: string;
  variant?: AccentBoxVariant;
  delay?: number;
  fontSize?: number;
  fontFamily?: string;
  glow?: boolean;
  gradient?: boolean;
};

const VARIANT_COLORS: Record<AccentBoxVariant, string> = {
  info: BRAND.cyan,
  warning: BRAND.amber,
  success: BRAND.green,
  danger: BRAND.red,
};

const VARIANT_ICONS: Record<AccentBoxVariant, string> = {
  info: "\u2139\uFE0F",
  warning: "\u26A0\uFE0F",
  success: "\u2705",
  danger: "\u274C",
};

export const AccentBox: React.FC<AccentBoxProps> = ({
  title,
  body,
  variant = "info",
  delay = 0,
  fontSize = 28,
  fontFamily = "Inter",
  glow = false,
  gradient = false,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const color = VARIANT_COLORS[variant];
  const icon = VARIANT_ICONS[variant];

  const progress = spring({
    frame: frame - delay,
    fps,
    config: SCENE_DEFAULTS.springSmooth,
  });
  const opacity = interpolate(progress, [0, 1], [0, 1], {
    extrapolateRight: "clamp",
  });
  const scale = interpolate(progress, [0, 1], [0.95, 1], {
    extrapolateRight: "clamp",
  });

  const boxShadow = glow
    ? glowPulse(frame, color, 90)
    : SHADOWS.sm;

  return (
    <div
      style={{
        opacity,
        transform: `scale(${scale})`,
        backgroundColor: gradient ? undefined : `${color}10`,
        background: gradient
          ? GRADIENTS.cardGradient(color)
          : undefined,
        borderLeft: `4px solid ${color}`,
        borderRadius: 12,
        padding: "24px 32px",
        display: "flex",
        flexDirection: "column",
        gap: 8,
        width: "100%",
        boxSizing: "border-box",
        boxShadow,
      }}
    >
      {title && (
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <span style={{ fontSize: fontSize - 4 }}>{icon}</span>
          <span
            style={{
              fontFamily,
              fontSize: fontSize + 2,
              fontWeight: 700,
              color,
            }}
          >
            {title}
          </span>
        </div>
      )}
      <div
        style={{
          fontFamily,
          fontSize,
          color: BRAND.text,
          lineHeight: 1.5,
          paddingLeft: title ? 0 : 0,
        }}
      >
        {body}
      </div>
    </div>
  );
};
