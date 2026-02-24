import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
} from "remotion";
import { BRAND, SCENE_DEFAULTS } from "../styles";
import { CodeBlock } from "../components/CodeBlock";
import { ColorBorderCard } from "../components/ColorBorderCard";

type Annotation = {
  text: string;
  line: number;
};

type CodeDisplayLayout = "side" | "annotated";

type CodeDisplayProps = {
  title: string;
  code: string;
  annotations?: Annotation[];
  showLineNumbers?: boolean;
  highlightLines?: number[];
  layout?: CodeDisplayLayout;
  sectionColor?: string;
  colors?: { bg: string; text: string; accent: string; muted: string };
  fontFamily?: string;
};

export const CodeDisplay: React.FC<CodeDisplayProps> = ({
  title,
  code,
  annotations = [],
  showLineNumbers = true,
  highlightLines = [],
  layout = "side",
  sectionColor,
  colors = {
    bg: BRAND.bg,
    text: BRAND.text,
    accent: BRAND.cyan,
    muted: BRAND.textMuted,
  },
  fontFamily = "Inter",
}) => {
  const effectiveAccent = sectionColor || colors.accent;
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleP = spring({ frame, fps, config: SCENE_DEFAULTS.springSmooth });
  const titleOpacity = interpolate(titleP, [0, 1], [0, 1]);
  const titleY = interpolate(titleP, [0, 1], [30, 0]);

  return (
    <AbsoluteFill
      style={{
        backgroundColor: colors.bg,
        padding: 80,
        gap: 24,
      }}
    >
      {/* Title */}
      <div
        style={{
          opacity: titleOpacity,
          transform: `translateY(${titleY}px)`,
          fontFamily,
          fontSize: 44,
          fontWeight: 800,
          color: colors.text,
        }}
      >
        {title}
      </div>

      {/* Code + Annotations */}
      <div
        style={{
          display: "flex",
          gap: 32,
          flex: 1,
          alignItems: "flex-start",
        }}
      >
        <div style={{ flex: 3 }}>
          <CodeBlock
            code={code}
            delay={8}
            showLineNumbers={showLineNumbers}
            highlightLines={highlightLines}
          />
        </div>

        {annotations.length > 0 && (
          <div
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              gap: layout === "annotated" ? 12 : 16,
              paddingTop: 16,
            }}
          >
            {annotations.map((ann, i) => {
              const annDelay = 30 + i * 12;
              const annP = spring({
                frame: frame - annDelay,
                fps,
                config: layout === "annotated"
                  ? SCENE_DEFAULTS.springSilky
                  : SCENE_DEFAULTS.springSmooth,
              });
              const annOpacity = interpolate(annP, [0, 1], [0, 1], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
              });
              const annX = interpolate(annP, [0, 1], [20, 0], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
              });

              if (layout === "annotated") {
                return (
                  <ColorBorderCard
                    key={i}
                    color={effectiveAccent}
                    delay={annDelay}
                    variant="compact"
                    fontFamily={fontFamily}
                  >
                    <div
                      style={{
                        fontFamily,
                        fontSize: 18,
                        color: colors.muted,
                        lineHeight: 1.4,
                      }}
                    >
                      <span style={{ color: effectiveAccent, fontWeight: 700 }}>
                        L{ann.line}
                      </span>{" "}
                      {ann.text}
                    </div>
                  </ColorBorderCard>
                );
              }

              return (
                <div
                  key={i}
                  style={{
                    opacity: annOpacity,
                    transform: `translateX(${annX}px)`,
                    fontFamily,
                    fontSize: 20,
                    color: colors.muted,
                    paddingLeft: 12,
                    borderLeft: `2px solid ${effectiveAccent}44`,
                    lineHeight: 1.4,
                  }}
                >
                  <span style={{ color: effectiveAccent, fontWeight: 700 }}>
                    L{ann.line}
                  </span>{" "}
                  {ann.text}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </AbsoluteFill>
  );
};
