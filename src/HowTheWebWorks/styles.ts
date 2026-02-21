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
export const T = 15; // transition frames

// ─── Section Duration Calculations ──────────────────────────────
// Formula: sum(scene durations in seconds) * FPS - numTransitions * T

// Section 1: Hook(5) + Title(8) + SectionTitle(3) + Concept(8) + Steps(8) + Metaphor(6) + Takeaway(5) = 43s
// 6 transitions => 43*30 - 6*15 = 1290 - 90 = 1200
export const SECTION_1_FRAMES = 1200;

// Section 2: SectionTitle(3) + Concept(7) + Diagram(10) + Stat(5) + Metaphor(6) + Takeaway(5) = 36s
// 5 transitions => 36*30 - 5*15 = 1080 - 75 = 1005
export const SECTION_2_FRAMES = 1005;

// Section 3: SectionTitle(3) + Concept(7) + Diagram(10) + Code(12) + Bullets(7) + Takeaway(5) = 44s
// 5 transitions => 44*30 - 5*15 = 1320 - 75 = 1245
export const SECTION_3_FRAMES = 1245;

// Section 4: SectionTitle(3) + Concept(7) + Comparison(8) + Warning(6) + Metaphor(6) + Takeaway(5) = 35s
// 5 transitions => 35*30 - 5*15 = 1050 - 75 = 975
export const SECTION_4_FRAMES = 975;

// Section 5: SectionTitle(3) + Diagram(12) + Bullets(8) + Summary(10) + Outro(5) = 38s
// 4 transitions => 38*30 - 4*15 = 1140 - 60 = 1080
export const SECTION_5_FRAMES = 1080;

// Total = 1200 + 1005 + 1245 + 975 + 1080 = 5505 frames = 183.5s
export const TOTAL_FRAMES = 5505;
export const TOTAL_SECTIONS = 5;
