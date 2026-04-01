import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
} from "remotion";
import { BRAND, SCENE_DEFAULTS, SHADOWS, CARD } from "../styles";
import { DiagramArrow } from "../components/DiagramArrow";

type DiagramNode = {
  id: string;
  label: string;
  sublabel?: string;
  color?: string;
  icon?: string;
  x: number;
  y: number;
};

type DiagramConnection = {
  from: string;
  to: string;
  label?: string;
  curved?: boolean;
};

type AnimatedDiagramProps = {
  title: string;
  nodes: DiagramNode[];
  connections: DiagramConnection[];
  curvedConnections?: boolean;
  sectionColor?: string;
  colors?: { bg: string; text: string; muted: string };
  fontFamily?: string;
};

export const AnimatedDiagram: React.FC<AnimatedDiagramProps> = ({
  title,
  nodes,
  connections,
  curvedConnections = false,
  sectionColor = BRAND.indigo,
  colors = { bg: BRAND.bg, text: BRAND.text, muted: BRAND.textMuted },
  fontFamily = "Inter",
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleP = spring({ frame, fps, config: SCENE_DEFAULTS.springSilky });

  // Build node position lookup
  const nodeMap = new Map(nodes.map((n) => [n.id, n]));

  return (
    <AbsoluteFill style={{ backgroundColor: colors.bg, padding: 80 }}>
      {/* Title */}
      <div
        style={{
          opacity: titleP,
          fontFamily,
          fontSize: 44,
          fontWeight: 800,
          color: colors.text,
          textAlign: "center",
          marginBottom: 20,
        }}
      >
        {title}
      </div>

      {/* Diagram area */}
      <div
        style={{
          flex: 1,
          position: "relative",
        }}
      >
        {/* Connections — rendered first (below nodes) */}
        {connections.map((conn, i) => {
          const fromNode = nodeMap.get(conn.from);
          const toNode = nodeMap.get(conn.to);
          if (!fromNode || !toNode) return null;

          return (
            <DiagramArrow
              key={`conn-${i}`}
              from={{ x: fromNode.x, y: fromNode.y }}
              to={{ x: toNode.x, y: toNode.y }}
              delay={12 + i * 6}
              color={colors.muted}
              curved={conn.curved ?? curvedConnections}
              label={conn.label}
              glow
              fontFamily={fontFamily}
            />
          );
        })}

        {/* Nodes */}
        {nodes.map((node, i) => {
          const nodeDelay = 6 + i * 6;
          const nodeP = spring({
            frame: frame - nodeDelay,
            fps,
            config: SCENE_DEFAULTS.springSilky,
          });
          const opacity = interpolate(nodeP, [0, 1], [0, 1], {
            extrapolateRight: "clamp",
          });
          const scale = interpolate(nodeP, [0, 1], [0.7, 1], {
            extrapolateRight: "clamp",
          });

          const nodeColor = node.color || sectionColor;

          return (
            <div
              key={node.id}
              style={{
                position: "absolute",
                left: node.x,
                top: node.y,
                transform: `translate(-50%, -50%) scale(${scale})`,
                opacity,
              }}
            >
              <div
                style={{
                  background: CARD.bg,
                  border: `${CARD.borderWidth}px solid ${nodeColor}44`,
                  borderRadius: CARD.radius,
                  padding: "16px 24px",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 6,
                  boxShadow: SHADOWS.glow(nodeColor),
                  minWidth: 120,
                }}
              >
                {node.icon && (
                  <div style={{ fontSize: 28 }}>{node.icon}</div>
                )}
                <div
                  style={{
                    fontFamily,
                    fontSize: 20,
                    fontWeight: 700,
                    color: colors.text,
                    textAlign: "center",
                    whiteSpace: "nowrap",
                  }}
                >
                  {node.label}
                </div>
                {node.sublabel && (
                  <div
                    style={{
                      fontFamily,
                      fontSize: 14,
                      fontWeight: 500,
                      color: colors.muted,
                      textAlign: "center",
                    }}
                  >
                    {node.sublabel}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
