"use client";

import { motion } from "framer-motion";
import { KNUCKLEBALL_DATA } from "@/data/cyborg";

export function KnuckleballPhysics() {
  return (
    <div className="rounded-2xl border border-cyan-500/30 bg-black/60 backdrop-blur-md p-6 sm:p-8">
      <div className="flex items-center gap-2 mb-6">
        <span className="text-2xl">🌀</span>
        <h3 className="text-xl font-black text-white uppercase tracking-wide" style={{ fontFamily: "Anton, sans-serif" }}>
          Knuckleball Physics
        </h3>
      </div>

      {/* Visual: Ball trajectory with no spin */}
      <div className="relative h-32 mb-6 rounded-xl bg-gradient-to-b from-zinc-900 to-black border border-zinc-800 overflow-hidden">
        {/* Dashed curve path (SVG) */}
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 400 128" preserveAspectRatio="none">
          <motion.path
            d="M 20 20 Q 200 60 380 100"
            fill="none"
            stroke="#06B6D4"
            strokeWidth="2"
            strokeDasharray="4 4"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 2, ease: "easeOut" }}
          />
        </svg>
        
        {/* Ball */}
        <motion.div
          className="absolute w-6 h-6 rounded-full bg-white shadow-[0_0_20px_rgba(255,255,255,0.6)]"
          initial={{ left: "5%", top: "10%" }}
          animate={{
            left: ["5%", "50%", "95%"],
            top: ["10%", "40%", "78%"],
          }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        >
          <div className="w-full h-full rounded-full bg-gradient-to-br from-white to-zinc-400 flex items-center justify-center">
            <div className="w-1 h-1 rounded-full bg-black" />
          </div>
        </motion.div>

        {/* Random chaotic wobble lines */}
        <motion.div
          className="absolute right-8 top-1/2 text-cyan-400 text-xs font-mono"
          animate={{ opacity: [0.3, 1, 0.3] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          ~0 RPM
        </motion.div>
      </div>

      {/* Data Grid */}
      <div className="grid grid-cols-2 gap-3">
        {KNUCKLEBALL_DATA.map((item) => (
          <div key={item.label} className="p-3 rounded-lg bg-zinc-900/60 border border-zinc-800">
            <p className="text-[10px] text-zinc-500 uppercase tracking-widest">{item.label}</p>
            <p className="text-lg font-black text-cyan-400 mt-1">{item.value}</p>
            <p className="text-[10px] text-zinc-500 mt-1 leading-tight">{item.detail}</p>
          </div>
        ))}
      </div>

      <p className="text-[11px] text-zinc-500 mt-4 leading-relaxed">
        ⚡ Without spin, the Magnus effect is cancelled. Airflow separates chaotically on both sides, 
        causing the ball to drop unpredictably — the "knuckleball" phenomenon.
      </p>
    </div>
  );
}
