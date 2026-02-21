import React from "react";
import { AbsoluteFill, Series } from "remotion";
import { Background } from "../shared/components/Background";
import { ProgressBar } from "../shared/components/ProgressBar";
import { Watermark } from "../shared/components/Watermark";
import { Section1 } from "./sections/Section1";
import { Section2 } from "./sections/Section2";
import { Section3 } from "./sections/Section3";
import { Section4 } from "./sections/Section4";
import { Section5 } from "./sections/Section5";
import {
  FONTS,
  COLORS,
  SECTION_1_FRAMES,
  SECTION_2_FRAMES,
  SECTION_3_FRAMES,
  SECTION_4_FRAMES,
  SECTION_5_FRAMES,
  TOTAL_SECTIONS,
} from "./styles";

export const HowTheWebWorks: React.FC = () => {
  return (
    <AbsoluteFill>
      <Background
        colors={[COLORS.bg, COLORS.bgLight]}
        overlay="particles"
        particles={{ count: 25, speed: 0.3, opacity: 0.1 }}
      />
      <Series>
        <Series.Sequence durationInFrames={SECTION_1_FRAMES}>
          <Section1 />
          <ProgressBar
            totalSections={TOTAL_SECTIONS}
            currentSection={1}
            activeColor={COLORS.indigo}
            fontFamily={FONTS.heading}
          />
        </Series.Sequence>
        <Series.Sequence durationInFrames={SECTION_2_FRAMES}>
          <Section2 />
          <ProgressBar
            totalSections={TOTAL_SECTIONS}
            currentSection={2}
            activeColor={COLORS.amber}
            fontFamily={FONTS.heading}
          />
        </Series.Sequence>
        <Series.Sequence durationInFrames={SECTION_3_FRAMES}>
          <Section3 />
          <ProgressBar
            totalSections={TOTAL_SECTIONS}
            currentSection={3}
            activeColor={COLORS.indigo}
            fontFamily={FONTS.heading}
          />
        </Series.Sequence>
        <Series.Sequence durationInFrames={SECTION_4_FRAMES}>
          <Section4 />
          <ProgressBar
            totalSections={TOTAL_SECTIONS}
            currentSection={4}
            activeColor={COLORS.green}
            fontFamily={FONTS.heading}
          />
        </Series.Sequence>
        <Series.Sequence durationInFrames={SECTION_5_FRAMES}>
          <Section5 />
          <ProgressBar
            totalSections={TOTAL_SECTIONS}
            currentSection={5}
            activeColor={COLORS.violet}
            fontFamily={FONTS.heading}
          />
        </Series.Sequence>
      </Series>
      <Watermark fontFamily={FONTS.heading} delay={30} />
    </AbsoluteFill>
  );
};
