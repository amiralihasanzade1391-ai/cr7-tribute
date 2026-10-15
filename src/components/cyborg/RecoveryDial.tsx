"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { RECOVERY_PHASES } from "@/data/cyborg";

export function RecoveryDial() {
  const [activeIdx, setActiveIdx] = useState<number | null>(null);
  const active = activeIdx !== null ? RECOVERY_PHASES[activeIdx] : null;

  const radius = 120;
  const circumference = 2 * Math.PI * radius;

  return (
    <div className="rounded-2xl border border-cyan-500/30 bg-black/60 backdrop-blur-md p-6 sm:p-8">
      <div className="flex items-center gap-2 mb-6">
        <span className="text-2xl">🕐</span>
        <h3 className="text-xl font-black text-white uppercase tracking-wide" style={{ fontFamily: "Anton, sans-serif" }}>
          24-Hour Recovery Dial
        </h3>
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-8">
        {/* SVG Dial */}
        <div className="relative w-[300px] h-[300px] flex-shrink-0">
          <svg viewBox="0 0 300 300" className="w-full h-full -rotate-90">
            {/* Background circle */}
            <circle cx="150" cy="150" r={radius} fill="none" stroke="#18181B" strokeWidth="2" />
            {/* Progress markers for each phase */}
            {RECOVERY_PHASES.map((phase, idx) => {
              const angle = (idx / RECOVERY_PHASES.length) * 360;
              const isActive = idx === activeIdx;
              return (
                <g key={phase.id} transform={`rotate(${angle} 150 150)`}>
                  <circle
                    cx="150"
                    cy="30"
                    r="6"
                    fill={isActive ? phase.color : "#3F3F46"}
                    style={{ transition: "all 0.3s" }}
                  />
                </g>
              );
            })}
          </svg>

          {/* Center display */}
          <div className="absolute inset-0 flex items-center justify-center">
            {active ? (
              <motion.div
                key={active.id}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="text-center px-4"
              >
                <div className="text-4xl mb-2">{active.icon}</div>
                <p className="text-2xl font-black" style={{ color: active.color }}>{active.time}</p>
                <p className="text-xs text-zinc-400 uppercase tracking-widest mt-1">{active.activity}</p>
              </motion.div>
            ) : (
              <div className="text-center">
                <p className="text-3xl font-black text-white">24H</p>
                <p className="text-xs text-zinc-500 uppercase tracking-widest mt-1">Click a phase</p>
              </div>
            )}
          </div>
        </div>

        {/* Phase List */}
        <div className="flex-1 w-full space-y-2">
          {RECOVERY_PHASES.map((phase, idx) => (
            <button
              key={phase.id}
              onMouseEnter={() => setActiveIdx(idx)}
              onClick={() => setActiveIdx(idx)}
              className={`w-full flex items-center gap-3 p-3 rounded-lg border transition-all text-left ${
                activeIdx === idx
                  ? "border-cyan-500/50 bg-cyan-950/30"
                  : "border-zinc-800 bg-zinc-900/40 hover:border-zinc-700"
              }`}
            >
              <span className="text-lg">{phase.icon}</span>
              <span className="text-xs font-mono" style={{ color: phase.color }}>{phase.time}</span>
              <span className="text-sm text-zinc-300 flex-1">{phase.activity}</span>
            </button>
          ))}
        </div>
      </div>

      {active && (
        <motion.p
          key={active.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-sm text-zinc-400 mt-6 pt-4 border-t border-zinc-800 italic"
        >
          {active.description}
        </motion.p>
      )}
    </div>
  );
}
