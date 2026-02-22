import React from "react";
import { AbsoluteFill, Series } from "remotion";
import { Background } from "../shared/components/Background";
import { ProgressBar } from "../shared/components/ProgressBar";
import { Watermark } from "../shared/components/Watermark";
import { VoiceoverLayer } from "../shared/components/VoiceoverLayer";
import { VOICEOVER_SCENES } from "./voiceover";
import { Section1 } from "./sections/Section1";
import { Section2 } from "./sections/Section2";
import { Section3 } from "./sections/Section3";
import { Section4 } from "./sections/Section4";
import { Section5 } from "./sections/Section5";
import { Section6 } from "./sections/Section6";
import {
  COLORS,
  TOTAL_SECTIONS,
  SECTION_1_FRAMES,
  SECTION_2_FRAMES,
  SECTION_3_FRAMES,
  SECTION_4_FRAMES,
  SECTION_5_FRAMES,
  SECTION_6_FRAMES,
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
          <ProgressBar totalSections={TOTAL_SECTIONS} currentSection={1} />
        </Series.Sequence>
        <Series.Sequence durationInFrames={SECTION_2_FRAMES}>
          <Section2 />
          <ProgressBar totalSections={TOTAL_SECTIONS} currentSection={2} />
        </Series.Sequence>
        <Series.Sequence durationInFrames={SECTION_3_FRAMES}>
          <Section3 />
          <ProgressBar totalSections={TOTAL_SECTIONS} currentSection={3} />
        </Series.Sequence>
        <Series.Sequence durationInFrames={SECTION_4_FRAMES}>
          <Section4 />
          <ProgressBar totalSections={TOTAL_SECTIONS} currentSection={4} />
        </Series.Sequence>
        <Series.Sequence durationInFrames={SECTION_5_FRAMES}>
          <Section5 />
          <ProgressBar totalSections={TOTAL_SECTIONS} currentSection={5} />
        </Series.Sequence>
        <Series.Sequence durationInFrames={SECTION_6_FRAMES}>
          <Section6 />
          <ProgressBar totalSections={TOTAL_SECTIONS} currentSection={6} />
        </Series.Sequence>
      </Series>
      <Watermark position="top-right" delay={30} />
      <VoiceoverLayer scenes={VOICEOVER_SCENES} />
    </AbsoluteFill>
  );
};
