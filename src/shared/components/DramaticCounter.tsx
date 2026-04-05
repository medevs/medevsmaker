import React from "react";
import { useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";
import { BRAND, SCENE_DEFAULTS, SHADOWS, baseTokens } from "../styles";

type DramaticCounterProps = {
  target: number;
  suffix?: string;
  prefix?: string;
  label: string;
  mode?: "spring" | "slot" | "splitFlap" | "countdown";
  color?: string;
  delay?: number;
  fontSize?: number;
  fontFamily?: string;
};

/* ------------------------------------------------------------------ */
/*  spring mode — simple interpolated counter                         */
/* ------------------------------------------------------------------ */

const SpringCounter: React.FC<{
  target: number;
  prefix: string;
  suffix: string;
  color: string;
  delay: number;
  fontSize: number;
  fontFamily: string;
}> = ({ target, prefix, suffix, color, delay, fontSize, fontFamily }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const progress = spring({
    frame: frame - delay,
    fps,
    config: SCENE_DEFAULTS.springSmooth,
  });

  const displayNumber = Math.round(
    interpolate(progress, [0, 1], [0, target], {
      extrapolateRight: "clamp",
    }),
  );

  const scale = interpolate(
    spring({
      frame: frame - delay,
      fps,
      config: SCENE_DEFAULTS.springSnappy,
    }),
    [0, 1],
    [0.8, 1],
    { extrapolateRight: "clamp" },
  );

  return (
    <div
      style={{
        fontFamily,
        fontSize,
        fontWeight: 800,
        color,
        transform: `scale(${scale})`,
        lineHeight: 1,
        textShadow: SHADOWS.glow(color),
      }}
    >
      {prefix}
      {displayNumber.toLocaleString()}
      {suffix}
    </div>
  );
};

/* ------------------------------------------------------------------ */
/*  slot mode — vertical scroll slot-machine technique                */
/* ------------------------------------------------------------------ */

const SlotCounter: React.FC<{
  target: number;
  prefix: string;
  suffix: string;
  color: string;
  delay: number;
  fontSize: number;
  fontFamily: string;
}> = ({ target, prefix, suffix, color, delay, fontSize, fontFamily }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const lineHeight = fontSize * 1.2;
  const cycleDuration = 12;
  // Build a list of numbers to cycle through before landing on target
  const steps = Math.min(Math.max(Math.ceil(target / 3), 4), 12);
  const numbers: number[] = [];
  for (let i = 0; i < steps; i++) {
    numbers.push(Math.round((target / steps) * (i + 1)));
  }
  // Ensure the final value is the target
  numbers[numbers.length - 1] = target;
  const finalIndex = numbers.length - 1;

  const t = frame - delay;
  const rawIndex = t / cycleDuration;
  const currentIndex = Math.min(Math.floor(Math.max(rawIndex, 0)), finalIndex);
  const nextIndex = Math.min(currentIndex + 1, finalIndex);

  const cycleT =
    currentIndex >= finalIndex ? cycleDuration : Math.max(t, 0) % cycleDuration;

  const spinProgress = spring({
    frame: cycleT,
    fps,
    config: { damping: 15, stiffness: 300 },
  });

  const offsetY =
    currentIndex >= finalIndex || t < 0
      ? 0
      : (1 - spinProgress) * lineHeight;

  const currentValue = t < 0 ? 0 : numbers[currentIndex];
  const nextValue = numbers[nextIndex];

  return (
    <div
      style={{
        height: lineHeight,
        overflow: "hidden",
        position: "relative",
      }}
    >
      <div
        style={{
          fontFamily,
          fontSize,
          fontWeight: 800,
          color,
          height: lineHeight,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transform: `translateY(${offsetY}px)`,
          textShadow: SHADOWS.glow(color),
        }}
      >
        {prefix}
        {currentValue.toLocaleString()}
        {suffix}
      </div>

      {currentIndex < finalIndex && t >= 0 && (
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            fontFamily,
            fontSize,
            fontWeight: 800,
            color,
            height: lineHeight,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transform: `translateY(${offsetY - lineHeight}px)`,
            textShadow: SHADOWS.glow(color),
          }}
        >
          {prefix}
          {nextValue.toLocaleString()}
          {suffix}
        </div>
      )}
    </div>
  );
};

/* ------------------------------------------------------------------ */
/*  splitFlap mode — airport departure board aesthetic                 */
/* ------------------------------------------------------------------ */

