import { loadFont } from "@remotion/google-fonts/Inter";
import { loadFont as loadCode } from "@remotion/google-fonts/JetBrainsMono";

const { fontFamily: mainFont } = loadFont("normal", {
  weights: ["400", "700", "800"],
  subsets: ["latin"],
});

const { fontFamily: codeFont } = loadCode("normal", {
  weights: ["400"],
  subsets: ["latin"],
});

export const FONTS = {
  heading: mainFont,
  body: mainFont,
  code: codeFont,
} as const;

export const COLORS = {
  bg: "#0f0f1a",
  bgLight: "#1a1a2e",
  text: "#f8fafc",
  muted: "#94a3b8",
  indigo: "#6366f1",
  violet: "#8b5cf6",
  cyan: "#06b6d4",
  amber: "#f59e0b",
  green: "#10b981",
  red: "#ef4444",
} as const;

export const FPS = 30;
export const T = 15; // default transition frames (fade)

// ─── Section Duration Calculations ──────────────────────────────
// Formula: sum(scene durations in seconds) * FPS - sum(transition frame durations)

// Section 1: Hook(5) + Title(8) + SectionTitle(3) + Diagram(10) + Metaphor(6) + Steps(8) + Takeaway(5) = 45s
// 6 transitions: fade(15) + slide(20) + fade(15) + slide(20) + fade(15) + fade(15) = 100
// 45*30 - 100 = 1250
export const SECTION_1_FRAMES = 1250;

// Section 2: SectionTitle(3) + Metaphor(6) + Diagram(10) + Stat(5) + Timeline(10) + Takeaway(5) = 39s
// 5 transitions: fade(15) + slide(20) + wipe(18) + fade(15) + fade(15) = 83
// 39*30 - 83 = 1087
export const SECTION_2_FRAMES = 1087;

// Section 3: SectionTitle(3) + Diagram(10) + Metaphor(6) + Code(12) + DataChart(10) + Takeaway(5) = 46s
// 5 transitions: slide(20) + fade(15) + wipe(18) + slide(20) + fade(15) = 88
// 46*30 - 88 = 1292
export const SECTION_3_FRAMES = 1292;

// Section 4: SectionTitle(3) + BeforeAfter(10) + Comparison(8) + Metaphor(6) + Warning(6) + Takeaway(5) = 38s
// 5 transitions: fade(15) + wipe(18) + fade(15) + slide(20) + fade(15) = 83
// 38*30 - 83 = 1057
export const SECTION_4_FRAMES = 1057;

// Section 5: SectionTitle(3) + Diagram(12) + Stat(5) + Metaphor(6) + Summary(10) + EndScreen(5) = 41s
// 5 transitions: fade(15) + wipe(18) + fade(15) + slide(20) + fade(15) = 83
// 41*30 - 83 = 1147
export const SECTION_5_FRAMES = 1147;

// Total = 1250 + 1087 + 1292 + 1057 + 1147 = 5833 frames = ~194.4s (~3:14)
export const TOTAL_FRAMES = 5833;
export const TOTAL_SECTIONS = 5;
