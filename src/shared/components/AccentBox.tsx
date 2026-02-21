import React from "react";
import {
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
} from "remotion";
import { BRAND, SCENE_DEFAULTS } from "../styles";

type AccentBoxVariant = "info" | "warning" | "success" | "danger";

type AccentBoxProps = {
  title?: string;
  body: string;
  variant?: AccentBoxVariant;
  delay?: number;
  fontSize?: number;
  fontFamily?: string;
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

  return (
    <div
      style={{
        opacity,
        transform: `scale(${scale})`,
        backgroundColor: `${color}10`,
        borderLeft: `4px solid ${color}`,
        borderRadius: 12,
        padding: "24px 32px",
        display: "flex",
        flexDirection: "column",
        gap: 8,
        width: "100%",
        boxSizing: "border-box",
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
