/**
 * LayoutGiantNumber - 巨大数字 + テキスト - データ強調レイアウト
 */

import { AbsoluteFill, useCurrentFrame, interpolate, Easing } from "remotion";
import { BRAND, DEFAULT_SCENE_COLORS, type SceneColors, baseTokens } from "../styles";
import { useLayoutMode } from "../formats";
import { loadFont } from "@remotion/google-fonts/Inter";
const { fontFamily } = loadFont();

export const LayoutGiantNumber = ({ startDelay = 0, number = "97", label = "CUSTOMER SATISFACTION", description = "Based on 10,000+ reviews from verified customers worldwide.", colors: colorsProp, sectionColor }: {
  startDelay?: number;
  number?: string;
  label?: string;
  description?: string;
  colors?: SceneColors;
  sectionColor?: string;
}) => {
  const frame = useCurrentFrame();
  const { contentPadding, fontScale } = useLayoutMode();
  const colors = { ...DEFAULT_SCENE_COLORS, ...colorsProp };
  const accent = sectionColor || colors.accent;

  const numberProgress = interpolate(frame, [startDelay, startDelay + 40], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.bezier(0.6, 0.01, 0.05, 0.95) });
  const textProgress = interpolate(frame, [startDelay + 20, startDelay + 50], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.bezier(0.16, 1, 0.3, 1) });

  return (
    <AbsoluteFill style={{ background: colors.bg }}>
      {/* Giant number (overflows screen) */}
      <div
        style={{
          position: "absolute",
          right: -80,
          top: "50%",
          transform: `translateY(-50%) scale(${0.8 + numberProgress * 0.2})`,
          fontFamily,
          fontSize: Math.round(500 * fontScale),
          fontWeight: 900,
          color: `${colors.muted}40`,
          lineHeight: 0.8,
          opacity: numberProgress,
        }}
      >
        {number}
      </div>

      {/* Left side text */}
      <div
        style={{
          position: "absolute",
          left: 80,
          top: "50%",
          transform: `translateY(-50%) translateX(${(1 - textProgress) * -50}px)`,
          opacity: textProgress,
        }}
      >
        <div
          style={{
            fontFamily,
            fontSize: Math.round(20 * fontScale),
            fontWeight: 500,
            color: accent,
            letterSpacing: 4,
            marginBottom: 20,
          }}
        >
          {label}
        </div>
        <div
          style={{
            fontFamily,
            fontSize: Math.round(60 * fontScale),
            fontWeight: 700,
            color: colors.text,
            lineHeight: 1.1,
          }}
        >
          Percent
          <br />
          <span style={{ color: accent }}>Happy</span>
        </div>
        <div
          style={{
            fontFamily,
            fontSize: Math.round(20 * fontScale),
            color: colors.muted,
            marginTop: 30,
            maxWidth: 300,
            lineHeight: 1.7,
          }}
        >
          {description}
        </div>
      </div>

      {/* Top line */}
      <div
        style={{
          position: "absolute",
          left: 80,
          top: 60,
          width: interpolate(frame, [startDelay + 30, startDelay + 60], [0, 200], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.bezier(0.16, 1, 0.3, 1) }),
          height: 4,
          background: accent,
        }}
      />
    </AbsoluteFill>
  );
};
