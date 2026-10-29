"use client";

import React, { useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { Flame, Lock } from "lucide-react";
import { Navbar } from "@/components/layout/navbar";
import { CinematicPreloader } from "@/components/preloader/CinematicPreloader";
import { SoundController } from "@/components/audio/SoundController";
import { HeroSection } from "@/components/hero";
import { LiveStatsCounter } from "@/components/stats";
import { TrophyCabinet } from "@/components/trophies";
import { GoalReel } from "@/components/reel";
import { RecordsGrid } from "@/components/records/RecordsGrid";
import { TimeMachine } from "@/components/timemachine/TimeMachine";
import { QuotesSection } from "@/components/quotes/QuotesSection";
import { Footer } from "@/components/layout/Footer";
import { CR7ChatWidget } from "@/components/chat/CR7ChatWidget";
import { useSiteSettings } from "@/hooks/useSiteSettings";

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
  const {
    settings,
    isMaintenance,
    isSectionVisible,
    soundEnabled,
    cursorEnabled,
  } = useSiteSettings();

  // If Emergency Maintenance Mode is activated in Admin Panel
  if (isMaintenance) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-6 text-center select-none">
        <div className="relative mb-6">
          <div className="absolute -inset-4 bg-[#FEBE10]/20 rounded-full blur-2xl pointer-events-none" />
          <div className="relative p-5 rounded-2xl bg-zinc-900/90 border border-[#FEBE10]/40 text-[#FEBE10] shadow-[0_0_30px_rgba(254,190,16,0.3)]">
            <Flame className="w-12 h-12 fill-[#FEBE10]" />
          </div>
        </div>

        <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white mb-3">
          THE KING WILL RETURN
        </h1>
        <p className="text-zinc-400 max-w-lg text-sm sm:text-base leading-relaxed mb-6 font-mono">
          The CR7 digital monument is currently receiving a live telemetry sync. All career records, 981 goals, and trophies are temporarily undergoing calibration.
        </p>

        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-zinc-900 border border-zinc-800 text-xs font-mono text-zinc-400 mb-8">
          <span className="w-2 h-2 rounded-full bg-[#FEBE10] animate-ping" />
          <span>Status: Scheduled Maintenance in Progress</span>
        </div>

        <Link
          href="/admin/login"
          className="flex items-center gap-2 text-xs font-mono text-zinc-500 hover:text-[#FEBE10] transition-colors"
        >
          <Lock className="w-3.5 h-3.5" />
          <span>Staff & Administrator Access</span>
        </Link>
      </div>
    );
  }

  return (
    <>
      {/* Dynamic Cursor with Canvas & Spring Physics */}
      {cursorEnabled && <CustomCursor />}

      {/* Global Announcement Banner from CMS */}
      {settings.announcement_banner && (
        <div className="relative z-50 bg-gradient-to-r from-amber-600 via-[#FEBE10] to-amber-500 text-black text-[11px] font-mono font-bold py-1.5 px-4 text-center tracking-wider uppercase shadow-md flex items-center justify-center gap-2">
          <Flame className="w-3.5 h-3.5 fill-black shrink-0" />
          <span>{settings.announcement_banner}</span>
        </div>
      )}

      {/* 0. Responsive Navbar with Mobile Hamburger */}
      <Navbar />

      {/* 1. Cinematic Preloader: 0-100 rolling odometer & self-drawing monogram */}
      <CinematicPreloader
        minDurationMs={3200}
        onComplete={() => setIsPreloaderFinished(true)}
      />

      {/* 2. Persistent Sound Controller HUD */}
      {soundEnabled && <SoundController />}

      {/* 3. Main Cinematic Narrative Stream */}
      <main className="relative w-full min-h-screen bg-bg transition-colors duration-800">
        {/* Hero Section: 100vh Kinetic Reveal */}
        {isSectionVisible("hero") && (
          <HeroSection isPreloaderFinished={isPreloaderFinished} />
        )}

        {/* Live Stats Counter & Road to 1,000 Goals */}
        {isSectionVisible("stats") && <LiveStatsCounter />}

        {/* Career Timeline: GSAP ScrollTrigger Horizontal Pinning */}
        {isSectionVisible("timeline") && <CareerTimeline />}

        {/* Iconic Moments Gallery: 3D Tilt Masonry & Lightbox */}
        {isSectionVisible("moments") && <IconicMomentsGallery />}

        {/* The Cabinet: Trophies & Records */}
        {isSectionVisible("trophies") && <TrophyCabinet />}

        {/* Goal Reel: Legendary Strikes */}
        {isSectionVisible("reel") && <GoalReel />}

        {/* The Records Vault: Glassmorphic Cards with Animated Counters */}
        {isSectionVisible("records") && <RecordsGrid />}

        {/* The Time Machine: 2002-2026 Year-by-Year Horizontal Slider */}
        {isSectionVisible("timemachine") && <TimeMachine />}

        {/* Quotes Section: Iconic Mentality & Large Typography */}
        {isSectionVisible("quotes") && <QuotesSection />}

        {/* The Cyborg Lab: Superhuman Biometrics */}
        {isSectionVisible("cyborg") && <CyborgLab />}

        {/* Cinematic Footer */}
        <Footer />
      </main>

      {/* Floating GOAT AI Chatbot Widget (Phase 11) */}
      <CR7ChatWidget />
    </>
  );
}
