import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring, random, Easing } from "remotion";
import { noise2D } from "@remotion/noise";
import { ParticleField, type ParticleConfig } from "./ParticleField";
import { GridPattern } from "./GridPattern";
import { PerspectiveGrid } from "./PerspectiveGrid";
import { BRAND } from "../styles";

type BackgroundVariant =
  | "gradient"
  | "radialGradient"
  | "meshGradient"
  | "aurora"
  | "noiseField"
  | "meshAnimated"
  | "solidWithOrbs"
  | "perspectiveGrid"
  | "bokeh"
  // New variants (demoted from extended scenes)
  | "floatingBokeh"
  | "sineWaves"
  | "geometricShapes"
  | "fluidWave"
  | "lightning"
  | "helix"
  | "hexGrid"
  | "matrixRain";

type BackgroundOverlay =
  | "none"
  | "radialGlow"
  | "vignette"
  | "grid"
  | "particles"
  | "lightLeak";

interface BackgroundProps {
  colors: [string, string];
  direction?: number;
  animated?: boolean;
  variant?: BackgroundVariant;
  overlay?: BackgroundOverlay;
  overlayOpacity?: number;
  particles?: ParticleConfig;
  /** Extra brand colors for aurora/bokeh/wave variants */
  auroraColors?: string[];
  /** Extra colors for multi-color variants (floatingBokeh, sineWaves, fluidWave) */
  variantColors?: string[];
}

