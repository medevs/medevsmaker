import React from "react";
import { AbsoluteFill, Img } from "remotion";
import { BRAND } from "../styles";

type TextPosition = "bottom-left" | "bottom-right" | "center" | "top-left";

type ThumbnailProps = {
  backgroundImage?: string;
  textOverlay: string;
  textPosition?: TextPosition;
  textColor?: string;
  strokeColor?: string;
  strokeWidth?: number;
  accentColor?: string;
  channelBadge?: boolean;
};

const positionStyles: Record<TextPosition, React.CSSProperties> = {
  "bottom-left": {
    bottom: 80,
    left: 80,
    textAlign: "left" as const,
  },
  "bottom-right": {
    bottom: 80,
    right: 80,
    textAlign: "right" as const,
  },
  center: {
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    textAlign: "center" as const,
  },
  "top-left": {
    top: 80,
    left: 80,
    textAlign: "left" as const,
  },
};

export const Thumbnail: React.FC<ThumbnailProps> = ({
  backgroundImage,
  textOverlay,
  textPosition = "bottom-left",
  textColor = "#FFFFFF",
  strokeColor = "#000000",
  strokeWidth = 4,
  accentColor = BRAND.indigo,
  channelBadge = true,
}) => {
  const textStyle: React.CSSProperties = {
    position: "absolute",
    ...positionStyles[textPosition],
    fontFamily: "Inter, sans-serif",
    fontSize: 120,
    fontWeight: 900,
    lineHeight: 1.1,
    color: textColor,
    textTransform: "uppercase" as const,
    letterSpacing: -2,
    maxWidth: 1400,
    WebkitTextStroke: `${strokeWidth}px ${strokeColor}`,
    paintOrder: "stroke fill",
    textShadow: `0 4px 30px rgba(0, 0, 0, 0.8), 0 0 60px ${accentColor}66`,
  };

  return (
    <AbsoluteFill
      style={{
        backgroundColor: BRAND.bg,
        overflow: "hidden",
      }}
    >
      {/* Background image */}
      {backgroundImage && (
        <AbsoluteFill>
          <Img
            src={backgroundImage}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
          />
          {/* Dark gradient overlay for text readability */}
          <AbsoluteFill
            style={{
              background:
                "linear-gradient(180deg, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.6) 100%)",
            }}
          />
        </AbsoluteFill>
      )}

      {/* Accent bar (left edge) */}
      <div
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          width: 8,
          height: "100%",
          backgroundColor: accentColor,
          boxShadow: `0 0 30px ${accentColor}88`,
        }}
      />

      {/* Text overlay */}
      <div style={textStyle}>{textOverlay}</div>

      {/* Channel badge */}
      {channelBadge && (
        <div
          style={{
            position: "absolute",
            top: 40,
            right: 40,
            fontFamily: "Inter, sans-serif",
            fontSize: 28,
            fontWeight: 700,
            color: BRAND.textMuted,
            letterSpacing: 2,
            textTransform: "uppercase" as const,
            opacity: 0.7,
          }}
        >
          medevsmaker
        </div>
      )}
    </AbsoluteFill>
  );
};
