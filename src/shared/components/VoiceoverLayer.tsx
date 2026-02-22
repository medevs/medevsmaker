import React from "react";
import { Sequence, staticFile } from "remotion";
import { Audio } from "@remotion/media";

export type VoiceoverScene = {
  /** Path relative to public/ (e.g., "vo/HowTheWebWorks/scene-01.mp3") */
  src: string;
  fromFrame: number;
  durationInFrames: number;
};

type VoiceoverLayerProps = {
  scenes: VoiceoverScene[];
  volume?: number;
};

/**
 * Renders Audio elements in Sequences for voiceover narration.
 * Sits as a sibling to the main video content — no visual output.
 *
 * Usage:
 *   <VoiceoverLayer scenes={VOICEOVER_SCENES} />
 */
export const VoiceoverLayer: React.FC<VoiceoverLayerProps> = ({
  scenes,
  volume = 1,
}) => {
  return (
    <>
      {scenes.map((scene, i) => (
        <Sequence
          key={i}
          from={scene.fromFrame}
          durationInFrames={scene.durationInFrames}
          layout="none"
          name={`VO-${i + 1}`}
        >
          <Audio
            src={staticFile(scene.src)}
            volume={volume}
          />
        </Sequence>
      ))}
    </>
  );
};
