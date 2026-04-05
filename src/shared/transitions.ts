import { interpolate } from "remotion";
import { fade } from "@remotion/transitions/fade";
import { slide } from "@remotion/transitions/slide";
import { wipe } from "@remotion/transitions/wipe";
import { clockWipe } from "@remotion/transitions/clock-wipe";
import { flip } from "@remotion/transitions/flip";

/**
 * Create a clockWipe transition for the given dimensions.
 * Use this for non-standard resolutions (e.g., portrait 1080x1920).
 */
export const createClockWipe = (width: number, height: number) => ({
  durationInFrames: 25,
  presentation: clockWipe({ width, height }),
});

/**
 * Centralized transition presets.
 *
 * Usage with TransitionSeries:
 *   <TransitionSeries.Transition
 *     presentation={TRANSITIONS.slideLeft.presentation}
 *     timing={linearTiming({ durationInFrames: TRANSITIONS.slideLeft.durationInFrames })}
 *   />
 */
export const TRANSITIONS = {
  fade: {
    durationInFrames: 15,
    presentation: fade(),
  },
  slideLeft: {
    durationInFrames: 20,
    presentation: slide({ direction: "from-left" }),
  },
  slideRight: {
    durationInFrames: 20,
    presentation: slide({ direction: "from-right" }),
  },
  slideUp: {
    durationInFrames: 20,
    presentation: slide({ direction: "from-bottom" }),
  },
  slideDown: {
    durationInFrames: 20,
    presentation: slide({ direction: "from-top" }),
  },
  wipeRight: {
    durationInFrames: 18,
    presentation: wipe({ direction: "from-left" }),
  },
  clockWipe: {
    durationInFrames: 25,
    presentation: clockWipe({ width: 1920, height: 1080 }),
  },
  /** Spring-timed fade with longer duration for smooth feel */
  springFade: {
    durationInFrames: 25,
    presentation: fade(),
  },
  /** Short fade for shorts — preserves content time */
  shortFade: {
    durationInFrames: 8,
    presentation: fade(),
  },
  /** Dramatic 3D flip transition for major scene changes */
  flip: {
    durationInFrames: 20,
    presentation: flip(),
  },
} as const;

export type TransitionName = keyof typeof TRANSITIONS;

/**
 * Light leak overlay presets for TransitionSeries.
 *
 * Usage: Render as a semi-transparent overlay between scenes using
 * a custom component in <Sequence> layered above the transition.
 * Light leaks add cinematic polish — use 1-2 per video max.
 *
 * These are NOT TransitionSeries.Transition presentations.
 * They define timing + color for overlay effects rendered alongside transitions.
 */
export const OVERLAYS = {
  lightLeak: {
    durationInFrames: 30,
    hueShift: 0,
  },
  lightLeakBlue: {
    durationInFrames: 30,
    hueShift: 240,
  },
  lightLeakCyan: {
    durationInFrames: 30,
    hueShift: 180,
  },
} as const;

export type OverlayName = keyof typeof OVERLAYS;

/**
 * Full-screen flash overlay utility.
 * Returns { opacity, background } style for a frame-based flash effect.
 * Use as a Sequence overlaid on transition boundaries.
 */
export const flashOverlay = (
  frame: number,
  startFrame: number,
  color: string = "#ffffff",
  durationFrames: number = 10,
): { opacity: number; background: string } => {
  const mid = startFrame + durationFrames / 2;
  const intensity =
    frame >= startFrame && frame < startFrame + durationFrames
      ? interpolate(
          frame,
          [startFrame, mid, startFrame + durationFrames],
          [0, 1, 0],
          { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
        )
      : 0;
  return { opacity: intensity, background: color };
};
