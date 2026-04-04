/**
 * ShapeHexGrid - 六角形グリッド - ハニカム構造
 */

import { AbsoluteFill, useCurrentFrame, useVideoConfig, random, spring, interpolate } from "remotion";
import { loadFont } from "@remotion/google-fonts/Inter";
import { BRAND, DEFAULT_SCENE_COLORS, type SceneColors } from "../../styles";

const { fontFamily } = loadFont();

export const ShapeHexGrid = ({
  startDelay = 0,
  text = "HEXAGONAL",
  highlightColor,
  colors: colorsProp,
  sectionColor,
}: {
  startDelay?: number;
  text?: string;
  highlightColor?: string;
  colors?: SceneColors;
  sectionColor?: string;
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const colors = { ...DEFAULT_SCENE_COLORS, ...colorsProp };
  const accent = sectionColor || colors.accent;
  const resolvedHighlight = highlightColor ?? accent;

  const hexagons: { id: string; x: number; y: number; delay: number }[] = [];
  const hexSize = 70;
  const rows = 6;
  const cols = 10;

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const x = col * hexSize * 1.5 + (row % 2) * hexSize * 0.75;
      const y = row * hexSize * 0.866;
      hexagons.push({
        id: `hex-${row}-${col}`,
        x: x + 100,
        y: y + 150,
        delay: (row + col) * 2,
      });
    }
  }

  return (
    <AbsoluteFill style={{ background: colors.bg }}>
      {hexagons.map((hex) => {
        const progress = spring({
          frame: frame - startDelay - hex.delay,
          fps,
          config: { damping: 15, stiffness: 200 },
        });

        const isHighlighted = random(`hex-hl-${hex.id}`) < 0.15;
        const pulse = isHighlighted
          ? 0.8 + Math.sin((frame - startDelay) * 0.1 + hex.x * 0.01) * 0.2
          : 1;

        return (
          <div
            key={hex.id}
            style={{
              position: "absolute",
              left: hex.x,
              top: hex.y,
              width: hexSize,
              height: hexSize * 1.15,
              clipPath: "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)",
              background: isHighlighted
                ? `linear-gradient(135deg, ${resolvedHighlight}, ${BRAND.violet})`
                : BRAND.cardBg,
              transform: `scale(${progress * pulse})`,
              opacity: progress * 0.9,
            }}
          />
        );
      })}

      {/* タイトル */}
      <div
        style={{
          position: "absolute",
          right: 80,
          top: 80,
          fontFamily,
          fontSize: 48,
          fontWeight: 700,
          color: colors.text,
          textAlign: "right",
          opacity: interpolate(frame, [startDelay + 30, startDelay + 50], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
        }}
      >
        {text}
        <div style={{ fontSize: 20, color: colors.muted, marginTop: 10, letterSpacing: 4 }}>
          GRID PATTERN
        </div>
      </div>
    </AbsoluteFill>
  );
};
