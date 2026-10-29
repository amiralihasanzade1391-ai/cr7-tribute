"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { label: "Home", href: "/" },
    { label: "Stats", href: "#live-stats" },
    { label: "Timeline", href: "#career-timeline" },
    { label: "Trophies", href: "#trophy-cabinet" },
    { label: "3D Room", href: "/trophy-room", isHighlight: true },
    { label: "Records", href: "#records-grid" },
    { label: "Time Machine", href: "#time-machine" },
    { label: "Quotes", href: "#quotes-section" },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled || isMobileMenuOpen
          ? "bg-black/95 backdrop-blur-md border-b border-zinc-800/80 py-2 sm:py-3"
          : "bg-transparent py-4 sm:py-5"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-8 flex items-center justify-between">
        <Link
          href="/"
          className="font-anton text-2xl uppercase tracking-wider text-yellow-500 hover:text-yellow-400 transition-colors flex items-center min-h-[44px]"
        >
          CR7
        </Link>

        {/* Desktop Navigation (Full Nav) */}
        <nav className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className={`text-xs uppercase tracking-widest font-bold transition-all min-h-[44px] flex items-center px-2 ${
                link.isHighlight
                  ? "text-[#FEBE10] bg-[#FEBE10]/15 hover:bg-[#FEBE10]/25 border border-[#FEBE10]/40 rounded-full px-3.5 py-1 shadow-[0_0_15px_rgba(254,190,16,0.25)]"
                  : "text-zinc-300 hover:text-yellow-400"
              }`}
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Mobile Hamburger Toggle Button */}
        <button
          onClick={() => setIsMobileMenuOpen((prev) => !prev)}
          className="md:hidden flex items-center justify-center min-w-[44px] min-h-[44px] p-2 rounded-lg text-zinc-300 hover:text-white hover:bg-zinc-800/60 focus:outline-none transition"
          aria-label={isMobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
          aria-expanded={isMobileMenuOpen}
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Dropdown Drawer Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-black/95 backdrop-blur-xl border-b border-zinc-800 px-4 py-3 mt-2 shadow-2xl">
          <nav className="flex flex-col space-y-1">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-xs sm:text-sm uppercase tracking-widest font-bold text-zinc-300 hover:text-yellow-400 hover:bg-zinc-900/80 transition-colors min-h-[44px] flex items-center px-4 rounded-lg"
              >
                {link.label}
              </a>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}

export default Navbar;
