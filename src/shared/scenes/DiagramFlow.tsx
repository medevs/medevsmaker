import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
} from "remotion";
import { BRAND, SCENE_DEFAULTS } from "../styles";
import { DiagramBox } from "../components/DiagramBox";
import { DiagramArrow } from "../components/DiagramArrow";

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
  const { fps } = useVideoConfig();

  const titleP = spring({ frame, fps, config: SCENE_DEFAULTS.springSmooth });
  const titleOpacity = interpolate(titleP, [0, 1], [0, 1]);
  const titleY = interpolate(titleP, [0, 1], [30, 0]);

  // Node positions
  const isHorizontal = direction === "horizontal";
  const boxW = 220;
  const boxH = 100;
  const gap = isHorizontal ? 160 : 80;
  const totalW = nodes.length * boxW + (nodes.length - 1) * gap;
  const totalH = nodes.length * boxH + (nodes.length - 1) * gap;
  const startX = isHorizontal ? (1920 - totalW) / 2 : (1920 - boxW) / 2;
  const startY = isHorizontal ? 500 : (1080 - totalH) / 2 + 60;

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
    const pipeW = 200;
    const pipeGap = 80;
    const totalPipeW = nodes.length * pipeW + (nodes.length - 1) * pipeGap;
    const pipeStartX = (1920 - totalPipeW) / 2;
    const pipeY = 460;

    return (
      <AbsoluteFill style={{ backgroundColor: colors.bg }}>
        <div
          style={{
            position: "absolute",
            top: 80,
            left: 80,
            right: 80,
            opacity: titleOpacity,
            transform: `translateY(${titleY}px)`,
            fontFamily,
            fontSize: 48,
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
                    padding: "20px 16px",
                    backgroundColor: `${nodeColor}12`,
                    border: `2px solid ${nodeColor}44`,
                    borderRadius: 12,
                    textAlign: "center",
                    display: "flex",
                    flexDirection: "column",
                    gap: 6,
                  }}
                >
                  <span
                    style={{
                      fontFamily,
                      fontSize: 22,
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
                        fontSize: 16,
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
                      fontSize: 28,
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
    );
  }

  return (
    <AbsoluteFill style={{ backgroundColor: colors.bg }}>
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
          fontSize: 48,
          fontWeight: 800,
          color: colors.text,
        }}
      >
        {title}
      </div>

      {/* Arrows */}
      {connections.map((conn, i) => {
        const fromPos = nodePositions[conn.from];
        const toPos = nodePositions[conn.to];
        if (!fromPos || !toPos) return null;

        const fromPt = {
          x: isHorizontal ? fromPos.centerX + boxW / 2 + 10 : fromPos.centerX,
          y: isHorizontal ? fromPos.centerY : fromPos.centerY + boxH / 2 + 10,
        };
        const toPt = {
          x: isHorizontal ? toPos.centerX - boxW / 2 - 10 : toPos.centerX,
          y: isHorizontal ? toPos.centerY : toPos.centerY - boxH / 2 - 10,
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
  );
};
