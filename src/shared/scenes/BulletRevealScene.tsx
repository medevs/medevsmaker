import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
} from "remotion";
import { BRAND, SCENE_DEFAULTS } from "../styles";
import { BulletReveal } from "../components/BulletReveal";

type BulletRevealSceneProps = {
  heading: string;
  items: string[];
  bulletStyle?: "dot" | "check" | "arrow" | "number";
  colors?: { bg: string; text: string; accent: string };
  fontFamily?: string;
};

export const BulletRevealScene: React.FC<BulletRevealSceneProps> = ({
  heading,
  items,
  bulletStyle = "dot",
  colors = { bg: BRAND.bg, text: BRAND.text, accent: BRAND.cyan },
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
        gap: 32,
      }}
    >
      <div
        style={{
          opacity: headOpacity,
          transform: `translateY(${headY}px)`,
          fontFamily,
          fontSize: 48,
          fontWeight: 800,
          color: colors.text,
        }}
      >
        {heading}
      </div>
      <BulletReveal
        items={items.map((text) => ({ text }))}
        delay={12}
        bulletColor={colors.accent}
        fontFamily={fontFamily}
        style={bulletStyle}
      />
    </AbsoluteFill>
  );
};
