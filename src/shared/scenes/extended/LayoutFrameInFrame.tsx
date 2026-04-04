/**
 * LayoutFrameInFrame - フレーム・イン・フレーム
 */

import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";
import { BRAND } from "../../styles";
import { loadFont } from "@remotion/google-fonts/Inter";
const { fontFamily } = loadFont();

export const LayoutFrameInFrame = ({ startDelay = 0, title = "FRAME", subtitle = "INTRODUCING" }: {
  startDelay?: number;
  title?: string;
  subtitle?: string;
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

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
    <AbsoluteFill style={{ background: BRAND.bg }}>
      {/* 外側のフレーム */}
      <div
        style={{
          position: "absolute",
          left: 40,
          top: 40,
          right: 40,
          bottom: 40,
          border: `1px solid #1e1e30`,
          transform: `scale(${outerProgress})`,
          opacity: outerProgress,
        }}
      >
        {/* コーナー装飾 */}
        <div style={{ position: "absolute", left: -1, top: -1, width: 30, height: 30, borderLeft: `3px solid ${BRAND.indigo}`, borderTop: `3px solid ${BRAND.indigo}` }} />
        <div style={{ position: "absolute", right: -1, top: -1, width: 30, height: 30, borderRight: `3px solid ${BRAND.indigo}`, borderTop: `3px solid ${BRAND.indigo}` }} />
        <div style={{ position: "absolute", left: -1, bottom: -1, width: 30, height: 30, borderLeft: `3px solid ${BRAND.indigo}`, borderBottom: `3px solid ${BRAND.indigo}` }} />
        <div style={{ position: "absolute", right: -1, bottom: -1, width: 30, height: 30, borderRight: `3px solid ${BRAND.indigo}`, borderBottom: `3px solid ${BRAND.indigo}` }} />
      </div>

      {/* 内側のフレーム */}
      <div
        style={{
          position: "absolute",
          left: 120,
          top: 120,
          right: 120,
          bottom: 120,
          border: `2px solid ${BRAND.text}`,
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
              fontSize: 14,
              color: "#475569",
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
              color: BRAND.text,
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
          fontSize: 11,
          color: "#334155",
          letterSpacing: 2,
          opacity: interpolate(frame, [startDelay + 30, startDelay + 50], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
        }}
      >
        VOL.01 — 2024
      </div>
    </AbsoluteFill>
  );
};
