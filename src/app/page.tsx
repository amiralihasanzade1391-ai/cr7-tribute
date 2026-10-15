"use client";

import React, { useState } from "react";
import { CinematicPreloader } from "@/components/preloader/CinematicPreloader";
import { SoundController } from "@/components/audio/SoundController";
import { HeroSection } from "@/components/hero";
import { LiveStatsCounter } from "@/components/stats";
import { CareerTimeline } from "@/components/timeline";
import { IconicMomentsGallery } from "@/components/gallery";
import { TrophyCabinet } from "@/components/trophies";
import { GoalReel } from "@/components/reel";
import { CyborgLab } from "@/components/cyborg";

export default function Home() {
  const [isPreloaderFinished, setIsPreloaderFinished] = useState(false);

  return (
    <>
      {/* 1. Cinematic Preloader: 0-100 rolling odometer & self-drawing monogram */}
      <CinematicPreloader
        minDurationMs={3200}
        onComplete={() => setIsPreloaderFinished(true)}
      />

      {/* 2. Persistent Sound Controller HUD */}
      <SoundController />

      {/* 3. Main Cinematic Narrative Stream */}
      <main className="relative w-full min-h-screen bg-bg transition-colors duration-800">
        {/* Hero Section: 100vh Kinetic Reveal */}
        <HeroSection isPreloaderFinished={isPreloaderFinished} />

        {/* Live Stats Counter & Road to 1,000 Goals */}
        <LiveStatsCounter />

        {/* Career Timeline: GSAP ScrollTrigger Horizontal Pinning */}
        <CareerTimeline />

        {/* Iconic Moments Gallery: 3D Tilt Masonry & Lightbox */}
        <IconicMomentsGallery />

        {/* The Cabinet: Trophies & Records */}
        <TrophyCabinet />

        {/* Goal Reel: Legendary Strikes */}
        <GoalReel />

        {/* The Cyborg Lab: Superhuman Biometrics */}
        <CyborgLab />
      </main>
    </>
  );
}
