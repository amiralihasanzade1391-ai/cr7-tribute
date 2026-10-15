"use client";

import React, { useRef } from "react";
import { motion } from "framer-motion";
import { scrollToTarget } from "@/lib/lenis";
import { useCursor } from "@/components/cursor/CursorContext";
import { soundFx } from "@/lib/utils";

interface ScrollIndicatorProps {
  targetSectionId?: string;
}

export const ScrollIndicator: React.FC<ScrollIndicatorProps> = ({
  targetSectionId = "#live-stats",
}) => {
  const { setCursor, resetCursor, setMagneticTarget } = useCursor();
  const containerRef = useRef<HTMLButtonElement>(null);

  const handleClick = () => {
    soundFx.playClick();
    const target = document.querySelector(targetSectionId) as HTMLElement | null;
    if (target) {
      scrollToTarget(target, { duration: 1.6 });
    } else {
      window.scrollTo({ top: window.innerHeight, behavior: "smooth" });
    }
  };

  const handleMouseEnter = () => {
    soundFx.playHover();
    setCursor("hover", "SCROLL");
    if (containerRef.current) {
      setMagneticTarget(containerRef.current);
    }
  };

  const handleMouseLeave = () => {
    resetCursor();
    setMagneticTarget(null);
  };

  return (
    <button
      ref={containerRef}
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="hidden md:flex flex-col items-center gap-3 cursor-pointer group focus:outline-none z-20 py-2 px-4 transition-transform duration-300"
      aria-label="Scroll down to begin exploring Cristiano Ronaldo career stats"
    >
      {/* Vertical Track with Gliding Golden Dot */}
      <div className="w-[1px] h-16 sm:h-20 bg-white/15 relative overflow-hidden rounded-full">
        <motion.div
          className="w-1.5 h-3 rounded-full bg-gold shadow-[0_0_10px_#FEBE10] absolute left-1/2 -translate-x-1/2"
          animate={{
            y: [-12, 80],
            opacity: [0, 1, 1, 0],
          }}
          transition={{
            duration: 2.2,
            repeat: Infinity,
            ease: [0.65, 0, 0.35, 1],
          }}
        />
      </div>

      {/* Pulsing Golden Status Label */}
      <motion.span
        className="font-bebas text-[11px] tracking-[0.35em] uppercase text-gray-300 group-hover:text-gold transition-colors duration-300"
        animate={{
          opacity: [0.6, 1, 0.6],
          textShadow: [
            "0 0 0px rgba(254, 190, 16, 0)",
            "0 0 12px rgba(254, 190, 16, 0.6)",
            "0 0 0px rgba(254, 190, 16, 0)",
          ],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        Scroll to Begin
      </motion.span>
    </button>
  );
};
