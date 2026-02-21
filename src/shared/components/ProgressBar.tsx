import React from "react";
import {
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
} from "remotion";
import { BRAND, SCENE_DEFAULTS } from "../styles";

type ProgressBarProps = {
  totalSections: number;
  currentSection: number;
  delay?: number;
  activeColor?: string;
  inactiveColor?: string;
  fontFamily?: string;
};

export const ProgressBar: React.FC<ProgressBarProps> = ({
  totalSections,
  currentSection,
  delay = 0,
  activeColor = BRAND.indigo,
  inactiveColor = BRAND.border,
  fontFamily = "Inter",
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const entryProgress = spring({
    frame: frame - delay,
    fps,
    config: SCENE_DEFAULTS.springSmooth,
  });
  const opacity = interpolate(entryProgress, [0, 1], [0, 1], {
    extrapolateRight: "clamp",
  });

  return (
    <div
      style={{
        position: "absolute",
        bottom: 40,
        left: 80,
        right: 80,
        opacity,
        display: "flex",
        alignItems: "center",
        gap: 12,
      }}
    >
      {Array.from({ length: totalSections }, (_, i) => {
        const isActive = i < currentSection;
        const isCurrent = i === currentSection - 1;

        const dotProgress = spring({
          frame: frame - delay - i * 3,
          fps,
          config: SCENE_DEFAULTS.springSnappy,
        });
        const scale = interpolate(dotProgress, [0, 1], [0, 1], {
          extrapolateRight: "clamp",
        });

        return (
          <div
            key={i}
            style={{
              flex: 1,
              height: 6,
              borderRadius: 3,
              backgroundColor: isActive ? activeColor : inactiveColor,
              transform: `scaleX(${scale})`,
              transformOrigin: "left center",
              position: "relative",
            }}
          >
            {isCurrent && (
              <div
                style={{
                  position: "absolute",
                  top: -24,
                  left: "50%",
                  transform: "translateX(-50%)",
                  fontFamily,
                  fontSize: 14,
                  color: BRAND.textMuted,
                  whiteSpace: "nowrap",
                }}
              >
                {currentSection}/{totalSections}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};
