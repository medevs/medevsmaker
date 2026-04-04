/**
 * CinematicDocumentary - Documentary style
 */

import { AbsoluteFill, useCurrentFrame, interpolate, Easing } from "remotion";
import { BRAND, DEFAULT_SCENE_COLORS, type SceneColors } from "../../styles";
import { loadFont } from "@remotion/google-fonts/Inter";

const { fontFamily } = loadFont();

export const CinematicDocumentary = ({
  startDelay = 0,
  title = "The Story",
  subtitle = "A Documentary Film",
  location = "2024",
  colors: colorsProp,
  sectionColor,
}: {
  startDelay?: number;
  title?: string;
  subtitle?: string;
  location?: string;
  colors?: SceneColors;
  sectionColor?: string;
}) => {
  const frame = useCurrentFrame();
  const colors = { ...DEFAULT_SCENE_COLORS, ...colorsProp };
  const accent = sectionColor || colors.accent;

  const lineProgress = interpolate(frame, [startDelay, startDelay + 30], [0, 100], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });
  const titleOpacity = interpolate(frame, [startDelay + 20, startDelay + 40], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ background: colors.bg }}>
      {/* Grid lines */}
      <AbsoluteFill
        style={{
          backgroundImage: `
            linear-gradient(${colors.muted}30 1px, transparent 1px),
            linear-gradient(90deg, ${colors.muted}30 1px, transparent 1px)
          `,
          backgroundSize: "100px 100px",
          opacity: 0.5,
        }}
      />

      {/* Horizontal line */}
      <div
        style={{
          position: "absolute",
          left: "10%",
          top: "50%",
          width: `${lineProgress * 0.8}%`,
          height: 2,
          background: accent,
        }}
      />

      {/* Title */}
      <div
        style={{
          position: "absolute",
          left: "10%",
          top: "52%",
          fontFamily,
          fontSize: 60,
          fontWeight: 300,
          color: colors.text,
          letterSpacing: 4,
          opacity: titleOpacity,
        }}
      >
        {title}
      </div>

      {/* Subtitle */}
      <div
        style={{
          position: "absolute",
          left: "10%",
          top: "42%",
          fontFamily,
          fontSize: 20,
          fontWeight: 500,
          color: colors.muted,
          letterSpacing: 6,
          textTransform: "uppercase",
          opacity: interpolate(frame, [startDelay + 30, startDelay + 50], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
        }}
      >
        {subtitle}
      </div>

      {/* Location / Year */}
      <div
        style={{
          position: "absolute",
          right: "10%",
          bottom: "15%",
          fontFamily,
          fontSize: 100,
          fontWeight: 100,
          color: colors.muted,
          opacity: interpolate(frame, [startDelay + 40, startDelay + 60], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
        }}
      >
        {location}
      </div>
    </AbsoluteFill>
  );
};
