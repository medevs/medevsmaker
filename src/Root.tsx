import React from "react";
import { Composition } from "remotion";
import { Thumbnail } from "./shared/scenes/Thumbnail";
import { GraphRAGExplained } from "./videos/GraphRAGExplained";
import { FiveAiToolsDevsSleepingOn } from "./videos/FiveAiToolsDevsSleepingOn";
import { ClaudeCodeMastery } from "./videos/ClaudeCodeMastery";
import { ClaudeCodeLeak } from "./videos/ClaudeCodeLeak";
import { ObsidianSecondBrain } from "./videos/ObsidianSecondBrain";
import { ObsidianClaudeSecondBrain } from "./videos/ObsidianClaudeSecondBrain";


export const Root: React.FC = () => {
  return (
    <>
      <Composition
        id="ThumbnailComposition"
        component={Thumbnail}
        durationInFrames={1}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{
          textOverlay: "Preview",
          textPosition: "bottom-left" as const,
          channelBadge: true,
        }}
      />
      <Composition
        id="GraphRAGExplained"
        component={GraphRAGExplained}
        durationInFrames={12838}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="FiveAiToolsDevsSleepingOn"
        component={FiveAiToolsDevsSleepingOn}
        durationInFrames={10310}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="ClaudeCodeMastery"
        component={ClaudeCodeMastery}
        durationInFrames={12887}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="ClaudeCodeLeak"
        component={ClaudeCodeLeak}
        durationInFrames={12590}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="ObsidianSecondBrain"
        component={ObsidianSecondBrain}
        durationInFrames={12262}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="ObsidianClaudeSecondBrain"
        component={ObsidianClaudeSecondBrain}
        durationInFrames={24336}
        fps={30}
        width={1920}
        height={1080}
      />
    </>
  );
};
