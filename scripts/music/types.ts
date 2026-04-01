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
