"use client";

import React, { useState } from "react";
import dynamic from "next/dynamic";
import { Navbar } from "@/components/layout/navbar";
import { CinematicPreloader } from "@/components/preloader/CinematicPreloader";
import { SoundController } from "@/components/audio/SoundController";
import { HeroSection } from "@/components/hero";
import { LiveStatsCounter } from "@/components/stats";
import { TrophyCabinet } from "@/components/trophies";
import { GoalReel } from "@/components/reel";

const CyborgLab = dynamic(
  () => import("@/components/cyborg/CyborgLab").then((m) => m.CyborgLab),
  {
    ssr: false,
    loading: () => <div className="h-96 animate-pulse bg-zinc-900 rounded-lg" />,
  }
);

const CustomCursor = dynamic(
  () => import("@/components/cursor/CustomCursor").then((m) => m.CustomCursor),
  { ssr: false }
);

const IconicMomentsGallery = dynamic(
  () =>
    import("@/components/gallery/IconicMomentsGallery").then(
      (m) => m.IconicMomentsGallery
    ),
  { ssr: false }
);

const CareerTimeline = dynamic(
  () =>
    import("@/components/timeline/CareerTimeline").then(
      (m) => m.CareerTimeline
    ),
  { ssr: false }
);

export default function Home() {
  const [isPreloaderFinished, setIsPreloaderFinished] = useState(false);

  return (
    <>
      {/* Dynamic Cursor with Canvas & Spring Physics */}
      <CustomCursor />

      {/* 0. Responsive Navbar with Mobile Hamburger */}
      <Navbar />

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
