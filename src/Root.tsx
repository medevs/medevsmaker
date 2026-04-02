import React from "react";
import { Composition } from "remotion";
import { Thumbnail } from "./shared/scenes/Thumbnail";
import { GraphRAGExplained } from "./videos/GraphRAGExplained";

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
    </>
  );
};
