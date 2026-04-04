import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { BRAND } from "../styles";

interface PerspectiveGridProps {
  color?: string;
  speed?: number;
  showHorizon?: boolean;
  showSun?: boolean;
  sunColor?: string;
}

export const PerspectiveGrid: React.FC<PerspectiveGridProps> = ({
  color = BRAND.indigo,
  speed = 2,
  showHorizon = true,
  showSun = false,
  sunColor = BRAND.amber,
}) => {
  const frame = useCurrentFrame();

  const scrollZ = (frame * speed) % 100;

  return (
    <AbsoluteFill
      style={{
        perspective: 500,
        overflow: "hidden",
        pointerEvents: "none",
      }}
    >
      {/* Grid plane */}
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "50%",
          width: 2000,
          height: 2000,
          transform: `translate(-50%, -50%) rotateX(70deg) translateZ(${scrollZ}px)`,
          transformStyle: "preserve-3d",
          backgroundImage: `
            linear-gradient(${color}40 1px, transparent 1px),
            linear-gradient(90deg, ${color}40 1px, transparent 1px)
          `,
          backgroundSize: "100px 100px",
        }}
      />

      {/* Horizon line */}
      {showHorizon && (
        <div
          style={{
            position: "absolute",
            left: 0,
            top: "50%",
            width: "100%",
            height: 2,
            background: color,
            transform: "translateY(-50%)",
          }}
        />
      )}

      {/* Sun */}
      {showSun && (
        <div
          style={{
            position: "absolute",
            left: "50%",
            top: "45%",
            width: 80,
            height: 80,
            background: `radial-gradient(circle, ${sunColor}, transparent)`,
            borderRadius: "50%",
            transform: "translate(-50%, -50%)",
            boxShadow: `0 0 60px ${sunColor}, 0 0 120px ${sunColor}`,
          }}
        />
      )}
    </AbsoluteFill>
  );
};
