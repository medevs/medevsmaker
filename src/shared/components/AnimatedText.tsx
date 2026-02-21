import React from "react";
import { useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";
import { SHADOWS, GRADIENTS } from "../styles";
import { entrances, type EntranceName } from "../animations";

interface AnimatedTextProps {
  text: string;
  delay?: number;
  fontSize?: number;
  color?: string;
  fontWeight?: number;
  fontFamily?: string;
  style?: React.CSSProperties;
  entrance?: EntranceName;
  glow?: boolean;
  gradientColors?: [string, string];
}

export const AnimatedText: React.FC<AnimatedTextProps> = ({
  text,
  delay = 0,
  fontSize = 48,
  color = "#FFFFFF",
  fontWeight = 700,
  fontFamily = "Inter",
  style = {},
  entrance = "fadeUp",
  glow = false,
  gradientColors,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const progress = spring({
    frame: frame - delay,
    fps,
    config: { damping: 200 },
  });

  const clampedProgress = interpolate(progress, [0, 1], [0, 1], {
    extrapolateRight: "clamp",
  });

  const entranceStyle = entrances[entrance](clampedProgress);

  const textStyle: React.CSSProperties = {
    fontSize,
    fontWeight,
    fontFamily,
    ...entranceStyle,
  };

  if (gradientColors) {
    textStyle.background = GRADIENTS.textGradient(
      gradientColors[0],
      gradientColors[1]
    );
    textStyle.backgroundClip = "text";
    textStyle.WebkitBackgroundClip = "text";
    textStyle.color = "transparent";
    textStyle.WebkitTextFillColor = "transparent";
  } else {
    textStyle.color = color;
  }

  if (glow) {
    textStyle.textShadow = SHADOWS.glow(gradientColors?.[0] ?? color);
  }

  return (
    <div
      style={{
        ...textStyle,
        ...style,
      }}
    >
      {text}
    </div>
  );
};
