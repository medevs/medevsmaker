import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
} from "remotion";
import { baseTokens, BRAND, SCENE_DEFAULTS, SHADOWS, GRADIENTS, TYPOGRAPHY } from "../styles";
import { entrances, glowPulse } from "../animations";
import { ParticleField } from "../components/ParticleField";
import { TextEffect } from "../components/TextEffect";
import { CinematicOverlay } from "../components/CinematicOverlay";
import { SceneBackground } from "../components/SceneBackground";
import { useLayoutMode } from "../formats";

type ColdOpenEntrance = "glow" | "gradient" | "typewriter" | "neon" | "cinematic";

type ColdOpenProps = {
  statement: string;
  subtext?: string;
  colors?: { bg: string; text: string; accent: string };
  fontFamily?: string;
  entrance?: ColdOpenEntrance;
  showParticles?: boolean;
};

export const ColdOpen: React.FC<ColdOpenProps> = ({
  statement,
  subtext,
  colors = { bg: BRAND.bg, text: BRAND.text, accent: BRAND.indigo },
  fontFamily = "Inter",
  entrance = "glow",
  showParticles = true,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { contentPadding, fontScale } = useLayoutMode();

  const mainP = spring({
    frame,
    fps,
    config: SCENE_DEFAULTS.springHeavy,
  });
  const clampedP = interpolate(mainP, [0, 1], [0, 1], {
    extrapolateRight: "clamp",
  });

  const subtextP = spring({
    frame: frame - 20,
    fps,
    config: SCENE_DEFAULTS.springSmooth,
  });
  const subOpacity = interpolate(subtextP, [0, 1], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  let mainStyle: React.CSSProperties = {};

  if (entrance === "typewriter") {
    const charsToShow = Math.floor(
      interpolate(frame, [0, statement.length * 2], [0, statement.length], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      })
    );

    return (
      <SceneBackground bg={colors.bg}>
        <AbsoluteFill
          style={{
            justifyContent: "center",
            alignItems: "center",
            padding: contentPadding,
          }}
        >
          {showParticles && (
            <ParticleField count={15} color={colors.accent} opacity={0.08} />
          )}
          <div
            style={{
              fontFamily,
              fontSize: Math.round(80 * fontScale),
              fontWeight: 800,
              color: colors.text,
              textAlign: "center",
              lineHeight: TYPOGRAPHY.lineHeights.tight,
              textShadow: SHADOWS.glow(colors.accent),
            }}
          >
            {statement.slice(0, charsToShow)}
            <span
              style={{
                opacity: frame % 30 < 15 ? 1 : 0,
                color: colors.accent,
              }}
            >
              |
            </span>
          </div>
          {subtext && (
            <div
              style={{
                opacity: subOpacity,
                fontFamily,
                fontSize: Math.round(28 * fontScale),
                color: colors.accent,
                textAlign: "center",
                marginTop: 24,
              }}
            >
              {subtext}
            </div>
          )}
        </AbsoluteFill>
      </SceneBackground>
    );
  }

  if (entrance === "neon") {
    return (
      <SceneBackground bg={colors.bg}>
        <AbsoluteFill
          style={{
            justifyContent: "center",
            alignItems: "center",
            padding: contentPadding,
          }}
        >
          {showParticles && (
            <ParticleField count={15} color={colors.accent} opacity={0.08} />
          )}
          <TextEffect effect="neon" text={statement} color={colors.accent} fontSize={Math.round(80 * fontScale)} fontFamily={fontFamily} flickerIntensity="heavy" />
          {subtext && (
            <div
              style={{
                opacity: subOpacity,
                fontFamily,
                fontSize: Math.round(28 * fontScale),
                color: colors.accent,
                textAlign: "center",
                marginTop: 24,
              }}
            >
              {subtext}
            </div>
          )}
        </AbsoluteFill>
      </SceneBackground>
    );
  }

  if (entrance === "cinematic") {
    mainStyle = {
      opacity: clampedP,
      transform: `scale(${interpolate(clampedP, [0, 1], [0.85, 1], {
        extrapolateRight: "clamp",
      })})`,
      color: colors.text,
      textShadow: glowPulse(frame, colors.accent, 60),
    };

    return (
      <SceneBackground bg={colors.bg}>
        <AbsoluteFill
          style={{
            justifyContent: "center",
            alignItems: "center",
            padding: contentPadding,
          }}
        >
          {showParticles && (
            <ParticleField count={15} color={colors.accent} opacity={0.08} />
          )}
          <CinematicOverlay effect="filmGrain" intensity={0.3} />
          <CinematicOverlay effect="vignette" intensity={0.6} />
        <div
          style={{
            ...mainStyle,
            fontFamily,
            fontSize: Math.round(80 * fontScale),
            fontWeight: 800,
            textAlign: "center",
            lineHeight: TYPOGRAPHY.lineHeights.tight,
          }}
        >
          {statement}
        </div>
        {subtext && (
          <div
            style={{
              opacity: subOpacity,
              fontFamily,
              fontSize: Math.round(28 * fontScale),
              color: colors.accent,
              textAlign: "center",
              marginTop: 24,
            }}
          >
            {subtext}
          </div>
        )}
        </AbsoluteFill>
      </SceneBackground>
    );
  }

  if (entrance === "gradient") {
    mainStyle = {
      opacity: clampedP,
      transform: `scale(${interpolate(clampedP, [0, 1], [0.8, 1], {
        extrapolateRight: "clamp",
      })})`,
      background: GRADIENTS.textGradient(colors.accent, BRAND.violet),
      backgroundClip: "text",
      WebkitBackgroundClip: "text",
      color: "transparent",
      WebkitTextFillColor: "transparent",
    };
  } else {
    // Default "glow"
    mainStyle = {
      opacity: clampedP,
      transform: `scale(${interpolate(clampedP, [0, 1], [0.85, 1], {
        extrapolateRight: "clamp",
      })})`,
      color: colors.text,
      textShadow: glowPulse(frame, colors.accent, 60),
    };
  }

  return (
    <SceneBackground bg={colors.bg}>
      <AbsoluteFill
        style={{
          justifyContent: "center",
          alignItems: "center",
          padding: contentPadding,
        }}
      >
        {showParticles && (
          <ParticleField count={15} color={colors.accent} opacity={0.08} />
        )}
        <div
          style={{
            ...mainStyle,
            fontFamily,
            fontSize: Math.round(80 * fontScale),
            fontWeight: 800,
            textAlign: "center",
            lineHeight: TYPOGRAPHY.lineHeights.tight,
          }}
        >
          {statement}
        </div>
        {subtext && (
          <div
            style={{
              opacity: subOpacity,
              fontFamily,
              fontSize: Math.round(28 * fontScale),
              color: colors.accent,
              textAlign: "center",
              marginTop: 24,
            }}
          >
            {subtext}
          </div>
        )}
      </AbsoluteFill>
    </SceneBackground>
  );
};
