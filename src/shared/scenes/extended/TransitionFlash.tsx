/**
 * TransitionFlash - フラッシュトランジション
 */

import { AbsoluteFill, useCurrentFrame, interpolate } from "remotion";
import { loadFont } from "@remotion/google-fonts/Inter";
import { BRAND, DEFAULT_SCENE_COLORS, type SceneColors } from "../../styles";

const { fontFamily } = loadFont();

export const TransitionFlash = ({
  startDelay = 0,
  flashColor,
  text = "BEFORE",
  colors: colorsProp,
  sectionColor,
}: {
  startDelay?: number;
  flashColor?: string;
  text?: string;
  colors?: SceneColors;
  sectionColor?: string;
}) => {
  const frame = useCurrentFrame();

  const colors = { ...DEFAULT_SCENE_COLORS, ...colorsProp };
  const accent = sectionColor || colors.accent;
  // flashColor defaults to text color; preserve any explicit override passed by caller
  const resolvedFlashColor = flashColor ?? colors.text;

  const phase1 = frame < startDelay + 15;
  const flashPhase = frame >= startDelay + 15 && frame < startDelay + 25;
  const phase2 = frame >= startDelay + 25;

  const flashIntensity = flashPhase
    ? interpolate(frame, [startDelay + 15, startDelay + 20, startDelay + 25], [0, 1, 0])
    : 0;

  return (
    <AbsoluteFill style={{ background: colors.bg }}>
      {/* シーン1 */}
      {phase1 && (
        <AbsoluteFill
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div style={{ fontFamily, fontSize: 80, fontWeight: 700, color: colors.text }}>
            {text}
          </div>
        </AbsoluteFill>
      )}

      {/* シーン2 */}
      {phase2 && (
        <AbsoluteFill
          style={{
            background: colors.bg,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              fontFamily,
              fontSize: 80,
              fontWeight: 700,
              color: colors.text,
            }}
          >
            AFTER
          </div>
        </AbsoluteFill>
      )}

      {/* フラッシュ — preserves full white-out flash effect */}
      <AbsoluteFill
        style={{
          background: resolvedFlashColor,
          opacity: flashIntensity,
          pointerEvents: "none",
        }}
      />
    </AbsoluteFill>
  );
};
