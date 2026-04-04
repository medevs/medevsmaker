/**
 * DemoScroll - 画面スクロールデモ
 */

import { AbsoluteFill, interpolate, Easing, useCurrentFrame } from "remotion";
import { BRAND, DEFAULT_SCENE_COLORS, type SceneColors } from "../../styles";
import { loadFont } from "@remotion/google-fonts/Inter";
const { fontFamily } = loadFont();

export const DemoScroll = ({ title = "SCROLL", startDelay = 0, colors: colorsProp, sectionColor }: {
  title?: string;
  startDelay?: number;
  colors?: SceneColors;
  sectionColor?: string;
}) => {
  const frame = useCurrentFrame();

  // スクロール量
  const colors = { ...DEFAULT_SCENE_COLORS, ...colorsProp };
  const accent = sectionColor || colors.accent;

  const scrollY = interpolate(frame, [startDelay + 20, startDelay + 80], [0, 400], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.bezier(0.4, 0, 0.2, 1) });

  // ダミーコンテンツ
  const items = Array.from({ length: 8 }, (_, i) => ({
    id: `item-${i}`,
    title: `Section ${i + 1}`,
    height: 120 + (i % 3) * 40,
  }));

  return (
    <AbsoluteFill style={{ background: colors.bg }}>
      {/* Browser frame */}
      <div
        style={{
          position: "absolute",
          left: 100,
          top: 60,
          right: 100,
          bottom: 60,
          background: BRAND.bgLight,
          borderRadius: 12,
          overflow: "hidden",
          border: `1px solid ${BRAND.cardBg}`,
        }}
      >
        {/* ブラウザヘッダー */}
        <div
          style={{
            height: 40,
            background: BRAND.cardBg,
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
              background: BRAND.border,
              borderRadius: 4,
              display: "flex",
              alignItems: "center",
              padding: "0 12px",
            }}
          >
            {/* intentional: simulates browser URL bar */}
            <span style={{ fontFamily: fontFamily, fontSize: 12, color: BRAND.textMuted }}>
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
                  background: BRAND.cardBg,
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
                    background: BRAND.border,
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
              background: BRAND.cardBg,
              borderRadius: 3,
            }}
          >
            <div
              style={{
                width: "100%",
                height: 80,
                background: BRAND.textMuted,
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
            /* intentional: simulates scroll indicator UI */
            fontSize: 11,
            color: colors.muted,
            letterSpacing: 1,
            writingMode: "vertical-rl",
          }}
        >
          {title}
        </div>
        <svg width="20" height="30" viewBox="0 0 20 30" fill="none" aria-hidden="true">
          <rect x="1" y="1" width="18" height="28" rx="9" stroke={BRAND.textMuted} strokeWidth="2" />
          <circle
            cx="10"
            cy={8 + interpolate(frame, [startDelay + 20, startDelay + 80], [0, 12], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })}
            r="3"
            fill={accent}
          />
        </svg>
      </div>
    </AbsoluteFill>
  );
};
