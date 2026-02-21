import React from "react";
import { Composition } from "remotion";
import { HowTheWebWorks } from "./HowTheWebWorks";

export const Root: React.FC = () => {
  return (
    <>
      <Composition
        id="HowTheWebWorks"
        component={HowTheWebWorks}
        durationInFrames={5474}
        fps={30}
        width={1920}
        height={1080}
      />
    </>
  );
};
