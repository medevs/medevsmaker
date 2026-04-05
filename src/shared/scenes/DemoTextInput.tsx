/**
 * DemoTextInput - テキスト入力デモ
 */

import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { BRAND, DEFAULT_SCENE_COLORS, type SceneColors, baseTokens } from "../styles";
import { useLayoutMode } from "../formats";
import { loadFont } from "@remotion/google-fonts/Inter";
const { fontFamily } = loadFont();

export const DemoTextInput = ({ placeholder = "Email Address", typedText, label = "Create Account", startDelay = 0, colors: colorsProp, sectionColor }: {
  placeholder?: string;
  typedText?: string;
  label?: string;
  startDelay?: number;
  colors?: SceneColors;
  sectionColor?: string;
}) => {
  const frame = useCurrentFrame();
  const { contentPadding, fontScale } = useLayoutMode();

  // タイピングアニメーション
  const text1 = typedText ?? "hello@example.com";
  const text2 = "Welcome to our platform";

  const typing1Start = startDelay + 20;
  const typing1Chars = Math.floor(interpolate(frame, [typing1Start, typing1Start + 50], [0, text1.length], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }));

  const typing2Start = startDelay + 90;
  const typing2Chars = Math.floor(interpolate(frame, [typing2Start, typing2Start + 70], [0, text2.length], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }));

  // カーソル点滅
  const colors = { ...DEFAULT_SCENE_COLORS, ...colorsProp };
  const accent = sectionColor || colors.accent;
  const sceneEntrance = interpolate(frame, [0, 3], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const cursorVisible = Math.floor(frame / 15) % 2 === 0;

  // 入力フィールドフォーカス
  const field1Focused = frame >= typing1Start && frame < typing2Start;
  const field2Focused = frame >= typing2Start;

  return (
    <AbsoluteFill style={{ background: colors.bg, opacity: sceneEntrance }}>
      {/* フォームコンテナ */}
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "50%",
          transform: "translate(-50%, -50%)",
          width: 450,
        }}
      >
        <div
          style={{
            fontFamily: fontFamily,
            fontSize: Math.round(24 * fontScale),
            fontWeight: 700,
            color: colors.text,
            marginBottom: 30,
          }}
        >
          {label}
        </div>

        {/* Email入力フィールド */}
        <div style={{ marginBottom: 25 }}>
          <div
            style={{
              fontFamily: fontFamily,
              fontSize: Math.round(13 * fontScale),
              color: BRAND.textMuted,
              marginBottom: 8,
            }}
          >
            {placeholder}
          </div>
          <div
            style={{
              background: BRAND.bgLight,
              border: `2px solid ${field1Focused ? accent : BRAND.border}`,
              borderRadius: baseTokens.borderRadius.sm,
              padding: "14px 16px",
              display: "flex",
              alignItems: "center",
            }}
          >
            <span style={{ fontFamily: fontFamily, fontSize: Math.round(15 * fontScale), color: colors.text }}>
              {text1.slice(0, typing1Chars)}
            </span>
            {field1Focused && cursorVisible && (
              <span style={{ width: 2, height: 18, background: accent, marginLeft: 1 }} />
            )}
          </div>
        </div>

        {/* メッセージ入力フィールド */}
        <div style={{ marginBottom: 25 }}>
          <div
            style={{
              fontFamily: fontFamily,
              fontSize: Math.round(13 * fontScale),
              color: BRAND.textMuted,
              marginBottom: 8,
            }}
          >
            Welcome Message
          </div>
          <div
            style={{
              background: BRAND.bgLight,
              border: `2px solid ${field2Focused ? accent : BRAND.border}`,
              borderRadius: baseTokens.borderRadius.sm,
              padding: "14px 16px",
              minHeight: 80,
            }}
          >
            <span style={{ fontFamily: fontFamily, fontSize: Math.round(15 * fontScale), color: colors.text }}>
              {text2.slice(0, typing2Chars)}
            </span>
            {field2Focused && cursorVisible && (
              <span
                style={{
                  display: "inline-block",
                  width: 2,
                  height: 18,
                  background: accent,
                  marginLeft: 1,
                  verticalAlign: "middle",
                }}
              />
            )}
          </div>
        </div>

        {/* 送信ボタン */}
        <button
          type="button"
          style={{
            width: "100%",
            fontFamily: fontFamily,
            fontSize: Math.round(15 * fontScale),
            fontWeight: 600,
            color: colors.text,
            background: accent,
            border: "none",
            borderRadius: baseTokens.borderRadius.sm,
            padding: "14px 0",
            opacity: typing2Chars === text2.length ? 1 : 0.5,
          }}
        >
          Continue
        </button>
      </div>

      {/* キーボードインジケーター */}
      <div
        style={{
          position: "absolute",
          left: 60,
          bottom: 60,
          display: "flex",
          gap: 6,
        }}
      >
        {["⌘", "⇧", "A"].map((key, i) => (
          <div
            key={`key-${key}`}
            style={{
              width: 32,
              height: 32,
              background: BRAND.cardBg,
              borderRadius: baseTokens.borderRadius.sm,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontFamily: fontFamily,
              fontSize: Math.round(14 * fontScale),
              color: BRAND.textMuted,
              opacity: interpolate(frame, [startDelay + i * 5, startDelay + 15 + i * 5], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
            }}
          >
            {key}
          </div>
        ))}
      </div>
    </AbsoluteFill>
  );
};
