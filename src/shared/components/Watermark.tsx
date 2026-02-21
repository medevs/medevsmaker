import React from "react";
import {
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
} from "remotion";

type WatermarkPosition =
  | "top-left"
  | "top-right"
  | "bottom-left"
  | "bottom-right";

type WatermarkProps = {
  text?: string;
  position?: WatermarkPosition;
  opacity?: number;
  fontSize?: number;
  fontFamily?: string;
  delay?: number;
};

const POSITION_STYLES: Record<WatermarkPosition, React.CSSProperties> = {
  "top-left": { top: 24, left: 32 },
  "top-right": { top: 24, right: 32 },
  "bottom-left": { bottom: 24, left: 32 },
  "bottom-right": { bottom: 24, right: 32 },
};

export const Watermark: React.FC<WatermarkProps> = ({
  text = "medevsmaker",
  position = "top-right",
  opacity = 0.35,
  fontSize = 20,
  fontFamily = "Inter",
  delay = 0,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const entryProgress = spring({
    frame: frame - delay,
    fps,
    config: { damping: 200 },
  });
  const fadeIn = interpolate(entryProgress, [0, 1], [0, opacity], {
    extrapolateRight: "clamp",
  });

  return (
    <div
      style={{
        position: "absolute",
        ...POSITION_STYLES[position],
        opacity: fadeIn,
        fontFamily,
        fontSize,
        fontWeight: 600,
        color: "#ffffff",
        textTransform: "uppercase",
        letterSpacing: 2,
        textShadow: "0 2px 6px rgba(0,0,0,0.6)",
        zIndex: 10,
        pointerEvents: "none",
        userSelect: "none",
      }}
    >
      {text}
    </div>
  );
};
