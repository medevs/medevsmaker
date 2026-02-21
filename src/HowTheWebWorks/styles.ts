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

// Section 1: Hook(5) + Title(8) + SectionTitle(3) + Concept(8) + Steps(8) + Metaphor(6) + Takeaway(5) = 43s
// 6 transitions: fade(15) + slide(20) + fade(15) + fade(15) + slide(20) + fade(15) = 100
// 43*30 - 100 = 1190
export const SECTION_1_FRAMES = 1190;

// Section 2: SectionTitle(3) + Concept(7) + Diagram(10) + Stat(5) + Metaphor(6) + Takeaway(5) = 36s
// 5 transitions: fade(15) + fade(15) + wipe(18) + fade(15) + fade(15) = 78
// 36*30 - 78 = 1002
export const SECTION_2_FRAMES = 1002;

// Section 3: SectionTitle(3) + Concept(7) + Diagram(10) + Code(12) + Bullets(7) + Takeaway(5) = 44s
// 5 transitions: slide(20) + fade(15) + fade(15) + slide(20) + fade(15) = 85
// 44*30 - 85 = 1235
export const SECTION_3_FRAMES = 1235;

// Section 4: SectionTitle(3) + Concept(7) + Comparison(8) + Warning(6) + Metaphor(6) + Takeaway(5) = 35s
// 5 transitions: fade(15) + wipe(18) + fade(15) + fade(15) + fade(15) = 78
// 35*30 - 78 = 972
export const SECTION_4_FRAMES = 972;

// Section 5: SectionTitle(3) + Diagram(12) + Bullets(8) + Summary(10) + EndScreen(5) = 38s
// 4 transitions: fade(15) + slide(20) + fade(15) + fade(15) = 65
// 38*30 - 65 = 1075
export const SECTION_5_FRAMES = 1075;

// Total = 1190 + 1002 + 1235 + 972 + 1075 = 5474 frames = ~182.5s
export const TOTAL_FRAMES = 5474;
export const TOTAL_SECTIONS = 5;
