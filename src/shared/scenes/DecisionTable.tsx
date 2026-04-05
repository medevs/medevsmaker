import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
} from "remotion";
import { baseTokens, BRAND, SCENE_DEFAULTS, TYPOGRAPHY } from "../styles";
import { SceneBackground } from "../components/SceneBackground";
import { Card } from "../components/Card";
import { PillBadge } from "../components/PillBadge";
import { useLayoutMode } from "../formats";

type DecisionRow = {
  icon?: string;
  question: string;
  answer: string;
  answerColor?: string;
};

type DecisionTableProps = {
  heading: string;
  rows: DecisionRow[];
  sectionColor?: string;
  colors?: { bg: string; text: string; muted: string };
  fontFamily?: string;
};

export const DecisionTable: React.FC<DecisionTableProps> = ({
  heading,
  rows,
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

  return (
    <SceneBackground bg={colors.bg}>
    <AbsoluteFill
      style={{
        padding: contentPadding,
        gap: 32,
      }}
    >
      <div
        style={{
          opacity: headOpacity,
          fontFamily,
          fontSize: Math.round(48 * fontScale),
          fontWeight: 800,
          color: colors.text,
          textAlign: "center",
        }}
      >
        {heading}
      </div>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 16,
          flex: 1,
          justifyContent: "center",
          padding: "0 40px",
        }}
      >
        {rows.map((row, i) => {
          const rowDelay =
            SCENE_DEFAULTS.elementEntry +
            i * SCENE_DEFAULTS.staggerDelaySlow;

          return (
            <Card variant="border"
              key={i}
              color={row.answerColor || sectionColor}
              delay={rowDelay}
              size="sm"
              fontFamily={fontFamily}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: 20,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    flex: 1,
                  }}
                >
                  {row.icon && (
                    <span style={{ fontSize: Math.round(22 * fontScale) }}>{row.icon}</span>
                  )}
                  <span
                    style={{
                      fontFamily,
                      fontSize: Math.round(24 * fontScale),
                      color: colors.text,
                      lineHeight: TYPOGRAPHY.lineHeights.normal,
                    }}
                  >
                    {row.question}
                  </span>
                </div>
                <PillBadge
                  label={row.answer}
                  color={row.answerColor || sectionColor}
                  delay={rowDelay + 8}
                />
              </div>
            </Card>
          );
        })}
      </div>
    </AbsoluteFill>
    </SceneBackground>
  );
};
