import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
} from "remotion";
import { baseTokens, BRAND, SCENE_DEFAULTS, TYPOGRAPHY } from "../styles";
import { Card } from "../components/Card";
import { SceneBackground } from "../components/SceneBackground";
import { useLayoutMode } from "../formats";

type WarningCalloutProps = {
  heading: string;
  body: string;
  severity?: "warning" | "danger";
  sectionColor?: string;
  colors?: { bg: string; text: string };
  fontFamily?: string;
};

export const WarningCallout: React.FC<WarningCalloutProps> = ({
  heading,
  body,
  severity = "warning",
  sectionColor,
  colors = { bg: BRAND.bg, text: BRAND.text },
  fontFamily = "Inter",
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { contentPadding, fontScale } = useLayoutMode();

  const headP = spring({ frame, fps, config: SCENE_DEFAULTS.springSmooth });
  const headOpacity = interpolate(headP, [0, 1], [0, 1]);
  const headY = interpolate(headP, [0, 1], [20, 0]);

  // Subtle pulse on the icon area
  const pulsePhase = interpolate(frame, [0, 60], [0, Math.PI * 2], {
    extrapolateRight: "extend",
  });
  const pulseScale = 1 + 0.03 * Math.sin(pulsePhase);

  return (
    <SceneBackground bg={colors.bg}>
      <AbsoluteFill
        style={{
          justifyContent: "center",
          alignItems: "center",
          padding: contentPadding,
          gap: 32,
        }}
      >
      <div
        style={{
          opacity: headOpacity,
          transform: `translateY(${headY}px) scale(${pulseScale})`,
          fontFamily,
          fontSize: Math.round(44 * fontScale),
          fontWeight: 800,
          color: severity === "danger" ? BRAND.red : BRAND.amber,
          textAlign: "center",
        }}
      >
        {heading}
      </div>
      <div style={{ maxWidth: 1000, width: "100%" }}>
        <Card
          variant="accent"
          semanticType={severity}
          delay={12}
          fontFamily={fontFamily}
        >
          <div style={{
            fontFamily,
            fontSize: Math.round(28 * fontScale),
            fontWeight: 500,
            color: colors.text,
            lineHeight: TYPOGRAPHY.lineHeights.relaxed,
          }}>
            {body}
          </div>
        </Card>
      </div>
    </AbsoluteFill>
    </SceneBackground>
  );
};
