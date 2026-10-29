"use client";

import { Trophy, Sparkles } from "lucide-react";

export function TrophyRoomLoading() {
  return (
    <div className="relative w-full h-[85vh] min-h-[600px] flex flex-col items-center justify-center bg-[#050505] text-white overflow-hidden select-none">
      {/* Background radial gold glow */}
      <div className="absolute w-96 h-96 bg-[#FEBE10]/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Golden Gyroscope Rings Spinner */}
      <div className="relative flex items-center justify-center w-32 h-32 mb-8">
        {/* Outer Ring */}
        <div className="absolute inset-0 rounded-full border-2 border-t-[#FEBE10] border-r-transparent border-b-[#FEBE10]/30 border-l-transparent animate-spin duration-1000" />
        
        {/* Middle Ring */}
        <div
          className="absolute inset-3 rounded-full border-2 border-r-[#FEBE10] border-t-transparent border-l-[#FEBE10]/40 border-b-transparent animate-spin duration-700"
          style={{ animationDirection: "reverse" }}
        />
        
        {/* Inner Ring */}
        <div className="absolute inset-6 rounded-full border-2 border-b-[#FEBE10] border-t-transparent border-r-transparent border-l-[#FEBE10]/20 animate-spin duration-500" />

        {/* Center Trophy Icon */}
        <div className="relative z-10 p-3 rounded-full bg-zinc-900 border border-[#FEBE10]/50 shadow-[0_0_20px_rgba(254,190,16,0.35)]">
          <Trophy className="w-6 h-6 text-[#FEBE10]" />
        </div>
      </div>

      {/* Typography */}
      <div className="text-center space-y-2 z-10 max-w-sm px-4">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-mono font-bold tracking-widest uppercase bg-[#FEBE10]/10 text-[#FEBE10] border border-[#FEBE10]/30">
          <Sparkles className="w-3 h-3" />
          WebGL 3D Engine
        </div>
        <h3 className="text-xl font-black tracking-tight text-white uppercase font-sans">
          Entering Royal Trophy Room
        </h3>
        <p className="text-xs text-zinc-400 font-mono">
          Calibrating PBR Gold Shaders & Pedestal Physics...
        </p>
      </div>

      {/* Bottom Quote */}
      <div className="absolute bottom-8 text-center text-[11px] font-mono text-zinc-600">
        &ldquo;Talent without working hard is nothing.&rdquo; — Cristiano Ronaldo
      </div>
    </div>
  );
}
