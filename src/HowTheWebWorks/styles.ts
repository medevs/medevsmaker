import { loadFont } from "@remotion/google-fonts/Inter";
import { loadFont as loadCodeFont } from "@remotion/google-fonts/JetBrainsMono";

const { fontFamily: mainFont } = loadFont("normal", {
  weights: ["400", "700", "800"],
  subsets: ["latin"],
});

const { fontFamily: codeFont } = loadCodeFont("normal", {
  weights: ["400"],
  subsets: ["latin"],
});

export const FONTS = {
  main: mainFont,
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
  pink: "#ec4899",
} as const;

export const FPS = 30;

// Transition frame counts
export const T_FADE = 15;
export const T_SLIDE = 20;
export const T_WIPE = 18;

// Section duration constants (frames)
// Section 1: Hook(5) + Title(8) + SectionTitle(3) + Concept(7) + Diagram(10) + Metaphor(6) + Takeaway(5) = 44s
// 6 transitions: fade + fade + slide + fade + fade + fade = 15+15+20+15+15+15 = 95
export const SECTION_1_FRAMES = 44 * FPS - 95; // 1225

// Section 2: SectionTitle(3) + Concept(7) + Steps(8) + Metaphor(6) + Takeaway(5) = 29s
// 4 transitions: slide + fade + fade + fade = 20+15+15+15 = 65
export const SECTION_2_FRAMES = 29 * FPS - 65; // 805

// Section 3: SectionTitle(3) + Concept(7) + Comparison(8) + Code(10) + Stat(5) + Takeaway(5) = 38s
// 5 transitions: slide + fade + wipe + fade + fade = 20+15+18+15+15 = 83
export const SECTION_3_FRAMES = 38 * FPS - 83; // 1057

// Section 4: SectionTitle(3) + Diagram(10) + BeforeAfter(8) + Warning(6) + Takeaway(5) = 32s
// 4 transitions: slide + fade + fade + fade = 20+15+15+15 = 65
export const SECTION_4_FRAMES = 32 * FPS - 65; // 895

// Section 5: SectionTitle(3) + Timeline(10) + Concept(7) + Chart(8) + Takeaway(5) = 33s
// 4 transitions: slide + fade + fade + fade = 20+15+15+15 = 65
export const SECTION_5_FRAMES = 33 * FPS - 65; // 925

// Section 6: Summary(10) + EndScreen(5) = 15s
// 1 transition: fade = 15
export const SECTION_6_FRAMES = 15 * FPS - 15; // 435

export const TOTAL_FRAMES =
  SECTION_1_FRAMES +
  SECTION_2_FRAMES +
  SECTION_3_FRAMES +
  SECTION_4_FRAMES +
  SECTION_5_FRAMES +
  SECTION_6_FRAMES; // 5342

export const TOTAL_SECTIONS = 6;
