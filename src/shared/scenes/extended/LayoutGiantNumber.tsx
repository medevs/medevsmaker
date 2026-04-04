/**
 * LayoutGiantNumber - 巨大数字 + テキスト - データ強調レイアウト
 */

import { AbsoluteFill, useCurrentFrame, interpolate, Easing } from "remotion";
import { BRAND } from "../../styles";
import { loadFont } from "@remotion/google-fonts/Inter";
const { fontFamily } = loadFont();

export const LayoutGiantNumber = ({ startDelay = 0, number = "97", label = "CUSTOMER SATISFACTION", description = "Based on 10,000+ reviews from verified customers worldwide." }: {
  startDelay?: number;
  number?: string;
  label?: string;
  description?: string;
}) => {
  const frame = useCurrentFrame();

  const numberProgress = interpolate(frame, [startDelay, startDelay + 40], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.bezier(0.6, 0.01, 0.05, 0.95) });
  const textProgress = interpolate(frame, [startDelay + 20, startDelay + 50], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.bezier(0.16, 1, 0.3, 1) });

  return (
    <AbsoluteFill style={{ background: BRAND.text }}>
      {/* 巨大な数字（画面をはみ出す） */}
      <div
        style={{
          position: "absolute",
          right: -80,
          top: "50%",
          transform: `translateY(-50%) scale(${0.8 + numberProgress * 0.2})`,
          fontFamily,
          fontSize: 500,
          fontWeight: 900,
          color: "#e2e8f0",
          lineHeight: 0.8,
          opacity: numberProgress,
        }}
      >
        {number}
      </div>

      {/* 左側のテキスト情報 */}
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
            fontSize: 14,
            fontWeight: 500,
            color: BRAND.indigo,
            letterSpacing: 4,
            marginBottom: 20,
          }}
        >
          {label}
        </div>
        <div
          style={{
            fontFamily,
            fontSize: 60,
            fontWeight: 700,
            color: BRAND.bg,
            lineHeight: 1.1,
          }}
        >
          Percent
          <br />
          <span style={{ color: BRAND.indigo }}>Happy</span>
        </div>
        <div
          style={{
            fontFamily,
            fontSize: 16,
            color: "#475569",
            marginTop: 30,
            maxWidth: 300,
            lineHeight: 1.7,
          }}
        >
          {description}
        </div>
      </div>

      {/* 上部のライン */}
      <div
        style={{
          position: "absolute",
          left: 80,
          top: 60,
          width: interpolate(frame, [startDelay + 30, startDelay + 60], [0, 200], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.bezier(0.16, 1, 0.3, 1) }),
          height: 4,
          background: BRAND.bg,
        }}
      />
    </AbsoluteFill>
  );
};
