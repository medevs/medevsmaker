import React from "react";
import { AbsoluteFill } from "remotion";
import { useLayoutMode } from "../formats";

type SafeZoneOverlayProps = {
  /** Show the overlay — toggle in Remotion Studio for debugging */
  visible?: boolean;
};

/**
 * SafeZoneOverlay — dev tool that shows platform-safe content zones.
 * Renders semi-transparent colored borders showing where platform UI
 * (status bar, comments, CTA buttons) will cover content.
 *
 * Add to any composition for visual debugging:
 *   <SafeZoneOverlay visible={true} />
 *
 * Only meaningful for portrait (9:16) compositions.
 */
export const SafeZoneOverlay: React.FC<SafeZoneOverlayProps> = ({
  visible = false,
}) => {
  const { isVertical, safeZone } = useLayoutMode();

  if (!visible || !isVertical) return null;

  const dangerColor = "rgba(255, 0, 0, 0.15)";
  const borderColor = "rgba(255, 0, 0, 0.4)";

  return (
    <AbsoluteFill style={{ pointerEvents: "none", zIndex: 9999 }}>
      {/* Top danger zone */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: safeZone.top,
          backgroundColor: dangerColor,
          borderBottom: `2px dashed ${borderColor}`,
        }}
      />
      {/* Bottom danger zone */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: safeZone.bottom,
          backgroundColor: dangerColor,
          borderTop: `2px dashed ${borderColor}`,
        }}
      />
      {/* Left danger zone */}
      <div
        style={{
          position: "absolute",
          top: safeZone.top,
          bottom: safeZone.bottom,
          left: 0,
          width: safeZone.left,
          backgroundColor: dangerColor,
          borderRight: `2px dashed ${borderColor}`,
        }}
      />
      {/* Right danger zone */}
      <div
        style={{
          position: "absolute",
          top: safeZone.top,
          bottom: safeZone.bottom,
          right: 0,
          width: safeZone.right,
          backgroundColor: dangerColor,
          borderLeft: `2px dashed ${borderColor}`,
        }}
      />
      {/* Labels */}
      <div
        style={{
          position: "absolute",
          top: safeZone.top / 2 - 8,
          left: "50%",
          transform: "translateX(-50%)",
          fontSize: 14,
          fontFamily: "monospace",
          color: "rgba(255, 100, 100, 0.8)",
          fontWeight: 700,
        }}
      >
        STATUS BAR + USERNAME ({safeZone.top}px)
      </div>
      <div
        style={{
          position: "absolute",
          bottom: safeZone.bottom / 2 - 8,
          left: "50%",
          transform: "translateX(-50%)",
          fontSize: 14,
          fontFamily: "monospace",
          color: "rgba(255, 100, 100, 0.8)",
          fontWeight: 700,
        }}
      >
        COMMENTS + CTA ({safeZone.bottom}px)
      </div>
    </AbsoluteFill>
  );
};
