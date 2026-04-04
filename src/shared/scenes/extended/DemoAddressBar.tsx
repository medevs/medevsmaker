/**
 * DemoAddressBar - ブラウザアドレスバーデモ
 */

import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { BRAND } from "../../styles";
import { loadFont } from "@remotion/google-fonts/Inter";
const { fontFamily } = loadFont();

export const DemoAddressBar = ({ url: urlProp, title = "Dashboard", startDelay = 0 }: {
  url?: string;
  title?: string;
  startDelay?: number;
}) => {
  const frame = useCurrentFrame();

  // URL入力
  const url = urlProp ?? "app.example.com/dashboard";
  const typingStart = startDelay + 20;
  const typedChars = Math.floor(interpolate(frame, [typingStart, typingStart + 60], [0, url.length], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }));

  // Enter押下
  const enterFrame = startDelay + 90;
  const isNavigating = frame >= enterFrame;

  // ページロード
  const loadProgress = interpolate(frame, [enterFrame, enterFrame + 30], [0, 100], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ background: "#0f0f1a" }}>
      {/* ブラウザウィンドウ */}
      <div
        style={{
          position: "absolute",
          left: 80,
          top: 60,
          right: 80,
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
            height: 50,
            background: "#1e1e30",
            display: "flex",
            alignItems: "center",
            padding: "0 15px",
            gap: 15,
          }}
        >
          {/* ウィンドウボタン */}
          <div style={{ display: "flex", gap: 8 }}>
            <div style={{ width: 12, height: 12, borderRadius: "50%", background: "#ff5f57" }} />
            <div style={{ width: 12, height: 12, borderRadius: "50%", background: "#febc2e" }} />
            <div style={{ width: 12, height: 12, borderRadius: "50%", background: "#28c840" }} />
          </div>

          {/* ナビゲーションボタン */}
          <div style={{ display: "flex", gap: 10 }}>
            <span style={{ color: "#475569", fontSize: 18 }}>←</span>
            <span style={{ color: "#334155", fontSize: 18 }}>→</span>
          </div>

          {/* アドレスバー */}
          <div
            style={{
              flex: 1,
              height: 32,
              background: "#2e2e44",
              borderRadius: 6,
              display: "flex",
              alignItems: "center",
              padding: "0 12px",
              gap: 8,
              border: typedChars > 0 && !isNavigating ? `1px solid ${BRAND.indigo}` : "1px solid transparent",
            }}
          >
            {/* HTTPS アイコン */}
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
              <rect x="2" y="6" width="10" height="7" rx="1" stroke={"#475569"} strokeWidth="1.5" />
              <path d="M4 6V4a3 3 0 116 0v2" stroke={"#475569"} strokeWidth="1.5" strokeLinecap="round" />
            </svg>

            <span style={{ fontFamily: fontFamily, fontSize: 13, color: BRAND.text }}>
              {url.slice(0, typedChars)}
            </span>

            {!isNavigating && Math.floor(frame / 15) % 2 === 0 && (
              <span style={{ width: 1, height: 14, background: BRAND.indigo }} />
            )}
          </div>

          {/* 更新ボタン */}
          <span
            style={{
              color: "#475569",
              fontSize: 16,
              transform: isNavigating ? `rotate(${(frame - enterFrame) * 10}deg)` : "none",
            }}
          >
            ⟳
          </span>
        </div>

        {/* ローディングバー */}
        {isNavigating && loadProgress < 100 && (
          <div
            style={{
              height: 3,
              background: "#1a1a2e",
            }}
          >
            <div
              style={{
                width: `${loadProgress}%`,
                height: "100%",
                background: `linear-gradient(90deg, ${BRAND.indigo}, ${BRAND.violet})`,
              }}
            />
          </div>
        )}

        {/* ページコンテンツ */}
        <div
          style={{
            height: "calc(100% - 50px)",
            padding: 30,
            opacity: isNavigating ? interpolate(frame, [enterFrame + 20, enterFrame + 40], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) : 0.3,
          }}
        >
          {isNavigating && loadProgress >= 50 && (
            <>
              <div
                style={{
                  fontFamily: fontFamily,
                  fontSize: 24,
                  fontWeight: 600,
                  color: BRAND.text,
                  marginBottom: 20,
                }}
              >
                {title}
              </div>
              <div style={{ display: "flex", gap: 20 }}>
                <div style={{ flex: 1, height: 150, background: "#1e1e30", borderRadius: 8 }} />
                <div style={{ flex: 1, height: 150, background: "#1e1e30", borderRadius: 8 }} />
              </div>
            </>
          )}

          {!isNavigating && (
            <div
              style={{
                fontFamily: fontFamily,
                fontSize: 16,
                color: "#334155",
                textAlign: "center",
                marginTop: 100,
              }}
            >
              Enter URL to navigate...
            </div>
          )}
        </div>
      </div>

      {/* キーボードヒント */}
      <div
        style={{
          position: "absolute",
          left: 100,
          bottom: 30,
          display: "flex",
          alignItems: "center",
          gap: 10,
          opacity: isNavigating ? 1 : interpolate(frame, [typingStart + 50, typingStart + 60], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
        }}
      >
        <div
          style={{
            padding: "6px 12px",
            background: "#1e1e30",
            borderRadius: 6,
            fontFamily: fontFamily,
            fontSize: 12,
            color: "#64748b",
          }}
        >
          {isNavigating ? "Loading..." : "Press Enter ↵"}
        </div>
      </div>
    </AbsoluteFill>
  );
};
