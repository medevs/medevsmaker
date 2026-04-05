import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
} from "remotion";
import { baseTokens, BRAND, SCENE_DEFAULTS, TYPOGRAPHY } from "../styles";
import { pulse } from "../animations";
import { SceneBackground } from "../components/SceneBackground";
import { useLayoutMode } from "../formats";

type IconEffect = "pop" | "rotate" | "bounce";

type VisualMetaphorProps = {
  icon: string;
  heading: string;
  analogy: string;
  sectionColor?: string;
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
  sectionColor,
  fontFamily = "Inter",
  iconEffect = "pop",
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { contentPadding, fontScale } = useLayoutMode();

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
    <SceneBackground bg={colors.bg}>
      <AbsoluteFill
        style={{
          justifyContent: "center",
          alignItems: "center",
          padding: contentPadding,
          gap: 24,
        }}
      >
      <div
        style={{
          transform: iconTransform,
          fontSize: Math.round(96 * fontScale),
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
          fontSize: Math.round(52 * fontScale),
          fontWeight: 800,
          color: colors.text,
          textAlign: "center",
          lineHeight: TYPOGRAPHY.lineHeights.tight,
        }}
      >
        {heading}
      </div>
      <div
        style={{
          opacity: analogyOpacity,
          fontFamily,
          fontSize: Math.round(28 * fontScale),
          color: colors.muted,
          textAlign: "center",
          maxWidth: 900,
          lineHeight: TYPOGRAPHY.lineHeights.normal,
        }}
      >
        {analogy}
      </div>
    </AbsoluteFill>
    </SceneBackground>
  );
};