export const Background: React.FC<BackgroundProps> = ({
  colors,
  direction = 135,
  animated = false,
  variant = "gradient",
  overlay = "none",
  overlayOpacity = 0.5,
  particles,
  auroraColors,
  variantColors,
}) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  const angle = animated
    ? interpolate(frame, [0, 300], [direction, direction + 30], {
        extrapolateRight: "clamp",
      })
    : direction;

  let bgStyle: string;

  if (variant === "radialGradient") {
    bgStyle = `radial-gradient(ellipse at 30% 40%, ${colors[0]}, ${colors[1]})`;
  } else if (variant === "meshGradient") {
    bgStyle = [
      `radial-gradient(ellipse at 20% 30%, ${colors[0]}cc 0%, transparent 50%)`,
      `radial-gradient(ellipse at 80% 70%, ${colors[1]}cc 0%, transparent 50%)`,
      `radial-gradient(ellipse at 50% 50%, ${colors[0]}44 0%, transparent 70%)`,
      `linear-gradient(${angle}deg, ${colors[0]}, ${colors[1]})`,
    ].join(", ");
  } else if (variant === "aurora") {
    const ac = auroraColors ?? [
      BRAND.indigo,
      BRAND.cyan,
      BRAND.violet,
      BRAND.green,
    ];
    const speed = 0.004;
    const layers = ac.map((c, i) => {
      const cx = 20 + i * 20 + noise2D(`ax${i}`, frame * speed, 0) * 15;
      const cy = 25 + i * 15 + noise2D(`ay${i}`, 0, frame * speed) * 15;
      return `radial-gradient(ellipse 50% 40% at ${cx}% ${cy}%, ${c}44 0%, transparent 70%)`;
    });
    bgStyle =
      layers.join(", ") +
      `, linear-gradient(135deg, ${BRAND.bg}, ${BRAND.bgLight})`;
  } else if (variant === "noiseField") {
    bgStyle = `linear-gradient(${angle}deg, ${colors[0]}, ${colors[1]})`;
  } else if (variant === "meshAnimated") {
    const drift1x = 20 + Math.sin(frame * 0.008) * 12;
    const drift1y = 30 + Math.cos(frame * 0.006) * 10;
    const drift2x = 80 - Math.sin(frame * 0.007) * 12;
    const drift2y = 70 - Math.cos(frame * 0.009) * 10;
    bgStyle = [
      `radial-gradient(ellipse at ${drift1x}% ${drift1y}%, ${colors[0]}cc 0%, transparent 50%)`,
      `radial-gradient(ellipse at ${drift2x}% ${drift2y}%, ${colors[1]}cc 0%, transparent 50%)`,
      `radial-gradient(ellipse at 50% 50%, ${colors[0]}44 0%, transparent 70%)`,
      `linear-gradient(${angle}deg, ${colors[0]}, ${colors[1]})`,
    ].join(", ");
  } else if (variant === "fluidWave") {
    bgStyle = `linear-gradient(180deg, ${BRAND.bg} 0%, ${BRAND.bgLight} 100%)`;
  } else if (
    variant === "solidWithOrbs" ||
    variant === "perspectiveGrid" ||
    variant === "bokeh" ||
    variant === "floatingBokeh" ||
    variant === "geometricShapes" ||
    variant === "lightning" ||
    variant === "helix" ||
    variant === "hexGrid" ||
    variant === "matrixRain"
  ) {
    bgStyle = variant === "matrixRain" ? "#001100" : BRAND.bg;
  } else if (variant === "sineWaves") {
    bgStyle = BRAND.bg;
  } else {
    bgStyle = `linear-gradient(${angle}deg, ${colors[0]}, ${colors[1]})`;
  }

  // SVG noise filter frequency for noiseField variant
  const noiseFreq =
    variant === "noiseField"
      ? interpolate(frame, [0, 300], [0.003, 0.006], {
          extrapolateRight: "clamp",
        })
      : 0;

  return (
    <>
      <AbsoluteFill style={{ background: bgStyle }} />

      {variant === "perspectiveGrid" && (
        <PerspectiveGrid color={colors[0]} showHorizon showSun sunColor={colors[1]} />
      )}

      {variant === "bokeh" && (
        <AbsoluteFill style={{ overflow: "hidden" }}>
          {Array.from({ length: 15 }).map((_, i) => {
            const size = 80 + Math.sin(i * 2.1) * 60;
            const x = ((i * 37 + 13) % 100);
            const y = ((i * 53 + 7) % 100);
            const drift = Math.sin(frame * 0.003 + i) * 20;
            const bokehColor = i % 2 === 0 ? colors[0] : colors[1];
            return (
              <div
                key={i}
                style={{
                  position: "absolute",
                  left: `${x}%`,
                  top: `${y}%`,
                  width: size,
                  height: size,
                  borderRadius: "50%",
                  background: `radial-gradient(circle, ${bokehColor}33 0%, transparent 70%)`,
                  filter: `blur(${20 + i * 3}px)`,
                  transform: `translate(-50%, -50%) translateY(${drift}px)`,
                }}
              />
            );
          })}
        </AbsoluteFill>
      )}

      {/* Animated orbs for solidWithOrbs variant */}
      {variant === "solidWithOrbs" && (
        <AbsoluteFill>
          {[colors[0], colors[1], BRAND.violet].map((c, i) => {
            const ox = 25 + i * 25 + Math.sin(frame * 0.005 + i * 2) * 10;
            const oy = 30 + i * 15 + Math.cos(frame * 0.004 + i * 1.5) * 10;
            return (
              <div
                key={i}
                style={{
                  position: "absolute",
                  left: `${ox}%`,
                  top: `${oy}%`,
                  width: 500,
                  height: 500,
                  borderRadius: "50%",
                  background: `radial-gradient(circle, ${c}33 0%, transparent 70%)`,
                  filter: "blur(60px)",
                  transform: "translate(-50%, -50%)",
                }}
              />
            );
          })}
        </AbsoluteFill>
      )}

      {/* SVG feTurbulence overlay for noiseField variant */}
      {variant === "noiseField" && (
        <AbsoluteFill style={{ opacity: 0.15, mixBlendMode: "soft-light" }}>
          <svg width="100%" height="100%">
            <filter id="noise-bg">
              <feTurbulence
                type="fractalNoise"
                baseFrequency={noiseFreq}
                numOctaves={3}
                seed={42}
              />
              <feColorMatrix type="saturate" values="0.3" />
            </filter>
            <rect width="100%" height="100%" filter="url(#noise-bg)" />
          </svg>
        </AbsoluteFill>
      )}

      {/* === NEW VARIANTS (demoted from extended scenes) === */}

      {variant === "floatingBokeh" && <FloatingBokehVariant frame={frame} colors={variantColors ?? [BRAND.indigo, BRAND.violet, BRAND.cyan, BRAND.amber]} />}

      {variant === "sineWaves" && <SineWavesVariant frame={frame} width={width} colors={variantColors ?? [BRAND.indigo, BRAND.violet, BRAND.cyan]} />}

      {variant === "geometricShapes" && <GeometricShapesVariant frame={frame} accent={colors[0]} />}

      {variant === "fluidWave" && <FluidWaveVariant frame={frame} fps={fps} width={width} height={height} colors={variantColors ?? [colors[0], colors[1], BRAND.cyan]} />}

      {variant === "lightning" && <LightningVariant frame={frame} textColor={BRAND.text} />}

      {variant === "helix" && <HelixVariant frame={frame} color={colors[0]} />}

      {variant === "hexGrid" && <HexGridVariant frame={frame} fps={fps} accent={colors[0]} />}

      {variant === "matrixRain" && <MatrixRainVariant frame={frame} height={height} />}

      {/* === OVERLAYS === */}

      {overlay === "radialGlow" && (
        <AbsoluteFill
          style={{
            background: `radial-gradient(circle at 50% 40%, ${colors[1]}44 0%, transparent 70%)`,
            opacity: overlayOpacity,
          }}
        />
      )}

      {overlay === "vignette" && (
        <AbsoluteFill
          style={{
            background:
              "radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,0.6) 100%)",
            opacity: overlayOpacity,
          }}
        />
      )}

      {overlay === "grid" && (
        <GridPattern
          variant="dots"
          color={colors[1]}
          opacity={overlayOpacity * 0.15}
          animated
        />
      )}

      {overlay === "particles" && (
        <ParticleField
          color={colors[1]}
          opacity={overlayOpacity * 0.3}
          {...particles}
        />
      )}

      {overlay === "lightLeak" && (
        <AbsoluteFill
          style={{
            opacity: overlayOpacity * 0.4,
            mixBlendMode: "screen",
          }}
        >
          <AbsoluteFill
            style={{
              background: `radial-gradient(ellipse at ${30 + Math.sin(frame * 0.01) * 20}% ${20 + Math.cos(frame * 0.008) * 15}%, ${colors[0]}55 0%, transparent 50%)`,
            }}
          />
          <AbsoluteFill
            style={{
              background: `radial-gradient(ellipse at ${70 - Math.sin(frame * 0.012) * 15}% ${60 + Math.cos(frame * 0.01) * 20}%, ${colors[1]}44 0%, transparent 60%)`,
            }}
          />
        </AbsoluteFill>
      )}
    </>
  );
};

