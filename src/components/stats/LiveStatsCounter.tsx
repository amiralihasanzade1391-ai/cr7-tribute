"use client";

import React from "react";
import { CAREER_STATS } from "@/data/stats";
import { StatCard } from "./StatCard";
import { Milestone1000Goals } from "./Milestone1000Goals";
import { GoalBreakdownChart } from "./GoalBreakdownChart";
import { motion } from "framer-motion";

export const LiveStatsCounter: React.FC = () => {
  return (
    <section
      id="live-stats"
      className="relative w-full py-24 sm:py-32 bg-[#08080B] text-white overflow-hidden"
      aria-label="Cristiano Ronaldo Live Career Statistics and Records"
    >
      {/* Background Ambient Lighting */}
      <div
        className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[700px] pointer-events-none opacity-15 blur-[120px]"
        style={{
          background: "radial-gradient(circle, #FEBE10 0%, transparent 70%)",
        }}
        aria-hidden="true"
      />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16 sm:mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <span className="font-bebas text-xs sm:text-sm tracking-[0.4em] text-gold uppercase mb-3 inline-block">
              IMMORTAL MILESTONES
            </span>
            <h2 className="font-anton text-5xl sm:text-7xl lg:text-8xl tracking-tight uppercase leading-none text-white drop-shadow-lg">
              THE NUMBERS
            </h2>
            <p className="font-inter text-sm sm:text-base text-gray-400 mt-4 max-w-xl mx-auto font-light leading-relaxed">
              A monumental career forged over two decades, defined by statistics and world records that may never be matched in human history.
            </p>
          </motion.div>
        </div>

        {/* 1. Grid of 6 Career Stat Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {CAREER_STATS.map((stat) => (
            <StatCard key={stat.id} {...stat} />
          ))}
        </div>

        {/* 2. Centerpiece: Road to 1,000 Goals Milestone Radar */}
        <Milestone1000Goals currentGoals={981} targetGoals={1000} />

        {/* 3. Goal Breakdown Weaponry Chart */}
        <GoalBreakdownChart />
      </div>
    </section>
  );
};
