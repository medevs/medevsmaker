import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate } from "remotion";

type ParticleConfig = {
  count?: number;
  color?: string;
  minSize?: number;
  maxSize?: number;
  speed?: number;
  opacity?: number;
  direction?: "up" | "down" | "left" | "right";
  physics?: "linear" | "gravity" | "burst" | "orbit";
  burstOrigin?: { x: number; y: number };
  shapes?: "circle" | "rect" | "mixed";
  rotateParticles?: boolean;
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
  physics = "linear",
  burstOrigin = { x: 0.5, y: 0.5 },
  shapes = "circle",
  rotateParticles = false,
}) => {
  const frame = useCurrentFrame();
  const { width: W, height: H } = useVideoConfig();

  const particles = Array.from({ length: count }, (_, i) => {
    const r1 = seededRandom(i);
    const r2 = seededRandom(i + 100);
    const r3 = seededRandom(i + 200);
    const r4 = seededRandom(i + 300);
    const r5 = seededRandom(i + 400);

    const size = minSize + r3 * (maxSize - minSize);
    const baseX = r1 * W;
    const baseY = r2 * H;
    const particleSpeed = speed * (0.5 + r4 * 0.5);
    const drift = frame * particleSpeed;

    let x = baseX;
    let y = baseY;
    let rotation = 0;
    let particleOpacity = opacity * (0.3 + r4 * 0.7);

    if (physics === "gravity") {
      // Gravity: fall down with acceleration + horizontal wobble
      const fallProgress = drift * particleSpeed;
      y = (baseY + fallProgress * particleSpeed) % H;
      x = baseX + Math.sin(fallProgress * 0.1 + i) * 30;
      if (rotateParticles) rotation = frame * r5 * 10;
    } else if (physics === "burst") {
      // Burst: explode outward from origin point
      const angle = (i / count) * Math.PI * 2 + r5 * 0.5;
      const burstSpeed = particleSpeed * 8;
      const distance = frame * burstSpeed;
      const decay = Math.max(0, 1 - frame / 90);
      x = burstOrigin.x * W + Math.cos(angle) * distance;
      y = burstOrigin.y * H + Math.sin(angle) * distance + (frame * frame * 0.01);
      particleOpacity = opacity * decay;
      if (rotateParticles) rotation = frame * r5 * 15;
    } else if (physics === "orbit") {
      // Orbit: circular motion around center
      const angle = (i / count) * Math.PI * 2 + frame * 0.02 * particleSpeed;
      const orbitRadius = 100 + r1 * 300;
      x = W / 2 + Math.cos(angle) * orbitRadius;
      y = H / 2 + Math.sin(angle) * orbitRadius;
      if (rotateParticles) rotation = angle * (180 / Math.PI);
    } else {
      // Linear: original behavior
      if (direction === "up") {
        y = ((baseY - drift) % H + H) % H;
        x = baseX + Math.sin(frame * 0.02 + i) * 20;
      } else if (direction === "down") {
        y = (baseY + drift) % H;
        x = baseX + Math.sin(frame * 0.02 + i) * 20;
      } else if (direction === "left") {
        x = ((baseX - drift) % W + W) % W;
        y = baseY + Math.sin(frame * 0.02 + i) * 20;
      } else {
        x = (baseX + drift) % W;
        y = baseY + Math.sin(frame * 0.02 + i) * 20;
      }
    }

    // Shape selection
    const shapeType = shapes === "mixed" ? (i % 3) : (shapes === "rect" ? 1 : 0);
    const borderRadius = shapeType === 0 ? "50%" : shapeType === 1 ? "2px" : "50%";
    const w = shapeType === 1 ? size * 0.6 : size;
    const h = shapeType === 1 ? size : size;

    return (
      <div
        key={i}
        style={{
          position: "absolute",
          left: x,
          top: y,
          width: w,
          height: h,
          borderRadius,
          backgroundColor: color,
          opacity: particleOpacity,
          transform: rotateParticles ? `rotate(${rotation}deg)` : undefined,
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
