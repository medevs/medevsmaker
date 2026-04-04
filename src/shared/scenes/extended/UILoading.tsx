/**
 * UILoading - ローディングアニメーション
 */

import { AbsoluteFill, useCurrentFrame } from "remotion";
import { loadFont } from "@remotion/google-fonts/Inter";
import { BRAND } from "../../styles";

const { fontFamily } = loadFont();

export const UILoading = ({ startDelay = 0, text = "LOADING STATES" }: {
  startDelay?: number;
  text?: string;
}) => {
  const frame = useCurrentFrame();

  const spinnerRotation = (frame - startDelay) * 6;
  const dotCount = 3;
  const dotDelay = 8;

  return (
    <AbsoluteFill style={{ background: "#0f0f1a" }}>
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "40%",
          transform: "translate(-50%, -50%)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 60,
        }}
      >
        {/* スピナー */}
        <div
          style={{
            width: 60,
            height: 60,
            border: `4px solid #1e1e30`,
            borderTopColor: BRAND.indigo,
            borderRadius: "50%",
            transform: `rotate(${spinnerRotation}deg)`,
          }}
        />

        {/* ドットローダー */}
        <div style={{ display: "flex", gap: 12 }}>
          {Array.from({ length: dotCount }).map((_, i) => {
            const bounce = Math.sin((frame - startDelay - i * dotDelay) * 0.2) * 10;
            return (
              <div
                key={`dot-${i}-loader`}
                style={{
                  width: 12,
                  height: 12,
                  background: BRAND.indigo,
                  borderRadius: "50%",
                  transform: `translateY(${bounce}px)`,
                }}
              />
            );
          })}
        </div>

        {/* プログレスバー */}
        <div
          style={{
            width: 200,
            height: 6,
            background: "#1e1e30",
            borderRadius: 3,
            overflow: "hidden",
          }}
        >
          <div
            style={{
              width: `${((frame - startDelay) % 100)}%`,
              height: "100%",
              background: `linear-gradient(90deg, ${BRAND.indigo}, ${BRAND.violet})`,
              borderRadius: 3,
            }}
          />
        </div>

        {/* スケルトン */}
        <div
          style={{
            width: 300,
            display: "flex",
            flexDirection: "column",
            gap: 12,
          }}
        >
          {[100, 80, 60].map((width) => {
            const shimmerX = ((frame - startDelay) * 3) % 400 - 100;
            return (
              <div
                key={`skeleton-${width}`}
                style={{
                  width: `${width}%`,
                  height: 16,
                  background: "#1e1e30",
                  borderRadius: 4,
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    left: shimmerX,
                    top: 0,
                    width: 100,
                    height: "100%",
                    background: `linear-gradient(90deg, transparent, #2e2e44, transparent)`,
                  }}
                />
              </div>
            );
          })}
        </div>
      </div>

      <div
        style={{
          position: "absolute",
          bottom: 60,
          left: "50%",
          transform: "translateX(-50%)",
          fontFamily,
          fontSize: 14,
          color: "#334155",
          letterSpacing: 2,
        }}
      >
        {text}
      </div>
    </AbsoluteFill>
  );
};
