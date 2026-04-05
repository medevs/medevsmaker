import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
} from "remotion";
import { evolvePath } from "@remotion/paths";
import { baseTokens, BRAND, SCENE_DEFAULTS, TYPOGRAPHY } from "../styles";
import { DiagramBox } from "../components/DiagramBox";
import { DiagramArrow } from "../components/DiagramArrow";
import { SceneBackground } from "../components/SceneBackground";
import { useLayoutMode } from "../formats";

type FlowNode = {
  label: string;
  sublabel?: string;
  color?: string;
};

type FlowConnection = {
  from: number;
  to: number;
  label?: string;
};

type DiagramFlowVariant = "boxes" | "pipeline";

type DiagramFlowProps = {
  title: string;
  nodes: FlowNode[];
  connections: FlowConnection[];
  direction?: "horizontal" | "vertical";
  variant?: DiagramFlowVariant;
  sectionColor?: string;
  colors?: { bg: string; text: string; accent: string };
  fontFamily?: string;
};

export const DiagramFlow: React.FC<DiagramFlowProps> = ({
  title,
  nodes,
  connections,
  direction = "horizontal",
  variant = "boxes",
  sectionColor,
  colors = { bg: BRAND.bg, text: BRAND.text, accent: BRAND.indigo },
  fontFamily = "Inter",
}) => {
  const effectiveAccent = sectionColor || colors.accent;
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const { contentPadding, fontScale } = useLayoutMode();

  const titleP = spring({ frame, fps, config: SCENE_DEFAULTS.springSmooth });
  const titleOpacity = interpolate(titleP, [0, 1], [0, 1]);
  const titleY = interpolate(titleP, [0, 1], [30, 0]);

  // Node positions
  const isHorizontal = direction === "horizontal";
  const boxW = 300;
  const boxH = 110;
  const gap = isHorizontal ? 120 : 80;
  const totalW = nodes.length * boxW + (nodes.length - 1) * gap;
  const totalH = nodes.length * boxH + (nodes.length - 1) * gap;
  const startX = isHorizontal ? (width - totalW) / 2 : (width - boxW) / 2;
  const startY = isHorizontal ? Math.round(height * 0.46) : (height - totalH) / 2 + 60;

  const nodePositions = nodes.map((_, i) => ({
    x: isHorizontal ? startX + i * (boxW + gap) : startX,
    y: isHorizontal ? startY : startY + i * (boxH + gap),
    centerX: isHorizontal
      ? startX + i * (boxW + gap) + boxW / 2
      : startX + boxW / 2,
    centerY: isHorizontal
      ? startY + boxH / 2
      : startY + i * (boxH + gap) + boxH / 2,
  }));

  // Pipeline variant: horizontal rectangles with → text arrows
  if (variant === "pipeline") {
    const pipeW = 260;
    const pipeGap = 60;
    const totalPipeW = nodes.length * pipeW + (nodes.length - 1) * pipeGap;
    const pipeStartX = (width - totalPipeW) / 2;
    const pipeY = 460;

    return (
      <SceneBackground bg={colors.bg}>
        <AbsoluteFill>
          <div
            style={{
              position: "absolute",
              top: 80,
              left: 80,
              right: 80,
              opacity: titleOpacity,
              transform: `translateY(${titleY}px)`,
              fontFamily,
              fontSize: Math.round(48 * fontScale),
              fontWeight: 800,
              color: colors.text,
            }}
          >
            {title}
          </div>

          <div
            style={{
              position: "absolute",
              left: pipeStartX,
              top: pipeY,
              display: "flex",
              alignItems: "center",
              gap: 0,
            }}
          >
            {nodes.map((node, i) => {
            const nodeDelay = 10 + i * SCENE_DEFAULTS.staggerDelaySlow;
            const nodeP = spring({
              frame: frame - nodeDelay,
              fps,
              config: SCENE_DEFAULTS.springSilky,
            });
            const nodeOpacity = interpolate(nodeP, [0, 1], [0, 1], {
              extrapolateRight: "clamp",
            });
            const nodeScale = interpolate(nodeP, [0, 1], [0.9, 1], {
              extrapolateRight: "clamp",
            });

            const nodeColor = node.color || effectiveAccent;

            return (
              <React.Fragment key={i}>
                <div
                  style={{
                    opacity: nodeOpacity,
                    transform: `scale(${nodeScale})`,
                    width: pipeW,
                    padding: "24px 20px",
                    backgroundColor: `${nodeColor}12`,
                    border: `3px solid ${nodeColor}44`,
                    borderRadius: baseTokens.borderRadius.lg,
                    textAlign: "center",
                    display: "flex",
                    flexDirection: "column",
                    gap: 6,
                  }}
                >
                  <span
                    style={{
                      fontFamily,
                      fontSize: Math.round(22 * fontScale),
                      fontWeight: 700,
                      color: colors.text,
                    }}
                  >
                    {node.label}
                  </span>
                  {node.sublabel && (
                    <span
                      style={{
                        fontFamily,
                        fontSize: Math.round(20 * fontScale),
                        color: colors.text + "99",
                      }}
                    >
                      {node.sublabel}
                    </span>
                  )}
                </div>
                {i < nodes.length - 1 && (
                  <div
                    style={{
                      opacity: nodeOpacity,
                      width: pipeGap,
                      textAlign: "center",
                      fontFamily,
                      fontSize: Math.round(28 * fontScale),
                      fontWeight: 700,
                      color: effectiveAccent + "88",
                    }}
                  >
                    →
                  </div>
                )}
              </React.Fragment>
            );
            })}
          </div>
        </AbsoluteFill>
      </SceneBackground>
    );
  }

  return (
    <SceneBackground bg={colors.bg}>
      <AbsoluteFill>
        {/* Title */}
      <div
        style={{
          position: "absolute",
          top: 80,
          left: 80,
          right: 80,
          opacity: titleOpacity,
          transform: `translateY(${titleY}px)`,
          fontFamily,
          fontSize: Math.round(48 * fontScale),
          fontWeight: 800,
          color: colors.text,
        }}
      >
        {title}
      </div>

      {/* Arrows — adjacent connections use DiagramArrow, bypass connections use custom SVG */}
      {connections.map((conn, i) => {
        const fromPos = nodePositions[conn.from];
        const toPos = nodePositions[conn.to];
        if (!fromPos || !toPos) return null;

        const arrowGap = 14;
        const span = Math.abs(conn.to - conn.from);

        if (span > 1) {
          // Bypass arrow: route around the side with a smooth cubic bezier
          const connDelay = 15 + Math.max(conn.from, conn.to) * 12;
          const connP = spring({
            frame: frame - connDelay,
            fps,
            config: SCENE_DEFAULTS.springSmooth,
          });
          const drawProgress = interpolate(connP, [0, 1], [0, 1], {
            extrapolateRight: "clamp",
          });

          const bowOut = 50 + span * 20;
          let pathD: string;
          let tipX: number;
          let tipY: number;
          let tipAngle: number;

          if (isHorizontal) {
            const sx = fromPos.centerX;
            const sy = fromPos.centerY + boxH / 2 + 8;
            const ex = toPos.centerX;
            const ey = toPos.centerY + boxH / 2 + 8;
            const cpY = Math.max(sy, ey) + bowOut;
            pathD = `M ${sx} ${sy} C ${sx} ${cpY}, ${ex} ${cpY}, ${ex} ${ey}`;
            tipX = ex;
            tipY = ey;
            tipAngle = -Math.PI / 2;
          } else {
            const sx = fromPos.centerX + boxW / 2 + 8;
            const sy = fromPos.centerY;
            const ex = toPos.centerX + boxW / 2 + 8;
            const ey = toPos.centerY;
            const cpX = sx + bowOut;
            pathD = `M ${sx} ${sy} C ${cpX} ${sy}, ${cpX} ${ey}, ${ex} ${ey}`;
            tipX = ex;
            tipY = ey;
            tipAngle = Math.PI;
          }

          const evolved = drawProgress > 0 ? evolvePath(drawProgress, pathD) : { strokeDasharray: "0 999999", strokeDashoffset: 0 };
          const headSize = 14;
          const headAngle = Math.PI / 6;
          const arrowL = {
            x: tipX - headSize * Math.cos(tipAngle - headAngle),
            y: tipY - headSize * Math.sin(tipAngle - headAngle),
          };
          const arrowR = {
            x: tipX - headSize * Math.cos(tipAngle + headAngle),
            y: tipY - headSize * Math.sin(tipAngle + headAngle),
          };

          return (
            <svg
              key={`bypass-${i}`}
              style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", pointerEvents: "none" }}
            >
              <path
                d={pathD}
                fill="none"
                stroke={effectiveAccent}
                strokeWidth={3}
                strokeLinecap="round"
                opacity={0.4}
                {...evolved}
              />
              {drawProgress > 0.1 && (
                <polygon
                  points={`${tipX},${tipY} ${arrowL.x},${arrowL.y} ${arrowR.x},${arrowR.y}`}
                  fill={effectiveAccent}
                  opacity={drawProgress * 0.5}
                />
              )}
            </svg>
          );
        }

        // Adjacent nodes: straight arrow between edges
        const fromPt = {
          x: isHorizontal ? fromPos.centerX + boxW / 2 + arrowGap : fromPos.centerX,
          y: isHorizontal ? fromPos.centerY : fromPos.centerY + boxH / 2 + arrowGap,
        };
        const toPt = {
          x: isHorizontal ? toPos.centerX - boxW / 2 - arrowGap : toPos.centerX,
          y: isHorizontal ? toPos.centerY : toPos.centerY - boxH / 2 - arrowGap,
        };

        return (
          <DiagramArrow
            key={`arrow-${i}`}
            from={fromPt}
            to={toPt}
            delay={15 + Math.max(conn.from, conn.to) * 12}
            label={conn.label}
            fontFamily={fontFamily}
          />
        );
      })}

      {/* Nodes */}
      {nodes.map((node, i) => {
        const pos = nodePositions[i];
        return (
          <div
            key={`node-${i}`}
            style={{
              position: "absolute",
              left: pos.x,
              top: pos.y,
            }}
          >
            <DiagramBox
              label={node.label}
              sublabel={node.sublabel}
              color={node.color || colors.accent}
              delay={10 + i * 12}
              width={boxW}
              height={boxH}
              fontFamily={fontFamily}
            />
          </div>
        );
      })}
      </AbsoluteFill>
    </SceneBackground>
  );
};
