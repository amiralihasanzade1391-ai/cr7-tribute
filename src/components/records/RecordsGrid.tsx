"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Award, Zap, Trophy, Flame, Globe, ArrowUpRight, Sparkles } from "lucide-react";
import { CR7_RECORDS, RecordItem } from "@/data/records";

// Animated counter hook
function AnimatedNumber({ value, suffix = "" }: { value: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    if (!isInView) return;
    let start = 0;
    const duration = 1600; // ms
    const startTime = performance.now();

    const animateCount = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const easeProgress = 1 - Math.pow(1 - progress, 3);
      const current = Math.floor(easeProgress * value);
      setDisplayValue(current);

      if (progress < 1) {
        requestAnimationFrame(animateCount);
      } else {
        setDisplayValue(value);
      }
    };

    requestAnimationFrame(animateCount);
  }, [isInView, value]);

  return (
    <span ref={ref} className="font-mono">
      {displayValue.toLocaleString()}
      {suffix}
    </span>
  );
}

export function RecordsGrid() {
  const [category, setCategory] = useState<string>("all");

  const filtered = category === "all"
    ? CR7_RECORDS
    : CR7_RECORDS.filter((r) => r.category === category);

  return (
    <section id="records-grid" className="py-28 sm:py-36 bg-black relative border-t border-zinc-900 select-none">
      {/* Background radial glow */}
      <div className="absolute top-1/3 right-1/4 w-[500px] h-[500px] bg-[#FEBE10]/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-8 relative z-10">
        {/* Header */}
        <div className="text-center mb-16 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-bold tracking-widest uppercase bg-[#FEBE10]/15 text-[#FEBE10] border border-[#FEBE10]/30 shadow-[0_0_15px_rgba(254,190,16,0.15)]">
            <Trophy className="w-3.5 h-3.5 fill-[#FEBE10]" />
            IMMUTABLE FOOTBALL HISTORY
          </div>
          <h2
            className="text-4xl sm:text-6xl lg:text-7xl font-black uppercase tracking-tight text-white"
            style={{ fontFamily: "Anton, sans-serif" }}
          >
            The Record Vault
          </h2>
          <p className="text-zinc-400 text-sm sm:text-base max-w-2xl mx-auto font-mono">
            Statistical supremacy across two decades. Records etched in stone that redefine the boundaries of human athletic endurance.
          </p>

          {/* Filter Tabs */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-6">
            {[
              { id: "all", label: "All Records" },
              { id: "all-time", label: "All-Time Historic" },
              { id: "ucl", label: "Champions League" },
              { id: "international", label: "International" },
              { id: "longevity", label: "Longevity" },
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => setCategory(cat.id)}
                className={`px-4 py-2 rounded-full text-xs font-mono font-bold tracking-wider uppercase transition-all ${
                  category === cat.id
                    ? "bg-[#FEBE10] text-black shadow-[0_0_15px_rgba(254,190,16,0.35)] scale-105"
                    : "bg-zinc-900/80 text-zinc-400 hover:text-white hover:bg-zinc-800 border border-zinc-800"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Records Grid Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {filtered.map((record) => (
            <motion.div
              key={record.id}
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.35 }}
              className="group relative flex flex-col justify-between p-6 rounded-2xl bg-zinc-950/70 hover:bg-zinc-900/80 border border-zinc-800/80 hover:border-[#FEBE10]/60 backdrop-blur-xl transition-all duration-300 shadow-xl overflow-hidden hover:shadow-[0_0_30px_rgba(254,190,16,0.15)]"
            >
              {/* Top Row: Metric & Ongoing Badge */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[10px] font-mono font-semibold uppercase tracking-widest text-[#FEBE10] px-2.5 py-0.5 rounded-full bg-[#FEBE10]/10 border border-[#FEBE10]/20">
                    {record.competition}
                  </span>

                  {record.isOngoing && (
                    <span className="flex items-center gap-1 text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/30">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                      Active
                    </span>
                  )}
                </div>

                {/* Animated Huge Metric */}
                <div className="text-5xl sm:text-6xl font-black text-white tracking-tight my-2 flex items-baseline gap-1">
                  <AnimatedNumber value={record.metric} suffix={record.suffix} />
                </div>

                {/* Record Title */}
                <h3 className="text-base font-bold text-zinc-100 tracking-tight mt-3 line-clamp-2 group-hover:text-[#FEBE10] transition-colors">
                  {record.title}
                </h3>

                {/* Description */}
                <p className="text-xs text-zinc-400 mt-2 leading-relaxed">
                  {record.details}
                </p>
              </div>

              {/* Card Footer */}
              <div className="mt-6 pt-4 border-t border-zinc-800/80 flex items-center justify-between text-[11px] font-mono text-zinc-500">
                <span className="capitalize">{record.category}</span>
                <span className="text-zinc-400 group-hover:text-[#FEBE10] flex items-center gap-0.5 transition-colors">
                  Verified <Sparkles className="w-3 h-3 ml-1 text-[#FEBE10]" />
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default RecordsGrid;
