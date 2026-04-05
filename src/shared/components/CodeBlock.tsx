import React from "react";
import {
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
} from "remotion";
import { loadFont } from "@remotion/google-fonts/JetBrainsMono";
import { BRAND, SCENE_DEFAULTS, SHADOWS, baseTokens, TYPOGRAPHY } from "../styles";
import { glowPulse } from "../animations";

const { fontFamily: codeFont } = loadFont("normal", {
  weights: ["400"],
  subsets: ["latin"],
});

type CodeBlockProps = {
  code: string;
  delay?: number;
  fontSize?: number;
  typewriter?: boolean;
  highlightLines?: number[];
  showLineNumbers?: boolean;
  glowBorder?: boolean;
};

export const CodeBlock: React.FC<CodeBlockProps> = ({
  code,
  delay = 0,
  fontSize = baseTokens.fontSizes.xs,
  typewriter = true,
  highlightLines = [],
  showLineNumbers = false,
  glowBorder = false,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const entryProgress = spring({
    frame: frame - delay,
    fps,
    config: SCENE_DEFAULTS.springSmooth,
  });
  const opacity = interpolate(entryProgress, [0, 1], [0, 1], {
    extrapolateRight: "clamp",
  });
  const y = interpolate(entryProgress, [0, 1], [20, 0], {
    extrapolateRight: "clamp",
  });

  const lines = code.split("\n");
  const totalChars = code.length;

  // Typewriter: reveal chars progressively
  const revealStart = delay + 15;
  const charsToShow = typewriter
    ? Math.floor(
        interpolate(
          frame,
          [revealStart, revealStart + totalChars * 1.2],
          [0, totalChars],
          { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
        )
      )
    : totalChars;

  // Build visible text respecting line breaks
  let charCount = 0;
  const visibleLines = lines.map((line) => {
    const lineStart = charCount;
    charCount += line.length + 1; // +1 for \n
    const visible = Math.max(0, Math.min(line.length, charsToShow - lineStart));
    return line.slice(0, visible);
  });

  const boxShadow = glowBorder
    ? glowPulse(frame, BRAND.indigo, 90)
    : SHADOWS.md;

  return (
    <div
      style={{
        opacity,
        transform: `translateY(${y}px)`,
        backgroundColor: BRAND.codeBg,
        borderRadius: baseTokens.borderRadius.lg,
        padding: `${baseTokens.spacing.md}px ${baseTokens.spacing.lg}px`,
        border: `1px solid ${BRAND.border}`,
        width: "100%",
        boxSizing: "border-box",
        boxShadow,
      }}
    >
      {visibleLines.map((line, i) => {
        const isHighlighted = highlightLines.includes(i + 1);
        return (
          <div
            key={i}
            style={{
              display: "flex",
              gap: 16,
              backgroundColor: isHighlighted
                ? `${BRAND.indigo}22`
                : "transparent",
              marginLeft: -12,
              marginRight: -12,
              paddingLeft: 12,
              paddingRight: 12,
              borderRadius: 4,
            }}
          >
            {showLineNumbers && (
              <span
                style={{
                  fontFamily: codeFont,
                  fontSize: fontSize - 2,
                  color: BRAND.textMuted,
                  minWidth: 32,
                  textAlign: "right",
                  userSelect: "none",
                }}
              >
                {i + 1}
              </span>
            )}
            <pre
              style={{
                fontFamily: codeFont,
                fontSize,
                color: BRAND.cyan,
                margin: 0,
                lineHeight: TYPOGRAPHY.lineHeights.relaxed,
                whiteSpace: "pre",
              }}
            >
              {line}
            </pre>
          </div>
        );
      })}
    </div>
  );
};
