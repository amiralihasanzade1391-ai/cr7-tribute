"use client";

import { useState, useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { GOALS_DATA, Goal } from "@/data/goals";
import { GoalCard } from "./GoalCard";
import { VideoModal } from "./VideoModal";

export function GoalReel() {
  const [active, setActive] = useState<Goal | null>(null);
  const scrollerRef = useRef<HTMLDivElement>(null);

  const scroll = (dir: "left" | "right") => {
    if (!scrollerRef.current) return;
    const amount = 340;
    scrollerRef.current.scrollBy({ left: dir === "left" ? -amount : amount, behavior: "smooth" });
  };

  return (
    <section id="goal-reel" className="py-24 bg-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12">
        <div className="flex justify-between items-end mb-10 flex-wrap gap-4">
          <div>
            <h2
              className="text-5xl sm:text-7xl font-black text-white uppercase tracking-tight"
              style={{ fontFamily: "Anton, sans-serif" }}
            >
              Goal Reel
            </h2>
            <p className="text-zinc-400 mt-2 text-base sm:text-lg">
              {GOALS_DATA.length} moments that made the world stand up
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => scroll("left")}
              className="w-11 h-11 rounded-full bg-zinc-900 border border-zinc-700 flex items-center justify-center hover:bg-yellow-500 hover:text-black transition"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={() => scroll("right")}
              className="w-11 h-11 rounded-full bg-zinc-900 border border-zinc-700 flex items-center justify-center hover:bg-yellow-500 hover:text-black transition"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>

        <div
          ref={scrollerRef}
          className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {GOALS_DATA.map((goal) => (
            <GoalCard key={goal.id} goal={goal} onClick={() => setActive(goal)} />
          ))}
        </div>
      </div>

      <VideoModal goal={active} onClose={() => setActive(null)} />
    </section>
  );
}
