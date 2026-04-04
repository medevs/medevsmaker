import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
} from "remotion";
import { BRAND, GLASS, SCENE_DEFAULTS, SHADOWS } from "../styles";
import { SceneBackground } from "../components/SceneBackground";
import { useLayoutMode } from "../formats";
import { shimmer } from "../animations";
import { loadFont } from "@remotion/google-fonts/Inter";

const { fontFamily: interFont } = loadFont();

type TimelineNode = {
  label: string;
  description?: string;
};

type TimelineLayout = "horizontal" | "vertical";

type TimelineSceneProps = {
  heading: string;
  nodes: TimelineNode[];
  sectionColor?: string;
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
  sectionColor,
  fontFamily = interFont,
  layout = "horizontal",
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { contentPadding, fontScale } = useLayoutMode();

  const effectiveColors = sectionColor
    ? { ...colors, accent: sectionColor }
    : colors;

  const headP = spring({ frame, fps, config: SCENE_DEFAULTS.springSmooth });
  const headOpacity = interpolate(headP, [0, 1], [0, 1]);
  const headY = interpolate(headP, [0, 1], [-20, 0], { extrapolateRight: "clamp" });

  const isHorizontal = layout === "horizontal";

  return (
    <SceneBackground bg={colors.bg}>
    <AbsoluteFill
      style={{
        padding: contentPadding,
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          height: "100%",
          position: "relative",
          zIndex: 1,
        }}
      >
        {/* Heading */}
        <div
          style={{
            opacity: headOpacity,
            transform: `translateY(${headY}px)`,
            textAlign: "center",
            paddingTop: 8,
            marginBottom: 40,
          }}
        >
          <div
            style={{
              fontFamily,
              fontSize: Math.round(48 * fontScale),
              fontWeight: 800,
              color: colors.text,
              letterSpacing: -0.5,
            }}
          >
            {heading}
          </div>
          <div
            style={{
              width: interpolate(headP, [0, 1], [0, 60], { extrapolateRight: "clamp" }),
              height: 3,
              borderRadius: 2,
              background: effectiveColors.accent,
              margin: "12px auto 0",
              opacity: 0.5,
            }}
          />
        </div>

        {/* Timeline */}
        {isHorizontal ? (
          <HorizontalTimeline
            nodes={nodes}
            colors={effectiveColors}
            fontFamily={fontFamily}
            fontScale={fontScale}
            frame={frame}
            fps={fps}
          />
        ) : (
          <VerticalTimeline
            nodes={nodes}
            colors={effectiveColors}
            fontFamily={fontFamily}
            fontScale={fontScale}
            frame={frame}
            fps={fps}
          />
        )}
      </div>
    </AbsoluteFill>
    </SceneBackground>
  );
};

/* ── Horizontal layout ── */
/* Each node is a flex:1 column containing card + dot, so dots align under card centers. */
/* A single absolute line spans behind all dots. */

