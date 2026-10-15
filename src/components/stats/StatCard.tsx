"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { useCursor } from "@/components/cursor/CursorContext";
import { soundFx } from "@/lib/utils";
import confetti from "canvas-confetti";
import {
  Flame,
  Trophy,
  Award,
  Crown,
  Sparkles,
  ShieldAlert,
  HelpCircle,
} from "lucide-react";

interface StatCardProps {
  id: string;
  value: number;
  label: string;
  suffix?: string;
  icon: string;
  description: string;
  color?: string;
  duration?: number;
}

const ICON_MAP: Record<string, React.ElementType> = {
  Flame,
  Trophy,
  Award,
  Crown,
  Sparkles,
  ShieldAlert,
};

/**
 * Single rolling digit column for the odometer effect
 */
const DigitColumn: React.FC<{ targetDigit: number; isTriggered: boolean; delay: number }> = ({
  targetDigit,
  isTriggered,
  delay,
}) => {
  return (
    <div className="h-16 sm:h-20 overflow-hidden relative inline-block w-7 sm:w-10 text-center">
      <motion.div
        className="flex flex-col items-center"
        initial={{ y: 0 }}
        animate={{
          y: isTriggered ? `-${targetDigit * 10}%` : "0%",
        }}
        transition={{
          duration: 2.2,
          delay: delay,
          ease: [0.16, 1, 0.3, 1],
        }}
      >
        {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
          <span
            key={num}
            className="h-16 sm:h-20 flex items-center justify-center font-anton text-5xl sm:text-7xl leading-none text-white select-none"
          >
            {num}
          </span>
        ))}
      </motion.div>
    </div>
  );
};

export const StatCard: React.FC<StatCardProps> = ({
  value,
  label,
  suffix = "",
  icon,
  description,
  color = "#FEBE10",
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(cardRef, { once: true, margin: "-80px" });
  const { setCursor, resetCursor, setMagneticTarget } = useCursor();
  const [hasCompleted, setHasCompleted] = useState(false);

  const IconComponent = ICON_MAP[icon] || HelpCircle;

  // Split integer value into individual string digits
  const digits = value.toString().split("").map(Number);

  // Trigger celebration micro-burst upon count completion
  useEffect(() => {
    if (isInView && !hasCompleted) {
      const timer = setTimeout(() => {
        setHasCompleted(true);
        // Micro golden confetti spark from card position
        if (cardRef.current && typeof window !== "undefined") {
          const rect = cardRef.current.getBoundingClientRect();
          const x = (rect.left + rect.width / 2) / window.innerWidth;
          const y = (rect.top + rect.height / 2) / window.innerHeight;

          confetti({
            particleCount: 15,
            spread: 45,
            origin: { x, y },
            colors: ["#FEBE10", "#FFFFFF", "#D97706"],
            disableForReducedMotion: true,
            ticks: 50,
            gravity: 1.2,
            scalar: 0.7,
          });
        }
      }, 2300);
      return () => clearTimeout(timer);
    }
  }, [isInView, hasCompleted]);

  const handleMouseEnter = () => {
    soundFx.playHover();
    setCursor("hover", label.split(" ")[0].toUpperCase());
    if (cardRef.current) {
      setMagneticTarget(cardRef.current);
    }
  };

  const handleMouseLeave = () => {
    resetCursor();
    setMagneticTarget(null);
  };

  return (
    <motion.div
      ref={cardRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className="group relative p-6 sm:p-8 rounded-2xl border border-white/10 bg-black/40 backdrop-blur-md transition-all duration-500 hover:border-gold/50 hover:bg-gold/[0.04] hover:shadow-[0_0_30px_rgba(254,190,16,0.15)] flex flex-col justify-between overflow-hidden"
    >
      {/* Corner Icon & Glow Accent */}
      <div className="flex justify-between items-start mb-6">
        <span className="font-bebas text-xs tracking-[0.25em] text-gray-400 uppercase">
          Career Record
        </span>
        <div
          className="p-2.5 rounded-xl border border-white/10 bg-white/5 transition-transform duration-300 group-hover:scale-110 group-hover:border-gold/40"
          style={{ color }}
        >
          <IconComponent className="w-5 h-5 drop-shadow-[0_0_8px_currentColor]" />
        </div>
      </div>

      {/* Main Odometer Numerals */}
      <div className="flex items-baseline space-x-0.5 my-2">
        {digits.map((digit, idx) => (
          <DigitColumn
            key={idx}
            targetDigit={digit}
            isTriggered={isInView}
            delay={idx * 0.12}
          />
        ))}

        {suffix && (
          <span
            className="font-anton text-4xl sm:text-6xl text-gold ml-1 select-none animate-pulse"
            style={{ color }}
          >
            {suffix}
          </span>
        )}
      </div>

      {/* Label and Context Narrative */}
      <div className="mt-4 pt-4 border-t border-white/10">
        <h3 className="font-bebas text-lg sm:text-xl tracking-wider uppercase text-white group-hover:text-gold transition-colors duration-300">
          {label}
        </h3>
        <p className="font-inter text-xs text-gray-400 mt-1 line-clamp-2 leading-relaxed">
          {description}
        </p>
      </div>

      {/* Subtle Bottom Accent Gradient Bar */}
      <div
        className="absolute bottom-0 left-0 right-0 h-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{
          background: `linear-gradient(90deg, transparent, ${color}, transparent)`,
        }}
      />
    </motion.div>
  );
};
