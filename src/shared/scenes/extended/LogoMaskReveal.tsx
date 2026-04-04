/**
 * LogoMaskReveal - ロゴマスクリビール
 */

import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { loadFont } from "@remotion/google-fonts/Inter";
import { BRAND, DEFAULT_SCENE_COLORS, type SceneColors } from "../../styles";

const { fontFamily } = loadFont();

export const LogoMaskReveal = ({
  startDelay = 0,
  text,
  subtitle,
  colors: colorsProp,
  sectionColor,
}: {
  startDelay?: number;
  text?: string;
  subtitle?: string;
  colors?: SceneColors;
  sectionColor?: string;
}) => {
  const frame = useCurrentFrame();

  const colors = { ...DEFAULT_SCENE_COLORS, ...colorsProp };
  const accent = sectionColor || colors.accent;

  const maskProgress = interpolate(frame, [startDelay, startDelay + 40], [0, 100], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.bezier(0.16, 1, 0.3, 1) });

  const displayText = text ?? "BRAND";

  return (
    <AbsoluteFill style={{ background: colors.bg }}>
      {/* 背景パターン */}
      <AbsoluteFill
        style={{
          backgroundImage: `
            linear-gradient(${BRAND.bgLight} 1px, transparent 1px),
            linear-gradient(90deg, ${BRAND.bgLight} 1px, transparent 1px)
          `,
          backgroundSize: "40px 40px",
          opacity: 0.5,
        }}
      />

      {/* マスクされたロゴ */}
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "50%",
          transform: "translate(-50%, -50%)",
          clipPath: `inset(0 ${100 - maskProgress}% 0 0)`,
        }}
      >
        <div
          style={{
            fontFamily,
            fontSize: 120,
            fontWeight: 900,
            background: `linear-gradient(135deg, ${accent}, ${BRAND.violet})`,
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          {displayText}
        </div>
      </div>

      {/* リビールライン */}
      <div
        style={{
          position: "absolute",
          left: `calc(50% - 200px + ${maskProgress * 4}px)`,
          top: "50%",
          width: 4,
          height: 150,
          background: colors.text,
          transform: "translateY(-50%)",
          opacity: maskProgress < 100 ? 1 : 0,
          boxShadow: `0 0 20px ${colors.text}`,
        }}
      />
    </AbsoluteFill>
  );
};
