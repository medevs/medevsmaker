import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
} from "remotion";
import { BRAND, SCENE_DEFAULTS } from "../styles";
import { ColorBorderCard } from "../components/ColorBorderCard";
import { PillBadge } from "../components/PillBadge";

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

  const headP = spring({
    frame,
    fps,
    config: SCENE_DEFAULTS.springSilky,
  });
  const headOpacity = interpolate(headP, [0, 1], [0, 1], {
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: colors.bg,
        padding: 80,
        gap: 32,
      }}
    >
      <div
        style={{
          opacity: headOpacity,
          fontFamily,
          fontSize: 48,
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
            <ColorBorderCard
              key={i}
              color={row.answerColor || sectionColor}
              delay={rowDelay}
              variant="compact"
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
                    <span style={{ fontSize: 22 }}>{row.icon}</span>
                  )}
                  <span
                    style={{
                      fontFamily,
                      fontSize: 24,
                      color: colors.text,
                      lineHeight: 1.4,
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
            </ColorBorderCard>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
