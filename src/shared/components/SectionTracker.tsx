import React from "react";
import {
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
} from "remotion";
import { baseTokens, BRAND, MONO, SCENE_DEFAULTS } from "../styles";

type TrackerSection = {
  name: string;
  color: string;
};

type SectionTrackerProps = {
  sections: TrackerSection[];
  currentIndex: number;
  delay?: number;
};

export const SectionTracker: React.FC<SectionTrackerProps> = ({
  sections,
  currentIndex,
  delay = 0,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const progress = spring({
    frame: frame - delay,
    fps,
    config: SCENE_DEFAULTS.springSilky,
  });
  const opacity = interpolate(progress, [0, 1], [0, 1], {
    extrapolateRight: "clamp",
  });

  const current = sections[currentIndex] || sections[0];
  if (!current) return null;

  return (
    <div
      style={{
        position: "absolute",
        bottom: 40,
        right: 40,
        zIndex: 10,
        opacity,
        display: "flex",
        flexDirection: "column",
        gap: baseTokens.spacing.xs,
        backgroundColor: "rgba(15, 15, 26, 0.85)",
        borderLeft: `3px solid ${current.color}`,
        borderRadius: baseTokens.borderRadius.md,
        padding: `${baseTokens.spacing.sm}px ${baseTokens.spacing.md}px`,
        minWidth: 180,
      }}
    >
      <div
        style={{
          fontFamily: MONO.fontFamily,
          fontSize: baseTokens.fontSizes.xs,
          fontWeight: 700,
          letterSpacing: MONO.letterSpacing,
          textTransform: MONO.textTransform,
          color: current.color,
        }}
      >
        NOW COVERING
      </div>
      <div
        style={{
          fontFamily: "Inter",
          fontSize: baseTokens.fontSizes.xs,
          fontWeight: 700,
          color: BRAND.text,
          lineHeight: 1.3,
        }}
      >
        {current.name}
      </div>
      <div style={{ display: "flex", gap: 6, marginTop: 2 }}>
        {sections.map((section, i) => (
          <div
            key={i}
            style={{
              width: i === currentIndex ? 20 : 8,
              height: 8,
              borderRadius: 4,
              backgroundColor:
                i === currentIndex ? section.color : `${section.color}44`,
              transition: "none",
            }}
          />
        ))}
      </div>
    </div>
  );
};
