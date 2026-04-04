/**
 * DemoScroll - 画面スクロールデモ
 */

import { AbsoluteFill, interpolate, Easing, useCurrentFrame } from "remotion";
import { BRAND } from "../../styles";
import { loadFont } from "@remotion/google-fonts/Inter";
const { fontFamily } = loadFont();

export const DemoScroll = ({ title = "SCROLL", startDelay = 0 }: {
  title?: string;
  startDelay?: number;
}) => {
  const frame = useCurrentFrame();

  // スクロール量
  const scrollY = interpolate(frame, [startDelay + 20, startDelay + 80], [0, 400], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.bezier(0.4, 0, 0.2, 1) });

  // ダミーコンテンツ
  const items = Array.from({ length: 8 }, (_, i) => ({
    id: `item-${i}`,
    title: `Section ${i + 1}`,
    height: 120 + (i % 3) * 40,
  }));

  return (
    <AbsoluteFill style={{ background: "#0f0f1a" }}>
      {/* ブラウザフレーム */}
      <div
        style={{
          position: "absolute",
          left: 100,
          top: 60,
          right: 100,
          bottom: 60,
          background: "#1a1a2e",
          borderRadius: 12,
          overflow: "hidden",
          border: `1px solid ${"#1e1e30"}`,
        }}
      >
        {/* ブラウザヘッダー */}
        <div
          style={{
            height: 40,
            background: "#1e1e30",
            display: "flex",
            alignItems: "center",
            padding: "0 15px",
            gap: 8,
          }}
        >
          <div style={{ width: 12, height: 12, borderRadius: "50%", background: "#ff5f57" }} />
          <div style={{ width: 12, height: 12, borderRadius: "50%", background: "#febc2e" }} />
          <div style={{ width: 12, height: 12, borderRadius: "50%", background: "#28c840" }} />
          <div
            style={{
              flex: 1,
              marginLeft: 20,
              height: 24,
              background: "#2e2e44",
              borderRadius: 4,
              display: "flex",
              alignItems: "center",
              padding: "0 12px",
            }}
          >
            <span style={{ fontFamily: fontFamily, fontSize: 12, color: "#64748b" }}>
              app.example.com
            </span>
          </div>
        </div>

        {/* コンテンツエリア */}
        <div
          style={{
            height: "calc(100% - 40px)",
            overflow: "hidden",
            position: "relative",
          }}
        >
          <div
            style={{
              transform: `translateY(-${scrollY}px)`,
              padding: 30,
              display: "flex",
              flexDirection: "column",
              gap: 20,
            }}
          >
            {items.map((item) => (
              <div
                key={item.id}
                style={{
                  height: item.height,
                  background: "#1e1e30",
                  borderRadius: 8,
                  padding: 20,
                }}
              >
                <div
                  style={{
                    fontFamily: fontFamily,
                    fontSize: 16,
                    fontWeight: 600,
                    color: BRAND.text,
                    marginBottom: 10,
                  }}
                >
                  {item.title}
                </div>
                <div
                  style={{
                    width: "60%",
                    height: 12,
                    background: "#2e2e44",
                    borderRadius: 4,
                  }}
                />
              </div>
            ))}
          </div>

          {/* スクロールバー */}
          <div
            style={{
              position: "absolute",
              right: 4,
              top: 4,
              width: 6,
              height: "calc(100% - 8px)",
              background: "#1e1e30",
              borderRadius: 3,
            }}
          >
            <div
              style={{
                width: "100%",
                height: 80,
                background: "#334155",
                borderRadius: 3,
                transform: `translateY(${scrollY * 0.3}px)`,
              }}
            />
          </div>
        </div>
      </div>

      {/* スクロールインジケーター */}
      <div
        style={{
          position: "absolute",
          right: 60,
          top: "50%",
          transform: "translateY(-50%)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 10,
          opacity: interpolate(frame, [startDelay, startDelay + 20], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
        }}
      >
        <div
          style={{
            fontFamily: fontFamily,
            fontSize: 11,
            color: "#475569",
            letterSpacing: 1,
            writingMode: "vertical-rl",
          }}
        >
          {title}
        </div>
        <svg width="20" height="30" viewBox="0 0 20 30" fill="none" aria-hidden="true">
          <rect x="1" y="1" width="18" height="28" rx="9" stroke={"#334155"} strokeWidth="2" />
          <circle
            cx="10"
            cy={8 + interpolate(frame, [startDelay + 20, startDelay + 80], [0, 12], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })}
            r="3"
            fill={BRAND.indigo}
          />
        </svg>
      </div>
    </AbsoluteFill>
  );
};
