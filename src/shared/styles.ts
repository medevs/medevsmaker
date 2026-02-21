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
 * Shadow presets for depth and glow effects.
 */
export const SHADOWS = {
  sm: "0 2px 8px rgba(0, 0, 0, 0.3)",
  md: "0 4px 16px rgba(0, 0, 0, 0.4)",
  lg: "0 8px 32px rgba(0, 0, 0, 0.5)",
  glow: (color: string) => `0 0 20px ${color}66, 0 0 40px ${color}33`,
  glowStrong: (color: string) =>
    `0 0 20px ${color}88, 0 0 40px ${color}55, 0 0 60px ${color}33`,
} as const;

/**
 * Gradient utility functions.
 */
export const GRADIENTS = {
  /** CSS background for gradient text (use with backgroundClip + textFillColor) */
  textGradient: (from: string, to: string) =>
    `linear-gradient(135deg, ${from}, ${to})`,
  /** Radial glow overlay */
  radialGlow: (color: string) =>
    `radial-gradient(circle at 50% 50%, ${color}22 0%, transparent 70%)`,
  /** Subtle gradient for cards */
  cardGradient: (color: string) =>
    `linear-gradient(135deg, ${color}15 0%, ${color}05 100%)`,
} as const;

/**
 * Default timing constants for educational videos.
 */
export const SCENE_DEFAULTS = {
  transitionFrames: 15,
  transitionSlide: 20,
  transitionWipe: 18,
  staggerDelay: 8,
  elementEntry: 20,
  springSmooth: { damping: 200 } as const,
  springSnappy: { damping: 20, stiffness: 200 } as const,
  springBouncy: { damping: 8 } as const,
  springHeavy: { damping: 15, stiffness: 80, mass: 2 } as const,
  springGentle: { damping: 30, stiffness: 120 } as const,
} as const;
