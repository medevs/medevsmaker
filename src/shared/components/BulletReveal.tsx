import React from "react";
import {
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
} from "remotion";
import { BRAND, SCENE_DEFAULTS } from "../styles";

type BulletItem = {
  text: string;
  icon?: string;
};

type BulletRevealProps = {
  items: BulletItem[];
  delay?: number;
  stagger?: number;
  bulletColor?: string;
  fontSize?: number;
  fontFamily?: string;
  style?: "dot" | "check" | "arrow" | "number";
};

const BULLET_CHARS: Record<string, string> = {
  dot: "\u2022",
  check: "\u2713",
  arrow: "\u2192",
  number: "",
};

export const BulletReveal: React.FC<BulletRevealProps> = ({
  items,
  delay = 0,
  stagger = SCENE_DEFAULTS.staggerDelay,
  bulletColor = BRAND.cyan,
  fontSize = 32,
  fontFamily = "Inter",
  style = "dot",
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      {items.map((item, i) => {
        const itemDelay = delay + i * stagger;
        const progress = spring({
          frame: frame - itemDelay,
          fps,
          config: SCENE_DEFAULTS.springSmooth,
        });
        const opacity = interpolate(progress, [0, 1], [0, 1], {
          extrapolateRight: "clamp",
        });
        const x = interpolate(progress, [0, 1], [-30, 0], {
          extrapolateRight: "clamp",
        });

        const bullet =
          style === "number"
            ? `${i + 1}.`
            : item.icon || BULLET_CHARS[style];

        return (
          <div
            key={i}
            style={{
              opacity,
              transform: `translateX(${x}px)`,
              display: "flex",
              alignItems: "center",
              gap: 16,
            }}
          >
            <span
              style={{
                fontFamily,
                fontSize: fontSize - 4,
                color: bulletColor,
                fontWeight: 700,
                minWidth: 28,
                flexShrink: 0,
              }}
            >
              {bullet}
            </span>
            <span
              style={{
                fontFamily,
                fontSize,
                color: BRAND.text,
                lineHeight: 1.4,
              }}
            >
              {item.text}
            </span>
          </div>
        );
      })}
    </div>
  );
};
