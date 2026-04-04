/**
 * DemoZoomFocus - ズームイン/フォーカスデモ
 */

import { AbsoluteFill, interpolate, Easing, useCurrentFrame, useVideoConfig, spring } from "remotion";
import { BRAND } from "../../styles";
import { loadFont } from "@remotion/google-fonts/Inter";
import { Highlight } from "../../components/Highlight";
const { fontFamily } = loadFont();

export const DemoZoomFocus = ({ title = "Key Metrics", startDelay = 0 }: {
  title?: string;
  startDelay?: number;
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // ズームアニメーション
  const zoomProgress = spring({
    frame: frame - startDelay - 20,
    fps,
    config: { damping: 20, stiffness: 100 },
  });

  const scale = 1 + zoomProgress * 0.8;
  const translateX = -200 * zoomProgress;
  const translateY = -100 * zoomProgress;

  // ハイライト
  const highlightProgress = interpolate(frame, [startDelay + 40, startDelay + 55], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.bezier(0.16, 1, 0.3, 1) });

  return (
    <AbsoluteFill style={{ background: "#0f0f1a" }}>
      {/* 画面コンテンツ */}
      <div
        style={{
          position: "absolute",
          left: 100,
          top: 80,
          right: 100,
          bottom: 80,
          transform: `scale(${scale}) translate(${translateX}px, ${translateY}px)`,
          transformOrigin: "center center",
        }}
      >
        {/* ダミーダッシュボード */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "200px 1fr",
            gap: 20,
            height: "100%",
          }}
        >
          {/* サイドバー */}
          <div
            style={{
              background: "#1a1a2e",
              borderRadius: 8,
              padding: 20,
            }}
          >
            <div
              style={{
                fontFamily: fontFamily,
                fontSize: 14,
                fontWeight: 600,
                color: BRAND.text,
                marginBottom: 20,
              }}
            >
              Menu
            </div>
            {["Dashboard", "Analytics", "Users", "Settings"].map((item, i) => (
              <div
                key={`menu-${item}`}
                style={{
                  fontFamily: fontFamily,
                  fontSize: 13,
                  color: i === 1 ? BRAND.indigo : "#475569",
                  padding: "10px 0",
                  borderLeft: i === 1 ? `2px solid ${BRAND.indigo}` : "2px solid transparent",
                  paddingLeft: 12,
                }}
              >
                {item}
              </div>
            ))}
          </div>

          {/* メインコンテンツ */}
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            {/* ターゲットエリア（ズームフォーカス対象） */}
            <div
              style={{
                background: "#1a1a2e",
                borderRadius: 8,
                padding: 25,
                position: "relative",
              }}
            >
              <div
                style={{
                  fontFamily: fontFamily,
                  fontSize: 16,
                  fontWeight: 600,
                  color: BRAND.text,
                  marginBottom: 15,
                }}
              >
                {title}
              </div>
              <div style={{ display: "flex", gap: 30 }}>
                <div>
                  <div style={{ fontFamily: fontFamily, fontSize: 32, fontWeight: 700, color: BRAND.indigo }}>
                    2,847
                  </div>
                  <div style={{ fontFamily: fontFamily, fontSize: 12, color: "#475569" }}>
                    Active Users
                  </div>
                </div>
                <div>
                  <div style={{ fontFamily: fontFamily, fontSize: 32, fontWeight: 700, color: BRAND.green }}>
                    +12.5%
                  </div>
                  <div style={{ fontFamily: fontFamily, fontSize: 12, color: "#475569" }}>
                    Growth Rate
                  </div>
                </div>
              </div>
            </div>

            {/* その他のカード */}
            <div style={{ display: "flex", gap: 20, flex: 1 }}>
              <div style={{ flex: 1, background: "#1a1a2e", borderRadius: 8 }} />
              <div style={{ flex: 1, background: "#1a1a2e", borderRadius: 8 }} />
            </div>
          </div>
        </div>
      </div>

      {/* ハイライト（ズーム後に表示） */}
      {zoomProgress > 0.8 && (
        <Highlight
          x={350}
          y={190}
          width={180}
          height={70}
          progress={highlightProgress}
          label="Key Metric"
        />
      )}

      {/* ズームインジケーター */}
      <div
        style={{
          position: "absolute",
          right: 40,
          bottom: 40,
          display: "flex",
          alignItems: "center",
          gap: 10,
          fontFamily: fontFamily,
          fontSize: 12,
          color: "#475569",
          opacity: interpolate(frame, [startDelay, startDelay + 20], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
        }}
      >
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
          <circle cx="8" cy="8" r="6" stroke={"#475569"} strokeWidth="2" />
          <path d="M13 13L18 18" stroke={"#475569"} strokeWidth="2" strokeLinecap="round" />
          <path d="M5 8H11M8 5V11" stroke={"#475569"} strokeWidth="1.5" strokeLinecap="round" />
        </svg>
        ZOOM: {Math.round(scale * 100)}%
      </div>
    </AbsoluteFill>
  );
};
