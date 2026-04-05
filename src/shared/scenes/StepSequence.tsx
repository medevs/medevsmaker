import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
} from "remotion";
import { baseTokens, BRAND, SCENE_DEFAULTS, TYPOGRAPHY } from "../styles";
import { SectionBadge } from "../components/SectionBadge";
import { Card } from "../components/Card";
import { SceneBackground } from "../components/SceneBackground";
import { useLayoutMode } from "../formats";

type Step = {
  title: string;
  description?: string;
  icon?: string;
};

type StepSequenceVariant = "default" | "card";

type StepSequenceProps = {
  heading: string;
  steps: Step[];
  variant?: StepSequenceVariant;
  sectionColor?: string;
  colors?: { bg: string; text: string; accent: string; muted: string };
  fontFamily?: string;
};

export const StepSequence: React.FC<StepSequenceProps> = ({
  heading,
  steps,
  variant = "default",
  sectionColor,
  colors = {
    bg: BRAND.bg,
    text: BRAND.text,
    accent: BRAND.indigo,
    muted: BRAND.textMuted,
  },
  fontFamily = "Inter",
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
          padding: contentPadding,
          gap: 28,
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

          if (variant === "card") {
            return (
              <Card variant="border"
                key={i}
                color={effectiveAccent}
                delay={stepDelay}
                size="sm"
                icon={step.icon}
                fontFamily={fontFamily}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                  <SectionBadge
                    number={i + 1}
                    delay={stepDelay}
                    color={effectiveAccent}
                    size={40}
                    fontFamily={fontFamily}
                  />
                  <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                    <div
                      style={{
                        fontFamily,
                        fontSize: Math.round(28 * fontScale),
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
                          fontSize: Math.round(20 * fontScale),
                          color: colors.muted,
                          lineHeight: TYPOGRAPHY.lineHeights.normal,
                        }}
                      >
                        {step.description}
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            );
          }

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
                color={effectiveAccent}
                size={48}
                fontFamily={fontFamily}
              />
              <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                <div
                  style={{
                    fontFamily,
                    fontSize: Math.round(30 * fontScale),
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
                      fontSize: Math.round(22 * fontScale),
                      color: colors.muted,
                      lineHeight: TYPOGRAPHY.lineHeights.normal,
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
    </SceneBackground>
  );
};
