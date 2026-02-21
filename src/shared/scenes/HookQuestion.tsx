import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
} from "remotion";
import { BRAND, SCENE_DEFAULTS } from "../styles";

type HookQuestionProps = {
  question: string;
  subtext?: string;
  colors?: { bg: string; text: string; accent: string };
  fontFamily?: string;
};

export const HookQuestion: React.FC<HookQuestionProps> = ({
  question,
  subtext,
  colors = { bg: BRAND.bg, text: BRAND.text, accent: BRAND.cyan },
  fontFamily = "Inter",
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const questionP = spring({
    frame,
    fps,
    config: SCENE_DEFAULTS.springSmooth,
  });
  const qOpacity = interpolate(questionP, [0, 1], [0, 1]);
  const qScale = interpolate(questionP, [0, 1], [0.9, 1]);

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
          opacity: qOpacity,
          transform: `scale(${qScale})`,
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
