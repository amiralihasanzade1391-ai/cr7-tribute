"use client";

import React from "react";
import { Era } from "@/types/era";
import { soundFx } from "@/lib/utils";

interface EraProgressProps {
  eras: Era[];
  activeIndex: number;
  progressRatio: number; // 0 to 1
  onSelectEra: (index: number) => void;
}

export const EraProgress: React.FC<EraProgressProps> = ({
  eras,
  activeIndex,
  progressRatio,
  onSelectEra,
}) => {
  return (
    <div
      className="w-full max-w-5xl mx-auto px-4 py-3 z-30 select-none"
      aria-label="Career Era Timeline Navigation"
    >
      <div className="flex items-center justify-between bg-black/60 backdrop-blur-xl border border-white/10 rounded-full px-5 py-2.5 shadow-2xl">
        {/* Era Index Fraction */}
        <div className="flex items-baseline space-x-1 pr-4 border-r border-white/10 shrink-0">
          <span className="font-anton text-lg sm:text-xl text-primary transition-colors duration-500">
            0{activeIndex + 1}
          </span>
          <span className="font-bebas text-xs text-muted tracking-widest">
            / 0{eras.length}
          </span>
        </div>

        {/* Ticks Track */}
        <div className="flex-1 px-4 sm:px-6 relative flex items-center justify-between">
          {/* Background Track Line */}
          <div className="absolute left-6 right-6 h-[2px] bg-white/10 -translate-y-1/2 top-1/2 rounded-full" />

          {/* Active Fill Line */}
          <div
            className="absolute left-6 h-[2px] bg-gradient-to-r from-primary to-accent -translate-y-1/2 top-1/2 rounded-full transition-all duration-300 shadow-[0_0_8px_var(--primary)]"
            style={{
              width: `calc(${progressRatio * 100}% * ((100% - 48px) / 100))`,
            }}
          />

          {/* Era Abbreviation Nodes */}
          {eras.map((era, idx) => {
            const isActive = idx === activeIndex;
            const isPassed = idx <= activeIndex;

            return (
              <button
                key={era.id}
                onClick={() => {
                  soundFx.playClick();
                  onSelectEra(idx);
                }}
                onMouseEnter={() => soundFx.playHover()}
                className="relative z-10 flex flex-col items-center group focus:outline-none py-1"
                aria-label={`Jump to ${era.shortName} (${era.period})`}
                aria-current={isActive ? "step" : undefined}
              >
                {/* Node Dot */}
                <span
                  className={`w-3 h-3 rounded-full transition-all duration-500 border ${
                    isActive
                      ? "bg-primary border-white scale-125 shadow-[0_0_12px_var(--primary)]"
                      : isPassed
                      ? "bg-accent/80 border-accent/40"
                      : "bg-black border-white/30 group-hover:border-white/70"
                  }`}
                />

                {/* Abbreviation Label */}
                <span
                  className={`font-bebas text-[11px] tracking-widest uppercase mt-1 transition-colors duration-300 hidden sm:inline-block ${
                    isActive
                      ? "text-primary font-bold drop-shadow"
                      : "text-muted group-hover:text-white"
                  }`}
                >
                  {era.abbreviation}
                </span>
              </button>
            );
          })}
        </div>

        {/* Active Era Tagline on Desktop */}
        <div className="hidden md:flex items-center pl-4 border-l border-white/10 shrink-0">
          <span className="font-bebas text-xs tracking-widest text-primary uppercase transition-colors duration-500">
            {eras[activeIndex]?.shortName}
          </span>
        </div>
      </div>
    </div>
  );
};
