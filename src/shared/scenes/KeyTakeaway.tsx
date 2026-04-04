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
import { GradientText } from "../components/GradientText";
import { useLayoutMode } from "../formats";
import { shimmer } from "../animations";
import { loadFont } from "@remotion/google-fonts/Inter";

const { fontFamily: interFont } = loadFont();

type KeyTakeawayVariant = "accent" | "insight";
type AccentVariant = "info" | "warning" | "success" | "danger";

type KeyTakeawayProps = {
  heading?: string;
  takeaway: string;
  variant?: KeyTakeawayVariant;
  accentVariant?: AccentVariant;
  highlightWord?: string;
  sectionColor?: string;
  colors?: { bg: string; text: string; muted?: string };
  fontFamily?: string;
};

const VARIANT_COLORS: Record<AccentVariant, string> = {
  info: BRAND.cyan,
  warning: BRAND.amber,
  success: BRAND.green,
  danger: BRAND.red,
};

const VARIANT_ICONS: Record<AccentVariant, string> = {
  info: "💡",
  warning: "⚠️",
  success: "✅",
  danger: "🚨",
};

export const KeyTakeaway: React.FC<KeyTakeawayProps> = ({
  heading = "Key Takeaway",
  takeaway,
  variant = "accent",
  accentVariant = "info",
  highlightWord,
  sectionColor = BRAND.indigo,
  colors = { bg: BRAND.bg, text: BRAND.text, muted: BRAND.textMuted },
  fontFamily = interFont,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { contentPadding, fontScale } = useLayoutMode();

  const headP = spring({ frame, fps, config: SCENE_DEFAULTS.springSmooth });
  const headOpacity = interpolate(headP, [0, 1], [0, 1]);
  const headY = interpolate(headP, [0, 1], [20, 0], { extrapolateRight: "clamp" });

  const cardP = spring({ frame: frame - 10, fps, config: SCENE_DEFAULTS.springSilky });
  const cardOpacity = interpolate(cardP, [0, 1], [0, 1], { extrapolateRight: "clamp" });
  const cardScale = interpolate(cardP, [0, 1], [0.96, 1], { extrapolateRight: "clamp" });

  const lineShimmer = shimmer(frame, 90);

  const accentColor = variant === "accent" ? VARIANT_COLORS[accentVariant] : sectionColor;

  // Insight variant: centered with gradient text
  if (variant === "insight") {
    const renderInsightText = () => {
      if (!highlightWord) {
        return <span style={{ color: colors.text }}>{takeaway}</span>;
      }
      const idx = takeaway.indexOf(highlightWord);
      if (idx === -1) {
        return <span style={{ color: colors.text }}>{takeaway}</span>;
      }
      return (
        <>
          <span style={{ color: colors.text }}>{takeaway.slice(0, idx)}</span>
          <GradientText
            text={highlightWord}
            from={sectionColor}
            to={BRAND.violet}
            fontSize={Math.round(44 * fontScale)}
            fontWeight={800}
            fontFamily={fontFamily}
            delay={SCENE_DEFAULTS.elementEntry}
            glow
          />
          <span style={{ color: colors.text }}>{takeaway.slice(idx + highlightWord.length)}</span>
        </>
      );
    };

    return (
      <SceneBackground bg={colors.bg}>
      <AbsoluteFill
        style={{
          justifyContent: "center",
          alignItems: "center",
          padding: contentPadding,
        }}
      >
        {/* Ambient glow */}
        <div
          style={{
            position: "absolute",
            top: "35%",
            left: "50%",
            width: 500,
            height: 500,
            borderRadius: "50%",
            background: `radial-gradient(circle, ${sectionColor}0c 0%, transparent 70%)`,
            transform: "translateX(-50%)",
            pointerEvents: "none",
          }}
        />

        <div
          style={{
            position: "relative",
            zIndex: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 28,
            maxWidth: 900,
          }}
        >
          <div
            style={{
              opacity: headOpacity,
              transform: `translateY(${headY}px)`,
              fontFamily,
              fontSize: Math.round(32 * fontScale),
              fontWeight: 700,
              color: sectionColor,
            }}
          >
            {heading}
          </div>
          <div
            style={{
              opacity: headOpacity,
              fontFamily,
              fontSize: Math.round(44 * fontScale),
              fontWeight: 800,
              textAlign: "center",
              lineHeight: 1.3,
            }}
          >
            {renderInsightText()}
          </div>
        </div>
      </AbsoluteFill>
      </SceneBackground>
    );
  }

  // Accent variant: glass card with icon, accent border, and rich styling
  return (
    <SceneBackground bg={colors.bg}>
    <AbsoluteFill
      style={{
        justifyContent: "center",
        alignItems: "center",
        padding: contentPadding,
      }}
    >
      {/* Ambient glow */}
      <div
        style={{
          position: "absolute",
          top: "30%",
          left: "50%",
          width: 600,
          height: 600,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${accentColor}0a 0%, transparent 70%)`,
          transform: "translateX(-50%)",
          pointerEvents: "none",
        }}
      />

      <div
        style={{
          position: "relative",
          zIndex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 32,
          maxWidth: 900,
          width: "100%",
        }}
      >
        {/* Heading */}
        <div
          style={{
            opacity: headOpacity,
            transform: `translateY(${headY}px)`,
            textAlign: "center",
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
              background: accentColor,
              margin: "12px auto 0",
              opacity: 0.5,
            }}
          />
        </div>

        {/* Takeaway card */}
        <div
          style={{
            opacity: cardOpacity,
            transform: `scale(${cardScale})`,
            width: "100%",
            borderRadius: GLASS.radius,
            overflow: "hidden",
            background: GLASS.bg,
            border: `1px solid ${GLASS.border}`,
            borderLeft: `4px solid ${accentColor}`,
            boxShadow: `${SHADOWS.md}, 0 0 ${20 + lineShimmer * 10}px ${accentColor}15`,
            display: "flex",
            flexDirection: "column",
          }}
        >
          {/* Card header stripe */}
          <div
            style={{
              padding: "20px 36px",
              background: `linear-gradient(135deg, ${accentColor}18 0%, transparent 100%)`,
              borderBottom: `1px solid ${BRAND.border}`,
              display: "flex",
              alignItems: "center",
              gap: 14,
            }}
          >
            <span style={{ fontSize: 28 }}>{VARIANT_ICONS[accentVariant]}</span>
            <div
              style={{
                fontFamily,
                fontSize: Math.round(24 * fontScale),
                fontWeight: 700,
                color: accentColor,
                letterSpacing: 0.5,
              }}
            >
              {accentVariant === "info" ? "Insight" : accentVariant === "warning" ? "Warning" : accentVariant === "success" ? "Success" : "Alert"}
            </div>
          </div>

          {/* Card body */}
          <div
            style={{
              padding: "28px 36px",
            }}
          >
            <div
              style={{
                fontFamily,
                fontSize: Math.round(32 * fontScale),
                fontWeight: 600,
                color: colors.text,
                lineHeight: 1.6,
              }}
            >
              {takeaway}
            </div>
          </div>
        </div>
      </div>
    </AbsoluteFill>
    </SceneBackground>
  );
};
