"use client";

import { useState } from "react";
import { Play } from "lucide-react";
import { Goal } from "@/data/goals";

interface GoalCardProps {
  goal: Goal;
  onClick: () => void;
}

export function GoalCard({ goal, onClick }: GoalCardProps) {
  const [imgError, setImgError] = useState(false);

  return (
    <div
      onClick={onClick}
      className="group relative flex-shrink-0 w-[280px] sm:w-[320px] cursor-pointer"
    >
      {/* Thumbnail */}
      <div className="relative aspect-video rounded-xl overflow-hidden border border-zinc-800 group-hover:border-yellow-500/60 transition-all duration-300">
        {!imgError ? (
          <img
            src={goal.thumbnail}
            alt={goal.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-zinc-900 to-black flex items-center justify-center">
            <span className="text-4xl">⚽</span>
          </div>
        )}

        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

        {/* Play Button */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-14 h-14 rounded-full bg-yellow-500/90 flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-[0_0_40px_rgba(254,190,16,0.5)]">
            <Play className="w-6 h-6 text-black fill-black ml-0.5" />
          </div>
        </div>

        {/* Duration / Year Badge */}
        <div className="absolute top-3 right-3 px-2 py-1 rounded bg-black/70 backdrop-blur-sm text-[10px] font-bold text-yellow-400 border border-yellow-500/30">
          {goal.year}
        </div>
      </div>

      {/* Info */}
      <div className="mt-3">
        <h3 className="text-sm font-bold text-white uppercase tracking-tight line-clamp-1 group-hover:text-yellow-400 transition-colors">
          {goal.title}
        </h3>
        <p className="text-[11px] text-zinc-500 mt-0.5">
          {goal.opponent} • {goal.competition}
        </p>
      </div>
    </div>
  );
}
