// ─── Music Generation Types ─────────────────────────────────

export type MusicConfig = {
  src: string;
  durationInFrames: number;
  volume: number;
  duckVolume: number;
  fadeInFrames: number;
  fadeOutFrames: number;
  duckRampFrames: number;
  loop: boolean;
};

export type MusicPrompt = {
  /** Combined mood description derived from script.json section tones */
  mood: string;
  /** Music genre/style (e.g., "ambient electronic", "lo-fi beats") */
  genre: string;
  /** Target duration in seconds */
  durationSeconds: number;
  /** Always true for background music */
  instrumental: boolean;
};

// ─── Mood Mapping ──────────────────────────────────────────
// Maps common script section tones to music descriptors.

export const TONE_TO_GENRE: Record<string, string> = {
  "energetic": "upbeat electronic",
  "exciting": "upbeat electronic",
  "intense": "driving electronic",
  "calm": "ambient lo-fi",
  "analytical": "minimal ambient",
  "curious": "light electronic",
  "warm": "soft ambient",
  "dramatic": "cinematic orchestral",
  "playful": "bouncy lo-fi",
  "serious": "dark ambient",
  "inspiring": "uplifting electronic",
  "suspenseful": "tension ambient",
  "reflective": "mellow piano ambient",
  "futuristic": "synthwave electronic",
  "technical": "minimal tech house",
};

export const DEFAULT_GENRE = "ambient electronic";

/**
 * Extract a music genre from an array of section tones.
 * Picks the most common matching genre, falls back to default.
 */
export function genreFromTones(tones: string[]): string {
  const genreCounts = new Map<string, number>();

  for (const tone of tones) {
    const lower = tone.toLowerCase();
    for (const [keyword, genre] of Object.entries(TONE_TO_GENRE)) {
      if (lower.includes(keyword)) {
        genreCounts.set(genre, (genreCounts.get(genre) ?? 0) + 1);
      }
    }
  }

  if (genreCounts.size === 0) return DEFAULT_GENRE;

  // Return the most common genre
  let bestGenre = DEFAULT_GENRE;
  let bestCount = 0;
  for (const [genre, count] of genreCounts) {
    if (count > bestCount) {
      bestGenre = genre;
      bestCount = count;
    }
  }
  return bestGenre;
}

// ─── Breathing Music Types ────────────────────────────────

export type BreathingMusicConfig = {
  src: string;
  durationInFrames: number;
  narrationVolume: number;
  gapVolume: number;
  transitionVolume: number;
  hookVolume: number;
  outroVolume: number;
  hookFrames: number;
  outroFrames: number;
  transitionFrames: number;
  rampFrames: number;
  fadeInFrames: number;
  fadeOutFrames: number;
  sectionStarts: number[];
  loop: boolean;
};

// ─── Strategic Music Types ────────────────────────────────

export type MusicSegmentRole =
  | "hook"        // First section intro (moderate volume, ~15s)
  | "transition"  // Section boundary swell (3-5s)
  | "accent"      // Brief emphasis on key stats/comparisons (1-2s)
  | "outro";      // End card / CTA (last section)

export type MusicSegment = {
  /** Unique label for Remotion Sequence name (e.g., "hook", "transition-s2") */
  label: string;
  /** Segment role — drives default volume/duration heuristics */
  role: MusicSegmentRole;
  /** Absolute start frame in the composition */
  fromFrame: number;
  /** Duration in frames */
  durationInFrames: number;
  /** Peak volume for this segment (0-1) */
  volume: number;
  /** Fade-in duration in frames */
  fadeInFrames: number;
  /** Fade-out duration in frames */
  fadeOutFrames: number;
};

export type StrategicMusicConfig = {
  /** Path relative to public/ (same MP3 as BackgroundMusicLayer) */
  src: string;
  /** Array of discrete music windows */
  segments: MusicSegment[];
};
