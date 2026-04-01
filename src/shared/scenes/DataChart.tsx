import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
} from "remotion";
import { evolvePath } from "@remotion/paths";
import { BRAND, SCENE_DEFAULTS, SHADOWS } from "../styles";
import { PillBadge } from "../components/PillBadge";

type DataItem = {
  label: string;
  value: number;
  color?: string;
};

type DataChartVariant = "bars" | "labeled" | "pie" | "donut" | "line" | "gauge";

type DataChartProps = {
  heading: string;
  /** Data items (backward compat alias: "bars" still works) */
  bars: DataItem[];
  maxValue?: number;
  suffix?: string;
  prefix?: string;
  variant?: DataChartVariant;
  badgeLabels?: string[];
  colors?: { bg: string; text: string; accent: string; muted: string };
  fontFamily?: string;
};

const PIE_COLORS = [
  BRAND.indigo,
  BRAND.cyan,
  BRAND.amber,
  BRAND.green,
  BRAND.violet,
  BRAND.red,
];

export const DataChart: React.FC<DataChartProps> = ({
  heading,
  bars,
  maxValue,
  suffix = "",
  prefix = "",
  variant = "bars",
  badgeLabels = [],
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

  // Shared heading
  const Heading = (
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
  );

  // --- PIE / DONUT ---
  if (variant === "pie" || variant === "donut") {
    const total = bars.reduce((s, b) => s + b.value, 0);
    const cx = 300;
    const cy = 300;
    const r = 200;
    const innerR = variant === "donut" ? 120 : 0;

    let accumulated = 0;
    const segments = bars.map((item, i) => {
      const segDelay = 6 + i * 6;
      const segP = spring({
        frame: frame - segDelay,
        fps,
        config: SCENE_DEFAULTS.springSmooth,
      });
      const fraction = item.value / total;
      const startAngle = accumulated * Math.PI * 2 - Math.PI / 2;
      accumulated += fraction;
      const endAngle = accumulated * Math.PI * 2 - Math.PI / 2;
      const sweepAngle = startAngle + (endAngle - startAngle) * segP;

      const segColor = item.color || PIE_COLORS[i % PIE_COLORS.length];
      const largeArc = sweepAngle - startAngle > Math.PI ? 1 : 0;

      // SVG arc path
      const x1 = cx + r * Math.cos(startAngle);
      const y1 = cy + r * Math.sin(startAngle);
      const x2 = cx + r * Math.cos(sweepAngle);
      const y2 = cy + r * Math.sin(sweepAngle);

      let d: string;
      if (variant === "donut") {
        const ix1 = cx + innerR * Math.cos(startAngle);
        const iy1 = cy + innerR * Math.sin(startAngle);
        const ix2 = cx + innerR * Math.cos(sweepAngle);
        const iy2 = cy + innerR * Math.sin(sweepAngle);
        d = `M ${x1} ${y1} A ${r} ${r} 0 ${largeArc} 1 ${x2} ${y2} L ${ix2} ${iy2} A ${innerR} ${innerR} 0 ${largeArc} 0 ${ix1} ${iy1} Z`;
      } else {
        d = `M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r} 0 ${largeArc} 1 ${x2} ${y2} Z`;
      }

      return (
        <path key={i} d={d} fill={segColor} opacity={segP > 0.01 ? 1 : 0} />
      );
    });

    // Legend
    const legendItems = bars.map((item, i) => {
      const segDelay = 6 + i * 6;
      const legendP = spring({
        frame: frame - segDelay - 3,
        fps,
        config: SCENE_DEFAULTS.springSilky,
      });
      const segColor = item.color || PIE_COLORS[i % PIE_COLORS.length];
      return (
        <div
          key={i}
          style={{
            opacity: legendP,
            display: "flex",
            alignItems: "center",
            gap: 12,
            marginBottom: 16,
          }}
        >
          <div
            style={{
              width: 16,
              height: 16,
              borderRadius: 4,
              backgroundColor: segColor,
            }}
          />
          <span style={{ fontFamily, fontSize: 22, color: colors.text, fontWeight: 600 }}>
            {item.label}
          </span>
          <span style={{ fontFamily, fontSize: 20, color: colors.muted }}>
            {prefix}{item.value}{suffix}
          </span>
        </div>
      );
    });

    return (
      <AbsoluteFill style={{ backgroundColor: colors.bg, padding: 80, gap: 40 }}>
        {Heading}
        <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 80 }}>
          <svg width={600} height={600} viewBox="0 0 600 600">
            {segments}
          </svg>
          <div style={{ display: "flex", flexDirection: "column" }}>{legendItems}</div>
        </div>
      </AbsoluteFill>
    );
  }

  // --- LINE CHART ---
  if (variant === "line") {
    const chartW = 1200;
    const chartH = 500;
    const padX = 80;
    const padY = 60;
    const plotW = chartW - padX * 2;
    const plotH = chartH - padY * 2;

    const lineP = spring({
      frame: frame - 8,
      fps,
      config: { damping: 200, stiffness: 60 },
    });
    const drawProgress = interpolate(lineP, [0, 1], [0, 1], {
      extrapolateRight: "clamp",
    });

    const points = bars.map((item, i) => ({
      x: padX + (i / Math.max(bars.length - 1, 1)) * plotW,
      y: padY + plotH - (item.value / max) * plotH,
    }));

    const lineD =
      points.length > 0
        ? `M ${points.map((p) => `${p.x} ${p.y}`).join(" L ")}`
        : "";

    const evolved = lineD ? evolvePath(drawProgress, lineD) : {};

    return (
      <AbsoluteFill style={{ backgroundColor: colors.bg, padding: 80, gap: 40 }}>
        {Heading}
        <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <svg width={chartW} height={chartH} viewBox={`0 0 ${chartW} ${chartH}`}>
            {/* Grid lines */}
            {[0, 0.25, 0.5, 0.75, 1].map((t) => {
              const y = padY + plotH - t * plotH;
              return (
                <line
                  key={t}
                  x1={padX}
                  y1={y}
                  x2={padX + plotW}
                  y2={y}
                  stroke={colors.muted}
                  strokeWidth={1}
                  opacity={0.2}
                />
              );
            })}

            {/* Line */}
            {lineD && (
              <path
                d={lineD}
                fill="none"
                stroke={colors.accent}
                strokeWidth={4}
                strokeLinecap="round"
                strokeLinejoin="round"
                {...evolved}
              />
            )}

            {/* Dots */}
            {points.map((p, i) => {
              const dotP = spring({
                frame: frame - 10 - i * 4,
                fps,
                config: SCENE_DEFAULTS.springSnappy,
              });
              return (
                <circle
                  key={i}
                  cx={p.x}
                  cy={p.y}
                  r={6 * dotP}
                  fill={colors.accent}
                  opacity={dotP}
                />
              );
            })}

            {/* Labels */}
            {bars.map((item, i) => {
              const labelP = spring({
                frame: frame - 12 - i * 4,
                fps,
                config: SCENE_DEFAULTS.springSilky,
              });
              return (
                <text
                  key={i}
                  x={points[i].x}
                  y={chartH - 15}
                  textAnchor="middle"
                  fontFamily={fontFamily}
                  fontSize={18}
                  fill={colors.muted}
                  opacity={labelP}
                >
                  {item.label}
                </text>
              );
            })}
          </svg>
        </div>
      </AbsoluteFill>
    );
  }

  // --- GAUGE ---
  if (variant === "gauge") {
    const item = bars[0] || { label: "", value: 0 };
    const gaugeMax = max || 100;
    const fraction = item.value / gaugeMax;
    const gaugeColor = item.color || colors.accent;

    const gaugeP = spring({
      frame: frame - 8,
      fps,
      config: { damping: 200, stiffness: 60 },
    });
    const fillFraction = fraction * gaugeP;

    const cx = 400;
    const cy = 350;
    const r = 250;
    const strokeW = 30;

    // Semicircle from 180deg to 0deg (left to right, top half)
    const startAngle = Math.PI;
    const endAngle = 0;
    const arcLength = Math.PI * r;

    const trackD = `M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${cx + r} ${cy}`;
    const fillDash = arcLength * fillFraction;
    const fillGap = arcLength - fillDash;

    // Animated counter
    const displayValue = Math.round(
      interpolate(gaugeP, [0, 1], [0, item.value], {
        extrapolateRight: "clamp",
      })
    );

    return (
      <AbsoluteFill style={{ backgroundColor: colors.bg, padding: 80, gap: 40 }}>
        {Heading}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
          <svg width={800} height={450} viewBox="0 0 800 450">
            {/* Track */}
            <path
              d={trackD}
              fill="none"
              stroke={`${gaugeColor}20`}
              strokeWidth={strokeW}
              strokeLinecap="round"
            />
            {/* Fill */}
            <path
              d={trackD}
              fill="none"
              stroke={gaugeColor}
              strokeWidth={strokeW}
              strokeLinecap="round"
              strokeDasharray={`${fillDash} ${fillGap}`}
              style={{ filter: `drop-shadow(${SHADOWS.glow(gaugeColor)})` }}
            />
          </svg>
          {/* Big number */}
          <div
            style={{
              marginTop: -120,
              fontFamily,
              fontSize: 96,
              fontWeight: 900,
              color: gaugeColor,
              textAlign: "center",
              textShadow: SHADOWS.glow(gaugeColor),
            }}
          >
            {prefix}{displayValue.toLocaleString()}{suffix}
          </div>
          <div
            style={{
              fontFamily,
              fontSize: 28,
              fontWeight: 600,
              color: colors.muted,
              textAlign: "center",
              marginTop: 8,
            }}
          >
            {item.label}
          </div>
        </div>
      </AbsoluteFill>
    );
  }

  // --- BARS (default) / LABELED ---
  return (
    <AbsoluteFill
      style={{
        backgroundColor: colors.bg,
        padding: 80,
        gap: 40,
      }}
    >
      {Heading}

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
                {prefix}{displayValue.toLocaleString()}{suffix}
              </div>

              {variant === "labeled" && badgeLabels[i] && (
                <PillBadge
                  label={badgeLabels[i]}
                  color={barColor}
                  delay={barDelay + 10}
                  fontSize={12}
                />
              )}
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
