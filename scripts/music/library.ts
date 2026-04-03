/**
 * Music Library — Curated collection of royalty-free tracks organized by mood.
 *
 * Tracks are stored in public/music/library/ and matched to videos
 * based on script.json section tones via the genreFromTones() mapping.
 *
 * To add a track:
 *   1. Download the MP3 to public/music/library/<id>.mp3
 *   2. Add an entry to MUSIC_LIBRARY below
 *   3. Run: node --experimental-strip-types scripts/music/generate-music.ts <VideoName> --library
 */

import { existsSync } from "node:fs";
import { join } from "node:path";
import { genreFromTones } from "./types.ts";

export type LibraryTrack = {
  /** Filename without extension (matches public/music/library/<id>.mp3) */
  id: string;
  /** Human-readable name */
  name: string;
  /** Mood keywords — matched against TONE_TO_GENRE keys */
  moods: string[];
  /** Genre/style descriptors */
  genre: string;
  /** Approximate duration in seconds (0 = unknown, will loop regardless) */
  durationSeconds: number;
  /** Where to download */
  source: string;
  /** License type */
  license: string;
  /** Whether attribution is required */
  attribution: string | null;
};

// ─── Track Catalog ────────────────────────────────────────────
// Each entry maps to a file at public/music/library/<id>.mp3
// Download instructions are in public/music/library/README.md

export const MUSIC_LIBRARY: LibraryTrack[] = [
  // ── Ambient / Tech ──────────────────────────────────────────
  {
    id: "ambient-tech-01",
    name: "Abstract Future Bass",
    moods: ["curious", "technical", "analytical"],
    genre: "ambient electronic",
    durationSeconds: 180,
    source: "https://pixabay.com/music/ — search 'abstract future bass'",
    license: "Pixabay Content License (free, no attribution required)",
    attribution: null,
  },
  {
    id: "ambient-tech-02",
    name: "Digital Landscape",
    moods: ["curious", "futuristic", "calm"],
    genre: "ambient electronic",
    durationSeconds: 180,
    source: "https://pixabay.com/music/ — search 'digital landscape ambient'",
    license: "Pixabay Content License (free, no attribution required)",
    attribution: null,
  },
  {
    id: "ambient-tech-03",
    name: "Sci-Fi Technology",
    moods: ["technical", "futuristic", "analytical"],
    genre: "minimal ambient",
    durationSeconds: 120,
    source: "https://pixabay.com/music/ — search 'sci-fi technology'",
    license: "Pixabay Content License (free, no attribution required)",
    attribution: null,
  },

  // ── Upbeat / Energetic ──────────────────────────────────────
  {
    id: "upbeat-electronic-01",
    name: "Inspiring Cinematic Electronic",
    moods: ["energetic", "exciting", "inspiring"],
    genre: "upbeat electronic",
    durationSeconds: 180,
    source: "https://pixabay.com/music/ — search 'inspiring cinematic electronic'",
    license: "Pixabay Content License (free, no attribution required)",
    attribution: null,
  },
  {
    id: "upbeat-electronic-02",
    name: "Technology Corporate",
    moods: ["energetic", "exciting", "inspiring"],
    genre: "upbeat electronic",
    durationSeconds: 150,
    source: "https://pixabay.com/music/ — search 'technology corporate'",
    license: "Pixabay Content License (free, no attribution required)",
    attribution: null,
  },

  // ── Cinematic / Dramatic ────────────────────────────────────
  {
    id: "cinematic-01",
    name: "Epic Cinematic",
    moods: ["dramatic", "inspiring", "intense"],
    genre: "cinematic orchestral",
    durationSeconds: 180,
    source: "https://pixabay.com/music/ — search 'epic cinematic'",
    license: "Pixabay Content License (free, no attribution required)",
    attribution: null,
  },

  // ── Lo-fi / Chill ───────────────────────────────────────────
  {
    id: "lofi-chill-01",
    name: "Chill Lo-fi Beat",
    moods: ["calm", "reflective", "warm", "playful"],
    genre: "ambient lo-fi",
    durationSeconds: 180,
    source: "https://pixabay.com/music/ — search 'chill lo-fi beat'",
    license: "Pixabay Content License (free, no attribution required)",
    attribution: null,
  },

  // ── Dark / Suspenseful ──────────────────────────────────────
  {
    id: "dark-ambient-01",
    name: "Dark Ambient Atmosphere",
    moods: ["serious", "suspenseful", "dramatic"],
    genre: "dark ambient",
    durationSeconds: 180,
    source: "https://pixabay.com/music/ — search 'dark ambient atmosphere'",
    license: "Pixabay Content License (free, no attribution required)",
    attribution: null,
  },

  // ── Synthwave / Futuristic ──────────────────────────────────
  {
    id: "synthwave-01",
    name: "Retrowave Synthwave",
    moods: ["futuristic", "energetic", "exciting"],
    genre: "synthwave electronic",
    durationSeconds: 180,
    source: "https://pixabay.com/music/ — search 'retrowave synthwave'",
    license: "Pixabay Content License (free, no attribution required)",
    attribution: null,
  },

  // ── Minimal / Documentary ───────────────────────────────────
  {
    id: "minimal-doc-01",
    name: "Documentary Background",
    moods: ["analytical", "calm", "curious", "serious"],
    genre: "minimal ambient",
    durationSeconds: 180,
    source: "https://pixabay.com/music/ — search 'documentary background'",
    license: "Pixabay Content License (free, no attribution required)",
    attribution: null,
  },
];

