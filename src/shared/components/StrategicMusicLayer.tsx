import React, { useCallback } from "react";
import { Sequence, staticFile, interpolate } from "remotion";
import { Audio } from "@remotion/media";

export type MusicSegmentRole = "hook" | "transition" | "accent" | "outro";

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

type StrategicMusicLayerProps = {
  config: StrategicMusicConfig;
};

/**
 * Renders background music at strategic moments — hook, transitions, accents, outro.
 * Silence during talking segments. Each segment fades in/out independently.
 *
 * Usage:
 *   <StrategicMusicLayer config={STRATEGIC_MUSIC_CONFIG} />
 */
export const StrategicMusicLayer: React.FC<StrategicMusicLayerProps> = ({
  config,
}) => {
  const { src, segments } = config;

  return (
    <>
      {segments.map((seg) => (
        <StrategicSegment key={seg.label} seg={seg} src={src} />
      ))}
    </>
  );
};

/** Individual segment with its own fade envelope volume callback. */
const StrategicSegment: React.FC<{
  seg: MusicSegment;
  src: string;
}> = ({ seg, src }) => {
  const volumeCallback = useCallback(
    (frame: number) => {
      // frame is relative to the Sequence (0 = segment start)
      let envelope = 1;

      // Fade in
      if (seg.fadeInFrames > 0 && frame < seg.fadeInFrames) {
        envelope = interpolate(frame, [0, seg.fadeInFrames], [0, 1], {
          extrapolateRight: "clamp",
        });
      }

      // Fade out
      const fadeOutStart = seg.durationInFrames - seg.fadeOutFrames;
      if (seg.fadeOutFrames > 0 && frame > fadeOutStart) {
        envelope = Math.min(
          envelope,
          interpolate(
            frame,
            [fadeOutStart, seg.durationInFrames],
            [1, 0],
            { extrapolateLeft: "clamp" },
          ),
        );
      }

      return seg.volume * envelope;
    },
    [seg.volume, seg.fadeInFrames, seg.fadeOutFrames, seg.durationInFrames],
  );

  return (
    <Sequence
      from={seg.fromFrame}
      durationInFrames={seg.durationInFrames}
      layout="none"
      name={`Music-${seg.label}`}
    >
      <Audio src={staticFile(src)} volume={volumeCallback} />
    </Sequence>
  );
};
