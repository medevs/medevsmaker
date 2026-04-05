import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
} from "remotion";
import { baseTokens, BRAND, SCENE_DEFAULTS, SHADOWS, TYPOGRAPHY } from "../styles";
import { SceneBackground } from "../components/SceneBackground";
import { BulletReveal } from "../components/BulletReveal";
import { useLayoutMode } from "../formats";

type BulletRevealSceneProps = {
  heading: string;
  items: string[];
  bulletStyle?: "dot" | "check" | "arrow" | "number";
  sectionColor?: string;
  colors?: { bg: string; text: string; accent: string };
  fontFamily?: string;
  stagger?: "default" | "dramatic";
};

export const BulletRevealScene: React.FC<BulletRevealSceneProps> = ({
  heading,
  items,
  bulletStyle = "dot",
  sectionColor,
  colors = { bg: BRAND.bg, text: BRAND.text, accent: BRAND.cyan },
  fontFamily = "Inter",
  stagger = "default",
}) => {
  const effectiveAccent = sectionColor || colors.accent;
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { contentPadding, fontScale } = useLayoutMode();

  const headP = spring({ frame, fps, config: SCENE_DEFAULTS.springSmooth });
  const headOpacity = interpolate(headP, [0, 1], [0, 1]);
  const headY = interpolate(headP, [0, 1], [30, 0]);

  return (
    <SceneBackground bg={colors.bg}>
    <AbsoluteFill
      style={{
        justifyContent: "center",
        padding: contentPadding,
        gap: 32,
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
      {stagger === "dramatic" ? (
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          {items.map((text, i) => {
            const itemDelay = 12 + i * 18;
            const itemP = spring({
              frame: frame - itemDelay,
              fps,
              config: SCENE_DEFAULTS.springSmooth,
            });
            const itemOpacity = interpolate(itemP, [0, 1], [0, 1], {
              extrapolateRight: "clamp",
            });
            const itemScale = interpolate(itemP, [0, 1], [0.85, 1], {
              extrapolateRight: "clamp",
            });

            const bulletSymbol =
              bulletStyle === "check" ? "✓" :
              bulletStyle === "arrow" ? "→" :
              bulletStyle === "number" ? `${i + 1}` : "•";

            return (
              <div
                key={i}
                style={{
                  opacity: itemOpacity,
                  transform: `scale(${itemScale})`,
                  display: "flex",
                  alignItems: "center",
                  gap: 16,
                  padding: "12px 20px",
                  borderRadius: baseTokens.borderRadius.md,
                  boxShadow: itemOpacity > 0 ? SHADOWS.glow(effectiveAccent) : "none",
                }}
              >
                <span
                  style={{
                    color: effectiveAccent,
                    fontSize: Math.round(24 * fontScale),
                    fontWeight: 700,
                    flexShrink: 0,
                  }}
                >
                  {bulletSymbol}
                </span>
                <span
                  style={{
                    fontFamily,
                    fontSize: Math.round(28 * fontScale),
                    color: colors.text,
                    lineHeight: TYPOGRAPHY.lineHeights.normal,
                  }}
                >
                  {text}
                </span>
              </div>
            );
          })}
        </div>
      ) : (
        <BulletReveal
          items={items.map((text) => ({ text }))}
          delay={12}
          bulletColor={effectiveAccent}
          fontFamily={fontFamily}
          style={bulletStyle}
        />
      )}
    </AbsoluteFill>
    </SceneBackground>
  );
};
