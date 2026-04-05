import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
} from "remotion";
import { baseTokens, BRAND, SCENE_DEFAULTS, TYPOGRAPHY } from "../styles";
import { SectionBadge } from "../components/SectionBadge";
import { TextEffect } from "../components/TextEffect";
import { entrances } from "../animations";
import { SceneBackground } from "../components/SceneBackground";
import { useLayoutMode } from "../formats";

type SectionTitleEntrance = "fadeUp" | "slideLeft" | "scaleBlur" | "neon";

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
  const { contentPadding, fontScale } = useLayoutMode();

  const titleP = spring({
    frame: frame - 8,
    fps,
    config: SCENE_DEFAULTS.springSmooth,
  });
  const clampedP = interpolate(titleP, [0, 1], [0, 1], {
    extrapolateRight: "clamp",
  });

  let titleStyle: React.CSSProperties = {};
  let titleContent: React.ReactNode;

  if (entrance === "neon") {
    titleContent = (
      <TextEffect effect="neon" text={title} color={colors.accent} fontSize={Math.round(56 * fontScale)} fontFamily={fontFamily} />
    );
  } else if (entrance === "slideLeft") {
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

  if (entrance !== "neon") {
    titleContent = (
      <div
        style={{
          ...titleStyle,
          fontFamily,
          fontSize: Math.round(56 * fontScale),
          fontWeight: 800,
          color: colors.text,
          textAlign: "center",
          lineHeight: TYPOGRAPHY.lineHeights.tight,
          marginTop: 8,
        }}
      >
        {title}
      </div>
    );
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
    <SceneBackground bg={colors.bg}>
      <AbsoluteFill
        style={{
          justifyContent: "center",
          alignItems: "center",
          padding: contentPadding,
          gap: 24,
        }}
      >
        <SectionBadge number={sectionNumber} color={colors.accent} fontFamily={fontFamily} />
        {titleContent}
        {subtitle && (
          <div
            style={{
              opacity: subOpacity,
              fontFamily,
              fontSize: Math.round(26 * fontScale),
              color: colors.muted,
              textAlign: "center",
            }}
          >
            {subtitle}
          </div>
        )}
      </AbsoluteFill>
    </SceneBackground>
  );
};
