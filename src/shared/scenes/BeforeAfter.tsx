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

type BeforeAfterReveal = "wipe" | "split";

type BeforeAfterProps = {
  heading: string;
  before: { title: string; items: string[] };
  after: { title: string; items: string[] };
  sectionColor?: string;
  colors?: {
    bg: string;
    text: string;
    beforeColor: string;
    afterColor: string;
    muted: string;
  };
  fontFamily?: string;
  reveal?: BeforeAfterReveal;
};

export const BeforeAfter: React.FC<BeforeAfterProps> = ({
  heading,
  before,
  after,
  colors = {
    bg: BRAND.bg,
    text: BRAND.text,
    beforeColor: BRAND.red,
    afterColor: BRAND.green,
    muted: BRAND.textMuted,
  },
  sectionColor,
  fontFamily = interFont,
  reveal = "wipe",
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { isVertical, contentPadding, fontScale } = useLayoutMode();

  // Heading entrance
  const headP = spring({ frame, fps, config: SCENE_DEFAULTS.springSmooth });
  const headOpacity = interpolate(headP, [0, 1], [0, 1]);
  const headY = interpolate(headP, [0, 1], [-20, 0], { extrapolateRight: "clamp" });

  // Before panel
  const beforeP = spring({ frame: frame - 8, fps, config: SCENE_DEFAULTS.springSmooth });
  const beforeOpacity = interpolate(beforeP, [0, 1], [0, 1], { extrapolateRight: "clamp" });

  // After panel
  const afterP = spring({ frame: frame - 25, fps, config: SCENE_DEFAULTS.springSmooth });
  const afterProgress = interpolate(afterP, [0, 1], [0, 1], { extrapolateRight: "clamp" });

  // Divider shimmer
  const lineShimmer = shimmer(frame, 120);

  const renderPanel = (
    panel: { title: string; items: string[] },
    panelColor: string,
    panelOpacity: number,
    baseDelay: number
  ) => (
    <div
      style={{
        flex: 1,
        opacity: panelOpacity,
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
          background: `linear-gradient(135deg, ${panelColor}30 0%, ${panelColor}08 100%)`,
          borderBottom: `1px solid ${panelColor}25`,
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
            backgroundColor: panelColor,
            boxShadow: `0 0 8px ${panelColor}88, 0 0 16px ${panelColor}44`,
            flexShrink: 0,
          }}
        />
        <div
          style={{
            fontFamily,
            fontSize: Math.round(28 * fontScale),
            fontWeight: 700,
            color: panelColor,
            letterSpacing: 0.3,
          }}
        >
          {panel.title}
        </div>
        {/* Subtle edge glow */}
        <div
          style={{
            position: "absolute",
            top: 0,
            right: 0,
            width: 120,
            height: "100%",
            background: `linear-gradient(90deg, transparent, ${panelColor}08)`,
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
        {panel.items.map((item, i) => {
          const itemP = spring({
            frame: frame - baseDelay - i * SCENE_DEFAULTS.staggerDelay,
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
                background: `${panelColor}06`,
                border: `1px solid ${panelColor}10`,
              }}
            >
              {/* Numbered bullet */}
              <div
                style={{
                  width: 26,
                  height: 26,
                  borderRadius: 8,
                  backgroundColor: `${panelColor}18`,
                  border: `1px solid ${panelColor}30`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontFamily,
                  fontSize: 20,
                  fontWeight: 700,
                  color: panelColor,
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

  // Arrow divider between panels
  const arrowDivider = isVertical ? null : (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        width: 48,
        flexShrink: 0,
        opacity: afterProgress,
      }}
    >
      <div
        style={{
          width: 2,
          flex: 1,
          background: `linear-gradient(180deg, transparent, ${colors.muted}${Math.round(30 + lineShimmer * 20).toString(16).padStart(2, "0")}, ${colors.beforeColor}44)`,
          borderRadius: 1,
        }}
      />
      {/* Arrow icon */}
      <div
        style={{
          fontFamily,
          fontSize: 28,
          fontWeight: 800,
          color: colors.muted,
          padding: "8px 0",
          transform: `scale(${interpolate(afterProgress, [0, 1], [0.5, 1], { extrapolateRight: "clamp" })})`,
        }}
      >
        →
      </div>
      <div
        style={{
          width: 2,
          flex: 1,
          background: `linear-gradient(180deg, ${colors.afterColor}44, ${colors.muted}${Math.round(30 + lineShimmer * 20).toString(16).padStart(2, "0")}, transparent)`,
          borderRadius: 1,
        }}
      />
    </div>
  );

  // Heading + underline
  const headingBlock = (
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
      <div
        style={{
          width: interpolate(headP, [0, 1], [0, 80], { extrapolateRight: "clamp" }),
          height: 3,
          borderRadius: 2,
          background: `linear-gradient(90deg, ${colors.beforeColor}, ${colors.afterColor})`,
          margin: "12px auto 0",
          opacity: 0.6,
        }}
      />
    </div>
  );

  if (reveal === "wipe") {
    const wipePercent = interpolate(afterProgress, [0, 1], [0, 100], { extrapolateRight: "clamp" });

    return (
      <SceneBackground bg={colors.bg}>
      <AbsoluteFill style={{ padding: contentPadding }}>
        {/* Background glow accents */}
        <div
          style={{
            position: "absolute",
            top: "20%",
            left: "10%",
            width: 400,
            height: 400,
            borderRadius: "50%",
            background: `radial-gradient(circle, ${colors.beforeColor}08 0%, transparent 70%)`,
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
            background: `radial-gradient(circle, ${colors.afterColor}08 0%, transparent 70%)`,
            pointerEvents: "none",
          }}
        />

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
          {headingBlock}

          <div
            style={{
              display: "flex",
              flexDirection: isVertical ? "column" : "row",
              gap: isVertical ? 16 : 0,
              flex: 1,
              position: "relative",
            }}
          >
            {renderPanel(before, colors.beforeColor, beforeOpacity, 12)}
            {arrowDivider}
            <div
              style={{
                flex: 1,
                display: "flex",
                clipPath: isVertical
                  ? `inset(0 0 ${100 - wipePercent}% 0)`
                  : `inset(0 ${100 - wipePercent}% 0 0)`,
              }}
            >
              {renderPanel(after, colors.afterColor, 1, 30)}
            </div>
          </div>
        </div>
      </AbsoluteFill>
      </SceneBackground>
    );
  }

  // "split" — both slide in from sides
  const afterX = interpolate(afterProgress, [0, 1], [60, 0], { extrapolateRight: "clamp" });

  return (
    <SceneBackground bg={colors.bg}>
    <AbsoluteFill style={{ padding: contentPadding }}>
      {/* Background glow accents */}
      <div
        style={{
          position: "absolute",
          top: "20%",
          left: "10%",
          width: 400,
          height: 400,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${colors.beforeColor}08 0%, transparent 70%)`,
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
          background: `radial-gradient(circle, ${colors.afterColor}08 0%, transparent 70%)`,
          pointerEvents: "none",
        }}
      />

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
        {headingBlock}

        <div
          style={{
            display: "flex",
            flexDirection: isVertical ? "column" : "row",
            gap: isVertical ? 16 : 0,
            flex: 1,
          }}
        >
          {renderPanel(before, colors.beforeColor, beforeOpacity, 12)}
          {arrowDivider}
          <div
            style={{
              flex: 1,
              display: "flex",
              opacity: afterProgress,
              transform: isVertical
                ? `translateY(${afterX}px)`
                : `translateX(${afterX}px)`,
            }}
          >
            {renderPanel(after, colors.afterColor, 1, 30)}
          </div>
        </div>
      </div>
    </AbsoluteFill>
    </SceneBackground>
  );
};
