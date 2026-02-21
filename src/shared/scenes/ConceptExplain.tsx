import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
} from "remotion";
import { BRAND, SCENE_DEFAULTS } from "../styles";

type ConceptExplainProps = {
  heading: string;
  body: string;
  analogy?: string;
  icon?: string;
  colors?: { bg: string; text: string; accent: string; muted: string };
  fontFamily?: string;
};

export const ConceptExplain: React.FC<ConceptExplainProps> = ({
  heading,
  body,
  analogy,
  icon,
  colors = {
    bg: BRAND.bg,
    text: BRAND.text,
    accent: BRAND.violet,
    muted: BRAND.textMuted,
  },
  fontFamily = "Inter",
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const headP = spring({ frame, fps, config: SCENE_DEFAULTS.springSmooth });
  const headOpacity = interpolate(headP, [0, 1], [0, 1]);
  const headY = interpolate(headP, [0, 1], [30, 0]);

  const bodyP = spring({
    frame: frame - 12,
    fps,
    config: SCENE_DEFAULTS.springSmooth,
  });
  const bodyOpacity = interpolate(bodyP, [0, 1], [0, 1], {
    extrapolateRight: "clamp",
  });
  const bodyY = interpolate(bodyP, [0, 1], [20, 0], {
    extrapolateRight: "clamp",
  });

  const analogyP = spring({
    frame: frame - 25,
    fps,
    config: SCENE_DEFAULTS.springSmooth,
  });
  const analogyOpacity = interpolate(analogyP, [0, 1], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: colors.bg,
        justifyContent: "center",
        padding: 80,
        gap: 24,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
        {icon && <span style={{ fontSize: 48 }}>{icon}</span>}
        <div
          style={{
            opacity: headOpacity,
            transform: `translateY(${headY}px)`,
            fontFamily,
            fontSize: 52,
            fontWeight: 800,
            color: colors.text,
            lineHeight: 1.15,
          }}
        >
          {heading}
        </div>
      </div>

      <div
        style={{
          opacity: bodyOpacity,
          transform: `translateY(${bodyY}px)`,
          fontFamily,
          fontSize: 30,
          color: colors.text,
          lineHeight: 1.6,
          maxWidth: 1200,
        }}
      >
        {body}
      </div>

      {analogy && (
        <div
          style={{
            opacity: analogyOpacity,
            fontFamily,
            fontSize: 26,
            color: colors.accent,
            fontStyle: "italic",
            marginTop: 8,
            paddingLeft: 20,
            borderLeft: `3px solid ${colors.accent}44`,
          }}
        >
          {analogy}
        </div>
      )}
    </AbsoluteFill>
  );
};
