import React from "react";
import { TransitionSeries, linearTiming } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { SummaryRecap } from "../../shared/scenes/SummaryRecap";
import { EndScreen } from "../../shared/scenes/EndScreen";
import { FONTS, FPS, T_FADE } from "../styles";

export const Section6: React.FC = () => {
  return (
    <TransitionSeries>
      {/* Scene 29: Summary Recap */}
      <TransitionSeries.Sequence durationInFrames={10 * FPS}>
        <SummaryRecap
          heading="Quick Recap"
          items={[
            "DNS resolves domain names to IPs",
            "TCP handshake opens the connection",
            "HTTP sends requests and responses",
            "The server processes and queries data",
            "The browser parses, lays out, and paints",
          ]}
          fontFamily={FONTS.main}
          itemEntrance="left"
        />
      </TransitionSeries.Sequence>

      <TransitionSeries.Transition
        presentation={fade()}
        timing={linearTiming({ durationInFrames: T_FADE })}
      />

      {/* Scene 30: End Screen */}
      <TransitionSeries.Sequence durationInFrames={5 * FPS}>
        <EndScreen
          channel="medevsmaker"
          cta="Subscribe for more"
          tagline="Making devs, one video at a time"
          showParticles
          fontFamily={FONTS.main}
        />
      </TransitionSeries.Sequence>
    </TransitionSeries>
  );
};
