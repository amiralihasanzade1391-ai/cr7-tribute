"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { VideoBackground } from "./VideoBackground";
import { ScrollIndicator } from "./ScrollIndicator";
import { HeroStatsMarquee } from "./HeroStatsMarquee";
import { useCursor } from "@/components/cursor/CursorContext";
import { soundFx } from "@/lib/utils";

interface HeroSectionProps {
  isPreloaderFinished?: boolean;
}

// Kinetic Animation constants
const LETTER_STAGGER_DELAY = 0.15;
const LETTER_DURATION = 1.2;
const CUBIC_EASE = [0.16, 1, 0.3, 1] as const;

export const HeroSection: React.FC<HeroSectionProps> = ({
  isPreloaderFinished = true,
}) => {
  const { setCursor, resetCursor } = useCursor();
  const [glintCompleted, setGlintCompleted] = useState(false);
  const [startReveal, setStartReveal] = useState(false);

  // Trigger kinetic sequence once preloader finishes
  useEffect(() => {
    if (isPreloaderFinished) {
      const timer = setTimeout(() => {
        setStartReveal(true);
      }, 250);
      return () => clearTimeout(timer);
    }
  }, [isPreloaderFinished]);

  // Trigger single golden glint across CR7 letters after they settle
  useEffect(() => {
    if (startReveal) {
      // Letters take approx (3 * 0.15s) + 1.2s = ~1.65s to settle
      const timer = setTimeout(() => {
        setGlintCompleted(true);
      }, 1800);
      return () => clearTimeout(timer);
    }
  }, [startReveal]);

  const letters = ["C", "R", "7"];
  const subtitleWords = ["The", "Greatest", "of", "All", "Time"];

  return (
    <section
      id="hero-section"
      className="relative w-full h-screen min-h-[640px] flex flex-col justify-between items-center overflow-hidden bg-[#050507]"
      aria-label="Cristiano Ronaldo Hero Tribute"
    >
      {/* Accessibility: Skip to Content Link */}
      <a
        href="#live-stats"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 z-[9999] px-4 py-2 bg-gold text-black font-bebas text-sm tracking-widest rounded-md shadow-2xl focus:outline-none"
      >
        Skip to main content
      </a>

      {/* Cinematic Ambient Video & Particle Background */}
      <VideoBackground isPreloaderFinished={isPreloaderFinished} />

      {/* Top Floating Badge Bar */}
      <div className="w-full max-w-7xl mx-auto px-6 sm:px-12 pt-8 sm:pt-10 flex justify-between items-center z-20">
        <div className="flex items-center space-x-3">
          <span className="w-2 h-2 rounded-full bg-gold animate-ping" />
          <span className="font-bebas text-xs sm:text-sm tracking-[0.35em] text-white/80 uppercase">
            Official Tribute • Legacy of #7
          </span>
        </div>

        <div className="hidden sm:flex items-center space-x-2 text-xs font-inter text-gray-400">
          <span className="px-2.5 py-1 rounded-full border border-white/10 bg-black/40 backdrop-blur-md uppercase tracking-wider">
            2002 — 2026
          </span>
        </div>
      </div>

      {/* Center Cinematic Stage: Monumental Title & Kinetic Reveal */}
      <div className="relative z-20 flex flex-col items-center justify-center my-auto px-4 text-center select-none">
        {/* Semantic H1 for screen readers */}
        <h1 className="sr-only">
          Cristiano Ronaldo — CR7 — The Greatest of All Time
        </h1>

        {/* 3D Perspective Container for Title */}
        <div
          className="relative perspective-1000"
          onMouseEnter={() => {
            soundFx.playHover();
            setCursor("hover", "THE GOAT");
          }}
          onMouseLeave={resetCursor}
        >
          {/* Monumental Kinetic CR7 Title with Post-Reveal Floating Float */}
          <motion.div
            className="flex items-center justify-center space-x-2 sm:space-x-4 font-anton text-[clamp(110px,22vw,360px)] leading-[0.85] tracking-tight uppercase"
            animate={
              glintCompleted
                ? {
                    y: [0, -3.5, 0],
                  }
                : {}
            }
            transition={{
              duration: 6,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            {letters.map((char, index) => (
              <div
                key={index}
                className="overflow-hidden relative inline-block py-2"
              >
                <motion.span
                  className="inline-block relative text-transparent bg-clip-text bg-gradient-to-b from-white via-gray-100 to-gray-400 drop-shadow-[0_10px_35px_rgba(0,0,0,0.9)]"
                  initial={{
                    y: "115%",
                    opacity: 0,
                    rotateX: -90,
                  }}
                  animate={
                    startReveal
                      ? {
                          y: "0%",
                          opacity: 1,
                          rotateX: 0,
                        }
                      : {}
                  }
                  transition={{
                    duration: LETTER_DURATION,
                    delay: index * LETTER_STAGGER_DELAY,
                    ease: CUBIC_EASE,
                  }}
                >
                  {char}
                </motion.span>
              </div>
            ))}
          </motion.div>

          {/* Single Golden Glint/Shimmer Beam that sweeps across the title once */}
          <AnimatePresence>
            {startReveal && !glintCompleted && (
              <motion.div
                className="absolute inset-0 pointer-events-none mix-blend-overlay z-10"
                initial={{ x: "-100%", opacity: 0 }}
                animate={{ x: "120%", opacity: [0, 0.8, 0] }}
                transition={{
                  delay: 1.1,
                  duration: 1.5,
                  ease: "easeInOut",
                }}
                style={{
                  background:
                    "linear-gradient(90deg, transparent 0%, rgba(254, 190, 16, 0.85) 50%, transparent 100%)",
                  transform: "skewX(-25deg)",
                }}
              />
            )}
          </AnimatePresence>
        </div>

        {/* Subtitle with Word Stagger & Self-Drawing Underline */}
        <div className="mt-4 sm:mt-6 flex flex-col items-center">
          <div className="flex flex-wrap justify-center items-center gap-x-2 sm:gap-x-3 overflow-hidden">
            {subtitleWords.map((word, idx) => (
              <motion.span
                key={idx}
                className="font-bebas text-lg sm:text-2xl md:text-3xl tracking-[0.25em] text-gold uppercase"
                initial={{ y: "120%", opacity: 0 }}
                animate={
                  startReveal
                    ? {
                        y: "0%",
                        opacity: 1,
                      }
                    : {}
                }
                transition={{
                  duration: 0.9,
                  delay: 0.8 + idx * 0.08,
                  ease: CUBIC_EASE,
                }}
              >
                {word}
              </motion.span>
            ))}
          </div>

          {/* Self-drawing Golden Vector Underline */}
          <svg
            className="w-48 sm:w-72 h-3 mt-2 overflow-visible"
            viewBox="0 0 240 8"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <motion.path
              d="M 2 4 Q 120 7, 238 4"
              stroke="#FEBE10"
              strokeWidth="2"
              strokeLinecap="round"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={
                startReveal
                  ? {
                      pathLength: 1,
                      opacity: 0.85,
                    }
                  : {}
              }
              transition={{
                duration: 1.3,
                delay: 1.4,
                ease: [0.65, 0, 0.35, 1],
              }}
              style={{
                filter: "drop-shadow(0 0 6px #FEBE10)",
              }}
            />
          </svg>
        </div>
      </div>

      {/* Bottom Zone: Horizontal Stats Ticker & Scroll Indicator */}
      <div className="w-full flex flex-col items-center z-20 pb-4 sm:pb-6">
        <HeroStatsMarquee />

        <div className="mt-5">
          <ScrollIndicator targetSectionId="#live-stats" />
        </div>
      </div>
    </section>
  );
};
