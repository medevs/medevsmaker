import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
} from "remotion";
import { BRAND, SCENE_DEFAULTS } from "../styles";
import { pulse } from "../animations";

type IconEffect = "pop" | "rotate" | "bounce";

type VisualMetaphorProps = {
  icon: string;
  heading: string;
  analogy: string;
  colors?: { bg: string; text: string; accent: string; muted: string };
  fontFamily?: string;
  iconEffect?: IconEffect;
};

export const VisualMetaphor: React.FC<VisualMetaphorProps> = ({
  icon,
  heading,
  analogy,
  colors = {
    bg: BRAND.bg,
    text: BRAND.text,
    accent: BRAND.violet,
    muted: BRAND.textMuted,
  },
  fontFamily = "Inter",
  iconEffect = "pop",
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const iconP = spring({
    frame,
    fps,
    config: SCENE_DEFAULTS.springSnappy,
  });
  const iconScale = interpolate(iconP, [0, 1], [0, 1], {
    extrapolateRight: "clamp",
  });

  let iconTransform: string;
  if (iconEffect === "rotate") {
    const rotation = pulse(frame, 120, 8);
    iconTransform = `scale(${iconScale}) rotate(${rotation}deg)`;
  } else if (iconEffect === "bounce") {
    const bounceY = pulse(frame, 45, 6);
    iconTransform = `scale(${iconScale}) translateY(${bounceY}px)`;
  } else {
    // Default "pop" — original behavior
    iconTransform = `scale(${iconScale})`;
  }

  const headP = spring({
    frame: frame - 10,
    fps,
    config: SCENE_DEFAULTS.springSmooth,
  });
  const headOpacity = interpolate(headP, [0, 1], [0, 1], {
    extrapolateRight: "clamp",
  });
  const headY = interpolate(headP, [0, 1], [20, 0], {
    extrapolateRight: "clamp",
  });

  const analogyP = spring({
    frame: frame - 22,
    fps,
    config: SCENE_DEFAULTS.springSmooth,
  });
  const analogyOpacity = interpolate(analogyP, [0, 1], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: colors.bg,
        justifyContent: "center",
        alignItems: "center",
        padding: 100,
        gap: 24,
      }}
    >
      <div
        style={{
          transform: iconTransform,
          fontSize: 96,
          lineHeight: 1,
        }}
      >
        {icon}
      </div>
      <div
        style={{
          opacity: headOpacity,
          transform: `translateY(${headY}px)`,
          fontFamily,
          fontSize: 52,
          fontWeight: 800,
          color: colors.text,
          textAlign: "center",
          lineHeight: 1.2,
        }}
      >
        {heading}
      </div>
      <div
        style={{
          opacity: analogyOpacity,
          fontFamily,
          fontSize: 28,
          color: colors.muted,
          textAlign: "center",
          maxWidth: 900,
          lineHeight: 1.5,
        }}
      >
        {analogy}
      </div>
    </AbsoluteFill>
  );
};
