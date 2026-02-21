import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
} from "remotion";
import { BRAND, SCENE_DEFAULTS } from "../styles";

type ComparisonSide = {
  title: string;
  items: string[];
  color: string;
};

type EntranceStyle = "slide" | "spring" | "overshoot";

type ComparisonSplitProps = {
  heading: string;
  left: ComparisonSide;
  right: ComparisonSide;
  colors?: { bg: string; text: string; muted: string };
  fontFamily?: string;
  entranceStyle?: EntranceStyle;
};

export const ComparisonSplit: React.FC<ComparisonSplitProps> = ({
  heading,
  left,
  right,
  colors = { bg: BRAND.bg, text: BRAND.text, muted: BRAND.textMuted },
  fontFamily = "Inter",
  entranceStyle = "slide",
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

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
          gap: 32,
          flex: 1,
          alignItems: "stretch",
        }}
      >
        {renderSide(left, leftOpacity, leftX, 20)}
        {/* VS divider */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            fontFamily,
            fontSize: 24,
            fontWeight: 700,
            color: colors.muted,
          }}
        >
          VS
        </div>
        {renderSide(right, rightOpacity, rightX, 20)}
      </div>
    </AbsoluteFill>
  );
};
