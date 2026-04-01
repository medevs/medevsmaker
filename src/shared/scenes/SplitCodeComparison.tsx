import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
} from "remotion";
import { BRAND, SCENE_DEFAULTS } from "../styles";
import { CodeBlock } from "../components/CodeBlock";

type CodePanel = {
  title: string;
  code: string;
  language?: string;
  highlightLines?: number[];
};

type SplitCodeComparisonProps = {
  heading?: string;
  left: CodePanel;
  right: CodePanel;
  sectionColor?: string;
  colors?: { bg: string; text: string; muted: string };
  fontFamily?: string;
};

export const SplitCodeComparison: React.FC<SplitCodeComparisonProps> = ({
  heading,
  left,
  right,
  sectionColor = BRAND.indigo,
  colors = { bg: BRAND.bg, text: BRAND.text, muted: BRAND.textMuted },
  fontFamily = "Inter",
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const headP = spring({ frame, fps, config: SCENE_DEFAULTS.springSilky });
  const leftP = spring({
    frame: frame - 6,
    fps,
    config: SCENE_DEFAULTS.springSilky,
  });
  const rightP = spring({
    frame: frame - 12,
    fps,
    config: SCENE_DEFAULTS.springSilky,
  });
  const vsP = spring({
    frame: frame - 8,
    fps,
    config: SCENE_DEFAULTS.springBouncy,
  });

  const leftX = interpolate(leftP, [0, 1], [-30, 0], {
    extrapolateRight: "clamp",
  });
  const rightX = interpolate(rightP, [0, 1], [30, 0], {
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ backgroundColor: colors.bg, padding: 80, gap: 32 }}>
      {heading && (
        <div
          style={{
            opacity: headP,
            fontFamily,
            fontSize: 44,
            fontWeight: 800,
            color: colors.text,
            textAlign: "center",
          }}
        >
          {heading}
        </div>
      )}

      <div
        style={{
          flex: 1,
          display: "flex",
          alignItems: "stretch",
          gap: 32,
        }}
      >
        {/* Left panel */}
        <div
          style={{
            flex: 1,
            opacity: leftP,
            transform: `translateX(${leftX}px)`,
            display: "flex",
            flexDirection: "column",
            gap: 12,
          }}
        >
          <div
            style={{
              fontFamily,
              fontSize: 22,
              fontWeight: 700,
              color: BRAND.red,
              textTransform: "uppercase",
              letterSpacing: 1.5,
            }}
          >
            {left.title}
          </div>
          <div style={{ flex: 1 }}>
            <CodeBlock
              code={left.code}
              highlightLines={left.highlightLines}
              fontFamily="JetBrains Mono"
              fontSize={18}
            />
          </div>
        </div>

        {/* VS divider */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 12,
          }}
        >
          <div
            style={{
              width: 2,
              flex: 1,
              backgroundColor: `${colors.muted}33`,
            }}
          />
          <div
            style={{
              opacity: vsP,
              transform: `scale(${interpolate(vsP, [0, 1], [0.5, 1], { extrapolateRight: "clamp" })})`,
              fontFamily,
              fontSize: 24,
              fontWeight: 900,
              color: sectionColor,
              padding: "8px 16px",
              borderRadius: 8,
              border: `2px solid ${sectionColor}44`,
            }}
          >
            VS
          </div>
          <div
            style={{
              width: 2,
              flex: 1,
              backgroundColor: `${colors.muted}33`,
            }}
          />
        </div>

        {/* Right panel */}
        <div
          style={{
            flex: 1,
            opacity: rightP,
            transform: `translateX(${rightX}px)`,
            display: "flex",
            flexDirection: "column",
            gap: 12,
          }}
        >
          <div
            style={{
              fontFamily,
              fontSize: 22,
              fontWeight: 700,
              color: BRAND.green,
              textTransform: "uppercase",
              letterSpacing: 1.5,
            }}
          >
            {right.title}
          </div>
          <div style={{ flex: 1 }}>
            <CodeBlock
              code={right.code}
              highlightLines={right.highlightLines}
              fontFamily="JetBrains Mono"
              fontSize={18}
            />
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
