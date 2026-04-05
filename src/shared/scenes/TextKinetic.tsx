/**
 * TextKinetic - キネティックタイポグラフィ - 文字が踊る
 */

import { AbsoluteFill, useCurrentFrame, useVideoConfig, Easing, interpolate, spring } from "remotion";

import { loadFont } from "@remotion/google-fonts/Inter";
import { BRAND, DEFAULT_SCENE_COLORS, type SceneColors, baseTokens } from "../styles";
import { useLayoutMode } from "../formats";

const { fontFamily } = loadFont();

export const TextKinetic = ({
  text = "KINETIC",
  words,
  startDelay = 0,
  colors: colorsProp,
  sectionColor,
}: {
  text?: string;
  words?: string[];
  startDelay?: number;
  colors?: SceneColors;
  sectionColor?: string;
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { contentPadding, fontScale } = useLayoutMode();

  const colors = { ...DEFAULT_SCENE_COLORS, ...colorsProp };
  const accent = sectionColor || colors.accent;

  const sceneEntrance = interpolate(frame, [0, 3], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const displayText = words ? words.join(" ") : text;
  const chars = displayText.split("");

  return (
    <AbsoluteFill style={{ background: colors.bg, opacity: sceneEntrance }}>
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "50%",
          transform: "translate(-50%, -50%)",
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          gap: 8,
        }}
      >
        {chars.map((char, i) => {
          const delay = startDelay + i * 3;
          const progress = spring({
            frame: frame - delay,
            fps,
            config: { damping: 12, stiffness: 200, mass: 0.8 },
          });

          const bounce = Math.sin((frame - delay) * 0.15) * 5 * progress;
          const rotate = Math.sin((frame - delay) * 0.1 + i) * 3 * progress;

          return (
            <span
              key={`kinetic-${i}-${char}`}
              style={{
                fontFamily,
                fontSize: Math.round((chars.length > 30 ? 48 : chars.length > 15 ? 72 : 120) * fontScale),
                fontWeight: 800,
                color: colors.text,
                display: "inline-block",
                transform: `
                  translateY(${interpolate(progress, [0, 1], [80, 0])}px)
                  translateY(${bounce}px)
                  rotate(${rotate}deg)
                  scale(${progress})
                `,
                opacity: progress,
              }}
            >
              {char}
            </span>
          );
        })}
      </div>

      {/* アンダーライン */}
      <div
        style={{
          position: "absolute",
          left: "50%",
          bottom: "35%",
          transform: "translateX(-50%)",
          width: interpolate(frame, [startDelay + 30, startDelay + 50], [0, 400], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.bezier(0.16, 1, 0.3, 1) }),
          height: 6,
          background: accent,
          borderRadius: 3,
        }}
      />
    </AbsoluteFill>
  );
};
