/**
 * BackgroundBokeh - Bokeh effect background
 */

import React from "react";
import { AbsoluteFill, useCurrentFrame, random, interpolate } from "remotion";
import { BRAND, DEFAULT_SCENE_COLORS, type SceneColors } from "../../styles";
import { loadFont } from "@remotion/google-fonts/Inter";

const { fontFamily } = loadFont();

export const BackgroundBokeh = ({
  startDelay = 0,
  colors,
  sceneColors: sceneColorsProp,
  sectionColor,
}: {
  startDelay?: number;
  colors?: string[];
  sceneColors?: SceneColors;
  sectionColor?: string;
}) => {
  const frame = useCurrentFrame();
  const sc = { ...DEFAULT_SCENE_COLORS, ...sceneColorsProp };

  const defaultColors = [BRAND.indigo, BRAND.violet, BRAND.cyan, BRAND.amber];
  const bokehColors = colors ?? defaultColors;

  const bokehCount = 20;
  const bokehs = React.useMemo(() => {
    return Array.from({ length: bokehCount }).map((_, i) => ({
      id: `bokeh-${i}`,
      x: random(`bokeh-x-${i}`) * 100,
      y: random(`bokeh-y-${i}`) * 100,
      size: random(`bokeh-s-${i}`) * 150 + 50,
      color: bokehColors[i % bokehColors.length],
      speedX: (random(`bokeh-sx-${i}`) - 0.5) * 0.3,
      speedY: (random(`bokeh-sy-${i}`) - 0.5) * 0.3,
    }));
  }, [bokehColors]);

  return (
    <AbsoluteFill style={{ background: sc.bg }}>
      {bokehs.map((bokeh) => {
        const x = (bokeh.x + (frame - startDelay) * bokeh.speedX) % 120 - 10;
        const y = (bokeh.y + (frame - startDelay) * bokeh.speedY) % 120 - 10;
        const pulse = 0.8 + Math.sin((frame - startDelay) * 0.05 + bokeh.x) * 0.2;

        return (
          <div
            key={bokeh.id}
            style={{
              position: "absolute",
              left: `${x}%`,
              top: `${y}%`,
              width: bokeh.size * pulse,
              height: bokeh.size * pulse,
              background: `radial-gradient(circle, ${bokeh.color}60 0%, transparent 70%)`,
              borderRadius: "50%",
              filter: "blur(30px)",
              opacity: interpolate(frame, [startDelay, startDelay + 30], [0, 0.6], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
              }),
            }}
          />
        );
      })}

      {/* Text overlay */}
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "50%",
          transform: "translate(-50%, -50%)",
          fontFamily,
          fontSize: 80,
          fontWeight: 700,
          color: sc.text,
          opacity: interpolate(frame, [startDelay + 20, startDelay + 50], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
        }}
      >
        BOKEH
      </div>
    </AbsoluteFill>
  );
};
