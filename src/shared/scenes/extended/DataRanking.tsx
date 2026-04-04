/**
 * DataRanking - ランキング - リストアニメーション
 */

import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig, spring } from "remotion";
import { BRAND } from "../../styles";
import { loadFont } from "@remotion/google-fonts/Inter";
const { fontFamily } = loadFont();

export const DataRanking = ({ items: itemsProp, title = "Top Cities", startDelay = 0 }: {
  items?: { name: string; score: number }[];
  title?: string;
  startDelay?: number;
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const defaultItems = [
    { rank: 1, name: "Tokyo", value: "37.4M", change: "up" as const },
    { rank: 2, name: "Delhi", value: "32.9M", change: "up" as const },
    { rank: 3, name: "Shanghai", value: "29.2M", change: "down" as const },
    { rank: 4, name: "São Paulo", value: "22.4M", change: "same" as const },
    { rank: 5, name: "Mexico City", value: "21.9M", change: "up" as const },
  ];

  const items = itemsProp
    ? itemsProp.map((item, i) => ({
        rank: i + 1,
        name: item.name,
        value: String(item.score),
        change: "up" as const,
      }))
    : defaultItems;

  return (
    <AbsoluteFill style={{ background: "#0f0f1a", padding: 60 }}>
      {/* タイトル */}
      <div
        style={{
          fontFamily: fontFamily,
          fontSize: 40,
          fontWeight: 700,
          color: BRAND.text,
          marginBottom: 15,
          opacity: interpolate(frame, [startDelay, startDelay + 20], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
        }}
      >
        {title}
      </div>
      <div
        style={{
          fontFamily: fontFamily,
          fontSize: 16,
          color: "#475569",
          marginBottom: 40,
          opacity: interpolate(frame, [startDelay + 10, startDelay + 30], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
        }}
      >
        By population (2024)
      </div>

      {/* リスト */}
      {items.map((item, i) => {
        const delay = startDelay + 25 + i * 8;
        const progress = spring({
          frame: frame - delay,
          fps,
          config: { damping: 15, stiffness: 150 },
        });

        const changeIcon =
          item.change === "up" ? "↑" : item.change === "down" ? "↓" : "→";
        const changeColor =
          item.change === "up"
            ? BRAND.green
            : item.change === "down"
            ? BRAND.red
            : "#475569";

        return (
          <div
            key={`rank-${item.rank}`}
            style={{
              display: "flex",
              alignItems: "center",
              padding: "20px 30px",
              marginBottom: 15,
              background: i === 0 ? BRAND.indigo : "#1a1a2e",
              borderRadius: 12,
              transform: `translateX(${(1 - progress) * 100}px)`,
              opacity: progress,
            }}
          >
            {/* 順位 */}
            <div
              style={{
                fontFamily: fontFamily,
                fontSize: 32,
                fontWeight: 800,
                color: i === 0 ? BRAND.text : "#475569",
                width: 60,
              }}
            >
              #{item.rank}
            </div>

            {/* 名前 */}
            <div
              style={{
                flex: 1,
                fontFamily: fontFamily,
                fontSize: 24,
                fontWeight: 600,
                color: BRAND.text,
              }}
            >
              {item.name}
            </div>

            {/* 変動 */}
            <div
              style={{
                fontFamily: fontFamily,
                fontSize: 20,
                color: changeColor,
                marginRight: 30,
              }}
            >
              {changeIcon}
            </div>

            {/* 値 */}
            <div
              style={{
                fontFamily: fontFamily,
                fontSize: 24,
                fontWeight: 700,
                color: BRAND.text,
              }}
            >
              {item.value}
            </div>
          </div>
        );
      })}
    </AbsoluteFill>
  );
};
