/**
 * BackgroundGeometric - Geometric pattern background
 */

import React from "react";
import { AbsoluteFill, useCurrentFrame, random, interpolate } from "remotion";
import { BRAND } from "../../styles";
import { loadFont } from "@remotion/google-fonts/Inter";

const { fontFamily } = loadFont();

export const BackgroundGeometric = ({
  startDelay = 0,
  text = "GEOMETRIC",
}: {
  startDelay?: number;
  text?: string;
}) => {
  const frame = useCurrentFrame();

  const shapes = React.useMemo(() => {
    return Array.from({ length: 20 }).map((_, i) => ({
      id: `geo-shape-${i}`,
      x: random(`geo-x-${i}`) * 100,
      y: random(`geo-y-${i}`) * 100,
      size: random(`geo-s-${i}`) * 100 + 50,
      rotation: random(`geo-r-${i}`) * 360,
      type: Math.floor(random(`geo-t-${i}`) * 3),
      color: [BRAND.indigo, BRAND.violet, BRAND.cyan][i % 3],
      speed: random(`geo-sp-${i}`) * 0.5 + 0.2,
    }));
  }, []);

  return (
    <AbsoluteFill style={{ background: BRAND.bg }}>
      {shapes.map((shape) => {
        const rotation = shape.rotation + (frame - startDelay) * shape.speed;
        const opacity = interpolate(frame, [startDelay, startDelay + 30], [0, 0.15], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });

        return (
          <div
            key={shape.id}
            style={{
              position: "absolute",
              left: `${shape.x}%`,
              top: `${shape.y}%`,
              width: shape.size,
              height: shape.size,
              background: shape.type === 0 ? shape.color : "transparent",
              border: shape.type !== 0 ? `2px solid ${shape.color}` : "none",
              borderRadius: shape.type === 1 ? "50%" : 0,
              transform: `translate(-50%, -50%) rotate(${rotation}deg)`,
              opacity: opacity,
            }}
          />
        );
      })}

      {/* Center text */}
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "50%",
          transform: "translate(-50%, -50%)",
          fontFamily,
          fontSize: 100,
          fontWeight: 900,
          color: BRAND.text,
          opacity: interpolate(frame, [startDelay + 20, startDelay + 50], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
        }}
      >
        {text}
      </div>
    </AbsoluteFill>
  );
};
