import React from "react";
import {
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
} from "remotion";
import { BRAND, SCENE_DEFAULTS } from "../styles";

type DiagramArrowProps = {
  from: { x: number; y: number };
  to: { x: number; y: number };
  delay?: number;
  color?: string;
  strokeWidth?: number;
  label?: string;
  fontFamily?: string;
};

export const DiagramArrow: React.FC<DiagramArrowProps> = ({
  from,
  to,
  delay = 0,
  color = BRAND.textMuted,
  strokeWidth = 3,
  label,
  fontFamily = "Inter",
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const progress = spring({
    frame: frame - delay,
    fps,
    config: SCENE_DEFAULTS.springSmooth,
  });

  const drawProgress = interpolate(progress, [0, 1], [0, 1], {
    extrapolateRight: "clamp",
  });

  const dx = to.x - from.x;
  const dy = to.y - from.y;
  const length = Math.sqrt(dx * dx + dy * dy);
  const angle = Math.atan2(dy, dx);

  // Arrow head
  const headSize = 12;
  const headAngle = Math.PI / 6;
  const endX = from.x + dx * drawProgress;
  const endY = from.y + dy * drawProgress;

  const arrowL = {
    x: endX - headSize * Math.cos(angle - headAngle),
    y: endY - headSize * Math.sin(angle - headAngle),
  };
  const arrowR = {
    x: endX - headSize * Math.cos(angle + headAngle),
    y: endY - headSize * Math.sin(angle + headAngle),
  };

  // Label position at midpoint
  const midX = from.x + dx * 0.5;
  const midY = from.y + dy * 0.5;

  const labelOpacity = interpolate(progress, [0.5, 1], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <svg
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
      }}
    >
      {/* Line */}
      <line
        x1={from.x}
        y1={from.y}
        x2={endX}
        y2={endY}
        stroke={color}
        strokeWidth={strokeWidth}
        strokeDasharray={length}
        strokeDashoffset={length * (1 - drawProgress)}
      />
      {/* Arrow head */}
      {drawProgress > 0.1 && (
        <polygon
          points={`${endX},${endY} ${arrowL.x},${arrowL.y} ${arrowR.x},${arrowR.y}`}
          fill={color}
          opacity={drawProgress}
        />
      )}
      {/* Label */}
      {label && (
        <text
          x={midX}
          y={midY - 12}
          textAnchor="middle"
          fill={BRAND.textMuted}
          fontFamily={fontFamily}
          fontSize={18}
          opacity={labelOpacity}
        >
          {label}
        </text>
      )}
    </svg>
  );
};
