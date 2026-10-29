"use client";

import React, { useState, useEffect, useRef, Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import {
  OrbitControls,
  Stars,
  ContactShadows,
  Float,
  Text,
} from "@react-three/drei";
import Link from "next/link";
import {
  Trophy,
  RotateCcw,
  Sparkles,
  Maximize2,
  Volume2,
  VolumeX,
  X,
  ChevronRight,
  ChevronLeft,
  Calendar,
  Layers,
  ArrowLeft,
  ExternalLink,
} from "lucide-react";
import { TrophyModel, TrophyData } from "./TrophyModel";
import { TROPHIES_DATA } from "@/data/trophies";

export function TrophyRoom3D() {
  const [trophies, setTrophies] = useState<TrophyData[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTrophy, setSelectedTrophy] = useState<TrophyData | null>(null);
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [autoRotate, setAutoRotate] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const controlsRef = useRef<any>(null);

  // Detect mobile
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Fetch trophies from CMS API with static fallback
  useEffect(() => {
    let mounted = true;
    const loadTrophies = async () => {
      try {
        const res = await fetch("/api/admin/trophies");
        if (res.ok) {
          const data = await res.json();
          if (mounted && data.ok && data.trophies?.length > 0) {
            setTrophies(data.trophies);
            return;
          }
        }
      } catch {
        // Fallback to static
      }

      if (mounted) {
        // Fallback to static data
        setTrophies(
          TROPHIES_DATA.map((t) => ({
            id: t.id,
            name: t.name,
            count: t.count,
            years: t.years.map(String),
            icon: t.icon,
            image: t.image,
            tier: t.tier,
            category: t.category,
            description: t.description,
            firstWon: t.firstWon,
            mostRecent: t.mostRecent,
          }))
        );
      }
      setLoading(false);
    };

    loadTrophies();
    return () => {
      mounted = false;
    };
  }, []);

  // Filter trophies
  const filteredTrophies = trophies.filter((t) => {
    if (categoryFilter === "all") return true;
    if (categoryFilter === "individual") return t.category === "individual";
    if (categoryFilter === "international") return t.category === "international";
    if (categoryFilter === "club") return t.category === "club";
    return true;
  });

  // Reset Camera View
  const handleResetCamera = () => {
    if (controlsRef.current) {
      controlsRef.current.reset();
    }
    setSelectedTrophy(null);
  };

  // Navigate through trophies
  const handleNextTrophy = () => {
    if (!selectedTrophy || filteredTrophies.length === 0) return;
    const currentIndex = filteredTrophies.findIndex((t) => t.id === selectedTrophy.id);
    const nextIndex = (currentIndex + 1) % filteredTrophies.length;
    setSelectedTrophy(filteredTrophies[nextIndex]);
  };

  const handlePrevTrophy = () => {
    if (!selectedTrophy || filteredTrophies.length === 0) return;
    const currentIndex = filteredTrophies.findIndex((t) => t.id === selectedTrophy.id);
    const prevIndex = (currentIndex - 1 + filteredTrophies.length) % filteredTrophies.length;
    setSelectedTrophy(filteredTrophies[prevIndex]);
  };

  // Dynamic layout calculations for circular pedestal arrangement
  const totalItems = filteredTrophies.length;
  const radius = Math.max(5.5, Math.min(8.5, totalItems * 0.55));

  return (
    <div className="relative w-full h-screen bg-[#050505] overflow-hidden select-none">
      {/* 1. Top HUD Bar */}
      <header className="absolute top-0 left-0 right-0 z-20 flex items-center justify-between p-4 sm:p-6 pointer-events-auto">
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-zinc-900/80 hover:bg-zinc-800 text-zinc-300 hover:text-white border border-zinc-800 text-xs font-mono transition-colors shadow-lg backdrop-blur-md"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-[#FEBE10]" />
            <span>Back to Tribute</span>
          </Link>

          <div className="hidden sm:block">
            <h1 className="text-sm font-black tracking-widest text-white uppercase font-sans flex items-center gap-1.5">
              <span>ROYAL TROPHY ROOM</span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#FEBE10] animate-pulse" />
            </h1>
            <p className="text-[10px] font-mono text-zinc-400">
              Interactive 360° Silverware Museum
            </p>
          </div>
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center gap-1 p-1 rounded-xl bg-zinc-900/85 backdrop-blur-xl border border-zinc-800 shadow-xl overflow-x-auto max-w-[50vw] sm:max-w-none">
          {[
            { id: "all", label: `All (${trophies.length})` },
            { id: "club", label: "Club" },
            { id: "international", label: "Portugal" },
            { id: "individual", label: "Honors" },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => {
                setCategoryFilter(cat.id);
                setSelectedTrophy(null);
              }}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-mono transition-all ${
                categoryFilter === cat.id
                  ? "bg-[#FEBE10] text-black font-bold shadow-[0_0_12px_rgba(254,190,16,0.4)]"
                  : "text-zinc-400 hover:text-white hover:bg-zinc-800/60"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* View Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setAutoRotate(!autoRotate)}
            className={`p-2 rounded-lg border text-xs font-mono transition-all backdrop-blur-md ${
              autoRotate
                ? "bg-[#FEBE10]/15 text-[#FEBE10] border-[#FEBE10]/40"
                : "bg-zinc-900/80 text-zinc-400 border-zinc-800 hover:text-white"
            }`}
            title="Toggle 360° Rotation"
          >
            <RotateCcw className={`w-3.5 h-3.5 ${autoRotate ? "animate-spin" : ""}`} />
          </button>

          <button
            onClick={handleResetCamera}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-900/80 hover:bg-zinc-800 text-zinc-300 border border-zinc-800 text-xs font-mono backdrop-blur-md"
            title="Reset Perspective"
          >
            <Maximize2 className="w-3.5 h-3.5" />
            <span>Reset View</span>
          </button>
        </div>
      </header>

      {/* 2. Main 3D Canvas Scene */}
      <Canvas
        camera={{ position: [0, 4.2, 14], fov: isMobile ? 55 : 45 }}
        gl={{
          antialias: true,
          alpha: false,
          powerPreference: "high-performance",
        }}
        className="w-full h-full cursor-grab active:cursor-grabbing"
      >
        <color attach="background" args={["#050505"]} />
        <fog attach="fog" args={["#050505", 12, 32]} />

        {/* Atmosphere & Lighting */}
        <ambientLight intensity={0.45} color="#FEBE10" />

        {/* Main High-intensity Overhead Center Spotlight */}
        <spotLight
          position={[0, 14, 0]}
          intensity={2.8}
          angle={0.65}
          penumbra={0.8}
          color="#ffffff"
          castShadow
        />

        {/* Golden Rotunda Accent Lights */}
        <directionalLight position={[10, 8, 10]} intensity={1.2} color="#FEBE10" />
        <directionalLight position={[-10, 8, -10]} intensity={0.8} color="#FEBE10" />

        {/* Additional rim light on mobile/desktop */}
        {!isMobile && (
          <pointLight position={[0, -2, 0]} intensity={0.5} color="#FEBE10" />
        )}

        {/* Subtle Floating Gold Particles */}
        <Stars
          radius={35}
          depth={25}
          count={isMobile ? 250 : 850}
          factor={4}
          saturation={0.9}
          fade
          speed={1.2}
        />

        {/* Museum Floor: Circular Reflective Rings */}
        <group position={[0, 0, 0]}>
          {/* Main Dark Obsidian Floor Plate */}
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]} receiveShadow>
            <circleGeometry args={[22, 64]} />
            <meshStandardMaterial
              color="#070709"
              metalness={0.7}
              roughness={0.2}
            />
          </mesh>

          {/* Golden Concentric Inlay Rings */}
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.005, 0]}>
            <ringGeometry args={[radius - 0.05, radius + 0.05, 64]} />
            <meshBasicMaterial color="#FEBE10" transparent opacity={0.4} />
          </mesh>

          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.005, 0]}>
            <ringGeometry args={[2.5, 2.56, 64]} />
            <meshBasicMaterial color="#FEBE10" transparent opacity={0.3} />
          </mesh>

          {/* Central Monogram Emblem */}
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.008, 0]}>
            <circleGeometry args={[1.5, 32]} />
            <meshBasicMaterial color="#111116" />
          </mesh>
        </group>

        {/* Soft Contact Shadows on Floor */}
        <ContactShadows
          position={[0, 0.01, 0]}
          opacity={0.75}
          scale={30}
          blur={2.4}
          far={4}
          color="#000000"
        />

        {/* Trophy Models Arranged in Rotunda Circle */}
        <group position={[0, 0, 0]}>
          {filteredTrophies.map((trophy, index) => {
            const angle = (index / totalItems) * Math.PI * 2;
            const x = Math.sin(angle) * radius;
            const z = Math.cos(angle) * radius;
            // Face inward toward center
            const rotY = angle + Math.PI;

            return (
              <TrophyModel
                key={trophy.id}
                trophy={trophy}
                position={[x, 0, z]}
                rotation={[0, rotY, 0]}
                isSelected={selectedTrophy?.id === trophy.id}
                onSelect={(t) => {
                  setSelectedTrophy(t);
                  setAutoRotate(false);
                }}
              />
            );
          })}
        </group>

        {/* Camera Orbit Controls */}
        <OrbitControls
          ref={controlsRef}
          enablePan={true}
          enableZoom={true}
          maxPolarAngle={Math.PI / 2 - 0.04}
          minDistance={3.8}
          maxDistance={22}
          autoRotate={autoRotate && !selectedTrophy}
          autoRotateSpeed={0.6}
        />
      </Canvas>

      {/* 3. Bottom Guide Strip */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 pointer-events-none">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-zinc-950/80 backdrop-blur-md border border-zinc-800/80 text-[11px] font-mono text-zinc-400 shadow-xl">
          <Sparkles className="w-3.5 h-3.5 text-[#FEBE10]" />
          <span>Drag to orbit in 360° • Click any trophy to inspect history</span>
        </div>
      </div>

      {/* 4. Selected Trophy Inspection Drawer */}
      {selectedTrophy && (
        <aside className="absolute right-0 top-0 bottom-0 z-30 w-full sm:w-96 bg-zinc-950/95 backdrop-blur-2xl border-l border-zinc-800 p-6 flex flex-col justify-between shadow-2xl animate-in slide-in-from-right duration-300">
          <div>
            {/* Header & Close */}
            <div className="flex items-center justify-between pb-4 border-b border-zinc-800">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-mono font-bold bg-[#FEBE10] text-black">
                <Trophy className="w-3.5 h-3.5 fill-black" />
                <span>x{selectedTrophy.count} TITLES WON</span>
              </div>

              <div className="flex items-center gap-1">
                <button
                  onClick={handlePrevTrophy}
                  title="Previous trophy"
                  className="p-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white border border-zinc-800"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={handleNextTrophy}
                  title="Next trophy"
                  className="p-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white border border-zinc-800"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setSelectedTrophy(null)}
                  title="Close inspection"
                  className="p-1.5 rounded-lg bg-zinc-900 hover:bg-rose-500/20 text-zinc-400 hover:text-rose-400 border border-zinc-800 ml-1"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Trophy Photo / Visual */}
            {selectedTrophy.image && (
              <div className="mt-5 relative aspect-video w-full rounded-xl bg-zinc-900 border border-zinc-800 overflow-hidden flex items-center justify-center p-3">
                <img
                  src={selectedTrophy.image}
                  alt={selectedTrophy.name}
                  className="max-h-full max-w-full object-contain filter drop-shadow-[0_10px_20px_rgba(254,190,16,0.2)]"
                  onError={(e) => {
                    (e.target as HTMLElement).style.display = "none";
                  }}
                />
              </div>
            )}

            {/* Title & Metadata */}
            <div className="mt-5 space-y-2">
              <h2 className="text-xl font-black text-white tracking-tight">
                {selectedTrophy.name}
              </h2>
              <div className="flex items-center gap-2">
                <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-zinc-900 text-[#FEBE10] border border-zinc-800 font-semibold">
                  {selectedTrophy.category}
                </span>
                <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-zinc-900 text-zinc-400 border border-zinc-800">
                  Tier: {selectedTrophy.tier || "Gold"}
                </span>
              </div>
            </div>

            {/* Winning Years */}
            <div className="mt-5 p-4 rounded-xl bg-zinc-900/60 border border-zinc-800/80 space-y-2">
              <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-zinc-300">
                <Calendar className="w-3.5 h-3.5 text-[#FEBE10]" />
                <span>Victorious Campaigns</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {(Array.isArray(selectedTrophy.years)
                  ? selectedTrophy.years
                  : typeof selectedTrophy.years === "string"
                  ? JSON.parse(selectedTrophy.years || "[]")
                  : []
                ).map((y: string, idx: number) => (
                  <span
                    key={idx}
                    className="text-xs px-2.5 py-1 rounded-md bg-zinc-800 text-[#FEBE10] font-mono font-semibold border border-zinc-700"
                  >
                    {y}
                  </span>
                ))}
              </div>
            </div>

            {/* Description */}
            <div className="mt-4">
              <h4 className="text-xs font-mono uppercase tracking-wider text-zinc-400 mb-1.5 font-semibold">
                Historical Significance
              </h4>
              <p className="text-xs text-zinc-300 leading-relaxed bg-zinc-900/40 p-3.5 rounded-xl border border-zinc-800/80">
                {selectedTrophy.description ||
                  "A monumental triumph etched into football folklore, cementing Cristiano Ronaldo's unrivaled legacy."}
              </p>
            </div>
          </div>

          {/* Footer Close */}
          <div className="pt-4 border-t border-zinc-800">
            <button
              onClick={() => setSelectedTrophy(null)}
              className="w-full py-2.5 px-4 rounded-xl bg-[#FEBE10] text-black font-mono font-bold text-xs uppercase tracking-wider hover:opacity-90 transition-all shadow-[0_0_15px_rgba(254,190,16,0.25)]"
            >
              Resume 360° Exploration
            </button>
          </div>
        </aside>
      )}
    </div>
  );
}
export default TrophyRoom3D;
