/**
 * CinematicSciFi - Sci-Fi / Tech style
 */

import { AbsoluteFill, useCurrentFrame, interpolate } from "remotion";
import { BRAND, type SceneColors, baseTokens } from "../styles";
import { useLayoutMode } from "../formats";
import { loadFont } from "@remotion/google-fonts/Inter";

const { fontFamily } = loadFont();

const SCIFI_DEFAULTS: Required<SceneColors> = {
  bg: "#000510",
  text: BRAND.text,
  accent: BRAND.indigo,
  muted: BRAND.textMuted,
};

export const CinematicSciFi = ({
  startDelay = 0,
  title = "NEXUS",
  status = "SYSTEM ONLINE",
  colors: colorsProp,
  sectionColor,
}: {
  startDelay?: number;
  title?: string;
  status?: string;
  colors?: SceneColors;
  sectionColor?: string;
}) => {
  const frame = useCurrentFrame();
  const { contentPadding, fontScale } = useLayoutMode();
  const colors = { ...SCIFI_DEFAULTS, ...colorsProp };
  const accent = sectionColor || colors.accent;

  const scanlineY = ((frame - startDelay) * 5) % 720;
  const titleOpacity = interpolate(frame, [startDelay + 30, startDelay + 50], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ background: colors.bg }}>
      {/* Grid */}
      <AbsoluteFill
        style={{
          backgroundImage: `
            linear-gradient(${accent}20 1px, transparent 1px),
            linear-gradient(90deg, ${accent}20 1px, transparent 1px)
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
          background: `linear-gradient(90deg, transparent, ${accent}, transparent)`,
          boxShadow: `0 0 20px ${accent}`,
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
          borderLeft: `2px solid ${accent}`,
          borderTop: `2px solid ${accent}`,
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
          borderRight: `2px solid ${accent}`,
          borderBottom: `2px solid ${accent}`,
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
            fontSize: Math.round(20 * fontScale),
            color: accent,
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
            fontSize: Math.round(100 * fontScale),
            fontWeight: 700,
            color: colors.text,
            letterSpacing: 20,
            textShadow: `0 0 30px ${accent}`,
            opacity: titleOpacity,
          }}
        >
          {title}
        </div>
        <div
          style={{
            fontFamily: "monospace",
            fontSize: Math.round(20 * fontScale),
            color: accent,
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
