import React from "react";
import { useCurrentFrame, useVideoConfig, spring, interpolate, random } from "remotion";
import { BRAND, SCENE_DEFAULTS, baseTokens, TYPOGRAPHY } from "../styles";
import { glowPulse } from "../animations";

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
  /** Neon mode: flicker intensity */
  flickerIntensity?: "subtle" | "medium" | "heavy";
  /** Neon mode: animate each letter individually */
  letterByLetter?: boolean;
};

// --- Scramble helpers ---

const seededRandom = (seed: number): number => {
  const x = Math.sin(seed * 12.9898 + 78.233) * 43758.5453;
  return x - Math.floor(x);
};

const SCRAMBLE_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%&*";

// --- Neon helpers (absorbed from NeonText) ---

const FLICKER_CONFIG = {
  subtle: { frequency: 6, min: 0.9, max: 1.0 },
  medium: { frequency: 3, min: 0.8, max: 1.0 },
  heavy: { frequency: 2, min: 0.3, max: 1.0 },
} as const;

const getFlicker = (
  frame: number,
  seed: string,
  intensity: "subtle" | "medium" | "heavy",
): number => {
  const config = FLICKER_CONFIG[intensity];
  const flickerFrame = Math.floor(frame / config.frequency);
  const r = random(`${seed}-${flickerFrame}`);
  return config.min + r * (config.max - config.min);
};

const buildTextShadow = (color: string, glowIntensity: number): string => {
  return [
    `0 0 10px ${color}`,
    `0 0 20px ${color}`,
    `0 0 ${glowIntensity}px ${color}`,
    `0 0 ${glowIntensity * 2}px ${color}`,
  ].join(", ");
};

export const TextEffect: React.FC<TextEffectProps> = ({
  text,
  effect,
  delay = 0,
  fontSize = baseTokens.fontSizes.lg,
  color = BRAND.text,
  duration = 40,
  fontFamily = "Inter",
  fontWeight = 700,
  flickerIntensity = "medium",
  letterByLetter = false,
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
    lineHeight: TYPOGRAPHY.lineHeights.normal,
  };

  // --- Typewriter ---
  if (effect === "typewriter") {
    const charsToShow = Math.min(
      text.length,
      Math.floor((f / duration) * text.length),
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

  // --- Scramble ---
  if (effect === "scramble") {
    const progress = Math.min(1, f / duration);
    const chars = text.split("").map((char, i) => {
      if (char === " ") return " ";
      const lockAt = i / text.length;
      if (progress >= lockAt + 0.15) return char;
      const randIdx = Math.floor(
        seededRandom(i * 100 + f) * SCRAMBLE_CHARS.length,
      );
      return SCRAMBLE_CHARS[randIdx];
    });

    return (
      <div style={{ ...baseStyle, fontFamily: "JetBrains Mono, monospace" }}>
        {chars.join("")}
      </div>
    );
  }

  // --- Glitch ---
  if (effect === "glitch") {
    const enter = spring({
      frame: f,
      fps,
      config: SCENE_DEFAULTS.springSilky,
    });

    const glitchCycle = Math.sin(f * 0.2) + Math.sin(f * 0.31);
    const isGlitching = glitchCycle > 1.5 && f > 5;
    const glitchAmount = isGlitching ? 1 : 0;
    const tracking = Math.sin(f * 0.1) * 4 * glitchAmount;
    const jitterX = isGlitching ? seededRandom(f) * 8 - 4 : 0;

    return (
      <div style={{ ...baseStyle, opacity: enter, position: "relative" }}>
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
        <span
          style={{
            transform: `translateX(${jitterX}px)`,
            display: "inline-block",
          }}
        >
          {text}
        </span>
      </div>
    );
  }

  // --- Neon (absorbed from NeonText) ---
  if (effect === "neon") {
    const entryOpacity = interpolate(f, [0, 30], [0, 1], {
      extrapolateRight: "clamp",
      extrapolateLeft: "clamp",
    });
    const entryScale = interpolate(f, [0, 30], [0.8, 1.0], {
      extrapolateRight: "clamp",
      extrapolateLeft: "clamp",
    });

    if (letterByLetter) {
      const LETTER_STAGGER = 15;

      return (
        <div
          style={{
            position: "relative",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <div
            style={{
              position: "absolute",
              width: "120%",
              height: "200%",
              background: `radial-gradient(ellipse at center, ${color}22 0%, transparent 70%)`,
              pointerEvents: "none",
            }}
          />
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              position: "relative",
            }}
          >
            {text.split("").map((char, i) => {
              const letterFrame = Math.max(0, f - i * LETTER_STAGGER);
              const letterOpacity = interpolate(letterFrame, [0, 30], [0, 1], {
                extrapolateRight: "clamp",
                extrapolateLeft: "clamp",
              });
              const letterScale = interpolate(
                letterFrame,
                [0, 30],
                [0.8, 1.0],
                { extrapolateRight: "clamp", extrapolateLeft: "clamp" },
              );
              const flicker =
                letterFrame > 0
                  ? getFlicker(frame, `neon-letter-${text}-${i}`, flickerIntensity)
                  : 0;
              const glowAmount = 40 * flicker;

              return (
                <span
                  key={i}
                  style={{
                    display: "inline-block",
                    fontFamily,
                    fontSize,
                    fontWeight: 700,
                    color,
                    opacity: letterOpacity * flicker,
                    transform: `scale(${letterScale})`,
                    textShadow: buildTextShadow(color, glowAmount),
                    whiteSpace: "pre",
                  }}
                >
                  {char}
                </span>
              );
            })}
          </div>
        </div>
      );
    }

    // Single-text neon mode
    const flicker =
      f > 0 ? getFlicker(frame, `neon-${text}`, flickerIntensity) : 0;
    const glowAmount = 40 * flicker;

    return (
      <div
        style={{
          position: "relative",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <div
          style={{
            position: "absolute",
            width: "120%",
            height: "200%",
            background: `radial-gradient(ellipse at center, ${color}22 0%, transparent 70%)`,
            pointerEvents: "none",
          }}
        />
        <span
          style={{
            position: "relative",
            fontFamily,
            fontSize,
            fontWeight: 700,
            color,
            opacity: entryOpacity * flicker,
            transform: `scale(${entryScale})`,
            textShadow: buildTextShadow(color, glowAmount),
            whiteSpace: "pre-wrap",
          }}
        >
          {text}
        </span>
      </div>
    );
  }

  return <div style={baseStyle}>{text}</div>;
};
