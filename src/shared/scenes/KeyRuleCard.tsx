import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
} from "remotion";
import { baseTokens, BRAND, MONO, SCENE_DEFAULTS, TYPOGRAPHY } from "../styles";
import { GradientText } from "../components/GradientText";
import { Card } from "../components/Card";
import { SceneBackground } from "../components/SceneBackground";
import { useLayoutMode } from "../formats";

type KeyRuleCardProps = {
  preLabel?: string;
  statement: string;
  highlightWord?: string;
  subtitle?: string;
  cards?: { text: string; icon?: string }[];
  sectionColor?: string;
  colors?: { bg: string; text: string; muted: string };
  fontFamily?: string;
};

export const KeyRuleCard: React.FC<KeyRuleCardProps> = ({
  preLabel,
  statement,
  highlightWord,
  subtitle,
  cards,
  sectionColor = BRAND.indigo,
  colors = { bg: BRAND.bg, text: BRAND.text, muted: BRAND.textMuted },
  fontFamily = "Inter",
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { contentPadding, fontScale } = useLayoutMode();

  const headP = spring({
    frame,
    fps,
    config: SCENE_DEFAULTS.springSilky,
  });
  const headOpacity = interpolate(headP, [0, 1], [0, 1], {
    extrapolateRight: "clamp",
  });

  // Render statement with optional gradient highlight
  const renderStatement = () => {
    if (!highlightWord) {
      return (
        <div
          style={{
            fontFamily,
            fontSize: Math.round(48 * fontScale),
            fontWeight: 800,
            color: colors.text,
            textAlign: "center",
            lineHeight: TYPOGRAPHY.lineHeights.normal,
          }}
        >
          {statement}
        </div>
      );
    }

    const idx = statement.indexOf(highlightWord);
    if (idx === -1) {
      return (
        <div
          style={{
            fontFamily,
            fontSize: Math.round(48 * fontScale),
            fontWeight: 800,
            color: colors.text,
            textAlign: "center",
            lineHeight: TYPOGRAPHY.lineHeights.normal,
          }}
        >
          {statement}
        </div>
      );
    }

    const before = statement.slice(0, idx);
    const after = statement.slice(idx + highlightWord.length);

    return (
      <div
        style={{
          fontFamily,
          fontSize: Math.round(48 * fontScale),
          fontWeight: 800,
          color: colors.text,
          textAlign: "center",
          lineHeight: TYPOGRAPHY.lineHeights.normal,
        }}
      >
        {before}
        <GradientText
          text={highlightWord}
          from={sectionColor}
          to={BRAND.violet}
          fontSize={Math.round(48 * fontScale)}
          fontWeight={800}
          fontFamily={fontFamily}
          delay={SCENE_DEFAULTS.elementEntry}
          glow
        />
        {after}
      </div>
    );
  };

  return (
    <SceneBackground bg={colors.bg}>
      <AbsoluteFill
        style={{
          justifyContent: "center",
          alignItems: "center",
          padding: contentPadding,
          gap: 28,
        }}
      >
      {preLabel && (
        <div
          style={{
            opacity: headOpacity,
            fontFamily: MONO.fontFamily,
            fontSize: Math.round(20 * fontScale),
            fontWeight: 700,
            letterSpacing: MONO.letterSpacing,
            textTransform: MONO.textTransform,
            color: sectionColor,
          }}
        >
          {preLabel}
        </div>
      )}

      <div style={{ opacity: headOpacity }}>{renderStatement()}</div>

      {subtitle && (
        <div
          style={{
            opacity: interpolate(
              spring({
                frame: frame - SCENE_DEFAULTS.elementEntrySlow,
                fps,
                config: SCENE_DEFAULTS.springSilky,
              }),
              [0, 1],
              [0, 1],
              { extrapolateRight: "clamp" }
            ),
            fontFamily,
            fontSize: Math.round(24 * fontScale),
            color: colors.muted,
            textAlign: "center",
            maxWidth: 800,
            lineHeight: TYPOGRAPHY.lineHeights.normal,
          }}
        >
          {subtitle}
        </div>
      )}

      {cards && cards.length > 0 && (
        <div
          style={{
            display: "flex",
            gap: 16,
            marginTop: 12,
            maxWidth: 900,
            width: "100%",
          }}
        >
          {cards.map((card, i) => (
            <div key={i} style={{ flex: 1 }}>
              <Card variant="border"
                color={sectionColor}
                delay={
                  SCENE_DEFAULTS.elementEntrySlow +
                  10 +
                  i * SCENE_DEFAULTS.staggerDelaySlow
                }
                size="sm"
                fontFamily={fontFamily}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    fontFamily,
                    fontSize: Math.round(20 * fontScale),
                    color: colors.text,
                  }}
                >
                  {card.icon && (
                    <span style={{ fontSize: Math.round(20 * fontScale) }}>{card.icon}</span>
                  )}
                  {card.text}
                </div>
              </Card>
            </div>
          ))}
        </div>
      )}
    </AbsoluteFill>
    </SceneBackground>
  );
};
