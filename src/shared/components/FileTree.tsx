import React from "react";
import {
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
} from "remotion";
import { MONO, SCENE_DEFAULTS } from "../styles";

export type FileTreeItem = {
  name: string;
  type: "folder" | "file";
  indent: number;
  color?: string;
  highlight?: boolean;
};

type FileTreeProps = {
  items: FileTreeItem[];
  delay?: number;
  stagger?: number;
  sectionColor?: string;
  fontFamily?: string;
};

const FOLDER_ICON = "\uD83D\uDCC1";
const FILE_ICON = "\uD83D\uDCC4";

export const FileTree: React.FC<FileTreeProps> = ({
  items,
  delay = 0,
  stagger = SCENE_DEFAULTS.staggerDelaySlow,
  sectionColor = "#6366f1",
  fontFamily,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 6,
        fontFamily: fontFamily || MONO.fontFamily,
      }}
    >
      {items.map((item, i) => {
        const itemDelay = delay + i * stagger;
        const progress = spring({
          frame: frame - itemDelay,
          fps,
          config: SCENE_DEFAULTS.springSilky,
        });
        const opacity = interpolate(progress, [0, 1], [0, 1], {
          extrapolateRight: "clamp",
        });
        const xOffset = interpolate(progress, [0, 1], [-25, 0], {
          extrapolateRight: "clamp",
        });

        const indentPx = item.indent * 28;
        const icon = item.type === "folder" ? FOLDER_ICON : FILE_ICON;
        const itemColor = item.highlight
          ? item.color || sectionColor
          : "#cbd5e1";

        return (
          <div
            key={i}
            style={{
              opacity,
              transform: `translateX(${xOffset}px)`,
              display: "flex",
              alignItems: "center",
              gap: 10,
              paddingLeft: indentPx,
              fontSize: 20,
              lineHeight: 1.6,
            }}
          >
            {/* Tree lines */}
            {item.indent > 0 && (
              <span style={{ color: "#475569", fontSize: 16 }}>
                {"│ ".repeat(item.indent - 1)}├─
              </span>
            )}
            <span style={{ fontSize: 18 }}>{icon}</span>
            <span
              style={{
                color: itemColor,
                fontWeight: item.highlight ? 700 : 400,
              }}
            >
              {item.name}
            </span>
          </div>
        );
      })}
    </div>
  );
};
