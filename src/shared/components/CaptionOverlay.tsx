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

type CaptionStyle = "minimal" | "bold" | "karaoke";

type CaptionOverlayProps = {
  captions: Caption[];
  style?: CaptionStyle;
  accentColor?: string;
  /** Milliseconds to group words together (lower = more word-by-word) */
  combineMs?: number;
  fontFamily?: string;
};

export const CaptionOverlay: React.FC<CaptionOverlayProps> = ({
  captions,
  style: captionStyle = "minimal",
  accentColor = BRAND.cyan,
  combineMs = 800,
  fontFamily = "Inter",
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const currentTimeMs = (frame / fps) * 1000;

  const { pages } = createTikTokStyleCaptions({
    captions,
    combineTokensWithinMilliseconds: combineMs,
  });

  // Find the current page
  const currentPage = pages.find(
    (p) =>
      currentTimeMs >= p.startMs &&
      currentTimeMs < p.startMs + p.durationMs
  );

  if (!currentPage) return null;

  const isMinimal = captionStyle === "minimal";
  const isBold = captionStyle === "bold";
  const isKaraoke = captionStyle === "karaoke";

  const fontSize = isMinimal ? 32 : isBold ? 52 : 40;
  const bottom = isMinimal ? 140 : isBold ? "45%" : 160;

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
          maxWidth: isMinimal ? 900 : 1100,
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
            fontWeight: isBold ? 900 : 700,
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

            let wordColor = BRAND.text;
            let wordScale = 1;
            let wordOpacity = 1;

            if (isKaraoke) {
              wordColor = isActive ? accentColor : isPast ? BRAND.text : BRAND.textMuted;
              wordScale = isActive ? 1.1 : 1;
              wordOpacity = isActive ? 1 : isPast ? 0.9 : 0.5;
            } else if (isBold) {
              wordColor = isActive ? accentColor : BRAND.text;
              wordScale = isActive ? 1.05 : 1;
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
                  textShadow: isActive
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
