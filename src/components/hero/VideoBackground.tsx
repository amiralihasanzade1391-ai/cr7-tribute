"use client";

import React, { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";

// Dynamic import of ReactPlayer with SSR disabled to prevent hydration mismatches
const ReactPlayer = dynamic(() => import("react-player/lazy"), { ssr: false });

interface VideoBackgroundProps {
  isPreloaderFinished?: boolean;
  youtubeId?: string;
}

// Visual constants
const DESKTOP_PARTICLE_COUNT = 60;
const MOBILE_PARTICLE_COUNT = 20;
const PARALLAX_FACTOR = 0.3;
const DEFAULT_YOUTUBE_ID = "vFjt-YWS6pc"; // Curated high-octane CR7 UEFA showcase

interface EmberParticle {
  x: number;
  y: number;
  size: number;
  alpha: number;
  baseAlpha: number;
  speedY: number;
  speedX: number;
  pulseSpeed: number;
  pulsePhase: number;
}

export const VideoBackground: React.FC<VideoBackgroundProps> = ({
  isPreloaderFinished = true,
  youtubeId = DEFAULT_YOUTUBE_ID,
}) => {
  const [isMounted, setIsMounted] = useState(false);
  const [shouldPlayVideo, setShouldPlayVideo] = useState(false);
  const [videoError, setVideoError] = useState(false);
  const [isLowBandwidth, setIsLowBandwidth] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [scrollY, setScrollY] = useState(0);

  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<EmberParticle[]>([]);
  const animFrameRef = useRef<number | null>(null);

  // Detect client mount, low bandwidth, and reduced motion preference
  useEffect(() => {
    setIsMounted(true);

    if (typeof window !== "undefined") {
      // Check reduced motion
      const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
      setPrefersReducedMotion(motionQuery.matches);

      // Check connection speed
      const nav = navigator as unknown as {
        connection?: { effectiveType?: string; saveData?: boolean };
      };
      if (
        nav.connection?.saveData ||
        nav.connection?.effectiveType === "2g" ||
        nav.connection?.effectiveType === "slow-2g"
      ) {
        setIsLowBandwidth(true);
      }

      // Parallax scroll listener
      const handleScroll = () => {
        setScrollY(window.scrollY);
      };
      window.addEventListener("scroll", handleScroll, { passive: true });
      return () => window.removeEventListener("scroll", handleScroll);
    }
  }, []);

  // Delay video initialization by 500ms after preloader finishes to avoid jarring cuts
  useEffect(() => {
    if (isPreloaderFinished && !isLowBandwidth) {
      const timer = setTimeout(() => {
        setShouldPlayVideo(true);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [isPreloaderFinished, isLowBandwidth]);

  // Golden Ember Particle System on Canvas (Always runs as ambient backdrop / fallback)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const isMobile = window.innerWidth < 768;
    const count = isMobile ? MOBILE_PARTICLE_COUNT : DESKTOP_PARTICLE_COUNT;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    // Initialize particles
    particlesRef.current = Array.from({ length: count }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      size: Math.random() * 2.2 + 0.8,
      alpha: Math.random() * 0.5 + 0.2,
      baseAlpha: Math.random() * 0.4 + 0.2,
      speedY: Math.random() * 0.4 + 0.15, // Gentle upward rise
      speedX: (Math.random() - 0.5) * 0.3,
      pulseSpeed: Math.random() * 0.03 + 0.01,
      pulsePhase: Math.random() * Math.PI * 2,
    }));

    let t = 0;
    const render = () => {
      t += 0.02;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Deep cinematic ambient background radial glow
      const grad = ctx.createRadialGradient(
        canvas.width * 0.5,
        canvas.height * 0.4,
        0,
        canvas.width * 0.5,
        canvas.height * 0.4,
        canvas.width * 0.8
      );
      grad.addColorStop(0, "rgba(254, 190, 16, 0.08)");
      grad.addColorStop(0.5, "rgba(218, 41, 28, 0.04)");
      grad.addColorStop(1, "rgba(5, 5, 7, 0.95)");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw floating golden particles
      particlesRef.current.forEach((p) => {
        p.y -= p.speedY;
        p.x += p.speedX;
        p.pulsePhase += p.pulseSpeed;

        // Wrap around edges
        if (p.y < -10) p.y = canvas.height + 10;
        if (p.x < -10) p.x = canvas.width + 10;
        if (p.x > canvas.width + 10) p.x = -10;

        const currentAlpha = p.baseAlpha + Math.sin(p.pulsePhase) * 0.2;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(254, 190, 16, ${Math.max(0.05, currentAlpha)})`;
        ctx.shadowColor = "#FEBE10";
        ctx.shadowBlur = 8;
        ctx.fill();
      });

      animFrameRef.current = requestAnimationFrame(render);
    };

    animFrameRef.current = requestAnimationFrame(render);

    return () => {
      window.removeEventListener("resize", resize);
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, []);

  // Parallax transform calculation
  const parallaxOffset = prefersReducedMotion ? 0 : scrollY * PARALLAX_FACTOR;

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 w-full h-full overflow-hidden select-none pointer-events-none"
      aria-hidden="true"
    >
      {/* 1. Underlying Canvas Particles & Ambient Radial Glow */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full object-cover z-0"
      />

      {/* 2. Full-Screen YouTube Video Layer */}
      {isMounted && shouldPlayVideo && !videoError && !isLowBandwidth && (
        <div
          className="absolute inset-0 w-full h-full z-[1] overflow-hidden transition-transform duration-100 ease-out will-change-transform"
          style={{
            transform: `translate3d(0, ${parallaxOffset}px, 0) scale(${
              prefersReducedMotion ? 1 : 1.05
            })`,
          }}
        >
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[160vw] h-[160vh] sm:w-[130vw] sm:h-[130vh] pointer-events-none opacity-45 mix-blend-screen transition-opacity duration-1000">
            <ReactPlayer
              url={`https://www.youtube-nocookie.com/watch?v=${youtubeId}`}
              playing={shouldPlayVideo}
              loop={true}
              muted={true}
              playsinline={true}
              controls={false}
              width="100%"
              height="100%"
              onError={() => setVideoError(true)}
              config={{
                youtube: {
                  playerVars: {
                    autoplay: 1,
                    controls: 0,
                    disablekb: 1,
                    fs: 0,
                    loop: 1,
                    modestbranding: 1,
                    playlist: youtubeId,
                    rel: 0,
                    showinfo: 0,
                    iv_load_policy: 3,
                  },
                },
              }}
            />
          </div>
        </div>
      )}

      {/* 3. Subtle Vignette Effect (Darkens perimeter, draws eye to center) */}
      <div
        className="absolute inset-0 z-[2] pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 35%, rgba(10, 10, 12, 0.6) 75%, rgba(5, 5, 7, 0.95) 100%)",
        }}
      />

      {/* 4. Film Noir Top-to-Bottom Gradient (Fades into next sections) */}
      <div
        className="absolute inset-0 z-[3] pointer-events-none"
        style={{
          background:
            "linear-gradient(to bottom, rgba(5, 5, 7, 0.4) 0%, rgba(10, 10, 12, 0.65) 60%, #0A0A0C 100%)",
        }}
      />

      {/* 5. Subtle VHS / Scanline Overlay for 35mm Analog Cinematic Feel */}
      <div
        className="absolute inset-0 z-[4] pointer-events-none opacity-[0.035]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg, rgba(255, 255, 255, 0.8) 0px, transparent 1px, transparent 2px)",
          backgroundSize: "100% 3px",
        }}
      />
    </div>
  );
};
