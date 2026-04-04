/**
 * EffectChromaticAberration - 色収差 - クロマティックアベレーション
 */

import { AbsoluteFill, useCurrentFrame, interpolate } from "remotion";
import { BRAND } from "../../styles";
import { loadFont } from "@remotion/google-fonts/Inter";
const { fontFamily } = loadFont();

export const EffectChromaticAberration = ({ startDelay = 0, text = "CHROMATIC" }: {
  startDelay?: number;
  text?: string;
}) => {
  const frame = useCurrentFrame();

  const aberrationAmount = Math.sin((frame - startDelay) * 0.1) * 8 + 8;
  const textOpacity = interpolate(frame, [startDelay, startDelay + 20], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ background: BRAND.bg }}>
      {/* 赤チャンネル */}
      <AbsoluteFill
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transform: `translateX(${aberrationAmount}px)`,
        }}
      >
        <div
          style={{
            fontFamily,
            fontSize: 120,
            fontWeight: 900,
            color: "rgba(255, 0, 0, 0.7)",
            mixBlendMode: "screen",
            opacity: textOpacity,
          }}
        >
          {text}
        </div>
      </AbsoluteFill>

      {/* 緑チャンネル */}
      <AbsoluteFill
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            fontFamily,
            fontSize: 120,
            fontWeight: 900,
            color: "rgba(0, 255, 0, 0.7)",
            mixBlendMode: "screen",
            opacity: textOpacity,
          }}
        >
          {text}
        </div>
      </AbsoluteFill>

      {/* 青チャンネル */}
      <AbsoluteFill
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transform: `translateX(${-aberrationAmount}px)`,
        }}
      >
        <div
          style={{
            fontFamily,
            fontSize: 120,
            fontWeight: 900,
            color: "rgba(0, 0, 255, 0.7)",
            mixBlendMode: "screen",
            opacity: textOpacity,
          }}
        >
          {text}
        </div>
      </AbsoluteFill>

      {/* サブテキスト */}
      <div
        style={{
          position: "absolute",
          left: "50%",
          bottom: 150,
          transform: "translateX(-50%)",
          fontFamily,
          fontSize: 18,
          color: "#475569",
          letterSpacing: 6,
          opacity: interpolate(frame, [startDelay + 30, startDelay + 50], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
        }}
      >
        ABERRATION EFFECT
      </div>
    </AbsoluteFill>
  );
};
