/**
 * UILoading - ローディングアニメーション
 */

import { AbsoluteFill, useCurrentFrame } from "remotion";
import { loadFont } from "@remotion/google-fonts/Inter";
import { BRAND, DEFAULT_SCENE_COLORS, type SceneColors } from "../../styles";

const { fontFamily } = loadFont();

export const UILoading = ({
  startDelay = 0,
  text = "LOADING STATES",
  colors: colorsProp,
  sectionColor,
}: {
  startDelay?: number;
  text?: string;
  colors?: SceneColors;
  sectionColor?: string;
}) => {
  const frame = useCurrentFrame();

  const colors = { ...DEFAULT_SCENE_COLORS, ...colorsProp };
  const accent = sectionColor || colors.accent;

  const spinnerRotation = (frame - startDelay) * 6;
  const dotCount = 3;
  const dotDelay = 8;

  return (
    <AbsoluteFill style={{ background: colors.bg }}>
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
            border: `4px solid ${BRAND.cardBg}`,
            borderTopColor: accent,
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
                  background: accent,
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
            background: BRAND.cardBg,
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
                  background: BRAND.cardBg,
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
                    background: `linear-gradient(90deg, transparent, ${BRAND.border}, transparent)`,
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
          fontSize: 20, /* intentional: simulates UI */
          color: colors.muted,
          letterSpacing: 2,
        }}
      >
        {text}
      </div>
    </AbsoluteFill>
  );
};
