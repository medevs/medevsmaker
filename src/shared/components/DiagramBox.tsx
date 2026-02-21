import React from "react";
import {
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
} from "remotion";
import { BRAND, SCENE_DEFAULTS } from "../styles";

type DiagramBoxProps = {
  label: string;
  sublabel?: string;
  color?: string;
  delay?: number;
  width?: number;
  height?: number;
  fontSize?: number;
  fontFamily?: string;
};

export const DiagramBox: React.FC<DiagramBoxProps> = ({
  label,
  sublabel,
  color = BRAND.indigo,
  delay = 0,
  width = 220,
  height = 100,
  fontSize = 24,
  fontFamily = "Inter",
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const progress = spring({
    frame: frame - delay,
    fps,
    config: SCENE_DEFAULTS.springSnappy,
  });

  const scale = interpolate(progress, [0, 1], [0, 1], {
    extrapolateRight: "clamp",
  });
  const opacity = interpolate(progress, [0, 1], [0, 1], {
    extrapolateRight: "clamp",
  });

  return (
    <div
      style={{
        opacity,
        transform: `scale(${scale})`,
        width,
        height,
        borderRadius: 16,
        backgroundColor: `${color}18`,
        border: `2px solid ${color}`,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        gap: 4,
      }}
    >
      <div
        style={{
          fontFamily,
          fontSize,
          fontWeight: 700,
          color: BRAND.text,
          textAlign: "center",
        }}
      >
        {label}
      </div>
      {sublabel && (
        <div
          style={{
            fontFamily,
            fontSize: fontSize - 6,
            color: BRAND.textMuted,
            textAlign: "center",
          }}
        >
          {sublabel}
        </div>
      )}
    </div>
  );
};
