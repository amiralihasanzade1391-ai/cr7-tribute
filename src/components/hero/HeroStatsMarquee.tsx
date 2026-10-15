"use client";

import React from "react";

const MARQUEE_ITEMS = [
  "981 CAREER GOALS",
  "5 CHAMPIONS LEAGUES",
  "5 BALLON D'OR",
  "35 MAJOR TROPHIES",
  "256 ASSISTS",
  "133 INTERNATIONAL GOALS",
  "ALL-TIME UCL TOP SCORER",
  "4 EUROPEAN GOLDEN SHOES",
];

export const HeroStatsMarquee: React.FC = () => {
  // Repeating the content ensures seamless infinite scrolling
  const renderMarqueeTrack = (keyPrefix: string) => (
    <div
      key={keyPrefix}
      className="flex items-center space-x-6 sm:space-x-10 shrink-0 will-change-transform"
      style={{ transform: "translate3d(0, 0, 0)" }}
    >
      {MARQUEE_ITEMS.map((item, idx) => (
        <span
          key={`${keyPrefix}-${idx}`}
          className="flex items-center space-x-4 sm:space-x-6 font-bebas text-sm sm:text-base tracking-[0.25em] text-white/80 whitespace-nowrap"
        >
          <span className="text-gold drop-shadow-[0_0_8px_rgba(254,190,16,0.8)] text-xs sm:text-sm">
            ★
          </span>
          <span className="hover:text-gold transition-colors duration-200">
            {item}
          </span>
        </span>
      ))}
    </div>
  );

  return (
    <div
      className="w-full overflow-hidden border-y border-white/10 bg-black/40 backdrop-blur-md py-2.5 sm:py-3.5 z-10 group select-none relative"
      aria-hidden="true"
    >
      {/* Subtle edge fades for smooth entry and exit */}
      <div className="absolute left-0 top-0 bottom-0 w-12 sm:w-24 bg-gradient-to-r from-[#050507] to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-12 sm:w-24 bg-gradient-to-l from-[#050507] to-transparent z-10 pointer-events-none" />

      {/* Hardware-accelerated infinite marquee track with pause on hover */}
      <div className="flex w-max animate-marquee group-hover:[animation-play-state:paused]">
        {renderMarqueeTrack("track-1")}
        {renderMarqueeTrack("track-2")}
      </div>
    </div>
  );
};
