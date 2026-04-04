import React from "react";
import { BRAND } from "../styles";

type CursorProps = {
  x: number;
  y: number;
  clicking?: boolean;
  style?: React.CSSProperties;
};

export const Cursor: React.FC<CursorProps> = ({ x, y, clicking = false, style }) => (
  <div
    style={{
      position: "absolute",
      left: x,
      top: y,
      pointerEvents: "none",
      zIndex: 1000,
      ...style,
    }}
  >
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      style={{
        filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.3))",
        transform: clicking ? "scale(0.9)" : "scale(1)",
      }}
    >
      <path
        d="M5 3L19 12L12 13L9 20L5 3Z"
        fill={BRAND.text}
        stroke={BRAND.bg}
        strokeWidth="1.5"
      />
    </svg>
    {clicking && (
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "50%",
          transform: "translate(-50%, -50%)",
          width: 40,
          height: 40,
          borderRadius: "50%",
          border: `2px solid ${BRAND.indigo}`,
          opacity: 0.6,
        }}
      />
    )}
  </div>
);
