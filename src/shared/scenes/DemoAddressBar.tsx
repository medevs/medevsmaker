/**
 * DemoAddressBar - ブラウザアドレスバーデモ
 */

import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { BRAND, DEFAULT_SCENE_COLORS, type SceneColors, baseTokens } from "../styles";
import { useLayoutMode } from "../formats";
import { loadFont } from "@remotion/google-fonts/Inter";
const { fontFamily } = loadFont();

export const DemoAddressBar = ({ url: urlProp, title = "Dashboard", startDelay = 0, colors: colorsProp, sectionColor }: {
  url?: string;
  title?: string;
  startDelay?: number;
  colors?: SceneColors;
  sectionColor?: string;
}) => {
  const frame = useCurrentFrame();
  const { contentPadding, fontScale } = useLayoutMode();

  // URL入力
  const url = urlProp ?? "app.example.com/dashboard";
  const typingStart = startDelay + 20;
  const typedChars = Math.floor(interpolate(frame, [typingStart, typingStart + 60], [0, url.length], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }));

  // Enter押下
  const enterFrame = startDelay + 90;
  const isNavigating = frame >= enterFrame;

  const colors = { ...DEFAULT_SCENE_COLORS, ...colorsProp };
  const accent = sectionColor || colors.accent;

  // Page load
  const loadProgress = interpolate(frame, [enterFrame, enterFrame + 30], [0, 100], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ background: colors.bg }}>
      {/* ブラウザウィンドウ */}
      <div
        style={{
          position: "absolute",
          left: 80,
          top: 60,
          right: 80,
          bottom: 60,
          background: BRAND.bgLight,
          borderRadius: baseTokens.borderRadius.md,
          overflow: "hidden",
          border: `1px solid ${BRAND.cardBg}`,
        }}
      >
        {/* ブラウザヘッダー */}
        <div
          style={{
            height: 50,
            background: BRAND.cardBg,
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

          {/* Navigation buttons */}
          <div style={{ display: "flex", gap: 10 }}>
            <span style={{ color: BRAND.textMuted, fontSize: Math.round(20 * fontScale) }}>←</span>
            <span style={{ color: BRAND.border, fontSize: Math.round(20 * fontScale) }}>→</span>
          </div>

          {/* アドレスバー */}
          <div
            style={{
              flex: 1,
              height: 32,
              background: BRAND.border,
              borderRadius: 6,
              display: "flex",
              alignItems: "center",
              padding: "0 12px",
              gap: 8,
              border: typedChars > 0 && !isNavigating ? `1px solid ${accent}` : "1px solid transparent",
            }}
          >
            {/* HTTPS アイコン */}
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
              <rect x="2" y="6" width="10" height="7" rx="1" stroke={BRAND.textMuted} strokeWidth="1.5" />
              <path d="M4 6V4a3 3 0 116 0v2" stroke={BRAND.textMuted} strokeWidth="1.5" strokeLinecap="round" />
            </svg>

            {/* intentional: simulates browser UI */}
            <span style={{ fontFamily: fontFamily, fontSize: Math.round(13 * fontScale), color: colors.text }}>
              {url.slice(0, typedChars)}
            </span>

            {!isNavigating && Math.floor(frame / 15) % 2 === 0 && (
              <span style={{ width: 1, height: 14, background: accent }} />
            )}
          </div>

          {/* 更新ボタン */}
          <span
            style={{
              color: BRAND.textMuted,
              fontSize: Math.round(20 * fontScale),
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
              background: BRAND.bgLight,
            }}
          >
            <div
              style={{
                width: `${loadProgress}%`,
                height: "100%",
                background: `linear-gradient(90deg, ${accent}, ${BRAND.violet})`,
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
                  fontSize: Math.round(24 * fontScale),
                  fontWeight: 600,
                  color: colors.text,
                  marginBottom: 20,
                }}
              >
                {title}
              </div>
              <div style={{ display: "flex", gap: 20 }}>
                <div style={{ flex: 1, height: 150, background: BRAND.cardBg, borderRadius: baseTokens.borderRadius.sm }} />
                <div style={{ flex: 1, height: 150, background: BRAND.cardBg, borderRadius: baseTokens.borderRadius.sm }} />
              </div>
            </>
          )}

          {!isNavigating && (
            <div
              style={{
                fontFamily: fontFamily,
                /* intentional: simulates browser UI placeholder */
                fontSize: Math.round(16 * fontScale),
                color: BRAND.border,
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
            background: BRAND.cardBg,
            borderRadius: 6,
            fontFamily: fontFamily,
            /* intentional: simulates keyboard hint UI */
            fontSize: Math.round(12 * fontScale),
            color: BRAND.textMuted,
          }}
        >
          {isNavigating ? "Loading..." : "Press Enter ↵"}
        </div>
      </div>
    </AbsoluteFill>
  );
};
