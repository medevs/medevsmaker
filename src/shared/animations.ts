import { Easing, interpolate } from "remotion";
import { SHADOWS } from "./styles";

/**
 * Named easing presets wrapping Remotion's Easing module.
 */
export const EASINGS = {
  smooth: Easing.bezier(0.25, 0.1, 0.25, 1),
  snappy: Easing.bezier(0.16, 1, 0.3, 1),
  decelerate: Easing.out(Easing.cubic),
  accelerate: Easing.in(Easing.cubic),
  overshoot: Easing.bezier(0.34, 1.56, 0.64, 1),
  elastic: Easing.elastic(1),
} as const;

/**
 * Entrance animation functions.
 * Each returns { opacity, transform } for a given progress (0-1).
 */
export const entrances = {
  fadeUp: (progress: number) => ({
    opacity: progress,
    transform: `translateY(${interpolate(progress, [0, 1], [30, 0], {
      extrapolateRight: "clamp",
    })}px)`,
  }),
  fadeDown: (progress: number) => ({
    opacity: progress,
    transform: `translateY(${interpolate(progress, [0, 1], [-30, 0], {
      extrapolateRight: "clamp",
    })}px)`,
  }),
  fadeLeft: (progress: number) => ({
    opacity: progress,
    transform: `translateX(${interpolate(progress, [0, 1], [-40, 0], {
      extrapolateRight: "clamp",
    })}px)`,
  }),
  fadeRight: (progress: number) => ({
    opacity: progress,
    transform: `translateX(${interpolate(progress, [0, 1], [40, 0], {
      extrapolateRight: "clamp",
    })}px)`,
  }),
  scaleUp: (progress: number) => ({
    opacity: progress,
    transform: `scale(${interpolate(progress, [0, 1], [0.8, 1], {
      extrapolateRight: "clamp",
    })})`,
  }),
  scaleRotate: (progress: number) => ({
    opacity: progress,
    transform: `scale(${interpolate(progress, [0, 1], [0.6, 1], {
      extrapolateRight: "clamp",
    })}) rotate(${interpolate(progress, [0, 1], [-5, 0], {
      extrapolateRight: "clamp",
    })}deg)`,
  }),
  blurFade: (progress: number) => ({
    opacity: progress,
    transform: `scale(${interpolate(progress, [0, 1], [1.05, 1], {
      extrapolateRight: "clamp",
    })})`,
    filter: `blur(${interpolate(progress, [0, 1], [8, 0], {
      extrapolateRight: "clamp",
    })}px)`,
  }),
} as const;

export type EntranceName = keyof typeof entrances;

/**
 * Sine-wave pulse for subtle continuous effects.
 * Returns a value oscillating around 0 with the given amplitude.
 */
export const pulse = (
  frame: number,
  period: number = 60,
  amplitude: number = 1
): number => {
  return Math.sin((frame / period) * Math.PI * 2) * amplitude;
};

/**
 * Animated boxShadow string for pulsing glow effect.
 */
export const glowPulse = (
  frame: number,
  color: string,
  period: number = 60
): string => {
  const intensity = 0.5 + 0.5 * Math.sin((frame / period) * Math.PI * 2);
  const r1 = Math.round(20 + intensity * 15);
  const r2 = Math.round(40 + intensity * 20);
  const a1 = Math.round(40 + intensity * 40)
    .toString(16)
    .padStart(2, "0");
  const a2 = Math.round(20 + intensity * 30)
    .toString(16)
    .padStart(2, "0");
  return `0 0 ${r1}px ${color}${a1}, 0 0 ${r2}px ${color}${a2}`;
};
