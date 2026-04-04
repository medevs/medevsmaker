import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
} from "remotion";
import { BRAND, SCENE_DEFAULTS, SHADOWS } from "../styles";
import { ColorBorderCard } from "../components/ColorBorderCard";
import { SceneBackground } from "../components/SceneBackground";

type ArchNode = {
  label: string;
  icon?: string;
  sublabel?: string;
  color?: string;
};

type ArchitectureDiagramProps = {
  heading: string;
  center: ArchNode;
  satellites: ArchNode[];
  sectionColor?: string;
  colors?: { bg: string; text: string; muted: string };
  fontFamily?: string;
};

export const ArchitectureDiagram: React.FC<ArchitectureDiagramProps> = ({
  heading,
  center,
  satellites,
  sectionColor = BRAND.indigo,
  colors = { bg: BRAND.bg, text: BRAND.text, muted: BRAND.textMuted },
  fontFamily = "Inter",
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const headP = spring({
    frame,
    fps,
    config: SCENE_DEFAULTS.springSilky,
  });
  const headOpacity = interpolate(headP, [0, 1], [0, 1], {
    extrapolateRight: "clamp",
  });

  // Center node animation
  const centerP = spring({
    frame: frame - SCENE_DEFAULTS.elementEntry,
    fps,
    config: SCENE_DEFAULTS.springSilky,
  });
  const centerOpacity = interpolate(centerP, [0, 1], [0, 1], {
    extrapolateRight: "clamp",
  });
  const centerScale = interpolate(centerP, [0, 1], [0.9, 1], {
    extrapolateRight: "clamp",
  });

  // Layout: center at 960,540 (adjusted for heading), satellites in a circle
  const cx = 960;
  const cy = 560;
  const radius = 300;
  const centerColor = center.color || sectionColor;

  return (
    <SceneBackground bg={colors.bg}>
      <AbsoluteFill>
        {/* Heading */}
      <div
        style={{
          position: "absolute",
          top: 60,
          left: 80,
          right: 80,
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

      {/* SVG connection lines */}
      <svg
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: 1920,
          height: 1080,
          pointerEvents: "none",
        }}
      >
        {satellites.map((_, i) => {
          const angle =
            (i / satellites.length) * Math.PI * 2 - Math.PI / 2;
          const sx = cx + Math.cos(angle) * radius;
          const sy = cy + Math.sin(angle) * radius;

          const lineDelay =
            SCENE_DEFAULTS.elementEntrySlow +
            i * SCENE_DEFAULTS.staggerDelaySlow;
          const lineP = spring({
            frame: frame - lineDelay,
            fps,
            config: SCENE_DEFAULTS.springSilky,
          });
          const lineOpacity = interpolate(lineP, [0, 1], [0, 0.3], {
            extrapolateRight: "clamp",
          });

          return (
            <line
              key={`line-${i}`}
              x1={cx}
              y1={cy}
              x2={sx}
              y2={sy}
              stroke={sectionColor}
              strokeWidth={3}
              opacity={lineOpacity}
              strokeDasharray="6 4"
            />
          );
        })}
      </svg>

      {/* Center node */}
      <div
        style={{
          position: "absolute",
          left: cx - 140,
          top: cy - 70,
          width: 280,
          opacity: centerOpacity,
          transform: `scale(${centerScale})`,
        }}
      >
        <ColorBorderCard
          color={centerColor}
          glow
          fontFamily={fontFamily}
        >
          <div
            style={{
              textAlign: "center",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 6,
            }}
          >
            {center.icon && (
              <span style={{ fontSize: 28 }}>{center.icon}</span>
            )}
            <span
              style={{
                fontFamily,
                fontSize: 22,
                fontWeight: 700,
                color: colors.text,
              }}
            >
              {center.label}
            </span>
            {center.sublabel && (
              <span
                style={{
                  fontFamily,
                  fontSize: 20,
                  color: colors.muted,
                }}
              >
                {center.sublabel}
              </span>
            )}
          </div>
        </ColorBorderCard>
      </div>

      {/* Satellite nodes */}
      {satellites.map((sat, i) => {
        const angle =
          (i / satellites.length) * Math.PI * 2 - Math.PI / 2;
        const sx = cx + Math.cos(angle) * radius;
        const sy = cy + Math.sin(angle) * radius;

        const satDelay =
          SCENE_DEFAULTS.elementEntrySlow +
          i * SCENE_DEFAULTS.staggerDelaySlow;
        const satP = spring({
          frame: frame - satDelay,
          fps,
          config: SCENE_DEFAULTS.springSilky,
        });
        const satOpacity = interpolate(satP, [0, 1], [0, 1], {
          extrapolateRight: "clamp",
        });
        const satScale = interpolate(satP, [0, 1], [0.85, 1], {
          extrapolateRight: "clamp",
        });

        const satColor = sat.color || sectionColor;

        return (
          <div
            key={`sat-${i}`}
            style={{
              position: "absolute",
              left: sx - 120,
              top: sy - 50,
              width: 240,
              opacity: satOpacity,
              transform: `scale(${satScale})`,
            }}
          >
            <ColorBorderCard
              color={satColor}
              variant="compact"
              fontFamily={fontFamily}
            >
              <div
                style={{
                  textAlign: "center",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 4,
                }}
              >
                {sat.icon && (
                  <span style={{ fontSize: 22 }}>{sat.icon}</span>
                )}
                <span
                  style={{
                    fontFamily,
                    fontSize: 20,
                    fontWeight: 600,
                    color: colors.text,
                  }}
                >
                  {sat.label}
                </span>
                {sat.sublabel && (
                  <span
                    style={{
                      fontFamily,
                      fontSize: 20,
                      color: colors.muted,
                    }}
                  >
                    {sat.sublabel}
                  </span>
                )}
              </div>
            </ColorBorderCard>
          </div>
        );
      })}
      </AbsoluteFill>
    </SceneBackground>
  );
};
