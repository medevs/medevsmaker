import React from "react";
import { Composition } from "remotion";
import { Thumbnail } from "./shared/scenes/Thumbnail";

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
    </>
  );
};
