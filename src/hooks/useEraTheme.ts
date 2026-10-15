"use client";

import { useEffect, useState, useCallback } from "react";
import { ERAS_DATA } from "@/data/eras";
import { Era } from "@/types/era";
import { soundFx } from "@/lib/utils";

export function useEraTheme(defaultEraId: string = "real-madrid") {
  const [activeEra, setActiveEra] = useState<Era>(() => {
    return ERAS_DATA.find((e) => e.id === defaultEraId) || ERAS_DATA[2];
  });

  const applyTheme = useCallback((era: Era, playSound: boolean = false) => {
    if (typeof document === "undefined") return;

    const root = document.documentElement;
    const body = document.body;

    // Apply smooth CSS transitions with safe fallbacks
    body.style.setProperty("--primary", era.colors.primary || "#FEBE10");
    body.style.setProperty("--accent", era.colors.accent || "#FFFFFF");
    body.style.setProperty("--bg", era.colors.bg || "#0D0B05");
    body.style.setProperty("--text", era.colors.text || "#FFFFFF");
    body.style.setProperty("--card-bg", era.colors.cardBg || "rgba(254, 190, 16, 0.08)");
    body.style.setProperty("--border-color", era.colors.borderColor || "rgba(254, 190, 16, 0.3)");

    root.setAttribute("data-era", era.id);

    if (playSound) {
      soundFx.playTransition();
    }
  }, []);

  const switchEra = useCallback((eraId: string, playSound: boolean = true) => {
    const target = ERAS_DATA.find((e) => e.id === eraId);
    if (!target) return;
    setActiveEra(target);
    applyTheme(target, playSound);
  }, [applyTheme]);

  const switchEraByIndex = useCallback((index: number, playSound: boolean = true) => {
    const clampedIndex = Math.max(0, Math.min(index, ERAS_DATA.length - 1));
    const target = ERAS_DATA[clampedIndex];
    if (!target) return;
    setActiveEra(target);
    applyTheme(target, playSound);
  }, [applyTheme]);

  useEffect(() => {
    applyTheme(activeEra, false);
  }, [activeEra, applyTheme]);

  return {
    activeEra,
    eras: ERAS_DATA,
    switchEra,
    switchEraByIndex,
  };
}
