import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
} from "remotion";
import { BRAND, SCENE_DEFAULTS } from "../styles";
import { StatCounter } from "../components/StatCounter";

type StatHighlightProps = {
  stat: number;
  suffix?: string;
  prefix?: string;
  label: string;
  context?: string;
  colors?: { bg: string; text: string; accent: string; muted: string };
  fontFamily?: string;
};

export const StatHighlight: React.FC<StatHighlightProps> = ({
  stat,
  suffix = "",
  prefix = "",
  label,
  context,
  colors = {
    bg: BRAND.bg,
    text: BRAND.text,
    accent: BRAND.cyan,
    muted: BRAND.textMuted,
  },
  fontFamily = "Inter",
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const contextP = spring({
    frame: frame - 20,
    fps,
    config: SCENE_DEFAULTS.springSmooth,
  });
  const contextOpacity = interpolate(contextP, [0, 1], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: colors.bg,
        justifyContent: "center",
        alignItems: "center",
        padding: 80,
        gap: 32,
      }}
    >
      <StatCounter
        target={stat}
        suffix={suffix}
        prefix={prefix}
        label={label}
        color={colors.accent}
        fontFamily={fontFamily}
      />
      {context && (
        <div
          style={{
            opacity: contextOpacity,
            fontFamily,
            fontSize: 26,
            color: colors.muted,
            textAlign: "center",
            maxWidth: 800,
            lineHeight: 1.4,
          }}
        >
          {context}
        </div>
      )}
    </AbsoluteFill>
  );
};
