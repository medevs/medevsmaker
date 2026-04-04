/**
 * ListFullscreenSequence - フルスクリーン順次表示（1要素ずつ）
 */

import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { loadFont } from "@remotion/google-fonts/Inter";
import { BRAND } from "../../styles";

const { fontFamily } = loadFont();

const COLORS = [BRAND.indigo, BRAND.violet, BRAND.cyan];

export const ListFullscreenSequence = ({
  startDelay = 0,
  items: itemLabels,
  title,
}: {
  startDelay?: number;
  items?: string[];
  title?: string;
}) => {
  const frame = useCurrentFrame();

  const labels = itemLabels ?? ["INNOVATE", "CREATE", "DELIVER"];
  const items = labels.map((text, i) => ({
    num: String(i + 1).padStart(2, "0"),
    text,
    color: COLORS[i % COLORS.length],
  }));

  // 各シーンの時間
  const sceneDuration = 30;

  // 現在のシーン
  const sceneIndex = Math.min(
    Math.floor((frame - startDelay) / sceneDuration),
    items.length - 1
  );

  const sceneFrame = (frame - startDelay) % sceneDuration;
  const currentItem = items[Math.max(0, sceneIndex)];

  const enterProgress = interpolate(sceneFrame, [0, 15], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.bezier(0.16, 1, 0.3, 1) });
  const exitProgress = interpolate(sceneFrame, [20, 30], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.bezier(0.16, 1, 0.3, 1) });
  const progress = Math.min(enterProgress, exitProgress);

  return (
    <AbsoluteFill style={{ background: BRAND.bg }}>
      {/* メインテキスト */}
      <div
        style={{
          position: "absolute",
          left: 80,
          top: "50%",
          transform: `translateY(-50%) translateX(${(1 - progress) * -100}px)`,
          opacity: progress,
        }}
      >
        <div
          style={{
            fontFamily,
            fontSize: 14,
            color: "#334155",
            letterSpacing: 4,
            marginBottom: 20,
          }}
        >
          STEP {currentItem.num}
        </div>
        <div
          style={{
            fontFamily,
            fontSize: 140,
            fontWeight: 900,
            color: currentItem.color,
            lineHeight: 0.9,
            letterSpacing: -5,
          }}
        >
          {currentItem.text}
        </div>
      </div>

      {/* 進捗インジケーター */}
      <div
        style={{
          position: "absolute",
          left: 80,
          bottom: 80,
          display: "flex",
          gap: 8,
        }}
      >
        {items.map((item, i) => (
          <div
            key={`indicator-${item.num}`}
            style={{
              width: i === sceneIndex ? 40 : 20,
              height: 4,
              background: i === sceneIndex ? currentItem.color : "#1e1e30",
              borderRadius: 2,
              transition: "width 0.3s, background 0.3s",
            }}
          />
        ))}
      </div>

      {/* 右側の番号（大きく薄く） */}
      <div
        style={{
          position: "absolute",
          right: 80,
          bottom: 80,
          fontFamily,
          fontSize: 200,
          fontWeight: 100,
          color: "#1a1a2e",
          opacity: progress,
        }}
      >
        {currentItem.num}
      </div>
    </AbsoluteFill>
  );
};
