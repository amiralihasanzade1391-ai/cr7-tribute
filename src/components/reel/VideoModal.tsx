"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { X, ExternalLink, Play } from "lucide-react";
import { Goal } from "@/data/goals";

interface VideoModalProps {
  goal: Goal | null;
  onClose: () => void;
}

export function VideoModal({ goal, onClose }: VideoModalProps) {
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    setIsPlaying(false);
  }, [goal?.id]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  return (
    <AnimatePresence>
      {goal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-2xl flex items-center justify-center p-0 sm:p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="w-full h-full sm:h-auto max-w-5xl rounded-none sm:rounded-2xl p-4 sm:p-6 overflow-y-auto bg-black sm:bg-zinc-950/90 border-0 sm:border sm:border-yellow-500/30"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-4">
              <div>
                <h3
                  className="text-2xl font-black text-white uppercase tracking-tight"
                  style={{ fontFamily: "Anton, sans-serif" }}
                >
                  {goal.title}
                </h3>
                <p className="text-sm text-zinc-400 mt-1">
                  {goal.opponent} • {goal.competition} • {goal.year} • {goal.minute}'
                </p>
              </div>
              <button
                onClick={onClose}
                className="w-10 h-10 min-w-[44px] min-h-[44px] rounded-full bg-zinc-900 border border-zinc-700 flex items-center justify-center hover:bg-zinc-800 transition"
                aria-label="Close video modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Click-to-load YouTube Player Container */}
            <div className="relative aspect-video rounded-xl overflow-hidden border border-yellow-500/30 bg-black">
              {isPlaying ? (
                <iframe
                  src={`https://www.youtube.com/embed/${goal.videoId}?autoplay=1&mute=0&rel=0&modestbranding=1`}
                  title={goal.title}
                  loading="lazy"
                  allow="autoplay; encrypted-media; picture-in-picture"
                  allowFullScreen
                  className="w-full h-full"
                />
              ) : (
                <div
                  onClick={() => setIsPlaying(true)}
                  className="relative w-full h-full cursor-pointer group flex items-center justify-center bg-zinc-950"
                >
                  <Image
                    src={goal.thumbnail}
                    alt={goal.title}
                    fill
                    sizes="(max-width: 1024px) 100vw, 960px"
                    className="object-cover group-hover:scale-105 transition-transform duration-500 filter brightness-90"
                  />
                  <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors" />
                  <div className="relative z-10 flex flex-col items-center gap-3">
                    <div className="w-16 h-16 rounded-full bg-yellow-500 text-black flex items-center justify-center shadow-[0_0_40px_rgba(254,190,16,0.6)] group-hover:scale-110 transition-transform">
                      <Play className="w-7 h-7 fill-black ml-1" />
                    </div>
                    <span className="font-bebas text-sm tracking-widest uppercase text-white/90 px-3 py-1 rounded-full bg-black/60 border border-white/20">
                      Click to Play Video
                    </span>
                  </div>
                </div>
              )}
            </div>

            <p className="text-sm text-zinc-300 mt-4 leading-relaxed">{goal.description}</p>

            <a
              href={`https://www.youtube.com/watch?v=${goal.videoId}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 mt-4 px-5 py-2.5 rounded-full bg-yellow-500 text-black font-bold text-sm hover:bg-yellow-400 transition"
            >
              <ExternalLink size={16} />
              View on YouTube
            </a>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
