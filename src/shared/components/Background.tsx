import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate } from "remotion";
import { noise2D } from "@remotion/noise";
import { ParticleField, type ParticleConfig } from "./ParticleField";
import { GridPattern } from "./GridPattern";
import { PerspectiveGrid } from "./PerspectiveGrid";
import { BRAND } from "../styles";

type BackgroundVariant =
  | "gradient"
  | "radialGradient"
  | "meshGradient"
  | "aurora"
  | "noiseField"
  | "meshAnimated"
  | "solidWithOrbs"
  | "perspectiveGrid"
  | "bokeh";

type BackgroundOverlay =
  | "none"
  | "radialGlow"
  | "vignette"
  | "grid"
  | "particles"
  | "lightLeak";

interface BackgroundProps {
  colors: [string, string];
  direction?: number;
  animated?: boolean;
  variant?: BackgroundVariant;
  overlay?: BackgroundOverlay;
  overlayOpacity?: number;
  particles?: ParticleConfig;
  /** Extra brand colors for aurora variant (defaults to BRAND palette) */
  auroraColors?: string[];
}

export const Background: React.FC<BackgroundProps> = ({
  colors,
  direction = 135,
  animated = false,
  variant = "gradient",
  overlay = "none",
  overlayOpacity = 0.5,
  particles,
  auroraColors,
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
  } else if (variant === "aurora") {
    const ac = auroraColors ?? [
      BRAND.indigo,
      BRAND.cyan,
      BRAND.violet,
      BRAND.green,
    ];
    const speed = 0.004;
    const layers = ac.map((c, i) => {
      const cx = 20 + i * 20 + noise2D(`ax${i}`, frame * speed, 0) * 15;
      const cy = 25 + i * 15 + noise2D(`ay${i}`, 0, frame * speed) * 15;
      return `radial-gradient(ellipse 50% 40% at ${cx}% ${cy}%, ${c}44 0%, transparent 70%)`;
    });
    bgStyle =
      layers.join(", ") +
      `, linear-gradient(135deg, ${BRAND.bg}, ${BRAND.bgLight})`;
  } else if (variant === "noiseField") {
    bgStyle = `linear-gradient(${angle}deg, ${colors[0]}, ${colors[1]})`;
  } else if (variant === "meshAnimated") {
    const drift1x = 20 + Math.sin(frame * 0.008) * 12;
    const drift1y = 30 + Math.cos(frame * 0.006) * 10;
    const drift2x = 80 - Math.sin(frame * 0.007) * 12;
    const drift2y = 70 - Math.cos(frame * 0.009) * 10;
    bgStyle = [
      `radial-gradient(ellipse at ${drift1x}% ${drift1y}%, ${colors[0]}cc 0%, transparent 50%)`,
      `radial-gradient(ellipse at ${drift2x}% ${drift2y}%, ${colors[1]}cc 0%, transparent 50%)`,
      `radial-gradient(ellipse at 50% 50%, ${colors[0]}44 0%, transparent 70%)`,
      `linear-gradient(${angle}deg, ${colors[0]}, ${colors[1]})`,
    ].join(", ");
  } else if (variant === "solidWithOrbs") {
    bgStyle = BRAND.bg;
  } else if (variant === "perspectiveGrid") {
    bgStyle = BRAND.bg;
  } else if (variant === "bokeh") {
    bgStyle = BRAND.bg;
  } else {
    bgStyle = `linear-gradient(${angle}deg, ${colors[0]}, ${colors[1]})`;
  }

  // SVG noise filter frequency for noiseField variant
  const noiseFreq =
    variant === "noiseField"
      ? interpolate(frame, [0, 300], [0.003, 0.006], {
          extrapolateRight: "clamp",
        })
      : 0;

  return (
    <>
      <AbsoluteFill style={{ background: bgStyle }} />

      {variant === "perspectiveGrid" && (
        <PerspectiveGrid color={colors[0]} showHorizon showSun sunColor={colors[1]} />
      )}

      {variant === "bokeh" && (
        <AbsoluteFill style={{ overflow: "hidden" }}>
          {Array.from({ length: 15 }).map((_, i) => {
            const size = 80 + Math.sin(i * 2.1) * 60;
            const x = ((i * 37 + 13) % 100);
            const y = ((i * 53 + 7) % 100);
            const drift = Math.sin(frame * 0.003 + i) * 20;
            const bokehColor = i % 2 === 0 ? colors[0] : colors[1];
            return (
              <div
                key={i}
                style={{
                  position: "absolute",
                  left: `${x}%`,
                  top: `${y}%`,
                  width: size,
                  height: size,
                  borderRadius: "50%",
                  background: `radial-gradient(circle, ${bokehColor}33 0%, transparent 70%)`,
                  filter: `blur(${20 + i * 3}px)`,
                  transform: `translate(-50%, -50%) translateY(${drift}px)`,
                }}
              />
            );
          })}
        </AbsoluteFill>
      )}

      {/* Animated orbs for solidWithOrbs variant */}
      {variant === "solidWithOrbs" && (
        <AbsoluteFill>
          {[colors[0], colors[1], BRAND.violet].map((c, i) => {
            const ox = 25 + i * 25 + Math.sin(frame * 0.005 + i * 2) * 10;
            const oy = 30 + i * 15 + Math.cos(frame * 0.004 + i * 1.5) * 10;
            return (
              <div
                key={i}
                style={{
                  position: "absolute",
                  left: `${ox}%`,
                  top: `${oy}%`,
                  width: 500,
                  height: 500,
                  borderRadius: "50%",
                  background: `radial-gradient(circle, ${c}33 0%, transparent 70%)`,
                  filter: "blur(60px)",
                  transform: "translate(-50%, -50%)",
                }}
              />
            );
          })}
        </AbsoluteFill>
      )}

      {/* SVG feTurbulence overlay for noiseField variant */}
      {variant === "noiseField" && (
        <AbsoluteFill style={{ opacity: 0.15, mixBlendMode: "soft-light" }}>
          <svg width="100%" height="100%">
            <filter id="noise-bg">
              <feTurbulence
                type="fractalNoise"
                baseFrequency={noiseFreq}
                numOctaves={3}
                seed={42}
              />
              <feColorMatrix type="saturate" values="0.3" />
            </filter>
            <rect width="100%" height="100%" filter="url(#noise-bg)" />
          </svg>
        </AbsoluteFill>
      )}

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

      {overlay === "lightLeak" && (
        <AbsoluteFill
          style={{
            opacity: overlayOpacity * 0.4,
            mixBlendMode: "screen",
          }}
        >
          <AbsoluteFill
            style={{
              background: `radial-gradient(ellipse at ${30 + Math.sin(frame * 0.01) * 20}% ${20 + Math.cos(frame * 0.008) * 15}%, ${colors[0]}55 0%, transparent 50%)`,
            }}
          />
          <AbsoluteFill
            style={{
              background: `radial-gradient(ellipse at ${70 - Math.sin(frame * 0.012) * 15}% ${60 + Math.cos(frame * 0.01) * 20}%, ${colors[1]}44 0%, transparent 60%)`,
            }}
          />
        </AbsoluteFill>
      )}
    </>
  );
};
