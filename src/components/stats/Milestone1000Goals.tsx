"use client";

import React, { useRef, useState, useEffect } from "react";
import { motion, useInView } from "framer-motion";
import { MILESTONE_RING_TICKS } from "@/data/stats";
import { useCursor } from "@/components/cursor/CursorContext";
import { soundFx } from "@/lib/utils";

interface Milestone1000GoalsProps {
  currentGoals?: number;
  targetGoals?: number;
}

export const Milestone1000Goals: React.FC<Milestone1000GoalsProps> = ({
  currentGoals = 981,
  targetGoals = 1000,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: "-100px" });
  const { setCursor, resetCursor, setMagneticTarget } = useCursor();

  const [hoveredMilestone, setHoveredMilestone] = useState<{
    milestone: number;
    year: string;
    opponent: string;
  } | null>(null);

  const [animationSettled, setAnimationSettled] = useState(false);

  useEffect(() => {
    if (isInView) {
      const timer = setTimeout(() => {
        setAnimationSettled(true);
      }, 3100);
      return () => clearTimeout(timer);
    }
  }, [isInView]);

  // Geometry calculations
  const size = 320; // SVG canvas size
  const strokeWidth = 10;
  const radius = (size - strokeWidth * 2) / 2 - 20; // ~130px
  const circumference = 2 * Math.PI * radius; // ~816.8px
  const progressRatio = currentGoals / targetGoals; // 0.981
  const targetOffset = circumference * (1 - progressRatio);
  const remainingGoals = targetGoals - currentGoals;

  return (
    <div
      ref={containerRef}
      className="relative w-full max-w-4xl mx-auto my-12 p-8 sm:p-12 rounded-3xl border border-white/10 bg-black/50 backdrop-blur-xl shadow-2xl flex flex-col items-center select-none overflow-hidden"
    >
      {/* Background Radial Glow Accent */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full pointer-events-none opacity-25 blur-3xl"
        style={{
          background: "radial-gradient(circle, #FEBE10 0%, transparent 70%)",
        }}
        aria-hidden="true"
      />

      {/* Header Label */}
      <div className="text-center z-10 mb-6">
        <span className="font-bebas text-xs sm:text-sm tracking-[0.35em] text-gold uppercase px-4 py-1.5 rounded-full border border-gold/30 bg-gold/10 inline-block mb-3">
          The Final Frontier
        </span>
        <h3 className="font-anton text-3xl sm:text-5xl uppercase tracking-wider text-white">
          ROAD TO 1,000 OFFICIAL GOALS
        </h3>
        <p className="font-inter text-sm text-gray-400 mt-2 max-w-md mx-auto">
          No player in professional football history has ever officially touched four figures. The countdown is alive.
        </p>
      </div>

      {/* Circular Progress Gauge with Organic Breathing Animation */}
      <motion.div
        className="relative z-10 flex items-center justify-center my-4"
        animate={
          animationSettled
            ? {
                scale: [1, 1.025, 1],
              }
            : {}
        }
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        <svg
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
          className="w-64 h-64 sm:w-80 sm:h-80 -rotate-90 overflow-visible"
          aria-hidden="true"
        >
          <defs>
            <linearGradient id="ringGoldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFF2B2" />
              <stop offset="50%" stopColor="#FEBE10" />
              <stop offset="100%" stopColor="#D97706" />
            </linearGradient>

            <filter id="ringGoldenGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="0" stdDeviation="6" floodColor="#FEBE10" floodOpacity="0.7" />
            </filter>
          </defs>

          {/* Background Track Ring */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="rgba(255, 255, 255, 0.08)"
            strokeWidth={strokeWidth}
          />

          {/* Active Golden Progress Ring */}
          <motion.circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="url(#ringGoldGradient)"
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={isInView ? targetOffset : circumference}
            strokeLinecap="round"
            filter="url(#ringGoldenGlow)"
            transition={{
              duration: 2.8,
              ease: [0.16, 1, 0.3, 1],
            }}
          />

          {/* Milestone Tick Marks */}
          {MILESTONE_RING_TICKS.map((tick) => {
            const angleRad = ((tick.milestone / targetGoals) * 360 * Math.PI) / 180;
            const tickX = size / 2 + (radius + 14) * Math.cos(angleRad);
            const tickY = size / 2 + (radius + 14) * Math.sin(angleRad);
            const isPassed = tick.milestone <= currentGoals;

            return (
              <g
                key={tick.milestone}
                className="cursor-pointer"
                onMouseEnter={() => {
                  soundFx.playHover();
                  setHoveredMilestone(tick);
                }}
                onMouseLeave={() => setHoveredMilestone(null)}
              >
                <circle
                  cx={tickX}
                  cy={tickY}
                  r={isPassed ? 4.5 : 3.5}
                  fill={isPassed ? "#FEBE10" : "rgba(255,255,255,0.3)"}
                  className="transition-all duration-300 hover:scale-150"
                />
              </g>
            );
          })}
        </svg>

        {/* Center Content Inside Ring */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
          <span className="font-bebas text-xs tracking-widest text-muted uppercase">
            Active Count
          </span>
          <div className="flex items-baseline space-x-1 my-0.5">
            <span className="font-anton text-4xl sm:text-6xl text-white tracking-tight drop-shadow-[0_0_15px_rgba(254,190,16,0.3)]">
              {currentGoals}
            </span>
            <span className="font-anton text-xl sm:text-2xl text-gold">
              / 1,000
            </span>
          </div>

          <div className="flex items-center space-x-2 mt-1">
            <span className="w-2 h-2 rounded-full bg-gold animate-ping" />
            <span className="font-bebas text-xs sm:text-sm tracking-widest text-gold uppercase">
              {remainingGoals} goals to go
            </span>
          </div>

          <span className="font-inter text-[11px] text-gray-400 font-medium mt-1">
            {(progressRatio * 100).toFixed(1)}% Completed
          </span>
        </div>
      </motion.div>

      {/* Tooltip for Milestone Ticks */}
      <div className="h-10 mt-2 z-20 flex items-center justify-center text-center">
        {hoveredMilestone ? (
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            className="px-4 py-1.5 rounded-full border border-gold/40 bg-black/80 backdrop-blur-md text-xs font-inter text-gray-200"
          >
            <span className="font-bold text-gold uppercase mr-2">
              {hoveredMilestone.milestone}th Goal:
            </span>
            <span>{hoveredMilestone.opponent}</span>
            <span className="text-gray-400 ml-1.5">({hoveredMilestone.year})</span>
          </motion.div>
        ) : (
          <span className="font-bebas text-xs tracking-widest text-muted uppercase">
            Hover ring nodes to inspect historic century milestones (500, 600, 700, 800, 900)
          </span>
        )}
      </div>
    </div>
  );
};
