"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { JUMP_COMPARISONS } from "@/data/cyborg";

export function JumpSimulator() {
  const [selectedId, setSelectedId] = useState("ronaldo");
  const selected = JUMP_COMPARISONS.find((j) => j.id === selectedId)!;
  const maxHeight = 2.56;
  const barHeight = (selected.jumpHeight / maxHeight) * 100;

  return (
    <div className="rounded-2xl border border-cyan-500/30 bg-black/60 backdrop-blur-md p-6 sm:p-8">
      <div className="flex items-center gap-2 mb-6">
        <span className="text-2xl">🦅</span>
        <h3 className="text-xl font-black text-white uppercase tracking-wide" style={{ fontFamily: "Anton, sans-serif" }}>
          Vertical Jump Simulator
        </h3>
      </div>

      {/* Comparison Bars */}
      <div className="space-y-3 mb-6">
        {JUMP_COMPARISONS.map((jump) => {
          const h = (jump.jumpHeight / maxHeight) * 100;
          const isSelected = jump.id === selectedId;
          return (
            <button
              key={jump.id}
              onClick={() => setSelectedId(jump.id)}
              className={`w-full text-left transition-all ${
                isSelected ? "scale-[1.02]" : "opacity-60 hover:opacity-90"
              }`}
            >
              <div className="flex justify-between text-xs text-zinc-400 mb-1">
                <span className={isSelected ? "text-white font-bold" : ""}>{jump.name}</span>
                <span style={{ color: jump.color }}>{jump.jumpHeight}m</span>
              </div>
              <div className="h-3 rounded-full bg-zinc-900 overflow-hidden border border-zinc-800">
                <motion.div
                  className="h-full rounded-full"
                  style={{ backgroundColor: jump.color, boxShadow: `0 0 20px ${jump.color}80` }}
                  initial={{ width: 0 }}
                  animate={{ width: `${h}%` }}
                  transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                />
              </div>
            </button>
          );
        })}
      </div>

      {/* Stats Display */}
      <div className="grid grid-cols-3 gap-3 pt-4 border-t border-zinc-800">
        <div>
          <p className="text-[10px] text-zinc-500 uppercase tracking-widest">Jump Height</p>
          <p className="text-2xl font-black" style={{ color: selected.color }}>{selected.jumpHeight}m</p>
        </div>
        <div>
          <p className="text-[10px] text-zinc-500 uppercase tracking-widest">G-Force</p>
          <p className="text-2xl font-black" style={{ color: selected.color }}>{selected.gForce}G</p>
        </div>
        <div>
          <p className="text-[10px] text-zinc-500 uppercase tracking-widest">Air Time</p>
          <p className="text-2xl font-black" style={{ color: selected.color }}>
            {(selected.jumpHeight * 0.71).toFixed(2)}s
          </p>
        </div>
      </div>

      <p className="text-[11px] text-zinc-500 mt-4 leading-relaxed">
        ⚡ At 5G takeoff force, Ronaldo experiences the same acceleration as a jet pilot.
        His 2.56m header against Sampdoria (2019) froze mid-air for 0.71 seconds.
      </p>
    </div>
  );
}
