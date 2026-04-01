import React from "react";
import {
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
} from "remotion";
import { GLASS, SCENE_DEFAULTS, SHADOWS } from "../styles";

type GlassCardProps = {
  children: React.ReactNode;
  color: string;
  delay?: number;
  blur?: number;
  glow?: boolean;
  padding?: string;
  fontFamily?: string;
};

export const GlassCard: React.FC<GlassCardProps> = ({
  children,
  color,
  delay = 0,
  blur = GLASS.blur,
  glow = false,
  padding = "28px 32px",
  fontFamily = "Inter",
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const enter = spring({
    frame: frame - delay,
    fps,
    config: SCENE_DEFAULTS.springSilky,
  });

  const opacity = interpolate(enter, [0, 1], [0, 1], {
    extrapolateRight: "clamp",
  });
  const translateY = interpolate(enter, [0, 1], [20, 0], {
    extrapolateRight: "clamp",
  });
  const scale = interpolate(enter, [0, 1], [0.97, 1], {
    extrapolateRight: "clamp",
  });

  // Animated border shimmer: subtle opacity oscillation
  const shimmer = glow
    ? interpolate(
        Math.sin(frame * 0.06),
        [-1, 1],
        [0.08, 0.2],
      )
    : 0.1;

  return (
    <div
      style={{
        opacity,
        transform: `translateY(${translateY}px) scale(${scale})`,
        background: GLASS.bg,
        backdropFilter: `blur(${blur}px)`,
        WebkitBackdropFilter: `blur(${blur}px)`,
        border: `${GLASS.borderWidth}px solid rgba(255, 255, 255, ${shimmer})`,
        borderRadius: GLASS.radius,
        padding,
        fontFamily,
        boxShadow: glow
          ? SHADOWS.deepGlow(color)
          : SHADOWS.sm,
      }}
    >
      {children}
    </div>
  );
};
