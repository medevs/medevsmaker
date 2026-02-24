import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
} from "remotion";
import { BRAND, SCENE_DEFAULTS } from "../styles";
import { AccentBox } from "../components/AccentBox";
import { GradientText } from "../components/GradientText";

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

export const KeyTakeaway: React.FC<KeyTakeawayProps> = ({
  heading = "Key Takeaway",
  takeaway,
  variant = "accent",
  accentVariant = "info",
  highlightWord,
  sectionColor = BRAND.indigo,
  colors = { bg: BRAND.bg, text: BRAND.text, muted: BRAND.textMuted },
  fontFamily = "Inter",
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const headP = spring({ frame, fps, config: SCENE_DEFAULTS.springSmooth });
  const headOpacity = interpolate(headP, [0, 1], [0, 1]);
  const headY = interpolate(headP, [0, 1], [20, 0]);

  // Insight variant: centered with gradient text
  if (variant === "insight") {
    const renderInsightText = () => {
      if (!highlightWord) {
        return (
          <span style={{ color: colors.text }}>{takeaway}</span>
        );
      }
      const idx = takeaway.indexOf(highlightWord);
      if (idx === -1) {
        return (
          <span style={{ color: colors.text }}>{takeaway}</span>
        );
      }
      return (
        <>
          <span style={{ color: colors.text }}>
            {takeaway.slice(0, idx)}
          </span>
          <GradientText
            text={highlightWord}
            from={sectionColor}
            to={BRAND.violet}
            fontSize={44}
            fontWeight={800}
            fontFamily={fontFamily}
            delay={SCENE_DEFAULTS.elementEntry}
            glow
          />
          <span style={{ color: colors.text }}>
            {takeaway.slice(idx + highlightWord.length)}
          </span>
        </>
      );
    };

    return (
      <AbsoluteFill
        style={{
          backgroundColor: colors.bg,
          justifyContent: "center",
          alignItems: "center",
          padding: "100px 160px",
          gap: 28,
        }}
      >
        <div
          style={{
            opacity: headOpacity,
            transform: `translateY(${headY}px)`,
            fontFamily,
            fontSize: 32,
            fontWeight: 700,
            color: sectionColor,
            marginBottom: 4,
          }}
        >
          {heading}
        </div>
        <div
          style={{
            opacity: headOpacity,
            fontFamily,
            fontSize: 44,
            fontWeight: 800,
            textAlign: "center",
            lineHeight: 1.3,
            maxWidth: 900,
          }}
        >
          {renderInsightText()}
        </div>
      </AbsoluteFill>
    );
  }

  return (
    <AbsoluteFill
      style={{
        backgroundColor: colors.bg,
        justifyContent: "center",
        alignItems: "center",
        padding: 100,
        gap: 32,
      }}
    >
      <div
        style={{
          opacity: headOpacity,
          transform: `translateY(${headY}px)`,
          fontFamily,
          fontSize: 40,
          fontWeight: 800,
          color: colors.text,
          marginBottom: 8,
        }}
      >
        {heading}
      </div>
      <div style={{ maxWidth: 1000, width: "100%" }}>
        <AccentBox
          body={takeaway}
          variant={accentVariant}
          delay={12}
          fontFamily={fontFamily}
        />
      </div>
    </AbsoluteFill>
  );
};
