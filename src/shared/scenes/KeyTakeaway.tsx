import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
} from "remotion";
import { BRAND, SCENE_DEFAULTS } from "../styles";
import { AccentBox } from "../components/AccentBox";

type KeyTakeawayProps = {
  heading?: string;
  takeaway: string;
  variant?: "info" | "warning" | "success" | "danger";
  colors?: { bg: string; text: string };
  fontFamily?: string;
};

export const KeyTakeaway: React.FC<KeyTakeawayProps> = ({
  heading = "Key Takeaway",
  takeaway,
  variant = "info",
  colors = { bg: BRAND.bg, text: BRAND.text },
  fontFamily = "Inter",
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const headP = spring({ frame, fps, config: SCENE_DEFAULTS.springSmooth });
  const headOpacity = interpolate(headP, [0, 1], [0, 1]);
  const headY = interpolate(headP, [0, 1], [20, 0]);

  return (
    <AbsoluteFill
      style={{
        backgroundColor: colors.bg,
        justifyContent: "center",
        alignItems: "center",
        padding: 100,
        gap: 32,
      }}
    >
      <div
        style={{
          opacity: headOpacity,
          transform: `translateY(${headY}px)`,
          fontFamily,
          fontSize: 40,
          fontWeight: 800,
          color: colors.text,
          marginBottom: 8,
        }}
      >
        {heading}
      </div>
      <div style={{ maxWidth: 1000, width: "100%" }}>
        <AccentBox
          body={takeaway}
          variant={variant}
          delay={12}
          fontFamily={fontFamily}
        />
      </div>
    </AbsoluteFill>
  );
};
