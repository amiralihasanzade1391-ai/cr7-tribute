"use client";

import React, { useState, useMemo } from "react";
import { ICONIC_MOMENTS_DATA, MOMENT_CATEGORIES } from "@/data/moments";
import { FilterCategory, IconicMoment } from "@/types/moment";
import { MomentCard } from "./MomentCard";
import { LightboxModal } from "./LightboxModal";
import { soundFx } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

export const IconicMomentsGallery: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<FilterCategory>("all");
  const [selectedMoment, setSelectedMoment] = useState<IconicMoment | null>(null);

  // Filter moments according to category
  const filteredMoments = useMemo(() => {
    if (activeCategory === "all") return ICONIC_MOMENTS_DATA;
    return ICONIC_MOMENTS_DATA.filter((m) => m.category === activeCategory);
  }, [activeCategory]);

  const handleCategoryChange = (category: FilterCategory) => {
    soundFx.playClick();
    setActiveCategory(category);
  };

  return (
    <section
      id="iconic-moments"
      className="relative w-full py-24 sm:py-32 px-6 sm:px-12 bg-[#060608] text-white overflow-hidden"
      aria-label="Cristiano Ronaldo Iconic Moments Gallery"
    >
      {/* Background Ambient Radial Glow */}
      <div
        className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[800px] h-[800px] pointer-events-none opacity-10 blur-[140px]"
        style={{
          background: "radial-gradient(circle, #FEBE10 0%, transparent 70%)",
        }}
        aria-hidden="true"
      />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header */}
        <div className="text-center mb-12 sm:mb-16">
          <span className="font-bebas text-xs sm:text-sm tracking-[0.4em] text-gold uppercase mb-3 inline-block">
            MUSEUM ARCHIVE
          </span>
          <h2 className="font-anton text-5xl sm:text-7xl lg:text-8xl tracking-tight uppercase leading-none text-white drop-shadow-lg">
            ICONIC MOMENTS
          </h2>
          <p className="font-inter text-sm sm:text-base text-gray-400 mt-4 max-w-xl mx-auto font-light leading-relaxed">
            24 legendary snapshots that defined a generation. Click any frame to step inside the moment.
          </p>

          {/* Category Filter Tabs */}
          <div className="flex flex-wrap justify-center items-center gap-2 sm:gap-4 mt-8 select-none">
            {MOMENT_CATEGORIES.map((cat) => {
              const isActive = activeCategory === cat.id;
              const count =
                cat.id === "all"
                  ? ICONIC_MOMENTS_DATA.length
                  : ICONIC_MOMENTS_DATA.filter((m) => m.category === cat.id).length;

              return (
                <button
                  key={cat.id}
                  onClick={() => handleCategoryChange(cat.id)}
                  className={`relative px-4 sm:px-5 py-2.5 rounded-full font-bebas text-sm sm:text-base tracking-widest uppercase transition-colors duration-300 focus:outline-none flex items-center gap-2 ${
                    isActive
                      ? "text-gold"
                      : "text-gray-400 hover:text-white"
                  }`}
                  aria-pressed={isActive}
                >
                  <span>{cat.label}</span>
                  <span className="text-[11px] px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-muted">
                    {count}
                  </span>

                  {/* Animated Golden Underline using Framer Motion layoutId */}
                  {isActive && (
                    <motion.div
                      layoutId="categoryUnderline"
                      className="absolute bottom-0 left-3 right-3 h-[2px] bg-gradient-to-r from-gold/40 via-gold to-gold/40 rounded-full shadow-[0_0_8px_#FEBE10]"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Masonry Grid (Pure CSS Columns for 60fps Performance) */}
        <motion.div
          layout
          className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6"
        >
          <AnimatePresence>
            {filteredMoments.map((moment, index) => (
              <MomentCard
                key={moment.id}
                moment={moment}
                onSelect={setSelectedMoment}
                priority={index < 3}
              />
            ))}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Full-Screen Lightbox Modal */}
      <LightboxModal
        moment={selectedMoment}
        allMoments={filteredMoments}
        onClose={() => setSelectedMoment(null)}
        onNavigate={setSelectedMoment}
      />
    </section>
  );
};
