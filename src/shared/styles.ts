/**
 * Base design tokens template.
 * Each video's styles.ts extends these with its own palette.
 */
export const baseTokens = {
  fontSizes: {
    xs: 20,
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
 * Amber-first identity: primary #c8956c, brand mark #c07830
 */
export const BRAND = {
  // Primary amber palette
  indigo: "#c07830",     // Brand mark amber (primary CTA, logos, high-definition)
  violet: "#a87040",     // Amber dark (depth, secondary accent)
  cyan: "#ddb896",       // Amber light (softer accents, info tints)
  amber: "#c8956c",      // Main brand amber (versatile, integrated)
  amberBrand: "#c07830", // Explicit brand mark variant
  amberLight: "#ddb896", // Explicit light variant
  amberDark: "#a87040",  // Explicit dark variant
  amberGlow: "#c8956c40", // Transparent for glow effects

  // Semantic colors
  green: "#10b981",
  red: "#ef4444",

  // Backgrounds & surfaces
  bg: "#060606",         // Nearly pure black, dark-first
  bgLight: "#111111",    // Warm dark for alternation/depth
  surface: "#faf8f5",    // Light surface for contrast sections
  text: "#f5f3f0",       // Warm off-white
  textDark: "#1a1715",   // Dark ink for light backgrounds
  textMuted: "#6b6560",  // Warm muted gray

  // Code & cards
  codeBg: "#0d0d0d",     // Very dark warm code background
  cardBg: "#141414",     // Elevated surface (oklch(0.08 0 0))
  border: "rgba(255, 255, 255, 0.08)", // Subtle light border
} as const;

/** Standard scene color overrides — every scene should accept this. */
export type SceneColors = {
  bg: string;
  text: string;
  accent?: string;
  muted?: string;
};

/** Default scene colors derived from BRAND. */
export const DEFAULT_SCENE_COLORS: Required<SceneColors> = {
  bg: BRAND.bg,
  text: BRAND.text,
  accent: BRAND.amber,
  muted: BRAND.textMuted,
};

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
  deepGlow: (color: string) =>
    `0 0 10px ${color}aa, 0 0 30px ${color}66, 0 0 80px ${color}22`,
  amberGlow: "0 0 40px rgba(200,149,108,0.15), 0 0 80px rgba(200,149,108,0.05)",
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
  /** Aurora-style multi-color background (pass 3-4 brand colors) */
  aurora: (colors: string[]) =>
    colors
      .map(
        (c, i) =>
          `radial-gradient(ellipse at ${20 + i * 25}% ${30 + ((i * 20) % 50)}%, ${c}44 0%, transparent 60%)`
      )
      .join(", ") + `, linear-gradient(135deg, ${BRAND.bg}, ${BRAND.bgLight})`,
  /** Brand amber gradient for premium text & overlays */
  brandGradient: () =>
    `linear-gradient(135deg, ${BRAND.amberLight}, ${BRAND.amber}, ${BRAND.amberDark})`,
} as const;

/**
 * Default timing constants for educational videos.
 */
export const SCENE_DEFAULTS = {
  transitionFrames: 15,
  transitionSlide: 20,
  transitionWipe: 18,
  staggerDelay: 8,
  staggerDelaySlow: 14,
  elementEntry: 20,
  elementEntrySlow: 28,
  springSmooth: { damping: 200 } as const,
  springSilky: { damping: 200, stiffness: 90 } as const,
  springSnappy: { damping: 20, stiffness: 200 } as const,
  springBouncy: { damping: 8 } as const,
  springHeavy: { damping: 15, stiffness: 80, mass: 2 } as const,
  springGentle: { damping: 30, stiffness: 120 } as const,
} as const;

/**
 * Per-section color theming — cycles through brand palette colors.
 * Use SECTION_THEMES.get(index) to get a color for any section index.
 */
export const SECTION_THEMES = {
  colors: [
    BRAND.amber,         // Warm amber primary
    BRAND.amberBrand,    // Brand amber (high definition)
    BRAND.amberLight,    // Light amber
    BRAND.amberDark,     // Dark amber
    BRAND.green,         // Green for contrast
    BRAND.red,           // Red for emphasis
  ] as readonly string[],
  get(index: number): string {
    return this.colors[index % this.colors.length];
  },
} as const;

/**
 * Card design tokens — consistent card styling across components.
 */
export const CARD = {
  bg: "rgba(255, 255, 255, 0.04)",
  border: "rgba(255, 255, 255, 0.08)",
  radius: 14,
  borderWidth: 3,
  padding: {
    sm: "16px 20px",
    md: "24px 28px",
    lg: "32px 36px",
  },
} as const;

/**
 * Monospace typography tokens — for badges, labels, and technical text.
 */
export const MONO = {
  fontFamily: "JetBrains Mono, monospace",
  letterSpacing: 1.5,
  textTransform: "uppercase" as const,
} as const;

/**
 * Glass morphism tokens — frosted glass card styling.
 */
export const GLASS = {
  bg: "rgba(255, 255, 255, 0.05)",
  border: "rgba(255, 255, 255, 0.1)",
  blur: 12,
  radius: 20,
  borderWidth: 1,
} as const;

/**
 * Scene background alternation — creates visual rhythm by alternating
 * dark/light backgrounds on odd/even scene indices.
 */
export const SCENE_ALTERNATION = {
  dark: BRAND.bg,
  light: "#0d0d0d",
  get(index: number): string {
    return index % 2 === 0 ? this.dark : this.light;
  },
} as const;
