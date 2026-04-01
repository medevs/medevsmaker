import React from "react";
import {
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
} from "remotion";
import { evolvePath } from "@remotion/paths";
import { BRAND, SCENE_DEFAULTS } from "../styles";

type DiagramArrowProps = {
  from: { x: number; y: number };
  to: { x: number; y: number };
  delay?: number;
  color?: string;
  strokeWidth?: number;
  label?: string;
  fontFamily?: string;
  glow?: boolean;
  /** Use a curved quadratic bezier path instead of a straight line */
  curved?: boolean;
};

export const DiagramArrow: React.FC<DiagramArrowProps> = ({
  from,
  to,
  delay = 0,
  color = BRAND.textMuted,
  strokeWidth = 3,
  label,
  fontFamily = "Inter",
  glow = false,
  curved = false,
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

  // Trailing glow lags behind the main stroke
  const glowProgress = interpolate(progress, [0, 1], [-0.15, 0.85], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const dx = to.x - from.x;
  const dy = to.y - from.y;
  const angle = Math.atan2(dy, dx);

  // Build the SVG path — straight line or curved bezier
  const pathD = curved
    ? (() => {
        // Control point offset perpendicular to the line
        const midX = (from.x + to.x) / 2;
        const midY = (from.y + to.y) / 2;
        const perpX = -(to.y - from.y) * 0.25;
        const perpY = (to.x - from.x) * 0.25;
        return `M ${from.x} ${from.y} Q ${midX + perpX} ${midY + perpY} ${to.x} ${to.y}`;
      })()
    : `M ${from.x} ${from.y} L ${to.x} ${to.y}`;

  // Use evolvePath for smooth draw-on animation
  const evolved = evolvePath(drawProgress, pathD);

  // Arrow head at the tip
  const headSize = 12;
  const headAngle = Math.PI / 6;
  // For the arrow head position, interpolate along the line
  const tipX = from.x + (to.x - from.x) * Math.min(drawProgress, 1);
  const tipY = from.y + (to.y - from.y) * Math.min(drawProgress, 1);
  // For curved paths, approximate the angle at the tip
  const tipAngle = curved
    ? Math.atan2(to.y - tipY + dy * 0.1, to.x - tipX + dx * 0.1)
    : angle;

  const arrowL = {
    x: tipX - headSize * Math.cos(tipAngle - headAngle),
    y: tipY - headSize * Math.sin(tipAngle - headAngle),
  };
  const arrowR = {
    x: tipX - headSize * Math.cos(tipAngle + headAngle),
    y: tipY - headSize * Math.sin(tipAngle + headAngle),
  };

  // Label at midpoint
  const midX = (from.x + to.x) / 2;
  const midY = (from.y + to.y) / 2;
  const labelOffset = curved ? -25 : -12;

  const labelOpacity = interpolate(progress, [0.5, 1], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const filterId = `arrow-glow-${from.x}-${from.y}-${to.x}-${to.y}`;

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
      {glow && (
        <defs>
          <filter id={filterId}>
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
      )}

      {/* Trailing glow stroke — wider, softer, lags behind */}
      {glow && glowProgress > 0 && (
        <path
          d={pathD}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth + 6}
          strokeLinecap="round"
          opacity={0.15}
          {...evolvePath(Math.max(0, glowProgress), pathD)}
          filter={`url(#${filterId})`}
        />
      )}

      {/* Main stroke with evolvePath draw-on */}
      <path
        d={pathD}
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        {...evolved}
        filter={glow ? `url(#${filterId})` : undefined}
      />

      {/* Arrow head */}
      {drawProgress > 0.1 && (
        <polygon
          points={`${tipX},${tipY} ${arrowL.x},${arrowL.y} ${arrowR.x},${arrowR.y}`}
          fill={color}
          opacity={drawProgress}
          filter={glow ? `url(#${filterId})` : undefined}
        />
      )}

      {/* Label */}
      {label && (
        <text
          x={midX}
          y={midY + labelOffset}
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
