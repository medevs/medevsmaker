import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
} from "remotion";
import { BRAND, SCENE_DEFAULTS, SHADOWS, CARD } from "../styles";
import { SceneBackground } from "../components/SceneBackground";

type Stage = {
  label: string;
  color?: string;
  icon?: string;
};

type ProcessAnimationProps = {
  title: string;
  stages: Stage[];
  /** Optional items that animate through the stages */
  items?: { label: string; icon?: string }[];
  sectionColor?: string;
  colors?: { bg: string; text: string; muted: string };
  fontFamily?: string;
};

export const ProcessAnimation: React.FC<ProcessAnimationProps> = ({
  title,
  stages,
  items,
  sectionColor = BRAND.indigo,
  colors = { bg: BRAND.bg, text: BRAND.text, muted: BRAND.textMuted },
  fontFamily = "Inter",
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleP = spring({ frame, fps, config: SCENE_DEFAULTS.springSilky });

  // Stage layout — horizontal
  const stageCount = stages.length;
  const stageWidth = 220;
  const gap = 50;
  const totalWidth = stageCount * stageWidth + (stageCount - 1) * gap;
  const startX = (1920 - totalWidth) / 2;

  // Animated item position — moves through stages over time
  const itemStageIndex = items
    ? interpolate(frame, [30, 30 + stageCount * 25], [0, stageCount - 1], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      })
    : 0;

  return (
    <SceneBackground bg={colors.bg}>
      <AbsoluteFill style={{ padding: 80 }}>
        {/* Title */}
      <div
        style={{
          opacity: titleP,
          fontFamily,
          fontSize: 44,
          fontWeight: 800,
          color: colors.text,
          textAlign: "center",
          marginBottom: 60,
        }}
      >
        {title}
      </div>

      {/* Stages */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: 0,
          right: 0,
          transform: "translateY(-50%)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap,
        }}
      >
        {stages.map((stage, i) => {
          const stageDelay = 8 + i * 10;
          const stageP = spring({
            frame: frame - stageDelay,
            fps,
            config: SCENE_DEFAULTS.springSilky,
          });
          const stageColor = stage.color || sectionColor;

          // Is the animated item at this stage?
          const isActive = items ? Math.abs(itemStageIndex - i) < 0.5 : false;
          const activeGlow = isActive
            ? SHADOWS.deepGlow(stageColor)
            : "none";

          return (
            <React.Fragment key={i}>
              {/* Connector arrow */}
              {i > 0 && (
                <div
                  style={{
                    position: "absolute",
                    left: startX + i * (stageWidth + gap) - gap + 5,
                    top: "50%",
                    transform: "translateY(-50%)",
                    width: gap - 10,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <svg
                    width={gap - 10}
                    height={20}
                    style={{
                      opacity: stageP,
                    }}
                  >
                    <line
                      x1={0}
                      y1={10}
                      x2={gap - 25}
                      y2={10}
                      stroke={colors.muted}
                      strokeWidth={3}
                      opacity={0.5}
                    />
                    <polygon
                      points={`${gap - 25},4 ${gap - 10},10 ${gap - 25},16`}
                      fill={colors.muted}
                      opacity={0.5}
                    />
                  </svg>
                </div>
              )}

              {/* Stage box */}
              <div
                style={{
                  opacity: stageP,
                  transform: `scale(${interpolate(stageP, [0, 1], [0.8, 1], { extrapolateRight: "clamp" })})`,
                  width: stageWidth,
                  background: isActive ? `${stageColor}15` : CARD.bg,
                  border: `3px solid ${isActive ? `${stageColor}44` : CARD.border}`,
                  borderRadius: CARD.radius,
                  padding: "28px 20px",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 12,
                  boxShadow: activeGlow,
                  transition: "none",
                }}
              >
                {stage.icon && (
                  <div style={{ fontSize: 36 }}>{stage.icon}</div>
                )}
                <div
                  style={{
                    fontFamily,
                    fontSize: 20,
                    fontWeight: 700,
                    color: isActive ? stageColor : colors.text,
                    textAlign: "center",
                  }}
                >
                  {stage.label}
                </div>
              </div>
            </React.Fragment>
          );
        })}
      </div>

      {/* Animated item dot */}
      {items && items[0] && (
        <div
          style={{
            position: "absolute",
            top: "50%",
            left:
              startX +
              itemStageIndex * (stageWidth + gap) +
              stageWidth / 2,
            transform: "translate(-50%, -150px)",
          }}
        >
          <div
            style={{
              width: 48,
              height: 48,
              borderRadius: "50%",
              backgroundColor: sectionColor,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: SHADOWS.glow(sectionColor),
              fontSize: 24,
            }}
          >
            {items[0].icon || "\u25CF"}
          </div>
          <div
            style={{
              fontFamily,
              fontSize: 20,
              fontWeight: 600,
              color: sectionColor,
              textAlign: "center",
              marginTop: 8,
              whiteSpace: "nowrap",
            }}
          >
            {items[0].label}
          </div>
        </div>
      )}
      </AbsoluteFill>
    </SceneBackground>
  );
};
