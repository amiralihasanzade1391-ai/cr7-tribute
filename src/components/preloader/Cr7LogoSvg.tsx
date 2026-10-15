"use client";

import React from "react";

interface Cr7LogoSvgProps {
  progress: number; // 0 to 100
  className?: string;
  glow?: boolean;
}

/**
 * Hand-crafted CR7 vector monogram optimized for path-drawing stroke animations.
 * Features distinct paths for 'C', 'R', and the iconic number '7'.
 */
export const Cr7LogoSvg: React.FC<Cr7LogoSvgProps> = ({
  progress,
  className = "w-44 h-44 sm:w-56 sm:h-56",
  glow = true,
}) => {
  // Stroke Dash calculations: at progress 0, offset is 1000; at progress 100, offset is 0.
  const pathLength = 1000;
  const strokeDashoffset = Math.max(0, pathLength - (progress / 100) * pathLength);

  return (
    <div className={`relative flex items-center justify-center ${className}`}>
      <svg
        viewBox="0 0 240 240"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full overflow-visible transition-all duration-300"
        style={{
          filter: glow
            ? `drop-shadow(0 0 ${12 + (progress / 100) * 15}px rgba(254, 190, 16, ${
                0.3 + (progress / 100) * 0.5
              }))`
            : "none",
        }}
        aria-label="Cristiano Ronaldo CR7 Monogram"
      >
        <defs>
          {/* Subtle gold metallic linear gradient */}
          <linearGradient id="cr7GoldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFF2B2" />
            <stop offset="50%" stopColor="#FEBE10" />
            <stop offset="100%" stopColor="#D97706" />
          </linearGradient>

          {/* Golden radial background glow */}
          <radialGradient id="cr7CoreGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#FEBE10" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#FEBE10" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Ambient background bloom */}
        <circle
          cx="120"
          cy="120"
          r="90"
          fill="url(#cr7CoreGlow)"
          className="transition-opacity duration-700"
          style={{ opacity: progress > 10 ? progress / 100 : 0 }}
        />

        {/* Outer geometric shield boundary */}
        <polygon
          points="120,18 205,55 205,160 120,222 35,160 35,55"
          stroke="url(#cr7GoldGradient)"
          strokeWidth="1.5"
          strokeOpacity={0.25 + (progress / 100) * 0.4}
          strokeDasharray="800"
          strokeDashoffset={Math.max(0, 800 - (progress / 100) * 800)}
          strokeLinecap="round"
        />

        <g
          stroke="url(#cr7GoldGradient)"
          strokeWidth="4"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{
            strokeDasharray: pathLength,
            strokeDashoffset: strokeDashoffset,
            transition: "stroke-dashoffset 0.1s ease-out",
          }}
        >
          {/* Letter "C": Sharp athletic geometric arc */}
          <path
            id="cr7-letter-c"
            d="M 85 85 
               C 80 70, 68 62, 54 70 
               C 38 80, 36 125, 48 145 
               C 58 160, 76 160, 86 142"
          />

          {/* Letter "R": Vertical stem, sharp upper loop, and aggressive kick leg */}
          <path
            id="cr7-letter-r-stem"
            d="M 96 68 L 96 158"
          />
          <path
            id="cr7-letter-r-loop"
            d="M 96 68 
               L 125 68 
               C 142 68, 145 98, 126 104 
               L 96 104"
          />
          <path
            id="cr7-letter-r-leg"
            d="M 116 104 
               L 140 158"
          />

          {/* Number "7": Dynamic top bar, angular cut, and dominating diagonal downsweep */}
          <path
            id="cr7-number-7-bar"
            d="M 148 68 
               L 194 68 
               L 156 158"
          />
          <path
            id="cr7-number-7-dash"
            d="M 160 115 L 180 115"
          />
        </g>

        {/* Core Fill fades in at final completion stage */}
        <g
          fill="url(#cr7GoldGradient)"
          style={{
            opacity: progress > 85 ? (progress - 85) / 15 : 0,
            transition: "opacity 0.5s ease-in-out",
          }}
        >
          <circle cx="120" cy="120" r="3" />
        </g>
      </svg>
    </div>
  );
};
