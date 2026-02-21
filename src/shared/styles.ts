/**
 * Base design tokens template.
 * Each video's styles.ts extends these with its own palette.
 */
export const baseTokens = {
  fontSizes: {
    xs: 18,
    sm: 24,
    md: 36,
    lg: 48,
    xl: 64,
    xxl: 80,
  },
  spacing: {
    xs: 8,
    sm: 16,
    md: 24,
    lg: 32,
    xl: 48,
    xxl: 64,
  },
  borderRadius: {
    sm: 8,
    md: 12,
    lg: 16,
    xl: 24,
    full: 9999,
  },
};

/**
 * medevsmaker brand palette — used across all educational videos.
 */
export const BRAND = {
  indigo: "#6366f1",
  violet: "#8b5cf6",
  cyan: "#06b6d4",
  amber: "#f59e0b",
  green: "#10b981",
  red: "#ef4444",
  bg: "#0f0f1a",
  bgLight: "#1a1a2e",
  text: "#f8fafc",
  textMuted: "#94a3b8",
  codeBg: "#1e1e2e",
  cardBg: "#1e1e30",
  border: "#2e2e44",
} as const;

/**
 * Default timing constants for educational videos.
 */
export const SCENE_DEFAULTS = {
  transitionFrames: 15,
  staggerDelay: 8,
  elementEntry: 20,
  springSmooth: { damping: 200 } as const,
  springSnappy: { damping: 20, stiffness: 200 } as const,
} as const;
