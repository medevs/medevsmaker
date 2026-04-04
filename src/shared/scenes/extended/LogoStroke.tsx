/**
 * LogoStroke - ロゴストロークアニメーション
 */

import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { loadFont } from "@remotion/google-fonts/Inter";
import { BRAND, DEFAULT_SCENE_COLORS, type SceneColors } from "../../styles";

const { fontFamily } = loadFont();

export const LogoStroke = ({
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

  const easeOut = Easing.bezier(0.16, 1, 0.3, 1);
  const clampOpts = { extrapolateLeft: "clamp" as const, extrapolateRight: "clamp" as const };
  const strokeProgress = interpolate(frame, [startDelay, startDelay + 50], [0, 1], { ...clampOpts, easing: easeOut });
  const fillProgress = interpolate(frame, [startDelay + 40, startDelay + 60], [0, 1], { ...clampOpts, easing: easeOut });

  const displayText = text ?? "LOGO";
  const displaySubtitle = subtitle ?? "BRAND TAGLINE";

  return (
    <AbsoluteFill style={{ background: colors.bg }}>
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "50%",
          transform: "translate(-50%, -50%)",
        }}
      >
        <svg width="300" height="100" viewBox="0 0 300 100" aria-hidden="true">
          {/* ロゴパス */}
          <text
            x="150"
            y="70"
            textAnchor="middle"
            fontFamily={fontFamily}
            fontSize="72"
            fontWeight="800"
            fill="none"
            stroke={accent}
            strokeWidth="2"
            strokeDasharray="500"
            strokeDashoffset={500 - strokeProgress * 500}
          >
            {displayText}
          </text>
          <text
            x="150"
            y="70"
            textAnchor="middle"
            fontFamily={fontFamily}
            fontSize="72"
            fontWeight="800"
            fill={colors.text}
            opacity={fillProgress}
          >
            {displayText}
          </text>
        </svg>

        {/* タグライン */}
        <div
          style={{
            textAlign: "center",
            fontFamily,
            fontSize: 20,
            color: colors.muted,
            letterSpacing: 6,
            marginTop: 20,
            opacity: interpolate(frame, [startDelay + 50, startDelay + 70], [0, 1], clampOpts),
          }}
        >
          {displaySubtitle}
        </div>
      </div>
    </AbsoluteFill>
  );
};
