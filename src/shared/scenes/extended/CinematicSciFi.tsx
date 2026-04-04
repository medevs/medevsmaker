/**
 * CinematicSciFi - Sci-Fi / Tech style
 */

import { AbsoluteFill, useCurrentFrame, interpolate } from "remotion";
import { BRAND } from "../../styles";
import { loadFont } from "@remotion/google-fonts/Inter";

const { fontFamily } = loadFont();

export const CinematicSciFi = ({
  startDelay = 0,
  title = "NEXUS",
  status = "SYSTEM ONLINE",
}: {
  startDelay?: number;
  title?: string;
  status?: string;
}) => {
  const frame = useCurrentFrame();

  const scanlineY = ((frame - startDelay) * 5) % 720;
  const titleOpacity = interpolate(frame, [startDelay + 30, startDelay + 50], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ background: "#000510" }}>
      {/* Grid */}
      <AbsoluteFill
        style={{
          backgroundImage: `
            linear-gradient(${BRAND.indigo}20 1px, transparent 1px),
            linear-gradient(90deg, ${BRAND.indigo}20 1px, transparent 1px)
          `,
          backgroundSize: "40px 40px",
          perspective: 500,
          transform: "rotateX(60deg) translateY(-200px)",
          transformOrigin: "center center",
        }}
      />

      {/* Scanline */}
      <div
        style={{
          position: "absolute",
          left: 0,
          top: scanlineY,
          width: "100%",
          height: 4,
          background: `linear-gradient(90deg, transparent, ${BRAND.indigo}, transparent)`,
          boxShadow: `0 0 20px ${BRAND.indigo}`,
        }}
      />

      {/* HUD frame */}
      <div
        style={{
          position: "absolute",
          left: 60,
          top: 60,
          width: 100,
          height: 100,
          borderLeft: `2px solid ${BRAND.indigo}`,
          borderTop: `2px solid ${BRAND.indigo}`,
          opacity: interpolate(frame, [startDelay, startDelay + 20], [0, 0.6], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
        }}
      />
      <div
        style={{
          position: "absolute",
          right: 60,
          bottom: 60,
          width: 100,
          height: 100,
          borderRight: `2px solid ${BRAND.indigo}`,
          borderBottom: `2px solid ${BRAND.indigo}`,
          opacity: interpolate(frame, [startDelay + 10, startDelay + 30], [0, 0.6], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
        }}
      />

      {/* Title */}
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "50%",
          transform: "translate(-50%, -50%)",
          textAlign: "center",
        }}
      >
        <div
          style={{
            fontFamily: "monospace",
            fontSize: 14,
            color: BRAND.indigo,
            letterSpacing: 8,
            marginBottom: 20,
            opacity: interpolate(frame, [startDelay + 20, startDelay + 40], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            }),
          }}
        >
          INITIALIZING SYSTEM
        </div>
        <div
          style={{
            fontFamily,
            fontSize: 100,
            fontWeight: 700,
            color: BRAND.text,
            letterSpacing: 20,
            textShadow: `0 0 30px ${BRAND.indigo}`,
            opacity: titleOpacity,
          }}
        >
          {title}
        </div>
        <div
          style={{
            fontFamily: "monospace",
            fontSize: 12,
            color: BRAND.indigo,
            marginTop: 20,
            opacity: interpolate(frame, [startDelay + 50, startDelay + 70], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            }),
          }}
        >
          [ {status} ]
        </div>
      </div>
    </AbsoluteFill>
  );
};
