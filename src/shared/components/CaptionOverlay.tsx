import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
} from "remotion";
import {
  createTikTokStyleCaptions,
  type Caption,
  type TikTokPage,
  type TikTokToken,
} from "@remotion/captions";
import { BRAND, SCENE_DEFAULTS } from "../styles";
import { useLayoutMode } from "../formats";

type CaptionStyle = "minimal" | "bold" | "karaoke" | "pop" | "highlight";

type CaptionOverlayProps = {
  captions: Caption[];
  style?: CaptionStyle;
  accentColor?: string;
  /** Milliseconds to group words together (lower = more word-by-word) */
  combineMs?: number;
  fontFamily?: string;
  /** Toggle caption visibility without unmounting */
  visible?: boolean;
};

export const CaptionOverlay: React.FC<CaptionOverlayProps> = ({
  captions,
  style: captionStyle,
  accentColor = BRAND.cyan,
  combineMs,
  fontFamily = "Inter",
  visible = true,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { isVertical, fontScale } = useLayoutMode();
  const currentTimeMs = (frame / fps) * 1000;

  // Vertical defaults: bold style, more word-by-word grouping
  const effectiveStyle = captionStyle ?? (isVertical ? "bold" : "minimal");
  const effectiveCombineMs = combineMs ?? (isVertical ? 400 : 800);

  const { pages } = createTikTokStyleCaptions({
    captions,
    combineTokensWithinMilliseconds: effectiveCombineMs,
  });

  if (!visible) return null;

  // Find the current page
  const currentPage = pages.find(
    (p) =>
      currentTimeMs >= p.startMs &&
      currentTimeMs < p.startMs + p.durationMs
  );

  if (!currentPage) return null;

  const isMinimal = effectiveStyle === "minimal";
  const isBold = effectiveStyle === "bold";
  const isKaraoke = effectiveStyle === "karaoke";
  const isPop = effectiveStyle === "pop";
  const isHighlight = effectiveStyle === "highlight";

  const baseFontSize = isMinimal ? 32 : isBold ? 52 : isPop ? 44 : 40;
  const fontSize = Math.round(baseFontSize * (isVertical ? 1.3 : 1));
  // Portrait: position above 350px bottom safe zone
  const bottom = isMinimal
    ? (isVertical ? 380 : 140)
    : isBold
      ? "45%"
      : (isVertical ? 380 : 160);

  return (
    <AbsoluteFill
      style={{
        justifyContent: isBold ? "center" : "flex-end",
        alignItems: "center",
        pointerEvents: "none",
        zIndex: 100,
      }}
    >
      <div
        style={{
          position: isBold ? "relative" : "absolute",
          bottom: isBold ? undefined : bottom,
          maxWidth: isVertical ? 900 : (isMinimal ? 900 : 1100),
          textAlign: "center",
          padding: "12px 24px",
          borderRadius: 12,
          backgroundColor: isMinimal ? "rgba(0, 0, 0, 0.6)" : "transparent",
        }}
      >
        <div
          style={{
            fontFamily,
            fontSize,
            fontWeight: isBold || isPop ? 900 : 700,
            lineHeight: 1.4,
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
            gap: "0 8px",
          }}
        >
          {currentPage.tokens.map((token, i) => {
            const isActive =
              currentTimeMs >= token.fromMs && currentTimeMs < token.toMs;
            const isPast = currentTimeMs >= token.toMs;

            let wordColor: string = BRAND.text;
            let wordScale = 1;
            let wordOpacity = 1;
            let bgColor = "transparent";
            let padding = "0";
            let borderRadius = "0";

            if (isKaraoke) {
              wordColor = isActive ? accentColor : isPast ? BRAND.text : BRAND.textMuted;
              wordScale = isActive ? 1.1 : 1;
              wordOpacity = isActive ? 1 : isPast ? 0.9 : 0.5;
            } else if (isBold) {
              wordColor = isActive ? accentColor : BRAND.text;
              wordScale = isActive ? 1.05 : 1;
            } else if (isPop) {
              // Pop: bouncy scale on active word using spring from word start
              wordColor = isActive ? accentColor : BRAND.text;
              const wordStartFrame = Math.round((token.fromMs / 1000) * fps);
              const popProgress = isActive
                ? spring({ frame: frame - wordStartFrame, fps, config: { damping: 8, stiffness: 200 }, durationInFrames: 10 })
                : 0;
              wordScale = isActive ? 1 + popProgress * 0.3 : isPast ? 1 : 0.95;
              wordOpacity = isActive ? 1 : isPast ? 0.8 : 0.5;
            } else if (isHighlight) {
              // Highlight: colored background bar behind active word
              wordColor = isActive ? "#000000" : BRAND.text;
              bgColor = isActive ? accentColor : "transparent";
              padding = "2px 6px";
              borderRadius = "4px";
              wordOpacity = isActive ? 1 : isPast ? 0.9 : 0.5;
            } else {
              wordColor = isActive ? accentColor : BRAND.text;
            }

            return (
              <span
                key={i}
                style={{
                  color: wordColor,
                  transform: `scale(${wordScale})`,
                  opacity: wordOpacity,
                  display: "inline-block",
                  backgroundColor: bgColor,
                  padding,
                  borderRadius,
                  textShadow: isActive && !isHighlight
                    ? `0 0 20px ${accentColor}66`
                    : isBold
                      ? "0 2px 8px rgba(0,0,0,0.5)"
                      : "none",
                }}
              >
                {token.text}
              </span>
            );
          })}
        </div>
      </div>
    </AbsoluteFill>
  );
};
