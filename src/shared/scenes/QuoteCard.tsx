import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
} from "remotion";
import { baseTokens, BRAND, SCENE_DEFAULTS, GLASS, TYPOGRAPHY } from "../styles";
import { SceneBackground } from "../components/SceneBackground";
import { Card } from "../components/Card";
import { useLayoutMode } from "../formats";

type QuoteCardProps = {
  quote: string;
  attribution?: string;
  sectionColor?: string;
  cardStyle?: "glass" | "solid";
  colors?: { bg: string; text: string; muted: string };
  fontFamily?: string;
};

export const QuoteCard: React.FC<QuoteCardProps> = ({
  quote,
  attribution,
  sectionColor = BRAND.indigo,
  cardStyle = "glass",
  colors = { bg: BRAND.bg, text: BRAND.text, muted: BRAND.textMuted },
  fontFamily = "Inter",
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { contentPadding, fontScale } = useLayoutMode();

  const quoteMarkP = spring({
    frame,
    fps,
    config: SCENE_DEFAULTS.springSilky,
  });
  const cardP = spring({
    frame: frame - 6,
    fps,
    config: SCENE_DEFAULTS.springSilky,
  });
  const attrP = spring({
    frame: frame - 18,
    fps,
    config: SCENE_DEFAULTS.springSilky,
  });

  const quoteMarkOpacity = interpolate(quoteMarkP, [0, 1], [0, 0.15], {
    extrapolateRight: "clamp",
  });
  const quoteMarkScale = interpolate(quoteMarkP, [0, 1], [0.5, 1], {
    extrapolateRight: "clamp",
  });

  return (
    <SceneBackground bg={colors.bg}>
    <AbsoluteFill
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: contentPadding,
      }}
    >
      {/* Large decorative quote mark */}
      <div
        style={{
          position: "absolute",
          top: 120,
          left: 140,
          fontSize: Math.round(280 * fontScale),
          fontFamily: "Georgia, serif",
          color: sectionColor,
          opacity: quoteMarkOpacity,
          transform: `scale(${quoteMarkScale})`,
          lineHeight: 1,
        }}
      >
        {"\u201C"}
      </div>

      <div style={{ maxWidth: 1200, width: "100%", zIndex: 1 }}>
        {cardStyle === "glass" ? (
          <Card variant="glass" color={sectionColor} delay={6} glow>
            <div
              style={{
                fontFamily,
                fontSize: Math.round(40 * fontScale),
                fontWeight: 600,
                color: colors.text,
                lineHeight: TYPOGRAPHY.lineHeights.normal,
                fontStyle: "italic",
              }}
            >
              {quote}
            </div>
          </Card>
        ) : (
          <div
            style={{
              opacity: cardP,
              fontFamily,
              fontSize: Math.round(40 * fontScale),
              fontWeight: 600,
              color: colors.text,
              lineHeight: TYPOGRAPHY.lineHeights.normal,
              fontStyle: "italic",
              borderLeft: `4px solid ${sectionColor}`,
              paddingLeft: 32,
            }}
          >
            {quote}
          </div>
        )}

        {attribution && (
          <div
            style={{
              opacity: interpolate(attrP, [0, 1], [0, 1], {
                extrapolateRight: "clamp",
              }),
              transform: `translateY(${interpolate(attrP, [0, 1], [15, 0], { extrapolateRight: "clamp" })}px)`,
              fontFamily,
              fontSize: Math.round(24 * fontScale),
              fontWeight: 500,
              color: colors.muted,
              marginTop: 24,
              textAlign: "right",
            }}
          >
            — {attribution}
          </div>
        )}
      </div>
    </AbsoluteFill>
    </SceneBackground>
  );
};
