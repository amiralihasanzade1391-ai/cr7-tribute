"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Cr7LogoSvg } from "./Cr7LogoSvg";
import { getLenis } from "@/lib/lenis";
import { soundFx } from "@/lib/utils";

interface CinematicPreloaderProps {
  onComplete?: () => void;
  minDurationMs?: number; // default: 3200ms
}

/**
 * Individual vertical rolling digit column for the cinematic odometer
 */
const OdometerDigit: React.FC<{ value: number }> = ({ value }) => {
  return (
    <div className="h-16 sm:h-24 overflow-hidden relative inline-block w-8 sm:w-12 text-center">
      <motion.div
        className="flex flex-col items-center"
        initial={{ y: 0 }}
        animate={{ y: `-${value * 10}%` }}
        transition={{ duration: 0.25, ease: "easeOut" }}
      >
        {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((digit) => (
          <span
            key={digit}
            className="h-16 sm:h-24 flex items-center justify-center font-anton text-4xl sm:text-6xl text-white select-none"
          >
            {digit}
          </span>
        ))}
      </motion.div>
    </div>
  );
};

export const CinematicPreloader: React.FC<CinematicPreloaderProps> = ({
  onComplete,
  minDurationMs = 3200,
}) => {
  const [progress, setProgress] = useState(0);
  const [isRevealing, setIsRevealing] = useState(false);
  const [isUnmounted, setIsUnmounted] = useState(false);
  const animationFrameRef = useRef<number | null>(null);
  const startTimeRef = useRef<number | null>(null);

  // Stop page scrolling while preloader is active
  useEffect(() => {
    const lenis = getLenis();
    lenis?.stop();
    document.body.style.overflow = "hidden";

    return () => {
      lenis?.start();
      document.body.style.overflow = "";
    };
  }, []);

  const triggerFinish = useCallback(() => {
    setProgress(100);
    soundFx.playTransition();

    setTimeout(() => {
      setIsRevealing(true);
      const lenis = getLenis();
      lenis?.start();
      document.body.style.overflow = "";

      // Allow split animation to finish before destroying preloader
      setTimeout(() => {
        setIsUnmounted(true);
        onComplete?.();
      }, 1000);
    }, 400);
  }, [onComplete]);

  // Fast skip via keyboard (ESC) or button
  const handleSkip = useCallback(() => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
    triggerFinish();
  }, [triggerFinish]);

  // Handle ESC key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        handleSkip();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleSkip]);

  // Progressive tick animation
  useEffect(() => {
    const duration = minDurationMs;

    const step = (timestamp: number) => {
      if (!startTimeRef.current) startTimeRef.current = timestamp;
      const elapsed = timestamp - startTimeRef.current;
      const rawProgress = Math.min(100, Math.floor((elapsed / duration) * 100));

      setProgress(rawProgress);

      if (rawProgress < 100) {
        animationFrameRef.current = requestAnimationFrame(step);
      } else {
        triggerFinish();
      }
    };

    animationFrameRef.current = requestAnimationFrame(step);

    return () => {
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    };
  }, [minDurationMs, triggerFinish]);

  if (isUnmounted) return null;

  // Split digits for 3-place odometer (000 to 100)
  const hundreds = Math.floor(progress / 100) % 10;
  const tens = Math.floor(progress / 10) % 10;
  const units = progress % 10;

  return (
    <AnimatePresence>
      <div
        className="fixed inset-0 z-[9999] pointer-events-auto flex flex-col justify-center items-center overflow-hidden"
        role="progressbar"
        aria-valuenow={progress}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label="Loading CR7 Cinematic Experience"
      >
        {/* Top Half Curtain (Splits upward at 100%) */}
        <motion.div
          className="absolute top-0 left-0 w-full h-1/2 bg-[#050507] border-b border-gold/20 shadow-2xl z-10"
          initial={{ y: 0 }}
          animate={{ y: isRevealing ? "-100%" : 0 }}
          transition={{ duration: 0.9, ease: [0.76, 0, 0.24, 1] }}
        />

        {/* Bottom Half Curtain (Splits downward at 100%) */}
        <motion.div
          className="absolute bottom-0 left-0 w-full h-1/2 bg-[#050507] border-t border-gold/20 shadow-2xl z-10"
          initial={{ y: 0 }}
          animate={{ y: isRevealing ? "100%" : 0 }}
          transition={{ duration: 0.9, ease: [0.76, 0, 0.24, 1] }}
        />

        {/* Center Loading Content */}
        <motion.div
          className="relative z-20 flex flex-col items-center justify-center px-4"
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{
            opacity: isRevealing ? 0 : 1,
            scale: isRevealing ? 1.08 : 1,
          }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
        >
          {/* CR7 Self-drawing SVG Monogram */}
          <Cr7LogoSvg progress={progress} className="w-48 h-48 sm:w-64 sm:h-64 mb-6" />

          {/* Odometer Rolling Digits Counter */}
          <div className="flex items-center space-x-1 sm:space-x-2 bg-black/60 px-6 py-2 rounded-2xl border border-gold/30 backdrop-blur-md shadow-2xl">
            {progress >= 100 && <OdometerDigit value={hundreds} />}
            <OdometerDigit value={tens} />
            <OdometerDigit value={units} />
            <span className="font-anton text-3xl sm:text-5xl text-gold ml-1 animate-pulse">
              %
            </span>
          </div>

          {/* Cinematic Status Subtitle */}
          <motion.div
            className="mt-6 flex flex-col items-center space-y-1 text-center"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            <span className="font-bebas text-xs sm:text-sm tracking-[0.35em] text-gold uppercase">
              Initializing The Legend
            </span>
            <p className="font-inter text-xs text-gray-400 font-light tracking-wider">
              {progress < 30
                ? "Calibrating 7 Career Eras..."
                : progress < 70
                ? "Forging 981 Career Goals..."
                : progress < 95
                ? "Preparing Awwwards Experience..."
                : "Welcome to Greatness."}
            </p>
          </motion.div>

          {/* Progress Bar Line */}
          <div className="w-56 sm:w-80 h-[2px] bg-white/10 rounded-full mt-6 overflow-hidden relative">
            <motion.div
              className="h-full bg-gradient-to-r from-gold/60 via-gold to-white rounded-full shadow-[0_0_12px_#FEBE10]"
              style={{ width: `${progress}%` }}
              transition={{ ease: "easeOut" }}
            />
          </div>
        </motion.div>

        {/* Skip button in bottom corner */}
        <motion.button
          onClick={handleSkip}
          className="absolute bottom-6 right-6 sm:bottom-8 sm:right-10 z-30 font-bebas text-xs sm:text-sm tracking-widest text-gray-400 hover:text-gold uppercase px-4 py-2 rounded-full border border-white/10 hover:border-gold/40 bg-black/40 backdrop-blur-md transition-all duration-300"
          initial={{ opacity: 0 }}
          animate={{ opacity: isRevealing ? 0 : 0.8 }}
          whileHover={{ scale: 1.05, opacity: 1 }}
          whileTap={{ scale: 0.95 }}
          aria-label="Skip introduction preloader (Press Escape)"
        >
          Skip Intro [ESC]
        </motion.button>
      </div>
    </AnimatePresence>
  );
};
