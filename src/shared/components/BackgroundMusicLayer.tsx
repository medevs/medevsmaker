import React, { useCallback } from "react";
import { Sequence, staticFile, interpolate } from "remotion";
import { Audio } from "@remotion/media";
import type { VoiceoverScene } from "./VoiceoverLayer";

export type MusicConfig = {
  /** Path relative to public/ (e.g., "music/HowTheWebWorks/background.mp3") */
  src: string;
  /** Total video duration in frames — music spans the full composition */
  durationInFrames: number;
  /** Base volume when no voiceover is playing (default 0.20) */
  volume?: number;
  /** Reduced volume during voiceover (default 0.06) */
  duckVolume?: number;
  /** Frames to fade in at video start (default 30 = 1s at 30fps) */
  fadeInFrames?: number;
  /** Frames to fade out at video end (default 60 = 2s at 30fps) */
  fadeOutFrames?: number;
  /** Frames to ramp volume up/down for ducking transitions (default 15 = 0.5s) */
  duckRampFrames?: number;
  /** Whether to loop the music track (default true) */
  loop?: boolean;
};

type BackgroundMusicLayerProps = {
  config: MusicConfig;
  /** Voiceover timing data for automatic ducking. Omit for no ducking. */
  voiceoverScenes?: VoiceoverScene[];
};

/**
 * Renders background music with automatic voiceover ducking.
 * Sits as a sibling to VoiceoverLayer — no visual output.
 *
 * Volume behavior:
 *   - Fades in at video start, fades out at video end
 *   - Ducks (reduces volume) during voiceover scenes
 *   - Ramps smoothly between base and duck volume
 *
 * Usage:
 *   <BackgroundMusicLayer config={MUSIC_CONFIG} voiceoverScenes={VOICEOVER_SCENES} />
 */
export const BackgroundMusicLayer: React.FC<BackgroundMusicLayerProps> = ({
  config,
  voiceoverScenes = [],
}) => {
  const {
    src,
    durationInFrames,
    volume: baseVolume = 0.2,
    duckVolume = 0.06,
    fadeInFrames = 30,
    fadeOutFrames = 60,
    duckRampFrames = 15,
    loop = true,
  } = config;

  const volumeCallback = useCallback(
    (frame: number) => {
      // 1. Fade envelope (in at start, out at end)
      let envelope = 1;
      if (fadeInFrames > 0 && frame < fadeInFrames) {
        envelope = interpolate(frame, [0, fadeInFrames], [0, 1], {
          extrapolateRight: "clamp",
        });
      }
      const fadeOutStart = durationInFrames - fadeOutFrames;
      if (fadeOutFrames > 0 && frame > fadeOutStart) {
        envelope = interpolate(
          frame,
          [fadeOutStart, durationInFrames],
          [1, 0],
          { extrapolateLeft: "clamp" },
        );
      }

      // 2. Ducking — find if any voiceover is active or ramping
      let duck = 1; // 1 = full volume, 0 = fully ducked
      for (const scene of voiceoverScenes) {
        const voStart = scene.fromFrame;
        const voEnd = scene.fromFrame + scene.durationInFrames;
        const rampStart = voStart - duckRampFrames;
        const rampEnd = voEnd + duckRampFrames;

        if (frame >= rampStart && frame <= rampEnd) {
          if (frame < voStart) {
            // Ramping down before voiceover
            duck = Math.min(
              duck,
              interpolate(frame, [rampStart, voStart], [1, 0], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
              }),
            );
          } else if (frame > voEnd) {
            // Ramping up after voiceover
            duck = Math.min(
              duck,
              interpolate(frame, [voEnd, rampEnd], [0, 1], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
              }),
            );
          } else {
            // During voiceover — fully ducked
            duck = 0;
          }
        }
      }

      // 3. Combine: interpolate between duck and base volume, apply envelope
      const targetVolume = duckVolume + duck * (baseVolume - duckVolume);
      return targetVolume * envelope;
    },
    [
      voiceoverScenes,
      baseVolume,
      duckVolume,
      fadeInFrames,
      fadeOutFrames,
      duckRampFrames,
      durationInFrames,
    ],
  );

  return (
    <Sequence
      from={0}
      durationInFrames={durationInFrames}
      layout="none"
      name="BGMusic"
    >
      <Audio src={staticFile(src)} volume={volumeCallback} loop={loop} />
    </Sequence>
  );
};
