"use client";

import React, { useRef, useState } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { GOAL_BREAKDOWN_DATA } from "@/data/stats";
import { GoalBreakdownItem, MilestoneGoal } from "@/types/stat";
import { useCursor } from "@/components/cursor/CursorContext";
import { soundFx } from "@/lib/utils";
import {
  Footprints,
  Zap,
  Target,
  ArrowUpCircle,
  Flame,
  X,
  Play,
  Calendar,
  Clock,
  Trophy,
} from "lucide-react";

const ICON_MAP: Record<string, React.ElementType> = {
  Footprints,
  Zap,
  Target,
  ArrowUpCircle,
  Flame,
};

export const GoalBreakdownChart: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: "-80px" });
  const { setCursor, resetCursor } = useCursor();

  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [selectedItem, setSelectedItem] = useState<GoalBreakdownItem | null>(null);

  const handleOpenModal = (item: GoalBreakdownItem) => {
    soundFx.playClick();
    setSelectedItem(item);
  };

  const handleCloseModal = () => {
    soundFx.playClick();
    setSelectedItem(null);
  };

  return (
    <div
      ref={containerRef}
      className="w-full max-w-4xl mx-auto my-12 p-8 sm:p-12 rounded-3xl border border-white/10 bg-black/40 backdrop-blur-xl"
    >
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 pb-6 border-b border-white/10">
        <div>
          <span className="font-bebas text-xs sm:text-sm tracking-[0.3em] text-gold uppercase">
            Weaponry Distribution
          </span>
          <h3 className="font-anton text-3xl sm:text-4xl uppercase text-white mt-1">
            ANATOMY OF 981 GOALS
          </h3>
        </div>
        <p className="font-inter text-xs text-gray-400 mt-2 sm:mt-0">
          Click any discipline to inspect iconic milestone goals
        </p>
      </div>

      {/* Horizontal Bars */}
      <div className="space-y-6">
        {GOAL_BREAKDOWN_DATA.map((item) => {
          const IconComponent = ICON_MAP[item.icon] || Footprints;
          const isHovered = hoveredId === item.id;
          const isDimmed = hoveredId !== null && !isHovered;

          return (
            <div
              key={item.id}
              onClick={() => handleOpenModal(item)}
              onMouseEnter={() => {
                soundFx.playHover();
                setHoveredId(item.id);
                setCursor("view", "INSPECT");
              }}
              onMouseLeave={() => {
                setHoveredId(null);
                resetCursor();
              }}
              className={`group cursor-pointer transition-all duration-300 ${
                isDimmed ? "opacity-35" : "opacity-100"
              }`}
            >
              {/* Header Info */}
              <div className="flex justify-between items-center mb-2 text-sm font-inter">
                <div className="flex items-center space-x-3">
                  <div
                    className="p-1.5 rounded-lg border border-white/10 bg-white/5 group-hover:scale-110 transition-transform"
                    style={{ color: item.color }}
                  >
                    <IconComponent className="w-4 h-4" />
                  </div>
                  <span className="font-bebas text-base sm:text-lg tracking-wider uppercase text-white group-hover:text-gold transition-colors">
                    {item.label}
                  </span>
                </div>

                <div className="flex items-baseline space-x-2">
                  <span className="font-anton text-lg sm:text-xl text-white">
                    {item.count}
                  </span>
                  <span className="font-bebas text-xs tracking-wider text-muted uppercase">
                    Goals ({item.percentage}%)
                  </span>
                </div>
              </div>

              {/* Progress Bar Track */}
              <div className="h-3 sm:h-4 w-full bg-white/5 rounded-full overflow-hidden relative border border-white/5">
                <motion.div
                  className="h-full rounded-full relative"
                  style={{
                    background: item.barGradient,
                  }}
                  initial={{ width: 0 }}
                  animate={isInView ? { width: `${item.percentage}%` } : { width: 0 }}
                  transition={{
                    duration: 1.8,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                >
                  {/* Hover Metallic Shimmer Effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                </motion.div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal: Iconic Goals of the Selected Discipline */}
      <AnimatePresence>
        {selectedItem && (
          <div
            className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
            onClick={handleCloseModal}
            role="dialog"
            aria-modal="true"
            aria-label={`${selectedItem.label} Showcase`}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-3xl rounded-3xl border border-gold/40 bg-[#0C0C10] p-6 sm:p-8 shadow-2xl text-white max-h-[90vh] overflow-y-auto"
            >
              {/* Close Button */}
              <button
                onClick={handleCloseModal}
                className="absolute top-6 right-6 p-2 rounded-full border border-white/10 bg-white/5 text-gray-400 hover:text-white hover:border-gold transition-colors"
                aria-label="Close dialog"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="mb-6">
                <span className="font-bebas text-xs tracking-[0.3em] text-gold uppercase">
                  Goal Archive
                </span>
                <h4 className="font-anton text-3xl sm:text-4xl uppercase mt-1">
                  {selectedItem.label}
                </h4>
                <p className="font-inter text-xs text-gray-400 mt-1">
                  {selectedItem.count} official career finishes • {selectedItem.percentage}% of all career goals
                </p>
              </div>

              {/* List of 3 Iconic Goals */}
              <div className="space-y-4">
                {selectedItem.iconicGoals.map((goal, idx) => (
                  <div
                    key={goal.id}
                    className="p-5 rounded-2xl border border-white/10 bg-white/[0.03] hover:border-gold/40 transition-all group"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center space-x-2">
                        <span className="w-6 h-6 rounded-full bg-gold/15 text-gold font-anton text-xs flex items-center justify-center">
                          #{idx + 1}
                        </span>
                        <h5 className="font-anton text-lg tracking-wide uppercase text-white group-hover:text-gold transition-colors">
                          vs {goal.opponent}
                        </h5>
                      </div>
                      <span className="font-bebas text-xs px-2.5 py-0.5 rounded-full bg-gold/10 text-gold border border-gold/30">
                        {goal.minute}
                      </span>
                    </div>

                    <p className="font-inter text-xs text-gray-300 leading-relaxed mb-3">
                      {goal.description}
                    </p>

                    <div className="flex flex-wrap items-center gap-4 text-[11px] font-inter text-gray-400 border-t border-white/5 pt-3">
                      <span className="flex items-center gap-1">
                        <Trophy className="w-3.5 h-3.5 text-gold" />
                        {goal.competition}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-muted" />
                        {goal.date}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
