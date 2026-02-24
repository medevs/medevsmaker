import React from "react";
import {
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
} from "remotion";
import { MONO, SCENE_DEFAULTS } from "../styles";

type PillBadgeVariant = "filled" | "outline";

type PillBadgeProps = {
  label: string;
  color: string;
  variant?: PillBadgeVariant;
  delay?: number;
  fontSize?: number;
};

export const PillBadge: React.FC<PillBadgeProps> = ({
  label,
  color,
  variant = "filled",
  delay = 0,
  fontSize = 14,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const progress = spring({
    frame: frame - delay,
    fps,
    config: SCENE_DEFAULTS.springSnappy,
  });
  const opacity = interpolate(progress, [0, 1], [0, 1], {
    extrapolateRight: "clamp",
  });
  const scale = interpolate(progress, [0, 1], [0.85, 1], {
    extrapolateRight: "clamp",
  });

  const isFilled = variant === "filled";

  return (
    <span
      style={{
        display: "inline-flex",
        opacity,
        transform: `scale(${scale})`,
        fontFamily: MONO.fontFamily,
        fontSize,
        fontWeight: 700,
        letterSpacing: MONO.letterSpacing,
        textTransform: MONO.textTransform,
        color: isFilled ? color : color,
        backgroundColor: isFilled ? `${color}22` : "transparent",
        border: `1px solid ${color}66`,
        borderRadius: 8,
        padding: "5px 14px",
        whiteSpace: "nowrap",
      }}
    >
      {label}
    </span>
  );
};
