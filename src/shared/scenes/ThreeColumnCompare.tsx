import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
} from "remotion";
import { baseTokens, BRAND, SCENE_DEFAULTS, TYPOGRAPHY } from "../styles";
import { Card } from "../components/Card";
import { useLayoutMode } from "../formats";
import { SceneBackground } from "../components/SceneBackground";

type CompareColumn = {
  title: string;
  icon?: string;
  items: string[];
  color: string;
};

type ThreeColumnCompareProps = {
  heading: string;
  columns: [CompareColumn, CompareColumn, CompareColumn];
  sectionColor?: string;
  colors?: { bg: string; text: string; muted: string };
  fontFamily?: string;
};

export const ThreeColumnCompare: React.FC<ThreeColumnCompareProps> = ({
  heading,
  columns,
  sectionColor,
  colors = { bg: BRAND.bg, text: BRAND.text, muted: BRAND.textMuted },
  fontFamily = "Inter",
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { isVertical, contentPadding, fontScale, maxItems } = useLayoutMode();

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
          gap: isVertical ? 20 : 32,
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
          flexDirection: isVertical ? "column" : "row",
          gap: isVertical ? 12 : 24,
          flex: 1,
          alignItems: "stretch",
        }}
      >
        {columns.map((col, colIdx) => (
          <div key={colIdx} style={{ flex: 1, display: "flex" }}>
            <Card variant="border"
              color={col.color}
              delay={SCENE_DEFAULTS.elementEntry + colIdx * 10}
              fontFamily={fontFamily}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  marginBottom: 8,
                }}
              >
                {col.icon && (
                  <span style={{ fontSize: Math.round(24 * fontScale) }}>{col.icon}</span>
                )}
                <span
                  style={{
                    fontFamily,
                    fontSize: Math.round(26 * fontScale),
                    fontWeight: 700,
                    color: col.color,
                  }}
                >
                  {col.title}
                </span>
              </div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 12,
                }}
              >
                {col.items.slice(0, isVertical ? 2 : undefined).map((item, itemIdx) => {
                  const itemDelay =
                    SCENE_DEFAULTS.elementEntrySlow +
                    colIdx * 10 +
                    itemIdx * SCENE_DEFAULTS.staggerDelaySlow;
                  const itemP = spring({
                    frame: frame - itemDelay,
                    fps,
                    config: SCENE_DEFAULTS.springSilky,
                  });
                  const itemOpacity = interpolate(
                    itemP,
                    [0, 1],
                    [0, 1],
                    { extrapolateRight: "clamp" }
                  );

                  return (
                    <div
                      key={itemIdx}
                      style={{
                        opacity: itemOpacity,
                        display: "flex",
                        alignItems: "center",
                        gap: 10,
                        fontFamily,
                        fontSize: Math.round(22 * fontScale),
                        color: colors.text,
                        lineHeight: TYPOGRAPHY.lineHeights.normal,
                      }}
                    >
                      <div
                        style={{
                          width: 6,
                          height: 6,
                          borderRadius: "50%",
                          backgroundColor: col.color,
                          flexShrink: 0,
                        }}
                      />
                      {item}
                    </div>
                  );
                })}
              </div>
            </Card>
          </div>
        ))}
      </div>
    </AbsoluteFill>
    </SceneBackground>
  );
};
