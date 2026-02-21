import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
} from "remotion";
import { BRAND, SCENE_DEFAULTS } from "../styles";
import { entrances } from "../animations";

type ItemEntrance = "left" | "scale" | "fade";

type SummaryRecapProps = {
  heading?: string;
  items: string[];
  colors?: { bg: string; text: string; accent: string; muted: string };
  fontFamily?: string;
  itemEntrance?: ItemEntrance;
};

export const SummaryRecap: React.FC<SummaryRecapProps> = ({
  heading = "What We Covered",
  items,
  colors = {
    bg: BRAND.bg,
    text: BRAND.text,
    accent: BRAND.indigo,
    muted: BRAND.textMuted,
  },
  fontFamily = "Inter",
  itemEntrance = "left",
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
        justifyContent: "center",
        padding: 80,
        gap: 28,
      }}
    >
      <div
        style={{
          opacity: headOpacity,
          transform: `translateY(${headY}px)`,
          fontFamily,
          fontSize: 52,
          fontWeight: 800,
          color: colors.text,
          marginBottom: 8,
        }}
      >
        {heading}
      </div>
      {items.map((item, i) => {
        const itemDelay = 10 + i * SCENE_DEFAULTS.staggerDelay;
        const itemP = spring({
          frame: frame - itemDelay,
          fps,
          config: SCENE_DEFAULTS.springSmooth,
        });
        const clampedP = interpolate(itemP, [0, 1], [0, 1], {
          extrapolateRight: "clamp",
        });

        let itemStyle: React.CSSProperties;
        if (itemEntrance === "scale") {
          const s = entrances.scaleUp(clampedP);
          itemStyle = { opacity: s.opacity, transform: s.transform };
        } else if (itemEntrance === "fade") {
          itemStyle = { opacity: clampedP };
        } else {
          // Default "left" — original behavior
          const itemX = interpolate(itemP, [0, 1], [-30, 0], {
            extrapolateRight: "clamp",
          });
          itemStyle = {
            opacity: clampedP,
            transform: `translateX(${itemX}px)`,
          };
        }

        return (
          <div
            key={i}
            style={{
              ...itemStyle,
              display: "flex",
              alignItems: "center",
              gap: 16,
            }}
          >
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: 10,
                backgroundColor: colors.accent,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontFamily,
                fontSize: 18,
                fontWeight: 700,
                color: "#ffffff",
                flexShrink: 0,
              }}
            >
              {i + 1}
            </div>
            <span
              style={{
                fontFamily,
                fontSize: 30,
                color: colors.text,
                lineHeight: 1.3,
              }}
            >
              {item}
            </span>
          </div>
        );
      })}
    </AbsoluteFill>
  );
};
