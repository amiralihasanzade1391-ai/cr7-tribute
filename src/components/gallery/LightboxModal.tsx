"use client";

import React, { useEffect, useState, useCallback } from "react";
import Image from "next/image";
import dynamic from "next/dynamic";
import { IconicMoment } from "@/types/moment";
import { HeartLikeButton } from "./HeartLikeButton";
import { soundFx } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  ChevronLeft,
  ChevronRight,
  Share2,
  Check,
  Volume2,
  VolumeX,
  Trophy,
  Calendar,
  Shield,
} from "lucide-react";

const ReactPlayer = dynamic(() => import("react-player/lazy"), { ssr: false });

interface LightboxModalProps {
  moment: IconicMoment | null;
  allMoments: IconicMoment[];
  onClose: () => void;
  onNavigate: (moment: IconicMoment) => void;
}

export const LightboxModal: React.FC<LightboxModalProps> = ({
  moment,
  allMoments,
  onClose,
  onNavigate,
}) => {
  const [isVideoMuted, setIsVideoMuted] = useState(true);
  const [isCopied, setIsCopied] = useState(false);

  // Current index in list
  const currentIndex = moment
    ? allMoments.findIndex((m) => m.id === moment.id)
    : -1;

  const handleNext = useCallback(() => {
    if (currentIndex < allMoments.length - 1) {
      soundFx.playClick();
      onNavigate(allMoments[currentIndex + 1]);
    }
  }, [currentIndex, allMoments, onNavigate]);

  const handlePrev = useCallback(() => {
    if (currentIndex > 0) {
      soundFx.playClick();
      onNavigate(allMoments[currentIndex - 1]);
    }
  }, [currentIndex, allMoments, onNavigate]);

  // Keyboard navigation listener (ESC, ArrowLeft, ArrowRight)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!moment) return;
      if (e.key === "Escape") {
        onClose();
      } else if (e.key === "ArrowRight") {
        handleNext();
      } else if (e.key === "ArrowLeft") {
        handlePrev();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [moment, onClose, handleNext, handlePrev]);

  // Copy shareable link
  const handleCopy = () => {
    soundFx.playClick();
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    }
  };

  if (!moment) return null;

  return (
    <AnimatePresence>
      <div
        className="fixed inset-0 z-[9999] flex items-center justify-center p-0 md:p-6 lg:p-10 bg-black/90 backdrop-blur-2xl"
        onClick={onClose}
        role="dialog"
        aria-modal="true"
        aria-label={moment.title}
      >
        {/* Navigation Arrow: Previous */}
        {currentIndex > 0 && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              handlePrev();
            }}
            className="hidden lg:flex absolute left-6 top-1/2 -translate-y-1/2 z-30 w-12 h-12 rounded-full border border-white/10 bg-black/60 backdrop-blur-md items-center justify-center text-white hover:border-gold hover:text-gold transition-all duration-300"
            aria-label="Previous iconic moment (Left Arrow)"
          >
            <ChevronLeft size={24} />
          </button>
        )}

        {/* Navigation Arrow: Next */}
        {currentIndex < allMoments.length - 1 && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleNext();
            }}
            className="hidden lg:flex absolute right-6 top-1/2 -translate-y-1/2 z-30 w-12 h-12 rounded-full border border-white/10 bg-black/60 backdrop-blur-md items-center justify-center text-white hover:border-gold hover:text-gold transition-all duration-300"
            aria-label="Next iconic moment (Right Arrow)"
          >
            <ChevronRight size={24} />
          </button>
        )}

        {/* Main Modal Card */}
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          onClick={(e) => e.stopPropagation()}
          className="relative w-full h-full md:h-auto md:max-w-6xl md:max-h-[92vh] overflow-y-auto lg:overflow-hidden rounded-none md:rounded-3xl border-0 md:border md:border-gold/30 bg-[#09090D] shadow-2xl flex flex-col lg:flex-row text-white"
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-40 min-w-[44px] min-h-[44px] p-2.5 rounded-full border border-white/20 bg-black/80 backdrop-blur-md text-gray-200 hover:text-white hover:border-gold transition-all duration-300 flex items-center justify-center"
            aria-label="Close lightbox modal (Escape)"
          >
            <X size={20} />
          </button>

          {/* Left Visual Stage (60%): Image or YouTube Video */}
          <div className="w-full lg:w-[62%] relative bg-black flex items-center justify-center min-h-[300px] sm:min-h-[420px] lg:min-h-[580px] overflow-hidden">
            {moment.videoId ? (
              <div className="relative w-full h-full aspect-video flex items-center justify-center bg-black">
                <ReactPlayer
                  url={`https://www.youtube-nocookie.com/watch?v=${moment.videoId}`}
                  playing={true}
                  muted={isVideoMuted}
                  controls={true}
                  loop={true}
                  width="100%"
                  height="100%"
                  className="absolute inset-0"
                />

                {/* Video Mute Toggle Pill */}
                <button
                  onClick={() => setIsVideoMuted(!isVideoMuted)}
                  className="absolute bottom-4 left-4 z-20 px-3 py-1.5 rounded-full border border-white/20 bg-black/70 backdrop-blur-md flex items-center gap-2 text-xs font-bebas tracking-widest uppercase text-white hover:border-gold transition-colors"
                >
                  {isVideoMuted ? (
                    <>
                      <VolumeX size={14} className="text-muted" />
                      <span>Unmute</span>
                    </>
                  ) : (
                    <>
                      <Volume2 size={14} className="text-gold" />
                      <span>Sound On</span>
                    </>
                  )}
                </button>
              </div>
            ) : (
              <div className="relative w-full h-full min-h-[380px] sm:min-h-[480px]">
                <Image
                  src={moment.image}
                  alt={moment.title}
                  fill
                  loading="lazy"
                  sizes="(max-width: 1024px) 100vw, 62vw"
                  className="object-cover object-center filter brightness-95"
                />
              </div>
            )}
          </div>

          {/* Right Narrative Stage (38%) */}
          <div className="w-full lg:w-[38%] p-6 sm:p-8 md:p-10 flex flex-col justify-between overflow-y-auto max-h-[50vh] lg:max-h-none border-t lg:border-t-0 lg:border-l border-white/10">
            <div>
              {/* Top Meta Badges */}
              <div className="flex items-center justify-between gap-2 mb-3">
                <span className="font-bebas text-xs tracking-widest text-gold uppercase px-3 py-1 rounded-full border border-gold/30 bg-gold/10">
                  {moment.category}
                </span>

                <div className="flex items-center space-x-2 text-xs text-muted font-inter">
                  <span className="flex items-center gap-1">
                    <Calendar size={13} className="text-gold" />
                    {moment.year}
                  </span>
                </div>
              </div>

              {/* Title */}
              <h3 className="font-anton text-2xl sm:text-4xl uppercase tracking-wide leading-tight text-white mb-2">
                {moment.title}
              </h3>

              {/* Sub-meta details */}
              <div className="flex flex-wrap items-center gap-2 text-xs text-gray-400 font-inter mb-5">
                <span className="flex items-center gap-1">
                  <Trophy size={13} className="text-gold" />
                  {moment.competition}
                </span>
                {moment.opponent && (
                  <>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Shield size={13} className="text-muted" />
                      vs {moment.opponent}
                    </span>
                  </>
                )}
              </div>

              {/* Description Narrative */}
              <p className="font-inter text-sm text-gray-300 font-light leading-relaxed mb-6">
                {moment.description}
              </p>

              {/* Tags Pills */}
              <div className="flex flex-wrap gap-1.5 mb-6">
                {moment.tags.map((tag) => (
                  <span
                    key={tag}
                    className="font-inter text-[11px] px-2.5 py-1 rounded-lg border border-white/10 bg-white/5 text-gray-300"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Bottom Actions: Like Button & Share Button */}
            <div className="pt-6 border-t border-white/10 flex items-center justify-between gap-4">
              <HeartLikeButton
                momentId={moment.id}
                initialLikes={moment.likesCount}
                size="md"
              />

              <button
                onClick={handleCopy}
                className="px-4 py-2 rounded-full border border-white/15 bg-white/5 text-xs font-bebas tracking-wider uppercase flex items-center gap-2 hover:border-gold hover:text-gold transition-all"
              >
                {isCopied ? (
                  <>
                    <Check size={14} className="text-green-400" />
                    <span className="text-green-400">Link Copied!</span>
                  </>
                ) : (
                  <>
                    <Share2 size={14} />
                    <span>Share Moment</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
