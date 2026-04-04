/**
 * LayoutFrameInFrame - フレーム・イン・フレーム
 */

import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";
import { BRAND, DEFAULT_SCENE_COLORS, type SceneColors } from "../../styles";
import { loadFont } from "@remotion/google-fonts/Inter";
const { fontFamily } = loadFont();

export const LayoutFrameInFrame = ({
  startDelay = 0,
  title = "FRAME",
  subtitle = "INTRODUCING",
  colors: colorsProp,
  sectionColor,
}: {
  startDelay?: number;
  title?: string;
  subtitle?: string;
  colors?: SceneColors;
  sectionColor?: string;
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const colors = { ...DEFAULT_SCENE_COLORS, ...colorsProp };
  const accent = sectionColor || colors.accent;

  const outerProgress = spring({
    frame: frame - startDelay,
    fps,
    config: { damping: 20, stiffness: 100 },
  });

  const innerProgress = spring({
    frame: frame - startDelay - 15,
    fps,
    config: { damping: 15, stiffness: 150 },
  });

  return (
    <AbsoluteFill style={{ background: colors.bg }}>
      {/* 外側のフレーム */}
      <div
        style={{
          position: "absolute",
          left: 40,
          top: 40,
          right: 40,
          bottom: 40,
          border: `1px solid ${BRAND.cardBg}`,
          transform: `scale(${outerProgress})`,
          opacity: outerProgress,
        }}
      >
        {/* コーナー装飾 */}
        <div style={{ position: "absolute", left: -1, top: -1, width: 30, height: 30, borderLeft: `3px solid ${accent}`, borderTop: `3px solid ${accent}` }} />
        <div style={{ position: "absolute", right: -1, top: -1, width: 30, height: 30, borderRight: `3px solid ${accent}`, borderTop: `3px solid ${accent}` }} />
        <div style={{ position: "absolute", left: -1, bottom: -1, width: 30, height: 30, borderLeft: `3px solid ${accent}`, borderBottom: `3px solid ${accent}` }} />
        <div style={{ position: "absolute", right: -1, bottom: -1, width: 30, height: 30, borderRight: `3px solid ${accent}`, borderBottom: `3px solid ${accent}` }} />
      </div>

      {/* 内側のフレーム */}
      <div
        style={{
          position: "absolute",
          left: 120,
          top: 120,
          right: 120,
          bottom: 120,
          border: `2px solid ${colors.text}`,
          transform: `scale(${innerProgress})`,
          opacity: innerProgress,
        }}
      >
        {/* コンテンツ */}
        <div
          style={{
            position: "absolute",
            left: "50%",
            top: "50%",
            transform: "translate(-50%, -50%)",
            textAlign: "center",
          }}
        >
          <div
            style={{
              fontFamily,
              fontSize: 20,
              color: colors.muted,
              letterSpacing: 6,
              marginBottom: 20,
            }}
          >
            {subtitle}
          </div>
          <div
            style={{
              fontFamily,
              fontSize: 80,
              fontWeight: 700,
              color: colors.text,
            }}
          >
            {title}
          </div>
        </div>
      </div>

      {/* 外側の情報 */}
      <div
        style={{
          position: "absolute",
          left: 60,
          bottom: 60,
          fontFamily,
          fontSize: 20,
          color: BRAND.border,
          letterSpacing: 2,
          opacity: interpolate(frame, [startDelay + 30, startDelay + 50], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
        }}
      >
        VOL.01 — 2024
      </div>
    </AbsoluteFill>
  );
};
