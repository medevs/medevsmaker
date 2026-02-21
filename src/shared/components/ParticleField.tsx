import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate } from "remotion";

type ParticleConfig = {
  count?: number;
  color?: string;
  minSize?: number;
  maxSize?: number;
  speed?: number;
  opacity?: number;
  direction?: "up" | "down" | "left" | "right";
};

type ParticleFieldProps = ParticleConfig;

/**
 * Deterministic seed function from particle index.
 * No Math.random — safe for Remotion rendering.
 */
const seededRandom = (seed: number): number => {
  const x = Math.sin(seed * 127.1 + seed * 311.7) * 43758.5453;
  return x - Math.floor(x);
};

export const ParticleField: React.FC<ParticleFieldProps> = ({
  count = 30,
  color = "#ffffff",
  minSize = 2,
  maxSize = 6,
  speed = 0.5,
  opacity = 0.15,
  direction = "up",
}) => {
  const frame = useCurrentFrame();

  const particles = Array.from({ length: count }, (_, i) => {
    const r1 = seededRandom(i);
    const r2 = seededRandom(i + 100);
    const r3 = seededRandom(i + 200);
    const r4 = seededRandom(i + 300);

    const size = minSize + r3 * (maxSize - minSize);
    const baseX = r1 * 1920;
    const baseY = r2 * 1080;
    const particleSpeed = speed * (0.5 + r4 * 0.5);
    const drift = frame * particleSpeed;

    let x = baseX;
    let y = baseY;

    if (direction === "up") {
      y = ((baseY - drift) % 1080 + 1080) % 1080;
      x = baseX + Math.sin(frame * 0.02 + i) * 20;
    } else if (direction === "down") {
      y = (baseY + drift) % 1080;
      x = baseX + Math.sin(frame * 0.02 + i) * 20;
    } else if (direction === "left") {
      x = ((baseX - drift) % 1920 + 1920) % 1920;
      y = baseY + Math.sin(frame * 0.02 + i) * 20;
    } else {
      x = (baseX + drift) % 1920;
      y = baseY + Math.sin(frame * 0.02 + i) * 20;
    }

    const particleOpacity = opacity * (0.3 + r4 * 0.7);

    return (
      <div
        key={i}
        style={{
          position: "absolute",
          left: x,
          top: y,
          width: size,
          height: size,
          borderRadius: "50%",
          backgroundColor: color,
          opacity: particleOpacity,
        }}
      />
    );
  });

  return (
    <AbsoluteFill style={{ pointerEvents: "none", overflow: "hidden" }}>
      {particles}
    </AbsoluteFill>
  );
};

export type { ParticleConfig };
