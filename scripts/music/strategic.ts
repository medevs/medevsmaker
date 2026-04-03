/**
 * Strategic Music Segment Generator
 *
 * Derives discrete music placement windows from manifest.json section boundaries.
 * Follows the YouTuber pattern: music at hook, transitions, key moments, and outro —
 * silence during talking segments.
 */

import type { VideoManifest } from "../tts/types.ts";
import type { MusicSegment } from "./types.ts";

// Scene types that warrant an accent music cue
const ACCENT_SCENE_TYPES = new Set([
  "StatHighlight",
  "ComparisonSplit",
  "MetricDashboard",
  "KeyTakeaway",
  "ThreeColumnCompare",
  "DecisionTable",
  "BeforeAfter",
]);

/**
 * Generate strategic music segments from a video manifest.
 *
 * Placement rules:
 *   hook       — Section 0, frame 0, up to 15s
 *   transition — Start of sections 1..N-2, 4s swell
 *   accent     — Emphasis scenes (stats, comparisons), 2s
 *   outro      — Last section, full duration
 */
export function generateStrategicSegments(
  manifest: VideoManifest,
): MusicSegment[] {
  const fps = manifest.fps || 30;
  const sections = manifest.sections;
  if (sections.length === 0) return [];

  const segments: MusicSegment[] = [];

  // Compute cumulative frame offset for each section
  const sectionStarts: number[] = [];
  let cumulative = 0;
  for (const sec of sections) {
    sectionStarts.push(cumulative);
    cumulative += sec.durationFrames;
  }

  // 1. Hook — first section
  const hookDuration = Math.min(sections[0].durationFrames, Math.round(fps * 15));
  segments.push({
    label: "hook",
    role: "hook",
    fromFrame: 0,
    durationInFrames: hookDuration,
    volume: 0.25,
    fadeInFrames: Math.round(fps * 1),
    fadeOutFrames: Math.round(fps * 1.5),
  });

  // 2. Transitions — sections 1 through N-2 (skip first and last)
  for (let i = 1; i < sections.length - 1; i++) {
    const transitionDuration = Math.min(Math.round(fps * 4), sections[i].durationFrames);
    segments.push({
      label: `transition-s${sections[i].sectionIndex}`,
      role: "transition",
      fromFrame: sectionStarts[i],
      durationInFrames: transitionDuration,
      volume: 0.2,
      fadeInFrames: Math.round(fps * 0.5),
      fadeOutFrames: Math.round(fps * 1),
    });
  }

  // 3. Accents — emphasis scenes in middle sections
  for (let i = 1; i < sections.length - 1; i++) {
    let sceneFrameOffset = sectionStarts[i];
    for (const scene of sections[i].scenes) {
      const sceneDurationFrames = Math.round(scene.durationSeconds * fps);
      if (ACCENT_SCENE_TYPES.has(scene.sceneType)) {
        const accentDuration = Math.min(Math.round(fps * 2), sceneDurationFrames);
        // Skip if it would overlap with an existing segment
        const overlaps = segments.some(
          (s) =>
            sceneFrameOffset < s.fromFrame + s.durationInFrames &&
            sceneFrameOffset + accentDuration > s.fromFrame,
        );
        if (!overlaps) {
          segments.push({
            label: `accent-s${sections[i].sectionIndex}-sc${scene.sceneIndex}`,
            role: "accent",
            fromFrame: sceneFrameOffset,
            durationInFrames: accentDuration,
            volume: 0.15,
            fadeInFrames: Math.round(fps * 0.33),
            fadeOutFrames: Math.round(fps * 0.67),
          });
        }
      }
      sceneFrameOffset += sceneDurationFrames;
    }
  }

  // 4. Outro — last section
  if (sections.length >= 2) {
    const lastIdx = sections.length - 1;
    segments.push({
      label: "outro",
      role: "outro",
      fromFrame: sectionStarts[lastIdx],
      durationInFrames: sections[lastIdx].durationFrames,
      volume: 0.22,
      fadeInFrames: Math.round(fps * 1),
      fadeOutFrames: Math.round(fps * 2),
    });
  }

  // Sort by start frame
  segments.sort((a, b) => a.fromFrame - b.fromFrame);

  return segments;
}
