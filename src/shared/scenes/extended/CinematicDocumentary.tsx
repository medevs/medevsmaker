/**
 * CinematicDocumentary - Documentary style
 */

import { AbsoluteFill, useCurrentFrame, interpolate, Easing } from "remotion";
import { BRAND } from "../../styles";
import { loadFont } from "@remotion/google-fonts/Inter";

const { fontFamily } = loadFont();

export const CinematicDocumentary = ({
  startDelay = 0,
  title = "The Story",
  subtitle = "A Documentary Film",
  location = "2024",
}: {
  startDelay?: number;
  title?: string;
  subtitle?: string;
  location?: string;
}) => {
  const frame = useCurrentFrame();

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
    <AbsoluteFill style={{ background: BRAND.text }}>
      {/* Grid lines */}
      <AbsoluteFill
        style={{
          backgroundImage: `
            linear-gradient(${"#cbd5e1"} 1px, transparent 1px),
            linear-gradient(90deg, ${"#cbd5e1"} 1px, transparent 1px)
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
          background: BRAND.bg,
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
          color: BRAND.bg,
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
          fontSize: 14,
          fontWeight: 500,
          color: "#475569",
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
          color: "#94a3b8",
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
