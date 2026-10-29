"use client";

import React from "react";
import Link from "next/link";
import {
  Trophy,
  Flame,
  ArrowUp,
  Instagram,
  Youtube,
  Twitter,
  Lock,
  ExternalLink,
  Sparkles,
  Heart,
} from "lucide-react";

export function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="relative bg-[#040404] text-white border-t border-zinc-900 pt-20 pb-12 overflow-hidden select-none">
      {/* Subtle top gold gradient ambient beam */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-[1px] bg-gradient-to-r from-transparent via-[#FEBE10]/60 to-transparent pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        {/* Top Section: Monogram & Career Summary Tribute */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 pb-16 border-b border-zinc-900/80">
          <div className="lg:col-span-5 space-y-4">
            <Link href="/" className="inline-block group">
              <span
                className="text-5xl sm:text-6xl font-black uppercase tracking-tighter text-yellow-500 group-hover:text-yellow-400 transition-colors"
                style={{ fontFamily: "Anton, sans-serif" }}
              >
                CR7
              </span>
              <span className="block text-[11px] font-mono tracking-widest text-zinc-400 uppercase mt-0.5">
                The Official Digital Monument
              </span>
            </Link>

            <p className="text-zinc-400 text-xs sm:text-sm leading-relaxed max-w-md font-sans">
              24+ seasons of unyielding excellence. 981 official goals. 34 major trophies. 5 Ballon d&apos;Or honors.
              From the humble streets of Funchal, Madeira to Lisbon, Manchester, Madrid, Turin, Riyadh, and the absolute peak of sporting immortality.
            </p>

            <div className="flex items-center gap-3 pt-2">
              <a
                href="https://instagram.com/cristiano"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 rounded-full bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-[#FEBE10] border border-zinc-800 transition-colors"
                aria-label="Cristiano on Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="https://youtube.com/@cristiano"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 rounded-full bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-red-500 border border-zinc-800 transition-colors"
                aria-label="Cristiano on YouTube"
              >
                <Youtube className="w-4 h-4" />
              </a>
              <a
                href="https://twitter.com/cristiano"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 rounded-full bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-sky-400 border border-zinc-800 transition-colors"
                aria-label="Cristiano on Twitter / X"
              >
                <Twitter className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Navigation Links Columns */}
          <div className="lg:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-8">
            {/* Column 1: Exhibitions */}
            <div className="space-y-3">
              <h4 className="text-xs font-mono font-bold tracking-widest text-[#FEBE10] uppercase">
                Exhibitions
              </h4>
              <ul className="space-y-2 text-xs font-mono text-zinc-400">
                <li>
                  <a href="#live-stats" className="hover:text-white transition-colors">
                    981 Goals Tally
                  </a>
                </li>
                <li>
                  <a href="#career-timeline" className="hover:text-white transition-colors">
                    Career Timeline
                  </a>
                </li>
                <li>
                  <a href="#iconic-moments" className="hover:text-white transition-colors">
                    Iconic Moments
                  </a>
                </li>
                <li>
                  <a href="#trophy-cabinet" className="hover:text-white transition-colors">
                    The Cabinet
                  </a>
                </li>
                <li>
                  <Link href="/trophy-room" className="text-[#FEBE10] font-bold hover:underline flex items-center gap-1">
                    <span>3D Trophy Room</span>
                    <Sparkles className="w-3 h-3 text-[#FEBE10]" />
                  </Link>
                </li>
              </ul>
            </div>

            {/* Column 2: Chronicles */}
            <div className="space-y-3">
              <h4 className="text-xs font-mono font-bold tracking-widest text-[#FEBE10] uppercase">
                Chronicles
              </h4>
              <ul className="space-y-2 text-xs font-mono text-zinc-400">
                <li>
                  <a href="#records-grid" className="hover:text-white transition-colors">
                    Record Vault
                  </a>
                </li>
                <li>
                  <a href="#time-machine" className="hover:text-white transition-colors">
                    Time Machine
                  </a>
                </li>
                <li>
                  <a href="#quotes-section" className="hover:text-white transition-colors">
                    King&apos;s Quotes
                  </a>
                </li>
                <li>
                  <a href="#goal-reel" className="hover:text-white transition-colors">
                    Goal Reel
                  </a>
                </li>
                <li>
                  <a href="#cyborg-lab" className="hover:text-white transition-colors">
                    The Cyborg Lab
                  </a>
                </li>
              </ul>
            </div>

            {/* Column 3: Platform */}
            <div className="space-y-3">
              <h4 className="text-xs font-mono font-bold tracking-widest text-[#FEBE10] uppercase">
                System
              </h4>
              <ul className="space-y-2 text-xs font-mono text-zinc-400">
                <li>
                  <Link href="/admin/login" className="hover:text-white transition-colors flex items-center gap-1.5">
                    <Lock className="w-3 h-3 text-[#FEBE10]" />
                    <span>Admin CMS</span>
                  </Link>
                </li>
                <li>
                  <Link href="/admin" className="hover:text-white transition-colors">
                    Command Deck
                  </Link>
                </li>
                <li>
                  <span className="text-zinc-500">Next.js 14 / Three.js</span>
                </li>
                <li>
                  <span className="text-zinc-500">Prisma / SQLite</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Bar: Copyright, Back to Top */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-zinc-500">
          <p>© 2026 CR7 Office. Dedicated to Cristiano Ronaldo. All rights reserved.</p>

          <button
            onClick={scrollToTop}
            className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-zinc-900/80 hover:bg-zinc-800 text-zinc-400 hover:text-white border border-zinc-800 transition-colors"
          >
            <span>Back to Summit</span>
            <ArrowUp className="w-3.5 h-3.5 text-[#FEBE10]" />
          </button>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
