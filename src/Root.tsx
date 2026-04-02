import React from "react";
import { Composition } from "remotion";
import { HowTheWebWorks } from "./HowTheWebWorks";
import { TOTAL_FRAMES } from "./HowTheWebWorks/styles";
import { Thumbnail } from "./shared/scenes/Thumbnail";

export const Root: React.FC = () => {
  return (
    <>
      <Composition
        id="HowTheWebWorks"
        component={HowTheWebWorks}
        durationInFrames={TOTAL_FRAMES}
        fps={30}
        width={1920}
        height={1080}
      />
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
    </>
  );
};
