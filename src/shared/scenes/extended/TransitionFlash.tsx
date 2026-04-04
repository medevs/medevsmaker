/**
 * TransitionFlash - フラッシュトランジション
 */

import { AbsoluteFill, useCurrentFrame, interpolate } from "remotion";
import { loadFont } from "@remotion/google-fonts/Inter";
import { BRAND } from "../../styles";

const { fontFamily } = loadFont();

export const TransitionFlash = ({ startDelay = 0, flashColor = BRAND.text, text = "BEFORE" }: {
  startDelay?: number;
  flashColor?: string;
  text?: string;
}) => {
  const frame = useCurrentFrame();

  const phase1 = frame < startDelay + 15;
  const flashPhase = frame >= startDelay + 15 && frame < startDelay + 25;
  const phase2 = frame >= startDelay + 25;

  const flashIntensity = flashPhase
    ? interpolate(frame, [startDelay + 15, startDelay + 20, startDelay + 25], [0, 1, 0])
    : 0;

  return (
    <AbsoluteFill style={{ background: BRAND.bg }}>
      {/* シーン1 */}
      {phase1 && (
        <AbsoluteFill
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div style={{ fontFamily, fontSize: 80, fontWeight: 700, color: BRAND.text }}>
            {text}
          </div>
        </AbsoluteFill>
      )}

      {/* シーン2 */}
      {phase2 && (
        <AbsoluteFill
          style={{
            background: "#0f0f1a",
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
              color: BRAND.text,
            }}
          >
            AFTER
          </div>
        </AbsoluteFill>
      )}

      {/* フラッシュ */}
      <AbsoluteFill
        style={{
          background: flashColor,
          opacity: flashIntensity,
          pointerEvents: "none",
        }}
      />
    </AbsoluteFill>
  );
};
