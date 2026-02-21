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

      {isHorizontal ? (
        <HorizontalTimeline
          nodes={nodes}
          colors={colors}
          fontFamily={fontFamily}
          frame={frame}
          fps={fps}
        />
      ) : (
        <VerticalTimeline
          nodes={nodes}
          colors={colors}
          fontFamily={fontFamily}
          frame={frame}
          fps={fps}
        />
      )}
    </AbsoluteFill>
  );
};

/* ── Horizontal layout: flex:1 per node, one absolute line behind ── */

const HorizontalTimeline: React.FC<{
  nodes: TimelineNode[];
  colors: { bg: string; text: string; accent: string; muted: string };
  fontFamily: string;
  frame: number;
  fps: number;
}> = ({ nodes, colors, fontFamily, frame, fps }) => {
  const DOT_SIZE = 24;

  return (
    <div
      style={{
        flex: 1,
        display: "flex",
        flexDirection: "row",
        alignItems: "stretch",
        position: "relative",
        padding: "0 20px",
      }}
    >
      {nodes.map((node, i) => {
        const nodeDelay = 10 + i * 12;

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

        const labelP = spring({
          frame: frame - nodeDelay - 5,
          fps,
          config: SCENE_DEFAULTS.springSmooth,
        });
        const labelOpacity = interpolate(labelP, [0, 1], [0, 1], {
          extrapolateRight: "clamp",
        });

        // Line progress from this node to the next
        const lineP = spring({
          frame: frame - nodeDelay,
          fps,
          config: SCENE_DEFAULTS.springSmooth,
        });
        const lineProgress = interpolate(lineP, [0, 1], [0, 1], {
          extrapolateRight: "clamp",
        });

        const isLast = i === nodes.length - 1;

        return (
          <div
            key={i}
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              position: "relative",
            }}
          >
            {/* Description above the dot */}
            <div
              style={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                justifyContent: "flex-end",
                alignItems: "center",
                paddingBottom: 16,
                opacity: labelOpacity,
              }}
            >
              <span
                style={{
                  fontFamily,
                  fontSize: 22,
                  fontWeight: 700,
                  color: colors.text,
                  textAlign: "center",
                }}
              >
                {node.label}
              </span>
              {node.description && (
                <span
                  style={{
                    fontFamily,
                    fontSize: 17,
                    color: colors.muted,
                    textAlign: "center",
                    marginTop: 4,
                    lineHeight: 1.3,
                  }}
                >
                  {node.description}
                </span>
              )}
            </div>

            {/* Dot row — dot centered, line connects to next node */}
            <div
              style={{
                position: "relative",
                width: "100%",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: DOT_SIZE,
              }}
            >
              {/* Connecting line to next node (right half of this col + left half of next) */}
              {!isLast && (
                <>
                  {/* Track (dim) */}
                  <div
                    style={{
                      position: "absolute",
                      top: "50%",
                      left: "50%",
                      right: `-50%`,
                      height: 3,
                      transform: "translateY(-50%)",
                      backgroundColor: `${colors.accent}33`,
                    }}
                  />
                  {/* Fill (animated) */}
                  <div
                    style={{
                      position: "absolute",
                      top: "50%",
                      left: "50%",
                      width: `${lineProgress * 100}%`,
                      maxWidth: "100%",
                      height: 3,
                      transform: "translateY(-50%)",
                      backgroundColor: colors.accent,
                    }}
                  />
                </>
              )}

              {/* Dot */}
              <div
                style={{
                  width: DOT_SIZE,
                  height: DOT_SIZE,
                  borderRadius: "50%",
                  backgroundColor: colors.accent,
                  transform: `scale(${nodeScale})`,
                  opacity: nodeOpacity,
                  boxShadow: SHADOWS.glow(colors.accent),
                  flexShrink: 0,
                  zIndex: 1,
                }}
              />
            </div>

            {/* Spacer below dot to balance layout */}
            <div style={{ flex: 1 }} />
          </div>
        );
      })}
    </div>
  );
};

/* ── Vertical layout: unchanged logic, kept as separate component ── */

const VerticalTimeline: React.FC<{
  nodes: TimelineNode[];
  colors: { bg: string; text: string; accent: string; muted: string };
  fontFamily: string;
  frame: number;
  fps: number;
}> = ({ nodes, colors, fontFamily, frame, fps }) => {
  return (
    <div
      style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 0,
        position: "relative",
        padding: "20px 0",
      }}
    >
      {nodes.map((node, i) => {
        const nodeDelay = 10 + i * 12;

        const lineP = spring({
          frame: frame - nodeDelay,
          fps,
          config: SCENE_DEFAULTS.springSmooth,
        });
        const lineProgress = interpolate(lineP, [0, 1], [0, 1], {
          extrapolateRight: "clamp",
        });

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
                flexDirection: "row",
                alignItems: "center",
                gap: 12,
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
                  alignItems: "flex-start",
                  gap: 4,
                }}
              >
                <span
                  style={{
                    fontFamily,
                    fontSize: 22,
                    fontWeight: 700,
                    color: colors.text,
                    textAlign: "left",
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
                      textAlign: "left",
                      maxWidth: 400,
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
                  width: 3,
                  height: 40,
                  backgroundColor: `${colors.accent}33`,
                  marginLeft: 10.5,
                }}
              >
                <div
                  style={{
                    backgroundColor: colors.accent,
                    width: "100%",
                    height: `${lineProgress * 100}%`,
                  }}
                />
              </div>
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
};
