/**
 * BackgroundWaves - Wave pattern background
 */

import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate } from "remotion";
import { BRAND } from "../../styles";
import { loadFont } from "@remotion/google-fonts/Inter";

const { fontFamily } = loadFont();

export const BackgroundWaves = ({
  startDelay = 0,
  text = "WAVES",
  colors,
}: {
  startDelay?: number;
  text?: string;
  colors?: string[];
}) => {
  const frame = useCurrentFrame();
  const { width } = useVideoConfig();

  const waveColors = colors ?? [BRAND.indigo, BRAND.violet, BRAND.cyan];

  const generateWavePath = (offset: number, amplitude: number, frequency: number) => {
    let path = "M 0 360";
    for (let x = 0; x <= width; x += 10) {
      const y = 360 + Math.sin((x * frequency + (frame - startDelay) * 2 + offset) * 0.01) * amplitude;
      path += ` L ${x} ${y}`;
    }
    path += ` L ${width} 720 L 0 720 Z`;
    return path;
  };

  return (
    <AbsoluteFill style={{ background: "#0f0f1a" }}>
      <svg
        width="100%"
        height="100%"
        style={{ position: "absolute" }}
        aria-hidden="true"
      >
        {/* Wave 1 (back) */}
        <path
          d={generateWavePath(0, 40, 1)}
          fill={waveColors[0]}
          opacity={0.3}
        />
        {/* Wave 2 (middle) */}
        <path
          d={generateWavePath(100, 50, 1.5)}
          fill={waveColors[1] ?? waveColors[0]}
          opacity={0.4}
        />
        {/* Wave 3 (front) */}
        <path
          d={generateWavePath(200, 60, 2)}
          fill={waveColors[2] ?? waveColors[0]}
          opacity={0.5}
        />
      </svg>

      {/* Text */}
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "30%",
          transform: "translateX(-50%)",
          fontFamily,
          fontSize: 80,
          fontWeight: 800,
          color: BRAND.text,
          opacity: interpolate(frame, [startDelay, startDelay + 30], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
        }}
      >
        {text}
      </div>
    </AbsoluteFill>
  );
};
