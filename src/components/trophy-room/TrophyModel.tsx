"use client";

import React, { useRef, useState } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import { Sparkles, Trophy as TrophyIcon } from "lucide-react";

export interface TrophyData {
  id: string;
  name: string;
  count: number;
  years: string | string[] | number[];
  icon?: string;
  image?: string | null;
  tier?: string;
  category?: string;
  description?: string;
  firstWon?: number | null;
  mostRecent?: number | null;
  modelUrl?: string;
}

interface TrophyModelProps {
  trophy: TrophyData;
  position: [number, number, number];
  rotation?: [number, number, number];
  isSelected: boolean;
  onSelect: (trophy: TrophyData) => void;
  onHover?: (hovered: boolean) => void;
}

export function TrophyModel({
  trophy,
  position,
  rotation = [0, 0, 0],
  isSelected,
  onSelect,
  onHover,
}: TrophyModelProps) {
  const groupRef = useRef<THREE.Group>(null);
  const trophyMeshRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);

  // Parse years
  let yearsList: string[] = [];
  try {
    if (Array.isArray(trophy.years)) {
      yearsList = trophy.years.map(String);
    } else if (typeof trophy.years === "string") {
      const parsed = JSON.parse(trophy.years);
      yearsList = Array.isArray(parsed) ? parsed.map(String) : [trophy.years];
    }
  } catch {
    yearsList = typeof trophy.years === "string" ? trophy.years.split(",") : [];
  }

  // Animation loop
  useFrame((state, delta) => {
    if (!trophyMeshRef.current) return;

    // Gentle bobbing and smooth rotation
    const time = state.clock.getElapsedTime();
    const bobOffset = Math.sin(time * 2 + position[0]) * 0.04;
    trophyMeshRef.current.position.y = 1.35 + bobOffset;

    if (hovered || isSelected) {
      trophyMeshRef.current.rotation.y += delta * 1.5;
    } else {
      trophyMeshRef.current.rotation.y += delta * 0.35;
    }

    // Scale lerp
    const targetScale = isSelected ? 1.25 : hovered ? 1.15 : 1.0;
    trophyMeshRef.current.scale.lerp(
      new THREE.Vector3(targetScale, targetScale, targetScale),
      delta * 8
    );
  });

  const handlePointerOver = (e: any) => {
    e.stopPropagation();
    setHovered(true);
    document.body.style.cursor = "pointer";
    onHover?.(true);
  };

  const handlePointerOut = (e: any) => {
    e.stopPropagation();
    setHovered(false);
    document.body.style.cursor = "auto";
    onHover?.(false);
  };

  const handleClick = (e: any) => {
    e.stopPropagation();
    onSelect(trophy);
  };

  // Determine Trophy Procedural Style
  const isBallonDor =
    trophy.id.includes("ballon") || trophy.name.toLowerCase().includes("ballon");
  const isUCL =
    trophy.id.includes("champions") || trophy.name.toLowerCase().includes("champions");
  const isEuro =
    trophy.id.includes("euro") ||
    trophy.name.toLowerCase().includes("euro") ||
    trophy.name.toLowerCase().includes("nations");

  return (
    <group ref={groupRef} position={position} rotation={rotation}>
      {/* 1. Museum Pedestal (Base & Brass Plaque) */}
      <group position={[0, 0, 0]}>
        {/* Main Pillar (Dark polished Obsidian) */}
        <mesh position={[0, 0.55, 0]} castShadow receiveShadow>
          <cylinderGeometry args={[0.7, 0.85, 1.1, 32]} />
          <meshStandardMaterial
            color="#0d0d10"
            metalness={0.4}
            roughness={0.25}
          />
        </mesh>

        {/* Top Gold Trim Rim */}
        <mesh position={[0, 1.12, 0]}>
          <cylinderGeometry args={[0.72, 0.72, 0.05, 32]} />
          <meshStandardMaterial
            color="#FEBE10"
            metalness={0.95}
            roughness={0.15}
          />
        </mesh>

        {/* Bottom Gold Trim Rim */}
        <mesh position={[0, 0.05, 0]}>
          <cylinderGeometry args={[0.88, 0.88, 0.08, 32]} />
          <meshStandardMaterial
            color="#FEBE10"
            metalness={0.95}
            roughness={0.15}
          />
        </mesh>

        {/* Front Engraved Brass Plate */}
        <mesh position={[0, 0.55, 0.72]} rotation={[0, 0, 0]}>
          <boxGeometry args={[0.7, 0.35, 0.02]} />
          <meshStandardMaterial
            color="#b3860b"
            metalness={0.88}
            roughness={0.3}
          />
        </mesh>

        {/* Ground Soft Glow Ring */}
        <mesh position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.9, 1.3, 32]} />
          <meshBasicMaterial
            color={hovered || isSelected ? "#FEBE10" : "#55420b"}
            transparent
            opacity={hovered || isSelected ? 0.6 : 0.25}
          />
        </mesh>
      </group>

      {/* 2. Interactive Trophy Mesh */}
      <group
        ref={trophyMeshRef}
        position={[0, 1.35, 0]}
        onPointerOver={handlePointerOver}
        onPointerOut={handlePointerOut}
        onClick={handleClick}
      >
        {isBallonDor ? (
          /* ========================================================
             BALLON D'OR: Golden Geodesic Faceted Sphere on Pyrite Base
             ======================================================== */
          <group>
            {/* Pyramid rock base */}
            <mesh position={[0, 0.15, 0]}>
              <cylinderGeometry args={[0.25, 0.4, 0.35, 6]} />
              <meshStandardMaterial
                color="#544320"
                metalness={0.7}
                roughness={0.6}
              />
            </mesh>

            {/* The Golden Globe */}
            <mesh position={[0, 0.65, 0]} castShadow>
              <icosahedronGeometry args={[0.48, 3]} />
              <meshStandardMaterial
                color="#FFDF00"
                metalness={0.96}
                roughness={0.12}
                envMapIntensity={2.0}
              />
            </mesh>

            {/* Seams / golden equator ring */}
            <mesh position={[0, 0.65, 0]}>
              <torusGeometry args={[0.5, 0.02, 16, 32]} />
              <meshStandardMaterial color="#FEBE10" metalness={0.9} roughness={0.2} />
            </mesh>
          </group>
        ) : isUCL ? (
          /* ========================================================
             UEFA CHAMPIONS LEAGUE: Classic Silver-Gold Ol' Big Ears
             ======================================================== */
          <group>
            {/* Pedestal Foot */}
            <mesh position={[0, 0.08, 0]}>
              <cylinderGeometry args={[0.26, 0.32, 0.15, 32]} />
              <meshStandardMaterial color="#E0E6ED" metalness={0.95} roughness={0.15} />
            </mesh>

            {/* Stem */}
            <mesh position={[0, 0.28, 0]}>
              <cylinderGeometry args={[0.12, 0.16, 0.25, 32]} />
              <meshStandardMaterial color="#FEBE10" metalness={0.9} roughness={0.2} />
            </mesh>

            {/* Main Cup Body */}
            <mesh position={[0, 0.65, 0]} castShadow>
              <cylinderGeometry args={[0.44, 0.18, 0.65, 32]} />
              <meshStandardMaterial
                color="#E8ECEF"
                metalness={0.98}
                roughness={0.1}
                envMapIntensity={2.2}
              />
            </mesh>

            {/* Rim Ring */}
            <mesh position={[0, 0.98, 0]}>
              <torusGeometry args={[0.44, 0.03, 16, 32]} />
              <meshStandardMaterial color="#FEBE10" metalness={0.95} roughness={0.15} />
            </mesh>

            {/* Left Big Ear Handle */}
            <mesh position={[-0.45, 0.68, 0]} rotation={[0, 0, Math.PI / 6]}>
              <torusGeometry args={[0.24, 0.035, 16, 32, Math.PI * 1.2]} />
              <meshStandardMaterial color="#E8ECEF" metalness={0.95} roughness={0.12} />
            </mesh>

            {/* Right Big Ear Handle */}
            <mesh position={[0.45, 0.68, 0]} rotation={[0, 0, -Math.PI / 6]}>
              <torusGeometry args={[0.24, 0.035, 16, 32, Math.PI * 1.2]} />
              <meshStandardMaterial color="#E8ECEF" metalness={0.95} roughness={0.12} />
            </mesh>
          </group>
        ) : isEuro ? (
          /* ========================================================
             EURO / NATIONS LEAGUE: Sleek Modernist Trophy Column
             ======================================================== */
          <group>
            {/* Base block */}
            <mesh position={[0, 0.1, 0]}>
              <cylinderGeometry args={[0.28, 0.35, 0.2, 32]} />
              <meshStandardMaterial color="#0d0d10" metalness={0.5} roughness={0.3} />
            </mesh>

            {/* Fluted Column */}
            <mesh position={[0, 0.6, 0]} castShadow>
              <cylinderGeometry args={[0.28, 0.18, 0.9, 12]} />
              <meshStandardMaterial
                color="#E8ECEF"
                metalness={0.95}
                roughness={0.14}
                envMapIntensity={2.0}
              />
            </mesh>

            {/* Golden Crown Ribbon Spiral */}
            <mesh position={[0, 0.62, 0]}>
              <torusGeometry args={[0.29, 0.04, 16, 32]} />
              <meshStandardMaterial color="#FEBE10" metalness={0.95} roughness={0.15} />
            </mesh>
          </group>
        ) : (
          /* ========================================================
             DOMESTIC LEAGUE / CLUB TROPHIES (La Liga, Premier League, etc.)
             ======================================================== */
          <group>
            {/* Base Foot */}
            <mesh position={[0, 0.08, 0]}>
              <cylinderGeometry args={[0.25, 0.34, 0.16, 32]} />
              <meshStandardMaterial color="#0c0c0e" metalness={0.4} roughness={0.3} />
            </mesh>

            {/* Chalice Body */}
            <mesh position={[0, 0.55, 0]} castShadow>
              <cylinderGeometry args={[0.38, 0.15, 0.75, 32]} />
              <meshStandardMaterial
                color="#FEBE10"
                metalness={0.95}
                roughness={0.15}
                envMapIntensity={2.0}
              />
            </mesh>

            {/* Crown Rim */}
            <mesh position={[0, 0.92, 0]}>
              <torusGeometry args={[0.38, 0.03, 16, 32]} />
              <meshStandardMaterial color="#FFF" metalness={0.98} roughness={0.1} />
            </mesh>

            {/* Left curved handle */}
            <mesh position={[-0.38, 0.6, 0]} rotation={[0, 0, Math.PI / 4]}>
              <torusGeometry args={[0.18, 0.03, 16, 32, Math.PI]} />
              <meshStandardMaterial color="#FEBE10" metalness={0.9} roughness={0.2} />
            </mesh>

            {/* Right curved handle */}
            <mesh position={[0.38, 0.6, 0]} rotation={[0, 0, -Math.PI / 4]}>
              <torusGeometry args={[0.18, 0.03, 16, 32, Math.PI]} />
              <meshStandardMaterial color="#FEBE10" metalness={0.9} roughness={0.2} />
            </mesh>
          </group>
        )}
      </group>

      {/* 3. Glassmorphic 3D Tooltip */}
      {(hovered || isSelected) && (
        <Html
          position={[0, 2.5, 0]}
          center
          distanceFactor={11}
          style={{ pointerEvents: "none", userSelect: "none" }}
        >
          <div className="w-56 p-3 rounded-xl bg-black/85 backdrop-blur-xl border border-[#FEBE10]/60 shadow-[0_0_25px_rgba(254,190,16,0.35)] text-white text-center transform -translate-y-2 transition-all duration-300">
            {/* Top Multiplier Pill */}
            <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-[#FEBE10] text-black shadow-sm mb-1">
              <TrophyIcon className="w-2.5 h-2.5 fill-black" />
              <span>x{trophy.count} WON</span>
            </div>

            {/* Trophy Title */}
            <h4 className="text-xs font-black tracking-tight text-white line-clamp-1">
              {trophy.name}
            </h4>

            {/* Years snippet */}
            <p className="text-[10px] font-mono text-[#FEBE10] mt-0.5 line-clamp-1">
              {yearsList.slice(0, 4).join(", ")}
              {yearsList.length > 4 ? "..." : ""}
            </p>

            <div className="mt-2 pt-1.5 border-t border-zinc-800 flex items-center justify-between text-[9px] font-mono text-zinc-400">
              <span className="uppercase">{trophy.category || "Club"}</span>
              <span className="text-[#FEBE10] font-semibold">Click to Inspect</span>
            </div>
          </div>
        </Html>
      )}
    </group>
  );
}
