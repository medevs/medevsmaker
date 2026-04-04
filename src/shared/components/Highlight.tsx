import React from "react";
import { BRAND } from "../styles";
import { loadFont } from "@remotion/google-fonts/Inter";

const { fontFamily } = loadFont();

type HighlightProps = {
  x: number;
  y: number;
  width: number;
  height: number;
  progress: number;
  label?: string;
  color?: string;
};

export const Highlight: React.FC<HighlightProps> = ({
  x, y, width, height, progress, label, color = BRAND.indigo,
}) => (
  <div
    style={{
      position: "absolute",
      left: x,
      top: y,
      width,
      height,
      border: `2px solid ${color}`,
      borderRadius: 8,
      opacity: progress,
      transform: `scale(${progress})`,
      boxShadow: `0 0 20px ${color}40`,
    }}
  >
    {label && (
      <div
        style={{
          position: "absolute",
          top: -30,
          left: 0,
          fontFamily,
          fontSize: 20,
          color,
          fontWeight: 600,
          whiteSpace: "nowrap",
        }}
      >
        {label}
      </div>
    )}
  </div>
);
