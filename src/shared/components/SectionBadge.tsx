import React from "react";
import {
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
} from "remotion";
import { BRAND, SCENE_DEFAULTS, SHADOWS, GRADIENTS } from "../styles";

type SectionBadgeProps = {
  number: number;
  delay?: number;
  color?: string;
  size?: number;
  fontFamily?: string;
  gradient?: boolean;
};

export const SectionBadge: React.FC<SectionBadgeProps> = ({
  number,
  delay = 0,
  color = BRAND.indigo,
  size = 56,
  fontFamily = "Inter",
  gradient = false,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const progress = spring({
    frame: frame - delay,
    fps,
    config: SCENE_DEFAULTS.springSnappy,
  });

  const scale = interpolate(progress, [0, 1], [0, 1], {
    extrapolateRight: "clamp",
  });

  const label = String(number).padStart(2, "0");

  return (
    <div
      style={{
        transform: `scale(${scale})`,
        width: size,
        height: size,
        borderRadius: 14,
        backgroundColor: gradient ? undefined : color,
        background: gradient
          ? GRADIENTS.textGradient(color, BRAND.violet)
          : undefined,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily,
        fontSize: size * 0.45,
        fontWeight: 800,
        color: "#ffffff",
        boxShadow: SHADOWS.glow(color),
      }}
    >
      {label}
    </div>
  );
};
