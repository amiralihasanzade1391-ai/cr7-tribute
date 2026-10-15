"use client";

import React, { useRef, useState } from "react";
import Image from "next/image";
import { IconicMoment } from "@/types/moment";
import { HeartLikeButton } from "./HeartLikeButton";
import { useCursor } from "@/components/cursor/CursorContext";
import { useSiteData } from "@/lib/use-site-data";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { Play, Sparkles } from "lucide-react";

interface MomentCardProps {
  moment: IconicMoment;
  onSelect: (moment: IconicMoment) => void;
  priority?: boolean;
}

export const MomentCard: React.FC<MomentCardProps> = ({
  moment,
  onSelect,
  priority = false,
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const { setCursor, resetCursor } = useCursor();

  const { moments } = useSiteData();
  const activeMoment = moments.find((m: any) => m.id === moment.id) || moment;
  const objectPosition = (activeMoment as any).objectPosition || "center 50%";

  // Framer Motion 3D Tilt Spring Physics (Zero React state re-renders)
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const springConfig = { damping: 20, stiffness: 180, mass: 0.6 };
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [8, -8]), springConfig);
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-8, 8]), springConfig);

  // Dynamic Golden Cursor Shine coordinates
  const shineX = useTransform(x, [-0.5, 0.5], [0, 100]);
  const shineY = useTransform(y, [-0.5, 0.5], [0, 100]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const mouseX = (e.clientX - rect.left) / rect.width - 0.5;
    const mouseY = (e.clientY - rect.top) / rect.height - 0.5;
    x.set(mouseX);
    y.set(mouseY);
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
    setCursor("view", "INSPECT");
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    x.set(0);
    y.set(0);
    resetCursor();
  };

  // Variable aspect ratios for true organic masonry layout
  const aspectClass =
    moment.aspectRatio === "tall"
      ? "aspect-[3/4]"
      : moment.aspectRatio === "wide"
      ? "aspect-[16/10]"
      : "aspect-[4/4]";

  return (
    <motion.div
      layout
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={() => onSelect(moment)}
      style={{
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
      }}
      initial={{ opacity: 0, y: 25 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      className={`relative w-full mb-6 break-inside-avoid rounded-2xl sm:rounded-3xl overflow-hidden border border-white/10 bg-[#0c0c10] cursor-pointer group shadow-xl transition-colors duration-500 hover:border-gold/50 ${aspectClass}`}
    >
      {/* 1. Underlying Image with Smooth Zoom */}
      <Image
        src={activeMoment.image || moment.image}
        alt={activeMoment.title || moment.title}
        fill
        priority={priority}
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        className="object-cover filter brightness-[0.82] contrast-105 group-hover:scale-105 group-hover:brightness-95 transition-all duration-700 ease-out"
        style={{
          objectPosition: typeof objectPosition === "number" ? `center ${objectPosition}%` : objectPosition,
        }}
      />

      {/* 2. Interactive Golden Spotlight Shine Overlay */}
      <motion.div
        className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10"
        style={{
          background: `radial-gradient(circle at ${shineX}% ${shineY}%, rgba(254, 190, 16, 0.22) 0%, transparent 60%)`,
        }}
        aria-hidden="true"
      />

      {/* 3. Dark Film Gradient Vignette */}
      <div
        className="absolute inset-0 pointer-events-none z-10 transition-opacity duration-300"
        style={{
          background:
            "linear-gradient(to top, rgba(5,5,7,0.92) 0%, rgba(5,5,7,0.4) 45%, transparent 75%)",
        }}
      />

      {/* 4. Ambient Floating Golden Dust Particles on Hover (3 micro embers) */}
      {isHovered && (
        <div className="absolute inset-0 pointer-events-none z-15 overflow-hidden">
          {[1, 2, 3].map((i) => (
            <motion.span
              key={i}
              initial={{ opacity: 0, y: 30, x: i * 35 }}
              animate={{
                opacity: [0, 0.8, 0],
                y: -60,
                x: i * 35 + (i % 2 === 0 ? 15 : -15),
              }}
              transition={{
                duration: 1.6 + i * 0.3,
                repeat: Infinity,
                delay: i * 0.2,
                ease: "easeOut",
              }}
              className="absolute bottom-12 left-8 w-1.5 h-1.5 rounded-full bg-gold shadow-[0_0_8px_#FEBE10]"
            />
          ))}
        </div>
      )}

      {/* 5. Top Bar: Category Pill & Heart Button */}
      <div className="absolute top-4 left-4 right-4 z-20 flex justify-between items-center">
        <span className="font-bebas text-[11px] tracking-widest text-gold uppercase px-3 py-1 rounded-full border border-gold/30 bg-black/60 backdrop-blur-md shadow-lg">
          {moment.category}
        </span>

        <HeartLikeButton
          momentId={moment.id}
          initialLikes={moment.likesCount}
          size="sm"
        />
      </div>

      {/* 6. Video Indicator Pill if YouTube ID exists */}
      {moment.videoId && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full border border-white/20 bg-black/60 backdrop-blur-md flex items-center justify-center text-white opacity-0 group-hover:opacity-100 scale-90 group-hover:scale-100 transition-all duration-300 shadow-2xl">
          <Play size={18} className="fill-gold text-gold ml-0.5" />
        </div>
      )}

      {/* 7. Bottom Narrative Card with Slight 2.5D Parallax Lift */}
      <div
        className="absolute bottom-0 left-0 right-0 p-5 sm:p-6 z-20 flex flex-col justify-end"
        style={{ transform: "translateZ(25px)" }}
      >
        <div className="flex items-center space-x-2 text-xs font-inter text-gray-400 mb-1">
          <span className="text-gold font-bebas text-sm tracking-wider">
            {moment.year}
          </span>
          <span>•</span>
          <span className="truncate">{moment.competition}</span>
        </div>

        <h3 className="font-anton text-xl sm:text-2xl uppercase tracking-wide text-white group-hover:text-gold transition-colors duration-300 line-clamp-2">
          {moment.title}
        </h3>

        <p className="font-inter text-xs text-gray-300 line-clamp-2 mt-1.5 font-light leading-relaxed opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          {moment.description}
        </p>
      </div>
    </motion.div>
  );
};
