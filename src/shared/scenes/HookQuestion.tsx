import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
} from "remotion";
import { BRAND, SCENE_DEFAULTS } from "../styles";
import { entrances } from "../animations";

type HookEntrance = "scale" | "blur" | "fadeUp";

type HookQuestionProps = {
  question: string;
  subtext?: string;
  colors?: { bg: string; text: string; accent: string };
  fontFamily?: string;
  entrance?: HookEntrance;
};

export const HookQuestion: React.FC<HookQuestionProps> = ({
  question,
  subtext,
  colors = { bg: BRAND.bg, text: BRAND.text, accent: BRAND.cyan },
  fontFamily = "Inter",
  entrance = "scale",
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const questionP = spring({
    frame,
    fps,
    config: SCENE_DEFAULTS.springSmooth,
  });
  const clampedP = interpolate(questionP, [0, 1], [0, 1], {
    extrapolateRight: "clamp",
  });

  let questionStyle: React.CSSProperties = {};

  if (entrance === "blur") {
    const s = entrances.blurFade(clampedP);
    questionStyle = {
      opacity: s.opacity,
      transform: s.transform,
      filter: s.filter,
    };
  } else if (entrance === "fadeUp") {
    const s = entrances.fadeUp(clampedP);
    questionStyle = {
      opacity: s.opacity,
      transform: s.transform,
    };
  } else {
    // Default "scale" — original behavior
    const qScale = interpolate(questionP, [0, 1], [0.9, 1]);
    questionStyle = {
      opacity: clampedP,
      transform: `scale(${qScale})`,
    };
  }

  const subtextP = spring({
    frame: frame - 15,
    fps,
    config: SCENE_DEFAULTS.springSmooth,
  });
  const stOpacity = interpolate(subtextP, [0, 1], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: colors.bg,
        justifyContent: "center",
        alignItems: "center",
        padding: 100,
      }}
    >
      <div
        style={{
          ...questionStyle,
          fontFamily,
          fontSize: 72,
          fontWeight: 800,
          color: colors.text,
          textAlign: "center",
          lineHeight: 1.15,
        }}
      >
        {question}
      </div>
      {subtext && (
        <div
          style={{
            opacity: stOpacity,
            fontFamily,
            fontSize: 30,
            color: colors.accent,
            textAlign: "center",
            marginTop: 24,
          }}
        >
          {subtext}
        </div>
      )}
    </AbsoluteFill>
  );
};