// ─── Track Selection ──────────────────────────────────────────

/**
 * Score a library track against a set of section tones.
 * Higher score = better match.
 */
function scoreTrack(track: LibraryTrack, tones: string[]): number {
  let score = 0;
  const lowerTones = tones.map((t) => t.toLowerCase());

  // Direct mood match (strongest signal)
  for (const mood of track.moods) {
    for (const tone of lowerTones) {
      if (tone.includes(mood)) score += 3;
    }
  }

  // Genre alignment with genreFromTones output
  const targetGenre = genreFromTones(tones);
  if (track.genre === targetGenre) score += 5;
  if (track.genre.split(" ").some((w) => targetGenre.includes(w))) score += 2;

  return score;
}

/**
 * Select the best matching track from the library for given section tones.
 * Returns the track with the highest mood-alignment score.
 * Falls back to the first ambient-tech track if no strong match.
 */
export function selectTrack(
  tones: string[],
  availableTracks?: LibraryTrack[],
): LibraryTrack {
  const catalog = availableTracks ?? MUSIC_LIBRARY;

  if (catalog.length === 0) {
    throw new Error("Music library is empty. Add tracks to MUSIC_LIBRARY in scripts/music/library.ts");
  }

  let bestTrack = catalog[0];
  let bestScore = -1;

  for (const track of catalog) {
    const score = scoreTrack(track, tones);
    if (score > bestScore) {
      bestScore = score;
      bestTrack = track;
    }
  }

  return bestTrack;
}

/**
 * Get all tracks that have MP3 files present in the library directory.
 */
export function getAvailableTracks(libraryDir: string): LibraryTrack[] {
  return MUSIC_LIBRARY.filter((track) =>
    existsSync(join(libraryDir, `${track.id}.mp3`)),
  );
}

/**
 * List all tracks with their download status.
 */
export function listLibrary(libraryDir: string): void {

  console.log("\n─── Music Library ───\n");
  console.log(`  Directory: ${libraryDir}\n`);

  let downloaded = 0;
  let missing = 0;

  for (const track of MUSIC_LIBRARY) {
    const filePath = join(libraryDir, `${track.id}.mp3`);
    const exists = existsSync(filePath);
    const status = exists ? "  [OK]" : "  [--]";

    if (exists) downloaded++;
    else missing++;

    console.log(`${status}  ${track.id}.mp3`);
    console.log(`        ${track.name} | ${track.genre} | moods: ${track.moods.join(", ")}`);
    if (!exists) {
      console.log(`        Download: ${track.source}`);
    }
  }

  console.log(`\n  Total: ${MUSIC_LIBRARY.length} tracks | ${downloaded} downloaded | ${missing} missing`);
}
