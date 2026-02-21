import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
} from "remotion";
import { BRAND, SCENE_DEFAULTS } from "../styles";

type SummaryRecapProps = {
  heading?: string;
  items: string[];
  colors?: { bg: string; text: string; accent: string; muted: string };
  fontFamily?: string;
};

export const SummaryRecap: React.FC<SummaryRecapProps> = ({
  heading = "What We Covered",
  items,
  colors = {
    bg: BRAND.bg,
    text: BRAND.text,
    accent: BRAND.indigo,
    muted: BRAND.textMuted,
  },
  fontFamily = "Inter",
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const headP = spring({ frame, fps, config: SCENE_DEFAULTS.springSmooth });
  const headOpacity = interpolate(headP, [0, 1], [0, 1]);
  const headY = interpolate(headP, [0, 1], [30, 0]);

  return (
    <AbsoluteFill
      style={{
        backgroundColor: colors.bg,
        justifyContent: "center",
        padding: 80,
        gap: 28,
      }}
    >
      <div
        style={{
          opacity: headOpacity,
          transform: `translateY(${headY}px)`,
          fontFamily,
          fontSize: 52,
          fontWeight: 800,
          color: colors.text,
          marginBottom: 8,
        }}
      >
        {heading}
      </div>
      {items.map((item, i) => {
        const itemDelay = 10 + i * SCENE_DEFAULTS.staggerDelay;
        const itemP = spring({
          frame: frame - itemDelay,
          fps,
          config: SCENE_DEFAULTS.springSmooth,
        });
        const itemOpacity = interpolate(itemP, [0, 1], [0, 1], {
          extrapolateRight: "clamp",
        });
        const itemX = interpolate(itemP, [0, 1], [-30, 0], {
          extrapolateRight: "clamp",
        });

        return (
          <div
            key={i}
            style={{
              opacity: itemOpacity,
              transform: `translateX(${itemX}px)`,
              display: "flex",
              alignItems: "center",
              gap: 16,
            }}
          >
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: 10,
                backgroundColor: colors.accent,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontFamily,
                fontSize: 18,
                fontWeight: 700,
                color: "#ffffff",
                flexShrink: 0,
              }}
            >
              {i + 1}
            </div>
            <span
              style={{
                fontFamily,
                fontSize: 30,
                color: colors.text,
                lineHeight: 1.3,
              }}
            >
              {item}
            </span>
          </div>
        );
      })}
    </AbsoluteFill>
  );
};
