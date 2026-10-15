"use client";

import React, { useRef } from "react";
import { useAudioPlayer } from "@/hooks/useAudioPlayer";
import { AudioWaveVisualizer } from "./AudioWaveVisualizer";
import { useCursor } from "@/components/cursor/CursorContext";
import { VolumeX, Volume2 } from "lucide-react";

export const SoundController: React.FC = () => {
  const { isMuted, isPlaying, toggleMute, playHover, playClick, analyserNode } =
    useAudioPlayer();
  const { setCursor, resetCursor, setMagneticTarget } = useCursor();
  const buttonRef = useRef<HTMLButtonElement>(null);

  const handleMouseEnter = () => {
    playHover();
    setCursor("hover", isMuted ? "AUDIO ON" : "MUTE");
    if (buttonRef.current) {
      setMagneticTarget(buttonRef.current);
    }
  };

  const handleMouseLeave = () => {
    resetCursor();
    setMagneticTarget(null);
  };

  const handleClick = () => {
    playClick();
    toggleMute();
    setCursor("hover", isMuted ? "MUTE" : "AUDIO ON");
  };

  return (
    <div className="fixed bottom-6 right-6 sm:bottom-8 sm:right-8 z-50 flex items-center gap-3">
      {/* Audio Status Pill Label on Desktop */}
      <span className="hidden md:inline-block font-bebas text-xs tracking-widest text-gray-400 uppercase bg-black/40 px-3 py-1 rounded-full border border-white/10 backdrop-blur-md">
        {isMuted ? "SOUND OFF" : "CINEMATIC AUDIO"}
      </span>

      {/* 48px / 40px Circular Toggle Button */}
      <button
        ref={buttonRef}
        onClick={handleClick}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        aria-label={isMuted ? "Play ambient cinematic audio" : "Mute audio"}
        className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center border backdrop-blur-md transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-gold ${
          isMuted
            ? "border-white/15 bg-black/50 text-gray-400 hover:border-gold/50 hover:text-white"
            : "border-gold bg-gold/15 text-gold shadow-[0_0_20px_rgba(254,190,16,0.35)] scale-105"
        }`}
      >
        {isMuted ? (
          <VolumeX className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
        ) : (
          <div className="flex items-center gap-1.5">
            <Volume2 className="w-3.5 h-3.5 text-gold" />
            <AudioWaveVisualizer
              isPlaying={isPlaying && !isMuted}
              analyserNode={analyserNode}
              barCount={4}
              className="h-3 flex items-center gap-[2px]"
            />
          </div>
        )}
      </button>
    </div>
  );
};
