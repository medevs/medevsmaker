/**
 * CinematicOverlay — Composable cinematic overlay effects for Remotion.
 *
 * Renders as a transparent overlay (pointerEvents: 'none').
 * Effects: filmGrain, scanlines, vignette, vhs, letterbox.
 */

import React from "react";
import { AbsoluteFill, useCurrentFrame, random } from "remotion";

type CinematicEffect =
  | "filmGrain"
  | "scanlines"
  | "vignette"
  | "vhs"
  | "letterbox";

interface CinematicOverlayProps {
  effect: CinematicEffect;
  intensity?: number;
}

const FilmGrainOverlay: React.FC<{ intensity: number }> = ({ intensity }) => {
  const frame = useCurrentFrame();
  const grainSeed = Math.floor(frame * 2);

  const grainDots = Array.from({ length: 100 }).map((_, i) => ({
    x: random(`grain-x-${grainSeed}-${i}`) * 100,
    y: random(`grain-y-${grainSeed}-${i}`) * 100,
    opacity: random(`grain-o-${grainSeed}-${i}`) * 0.15 * intensity,
    size: random(`grain-s-${grainSeed}-${i}`) * 3 + 1,
  }));

  return (
    <>
      {grainDots.map((dot, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            left: `${dot.x}%`,
            top: `${dot.y}%`,
            width: dot.size,
            height: dot.size,
            background: "#ffffff",
            borderRadius: "50%",
            opacity: dot.opacity,
          }}
        />
      ))}
    </>
  );
};

const ScanlinesOverlay: React.FC<{ intensity: number }> = ({ intensity }) => {
  const alpha = intensity * 0.2;
  return (
    <AbsoluteFill
      style={{
        background: `repeating-linear-gradient(
          0deg,
          transparent,
          transparent 2px,
          rgba(0, 0, 0, ${alpha}) 2px,
          rgba(0, 0, 0, ${alpha}) 4px
        )`,
        pointerEvents: "none",
      }}
    />
  );
};

const VignetteOverlay: React.FC<{ intensity: number }> = ({ intensity }) => {
  const innerStop = 50 - intensity * 20;
  const outerAlpha = 0.3 + intensity * 0.5;
  return (
    <AbsoluteFill
      style={{
        background: `radial-gradient(ellipse at center, transparent ${innerStop}%, rgba(0, 0, 0, ${outerAlpha}) 100%)`,
        pointerEvents: "none",
      }}
    />
  );
};

const VhsOverlay: React.FC<{ intensity: number }> = ({ intensity }) => {
  const frame = useCurrentFrame();

  const tracking = Math.sin(frame * 0.05) * 5 * intensity;
  const isGlitch = random(`vhs-glitch-${frame}`) > 0.95;
  const jitterX = isGlitch
    ? (random(`vhs-jitter-${frame}`) * 20 - 10) * intensity
    : 0;

  const scanAlpha = intensity * 0.2;

  return (
    <>
      {/* Tracking jitter layer */}
      <AbsoluteFill
        style={{
          transform: `translateX(${tracking + jitterX}px)${isGlitch ? " skewX(2deg)" : ""}`,
          pointerEvents: "none",
        }}
      />

      {/* Scanlines (narrower 1px spacing) */}
      <AbsoluteFill
        style={{
          background: `repeating-linear-gradient(
            0deg,
            transparent,
            transparent 1px,
            rgba(0, 0, 0, ${scanAlpha}) 1px,
            rgba(0, 0, 0, ${scanAlpha}) 2px
          )`,
          pointerEvents: "none",
        }}
      />

      {/* Noise bar on glitch frames */}
      {isGlitch && (
        <div
          style={{
            position: "absolute",
            left: 0,
            top: `${random(`noise-bar-y-${frame}`) * 80 + 10}%`,
            width: "100%",
            height: random(`noise-bar-h-${frame}`) * 30 + 10,
            background:
              "linear-gradient(to bottom, transparent, rgba(255,255,255,0.19), transparent)",
            pointerEvents: "none",
          }}
        />
      )}
    </>
  );
};

const LetterboxOverlay: React.FC<{ intensity: number }> = ({ intensity }) => {
  const barHeight = `${5 + intensity * 10}%`;
  return (
    <>
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: barHeight,
          background: "#000000",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          width: "100%",
          height: barHeight,
          background: "#000000",
        }}
      />
    </>
  );
};

export const CinematicOverlay: React.FC<CinematicOverlayProps> = ({
  effect,
  intensity = 0.5,
}) => {
  const clamped = Math.max(0, Math.min(1, intensity));

  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      {effect === "filmGrain" && <FilmGrainOverlay intensity={clamped} />}
      {effect === "scanlines" && <ScanlinesOverlay intensity={clamped} />}
      {effect === "vignette" && <VignetteOverlay intensity={clamped} />}
      {effect === "vhs" && <VhsOverlay intensity={clamped} />}
      {effect === "letterbox" && <LetterboxOverlay intensity={clamped} />}
    </AbsoluteFill>
  );
};
