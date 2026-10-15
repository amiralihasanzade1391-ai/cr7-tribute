"use client";

import { motion } from "framer-motion";
import { JumpSimulator } from "./JumpSimulator";
import { KnuckleballPhysics } from "./KnuckleballPhysics";
import { RecoveryDial } from "./RecoveryDial";

export function CyborgLab() {
  return (
    <section id="cyborg-lab" className="py-24 bg-black relative overflow-hidden">
      {/* Ambient glow */}
      <div className="absolute inset-0 pointer-events-none opacity-30">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-cyan-500/20 blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-blue-500/20 blur-[120px]" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-cyan-500/40 bg-cyan-950/40 text-cyan-300 text-xs uppercase tracking-widest font-bold mb-6"
          >
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            Superhuman Biometrics
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-5xl sm:text-7xl lg:text-8xl font-black uppercase tracking-tight mb-4"
            style={{
              fontFamily: "Anton, sans-serif",
              background: "linear-gradient(180deg, #22D3EE 0%, #0891B2 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            The Cyborg Lab
          </motion.h2>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-zinc-400 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed"
          >
            Beyond trophies and highlights lies the biological mystery: how a 39-year-old
            defies physics, gravity, and time. Interactive tools to decode the science.
          </motion.p>
        </div>

        {/* Grid of tools */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            <JumpSimulator />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <KnuckleballPhysics />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="lg:col-span-2"
          >
            <RecoveryDial />
          </motion.div>
        </div>

        {/* Bottom disclaimer */}
        <p className="text-center text-[11px] text-zinc-600 mt-12 max-w-2xl mx-auto">
          Data compiled from public interviews, sports science publications, and verified match recordings.
          This is a fan tribute — not affiliated with Cristiano Ronaldo.
        </p>
      </div>
    </section>
  );
}
