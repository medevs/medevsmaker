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
import { entrances } from "../animations";

type SectionTitleEntrance = "fadeUp" | "slideLeft" | "scaleBlur";

type SectionTitleProps = {
  sectionNumber: number;
  title: string;
  subtitle?: string;
  totalSections?: number;
  colors?: { bg: string; text: string; accent: string; muted: string };
  fontFamily?: string;
  entrance?: SectionTitleEntrance;
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
  entrance = "fadeUp",
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleP = spring({
    frame: frame - 8,
    fps,
    config: SCENE_DEFAULTS.springSmooth,
  });
  const clampedP = interpolate(titleP, [0, 1], [0, 1], {
    extrapolateRight: "clamp",
  });

  let titleStyle: React.CSSProperties;

  if (entrance === "slideLeft") {
    const s = entrances.fadeLeft(clampedP);
    titleStyle = { opacity: s.opacity, transform: s.transform };
  } else if (entrance === "scaleBlur") {
    const s = entrances.blurFade(clampedP);
    titleStyle = {
      opacity: s.opacity,
      transform: s.transform,
      filter: s.filter,
    };
  } else {
    // Default "fadeUp" — original behavior
    const titleY = interpolate(titleP, [0, 1], [30, 0], {
      extrapolateRight: "clamp",
    });
    titleStyle = {
      opacity: clampedP,
      transform: `translateY(${titleY}px)`,
    };
  }

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
          ...titleStyle,
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
