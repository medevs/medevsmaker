import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
} from "remotion";
import { BRAND, SCENE_DEFAULTS } from "../styles";
import { FileTree, FileTreeItem } from "../components/FileTree";
import { ColorBorderCard } from "../components/ColorBorderCard";

type FileTreeSceneProps = {
  heading: string;
  items: FileTreeItem[];
  annotation?: string;
  sectionColor?: string;
  colors?: { bg: string; text: string; muted: string };
  fontFamily?: string;
};

export const FileTreeScene: React.FC<FileTreeSceneProps> = ({
  heading,
  items,
  annotation,
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
  const headY = interpolate(headP, [0, 1], [20, 0], {
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: colors.bg,
        padding: 80,
        gap: 32,
      }}
    >
      <div
        style={{
          opacity: headOpacity,
          transform: `translateY(${headY}px)`,
          fontFamily,
          fontSize: 48,
          fontWeight: 800,
          color: colors.text,
        }}
      >
        {heading}
      </div>

      <div
        style={{
          display: "flex",
          gap: 40,
          flex: 1,
          alignItems: "flex-start",
        }}
      >
        <div style={{ flex: annotation ? 2 : 1, paddingTop: 16 }}>
          <FileTree
            items={items}
            delay={SCENE_DEFAULTS.elementEntry}
            sectionColor={sectionColor}
          />
        </div>

        {annotation && (
          <div style={{ flex: 1, paddingTop: 16 }}>
            <ColorBorderCard
              color={sectionColor}
              delay={
                SCENE_DEFAULTS.elementEntry +
                items.length * SCENE_DEFAULTS.staggerDelaySlow
              }
              fontFamily={fontFamily}
            >
              <div
                style={{
                  fontFamily,
                  fontSize: 22,
                  color: colors.muted,
                  lineHeight: 1.5,
                }}
              >
                {annotation}
              </div>
            </ColorBorderCard>
          </div>
        )}
      </div>
    </AbsoluteFill>
  );
};
