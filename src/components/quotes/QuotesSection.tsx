"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Quote, ChevronLeft, ChevronRight, Sparkles, Flame } from "lucide-react";
import { RONALDO_QUOTES, QuoteItem } from "@/data/quotes";

export function QuotesSection() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Auto advance every 6.5 seconds unless paused on hover
  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % RONALDO_QUOTES.length);
    }, 6500);
    return () => clearInterval(interval);
  }, [isPaused]);

  const currentQuote = RONALDO_QUOTES[activeIndex];

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % RONALDO_QUOTES.length);
  };

  const handlePrev = () => {
    setActiveIndex((prev) => (prev - 1 + RONALDO_QUOTES.length) % RONALDO_QUOTES.length);
  };

  return (
    <section
      id="quotes-section"
      className="relative py-28 sm:py-36 bg-black overflow-hidden border-t border-zinc-900 select-none"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Background radial gold glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[450px] bg-[#FEBE10]/6 rounded-full blur-[140px] pointer-events-none" />

      {/* Decorative Giant Gold Quote Watermark */}
      <div
        className="absolute top-8 left-1/2 -translate-x-1/2 text-[18rem] sm:text-[24rem] font-serif font-black text-[#FEBE10]/5 select-none pointer-events-none leading-none -z-0"
        aria-hidden="true"
      >
        “
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-8">
        {/* Section Header */}
        <div className="text-center mb-16 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-bold tracking-widest uppercase bg-[#FEBE10]/15 text-[#FEBE10] border border-[#FEBE10]/30 shadow-[0_0_15px_rgba(254,190,16,0.15)]">
            <Flame className="w-3.5 h-3.5 fill-[#FEBE10]" />
            THE MINDSET OF A CHAMPION
          </div>
          <h2
            className="text-4xl sm:text-6xl lg:text-7xl font-black uppercase tracking-tight text-white"
            style={{ fontFamily: "Anton, sans-serif" }}
          >
            Words of The King
          </h2>
          <p className="text-zinc-400 text-sm sm:text-base max-w-xl mx-auto font-mono">
            Uncompromising mentality, relentless work ethic, and legendary self-belief.
          </p>
        </div>

        {/* Main Featured Quote Stage */}
        <div className="relative min-h-[300px] sm:min-h-[260px] flex flex-col justify-center items-center text-center px-4">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentQuote.id}
              initial={{ opacity: 0, y: 25, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -25, scale: 0.98 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="space-y-6 max-w-4xl"
            >
              {/* Category Pill */}
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-mono font-semibold uppercase bg-zinc-900/90 text-zinc-300 border border-zinc-800 backdrop-blur-md">
                <Sparkles className="w-3 h-3 text-[#FEBE10]" />
                <span>{currentQuote.category}</span>
                {currentQuote.year && <span className="text-zinc-500">• {currentQuote.year}</span>}
              </div>

              {/* Big Quote Statement */}
              <blockquote className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white leading-tight sm:leading-snug">
                &ldquo;{currentQuote.quote}&rdquo;
              </blockquote>

              {/* Attribution / Context */}
              <div className="space-y-1">
                <p className="text-xs sm:text-sm font-mono font-bold text-[#FEBE10] tracking-wider uppercase">
                  Cristiano Ronaldo dos Santos Aveiro
                </p>
                <p className="text-xs font-mono text-zinc-500">
                  {currentQuote.context}
                </p>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Carousel Navigation Controls */}
        <div className="mt-12 flex items-center justify-between max-w-md mx-auto pt-6 border-t border-zinc-900/80">
          <button
            onClick={handlePrev}
            className="p-3 rounded-full bg-zinc-900/80 hover:bg-zinc-800 text-zinc-400 hover:text-white border border-zinc-800 transition-all active:scale-95 hover:border-[#FEBE10]/40"
            aria-label="Previous quote"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          {/* Dots Indicator */}
          <div className="flex items-center gap-2">
            {RONALDO_QUOTES.map((q, idx) => (
              <button
                key={q.id}
                onClick={() => setActiveIndex(idx)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  activeIndex === idx
                    ? "w-8 bg-[#FEBE10] shadow-[0_0_10px_rgba(254,190,16,0.6)]"
                    : "w-2 bg-zinc-800 hover:bg-zinc-700"
                }`}
                aria-label={`Go to quote ${idx + 1}`}
              />
            ))}
          </div>

          <button
            onClick={handleNext}
            className="p-3 rounded-full bg-zinc-900/80 hover:bg-zinc-800 text-zinc-400 hover:text-white border border-zinc-800 transition-all active:scale-95 hover:border-[#FEBE10]/40"
            aria-label="Next quote"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* Mini Quote Cards Grid */}
        <div className="mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {RONALDO_QUOTES.slice(0, 4).map((q, idx) => (
            <div
              key={q.id}
              onClick={() => setActiveIndex(idx)}
              className={`p-5 rounded-2xl border transition-all cursor-pointer backdrop-blur-md text-left flex flex-col justify-between ${
                activeIndex === idx
                  ? "bg-zinc-900/90 border-[#FEBE10] shadow-[0_0_20px_rgba(254,190,16,0.2)]"
                  : "bg-zinc-950/50 border-zinc-900 hover:border-zinc-800 hover:bg-zinc-900/40"
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <Quote className="w-4 h-4 text-[#FEBE10]" />
                <span className="text-[10px] font-mono text-zinc-500">{q.year}</span>
              </div>
              <p className="text-xs font-semibold text-zinc-200 line-clamp-3 leading-relaxed">
                &ldquo;{q.quote}&rdquo;
              </p>
              <p className="text-[10px] font-mono text-[#FEBE10] mt-3 uppercase tracking-wider truncate">
                {q.category}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default QuotesSection;
