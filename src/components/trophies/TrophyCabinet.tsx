"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { TROPHIES_DATA, TROPHY_CATEGORIES } from "@/data/trophies";
import { TrophyItem } from "./TrophyItem";

export function TrophyCabinet() {
  const [category, setCategory] = useState<string>("all");

  const filtered = category === "all"
    ? TROPHIES_DATA
    : TROPHIES_DATA.filter((t) => t.category === category);

  const total = TROPHIES_DATA.filter((t) => t.category !== "records").reduce((sum, t) => sum + t.count, 0);

  return (
    <section id="trophy-cabinet" className="py-24 bg-black">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h2
            className="text-5xl sm:text-7xl lg:text-8xl font-black uppercase tracking-tight mb-4"
            style={{
              fontFamily: "Anton, sans-serif",
              background: "linear-gradient(180deg, #FEBE10 0%, #B8860B 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            The Cabinet
          </h2>
          <p className="text-zinc-400 text-base sm:text-lg max-w-2xl mx-auto">
            {total}+ major trophies. 5 Ballon d'Or. Every. Single. One.
          </p>

          <div className="mt-6 flex justify-center">
            <a
              href="/trophy-room"
              className="group inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-gradient-to-r from-[#FEBE10] via-yellow-400 to-[#d49e0c] text-black font-mono font-black text-xs uppercase tracking-widest shadow-[0_0_25px_rgba(254,190,16,0.4)] hover:shadow-[0_0_35px_rgba(254,190,16,0.6)] hover:scale-105 transition-all"
            >
              <span className="w-2 h-2 rounded-full bg-black animate-ping" />
              <span>Enter 3D Royal Trophy Room</span>
              <span className="text-sm font-bold group-hover:translate-x-0.5 transition-transform">↗</span>
            </a>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {TROPHY_CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setCategory(cat.id)}
              className={`px-5 py-2.5 rounded-full text-xs uppercase tracking-widest font-bold transition-all ${
                category === cat.id
                  ? "bg-yellow-500 text-black"
                  : "bg-zinc-900 text-zinc-400 hover:bg-zinc-800 border border-zinc-800"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Grid */}
        <motion.div layout className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          <AnimatePresence>
            {filtered.map((trophy) => (
              <motion.div
                key={trophy.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
              >
                <TrophyItem trophy={trophy} />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}
