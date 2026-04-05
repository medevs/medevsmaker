import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
} from "remotion";
import { baseTokens, BRAND, SCENE_DEFAULTS, TYPOGRAPHY } from "../styles";
import { Card } from "../components/Card";
import { SceneBackground } from "../components/SceneBackground";
import { useLayoutMode } from "../formats";

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
  const { contentPadding, fontScale } = useLayoutMode();

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
          padding: contentPadding,
          gap: 28,
        }}
      >
      <div
        style={{
          opacity: headOpacity,
          transform: `translateY(${headY}px)`,
          fontFamily,
          fontSize: Math.round(48 * fontScale),
          fontWeight: 800,
          color: colors.text,
        }}
      >
        {heading}
      </div>

      <Card variant="border"
        color={sectionColor}
        delay={10}
        size="lg"
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
                  fontSize: Math.round(24 * fontScale),
                  lineHeight: TYPOGRAPHY.lineHeights.relaxed,
                }}
              >
                <span style={{ fontSize: Math.round(20 * fontScale) }}>
                  {itemIcon}
                </span>
                {renderText()}
              </div>
            );
          })}
        </div>
      </Card>

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
            fontSize: Math.round(22 * fontScale),
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
