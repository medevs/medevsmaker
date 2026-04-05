/**
 * TextGlitch - グリッチテキスト - デジタルグリッチ効果
 */

import { AbsoluteFill, Easing, interpolate, useCurrentFrame, random } from "remotion";
import { loadFont } from "@remotion/google-fonts/Inter";
import { BRAND, DEFAULT_SCENE_COLORS, type SceneColors, baseTokens } from "../styles";
import { useLayoutMode } from "../formats";

const { fontFamily } = loadFont();

export const TextGlitch = ({
  text = "GLITCH",
  startDelay = 0,
  colors: colorsProp,
  sectionColor,
}: {
  text?: string;
  startDelay?: number;
  colors?: SceneColors;
  sectionColor?: string;
}) => {
  const frame = useCurrentFrame();
  const { contentPadding, fontScale } = useLayoutMode();

  const colors = { ...DEFAULT_SCENE_COLORS, ...colorsProp };
  const accent = sectionColor || colors.accent;

  const entryProgress = interpolate(frame, [startDelay, startDelay + 20], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.bezier(0.16, 1, 0.3, 1) });
  const glitchActive = frame > startDelay + 25 && random(`glitch-${frame}`) < 0.15;

  const offsetX = glitchActive ? (random(`gx-${frame}`) - 0.5) * 30 : 0;
  const offsetY = glitchActive ? (random(`gy-${frame}`) - 0.5) * 10 : 0;
  const skew = glitchActive ? (random(`gs-${frame}`) - 0.5) * 8 : 0;

  return (
    <AbsoluteFill style={{ background: colors.bg }}>
      {/* 赤チャンネル */}
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "50%",
          transform: `translate(-50%, -50%) translate(${offsetX + 3}px, ${offsetY}px)`,
          fontFamily,
          fontSize: Math.round(140 * fontScale),
          fontWeight: 900,
          color: "rgba(255, 0, 0, 0.8)",
          mixBlendMode: "screen",
          opacity: glitchActive ? 1 : 0,
        }}
      >
        {text}
      </div>

      {/* シアンチャンネル */}
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "50%",
          transform: `translate(-50%, -50%) translate(${-offsetX - 3}px, ${-offsetY}px)`,
          fontFamily,
          fontSize: Math.round(140 * fontScale),
          fontWeight: 900,
          color: "rgba(0, 255, 255, 0.8)",
          mixBlendMode: "screen",
          opacity: glitchActive ? 1 : 0,
        }}
      >
        {text}
      </div>

      {/* メインテキスト */}
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "50%",
          transform: `
            translate(-50%, -50%)
            translate(${offsetX}px, ${offsetY}px)
            skewX(${skew}deg)
            scale(${entryProgress})
          `,
          fontFamily,
          fontSize: Math.round(140 * fontScale),
          fontWeight: 900,
          color: colors.text,
        }}
      >
        {text}
      </div>

      {/* スキャンライン */}
      {glitchActive && (
        <AbsoluteFill
          style={{
            background: `repeating-linear-gradient(
              0deg,
              transparent,
              transparent 2px,
              rgba(0, 0, 0, 0.3) 2px,
              rgba(0, 0, 0, 0.3) 4px
            )`,
          }}
        />
      )}

      {/* ノイズバー */}
      {glitchActive && (
        <>
          {[10, 40, 70].map((offset) => (
            <div
              key={`noise-bar-${offset}`}
              style={{
                position: "absolute",
                left: 0,
                top: `${random(`nb-${frame}-${offset}`) * 100}%`,
                width: "100%",
                height: random(`nbh-${frame}-${offset}`) * 20 + 5,
                background: colors.text,
                opacity: 0.1,
              }}
            />
          ))}
        </>
      )}
    </AbsoluteFill>
  );
};
