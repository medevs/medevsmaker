import React from "react";
import { useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";
import { BRAND, SCENE_DEFAULTS } from "../styles";
import { glowPulse } from "../animations";
import { NeonText } from "./NeonText";

type TextEffectType = "typewriter" | "scramble" | "glitch" | "neon";

type TextEffectProps = {
  text: string;
  effect: TextEffectType;
  delay?: number;
  fontSize?: number;
  color?: string;
  /** Frames for effect to complete (typewriter/scramble) */
  duration?: number;
  fontFamily?: string;
  fontWeight?: number;
};

// Deterministic seeded random for scramble effect
const seededRandom = (seed: number): number => {
  const x = Math.sin(seed * 12.9898 + 78.233) * 43758.5453;
  return x - Math.floor(x);
};

const SCRAMBLE_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%&*";

export const TextEffect: React.FC<TextEffectProps> = ({
  text,
  effect,
  delay = 0,
  fontSize = 48,
  color = BRAND.text,
  duration = 40,
  fontFamily = "Inter",
  fontWeight = 700,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const f = frame - delay;

  if (f < 0) return null;

  const baseStyle: React.CSSProperties = {
    fontSize,
    color,
    fontFamily,
    fontWeight,
    lineHeight: 1.3,
  };

  if (effect === "typewriter") {
    const charsToShow = Math.min(
      text.length,
      Math.floor((f / duration) * text.length)
    );
    const visibleText = text.slice(0, charsToShow);
    const cursorOpacity = Math.sin(f * 0.15) > 0 ? 1 : 0;
    const done = charsToShow >= text.length;

    return (
      <div style={baseStyle}>
        {visibleText}
        {!done && (
          <span
            style={{
              opacity: cursorOpacity,
              borderRight: `3px solid ${color}`,
              marginLeft: 2,
            }}
          >
            {"\u200B"}
          </span>
        )}
      </div>
    );
  }

  if (effect === "scramble") {
    const progress = Math.min(1, f / duration);
    const chars = text.split("").map((char, i) => {
      if (char === " ") return " ";
      const lockAt = i / text.length;
      if (progress >= lockAt + 0.15) return char;
      const randIdx = Math.floor(
        seededRandom(i * 100 + f) * SCRAMBLE_CHARS.length
      );
      return SCRAMBLE_CHARS[randIdx];
    });

    return (
      <div style={{ ...baseStyle, fontFamily: "JetBrains Mono, monospace" }}>
        {chars.join("")}
      </div>
    );
  }

  if (effect === "glitch") {
    const enter = spring({
      frame: f,
      fps,
      config: SCENE_DEFAULTS.springSilky,
    });

    // Glitch triggers periodically via dual sine wave
    const glitchCycle = Math.sin(f * 0.2) + Math.sin(f * 0.31);
    const isGlitching = glitchCycle > 1.5 && f > 5;
    const glitchAmount = isGlitching ? 1 : 0;

    // Sin-wave tracking offset for RGB separation
    const tracking = Math.sin(f * 0.1) * 4 * glitchAmount;

    // Randomized jitter on glitch frames
    const jitterX = isGlitching ? (seededRandom(f) * 8 - 4) : 0;

    return (
      <div style={{ ...baseStyle, opacity: enter, position: "relative" }}>
        {/* Red channel */}
        <span
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            color: "rgba(255, 0, 0, 0.7)",
            mixBlendMode: "screen",
            transform: `translateX(${-tracking}px)`,
            opacity: glitchAmount,
          }}
        >
          {text}
        </span>
        {/* Cyan channel */}
        <span
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            color: "rgba(0, 255, 255, 0.7)",
            mixBlendMode: "screen",
            transform: `translateX(${tracking}px)`,
            opacity: glitchAmount,
          }}
        >
          {text}
        </span>
        {/* Main text */}
        <span style={{ transform: `translateX(${jitterX}px)`, display: "inline-block" }}>
          {text}
        </span>
      </div>
    );
  }

  if (effect === "neon") {
    const enter = spring({
      frame: f,
      fps,
      config: SCENE_DEFAULTS.springSilky,
    });

    return (
      <div style={{ opacity: enter }}>
        <NeonText
          text={text}
          color={color}
          fontSize={fontSize}
          delay={0}
          flickerIntensity="medium"
          fontFamily={fontFamily}
        />
      </div>
    );
  }

  return <div style={baseStyle}>{text}</div>;
};
