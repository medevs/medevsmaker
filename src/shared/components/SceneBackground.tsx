import React from "react";
import { AbsoluteFill } from "remotion";
import { GridPattern } from "./GridPattern";
import { BRAND } from "../styles";

type SceneBackgroundProps = {
  /** Base background color — defaults to BRAND.bg */
  bg?: string;
  /** Grid line color — defaults to BRAND.border */
  gridColor?: string;
  /** Grid cell spacing in px — defaults to 80 */
  gridSpacing?: number;
  /** Grid opacity (0-1) — defaults to 0.4. Use 0 to hide grid. */
  gridOpacity?: number;
  children?: React.ReactNode;
};

/**
 * Unified scene background with subtle grid pattern.
 * Wrap scene content to get a consistent branded look across all scenes.
 *
 * All values derive from BRAND tokens by default — change the tokens
 * to update every scene at once.
 */
export const SceneBackground: React.FC<SceneBackgroundProps> = ({
  bg = BRAND.bg,
  gridColor = BRAND.border,
  gridSpacing = 80,
  gridOpacity = 0.4,
  children,
}) => {
  return (
    <AbsoluteFill style={{ backgroundColor: bg }}>
      {gridOpacity > 0 && (
        <GridPattern
          variant="lines"
          color={gridColor}
          spacing={gridSpacing}
          opacity={gridOpacity}
        />
      )}
      {children}
    </AbsoluteFill>
  );
};
