import React from "react";
import {
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
} from "remotion";
import { BRAND, CARD, GLASS, SCENE_DEFAULTS, SHADOWS, GRADIENTS } from "../styles";
import { glowPulse } from "../animations";

type CardVariant = "accent" | "border" | "glass";
type CardSize = "sm" | "md" | "lg";
type SemanticType = "info" | "warning" | "success" | "danger";

type CardProps = {
  variant?: CardVariant;
  size?: CardSize;
  semanticType?: SemanticType;
  color?: string;
  glow?: boolean;
  blur?: number;
  icon?: string;
  title?: string;
  badge?: string;
  delay?: number;
  fontFamily?: string;
  children: React.ReactNode;
};

const SEMANTIC_COLORS: Record<SemanticType, string> = {
  info: BRAND.cyan,
  warning: BRAND.amber,
  success: BRAND.green,
  danger: BRAND.red,
};

const SEMANTIC_ICONS: Record<SemanticType, string> = {
  info: "\u2139\uFE0F",
  warning: "\u26A0\uFE0F",
  success: "\u2705",
  danger: "\u274C",
};

const SIZE_PADDING: Record<CardSize, string> = {
  sm: CARD.padding.sm,
  md: CARD.padding.md,
  lg: CARD.padding.lg,
};

export const Card: React.FC<CardProps> = ({
  variant = "border",
  size = "md",
  semanticType,
  color,
  glow = false,
  blur = GLASS.blur,
  icon,
  title,
  badge,
  delay = 0,
  fontFamily = "Inter",
  children,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Resolve color: semantic type takes priority, then explicit color, then default
  const resolvedColor =
    variant === "accent" && semanticType
      ? SEMANTIC_COLORS[semanticType]
      : color || BRAND.amber;

  // Resolve icon: semantic type icon, then explicit icon
  const resolvedIcon =
    variant === "accent" && semanticType && !icon
      ? SEMANTIC_ICONS[semanticType]
      : icon;

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

  // Glass variant has translateY entrance
  const translateY =
    variant === "glass"
      ? interpolate(progress, [0, 1], [20, 0], { extrapolateRight: "clamp" })
      : 0;

  // Glass shimmer
  const shimmer =
    variant === "glass" && glow
      ? interpolate(Math.sin(frame * 0.06), [-1, 1], [0.08, 0.2])
      : 0.1;

  const boxShadow =
    glow
      ? variant === "glass"
        ? SHADOWS.deepGlow(resolvedColor)
        : glowPulse(frame, resolvedColor, 90)
      : SHADOWS.sm;

  // Build variant-specific styles
  const variantStyles: React.CSSProperties =
    variant === "glass"
      ? {
          background: GLASS.bg,
          backdropFilter: `blur(${blur}px)`,
          WebkitBackdropFilter: `blur(${blur}px)`,
          border: `${GLASS.borderWidth}px solid rgba(255, 255, 255, ${shimmer})`,
          borderRadius: GLASS.radius,
        }
      : variant === "accent"
        ? {
            backgroundColor: `${resolvedColor}10`,
            borderLeft: `4px solid ${resolvedColor}`,
            borderRadius: CARD.radius,
          }
        : {
            backgroundColor: CARD.bg,
            border: `1px solid ${CARD.border}`,
            borderLeft: `${CARD.borderWidth}px solid ${resolvedColor}`,
            borderRadius: CARD.radius,
          };

  return (
    <div
      style={{
        opacity,
        transform: `translateY(${translateY}px) scale(${scale})`,
        padding: SIZE_PADDING[size],
        display: "flex",
        flexDirection: "column",
        gap: 12,
        width: "100%",
        boxSizing: "border-box",
        boxShadow,
        fontFamily,
        ...variantStyles,
      }}
    >
      {(title || badge || resolvedIcon) && (
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          {resolvedIcon && <span style={{ fontSize: 24 }}>{resolvedIcon}</span>}
          {title && (
            <span
              style={{
                fontFamily,
                fontSize: 26,
                fontWeight: 700,
                color: resolvedColor,
              }}
            >
              {title}
            </span>
          )}
          {badge && (
            <span
              style={{
                fontFamily: "JetBrains Mono, monospace",
                fontSize: 20,
                fontWeight: 600,
                letterSpacing: 1.5,
                textTransform: "uppercase",
                color: resolvedColor,
                backgroundColor: `${resolvedColor}20`,
                border: `1px solid ${resolvedColor}44`,
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
