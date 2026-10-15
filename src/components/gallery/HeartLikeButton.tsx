"use client";

import React, { useState } from "react";
import { Heart } from "lucide-react";
import { useLocalStorageLikes } from "@/hooks/useLocalStorageLikes";
import { soundFx } from "@/lib/utils";
import confetti from "canvas-confetti";
import { motion } from "framer-motion";

interface HeartLikeButtonProps {
  momentId: string;
  initialLikes?: number;
  showCount?: boolean;
  className?: string;
  size?: "sm" | "md" | "lg";
}

export const HeartLikeButton: React.FC<HeartLikeButtonProps> = ({
  momentId,
  initialLikes = 0,
  showCount = true,
  className = "",
  size = "md",
}) => {
  const { isLiked, toggleLike } = useLocalStorageLikes();
  const liked = isLiked(momentId);
  const [isAnimating, setIsAnimating] = useState(false);

  // Icon sizing
  const iconSize = size === "sm" ? 14 : size === "lg" ? 20 : 16;
  const paddingClass = size === "sm" ? "p-1.5" : size === "lg" ? "p-2.5" : "p-2";

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent opening modal when clicking heart

    setIsAnimating(true);
    const nowLiked = toggleLike(momentId);

    if (nowLiked) {
      soundFx.playHover(); // Synthesized chime

      // Emit localized micro golden particle hearts
      if (typeof window !== "undefined") {
        const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
        const x = (rect.left + rect.width / 2) / window.innerWidth;
        const y = (rect.top + rect.height / 2) / window.innerHeight;

        confetti({
          particleCount: 12,
          spread: 60,
          origin: { x, y },
          colors: ["#FEBE10", "#FF4D4D", "#FFFFFF"],
          ticks: 45,
          gravity: 1.2,
          scalar: 0.6,
          shapes: ["circle"],
          disableForReducedMotion: true,
        });
      }
    } else {
      soundFx.playClick();
    }

    setTimeout(() => setIsAnimating(false), 400);
  };

  const currentCount = initialLikes + (liked ? 1 : 0);

  return (
    <motion.button
      onClick={handleClick}
      animate={isAnimating ? { scale: [1, 1.4, 0.9, 1] } : {}}
      transition={{ duration: 0.35, ease: "easeInOut" }}
      className={`rounded-full border backdrop-blur-md flex items-center gap-1.5 transition-all duration-300 focus:outline-none focus:ring-1 focus:ring-gold ${paddingClass} ${
        liked
          ? "border-gold/60 bg-gold/20 text-gold shadow-[0_0_12px_rgba(254,190,16,0.4)]"
          : "border-white/15 bg-black/40 text-gray-300 hover:border-white/40 hover:text-white"
      } ${className}`}
      aria-pressed={liked}
      aria-label={liked ? "Unlike this moment" : "Like this moment"}
    >
      <Heart
        size={iconSize}
        className={`transition-colors duration-300 ${
          liked ? "fill-gold text-gold" : "fill-transparent text-current"
        }`}
      />

      {showCount && (
        <span className="font-bebas text-xs tracking-wider select-none leading-none pt-0.5">
          {currentCount.toLocaleString()}
        </span>
      )}
    </motion.button>
  );
};
