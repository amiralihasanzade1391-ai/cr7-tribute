"use client";

import { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Trophy } from "@/types/trophy";

interface TrophyItemProps {
  trophy: Trophy;
}

export function TrophyItem({ trophy }: TrophyItemProps) {
  const [flipped, setFlipped] = useState(false);

  return (
    <div
      className="relative cursor-pointer"
      style={{ perspective: "1200px" }}
      onMouseEnter={() => setFlipped(true)}
      onMouseLeave={() => setFlipped(false)}
      onClick={() => setFlipped((f) => !f)}
    >
      <motion.div
        className="relative w-full h-[280px]"
        animate={{ rotateY: flipped ? 180 : 0 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        style={{ transformStyle: "preserve-3d" }}
      >
        {/* FRONT */}
        <div
          className="absolute inset-0 rounded-2xl border-2 p-6 flex flex-col items-center justify-center bg-zinc-900"
          style={{
            borderColor: trophy.tier === "gold" ? "#FEBE10" : trophy.tier === "silver" ? "#A0A0A0" : "#CD7F32",
            backfaceVisibility: "hidden",
          }}
        >
          <motion.div
            className="h-20 mb-3 flex items-center justify-center"
            animate={{ y: [0, -6, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          >
            {trophy.image || (trophy.icon && (trophy.icon.startsWith("http") || trophy.icon.startsWith("/"))) ? (
              <Image
                src={trophy.image || trophy.icon}
                alt={trophy.name}
                width={76}
                height={64}
                loading="lazy"
                className="h-16 w-auto max-w-[76px] object-contain drop-shadow-[0_8px_16px_rgba(254,190,16,0.35)] rounded-md"
              />
            ) : (
              <span className="text-5xl">{trophy.icon}</span>
            )}
          </motion.div>
          <h3 className="text-center text-sm font-bold text-white uppercase tracking-wider mb-3 font-bebas">
            {trophy.name}
          </h3>
          <div
            className="text-5xl font-black"
            style={{
              color: trophy.tier === "gold" ? "#FEBE10" : trophy.tier === "silver" ? "#E5E5E5" : "#CD7F32",
              textShadow: `0 0 30px ${trophy.tier === "gold" ? "#FEBE10" : "#A0A0A0"}60`,
            }}
          >
            {trophy.count > 0 ? `${trophy.count}x` : "—"}
          </div>
          {trophy.years.length > 0 && (
            <p className="text-[10px] text-zinc-500 mt-3 tracking-widest">
              {trophy.years[trophy.years.length - 1]} — {trophy.years[0]}
            </p>
          )}
        </div>

        {/* BACK */}
        <div
          className="absolute inset-0 rounded-2xl border-2 p-5 flex flex-col justify-between bg-gradient-to-br from-zinc-900 to-black"
          style={{
            borderColor: trophy.tier === "gold" ? "#FEBE10" : "#A0A0A0",
            backfaceVisibility: "hidden",
            transform: "rotateY(180deg)",
          }}
        >
          <p className="text-xs text-zinc-300 leading-relaxed">{trophy.description}</p>
          <div>
            {trophy.years.length > 0 && (
              <div className="flex flex-wrap gap-1 mb-3">
                {trophy.years.map((y) => (
                  <span key={y} className="text-[10px] px-2 py-0.5 rounded-full bg-yellow-500/20 text-yellow-300 border border-yellow-500/40">
                    {y}
                  </span>
                ))}
              </div>
            )}
            <div className="flex justify-between text-[10px] text-zinc-500">
              {trophy.firstWon > 0 && <span>FIRST: {trophy.firstWon}</span>}
              {trophy.mostRecent > 0 && <span>LATEST: {trophy.mostRecent}</span>}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
