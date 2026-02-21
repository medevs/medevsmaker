import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
} from "remotion";
import { BRAND, SCENE_DEFAULTS, GRADIENTS } from "../styles";
import { entrances } from "../animations";

type TitleEntrance = "fadeUp" | "scaleRotate" | "splitReveal";

type TitleIntroProps = {
  title: string;
  objectives: string[];
  colors?: { bg: string; text: string; accent: string; muted: string };
  fontFamily?: string;
  entrance?: TitleEntrance;
};

export const TitleIntro: React.FC<TitleIntroProps> = ({
  title,
  objectives,
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

  const titleP = spring({ frame, fps, config: SCENE_DEFAULTS.springSmooth });
  const clampedP = interpolate(titleP, [0, 1], [0, 1], {
    extrapolateRight: "clamp",
  });

  let titleStyle: React.CSSProperties;

  if (entrance === "scaleRotate") {
    const s = entrances.scaleRotate(clampedP);
    titleStyle = { opacity: s.opacity, transform: s.transform };
  } else if (entrance === "splitReveal") {
    // Title splits from center with clip-path
    const revealWidth = interpolate(clampedP, [0, 1], [0, 100], {
      extrapolateRight: "clamp",
    });
    titleStyle = {
      opacity: 1,
      clipPath: `inset(0 ${100 - revealWidth}% 0 0)`,
    };
  } else {
    // Default "fadeUp" — original behavior
    const titleY = interpolate(titleP, [0, 1], [40, 0]);
    titleStyle = {
      opacity: clampedP,
      transform: `translateY(${titleY}px)`,
    };
  }

  const lineP = spring({
    frame: frame - 12,
    fps,
    config: SCENE_DEFAULTS.springSmooth,
  });
  const lineWidth = interpolate(lineP, [0, 1], [0, 200], {
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
      <div
        style={{
          ...titleStyle,
          fontFamily,
          fontSize: 64,
          fontWeight: 800,
          color: colors.text,
          textAlign: "center",
          lineHeight: 1.15,
        }}
      >
        {title}
      </div>

      <div
        style={{
          width: lineWidth,
          height: 4,
          backgroundColor: colors.accent,
          borderRadius: 2,
        }}
      />

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 12,
        }}
      >
        {objectives.map((obj, i) => {
          const objP = spring({
            frame: frame - 20 - i * SCENE_DEFAULTS.staggerDelay,
            fps,
            config: SCENE_DEFAULTS.springSmooth,
          });
          const objOpacity = interpolate(objP, [0, 1], [0, 1], {
            extrapolateRight: "clamp",
          });
          return (
            <div
              key={i}
              style={{
                opacity: objOpacity,
                fontFamily,
                fontSize: 26,
                color: colors.muted,
                textAlign: "center",
              }}
            >
              {obj}
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
