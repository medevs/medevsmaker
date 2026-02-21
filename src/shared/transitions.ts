import { fade } from "@remotion/transitions/fade";
import { slide } from "@remotion/transitions/slide";
import { wipe } from "@remotion/transitions/wipe";
import { clockWipe } from "@remotion/transitions/clock-wipe";

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
} as const;

export type TransitionName = keyof typeof TRANSITIONS;
