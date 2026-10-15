"use client";

import React, { useRef, useState, useEffect } from "react";
import Image from "next/image";
import { Era } from "@/types/era";
import { motion } from "framer-motion";
import { Shield, Sparkles, Quote, Trophy } from "lucide-react";
import { useSiteData } from "@/lib/use-site-data";

interface EraPanelProps {
  era: Era;
  index: number;
  isActive: boolean;
  priorityImage?: boolean;
}

export const EraPanel: React.FC<EraPanelProps> = ({
  era,
  index,
  isActive,
  priorityImage = false,
}) => {
  const panelRef = useRef<HTMLDivElement>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const { eras } = useSiteData();
  const activeEra = eras.find((e: any) => e.id === era.id) || era;
  const objectPosition = (activeEra as any).objectPosition || "center 25%";

  const images: string[] =
    (activeEra as any).heroImages && (activeEra as any).heroImages.length > 0
      ? (activeEra as any).heroImages
      : (era.heroImages && era.heroImages.length > 0
          ? era.heroImages
          : [era.heroImage || "/images/hero/hero-fallback.jpg"]);

  useEffect(() => {
    if (images.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % images.length);
    }, 6000);

    return () => clearInterval(interval);
  }, [images.length]);

  return (
    <article
      ref={panelRef}
      className="relative w-screen h-screen flex-shrink-0 flex flex-col justify-between overflow-hidden select-none transition-colors duration-800"
      style={{
        width: "100vw",
        height: "100vh",
        backgroundColor: era.colors.bg || "#0D0B05",
        color: era.colors.text || "#FFFFFF",
      }}
      aria-label={`${era.club} Era (${era.period})`}
    >
      {/* 1. Cinematic 35mm Film Strip Top Border with Perforations */}
      <div className="absolute top-0 left-0 right-0 h-4 bg-black/90 z-20 flex items-center justify-between px-2 overflow-hidden pointer-events-none border-b border-white/10">
        {Array.from({ length: 48 }).map((_, i) => (
          <span
            key={i}
            className="w-2 h-2.5 rounded-[1px] bg-white/10 shrink-0 mx-1"
          />
        ))}
      </div>

      {/* 2. Main Content Split: Left (Narrative & Stats) & Right (Cinematic Visual) */}
      <div className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 py-6 sm:py-10 lg:py-14 flex flex-col md:flex-row items-center justify-between gap-6 lg:gap-8 z-10 my-auto">
        {/* Left Zone: Typography, Club Identity & 3 Key Stats */}
        <div className="w-full md:w-[45%] flex flex-col justify-center space-y-3 sm:space-y-5">
          {/* Era Order Badge & Years */}
          <div className="flex items-center space-x-4">
            <span
              className="px-3 py-1 rounded-full font-bebas text-xs sm:text-sm tracking-widest uppercase border"
              style={{
                borderColor: era.colors.borderColor,
                backgroundColor: era.colors.cardBg,
                color: era.colors.primary,
              }}
            >
              Era 0{index + 1} • {era.kitNumber}
            </span>

            <span className="font-bebas text-lg sm:text-2xl tracking-[0.2em] text-muted">
              {era.period}
            </span>
          </div>

          {/* Monumental Club Name */}
          <h2
            className="font-anton text-4xl sm:text-6xl lg:text-7xl uppercase tracking-tight leading-[0.9] text-white drop-shadow-xl"
            style={{
              textShadow: `0 0 35px ${era.colors.primary}40`,
            }}
          >
            {era.club}
          </h2>

          {/* Subtitle Tagline */}
          <p
            className="font-bebas text-lg sm:text-2xl tracking-widest uppercase transition-colors duration-500"
            style={{ color: era.colors.primary }}
          >
            {era.tagline}
          </p>

          {/* Narrative Summary (2 sentences) */}
          <p className="font-inter text-sm sm:text-base text-gray-300 font-light leading-relaxed max-w-lg">
            {era.narrative}
          </p>

          {/* 3 Core Stats Cards Grid */}
          <div className="grid grid-cols-3 gap-3 pt-2 max-w-lg">
            {era.keyStats.map((stat, i) => (
              <div
                key={i}
                className="p-3 sm:p-4 rounded-xl border backdrop-blur-md transition-all duration-300 hover:scale-105"
                style={{
                  backgroundColor: era.colors.cardBg,
                  borderColor: era.colors.borderColor,
                }}
              >
                <div className="flex items-baseline space-x-0.5">
                  <span
                    className="font-anton text-2xl sm:text-4xl text-white leading-none"
                    style={{ color: era.colors.primary }}
                  >
                    {stat.value}
                  </span>
                  {stat.suffix && (
                    <span className="font-anton text-sm sm:text-lg text-muted">
                      {stat.suffix}
                    </span>
                  )}
                </div>
                <span className="font-bebas text-[11px] tracking-wider text-muted uppercase mt-1 block">
                  {stat.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Right Zone: Full-Bleed 2.5D Layered Image with Rotating Watermark Emblem */}
        <div className="w-full md:w-[52%] relative flex items-center justify-center">
          {/* Subtle Rotating Watermark Emblem */}
          <motion.div
            className="absolute -top-10 -right-10 w-44 h-44 sm:w-60 sm:h-60 rounded-full border border-dashed opacity-20 pointer-events-none z-0"
            style={{ borderColor: era.colors.primary }}
            animate={{ rotate: 360 }}
            transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          >
            <div className="w-full h-full flex items-center justify-center">
              <Shield className="w-16 h-16 text-primary opacity-30" />
            </div>
          </motion.div>

          {/* Main Visual Image Card with Clip-Path Reveal */}
          <div
            className="relative w-full h-[60vh] md:h-[70vh] lg:h-[75vh] rounded-2xl sm:rounded-3xl overflow-hidden border shadow-2xl z-10 transition-all duration-700 group"
            style={{
              borderColor: era.colors.borderColor,
              boxShadow: `0 20px 50px ${era.colors.bg}80`,
            }}
          >
            {images.map((src, imgIdx) => (
              <Image
                key={src + imgIdx}
                src={src}
                alt={`${era.club} — Cristiano Ronaldo`}
                fill
                unoptimized
                priority={priorityImage && imgIdx === 0}
                sizes="(max-width: 1024px) 100vw, 55vw"
                className="absolute inset-0 object-cover filter brightness-90 contrast-105 transition-opacity ease-in-out"
                style={{
                  opacity: imgIdx === currentImageIndex ? 1 : 0,
                  transitionDuration: "1.2s",
                  objectPosition: typeof objectPosition === "number" ? `center ${objectPosition}%` : objectPosition,
                }}
              />
            ))}

            {/* Gradient Dark Vignette Over Image */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background: `linear-gradient(to top, ${era.colors.bg}E6 0%, transparent 60%)`,
              }}
            />

            {/* Top-Right Badge */}
            <div className="absolute top-4 right-4 z-10 px-3 py-1 rounded-full border border-white/20 bg-black/60 backdrop-blur-md flex items-center space-x-1.5 text-xs font-bebas tracking-widest uppercase text-white">
              <Trophy className="w-3.5 h-3.5" style={{ color: era.colors.primary }} />
              <span>{era.trophiesList[0]}</span>
            </div>

            {/* Bottom Signature Quote Overlay */}
            <div className="absolute bottom-4 left-4 right-4 sm:bottom-6 sm:left-6 sm:right-6 z-10 p-4 rounded-xl border border-white/10 bg-black/75 backdrop-blur-md">
              <div className="flex items-start space-x-2.5">
                <Quote
                  className="w-4 h-4 shrink-0 mt-0.5"
                  style={{ color: era.colors.primary }}
                />
                <div>
                  <p className="font-inter text-xs sm:text-sm text-gray-200 italic line-clamp-2">
                    &ldquo;{era.quote.text}&rdquo;
                  </p>
                  <span className="font-bebas text-[11px] tracking-wider text-muted uppercase mt-1 block">
                    — {era.quote.context}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Cinematic 35mm Film Strip Bottom Border with Perforations */}
      <div className="absolute bottom-0 left-0 right-0 h-4 bg-black/90 z-20 flex items-center justify-between px-2 overflow-hidden pointer-events-none border-t border-white/10">
        {Array.from({ length: 48 }).map((_, i) => (
          <span
            key={i}
            className="w-2 h-2.5 rounded-[1px] bg-white/10 shrink-0 mx-1"
          />
        ))}
      </div>
    </article>
  );
};
