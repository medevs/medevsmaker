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
import { useLayoutMode } from "../formats";

type ComparisonSide = {
  title: string;
  items: string[];
  color: string;
};

type EntranceStyle = "slide" | "spring" | "overshoot";
type ComparisonVariant = "split" | "cards";

type ComparisonSplitProps = {
  heading: string;
  left: ComparisonSide;
  right: ComparisonSide;
  variant?: ComparisonVariant;
  sectionColor?: string;
  colors?: { bg: string; text: string; muted: string };
  fontFamily?: string;
  entranceStyle?: EntranceStyle;
};

export const ComparisonSplit: React.FC<ComparisonSplitProps> = ({
  heading,
  left,
  right,
  variant = "split",
  sectionColor,
  colors = { bg: BRAND.bg, text: BRAND.text, muted: BRAND.textMuted },
  fontFamily = "Inter",
  entranceStyle = "slide",
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { isVertical, contentPadding, fontScale } = useLayoutMode();

  const headP = spring({ frame, fps, config: SCENE_DEFAULTS.springSmooth });
  const headOpacity = interpolate(headP, [0, 1], [0, 1]);

  // Pick spring config based on entrance style
  const sideConfig =
    entranceStyle === "overshoot"
      ? SCENE_DEFAULTS.springBouncy
      : entranceStyle === "spring"
        ? SCENE_DEFAULTS.springSnappy
        : SCENE_DEFAULTS.springSmooth;

  const sideDistance = entranceStyle === "overshoot" ? 100 : 60;

  const leftP = spring({
    frame: frame - 10,
    fps,
    config: sideConfig,
  });
  const leftX = interpolate(leftP, [0, 1], [-sideDistance, 0], {
    extrapolateRight: "clamp",
  });
  const leftOpacity = interpolate(leftP, [0, 1], [0, 1], {
    extrapolateRight: "clamp",
  });

  const rightP = spring({
    frame: frame - 10,
    fps,
    config: sideConfig,
  });
  const rightX = interpolate(rightP, [0, 1], [sideDistance, 0], {
    extrapolateRight: "clamp",
  });
  const rightOpacity = interpolate(rightP, [0, 1], [0, 1], {
    extrapolateRight: "clamp",
  });

  // Cards variant: each side in a ColorBorderCard
  if (variant === "cards") {
    const renderCardSide = (
      side: ComparisonSide,
      sideOpacity: number,
      xOffset: number,
      baseDelay: number
    ) => (
      <div style={{ flex: 1, opacity: sideOpacity, transform: `translateX(${xOffset}px)`, display: "flex" }}>
        <ColorBorderCard
          color={side.color}
          delay={baseDelay}
          fontFamily={fontFamily}
        >
          <div
            style={{
              fontFamily,
              fontSize: 28,
              fontWeight: 700,
              color: side.color,
              marginBottom: 4,
            }}
          >
            {side.title}
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {side.items.map((item, i) => {
              const itemP = spring({
                frame: frame - baseDelay - 8 - i * SCENE_DEFAULTS.staggerDelay,
                fps,
                config: SCENE_DEFAULTS.springSilky,
              });
              const itemOpacity = interpolate(itemP, [0, 1], [0, 1], {
                extrapolateRight: "clamp",
              });
              return (
                <div
                  key={i}
                  style={{
                    opacity: itemOpacity,
                    fontFamily,
                    fontSize: 24,
                    color: colors.text,
                    lineHeight: 1.4,
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                  }}
                >
                  <div
                    style={{
                      width: 7,
                      height: 7,
                      borderRadius: "50%",
                      backgroundColor: side.color,
                      flexShrink: 0,
                    }}
                  />
                  {item}
                </div>
              );
            })}
          </div>
        </ColorBorderCard>
      </div>
    );

    return (
      <AbsoluteFill
        style={{
          backgroundColor: colors.bg,
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
            gap: isVertical ? 16 : 32,
            flex: 1,
            alignItems: "stretch",
          }}
        >
          {renderCardSide(left, leftOpacity, isVertical ? 0 : leftX, 15)}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontFamily,
              fontSize: 24,
              fontWeight: 700,
              color: colors.muted,
            }}
          >
            VS
          </div>
          {renderCardSide(right, rightOpacity, isVertical ? 0 : rightX, 15)}
        </div>
      </AbsoluteFill>
    );
  }

  const renderSide = (
    side: ComparisonSide,
    sideOpacity: number,
    xOffset: number,
    baseDelay: number
  ) => (
    <div
      style={{
        flex: 1,
        opacity: sideOpacity,
        transform: `translateX(${xOffset}px)`,
        backgroundColor: `${side.color}10`,
        borderRadius: 16,
        border: `1px solid ${side.color}33`,
        padding: "32px 36px",
        display: "flex",
        flexDirection: "column",
        gap: 20,
      }}
    >
      <div
        style={{
          fontFamily,
          fontSize: 32,
          fontWeight: 700,
          color: side.color,
        }}
      >
        {side.title}
      </div>
      {side.items.map((item, i) => {
        const itemP = spring({
          frame: frame - baseDelay - i * SCENE_DEFAULTS.staggerDelay,
          fps,
          config: SCENE_DEFAULTS.springSmooth,
        });
        const itemOpacity = interpolate(itemP, [0, 1], [0, 1], {
          extrapolateRight: "clamp",
        });
        return (
          <div
            key={i}
            style={{
              opacity: itemOpacity,
              fontFamily,
              fontSize: 26,
              color: colors.text,
              lineHeight: 1.4,
              display: "flex",
              alignItems: "center",
              gap: 12,
            }}
          >
            <div
              style={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                backgroundColor: side.color,
                flexShrink: 0,
              }}
            />
            {item}
          </div>
        );
      })}
    </div>
  );

  return (
    <AbsoluteFill
      style={{
        backgroundColor: colors.bg,
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
          gap: isVertical ? 16 : 32,
          flex: 1,
          alignItems: "stretch",
        }}
      >
        {renderSide(left, leftOpacity, isVertical ? 0 : leftX, 20)}
        {/* VS divider */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontFamily,
            fontSize: 24,
            fontWeight: 700,
            color: colors.muted,
          }}
        >
          VS
        </div>
        {renderSide(right, rightOpacity, isVertical ? 0 : rightX, 20)}
      </div>
    </AbsoluteFill>
  );
};
