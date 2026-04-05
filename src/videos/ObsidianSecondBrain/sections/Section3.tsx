import React from "react";
import { TransitionSeries, linearTiming } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { slide } from "@remotion/transitions/slide";
import { wipe } from "@remotion/transitions/wipe";
import { SectionTitle } from "../../../shared/scenes/SectionTitle";
import { StepSequence } from "../../../shared/scenes/StepSequence";
import { CodeDisplay } from "../../../shared/scenes/CodeDisplay";
import { KeyTakeaway } from "../../../shared/scenes/KeyTakeaway";
import { DemoTextInput } from "../../../shared/scenes/DemoTextInput";
import { COLORS, FONTS, TIMING, SECTION_COLORS } from "../styles";

const colors = {
  bg: COLORS.bg,
  text: COLORS.text,
  accent: SECTION_COLORS[2],
  muted: COLORS.textMuted,
};

export const Section3: React.FC = () => {
  return (
    <TransitionSeries>
      {/* Scene 10: SectionTitle — 3.0s = 90f */}
      <TransitionSeries.Sequence durationInFrames={90}>
        <SectionTitle
          sectionNumber={3}
          title="Setting It Up"
          colors={colors}
          fontFamily={FONTS.heading}
          entrance="scaleBlur"
        />
      </TransitionSeries.Sequence>

      <TransitionSeries.Transition
        presentation={slide({ direction: "from-right" })}
        timing={linearTiming({ durationInFrames: TIMING.sceneSlide })}
      />

      {/* Scene 11: StepSequence — 17.1s = 512f */}
      <TransitionSeries.Sequence durationInFrames={512}>
        <StepSequence
          heading="Create Your Vault"
          steps={[
            { title: "Download Obsidian", description: "obsidian.md — free", icon: "⬇️" },
            { title: "Create a vault folder", description: "Just a folder on your machine", icon: "📁" },
            { title: "Add raw/ and wiki/", description: "Your two key subfolders", icon: "🗂️" },
          ]}
          sectionColor={SECTION_COLORS[2]}
          colors={colors}
          fontFamily={FONTS.heading}
        />
      </TransitionSeries.Sequence>

      <TransitionSeries.Transition
        presentation={fade()}
        timing={linearTiming({ durationInFrames: TIMING.sceneFade })}
      />

      {/* Scene 12: CodeDisplay — 21.0s = 630f */}
      <TransitionSeries.Sequence durationInFrames={630}>
        <CodeDisplay
          title="CLAUDE.md — The Cheat Code"
          code={"# Knowledge Base Rules\n\n## Structure\n- raw/ → staging area for research\n- wiki/ → compiled, interlinked articles\n- wiki/master-index.md → all topics\n\n## When creating wiki articles:\n- Use [[wiki-links]] between related topics\n- Auto-update master-index.md\n- Keep summaries in each index file"}
          annotations={[
            { line: 3, text: "Folder roles" },
            { line: 8, text: "Wiki rules" },
            { line: 10, text: "Auto-indexing" },
          ]}
          colors={colors}
          fontFamily={FONTS.heading}
        />
      </TransitionSeries.Sequence>

      <TransitionSeries.Transition
        presentation={wipe({ direction: "from-left" })}
        timing={linearTiming({ durationInFrames: TIMING.sceneWipe })}
      />

      {/* Scene 13: DemoTextInput — 19.5s = 585f */}
      <TransitionSeries.Sequence durationInFrames={585}>
        <DemoTextInput
          placeholder="Article: How RAG Actually Works"
          typedText="→ raw/how-rag-actually-works.md"
          label="Web Clipper"
          colors={colors}
          sectionColor={SECTION_COLORS[2]}
        />
      </TransitionSeries.Sequence>

      <TransitionSeries.Transition
        presentation={fade()}
        timing={linearTiming({ durationInFrames: TIMING.sceneFade })}
      />

      {/* Scene 14: StepSequence — 19.0s = 570f */}
      <TransitionSeries.Sequence durationInFrames={570}>
        <StepSequence
          heading="Local Images Plus"
          steps={[
            { title: "Open Community Plugins", description: "Settings → Community plugins", icon: "⚙️" },
            { title: "Search 'Local Images Plus'", description: "Install and enable", icon: "🔍" },
            { title: "Images download locally", description: "Full visual wikis", icon: "🖼️" },
          ]}
          variant="card"
          sectionColor={SECTION_COLORS[2]}
          colors={colors}
          fontFamily={FONTS.heading}
        />
      </TransitionSeries.Sequence>

      <TransitionSeries.Transition
        presentation={fade()}
        timing={linearTiming({ durationInFrames: TIMING.sceneFade })}
      />

      {/* Scene 15: KeyTakeaway — 11.0s = 330f */}
      <TransitionSeries.Sequence durationInFrames={330}>
        <KeyTakeaway
          takeaway="Four free tools. One powerful system. Obsidian + Web Clipper + CLAUDE.md + Claude Code."
          variant="insight"
          sectionColor={SECTION_COLORS[2]}
          colors={colors}
          fontFamily={FONTS.heading}
        />
      </TransitionSeries.Sequence>
    </TransitionSeries>
  );
};

// 90 + 512 + 630 + 585 + 570 + 330 = 2717f - (20 + 15 + 18 + 15 + 15) = 2634f
export const SECTION_3_DURATION_FRAMES = 2634;
