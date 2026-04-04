import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
} from "remotion";
import { BRAND, SCENE_DEFAULTS } from "../styles";
import { ColorBorderCard } from "../components/ColorBorderCard";
import { SceneBackground } from "../components/SceneBackground";

type TerminalItem = {
  text: string;
  icon?: string;
  highlight?: string;
};

type ProgressiveTerminalProps = {
  heading: string;
  items: TerminalItem[];
  summary?: string;
  sectionColor?: string;
  colors?: { bg: string; text: string; muted: string };
  fontFamily?: string;
  terminal?: boolean;
};

export const ProgressiveTerminal: React.FC<ProgressiveTerminalProps> = ({
  heading,
  items,
  summary,
  sectionColor = BRAND.indigo,
  colors = { bg: BRAND.bg, text: BRAND.text, muted: BRAND.textMuted },
  fontFamily = "Inter",
  terminal = false,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const headP = spring({
    frame,
    fps,
    config: SCENE_DEFAULTS.springSilky,
  });
  const headOpacity = interpolate(headP, [0, 1], [0, 1], {
    extrapolateRight: "clamp",
  });
  const headY = interpolate(headP, [0, 1], [20, 0], {
    extrapolateRight: "clamp",
  });

  return (
    <SceneBackground bg={colors.bg}>
      <AbsoluteFill
        style={{
          padding: 80,
          gap: 28,
        }}
      >
      <div
        style={{
          opacity: headOpacity,
          transform: `translateY(${headY}px)`,
          fontFamily,
          fontSize: 48,
          fontWeight: 800,
          color: colors.text,
        }}
      >
        {heading}
      </div>

      <ColorBorderCard
        color={sectionColor}
        delay={10}
        variant="wide"
        fontFamily={fontFamily}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 16,
          }}
        >
          {items.map((item, i) => {
            const itemDelay =
              SCENE_DEFAULTS.elementEntrySlow +
              i * SCENE_DEFAULTS.staggerDelaySlow;
            const itemP = spring({
              frame: frame - itemDelay,
              fps,
              config: SCENE_DEFAULTS.springSilky,
            });
            const itemOpacity = interpolate(itemP, [0, 1], [0, 1], {
              extrapolateRight: "clamp",
            });
            const itemX = interpolate(itemP, [0, 1], [-25, 0], {
              extrapolateRight: "clamp",
            });

            const itemStartFrame = itemDelay;
            const itemFont = terminal ? "JetBrains Mono, monospace" : fontFamily;
            const itemIcon = terminal && !item.icon ? "$" : (item.icon || "▸");

            // Render text with highlight or terminal typing
            const renderText = () => {
              const fullText = item.text;

              if (terminal) {
                const charsToShow = Math.min(
                  fullText.length,
                  Math.floor((frame - itemStartFrame) / 1.5)
                );
                const visibleText = fullText.slice(0, Math.max(0, charsToShow));
                const showCursor = frame % 30 < 15;
                return (
                  <span style={{ color: colors.text }}>
                    {visibleText}
                    <span style={{ opacity: showCursor ? 1 : 0, color: sectionColor }}>|</span>
                  </span>
                );
              }

              if (!item.highlight) {
                return (
                  <span style={{ color: colors.text }}>{fullText}</span>
                );
              }
              const idx = fullText.indexOf(item.highlight);
              if (idx === -1) {
                return (
                  <span style={{ color: colors.text }}>{fullText}</span>
                );
              }
              return (
                <>
                  <span style={{ color: colors.text }}>
                    {fullText.slice(0, idx)}
                  </span>
                  <span style={{ color: sectionColor, fontWeight: 700 }}>
                    {item.highlight}
                  </span>
                  <span style={{ color: colors.text }}>
                    {fullText.slice(idx + item.highlight.length)}
                  </span>
                </>
              );
            };

            return (
              <div
                key={i}
                style={{
                  opacity: itemOpacity,
                  transform: `translateX(${itemX}px)`,
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  fontFamily: itemFont,
                  fontSize: 24,
                  lineHeight: 1.5,
                }}
              >
                <span style={{ fontSize: 20 }}>
                  {itemIcon}
                </span>
                {renderText()}
              </div>
            );
          })}
        </div>
      </ColorBorderCard>

      {summary && (
        <div
          style={{
            opacity: interpolate(
              spring({
                frame:
                  frame -
                  SCENE_DEFAULTS.elementEntrySlow -
                  items.length * SCENE_DEFAULTS.staggerDelaySlow -
                  5,
                fps,
                config: SCENE_DEFAULTS.springSilky,
              }),
              [0, 1],
              [0, 1],
              { extrapolateRight: "clamp" }
            ),
            fontFamily,
            fontSize: 22,
            color: colors.muted,
            fontStyle: "italic",
          }}
        >
          {summary}
        </div>
      )}
    </AbsoluteFill>
    </SceneBackground>
  );
};
