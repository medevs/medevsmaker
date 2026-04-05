import React from "react";
import {
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
} from "remotion";
import { baseTokens, BRAND, MONO, SCENE_DEFAULTS } from "../styles";

type FeatureCounterVariant = "counter" | "breadcrumb";

type FeatureCounterProps = {
  current: number;
  total: number;
  label: string;
  color: string;
  delay?: number;
  variant?: FeatureCounterVariant;
};

export const FeatureCounter: React.FC<FeatureCounterProps> = ({
  current,
  total,
  label,
  color,
  delay = 0,
  variant = "counter",
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

  return (
    <div
      style={{
        position: "absolute",
        top: 40,
        left: 40,
        zIndex: 10,
        opacity,
        display: "flex",
        alignItems: "center",
        gap: baseTokens.spacing.xs,
        backgroundColor: "rgba(15, 15, 26, 0.85)",
        borderRadius: baseTokens.borderRadius.sm,
        padding: `${baseTokens.spacing.xs}px ${baseTokens.spacing.sm}px`,
      }}
    >
      {variant === "breadcrumb" ? (
        <>
          <div
            style={{
              width: baseTokens.spacing.xs + 2,
              height: baseTokens.spacing.xs + 2,
              borderRadius: "50%",
              backgroundColor: color,
            }}
          />
          <span
            style={{
              fontFamily: MONO.fontFamily,
              fontSize: baseTokens.fontSizes.xs,
              fontWeight: 700,
              letterSpacing: MONO.letterSpacing,
              textTransform: MONO.textTransform,
              color: BRAND.text,
            }}
          >
            {label}
          </span>
        </>
      ) : (
        <span
          style={{
            fontFamily: MONO.fontFamily,
            fontSize: baseTokens.fontSizes.xs,
            fontWeight: 700,
            letterSpacing: MONO.letterSpacing,
            textTransform: MONO.textTransform,
            color: BRAND.text,
          }}
        >
          <span style={{ color }}>{`FEATURE ${current}`}</span>
          {` OF ${total}`}
          <span style={{ color: BRAND.textMuted }}>{` — ${label}`}</span>
        </span>
      )}
    </div>
  );
};