const HorizontalTimeline: React.FC<{
  nodes: TimelineNode[];
  colors: { bg: string; text: string; accent: string; muted: string };
  fontFamily: string;
  fontScale: number;
  frame: number;
  fps: number;
}> = ({ nodes, colors, fontFamily, fontScale, frame, fps }) => {
  const DOT_SIZE = 16;
  const RING_SIZE = 32;
  const LINE_THICKNESS = 3;
  const GAP = 28;
  const lineShimmer = shimmer(frame, 90);

  // Overall line animation
  const lineP = spring({
    frame: frame - 8,
    fps,
    config: SCENE_DEFAULTS.springSmooth,
  });
  const lineWidth = interpolate(lineP, [0, 1], [0, 100], { extrapolateRight: "clamp" });

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        gap: GAP,
      }}
    >
      {nodes.map((node, i) => {
        const nodeDelay = 10 + i * 14;
        const cardP = spring({
          frame: frame - nodeDelay,
          fps,
          config: SCENE_DEFAULTS.springSilky,
        });
        const cardOpacity = interpolate(cardP, [0, 1], [0, 1], { extrapolateRight: "clamp" });
        const cardY = interpolate(cardP, [0, 1], [20, 0], { extrapolateRight: "clamp" });

        const dotP = spring({
          frame: frame - nodeDelay,
          fps,
          config: SCENE_DEFAULTS.springSnappy,
        });
        const dotScale = interpolate(dotP, [0, 1], [0, 1], { extrapolateRight: "clamp" });
        const dotOpacity = interpolate(dotP, [0, 1], [0, 1], { extrapolateRight: "clamp" });

        const isLast = i === nodes.length - 1;

        return (
          <div
            key={i}
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            {/* Card */}
            <div
              style={{
                width: "100%",
                opacity: cardOpacity,
                transform: `translateY(${cardY}px)`,
                borderRadius: GLASS.radius,
                overflow: "hidden",
                background: GLASS.bg,
                border: `1px solid ${GLASS.border}`,
                boxShadow: SHADOWS.md,
                display: "flex",
                flexDirection: "column",
                marginBottom: 24,
              }}
            >
              {/* Card header */}
              <div
                style={{
                  padding: "18px 24px",
                  background: `linear-gradient(135deg, ${colors.accent}20 0%, transparent 100%)`,
                  borderBottom: `1px solid ${BRAND.border}`,
                  display: "flex",
                  alignItems: "center",
                  gap: 14,
                }}
              >
                <div
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: 10,
                    backgroundColor: `${colors.accent}20`,
                    border: `1px solid ${colors.accent}40`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontFamily,
                    fontSize: 20,
                    fontWeight: 800,
                    color: colors.accent,
                    flexShrink: 0,
                  }}
                >
                  {i + 1}
                </div>
                <div
                  style={{
                    fontFamily,
                    fontSize: Math.round(28 * fontScale),
                    fontWeight: 700,
                    color: colors.text,
                  }}
                >
                  {node.label}
                </div>
              </div>
              {/* Card body */}
              {node.description && (
                <div
                  style={{
                    padding: "16px 24px",
                    fontFamily,
                    fontSize: Math.round(22 * fontScale),
                    fontWeight: 400,
                    color: colors.muted,
                    lineHeight: 1.5,
                  }}
                >
                  {node.description}
                </div>
              )}
            </div>

            {/* Dot + connecting line — sits directly under card center */}
            <div
              style={{
                position: "relative",
                width: "100%",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: RING_SIZE,
              }}
            >
              {/* Line to next node: from center of this column to center of next */}
              {!isLast && (
                <>
                  {/* Track (dim) — spans from center of this col to the right edge + gap + half of next col */}
                  <div
                    style={{
                      position: "absolute",
                      top: "50%",
                      left: "50%",
                      /* 50% of current col width + gap + 50% of next col width = 100% col width + gap */
                      width: `calc(100% + ${GAP}px)`,
                      height: LINE_THICKNESS,
                      transform: "translateY(-50%)",
                      backgroundColor: `${colors.accent}15`,
                      borderRadius: LINE_THICKNESS / 2,
                    }}
                  />
                  {/* Animated fill */}
                  <div
                    style={{
                      position: "absolute",
                      top: "50%",
                      left: "50%",
                      width: `calc(100% + ${GAP}px)`,
                      height: LINE_THICKNESS,
                      transform: "translateY(-50%)",
                      overflow: "hidden",
                      borderRadius: LINE_THICKNESS / 2,
                    }}
                  >
                    <div
                      style={{
                        width: `${lineWidth}%`,
                        height: "100%",
                        backgroundColor: colors.accent,
                        borderRadius: LINE_THICKNESS / 2,
                        boxShadow: `0 0 ${6 + lineShimmer * 4}px ${colors.accent}44`,
                      }}
                    />
                  </div>
                </>
              )}

              {/* Dot */}
              <div
                style={{
                  width: RING_SIZE,
                  height: RING_SIZE,
                  borderRadius: "50%",
                  backgroundColor: `${colors.accent}15`,
                  border: `2px solid ${colors.accent}50`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  transform: `scale(${dotScale})`,
                  opacity: dotOpacity,
                  boxShadow: SHADOWS.glow(colors.accent),
                  zIndex: 1,
                }}
              >
                <div
                  style={{
                    width: DOT_SIZE,
                    height: DOT_SIZE,
                    borderRadius: "50%",
                    backgroundColor: colors.accent,
                  }}
                />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

/* ── Vertical layout ── */

const VerticalTimeline: React.FC<{
  nodes: TimelineNode[];
  colors: { bg: string; text: string; accent: string; muted: string };
  fontFamily: string;
  fontScale: number;
  frame: number;
  fps: number;
}> = ({ nodes, colors, fontFamily, fontScale, frame, fps }) => {
  const DOT_SIZE = 14;
  const RING_SIZE = 30;
  const LINE_THICKNESS = 3;

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 0,
        position: "relative",
        paddingLeft: 60,
      }}
    >
      {nodes.map((node, i) => {
        const nodeDelay = 10 + i * 14;

        const lineP = spring({
          frame: frame - nodeDelay,
          fps,
          config: SCENE_DEFAULTS.springSmooth,
        });
        const lineProgress = interpolate(lineP, [0, 1], [0, 1], { extrapolateRight: "clamp" });

        const dotP = spring({
          frame: frame - nodeDelay,
          fps,
          config: SCENE_DEFAULTS.springSnappy,
        });
        const dotScale = interpolate(dotP, [0, 1], [0, 1], { extrapolateRight: "clamp" });
        const dotOpacity = interpolate(dotP, [0, 1], [0, 1], { extrapolateRight: "clamp" });

        const cardP = spring({
          frame: frame - nodeDelay - 3,
          fps,
          config: SCENE_DEFAULTS.springSilky,
        });
        const cardOpacity = interpolate(cardP, [0, 1], [0, 1], { extrapolateRight: "clamp" });
        const cardX = interpolate(cardP, [0, 1], [20, 0], { extrapolateRight: "clamp" });

        const isLast = i === nodes.length - 1;

        return (
          <React.Fragment key={i}>
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                gap: 24,
                position: "relative",
              }}
            >
              {/* Dot with ring */}
              <div
                style={{
                  width: RING_SIZE,
                  height: RING_SIZE,
                  borderRadius: "50%",
                  backgroundColor: `${colors.accent}15`,
                  border: `2px solid ${colors.accent}50`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  transform: `scale(${dotScale})`,
                  opacity: dotOpacity,
                  boxShadow: SHADOWS.glow(colors.accent),
                  flexShrink: 0,
                  zIndex: 1,
                }}
              >
                <div
                  style={{
                    width: DOT_SIZE,
                    height: DOT_SIZE,
                    borderRadius: "50%",
                    backgroundColor: colors.accent,
                  }}
                />
              </div>

              {/* Card */}
              <div
                style={{
                  flex: 1,
                  opacity: cardOpacity,
                  transform: `translateX(${cardX}px)`,
                  borderRadius: 16,
                  overflow: "hidden",
                  background: GLASS.bg,
                  border: `1px solid ${GLASS.border}`,
                  boxShadow: SHADOWS.sm,
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <div
                  style={{
                    padding: "16px 24px",
                    background: `linear-gradient(135deg, ${colors.accent}20 0%, transparent 100%)`,
                    borderBottom: node.description ? `1px solid ${BRAND.border}` : undefined,
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                  }}
                >
                  <div
                    style={{
                      width: 28,
                      height: 28,
                      borderRadius: 8,
                      backgroundColor: `${colors.accent}20`,
                      border: `1px solid ${colors.accent}40`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontFamily,
                      fontSize: 20,
                      fontWeight: 800,
                      color: colors.accent,
                      flexShrink: 0,
                    }}
                  >
                    {i + 1}
                  </div>
                  <span
                    style={{
                      fontFamily,
                      fontSize: Math.round(26 * fontScale),
                      fontWeight: 700,
                      color: colors.text,
                    }}
                  >
                    {node.label}
                  </span>
                </div>
                {node.description && (
                  <div
                    style={{
                      padding: "14px 24px",
                      fontFamily,
                      fontSize: Math.round(22 * fontScale),
                      fontWeight: 400,
                      color: colors.muted,
                      lineHeight: 1.4,
                    }}
                  >
                    {node.description}
                  </div>
                )}
              </div>
            </div>

            {/* Connecting line */}
            {!isLast && (
              <div
                style={{
                  width: LINE_THICKNESS,
                  height: 32,
                  marginLeft: RING_SIZE / 2 - LINE_THICKNESS / 2,
                  backgroundColor: `${colors.accent}15`,
                  overflow: "hidden",
                  borderRadius: LINE_THICKNESS / 2,
                }}
              >
                <div
                  style={{
                    backgroundColor: colors.accent,
                    width: "100%",
                    height: `${lineProgress * 100}%`,
                    borderRadius: LINE_THICKNESS / 2,
                    boxShadow: `0 0 6px ${colors.accent}44`,
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
