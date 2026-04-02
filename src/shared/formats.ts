import { useVideoConfig } from "remotion";

/**
 * Format presets for multi-format video rendering.
 */
export const FORMAT_PRESETS = {
  landscape: { width: 1920, height: 1080, fps: 30 },
  portrait: { width: 1080, height: 1920, fps: 30 },
  square: { width: 1080, height: 1080, fps: 30 },
} as const;

export type FormatName = keyof typeof FORMAT_PRESETS;

/**
 * Platform-safe content zones.
 * Portrait safe zones account for YouTube Shorts / TikTok / Reels UI overlays:
 *   top: username + status bar, bottom: comments + CTA + description
 */
export const SAFE_ZONES = {
  landscape: { top: 0, bottom: 0, left: 0, right: 0 },
  portrait: { top: 160, bottom: 350, left: 60, right: 60 },
  square: { top: 0, bottom: 0, left: 0, right: 0 },
} as const;

/**
 * Detect format name from video dimensions.
 */
export const getFormatFromDimensions = (
  width: number,
  height: number
): FormatName => {
  if (height > width) return "portrait";
  if (width === height) return "square";
  return "landscape";
};

/**
 * Layout mode computed from current video config.
 * Provides responsive tokens that scenes and components use to adapt layout.
 */
type LayoutMode = {
  format: FormatName;
  isVertical: boolean;
  isSquare: boolean;
  /** CSS padding string respecting safe zones */
  contentPadding: string;
  /** Safe zone values in px */
  safeZone: (typeof SAFE_ZONES)[FormatName];
  /** Multiplier for font sizes (1.0 landscape, 1.3 portrait) */
  fontScale: number;
  /** Max items to show in lists/grids (fewer for vertical) */
  maxItems: number;
  /** Flex direction for multi-column layouts */
  layoutDirection: "row" | "column";
};

/**
 * React hook that returns responsive layout tokens based on current composition dimensions.
 * Use in any scene or component that needs to adapt between landscape and portrait.
 *
 * @example
 * const { isVertical, contentPadding, fontScale, layoutDirection } = useLayoutMode();
 */
export const useLayoutMode = (): LayoutMode => {
  const { width, height } = useVideoConfig();
  const format = getFormatFromDimensions(width, height);
  const isVertical = format === "portrait";
  const isSquare = format === "square";
  const safeZone = SAFE_ZONES[format];

  return {
    format,
    isVertical,
    isSquare,
    contentPadding: isVertical
      ? `${safeZone.top}px ${safeZone.right}px ${safeZone.bottom}px ${safeZone.left}px`
      : "80px",
    safeZone,
    fontScale: isVertical ? 1.3 : 1.0,
    maxItems: isVertical ? 3 : 6,
    layoutDirection: isVertical ? "column" : "row",
  };
};