// === Internal variant components ===

const FloatingBokehVariant: React.FC<{ frame: number; colors: string[] }> = ({ frame, colors }) => {
  const bokehs = React.useMemo(() => {
    return Array.from({ length: 20 }).map((_, i) => ({
      x: random(`bokeh-x-${i}`) * 100,
      y: random(`bokeh-y-${i}`) * 100,
      size: random(`bokeh-s-${i}`) * 150 + 50,
      color: colors[i % colors.length],
      speedX: (random(`bokeh-sx-${i}`) - 0.5) * 0.3,
      speedY: (random(`bokeh-sy-${i}`) - 0.5) * 0.3,
    }));
  }, [colors]);

  const entryOpacity = interpolate(frame, [0, 30], [0, 0.6], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      {bokehs.map((bokeh, i) => {
        const x = (bokeh.x + frame * bokeh.speedX) % 120 - 10;
        const y = (bokeh.y + frame * bokeh.speedY) % 120 - 10;
        const pulse = 0.8 + Math.sin(frame * 0.05 + bokeh.x) * 0.2;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: `${x}%`,
              top: `${y}%`,
              width: bokeh.size * pulse,
              height: bokeh.size * pulse,
              background: `radial-gradient(circle, ${bokeh.color}60 0%, transparent 70%)`,
              borderRadius: "50%",
              filter: "blur(30px)",
              opacity: entryOpacity,
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};

const SineWavesVariant: React.FC<{ frame: number; width: number; colors: string[] }> = ({ frame, width, colors }) => {
  const generateWavePath = (offset: number, amplitude: number, frequency: number) => {
    let path = "M 0 360";
    for (let x = 0; x <= width; x += 10) {
      const y = 360 + Math.sin((x * frequency + frame * 2 + offset) * 0.01) * amplitude;
      path += ` L ${x} ${y}`;
    }
    path += ` L ${width} 720 L 0 720 Z`;
    return path;
  };

  return (
    <svg width="100%" height="100%" style={{ position: "absolute" }} aria-hidden="true">
      <path d={generateWavePath(0, 40, 1)} fill={colors[0]} opacity={0.3} />
      <path d={generateWavePath(100, 50, 1.5)} fill={colors[1] ?? colors[0]} opacity={0.4} />
      <path d={generateWavePath(200, 60, 2)} fill={colors[2] ?? colors[0]} opacity={0.5} />
    </svg>
  );
};

const GeometricShapesVariant: React.FC<{ frame: number; accent: string }> = ({ frame, accent }) => {
  const shapes = React.useMemo(() => {
    return Array.from({ length: 20 }).map((_, i) => ({
      x: random(`geo-x-${i}`) * 100,
      y: random(`geo-y-${i}`) * 100,
      size: random(`geo-s-${i}`) * 100 + 50,
      rotation: random(`geo-r-${i}`) * 360,
      type: Math.floor(random(`geo-t-${i}`) * 3),
      color: [accent, BRAND.violet, BRAND.cyan][i % 3],
      speed: random(`geo-sp-${i}`) * 0.5 + 0.2,
    }));
  }, [accent]);

  const entryOpacity = interpolate(frame, [0, 30], [0, 0.15], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill>
      {shapes.map((shape, i) => {
        const rotation = shape.rotation + frame * shape.speed;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: `${shape.x}%`,
              top: `${shape.y}%`,
              width: shape.size,
              height: shape.size,
              background: shape.type === 0 ? shape.color : "transparent",
              border: shape.type !== 0 ? `2px solid ${shape.color}` : "none",
              borderRadius: shape.type === 1 ? "50%" : 0,
              transform: `translate(-50%, -50%) rotate(${rotation}deg)`,
              opacity: entryOpacity,
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};

const FluidWaveVariant: React.FC<{
  frame: number; fps: number; width: number; height: number; colors: string[];
}> = ({ frame, fps, width, height, colors }) => {
  const waveOffset = frame * 4;
  const accent = colors[0];
  const secondary = colors[1] ?? BRAND.violet;
  const tertiary = colors[2] ?? BRAND.cyan;

  const generateComplexWave = (yBase: number, amplitude: number, frequency: number, phase: number, noiseStrength = 0.3) => {
    const points: string[] = [];
    const steps = 80;
    for (let i = 0; i <= steps; i++) {
      const x = (i / steps) * width;
      const t = (waveOffset + phase) * 0.05;
      const y = yBase + Math.sin((x * frequency) / 100 + t) * amplitude +
        Math.sin((x * frequency * 1.5) / 100 + t * 1.3) * (amplitude * 0.4) +
        Math.cos((x * frequency * 0.7) / 100 + t * 0.8) * (amplitude * noiseStrength);
      points.push(`${x},${y}`);
    }
    return `M 0 ${height} L ${points.join(" L ")} L ${width} ${height} Z`;
  };

  const waveLayers = [
    { yBase: 0.4, amp: 150, freq: 1.5, phase: 0, color: accent, opacity: 0.15, delay: 0 },
    { yBase: 0.45, amp: 120, freq: 2, phase: 50, color: secondary, opacity: 0.2, delay: 3 },
    { yBase: 0.5, amp: 100, freq: 2.5, phase: 100, color: tertiary, opacity: 0.3, delay: 6 },
    { yBase: 0.55, amp: 80, freq: 3, phase: 150, color: accent, opacity: 0.4, delay: 9 },
    { yBase: 0.6, amp: 60, freq: 3.5, phase: 200, color: secondary, opacity: 0.5, delay: 12 },
    { yBase: 0.65, amp: 50, freq: 4, phase: 250, color: BRAND.text, opacity: 0.6, delay: 15 },
    { yBase: 0.7, amp: 40, freq: 4.5, phase: 300, color: BRAND.cyan, opacity: 0.8, delay: 18 },
  ];

  const splashes = React.useMemo(() => {
    return Array.from({ length: 25 }).map((_, i) => ({
      x: random(`ws-x-${i}`) * width,
      baseY: height * (0.5 + random(`ws-y-${i}`) * 0.3),
      size: random(`ws-sz-${i}`) * 40 + 15,
      speed: random(`ws-sp-${i}`) * 2 + 1,
      delay: random(`ws-del-${i}`) * 20,
    }));
  }, [width, height]);

  return (
    <>
      {/* Background glow */}
      <div
        style={{
          position: "absolute",
          left: "50%",
          bottom: 0,
          width: width * 2,
          height,
          background: `radial-gradient(ellipse at 50% 100%, ${accent}40 0%, transparent 60%)`,
          transform: "translateX(-50%)",
        }}
      />
      {/* Wave layers */}
      {waveLayers.map((wave, idx) => {
        const waveProgress = spring({
          frame: frame - wave.delay,
          fps,
          config: { damping: 15, stiffness: 40 },
        });
        return (
          <svg key={idx} width={width} height={height} style={{ position: "absolute", left: 0, top: 0, transform: `translateY(${(1 - waveProgress) * 200}px)` }} aria-hidden="true">
            <path d={generateComplexWave(height * wave.yBase, wave.amp, wave.freq, wave.phase)} fill={wave.color} opacity={wave.opacity * waveProgress} />
          </svg>
        );
      })}
      {/* Splash particles */}
      {splashes.map((splash, i) => {
        const splashProgress = spring({ frame: frame - splash.delay, fps, config: { damping: 12, stiffness: 80 } });
        const floatY = Math.sin(frame * 0.1 * splash.speed) * 30;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: splash.x,
              top: splash.baseY + floatY,
              width: splash.size,
              height: splash.size,
              background: BRAND.text,
              borderRadius: "50%",
              opacity: splashProgress * 0.6,
              boxShadow: `0 0 20px ${tertiary}`,
              transform: `scale(${splashProgress})`,
            }}
          />
        );
      })}
    </>
  );
};

const LightningVariant: React.FC<{ frame: number; textColor: string }> = ({ frame, textColor }) => {
  const lightningActive = frame % 40 < 5;
  const flashIntensity = lightningActive ? random(`lightning-${Math.floor(frame / 5)}`) : 0;

  const generateLightningPath = () => {
    let path = "M 640 0";
    let x = 640;
    let y = 0;
    while (y < 720) {
      const newX = x + (random(`lx-${y}-${frame}`) - 0.5) * 100;
      const newY = y + random(`ly-${y}-${frame}`) * 50 + 30;
      path += ` L ${newX} ${newY}`;
      x = newX;
      y = newY;
    }
    return path;
  };

  return (
    <>
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 200, background: `linear-gradient(to bottom, ${BRAND.cardBg}, transparent)` }} />
      {lightningActive && (
        <svg width="100%" height="100%" style={{ position: "absolute" }} aria-hidden="true">
          <path d={generateLightningPath()} stroke={textColor} strokeWidth={4} fill="none" opacity={flashIntensity} filter="url(#bg-glow)" />
          <defs>
            <filter id="bg-glow">
              <feGaussianBlur stdDeviation="4" result="coloredBlur" />
              <feMerge><feMergeNode in="coloredBlur" /><feMergeNode in="SourceGraphic" /></feMerge>
            </filter>
          </defs>
        </svg>
      )}
      {lightningActive && <AbsoluteFill style={{ background: textColor, opacity: flashIntensity * 0.3 }} />}
    </>
  );
};

const HelixVariant: React.FC<{ frame: number; color: string }> = ({ frame, color }) => {
  const entryProgress = interpolate(frame, [0, 30], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.bezier(0.16, 1, 0.3, 1) });
  const rotation = frame * 0.03;
  const points = 20;
  const helixHeight = 500;

  return (
    <div style={{ position: "absolute", left: "50%", top: "50%", transform: `translate(-50%, -50%) rotateY(${rotation * 57}deg)`, transformStyle: "preserve-3d" }}>
      {Array.from({ length: points }).map((_, i) => {
        const progress = i / points;
        const y = (progress - 0.5) * helixHeight;
        const angle = progress * Math.PI * 4 + rotation;
        const x1 = Math.cos(angle) * 80;
        const z1 = Math.sin(angle) * 80;
        const x2 = Math.cos(angle + Math.PI) * 80;
        const z2 = Math.sin(angle + Math.PI) * 80;
        const pointProgress = interpolate(frame, [i * 2, i * 2 + 15], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.bezier(0.16, 1, 0.3, 1) });
        const s = pointProgress * entryProgress;

        return (
          <React.Fragment key={i}>
            <div style={{ position: "absolute", left: "50%", top: "50%", width: 16, height: 16, background: color, borderRadius: "50%", transform: `translate(-50%, -50%) translate3d(${x1}px, ${y}px, ${z1}px) scale(${s})`, boxShadow: `0 0 20px ${color}` }} />
            <div style={{ position: "absolute", left: "50%", top: "50%", width: 16, height: 16, background: BRAND.violet, borderRadius: "50%", transform: `translate(-50%, -50%) translate3d(${x2}px, ${y}px, ${z2}px) scale(${s})`, boxShadow: `0 0 20px ${BRAND.violet}` }} />
            <div style={{ position: "absolute", left: "50%", top: "50%", width: 160, height: 2, background: `linear-gradient(90deg, ${color}, ${BRAND.violet})`, transform: `translate(-50%, -50%) translate3d(0, ${y}px, 0) rotateY(${angle * 57}deg) scaleX(${s})`, opacity: 0.4 }} />
          </React.Fragment>
        );
      })}
    </div>
  );
};

const HexGridVariant: React.FC<{ frame: number; fps: number; accent: string }> = ({ frame, fps, accent }) => {
  const hexSize = 70;
  const hexagons = React.useMemo(() => {
    const result: { x: number; y: number; delay: number; id: string }[] = [];
    for (let row = 0; row < 6; row++) {
      for (let col = 0; col < 10; col++) {
        result.push({
          id: `hex-${row}-${col}`,
          x: col * hexSize * 1.5 + (row % 2) * hexSize * 0.75 + 100,
          y: row * hexSize * 0.866 + 150,
          delay: (row + col) * 2,
        });
      }
    }
    return result;
  }, []);

  return (
    <AbsoluteFill>
      {hexagons.map((hex) => {
        const progress = spring({ frame: frame - hex.delay, fps, config: { damping: 15, stiffness: 200 } });
        const isHighlighted = random(`hex-hl-${hex.id}`) < 0.15;
        const pulse = isHighlighted ? 0.8 + Math.sin(frame * 0.1 + hex.x * 0.01) * 0.2 : 1;
        return (
          <div
            key={hex.id}
            style={{
              position: "absolute",
              left: hex.x,
              top: hex.y,
              width: hexSize,
              height: hexSize * 1.15,
              clipPath: "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)",
              background: isHighlighted ? `linear-gradient(135deg, ${accent}, ${BRAND.violet})` : BRAND.cardBg,
              transform: `scale(${progress * pulse})`,
              opacity: progress * 0.9,
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};

const MatrixRainVariant: React.FC<{ frame: number; height: number }> = ({ frame, height }) => {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*";
  const columns = React.useMemo(() => {
    return Array.from({ length: 30 }).map((_, i) => ({
      x: (i / 30) * 100,
      speed: random(`matrix-speed-${i}`) * 3 + 2,
      offset: random(`matrix-offset-${i}`) * 100,
      chars: Array.from({ length: 20 }).map((_, j) => ({
        char: chars[Math.floor(random(`matrix-char-${i}-${j}`) * chars.length)],
        opacity: 1 - j * 0.05,
      })),
    }));
  }, []);

  const entryOpacity = interpolate(frame, [0, 30], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill>
      {columns.map((col, colIndex) => {
        const y = (frame * col.speed + col.offset) % (height + 500) - 250;
        return (
          <div key={colIndex} style={{ position: "absolute", left: `${col.x}%`, top: y }}>
            {col.chars.map((c, charIndex) => (
              <div
                key={charIndex}
                style={{
                  fontFamily: "monospace",
                  fontSize: 20,
                  color: charIndex === 0 ? "#ffffff" : "#00ff00",
                  opacity: c.opacity * entryOpacity,
                  textShadow: charIndex === 0 ? "0 0 10px #00ff00" : "none",
                  height: 25,
                }}
              >
                {charIndex === 0 || random(`matrix-show-${frame}-${colIndex}-${charIndex}`) > 0.02
                  ? c.char
                  : chars[Math.floor(random(`matrix-change-${frame}-${colIndex}-${charIndex}`) * chars.length)]}
              </div>
            ))}
          </div>
        );
      })}
    </AbsoluteFill>
  );
};