const SplitFlapCounter: React.FC<{
  target: number;
  prefix: string;
  suffix: string;
  color: string;
  delay: number;
  fontSize: number;
  fontFamily: string;
}> = ({ target, prefix, suffix, color, delay, fontSize, fontFamily }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const displayStr = `${prefix}${target.toLocaleString()}${suffix}`;
  const chars = displayStr.split("");
  const t = frame - delay;

  // Overall reveal progress — spring for the whole board
  const boardProgress = spring({
    frame: Math.max(t, 0),
    fps,
    config: { damping: 20, stiffness: 400 },
  });

  // Card dimensions scale with fontSize
  const cardW = Math.round(fontSize * 0.42);
  const cardH = Math.round(fontSize * 0.58);
  const charSize = Math.round(fontSize * 0.4);

  return (
    <div
      style={{
        display: "flex",
        gap: 6,
        background: "rgba(0, 0, 0, 0.6)",
        padding: `${Math.round(cardH * 0.28)}px ${Math.round(cardW * 0.6)}px`,
        borderRadius: baseTokens.borderRadius.sm,
      }}
    >
      {chars.map((char, charIdx) => {
        const charDelay = charIdx * 0.1;
        const charFlap = Math.max(0, boardProgress - charDelay);

        return (
          <div
            key={`flap-${charIdx}`}
            style={{
              width: cardW,
              height: cardH,
              background: "#1f2937",
              borderRadius: baseTokens.borderRadius.sm,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontFamily,
              fontSize: charSize,
              fontWeight: 700,
              color,
              position: "relative",
              overflow: "hidden",
              boxShadow:
                "inset 0 1px 0 rgba(255,255,255,0.1), 0 2px 4px rgba(0,0,0,0.3)",
            }}
          >
            {/* Center divider line */}
            <div
              style={{
                position: "absolute",
                left: 0,
                right: 0,
                top: "50%",
                height: 2,
                background: "#000000",
                transform: "translateY(-50%)",
                zIndex: 1,
              }}
            />

            {/* Character with flip */}
            <span
              style={{
                transform: `rotateX(${(1 - charFlap) * 90}deg)`,
                transformOrigin: "center",
              }}
            >
              {char}
            </span>
          </div>
        );
      })}
    </div>
  );
};

/* ------------------------------------------------------------------ */
/*  countdown mode — counts DOWN from large number, decelerating      */
/* ------------------------------------------------------------------ */

const CountdownCounter: React.FC<{
  target: number;
  prefix: string;
  suffix: string;
  color: string;
  delay: number;
  fontSize: number;
  fontFamily: string;
}> = ({ target, prefix, suffix, color, delay, fontSize, fontFamily }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const t = Math.max(frame - delay, 0);
  // Duration in frames for the countdown (about 2 seconds)
  const countdownDuration = fps * 2;
  // Start from a number significantly larger than target
  const startValue = target * 10 + 999;

  // Use an easing curve (cubic ease-out) so it decelerates toward the end
  const rawProgress = Math.min(t / countdownDuration, 1);
  const easedProgress = 1 - Math.pow(1 - rawProgress, 3);

  const displayNumber = Math.round(
    interpolate(easedProgress, [0, 1], [startValue, target], {
      extrapolateRight: "clamp",
    }),
  );

  const scale = interpolate(
    spring({
      frame: t,
      fps,
      config: SCENE_DEFAULTS.springSnappy,
    }),
    [0, 1],
    [0.8, 1],
    { extrapolateRight: "clamp" },
  );

  // Flash effect when settling on final number
  const settled = rawProgress >= 1;
  const settleGlow = settled
    ? interpolate(
        spring({
          frame: t - countdownDuration,
          fps,
          config: SCENE_DEFAULTS.springBouncy,
        }),
        [0, 1],
        [1, 0],
        { extrapolateRight: "clamp" },
      )
    : 0;

  return (
    <div
      style={{
        fontFamily,
        fontSize,
        fontWeight: 800,
        color,
        transform: `scale(${scale})`,
        lineHeight: 1,
        textShadow: settled
          ? `0 0 ${20 + settleGlow * 40}px ${color}88, 0 0 ${40 + settleGlow * 60}px ${color}44`
          : SHADOWS.glow(color),
      }}
    >
      {prefix}
      {displayNumber.toLocaleString()}
      {suffix}
    </div>
  );
};

/* ------------------------------------------------------------------ */
/*  Main DramaticCounter component                                    */
/* ------------------------------------------------------------------ */

export const DramaticCounter: React.FC<DramaticCounterProps> = ({
  target,
  suffix = "",
  prefix = "",
  label,
  mode = "spring",
  color = BRAND.cyan,
  delay = 0,
  fontSize = baseTokens.fontSizes.display,
  fontFamily = "Inter",
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Safety: coerce string values to numbers
  const safeTarget =
    typeof target === "string" ? parseFloat(target) || 0 : target;

  // Label fade-up entrance (delayed after counter starts)
  const labelProgress = spring({
    frame: frame - delay - 15,
    fps,
    config: SCENE_DEFAULTS.springSmooth,
  });
  const labelOpacity = interpolate(labelProgress, [0, 1], [0, 1], {
    extrapolateRight: "clamp",
  });
  const labelY = interpolate(labelProgress, [0, 1], [15, 0], {
    extrapolateRight: "clamp",
  });

  const counterProps = {
    target: safeTarget,
    prefix,
    suffix,
    color,
    delay,
    fontSize,
    fontFamily,
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 12,
      }}
    >
      {mode === "spring" && <SpringCounter {...counterProps} />}
      {mode === "slot" && <SlotCounter {...counterProps} />}
      {mode === "splitFlap" && <SplitFlapCounter {...counterProps} />}
      {mode === "countdown" && <CountdownCounter {...counterProps} />}

      <div
        style={{
          opacity: labelOpacity,
          transform: `translateY(${labelY}px)`,
          fontFamily,
          fontSize: baseTokens.fontSizes.md,
          color: BRAND.textMuted,
          letterSpacing: 1,
        }}
      >
        {label}
      </div>
    </div>
  );
};
