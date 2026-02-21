import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
} from "remotion";
import { BRAND, SCENE_DEFAULTS, SHADOWS, GRADIENTS } from "../styles";
import { glowPulse, pulse } from "../animations";
import { ParticleField } from "../components/ParticleField";

type EndScreenProps = {
  channel?: string;
  cta?: string;
  tagline?: string;
  socialLinks?: { label: string; handle: string }[];
  colors?: { bg: string; text: string; accent: string; muted: string };
  fontFamily?: string;
  showParticles?: boolean;
};

export const EndScreen: React.FC<EndScreenProps> = ({
  channel = "medevsmaker",
  cta = "Subscribe for more",
  tagline = "AI tools for builders",
  socialLinks,
  colors = {
    bg: BRAND.bg,
    text: BRAND.text,
    accent: BRAND.indigo,
    muted: BRAND.textMuted,
  },
  fontFamily = "Inter",
  showParticles = true,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Channel name entrance — bouncy
  const nameP = spring({
    frame,
    fps,
    config: SCENE_DEFAULTS.springBouncy,
  });
  const nameScale = interpolate(nameP, [0, 1], [0, 1], {
    extrapolateRight: "clamp",
  });

  // Animated underline expanding from center
  const lineP = spring({
    frame: frame - 10,
    fps,
    config: SCENE_DEFAULTS.springSmooth,
  });
  const lineWidth = interpolate(lineP, [0, 1], [0, 300], {
    extrapolateRight: "clamp",
  });

  // CTA button
  const ctaP = spring({
    frame: frame - 18,
    fps,
    config: SCENE_DEFAULTS.springSnappy,
  });
  const ctaOpacity = interpolate(ctaP, [0, 1], [0, 1], {
    extrapolateRight: "clamp",
  });
  const ctaY = interpolate(ctaP, [0, 1], [20, 0], {
    extrapolateRight: "clamp",
  });

  // CTA glow pulse
  const ctaGlow = glowPulse(frame, colors.accent, 60);

  // Tagline
  const tagP = spring({
    frame: frame - 28,
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
      {showParticles && (
        <ParticleField
          count={20}
          color={colors.accent}
          opacity={0.1}
          speed={0.3}
        />
      )}

      {/* Channel name with gradient text */}
      <div
        style={{
          transform: `scale(${nameScale})`,
          fontFamily,
          fontSize: 72,
          fontWeight: 800,
          letterSpacing: -1,
          background: GRADIENTS.textGradient(BRAND.indigo, BRAND.violet),
          backgroundClip: "text",
          WebkitBackgroundClip: "text",
          color: "transparent",
          WebkitTextFillColor: "transparent",
        }}
      >
        {channel}
      </div>

      {/* Animated underline */}
      <div
        style={{
          width: lineWidth,
          height: 3,
          background: GRADIENTS.textGradient(colors.accent, BRAND.violet),
          borderRadius: 2,
        }}
      />

      {/* CTA button with glow */}
      <div
        style={{
          opacity: ctaOpacity,
          transform: `translateY(${ctaY}px)`,
          padding: "16px 48px",
          borderRadius: 14,
          backgroundColor: colors.accent,
          fontFamily,
          fontSize: 28,
          fontWeight: 700,
          color: "#ffffff",
          boxShadow: ctaGlow,
        }}
      >
        {cta}
      </div>

      {/* Tagline */}
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

      {/* Social links */}
      {socialLinks && socialLinks.length > 0 && (
        <div
          style={{
            display: "flex",
            gap: 32,
            marginTop: 16,
          }}
        >
          {socialLinks.map((link, i) => {
            const linkP = spring({
              frame: frame - 35 - i * 5,
              fps,
              config: SCENE_DEFAULTS.springSmooth,
            });
            const linkOpacity = interpolate(linkP, [0, 1], [0, 1], {
              extrapolateRight: "clamp",
            });
            const linkY = interpolate(linkP, [0, 1], [15, 0], {
              extrapolateRight: "clamp",
            });

            return (
              <div
                key={i}
                style={{
                  opacity: linkOpacity,
                  transform: `translateY(${linkY}px)`,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 4,
                }}
              >
                <span
                  style={{
                    fontFamily,
                    fontSize: 16,
                    color: colors.muted,
                    textTransform: "uppercase",
                    letterSpacing: 1,
                  }}
                >
                  {link.label}
                </span>
                <span
                  style={{
                    fontFamily,
                    fontSize: 20,
                    fontWeight: 600,
                    color: colors.text,
                  }}
                >
                  {link.handle}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </AbsoluteFill>
  );
};
