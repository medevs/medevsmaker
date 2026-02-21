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

type WarningCalloutProps = {
  heading: string;
  body: string;
  severity?: "warning" | "danger";
  colors?: { bg: string; text: string };
  fontFamily?: string;
};

export const WarningCallout: React.FC<WarningCalloutProps> = ({
  heading,
  body,
  severity = "warning",
  colors = { bg: BRAND.bg, text: BRAND.text },
  fontFamily = "Inter",
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const headP = spring({ frame, fps, config: SCENE_DEFAULTS.springSmooth });
  const headOpacity = interpolate(headP, [0, 1], [0, 1]);
  const headY = interpolate(headP, [0, 1], [20, 0]);

  // Subtle pulse on the icon area
  const pulsePhase = interpolate(frame, [0, 60], [0, Math.PI * 2], {
    extrapolateRight: "extend",
  });
  const pulseScale = 1 + 0.03 * Math.sin(pulsePhase);

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
          transform: `translateY(${headY}px) scale(${pulseScale})`,
          fontFamily,
          fontSize: 44,
          fontWeight: 800,
          color: severity === "danger" ? BRAND.red : BRAND.amber,
          textAlign: "center",
        }}
      >
        {heading}
      </div>
      <div style={{ maxWidth: 1000, width: "100%" }}>
        <AccentBox
          body={body}
          variant={severity}
          delay={12}
          fontFamily={fontFamily}
          fontSize={28}
        />
      </div>
    </AbsoluteFill>
  );
};
