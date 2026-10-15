"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import { useCursor } from "./CursorContext";

interface Particle {
  x: number;
  y: number;
  size: number;
  alpha: number;
  maxLife: number;
  currentLife: number;
  vx: number;
  vy: number;
}

interface Ripple {
  x: number;
  y: number;
  startTime: number;
}

export const CustomCursor: React.FC = () => {
  const { cursorVariant, cursorLabel, magneticTarget } = useCursor();

  const [isVisible, setIsVisible] = useState(false);
  const [isPointerFine, setIsPointerFine] = useState(false);
  const [ripples, setRipples] = useState<Ripple[]>([]);

  // Refs for tracking positions
  const mousePos = useRef({ x: -100, y: -100 });
  const dotPos = useRef({ x: -100, y: -100 });
  const ringPos = useRef({ x: -100, y: -100 });

  // DOM elements refs
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Particles array
  const particlesRef = useRef<Particle[]>([]);
  const animFrameRef = useRef<number | null>(null);

  // Detect pointer device type (disable on touch / coarse pointer)
  useEffect(() => {
    if (typeof window === "undefined") return;
    const mediaQuery = window.matchMedia("(pointer: fine)");
    setIsPointerFine(mediaQuery.matches);

    const handler = (e: MediaQueryListEvent) => setIsPointerFine(e.matches);
    mediaQuery.addEventListener("change", handler);
    return () => mediaQuery.removeEventListener("change", handler);
  }, []);

  // Spawn golden particle
  const spawnParticle = useCallback((x: number, y: number) => {
    if (particlesRef.current.length >= 24) return;
    particlesRef.current.push({
      x: x + (Math.random() - 0.5) * 8,
      y: y + (Math.random() - 0.5) * 8,
      size: Math.random() * 2.5 + 1.2,
      alpha: 0.8,
      maxLife: 800,
      currentLife: 0,
      vx: (Math.random() - 0.5) * 0.8,
      vy: (Math.random() - 0.5) * 0.8 - 0.3, // slight upward float
    });
  }, []);

  // Handle Mouse Events
  useEffect(() => {
    if (!isPointerFine) return;

    const handleMouseMove = (e: MouseEvent) => {
      mousePos.current = { x: e.clientX, y: e.clientY };
      if (!isVisible) setIsVisible(true);

      // Spawn golden particle trail
      spawnParticle(e.clientX, e.clientY);
    };

    const handleMouseDown = (e: MouseEvent) => {
      setRipples((prev) => [
        ...prev.slice(-3),
        { x: e.clientX, y: e.clientY, startTime: performance.now() },
      ]);
    };

    const handleMouseLeave = () => setIsVisible(false);
    const handleMouseEnter = () => setIsVisible(true);

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    window.addEventListener("mousedown", handleMouseDown);
    document.addEventListener("mouseleave", handleMouseLeave);
    document.addEventListener("mouseenter", handleMouseEnter);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mousedown", handleMouseDown);
      document.removeEventListener("mouseleave", handleMouseLeave);
      document.removeEventListener("mouseenter", handleMouseEnter);
    };
  }, [isPointerFine, isVisible, spawnParticle]);

  // Main 60FPS Render & Physics Loop
  useEffect(() => {
    if (!isPointerFine) return;

    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");

    const resizeCanvas = () => {
      if (canvas) {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
      }
    };
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    let lastTime = performance.now();

    const loop = (time: number) => {
      const dt = time - lastTime;
      lastTime = time;

      // 1. Calculate Target Positions (handling Magnetic Snap if active)
      let targetX = mousePos.current.x;
      let targetY = mousePos.current.y;

      if (magneticTarget) {
        const rect = magneticTarget.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        // Strong magnetic pull toward button center
        targetX = centerX + (mousePos.current.x - centerX) * 0.28;
        targetY = centerY + (mousePos.current.y - centerY) * 0.28;
      }

      // 2. Physics Lerp (Spring follow)
      const dotLerp = 0.22;
      const ringLerp = 0.09;

      dotPos.current.x += (targetX - dotPos.current.x) * dotLerp;
      dotPos.current.y += (targetY - dotPos.current.y) * dotLerp;

      ringPos.current.x += (targetX - ringPos.current.x) * ringLerp;
      ringPos.current.y += (targetY - ringPos.current.y) * ringLerp;

      // 3. Update DOM positions via transform3d for hardware acceleration
      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${dotPos.current.x}px, ${dotPos.current.y}px, 0) translate(-50%, -50%)`;
      }
      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${ringPos.current.x}px, ${ringPos.current.y}px, 0) translate(-50%, -50%)`;
      }

      // 4. Render Particle System on Canvas
      if (ctx && canvas) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        const particles = particlesRef.current;
        for (let i = particles.length - 1; i >= 0; i--) {
          const p = particles[i];
          p.currentLife += dt;
          if (p.currentLife >= p.maxLife) {
            particles.splice(i, 1);
            continue;
          }

          p.x += p.vx;
          p.y += p.vy;
          const progress = p.currentLife / p.maxLife;
          const currentAlpha = p.alpha * (1 - progress);

          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size * (1 - progress * 0.5), 0, Math.PI * 2);
          ctx.fillStyle = `rgba(254, 190, 16, ${currentAlpha})`;
          ctx.shadowColor = "#FEBE10";
          ctx.shadowBlur = 6;
          ctx.fill();
        }
      }

      // 5. Clean up expired ripples
      setRipples((prev) =>
        prev.filter((r) => time - r.startTime < 450)
      );

      animFrameRef.current = requestAnimationFrame(loop);
    };

    animFrameRef.current = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [isPointerFine, magneticTarget]);

  if (!isPointerFine || cursorVariant === "disabled") return null;

  // Visual sizing & styling according to cursor variant
  const isHovered =
    cursorVariant === "hover" ||
    cursorVariant === "play" ||
    cursorVariant === "view" ||
    cursorVariant === "like" ||
    cursorVariant === "siuuu";

  const ringSizeClass = isHovered
    ? "w-16 h-16 sm:w-20 sm:h-20 border-gold/90 bg-gold/10 backdrop-blur-[1px]"
    : "w-10 h-10 border-gold/40 bg-transparent";

  const dotSizeClass = isHovered
    ? "w-2 h-2 bg-gold shadow-[0_0_12px_#FEBE10]"
    : "w-3 h-3 bg-gold shadow-[0_0_8px_#FEBE10]";

  return (
    <>
      {/* High-Performance Canvas for Particle Trails */}
      <canvas
        ref={canvasRef}
        className="canvas-particles pointer-events-none fixed inset-0 z-[9990]"
        aria-hidden="true"
      />

      {/* Outer Spring Ring */}
      <div
        ref={ringRef}
        className={`custom-cursor pointer-events-none fixed top-0 left-0 z-[9992] rounded-full border border-solid transition-[width,height,border-color,background-color] duration-300 ease-out flex items-center justify-center ${ringSizeClass} ${
          isVisible ? "opacity-100" : "opacity-0"
        }`}
        style={{ willChange: "transform" }}
        aria-hidden="true"
      >
        {/* Contextual Tag Label ("VIEW", "PLAY", "DRAG", "LIKE", "SIUUU") */}
        {cursorLabel && (
          <span className="font-bebas text-[10px] tracking-widest text-gold uppercase px-1 text-center animate-fade-in font-bold drop-shadow">
            {cursorLabel}
          </span>
        )}
      </div>

      {/* Inner Precision Dot */}
      <div
        ref={dotRef}
        className={`custom-cursor pointer-events-none fixed top-0 left-0 z-[9993] rounded-full transition-opacity duration-150 ${dotSizeClass} ${
          isVisible ? "opacity-100" : "opacity-0"
        }`}
        style={{ willChange: "transform" }}
        aria-hidden="true"
      />

      {/* Expanding Click Ripples */}
      {ripples.map((ripple) => (
        <div
          key={ripple.startTime}
          className="pointer-events-none fixed z-[9991] rounded-full border border-gold/80 animate-ping"
          style={{
            left: `${ripple.x}px`,
            top: `${ripple.y}px`,
            width: "32px",
            height: "32px",
            transform: "translate(-50%, -50%)",
            animationDuration: "400ms",
          }}
          aria-hidden="true"
        />
      ))}
    </>
  );
};
