"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import { ERAS_DATA } from "@/data/eras";
import { EraPanel } from "./EraPanel";
import { EraProgress } from "./EraProgress";
import { EraThemeBridge } from "./EraThemeBridge";
import { useEraTheme } from "@/hooks/useEraTheme";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { soundFx } from "@/lib/utils";

export const CareerTimeline: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  const [activeIndex, setActiveIndex] = useState(0);
  const [progressRatio, setProgressRatio] = useState(0);
  const [isMobileOrReduced, setIsMobileOrReduced] = useState(false);

  const activeIndexRef = useRef(0);
  const { switchEraByIndex } = useEraTheme("sporting-cp");

  // Detect Mobile device or prefers-reduced-motion
  useEffect(() => {
    if (typeof window === "undefined") return;

    const checkConstraints = () => {
      const isSmallScreen = window.innerWidth < 1024;
      const isCoarse = window.matchMedia("(pointer: coarse)").matches;
      const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      setIsMobileOrReduced(isSmallScreen || isCoarse || reducedMotion);
    };

    checkConstraints();
    window.addEventListener("resize", checkConstraints);
    return () => window.removeEventListener("resize", checkConstraints);
  }, []);

  // Jump to specific era index
  const handleSelectEra = useCallback(
    (index: number) => {
      soundFx.playClick();
      setActiveIndex(index);
      activeIndexRef.current = index;
      switchEraByIndex(index, true);

      if (!isMobileOrReduced && sectionRef.current) {
        const trigger = ScrollTrigger.getById("timeline-pin");
        if (trigger) {
          const start = trigger.start;
          const end = trigger.end;
          const targetScroll = start + (index / (ERAS_DATA.length - 1)) * (end - start);
          window.scrollTo({ top: targetScroll, behavior: "smooth" });
        }
      } else {
        // Vertical mobile scroll to panel
        const panels = document.querySelectorAll(".era-panel-item");
        panels[index]?.scrollIntoView({ behavior: "smooth" });
      }
    },
    [isMobileOrReduced, switchEraByIndex]
  );

  // Keyboard navigation (ArrowLeft / ArrowRight)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!sectionRef.current) return;
      const rect = sectionRef.current.getBoundingClientRect();
      const inViewport = rect.top < window.innerHeight && rect.bottom > 0;
      if (!inViewport) return;

      if (e.key === "ArrowRight") {
        e.preventDefault();
        const next = Math.min(ERAS_DATA.length - 1, activeIndexRef.current + 1);
        handleSelectEra(next);
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        const prev = Math.max(0, activeIndexRef.current - 1);
        handleSelectEra(prev);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleSelectEra]);

  // Master GSAP ScrollTrigger Horizontal Pinning Setup (Desktop)
  useEffect(() => {
    if (isMobileOrReduced) return;
    if (typeof window === "undefined") return;

    gsap.registerPlugin(ScrollTrigger);

    const section = sectionRef.current;
    const track = trackRef.current;
    if (!section || !track) return;

    const totalPanels = ERAS_DATA.length;
    // Calculate scroll travel distance
    const totalScrollWidth = (totalPanels - 1) * window.innerWidth;

    const tween = gsap.to(track, {
      x: () => -totalScrollWidth,
      ease: "none",
      scrollTrigger: {
        id: "timeline-pin",
        trigger: section,
        pin: true,
        scrub: 1,
        start: "top top",
        end: () => `+=${totalScrollWidth}`,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          const rawProgress = self.progress;
          setProgressRatio(rawProgress);

          const newIndex = Math.min(
            totalPanels - 1,
            Math.max(0, Math.round(rawProgress * (totalPanels - 1)))
          );

          if (newIndex !== activeIndexRef.current) {
            activeIndexRef.current = newIndex;
            setActiveIndex(newIndex);
            switchEraByIndex(newIndex, true);
          }
        },
      },
    });

    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, [isMobileOrReduced, switchEraByIndex]);

  // Mobile Vertical Observer
  useEffect(() => {
    if (!isMobileOrReduced) return;

    const panels = document.querySelectorAll(".era-panel-item");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = Number(entry.target.getAttribute("data-index") || 0);
            if (index !== activeIndexRef.current) {
              activeIndexRef.current = index;
              setActiveIndex(index);
              switchEraByIndex(index, true);
            }
          }
        });
      },
      { threshold: 0.5 }
    );

    panels.forEach((p) => observer.observe(p));
    return () => observer.disconnect();
  }, [isMobileOrReduced, switchEraByIndex]);

  return (
    <section
      id="career-timeline"
      ref={sectionRef}
      className="relative w-full overflow-hidden bg-bg text-text transition-colors duration-800"
      aria-label="Cristiano Ronaldo Career Eras Timeline"
      tabIndex={0}
    >
      {/* Era Boundary Bridge */}
      <EraThemeBridge />

      {/* Persistent Timeline Progress Bar */}
      <div className="sticky top-6 left-0 right-0 z-40 w-full pointer-events-auto">
        <EraProgress
          eras={ERAS_DATA}
          activeIndex={activeIndex}
          progressRatio={progressRatio}
          onSelectEra={handleSelectEra}
        />
      </div>

      {/* Screen Reader Era Announcement */}
      <div className="sr-only" aria-live="polite">
        Current era: {ERAS_DATA[activeIndex]?.club} ({ERAS_DATA[activeIndex]?.period})
      </div>

      {/* Panels Track: Horizontal on Desktop, Vertical on Mobile */}
      {isMobileOrReduced ? (
        // Mobile / Reduced Motion: Vertical Stack
        <div className="flex flex-col w-full">
          {ERAS_DATA.map((era, index) => (
            <div
              key={era.id}
              data-index={index}
              className="era-panel-item w-full min-h-screen"
            >
              <EraPanel
                era={era}
                index={index}
                isActive={index === activeIndex}
                priorityImage={index < 2}
              />
            </div>
          ))}
        </div>
      ) : (
        // Desktop: GSAP Horizontal Pin Track
        <div
          ref={trackRef}
          className="flex h-screen will-change-transform"
          style={{ width: `${ERAS_DATA.length * 100}vw` }}
        >
          {ERAS_DATA.map((era, index) => (
            <div key={era.id} className="w-screen h-screen flex-shrink-0">
              <EraPanel
                era={era}
                index={index}
                isActive={index === activeIndex}
                priorityImage={index < 2}
              />
            </div>
          ))}
        </div>
      )}
    </section>
  );
};
