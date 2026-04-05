import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
} from "remotion";
import { baseTokens, BRAND, SCENE_DEFAULTS, TYPOGRAPHY } from "../styles";
import { SceneBackground } from "../components/SceneBackground";
import { entrances } from "../animations";
import { useLayoutMode } from "../formats";

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
  const { contentPadding, fontScale } = useLayoutMode();

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
    <SceneBackground bg={colors.bg}>
    <AbsoluteFill
      style={{
        justifyContent: "center",
        alignItems: "center",
        padding: contentPadding,
      }}
    >
      <div
        style={{
          ...questionStyle,
          fontFamily,
          fontSize: Math.round(72 * fontScale),
          fontWeight: 800,
          color: colors.text,
          textAlign: "center",
          lineHeight: TYPOGRAPHY.lineHeights.tight,
        }}
      >
        {question}
      </div>
      {subtext && (
        <div
          style={{
            opacity: stOpacity,
            fontFamily,
            fontSize: Math.round(30 * fontScale),
            color: colors.accent,
            textAlign: "center",
            marginTop: 24,
          }}
        >
          {subtext}
        </div>
      )}
    </AbsoluteFill>
    </SceneBackground>
  );
};
