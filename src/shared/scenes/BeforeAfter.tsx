import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
} from "remotion";
import { BRAND, SCENE_DEFAULTS, SHADOWS } from "../styles";

type BeforeAfterReveal = "wipe" | "split";

type BeforeAfterProps = {
  heading: string;
  before: { title: string; items: string[] };
  after: { title: string; items: string[] };
  colors?: {
    bg: string;
    text: string;
    beforeColor: string;
    afterColor: string;
    muted: string;
  };
  fontFamily?: string;
  reveal?: BeforeAfterReveal;
};

export const BeforeAfter: React.FC<BeforeAfterProps> = ({
  heading,
  before,
  after,
  colors = {
    bg: BRAND.bg,
    text: BRAND.text,
    beforeColor: BRAND.red,
    afterColor: BRAND.green,
    muted: BRAND.textMuted,
  },
  fontFamily = "Inter",
  reveal = "wipe",
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Heading entrance
  const headP = spring({ frame, fps, config: SCENE_DEFAULTS.springSmooth });
  const headOpacity = interpolate(headP, [0, 1], [0, 1]);

  // Before panel
  const beforeP = spring({
    frame: frame - 8,
    fps,
    config: SCENE_DEFAULTS.springSmooth,
  });
  const beforeOpacity = interpolate(beforeP, [0, 1], [0, 1], {
    extrapolateRight: "clamp",
  });

  // After panel — wipe reveal or split
  const afterP = spring({
    frame: frame - 25,
    fps,
    config: SCENE_DEFAULTS.springSmooth,
  });
  const afterProgress = interpolate(afterP, [0, 1], [0, 1], {
    extrapolateRight: "clamp",
  });

  const renderPanel = (
    panel: { title: string; items: string[] },
    panelColor: string,
    panelOpacity: number,
    baseDelay: number
  ) => (
    <div
      style={{
        flex: 1,
        opacity: panelOpacity,
        backgroundColor: `${panelColor}10`,
        borderRadius: 16,
        border: `2px solid ${panelColor}33`,
        padding: "32px 36px",
        display: "flex",
        flexDirection: "column",
        gap: 16,
        boxShadow: SHADOWS.sm,
      }}
    >
      <div
        style={{
          fontFamily,
          fontSize: 30,
          fontWeight: 700,
          color: panelColor,
        }}
      >
        {panel.title}
      </div>
      {panel.items.map((item, i) => {
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
              fontSize: 24,
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
                backgroundColor: panelColor,
                flexShrink: 0,
              }}
            />
            {item}
          </div>
        );
      })}
    </div>
  );

  if (reveal === "wipe") {
    // After panel slides over before via clip-path
    const wipePercent = interpolate(afterProgress, [0, 1], [0, 100], {
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

        <div style={{ display: "flex", gap: 32, flex: 1, position: "relative" }}>
          {/* Before — always visible */}
          {renderPanel(before, colors.beforeColor, beforeOpacity, 12)}

          {/* After — wipe reveal from left */}
          <div
            style={{
              flex: 1,
              clipPath: `inset(0 ${100 - wipePercent}% 0 0)`,
            }}
          >
            {renderPanel(after, colors.afterColor, 1, 30)}
          </div>
        </div>
      </AbsoluteFill>
    );
  }

  // "split" — both slide in from sides
  const afterX = interpolate(afterProgress, [0, 1], [60, 0], {
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

      <div style={{ display: "flex", gap: 32, flex: 1 }}>
        {renderPanel(before, colors.beforeColor, beforeOpacity, 12)}
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
          →
        </div>
        <div
          style={{
            flex: 1,
            opacity: afterProgress,
            transform: `translateX(${afterX}px)`,
          }}
        >
          {renderPanel(after, colors.afterColor, 1, 30)}
        </div>
      </div>
    </AbsoluteFill>
  );
};
