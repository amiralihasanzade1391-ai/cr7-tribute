"use client";

import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ExternalLink } from "lucide-react";
import { Goal } from "@/data/goals";

interface VideoModalProps {
  goal: Goal | null;
  onClose: () => void;
}

export function VideoModal({ goal, onClose }: VideoModalProps) {
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
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-2xl flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="w-full max-w-5xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-4">
              <div>
                <h3 className="text-2xl font-black text-white uppercase tracking-tight" style={{ fontFamily: "Anton, sans-serif" }}>
                  {goal.title}
                </h3>
                <p className="text-sm text-zinc-400 mt-1">
                  {goal.opponent} • {goal.competition} • {goal.year} • {goal.minute}'
                </p>
              </div>
              <button
                onClick={onClose}
                className="w-10 h-10 rounded-full bg-zinc-900 border border-zinc-700 flex items-center justify-center hover:bg-zinc-800 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="relative aspect-video rounded-xl overflow-hidden border border-yellow-500/30 bg-black">
              <iframe
                src={`https://www.youtube.com/embed/${goal.videoId}?autoplay=1&mute=0&rel=0&modestbranding=1`}
                title={goal.title}
                allow="autoplay; encrypted-media; picture-in-picture"
                allowFullScreen
                className="w-full h-full"
              />
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
