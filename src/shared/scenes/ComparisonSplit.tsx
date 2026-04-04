import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
} from "remotion";
import { BRAND, CARD, GLASS, GRADIENTS, SCENE_DEFAULTS, SHADOWS } from "../styles";
import { SceneBackground } from "../components/SceneBackground";
import { useLayoutMode } from "../formats";
import { glowPulse, shimmer } from "../animations";
import { loadFont } from "@remotion/google-fonts/Inter";

const { fontFamily: interFont } = loadFont();

type ComparisonSide = {
  title: string;
  items: string[];
  color: string;
};

type EntranceStyle = "slide" | "spring" | "overshoot";
type ComparisonVariant = "split" | "cards";

type ComparisonSplitProps = {
  heading: string;
  left: ComparisonSide;
  right: ComparisonSide;
  variant?: ComparisonVariant;
  sectionColor?: string;
  colors?: { bg: string; text: string; muted: string };
  fontFamily?: string;
  entranceStyle?: EntranceStyle;
};

export const ComparisonSplit: React.FC<ComparisonSplitProps> = ({
  heading,
  left,
  right,
  variant = "split",
  sectionColor,
  colors = { bg: BRAND.bg, text: BRAND.text, muted: BRAND.textMuted },
  fontFamily = interFont,
  entranceStyle = "slide",
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { isVertical, contentPadding, fontScale } = useLayoutMode();

  const headP = spring({ frame, fps, config: SCENE_DEFAULTS.springSmooth });
  const headOpacity = interpolate(headP, [0, 1], [0, 1]);
  const headY = interpolate(headP, [0, 1], [-20, 0], { extrapolateRight: "clamp" });

  const sideConfig =
    entranceStyle === "overshoot"
      ? SCENE_DEFAULTS.springBouncy
      : entranceStyle === "spring"
        ? SCENE_DEFAULTS.springSnappy
        : SCENE_DEFAULTS.springSmooth;

  const sideDistance = entranceStyle === "overshoot" ? 100 : 60;

  const leftP = spring({ frame: frame - 12, fps, config: sideConfig });
  const leftX = interpolate(leftP, [0, 1], [-sideDistance, 0], { extrapolateRight: "clamp" });
  const leftOpacity = interpolate(leftP, [0, 1], [0, 1], { extrapolateRight: "clamp" });

  const rightP = spring({ frame: frame - 12, fps, config: sideConfig });
  const rightX = interpolate(rightP, [0, 1], [sideDistance, 0], { extrapolateRight: "clamp" });
  const rightOpacity = interpolate(rightP, [0, 1], [0, 1], { extrapolateRight: "clamp" });

  // VS divider animation
  const vsP = spring({ frame: frame - 18, fps, config: SCENE_DEFAULTS.springSnappy });
  const vsScale = interpolate(vsP, [0, 1], [0, 1], { extrapolateRight: "clamp" });
  const vsOpacity = interpolate(vsP, [0, 1], [0, 1], { extrapolateRight: "clamp" });

  // Shimmer for subtle line glow
  const lineShimmer = shimmer(frame, 120);

  const renderSide = (
    side: ComparisonSide,
    sideOpacity: number,
    xOffset: number,
    baseDelay: number,
    alignment: "left" | "right"
  ) => (
    <div
      style={{
        flex: 1,
        opacity: sideOpacity,
        transform: `translateX(${xOffset}px)`,
        display: "flex",
        flexDirection: "column",
        borderRadius: GLASS.radius,
        overflow: "hidden",
        background: GLASS.bg,
        border: `1px solid ${GLASS.border}`,
        boxShadow: `${SHADOWS.md}, inset 0 1px 0 rgba(255,255,255,0.04)`,
      }}
    >
      {/* Gradient header bar */}
      <div
        style={{
          padding: "22px 32px",
          background: `linear-gradient(135deg, ${side.color}30 0%, ${side.color}08 100%)`,
          borderBottom: `1px solid ${side.color}25`,
          display: "flex",
          alignItems: "center",
          gap: 14,
          position: "relative",
        }}
      >
        {/* Accent dot */}
        <div
          style={{
            width: 10,
            height: 10,
            borderRadius: "50%",
            backgroundColor: side.color,
            boxShadow: `0 0 8px ${side.color}88, 0 0 16px ${side.color}44`,
            flexShrink: 0,
          }}
        />
        <div
          style={{
            fontFamily,
            fontSize: Math.round(28 * fontScale),
            fontWeight: 700,
            color: side.color,
            letterSpacing: 0.3,
          }}
        >
          {side.title}
        </div>
        {/* Subtle top-right glow */}
        <div
          style={{
            position: "absolute",
            top: 0,
            right: 0,
            width: 120,
            height: "100%",
            background: `linear-gradient(90deg, transparent, ${side.color}08)`,
            pointerEvents: "none",
          }}
        />
      </div>

      {/* Items list */}
      <div
        style={{
          padding: "24px 32px 32px",
          display: "flex",
          flexDirection: "column",
          gap: 18,
          flex: 1,
        }}
      >
        {side.items.map((item, i) => {
          const itemP = spring({
            frame: frame - baseDelay - 8 - i * SCENE_DEFAULTS.staggerDelay,
            fps,
            config: SCENE_DEFAULTS.springSilky,
          });
          const itemOpacity = interpolate(itemP, [0, 1], [0, 1], { extrapolateRight: "clamp" });
          const itemY = interpolate(itemP, [0, 1], [12, 0], { extrapolateRight: "clamp" });

          return (
            <div
              key={i}
              style={{
                opacity: itemOpacity,
                transform: `translateY(${itemY}px)`,
                display: "flex",
                alignItems: "flex-start",
                gap: 14,
                padding: "12px 16px",
                borderRadius: 10,
                background: `${side.color}06`,
                border: `1px solid ${side.color}10`,
              }}
            >
              {/* Numbered bullet */}
              <div
                style={{
                  width: 26,
                  height: 26,
                  borderRadius: 8,
                  backgroundColor: `${side.color}18`,
                  border: `1px solid ${side.color}30`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontFamily,
                  fontSize: 20,
                  fontWeight: 700,
                  color: side.color,
                  flexShrink: 0,
                  marginTop: 2,
                }}
              >
                {i + 1}
              </div>
              <div
                style={{
                  fontFamily,
                  fontSize: Math.round(24 * fontScale),
                  fontWeight: 500,
                  color: colors.text,
                  lineHeight: 1.5,
                }}
              >
                {item}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );

  // VS divider component
  const vsElement = isVertical ? null : (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 0,
        width: 48,
        flexShrink: 0,
        opacity: vsOpacity,
        transform: `scale(${vsScale})`,
      }}
    >
      {/* Top line */}
      <div
        style={{
          width: 2,
          flex: 1,
          background: `linear-gradient(180deg, transparent, ${colors.muted}${Math.round(30 + lineShimmer * 20).toString(16).padStart(2, "0")}, ${left.color}44)`,
          borderRadius: 1,
        }}
      />
      {/* VS badge */}
      <div
        style={{
          fontFamily,
          fontSize: 20,
          fontWeight: 800,
          color: colors.muted,
          letterSpacing: 2,
          padding: "10px 6px",
        }}
      >
        VS
      </div>
      {/* Bottom line */}
      <div
        style={{
          width: 2,
          flex: 1,
          background: `linear-gradient(180deg, ${right.color}44, ${colors.muted}${Math.round(30 + lineShimmer * 20).toString(16).padStart(2, "0")}, transparent)`,
          borderRadius: 1,
        }}
      />
    </div>
  );

  return (
    <SceneBackground bg={colors.bg}>
    <AbsoluteFill
      style={{
        padding: contentPadding,
      }}
    >
      {/* Background glow accents */}
      <div
        style={{
          position: "absolute",
          top: "20%",
          left: "10%",
          width: 400,
          height: 400,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${left.color}08 0%, transparent 70%)`,
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "absolute",
          top: "20%",
          right: "10%",
          width: 400,
          height: 400,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${right.color}08 0%, transparent 70%)`,
          pointerEvents: "none",
        }}
      />

      {/* Content */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: isVertical ? 20 : 28,
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
          {/* Subtle accent underline */}
          <div
            style={{
              width: interpolate(headP, [0, 1], [0, 80], { extrapolateRight: "clamp" }),
              height: 3,
              borderRadius: 2,
              background: `linear-gradient(90deg, ${left.color}, ${right.color})`,
              margin: "12px auto 0",
              opacity: 0.6,
            }}
          />
        </div>

        {/* Comparison columns */}
        <div
          style={{
            display: "flex",
            flexDirection: isVertical ? "column" : "row",
            gap: isVertical ? 16 : 0,
            flex: 1,
            alignItems: "stretch",
          }}
        >
          {renderSide(left, leftOpacity, isVertical ? 0 : leftX, 20, "left")}
          {vsElement}
          {renderSide(right, rightOpacity, isVertical ? 0 : rightX, 20, "right")}
        </div>
      </div>
    </AbsoluteFill>
    </SceneBackground>
  );
};
