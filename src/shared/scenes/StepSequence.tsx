import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
} from "remotion";
import { BRAND, SCENE_DEFAULTS } from "../styles";
import { SectionBadge } from "../components/SectionBadge";

type Step = {
  title: string;
  description?: string;
};

type StepSequenceProps = {
  heading: string;
  steps: Step[];
  colors?: { bg: string; text: string; accent: string; muted: string };
  fontFamily?: string;
};

export const StepSequence: React.FC<StepSequenceProps> = ({
  heading,
  steps,
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

  const headP = spring({ frame, fps, config: SCENE_DEFAULTS.springSmooth });
  const headOpacity = interpolate(headP, [0, 1], [0, 1]);
  const headY = interpolate(headP, [0, 1], [30, 0]);

  return (
    <AbsoluteFill
      style={{
        backgroundColor: colors.bg,
        padding: 80,
        gap: 28,
      }}
    >
      <div
        style={{
          opacity: headOpacity,
          transform: `translateY(${headY}px)`,
          fontFamily,
          fontSize: 48,
          fontWeight: 800,
          color: colors.text,
          marginBottom: 8,
        }}
      >
        {heading}
      </div>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 24,
          flex: 1,
          justifyContent: "center",
        }}
      >
        {steps.map((step, i) => {
          const stepDelay = 10 + i * 12;
          const stepP = spring({
            frame: frame - stepDelay,
            fps,
            config: SCENE_DEFAULTS.springSmooth,
          });
          const stepOpacity = interpolate(stepP, [0, 1], [0, 1], {
            extrapolateRight: "clamp",
          });
          const stepX = interpolate(stepP, [0, 1], [-30, 0], {
            extrapolateRight: "clamp",
          });

          return (
            <div
              key={i}
              style={{
                opacity: stepOpacity,
                transform: `translateX(${stepX}px)`,
                display: "flex",
                alignItems: "center",
                gap: 20,
              }}
            >
              <SectionBadge
                number={i + 1}
                delay={stepDelay}
                color={colors.accent}
                size={48}
                fontFamily={fontFamily}
              />
              <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                <div
                  style={{
                    fontFamily,
                    fontSize: 30,
                    fontWeight: 700,
                    color: colors.text,
                  }}
                >
                  {step.title}
                </div>
                {step.description && (
                  <div
                    style={{
                      fontFamily,
                      fontSize: 22,
                      color: colors.muted,
                      lineHeight: 1.4,
                    }}
                  >
                    {step.description}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
