import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
} from "remotion";
import { BRAND, SCENE_DEFAULTS } from "../styles";
import { ColorBorderCard } from "../components/ColorBorderCard";
import { PillBadge } from "../components/PillBadge";
import { FeatureCounter } from "../components/FeatureCounter";

type FeatureIntroProps = {
  heading: string;
  definition: string;
  badge?: string;
  icon?: string;
  breadcrumb?: { current: number; total: number; label: string };
  pills?: { label: string; color?: string }[];
  sectionColor?: string;
  colors?: { bg: string; text: string; muted: string };
  fontFamily?: string;
};

export const FeatureIntro: React.FC<FeatureIntroProps> = ({
  heading,
  definition,
  badge,
  icon,
  breadcrumb,
  pills,
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
        padding: "80px 100px",
      }}
    >
      {breadcrumb && (
        <FeatureCounter
          current={breadcrumb.current}
          total={breadcrumb.total}
          label={breadcrumb.label}
          color={sectionColor}
          variant="counter"
        />
      )}

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          gap: 28,
          maxWidth: "65%",
          height: "100%",
          paddingTop: breadcrumb ? 40 : 0,
        }}
      >
        <div
          style={{
            opacity: headOpacity,
            transform: `translateY(${headY}px)`,
            fontFamily,
            fontSize: 52,
            fontWeight: 800,
            color: colors.text,
            lineHeight: 1.2,
          }}
        >
          {heading}
        </div>

        <ColorBorderCard
          color={sectionColor}
          title={badge ? undefined : undefined}
          badge={badge}
          icon={icon}
          delay={SCENE_DEFAULTS.elementEntrySlow}
          fontFamily={fontFamily}
        >
          <div
            style={{
              fontFamily,
              fontSize: 26,
              color: colors.text,
              lineHeight: 1.5,
            }}
          >
            {definition}
          </div>
        </ColorBorderCard>

        {pills && pills.length > 0 && (
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            {pills.map((pill, i) => (
              <PillBadge
                key={i}
                label={pill.label}
                color={pill.color || sectionColor}
                delay={SCENE_DEFAULTS.elementEntrySlow + 10 + i * 8}
              />
            ))}
          </div>
        )}
      </div>
    </AbsoluteFill>
  );
};
