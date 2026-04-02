import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
} from "remotion";
import { BRAND, SCENE_DEFAULTS, SHADOWS } from "../styles";
import { useLayoutMode } from "../formats";

type SwipeRevealProps = {
  /** Content shown before the swipe */
  before: string;
  /** Content revealed after the swipe */
  after: string;
  /** Optional label above the before text */
  label?: string;
  /** Frame at which the swipe begins */
  swipeAt?: number;
  colors?: { bg: string; text: string; accent: string; muted: string };
  fontFamily?: string;
};

/**
 * SwipeReveal — content animates upward mimicking a swipe gesture.
 * Designed for short-form vertical videos. The "before" text slides up
 * and is replaced by the "after" text rising from below.
 */
export const SwipeReveal: React.FC<SwipeRevealProps> = ({
  before,
  after,
  label,
  swipeAt = 45,
  colors = {
    bg: BRAND.bg,
    text: BRAND.text,
    accent: BRAND.cyan,
    muted: BRAND.textMuted,
  },
  fontFamily = "Inter",
}) => {
  const frame = useCurrentFrame();
  const { fps, height } = useVideoConfig();
  const { isVertical, contentPadding, fontScale } = useLayoutMode();

  // Before text entrance
  const beforeP = spring({
    frame,
    fps,
    config: SCENE_DEFAULTS.springSilky,
  });
  const beforeOpacity = interpolate(beforeP, [0, 1], [0, 1], {
    extrapolateRight: "clamp",
  });
  const beforeY = interpolate(beforeP, [0, 1], [40, 0], {
    extrapolateRight: "clamp",
  });

  // Swipe animation — before slides up and out, after slides up from bottom
  const swipeP = spring({
    frame: frame - swipeAt,
    fps,
    config: SCENE_DEFAULTS.springSmooth,
  });
  const swipeProgress = interpolate(swipeP, [0, 1], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const beforeSwipeY = interpolate(swipeProgress, [0, 1], [0, -height * 0.4]);
  const beforeSwipeOpacity = interpolate(swipeProgress, [0, 0.6], [1, 0], {
    extrapolateRight: "clamp",
  });

  const afterY = interpolate(swipeProgress, [0, 1], [height * 0.4, 0]);
  const afterOpacity = interpolate(swipeProgress, [0.3, 1], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Label entrance
  const labelP = spring({
    frame: frame - 5,
    fps,
    config: SCENE_DEFAULTS.springSilky,
  });

  const baseFontSize = isVertical ? 72 : 64;
  const fontSize = Math.round(baseFontSize * fontScale);

  return (
    <AbsoluteFill
      style={{
        backgroundColor: colors.bg,
        justifyContent: "center",
        alignItems: "center",
        padding: contentPadding,
        overflow: "hidden",
      }}
    >
      {/* Label */}
      {label && (
        <div
          style={{
            position: "absolute",
            top: isVertical ? 200 : 120,
            opacity: interpolate(labelP, [0, 1], [0, 1], {
              extrapolateRight: "clamp",
            }),
            fontFamily,
            fontSize: Math.round(20 * fontScale),
            fontWeight: 700,
            color: colors.accent,
            textTransform: "uppercase",
            letterSpacing: 3,
          }}
        >
          {label}
        </div>
      )}

      {/* Before text */}
      <div
        style={{
          position: "absolute",
          opacity: beforeOpacity * beforeSwipeOpacity,
          transform: `translateY(${beforeY + beforeSwipeY}px)`,
          fontFamily,
          fontSize,
          fontWeight: 800,
          color: colors.text,
          textAlign: "center",
          lineHeight: 1.2,
          maxWidth: isVertical ? 900 : 1200,
          padding: "0 40px",
        }}
      >
        {before}
      </div>

      {/* After text — slides up from bottom */}
      <div
        style={{
          position: "absolute",
          opacity: afterOpacity,
          transform: `translateY(${afterY}px)`,
          fontFamily,
          fontSize,
          fontWeight: 800,
          color: colors.accent,
          textAlign: "center",
          lineHeight: 1.2,
          maxWidth: isVertical ? 900 : 1200,
          padding: "0 40px",
          textShadow: SHADOWS.glow(colors.accent),
        }}
      >
        {after}
      </div>

      {/* Swipe indicator */}
      {swipeProgress < 0.1 && (
        <div
          style={{
            position: "absolute",
            bottom: isVertical ? 400 : 100,
            opacity: interpolate(frame % 60, [0, 30, 60], [0.3, 0.6, 0.3]),
            fontFamily,
            fontSize: 16,
            color: colors.muted,
            textTransform: "uppercase",
            letterSpacing: 2,
          }}
        >
        </div>
      )}
    </AbsoluteFill>
  );
};
