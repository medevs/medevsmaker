import React from "react";
import {
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
} from "remotion";
import { CARD, SCENE_DEFAULTS, SHADOWS } from "../styles";
import { glowPulse } from "../animations";

type ColorBorderCardVariant = "default" | "compact" | "wide";

type ColorBorderCardProps = {
  color: string;
  children: React.ReactNode;
  title?: string;
  badge?: string;
  icon?: string;
  delay?: number;
  variant?: ColorBorderCardVariant;
  glow?: boolean;
  fontFamily?: string;
};

const VARIANT_PADDING: Record<ColorBorderCardVariant, string> = {
  compact: CARD.padding.sm,
  default: CARD.padding.md,
  wide: CARD.padding.lg,
};

export const ColorBorderCard: React.FC<ColorBorderCardProps> = ({
  color,
  children,
  title,
  badge,
  icon,
  delay = 0,
  variant = "default",
  glow = false,
  fontFamily = "Inter",
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
  const scale = interpolate(progress, [0, 1], [0.97, 1], {
    extrapolateRight: "clamp",
  });

  const boxShadow = glow ? glowPulse(frame, color, 90) : SHADOWS.sm;

  return (
    <div
      style={{
        opacity,
        transform: `scale(${scale})`,
        backgroundColor: CARD.bg,
        border: `1px solid ${CARD.border}`,
        borderLeft: `${CARD.borderWidth}px solid ${color}`,
        borderRadius: CARD.radius,
        padding: VARIANT_PADDING[variant],
        display: "flex",
        flexDirection: "column",
        gap: 12,
        width: "100%",
        boxSizing: "border-box",
        boxShadow,
      }}
    >
      {(title || badge || icon) && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
          }}
        >
          {icon && <span style={{ fontSize: 24 }}>{icon}</span>}
          {title && (
            <span
              style={{
                fontFamily,
                fontSize: 26,
                fontWeight: 700,
                color,
              }}
            >
              {title}
            </span>
          )}
          {badge && (
            <span
              style={{
                fontFamily: "JetBrains Mono, monospace",
                fontSize: 13,
                fontWeight: 600,
                letterSpacing: 1.5,
                textTransform: "uppercase",
                color,
                backgroundColor: `${color}20`,
                border: `1px solid ${color}44`,
                borderRadius: 6,
                padding: "3px 10px",
              }}
            >
              {badge}
            </span>
          )}
        </div>
      )}
      {children}
    </div>
  );
};
