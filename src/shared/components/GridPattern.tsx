import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";

type GridVariant = "dots" | "lines" | "crosses";

type GridPatternProps = {
  variant?: GridVariant;
  color?: string;
  spacing?: number;
  size?: number;
  opacity?: number;
  animated?: boolean;
};

export const GridPattern: React.FC<GridPatternProps> = ({
  variant = "dots",
  color = "#ffffff",
  spacing = 60,
  size = 2,
  opacity = 0.08,
  animated = false,
}) => {
  const frame = useCurrentFrame();
  const drift = animated ? frame * 0.3 : 0;

  const patternId = `grid-${variant}-${spacing}`;

  let patternContent: React.ReactNode;

  if (variant === "dots") {
    patternContent = (
      <circle cx={spacing / 2} cy={spacing / 2} r={size} fill={color} />
    );
  } else if (variant === "lines") {
    patternContent = (
      <>
        <line
          x1={0}
          y1={0}
          x2={spacing}
          y2={0}
          stroke={color}
          strokeWidth={size * 0.5}
        />
        <line
          x1={0}
          y1={0}
          x2={0}
          y2={spacing}
          stroke={color}
          strokeWidth={size * 0.5}
        />
      </>
    );
  } else {
    // crosses
    const half = spacing / 2;
    const arm = size * 3;
    patternContent = (
      <>
        <line
          x1={half - arm}
          y1={half}
          x2={half + arm}
          y2={half}
          stroke={color}
          strokeWidth={size * 0.5}
        />
        <line
          x1={half}
          y1={half - arm}
          x2={half}
          y2={half + arm}
          stroke={color}
          strokeWidth={size * 0.5}
        />
      </>
    );
  }

  return (
    <AbsoluteFill style={{ pointerEvents: "none", opacity }}>
      <svg width="100%" height="100%">
        <defs>
          <pattern
            id={patternId}
            x={drift}
            y={drift}
            width={spacing}
            height={spacing}
            patternUnits="userSpaceOnUse"
          >
            {patternContent}
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill={`url(#${patternId})`} />
      </svg>
    </AbsoluteFill>
  );
};
