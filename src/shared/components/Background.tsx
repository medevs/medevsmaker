import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate } from "remotion";

interface BackgroundProps {
  colors: [string, string];
  direction?: number;
  animated?: boolean;
}

export const Background: React.FC<BackgroundProps> = ({
  colors,
  direction = 135,
  animated = false,
}) => {
  const frame = useCurrentFrame();

  const angle = animated
    ? interpolate(frame, [0, 300], [direction, direction + 30], {
        extrapolateRight: "clamp",
      })
    : direction;

  return (
    <AbsoluteFill
      style={{
        background: `linear-gradient(${angle}deg, ${colors[0]}, ${colors[1]})`,
      }}
    />
  );
};
