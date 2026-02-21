import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
} from "remotion";
import { BRAND, SCENE_DEFAULTS } from "../styles";

type OutroProps = {
  channel?: string;
  cta?: string;
  tagline?: string;
  colors?: { bg: string; text: string; accent: string; muted: string };
  fontFamily?: string;
};

export const Outro: React.FC<OutroProps> = ({
  channel = "medevsmaker",
  cta = "Subscribe for more",
  tagline = "AI tools for builders",
  colors = {
    bg: BRAND.bg,
    text: BRAND.text,
    accent: BRAND.indigo,
    muted: BRAND.textMuted,
  },
  fontFamily = "Inter",
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const logoP = spring({
    frame,
    fps,
    config: SCENE_DEFAULTS.springSnappy,
  });
  const logoScale = interpolate(logoP, [0, 1], [0, 1], {
    extrapolateRight: "clamp",
  });

  const ctaP = spring({
    frame: frame - 12,
    fps,
    config: SCENE_DEFAULTS.springSmooth,
  });
  const ctaOpacity = interpolate(ctaP, [0, 1], [0, 1], {
    extrapolateRight: "clamp",
  });
  const ctaY = interpolate(ctaP, [0, 1], [20, 0], {
    extrapolateRight: "clamp",
  });

  const tagP = spring({
    frame: frame - 22,
    fps,
    config: SCENE_DEFAULTS.springSmooth,
  });
  const tagOpacity = interpolate(tagP, [0, 1], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: colors.bg,
        justifyContent: "center",
        alignItems: "center",
        padding: 80,
        gap: 24,
      }}
    >
      <div
        style={{
          transform: `scale(${logoScale})`,
          fontFamily,
          fontSize: 64,
          fontWeight: 800,
          color: colors.text,
          letterSpacing: -1,
        }}
      >
        {channel}
      </div>
      <div
        style={{
          opacity: ctaOpacity,
          transform: `translateY(${ctaY}px)`,
          padding: "14px 40px",
          borderRadius: 12,
          backgroundColor: colors.accent,
          fontFamily,
          fontSize: 26,
          fontWeight: 600,
          color: "#ffffff",
        }}
      >
        {cta}
      </div>
      <div
        style={{
          opacity: tagOpacity,
          fontFamily,
          fontSize: 22,
          color: colors.muted,
        }}
      >
        {tagline}
      </div>
    </AbsoluteFill>
  );
};
