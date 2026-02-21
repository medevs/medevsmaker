import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
} from "remotion";
import { BRAND, SCENE_DEFAULTS, SHADOWS } from "../styles";

type DataBar = {
  label: string;
  value: number;
  color?: string;
};

type DataChartProps = {
  heading: string;
  bars: DataBar[];
  maxValue?: number;
  suffix?: string;
  colors?: { bg: string; text: string; accent: string; muted: string };
  fontFamily?: string;
};

export const DataChart: React.FC<DataChartProps> = ({
  heading,
  bars,
  maxValue,
  suffix = "",
  colors = {
    bg: BRAND.bg,
    text: BRAND.text,
    accent: BRAND.indigo,
    muted: BRAND.textMuted,
  },
  fontFamily = "Inter",
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const headP = spring({ frame, fps, config: SCENE_DEFAULTS.springSmooth });
  const headOpacity = interpolate(headP, [0, 1], [0, 1]);

  const max = maxValue || Math.max(...bars.map((b) => b.value));

  return (
    <AbsoluteFill
      style={{
        backgroundColor: colors.bg,
        padding: 80,
        gap: 40,
      }}
    >
      <div
        style={{
          opacity: headOpacity,
          fontFamily,
          fontSize: 48,
          fontWeight: 800,
          color: colors.text,
          textAlign: "center",
        }}
      >
        {heading}
      </div>

      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          gap: 24,
          padding: "0 40px",
        }}
      >
        {bars.map((bar, i) => {
          const barDelay = 8 + i * 8;
          const barP = spring({
            frame: frame - barDelay,
            fps,
            config: SCENE_DEFAULTS.springSnappy,
          });
          const barWidth = interpolate(barP, [0, 1], [0, 1], {
            extrapolateRight: "clamp",
          });
          const barOpacity = interpolate(barP, [0, 1], [0, 1], {
            extrapolateRight: "clamp",
          });

          const barColor = bar.color || colors.accent;
          const widthPercent = (bar.value / max) * 100;

          // Value label
          const valP = spring({
            frame: frame - barDelay - 5,
            fps,
            config: SCENE_DEFAULTS.springSmooth,
          });
          const valOpacity = interpolate(valP, [0, 1], [0, 1], {
            extrapolateRight: "clamp",
          });
          const displayValue = Math.round(
            interpolate(barP, [0, 1], [0, bar.value], {
              extrapolateRight: "clamp",
            })
          );

          return (
            <div
              key={i}
              style={{
                opacity: barOpacity,
                display: "flex",
                alignItems: "center",
                gap: 16,
              }}
            >
              {/* Label */}
              <div
                style={{
                  fontFamily,
                  fontSize: 22,
                  fontWeight: 600,
                  color: colors.text,
                  minWidth: 140,
                  textAlign: "right",
                }}
              >
                {bar.label}
              </div>

              {/* Bar track */}
              <div
                style={{
                  flex: 1,
                  height: 36,
                  backgroundColor: `${barColor}15`,
                  borderRadius: 8,
                  overflow: "hidden",
                  position: "relative",
                }}
              >
                {/* Bar fill */}
                <div
                  style={{
                    width: `${widthPercent * barWidth}%`,
                    height: "100%",
                    backgroundColor: barColor,
                    borderRadius: 8,
                    boxShadow: SHADOWS.glow(barColor),
                  }}
                />
              </div>

              {/* Value */}
              <div
                style={{
                  opacity: valOpacity,
                  fontFamily,
                  fontSize: 22,
                  fontWeight: 700,
                  color: barColor,
                  minWidth: 80,
                }}
              >
                {displayValue.toLocaleString()}
                {suffix}
              </div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
