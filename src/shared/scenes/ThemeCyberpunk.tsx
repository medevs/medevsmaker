/**
 * ThemeCyberpunk - サイバーパンク - ネオン、グリッチ
 */

import { AbsoluteFill, useCurrentFrame } from "remotion";
import { loadFont } from "@remotion/google-fonts/Inter";
import { BRAND, DEFAULT_SCENE_COLORS, type SceneColors, baseTokens } from "../styles";
import { useLayoutMode } from "../formats";

const { fontFamily } = loadFont();

export const ThemeCyberpunk = ({ startDelay: _startDelay = 0, title = "CYBER", subtitle = "PUNK", colors: colorsProp, sectionColor }: {
  startDelay?: number;
  title?: string;
  subtitle?: string;
  colors?: SceneColors;
  sectionColor?: string;
}) => {
  void _startDelay;
  const frame = useCurrentFrame();
  const { contentPadding, fontScale } = useLayoutMode();
  const colors = { ...DEFAULT_SCENE_COLORS, ...colorsProp };
  const _accent = sectionColor || colors.accent;

  const glitchOffset = Math.sin(frame * 0.5) * 3;
  const neonPulse = 0.8 + Math.sin(frame * 0.2) * 0.2;

  return (
    <AbsoluteFill style={{ background: colors.bg }}>
      {/* グリッドライン */}
      <AbsoluteFill
        style={{
          backgroundImage: `
            linear-gradient(#ff00ff10 1px, transparent 1px),
            linear-gradient(90deg, #00ffff10 1px, transparent 1px)
          `,
          backgroundSize: "40px 40px",
          perspective: "500px",
          transform: "rotateX(60deg)",
          transformOrigin: "center 200%",
        }}
      />

      {/* メインテキスト */}
      <div
        style={{
          position: "absolute",
          left: 80,
          top: "40%",
          transform: "translateY(-50%)",
        }}
      >
        {/* グリッチレイヤー */}
        <div
          style={{
            position: "absolute",
            fontFamily,
            fontSize: Math.round(100 * fontScale),
            fontWeight: 900,
            color: "#00ffff",
            opacity: 0.7,
            transform: `translateX(${glitchOffset}px)`,
            clipPath: "inset(0 0 50% 0)",
          }}
        >
          {title}
        </div>
        <div
          style={{
            position: "absolute",
            fontFamily,
            fontSize: Math.round(100 * fontScale),
            fontWeight: 900,
            color: "#ff00ff",
            opacity: 0.7,
            transform: `translateX(${-glitchOffset}px)`,
            clipPath: "inset(50% 0 0 0)",
          }}
        >
          {title}
        </div>
        <div
          style={{
            fontFamily,
            fontSize: Math.round(100 * fontScale),
            fontWeight: 900,
            color: colors.text,
            textShadow: `
              0 0 10px #ff00ff,
              0 0 20px #ff00ff,
              0 0 40px #ff00ff
            `,
            opacity: neonPulse,
          }}
        >
          {title}
        </div>
        <div
          style={{
            fontFamily,
            fontSize: Math.round(100 * fontScale),
            fontWeight: 900,
            color: "#00ffff",
            textShadow: `
              0 0 10px #00ffff,
              0 0 20px #00ffff,
              0 0 40px #00ffff
            `,
            marginTop: -20,
            opacity: neonPulse,
          }}
        >
          {subtitle}
        </div>
      </div>

      {/* スキャンライン */}
      <AbsoluteFill
        style={{
          background: `repeating-linear-gradient(
            0deg,
            transparent,
            transparent 2px,
            rgba(0, 0, 0, 0.1) 2px,
            rgba(0, 0, 0, 0.1) 4px
          )`,
          pointerEvents: "none",
        }}
      />
    </AbsoluteFill>
  );
};
