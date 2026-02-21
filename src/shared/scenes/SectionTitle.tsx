import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
} from "remotion";
import { BRAND, SCENE_DEFAULTS } from "../styles";
import { SectionBadge } from "../components/SectionBadge";

type SectionTitleProps = {
  sectionNumber: number;
  title: string;
  subtitle?: string;
  totalSections?: number;
  colors?: { bg: string; text: string; accent: string; muted: string };
  fontFamily?: string;
};

export const SectionTitle: React.FC<SectionTitleProps> = ({
  sectionNumber,
  title,
  subtitle,
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

  const titleP = spring({
    frame: frame - 8,
    fps,
    config: SCENE_DEFAULTS.springSmooth,
  });
  const titleOpacity = interpolate(titleP, [0, 1], [0, 1], {
    extrapolateRight: "clamp",
  });
  const titleY = interpolate(titleP, [0, 1], [30, 0], {
    extrapolateRight: "clamp",
  });

  const subP = spring({
    frame: frame - 18,
    fps,
    config: SCENE_DEFAULTS.springSmooth,
  });
  const subOpacity = interpolate(subP, [0, 1], [0, 1], {
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
        gap: 24,
      }}
    >
      <SectionBadge number={sectionNumber} color={colors.accent} fontFamily={fontFamily} />
      <div
        style={{
          opacity: titleOpacity,
          transform: `translateY(${titleY}px)`,
          fontFamily,
          fontSize: 56,
          fontWeight: 800,
          color: colors.text,
          textAlign: "center",
          lineHeight: 1.15,
          marginTop: 8,
        }}
      >
        {title}
      </div>
      {subtitle && (
        <div
          style={{
            opacity: subOpacity,
            fontFamily,
            fontSize: 26,
            color: colors.muted,
            textAlign: "center",
          }}
        >
          {subtitle}
        </div>
      )}
    </AbsoluteFill>
  );
};
