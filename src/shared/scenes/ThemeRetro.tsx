/**
 * ThemeRetro - レトロ/ヴィンテージ - セピア、ノイズ
 */

import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { type SceneColors, baseTokens } from "../styles";
import { useLayoutMode } from "../formats";
import { loadFont } from "@remotion/google-fonts/Inter";

const { fontFamily } = loadFont();

const RETRO_DEFAULTS: Required<SceneColors> = {
  bg: "#f4e9d8",
  text: "#3d3027",
  accent: "#8b7355",
  muted: "#6b5a47",
};

export const ThemeRetro = ({ startDelay = 0, text = "Vintage", subtitle = "Classic Style Never Dies", colors: colorsProp, sectionColor }: {
  startDelay?: number;
  text?: string;
  subtitle?: string;
  colors?: SceneColors;
  sectionColor?: string;
}) => {
  const frame = useCurrentFrame();
  const { contentPadding, fontScale } = useLayoutMode();
  const colors = { ...RETRO_DEFAULTS, ...colorsProp };
  const accent = sectionColor || colors.accent;

  const textProgress = interpolate(frame, [startDelay, startDelay + 30], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.bezier(0.16, 1, 0.3, 1) });

  return (
    <AbsoluteFill style={{ background: colors.bg }}>
      {/* Noise texture */}
      <AbsoluteFill
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          opacity: 0.1,
          mixBlendMode: "multiply",
        }}
      />

      {/* Vignette */}
      <AbsoluteFill
        style={{
          background: "radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.3) 100%)",
        }}
      />

      {/* Main content */}
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
            fontFamily,
            fontSize: Math.round(20 * fontScale),
            color: accent,
            letterSpacing: 8,
            marginBottom: 20,
            opacity: textProgress,
          }}
        >
          ★ ESTABLISHED 1985 ★
        </div>
        <div
          style={{
            fontFamily,
            fontSize: Math.round(80 * fontScale),
            fontWeight: 900,
            color: colors.text,
            letterSpacing: -2,
            textTransform: "uppercase",
            opacity: textProgress,
            transform: `translateY(${(1 - textProgress) * 30}px)`,
          }}
        >
          {text}
        </div>
        <div
          style={{
            fontFamily,
            fontSize: Math.round(24 * fontScale),
            fontWeight: 300,
            color: colors.muted,
            marginTop: 10,
            fontStyle: "italic",
            opacity: textProgress,
          }}
        >
          {subtitle}
        </div>

        {/* Decorative lines */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 20,
            marginTop: 30,
            opacity: textProgress,
          }}
        >
          <div style={{ width: 60, height: 1, background: accent }} />
          <div
            style={{
              width: 8,
              height: 8,
              background: accent,
              transform: "rotate(45deg)",
            }}
          />
          <div style={{ width: 60, height: 1, background: accent }} />
        </div>
      </div>
    </AbsoluteFill>
  );
};
