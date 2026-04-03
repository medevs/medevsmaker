import React, { useCallback } from "react";
import { Sequence, staticFile, interpolate } from "remotion";
import { Audio } from "@remotion/media";
import type { VoiceoverScene } from "./VoiceoverLayer";

export type BreathingMusicConfig = {
  /** Path relative to public/ */
  src: string;
  /** Total video duration in frames */
  durationInFrames: number;
  /** Volume during voiceover narration — felt, not heard (default 0.05) */
  narrationVolume?: number;
  /** Volume in gaps between voiceover scenes (default 0.15) */
  gapVolume?: number;
  /** Volume during section transitions (default 0.25) */
  transitionVolume?: number;
  /** Volume during hook intro (default 0.30) */
  hookVolume?: number;
  /** Volume during outro (default 0.30) */
  outroVolume?: number;
  /** Hook duration in frames (default 450 = 15s at 30fps) */
  hookFrames?: number;
  /** Outro duration in frames (default 900 = 30s at 30fps) */
  outroFrames?: number;
  /** Transition window in frames around each section start (default 120 = 4s) */
  transitionFrames?: number;
  /** Frames to ramp between volume levels (default 20 = 0.67s) */
  rampFrames?: number;
  /** Fade-in at video start in frames (default 30 = 1s) */
  fadeInFrames?: number;
  /** Fade-out at video end in frames (default 60 = 2s) */
  fadeOutFrames?: number;
  /** Frame numbers where each section starts (from manifest) */
  sectionStarts: number[];
  /** Whether to loop the track (default true) */
  loop?: boolean;
};

type BreathingMusicLayerProps = {
  config: BreathingMusicConfig;
  /** Voiceover timing for ducking. Omit if no voiceover. */
  voiceoverScenes?: VoiceoverScene[];
};

/**
 * Continuous music bed with breathing volume — the way top YouTubers do it.
 *
 * Music plays the entire video. Volume "breathes":
 *   - Hook (first ~15s): moderate volume, establishes energy
 *   - During narration: very low (felt, not heard)
 *   - Gaps between narration: rises to fill pauses
 *   - Section transitions: swells briefly at each section boundary
 *   - Outro (last ~30s): rises back to moderate
 *
 * Usage:
 *   <BreathingMusicLayer config={BREATHING_MUSIC_CONFIG} voiceoverScenes={VOICEOVER_SCENES} />
 */
export const BreathingMusicLayer: React.FC<BreathingMusicLayerProps> = ({
  config,
  voiceoverScenes = [],
}) => {
  const {
    src,
    durationInFrames,
    narrationVolume = 0.05,
    gapVolume = 0.15,
    transitionVolume = 0.25,
    hookVolume = 0.3,
    outroVolume = 0.3,
    hookFrames = 450,
    outroFrames = 900,
    transitionFrames = 120,
    rampFrames = 20,
    fadeInFrames = 30,
    fadeOutFrames = 60,
    sectionStarts,
    loop = true,
  } = config;

  const volumeCallback = useCallback(
    (frame: number) => {
      // 1. Determine target volume based on zone (priority order)
      let target: number;

      const outroStart = durationInFrames - outroFrames;

      if (frame < hookFrames) {
        // Hook zone — moderate volume
        // Ramp down near the end of hook toward the next zone
        const hookEnd = hookFrames;
        const rampStart = hookEnd - rampFrames;
        if (frame > rampStart) {
          const nextTarget = getBaseTarget(frame, voiceoverScenes, sectionStarts, transitionFrames, gapVolume, narrationVolume, transitionVolume);
          target = interpolate(frame, [rampStart, hookEnd], [hookVolume, nextTarget], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          });
        } else {
          target = hookVolume;
        }
      } else if (frame >= outroStart) {
        // Outro zone — ramp up at the start
        const rampEnd = outroStart + rampFrames;
        if (frame < rampEnd) {
          const prevTarget = getBaseTarget(frame, voiceoverScenes, sectionStarts, transitionFrames, gapVolume, narrationVolume, transitionVolume);
          target = interpolate(frame, [outroStart, rampEnd], [prevTarget, outroVolume], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          });
        } else {
          target = outroVolume;
        }
      } else {
        // Body — breathing between narration, gaps, and transitions
        target = getBaseTarget(frame, voiceoverScenes, sectionStarts, transitionFrames, gapVolume, narrationVolume, transitionVolume);
      }

      // 2. Apply fade envelope (in at start, out at end)
      let envelope = 1;
      if (fadeInFrames > 0 && frame < fadeInFrames) {
        envelope = interpolate(frame, [0, fadeInFrames], [0, 1], {
          extrapolateRight: "clamp",
        });
      }
      const fadeOutStart = durationInFrames - fadeOutFrames;
      if (fadeOutFrames > 0 && frame > fadeOutStart) {
        envelope = Math.min(
          envelope,
          interpolate(frame, [fadeOutStart, durationInFrames], [1, 0], {
            extrapolateLeft: "clamp",
          }),
        );
      }

      return target * envelope;
    },
    [
      voiceoverScenes,
      sectionStarts,
      durationInFrames,
      narrationVolume,
      gapVolume,
      transitionVolume,
      hookVolume,
      outroVolume,
      hookFrames,
      outroFrames,
      transitionFrames,
      rampFrames,
      fadeInFrames,
      fadeOutFrames,
    ],
  );

  return (
    <Sequence
      from={0}
      durationInFrames={durationInFrames}
      layout="none"
      name="BreathingMusic"
    >
      <Audio src={staticFile(src)} volume={volumeCallback} loop={loop} />
    </Sequence>
  );
};

/**
 * Determine the base target volume for the "body" of the video.
 * Checks section transitions first, then voiceover ducking, then gap.
 */
function getBaseTarget(
  frame: number,
  voiceoverScenes: VoiceoverScene[],
  sectionStarts: number[],
  transitionFrames: number,
  gapVolume: number,
  narrationVolume: number,
  transitionVolume: number,
): number {
  // Check if we're in a section transition window
  for (const start of sectionStarts) {
    if (frame >= start && frame < start + transitionFrames) {
      // Within transition window — swell up then back down
      const mid = start + transitionFrames / 2;
      if (frame < mid) {
        return interpolate(frame, [start, mid], [gapVolume, transitionVolume], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });
      }
      return interpolate(frame, [mid, start + transitionFrames], [transitionVolume, gapVolume], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      });
    }
  }

  // Check if voiceover is active — duck to narration volume
  for (const scene of voiceoverScenes) {
    const voStart = scene.fromFrame;
    const voEnd = scene.fromFrame + scene.durationInFrames;
    const rampBefore = 15; // frames to ramp down before voiceover
    const rampAfter = 15;  // frames to ramp up after voiceover

    if (frame >= voStart - rampBefore && frame <= voEnd + rampAfter) {
      if (frame < voStart) {
        // Ramping down before voiceover
        return interpolate(frame, [voStart - rampBefore, voStart], [gapVolume, narrationVolume], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });
      } else if (frame > voEnd) {
        // Ramping up after voiceover
        return interpolate(frame, [voEnd, voEnd + rampAfter], [narrationVolume, gapVolume], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });
      }
      // During voiceover
      return narrationVolume;
    }
  }

  // No voiceover, no transition — gap volume
  return gapVolume;
}
