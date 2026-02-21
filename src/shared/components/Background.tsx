import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate } from "remotion";
import { ParticleField, type ParticleConfig } from "./ParticleField";
import { GridPattern } from "./GridPattern";

type BackgroundVariant = "gradient" | "radialGradient" | "meshGradient";
type BackgroundOverlay =
  | "none"
  | "radialGlow"
  | "vignette"
  | "grid"
  | "particles";

interface BackgroundProps {
  colors: [string, string];
  direction?: number;
  animated?: boolean;
  variant?: BackgroundVariant;
  overlay?: BackgroundOverlay;
  overlayOpacity?: number;
  particles?: ParticleConfig;
}

export const Background: React.FC<BackgroundProps> = ({
  colors,
  direction = 135,
  animated = false,
  variant = "gradient",
  overlay = "none",
  overlayOpacity = 0.5,
  particles,
}) => {
  const frame = useCurrentFrame();

  const angle = animated
    ? interpolate(frame, [0, 300], [direction, direction + 30], {
        extrapolateRight: "clamp",
      })
    : direction;

  let bgStyle: string;

  if (variant === "radialGradient") {
    bgStyle = `radial-gradient(ellipse at 30% 40%, ${colors[0]}, ${colors[1]})`;
  } else if (variant === "meshGradient") {
    bgStyle = [
      `radial-gradient(ellipse at 20% 30%, ${colors[0]}cc 0%, transparent 50%)`,
      `radial-gradient(ellipse at 80% 70%, ${colors[1]}cc 0%, transparent 50%)`,
      `radial-gradient(ellipse at 50% 50%, ${colors[0]}44 0%, transparent 70%)`,
      `linear-gradient(${angle}deg, ${colors[0]}, ${colors[1]})`,
    ].join(", ");
  } else {
    bgStyle = `linear-gradient(${angle}deg, ${colors[0]}, ${colors[1]})`;
  }

  return (
    <>
      <AbsoluteFill style={{ background: bgStyle }} />

      {overlay === "radialGlow" && (
        <AbsoluteFill
          style={{
            background: `radial-gradient(circle at 50% 40%, ${colors[1]}44 0%, transparent 70%)`,
            opacity: overlayOpacity,
          }}
        />
      )}

      {overlay === "vignette" && (
        <AbsoluteFill
          style={{
            background:
              "radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,0.6) 100%)",
            opacity: overlayOpacity,
          }}
        />
      )}

      {overlay === "grid" && (
        <GridPattern
          variant="dots"
          color={colors[1]}
          opacity={overlayOpacity * 0.15}
          animated
        />
      )}

      {overlay === "particles" && (
        <ParticleField
          color={colors[1]}
          opacity={overlayOpacity * 0.3}
          {...particles}
        />
      )}
    </>
  );
};
