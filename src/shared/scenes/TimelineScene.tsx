import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
} from "remotion";
import { BRAND, SCENE_DEFAULTS, SHADOWS } from "../styles";

type TimelineNode = {
  label: string;
  description?: string;
};

type TimelineLayout = "horizontal" | "vertical";

type TimelineSceneProps = {
  heading: string;
  nodes: TimelineNode[];
  colors?: { bg: string; text: string; accent: string; muted: string };
  fontFamily?: string;
  layout?: TimelineLayout;
};

export const TimelineScene: React.FC<TimelineSceneProps> = ({
  heading,
  nodes,
  colors = {
    bg: BRAND.bg,
    text: BRAND.text,
    accent: BRAND.indigo,
    muted: BRAND.textMuted,
  },
  fontFamily = "Inter",
  layout = "horizontal",
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const headP = spring({ frame, fps, config: SCENE_DEFAULTS.springSmooth });
  const headOpacity = interpolate(headP, [0, 1], [0, 1]);

  const isHorizontal = layout === "horizontal";

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
          flexDirection: isHorizontal ? "row" : "column",
          alignItems: "center",
          justifyContent: "center",
          gap: isHorizontal ? 0 : 0,
          position: "relative",
          padding: isHorizontal ? "0 40px" : "20px 0",
        }}
      >
        {nodes.map((node, i) => {
          const nodeDelay = 10 + i * 12;

          // Line drawing progress (connects to next node)
          const lineP = spring({
            frame: frame - nodeDelay,
            fps,
            config: SCENE_DEFAULTS.springSmooth,
          });
          const lineProgress = interpolate(lineP, [0, 1], [0, 1], {
            extrapolateRight: "clamp",
          });

          // Node pop-in
          const nodeP = spring({
            frame: frame - nodeDelay,
            fps,
            config: SCENE_DEFAULTS.springSnappy,
          });
          const nodeScale = interpolate(nodeP, [0, 1], [0, 1], {
            extrapolateRight: "clamp",
          });
          const nodeOpacity = interpolate(nodeP, [0, 1], [0, 1], {
            extrapolateRight: "clamp",
          });

          // Label
          const labelP = spring({
            frame: frame - nodeDelay - 5,
            fps,
            config: SCENE_DEFAULTS.springSmooth,
          });
          const labelOpacity = interpolate(labelP, [0, 1], [0, 1], {
            extrapolateRight: "clamp",
          });

          const isLast = i === nodes.length - 1;

          return (
            <React.Fragment key={i}>
              {/* Node */}
              <div
                style={{
                  display: "flex",
                  flexDirection: isHorizontal ? "column" : "row",
                  alignItems: "center",
                  gap: 12,
                  flex: isHorizontal ? 0 : undefined,
                  minWidth: isHorizontal ? 0 : undefined,
                }}
              >
                {/* Dot */}
                <div
                  style={{
                    width: 24,
                    height: 24,
                    borderRadius: "50%",
                    backgroundColor: colors.accent,
                    transform: `scale(${nodeScale})`,
                    opacity: nodeOpacity,
                    boxShadow: SHADOWS.glow(colors.accent),
                    flexShrink: 0,
                  }}
                />
                {/* Label + description */}
                <div
                  style={{
                    opacity: labelOpacity,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: isHorizontal ? "center" : "flex-start",
                    gap: 4,
                    minWidth: isHorizontal ? 120 : undefined,
                  }}
                >
                  <span
                    style={{
                      fontFamily,
                      fontSize: 22,
                      fontWeight: 700,
                      color: colors.text,
                      textAlign: isHorizontal ? "center" : "left",
                    }}
                  >
                    {node.label}
                  </span>
                  {node.description && (
                    <span
                      style={{
                        fontFamily,
                        fontSize: 18,
                        color: colors.muted,
                        textAlign: isHorizontal ? "center" : "left",
                        maxWidth: isHorizontal ? 160 : 400,
                      }}
                    >
                      {node.description}
                    </span>
                  )}
                </div>
              </div>

              {/* Connecting line */}
              {!isLast && (
                <div
                  style={{
                    flexShrink: 0,
                    overflow: "hidden",
                    ...(isHorizontal
                      ? {
                          width: 60,
                          height: 3,
                          backgroundColor: `${colors.accent}33`,
                        }
                      : {
                          width: 3,
                          height: 40,
                          backgroundColor: `${colors.accent}33`,
                          marginLeft: 10.5,
                        }),
                  }}
                >
                  <div
                    style={{
                      backgroundColor: colors.accent,
                      ...(isHorizontal
                        ? {
                            width: `${lineProgress * 100}%`,
                            height: "100%",
                          }
                        : {
                            width: "100%",
                            height: `${lineProgress * 100}%`,
                          }),
                    }}
                  />
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
