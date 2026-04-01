import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
} from "remotion";
import { BRAND, SCENE_DEFAULTS, SHADOWS, CARD } from "../styles";

type MetricDisplay = "counter" | "gauge" | "bar";

type Metric = {
  label: string;
  value: number;
  suffix?: string;
  prefix?: string;
  color?: string;
  display?: MetricDisplay;
  maxValue?: number;
};

type MetricDashboardProps = {
  heading: string;
  metrics: Metric[];
  sectionColor?: string;
  colors?: { bg: string; text: string; muted: string };
  fontFamily?: string;
};

export const MetricDashboard: React.FC<MetricDashboardProps> = ({
  heading,
  metrics,
  sectionColor = BRAND.indigo,
  colors = { bg: BRAND.bg, text: BRAND.text, muted: BRAND.textMuted },
  fontFamily = "Inter",
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const headP = spring({ frame, fps, config: SCENE_DEFAULTS.springSilky });

  // Grid: 2 cols for 2-4 items
  const cols = metrics.length <= 2 ? metrics.length : 2;

  return (
    <AbsoluteFill style={{ backgroundColor: colors.bg, padding: 80, gap: 40 }}>
      <div
        style={{
          opacity: headP,
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
          flexWrap: "wrap",
          justifyContent: "center",
          alignItems: "center",
          gap: 40,
          padding: "20px 40px",
        }}
      >
        {metrics.map((m, i) => {
          const delay = 8 + i * 8;
          const metricP = spring({
            frame: frame - delay,
            fps,
            config: SCENE_DEFAULTS.springSilky,
          });
          const opacity = interpolate(metricP, [0, 1], [0, 1], {
            extrapolateRight: "clamp",
          });
          const translateY = interpolate(metricP, [0, 1], [20, 0], {
            extrapolateRight: "clamp",
          });
          const scale = interpolate(metricP, [0, 1], [0.95, 1], {
            extrapolateRight: "clamp",
          });

          const metricColor = m.color || sectionColor;
          const displayVal = Math.round(
            interpolate(metricP, [0, 1], [0, m.value], {
              extrapolateRight: "clamp",
            })
          );

          const metricMax = m.maxValue || m.value;
          const barWidth = interpolate(metricP, [0, 1], [0, (m.value / metricMax) * 100], {
            extrapolateRight: "clamp",
          });

          return (
            <div
              key={i}
              style={{
                opacity,
                transform: `translateY(${translateY}px) scale(${scale})`,
                width: cols === 1 ? 600 : 480,
                background: CARD.bg,
                border: `${CARD.borderWidth}px solid ${CARD.border}`,
                borderRadius: CARD.radius,
                padding: "32px 36px",
                display: "flex",
                flexDirection: "column",
                gap: 16,
              }}
            >
              {/* Big number */}
              <div
                style={{
                  fontFamily,
                  fontSize: 64,
                  fontWeight: 900,
                  color: metricColor,
                  lineHeight: 1.1,
                  textShadow: SHADOWS.glow(metricColor),
                }}
              >
                {m.prefix || ""}{displayVal.toLocaleString()}{m.suffix || ""}
              </div>

              {/* Mini bar for "bar" display */}
              {(m.display === "bar" || (!m.display && m.maxValue)) && (
                <div
                  style={{
                    height: 8,
                    backgroundColor: `${metricColor}20`,
                    borderRadius: 4,
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      width: `${barWidth}%`,
                      height: "100%",
                      backgroundColor: metricColor,
                      borderRadius: 4,
                    }}
                  />
                </div>
              )}

              {/* Mini gauge arc for "gauge" display */}
              {m.display === "gauge" && (
                <svg width={120} height={65} viewBox="0 0 120 65">
                  <path
                    d="M 10 60 A 50 50 0 0 1 110 60"
                    fill="none"
                    stroke={`${metricColor}20`}
                    strokeWidth={8}
                    strokeLinecap="round"
                  />
                  <path
                    d="M 10 60 A 50 50 0 0 1 110 60"
                    fill="none"
                    stroke={metricColor}
                    strokeWidth={8}
                    strokeLinecap="round"
                    strokeDasharray={`${Math.PI * 50 * (m.value / metricMax) * metricP} ${Math.PI * 50}`}
                  />
                </svg>
              )}

              {/* Label */}
              <div
                style={{
                  fontFamily,
                  fontSize: 22,
                  fontWeight: 600,
                  color: colors.muted,
                }}
              >
                {m.label}
              </div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
