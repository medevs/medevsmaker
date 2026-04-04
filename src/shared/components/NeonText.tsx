import React from "react";
import { useCurrentFrame, interpolate, random } from "remotion";
import { BRAND } from "../styles";

interface NeonTextProps {
  text: string;
  color?: string;
  fontSize?: number;
  delay?: number;
  letterByLetter?: boolean;
  flickerIntensity?: "subtle" | "medium" | "heavy";
  fontFamily?: string;
}

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

export const NeonText: React.FC<NeonTextProps> = ({
  text,
  color = BRAND.indigo,
  fontSize = 80,
  delay = 0,
  letterByLetter = false,
  flickerIntensity = "medium",
  fontFamily = "Inter",
}) => {
  const frame = useCurrentFrame();
  const adjustedFrame = Math.max(0, frame - delay);

  const entryOpacity = interpolate(adjustedFrame, [0, 30], [0, 1], {
    extrapolateRight: "clamp",
    extrapolateLeft: "clamp",
  });

  const entryScale = interpolate(adjustedFrame, [0, 30], [0.8, 1.0], {
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
        {/* Background radial glow */}
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
            const letterDelay = delay + i * LETTER_STAGGER;
            const letterFrame = Math.max(0, frame - letterDelay);

            const letterOpacity = interpolate(
              letterFrame,
              [0, 30],
              [0, 1],
              {
                extrapolateRight: "clamp",
                extrapolateLeft: "clamp",
              },
            );

            const letterScale = interpolate(
              letterFrame,
              [0, 30],
              [0.8, 1.0],
              {
                extrapolateRight: "clamp",
                extrapolateLeft: "clamp",
              },
            );

            const flicker =
              letterFrame > 0
                ? getFlicker(frame, `neon-letter-${text}-${i}`, flickerIntensity)
                : 0;

            const glowIntensity = 40 * flicker;

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
                  textShadow: buildTextShadow(color, glowIntensity),
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

  // Single-text mode
  const flicker =
    adjustedFrame > 0
      ? getFlicker(frame, `neon-${text}`, flickerIntensity)
      : 0;

  const glowIntensity = 40 * flicker;

  return (
    <div
      style={{
        position: "relative",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {/* Background radial glow */}
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
          textShadow: buildTextShadow(color, glowIntensity),
          whiteSpace: "pre-wrap",
        }}
      >
        {text}
      </span>
    </div>
  );
};
