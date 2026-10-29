"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Trophy,
  Flame,
  ArrowRight,
} from "lucide-react";
import { TIME_MACHINE_DATA, YearMilestone } from "@/data/timemachine";

export function TimeMachine() {
  const [selectedYearIndex, setSelectedYearIndex] = useState(TIME_MACHINE_DATA.length - 1); // default to 2026
  const scrubberRef = useRef<HTMLDivElement>(null);

  const currentItem = TIME_MACHINE_DATA[selectedYearIndex];

  // Auto-scroll scrubber to active item
  useEffect(() => {
    if (scrubberRef.current) {
      const activeBtn = scrubberRef.current.children[selectedYearIndex] as HTMLElement;
      if (activeBtn) {
        scrubberRef.current.scrollTo({
          left: activeBtn.offsetLeft - scrubberRef.current.offsetWidth / 2 + activeBtn.offsetWidth / 2,
          behavior: "smooth",
        });
      }
    }
  }, [selectedYearIndex]);

  const handleNext = () => {
    setSelectedYearIndex((prev) => Math.min(prev + 1, TIME_MACHINE_DATA.length - 1));
  };

  const handlePrev = () => {
    setSelectedYearIndex((prev) => Math.max(prev - 1, 0));
  };

  return (
    <section id="time-machine" className="py-28 sm:py-36 bg-black relative border-t border-zinc-900 select-none overflow-hidden">
      {/* Background radial gold glow */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-[600px] h-[400px] bg-[#FEBE10]/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-8 relative z-10">
        {/* Header */}
        <div className="text-center mb-12 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-bold tracking-widest uppercase bg-[#FEBE10]/15 text-[#FEBE10] border border-[#FEBE10]/30 shadow-[0_0_15px_rgba(254,190,16,0.15)]">
            <Calendar className="w-3.5 h-3.5 text-[#FEBE10]" />
            2002 — 2026 CHRONICLES
          </div>
          <h2
            className="text-4xl sm:text-6xl lg:text-7xl font-black uppercase tracking-tight text-white"
            style={{ fontFamily: "Anton, sans-serif" }}
          >
            The CR7 Time Machine
          </h2>
          <p className="text-zinc-400 text-sm sm:text-base max-w-xl mx-auto font-mono">
            A 25-year odyssey through football history. Slide across the timeline to explore every single campaign.
          </p>

          {/* Era Quick Jump Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-4">
            {[
              { label: "Sporting '02", index: 0 },
              { label: "Man Utd '03", index: 1 },
              { label: "Moscow '08", index: 6 },
              { label: "Real Madrid '09", index: 7 },
              { label: "La Décima '14", index: 12 },
              { label: "Euro '16", index: 14 },
              { label: "Juventus '18", index: 16 },
              { label: "Al Nassr '23", index: 21 },
              { label: "The 981 Record '26", index: 24 },
            ].map((shortcut) => (
              <button
                key={shortcut.label}
                onClick={() => setSelectedYearIndex(shortcut.index)}
                className={`text-[11px] font-mono px-3 py-1 rounded-full border transition-all ${
                  selectedYearIndex === shortcut.index
                    ? "bg-[#FEBE10] text-black font-bold border-[#FEBE10] shadow-[0_0_12px_rgba(254,190,16,0.3)]"
                    : "bg-zinc-900/60 text-zinc-400 hover:text-white border-zinc-800"
                }`}
              >
                {shortcut.label}
              </button>
            ))}
          </div>
        </div>

        {/* Horizontal Year Scrubber Bar */}
        <div className="relative mb-12">
          {/* Track line behind buttons */}
          <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-zinc-800 -translate-y-1/2 -z-0" />

          <div
            ref={scrubberRef}
            className="flex items-center gap-2 overflow-x-auto py-4 px-2 no-scrollbar relative z-10 scroll-smooth"
          >
            {TIME_MACHINE_DATA.map((item, idx) => {
              const isSelected = selectedYearIndex === idx;
              return (
                <button
                  key={item.year}
                  onClick={() => setSelectedYearIndex(idx)}
                  className={`flex flex-col items-center shrink-0 px-3.5 py-2 rounded-xl transition-all duration-300 ${
                    isSelected
                      ? "bg-gradient-to-b from-[#FEBE10] to-[#ca970c] text-black scale-110 shadow-[0_0_20px_rgba(254,190,16,0.5)] z-20 font-black"
                      : "bg-zinc-950/80 hover:bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800/80"
                  }`}
                >
                  <span className="text-xs font-mono">{item.year}</span>
                  <div
                    className={`w-1.5 h-1.5 rounded-full mt-1 ${
                      isSelected ? "bg-black" : item.highlight ? "bg-[#FEBE10]" : "bg-zinc-600"
                    }`}
                  />
                </button>
              );
            })}
          </div>
        </div>

        {/* Featured Year Showcase Card */}
        <div className="max-w-4xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentItem.year}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.35, ease: "easeOut" }}
              className="relative p-8 sm:p-12 rounded-3xl bg-zinc-950/80 border border-zinc-800/80 backdrop-blur-2xl shadow-2xl overflow-hidden"
            >
              {/* Year Watermark in background */}
              <div
                className="absolute -bottom-6 -right-6 text-8xl sm:text-9xl font-black font-mono text-zinc-900/60 pointer-events-none select-none"
                aria-hidden="true"
              >
                {currentItem.year}
              </div>

              <div className="relative z-10 space-y-6">
                {/* Top Badges Row */}
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <span className="text-3xl sm:text-5xl font-black font-mono text-[#FEBE10] tracking-tight">
                      {currentItem.year}
                    </span>
                    <span className="text-xs font-mono px-3 py-1 rounded-full bg-zinc-900 text-zinc-300 border border-zinc-800 font-semibold uppercase">
                      {currentItem.club}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold px-3 py-1 rounded-full bg-[#FEBE10]/15 text-[#FEBE10] border border-[#FEBE10]/30 flex items-center gap-1.5">
                      <Flame className="w-3.5 h-3.5 fill-[#FEBE10]" />
                      <span>{currentItem.goals} Goals Scored</span>
                    </span>

                    {currentItem.trophiesCount && (
                      <span className="text-xs font-mono font-bold px-3 py-1 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 flex items-center gap-1.5">
                        <Trophy className="w-3.5 h-3.5" />
                        <span>{currentItem.trophiesCount} Trophies</span>
                      </span>
                    )}
                  </div>
                </div>

                {/* Headline & Narrative */}
                <div className="space-y-3">
                  <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                    {currentItem.headline}
                  </h3>
                  <p className="text-sm sm:text-base text-zinc-300 leading-relaxed font-sans max-w-2xl">
                    {currentItem.summary}
                  </p>
                </div>

                {/* Navigation Next/Prev in Card */}
                <div className="pt-6 border-t border-zinc-800/80 flex items-center justify-between">
                  <button
                    onClick={handlePrev}
                    disabled={selectedYearIndex === 0}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-850 text-xs font-mono font-semibold text-zinc-300 hover:text-white border border-zinc-800 disabled:opacity-30 disabled:pointer-events-none transition-all"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    <span>Previous Campaign</span>
                  </button>

                  <span className="text-xs font-mono text-zinc-500">
                    Campaign {selectedYearIndex + 1} of {TIME_MACHINE_DATA.length}
                  </span>

                  <button
                    onClick={handleNext}
                    disabled={selectedYearIndex === TIME_MACHINE_DATA.length - 1}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-850 text-xs font-mono font-semibold text-zinc-300 hover:text-white border border-zinc-800 disabled:opacity-30 disabled:pointer-events-none transition-all"
                  >
                    <span>Next Campaign</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}

export default TimeMachine;
