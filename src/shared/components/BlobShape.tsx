import React from "react";
import { useCurrentFrame } from "remotion";
import { generateBlobPath } from "../utils/blobUtils";

interface BlobShapeProps {
  seed: string;
  points?: number;
  variance?: number;
  radius?: number;
  color: string;
  animated?: boolean;
  glow?: boolean;
  style?: React.CSSProperties;
}

export const BlobShape: React.FC<BlobShapeProps> = ({
  seed,
  points = 6,
  variance = 0.3,
  radius = 100,
  color,
  animated = false,
  glow = false,
  style,
}) => {
  const frame = useCurrentFrame();
  const size = radius * 3;
  const vb = radius * 1.5;

  let path: string;

  if (animated) {
    const pathA = generateBlobPath(`${seed}-a`, points, variance, radius);
    const pathB = generateBlobPath(`${seed}-b`, points, variance, radius);
    // Ping-pong interpolation every 60 frames
    const t = (Math.sin((frame / 60) * Math.PI * 2) + 1) / 2;
    // Interpolate between the two paths by blending coordinates
    const coordsA = pathA.match(/-?\d+\.?\d*/g)?.map(Number) ?? [];
    const coordsB = pathB.match(/-?\d+\.?\d*/g)?.map(Number) ?? [];
    const blended = coordsA.map((a, i) => {
      const b = coordsB[i] ?? a;
      return a + (b - a) * t;
    });
    // Reconstruct path with blended coordinates
    let idx = 0;
    path = pathA.replace(/-?\d+\.?\d*/g, () => {
      const val = blended[idx++];
      return val !== undefined ? val.toFixed(2) : "0";
    });
  } else {
    path = generateBlobPath(seed, points, variance, radius);
  }

  return (
    <svg
      width={size}
      height={size}
      viewBox={`${-vb} ${-vb} ${size} ${size}`}
      style={style}
    >
      {glow && (
        <defs>
          <filter id={`blob-glow-${seed}`}>
            <feGaussianBlur stdDeviation="15" result="blur" />
          </filter>
        </defs>
      )}
      {glow && (
        <path
          d={path}
          fill={color}
          filter={`url(#blob-glow-${seed})`}
          opacity={0.6}
        />
      )}
      <path d={path} fill={color} />
    </svg>
  );
};
