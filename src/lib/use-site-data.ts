"use client";
import { useState, useEffect } from "react";
import { ERAS_DATA } from "@/data/eras";
import { MOMENTS_DATA } from "@/data/moments";

export interface SiteOverrides {
  eras: Record<string, any>;
  moments: Record<string, any>;
}

const KEY = "cr7_overrides_v1";

export function useSiteData() {
  const [overrides, setOverrides] = useState<SiteOverrides>({ eras: {}, moments: {} });

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/overrides");
        const data = await res.json();
        setOverrides(data);
      } catch {
        try {
          const s = localStorage.getItem(KEY);
          if (s) setOverrides(JSON.parse(s));
        } catch {}
      }
    })();
  }, []);

  const save = (o: SiteOverrides) => {
    localStorage.setItem(KEY, JSON.stringify(o));
    setOverrides(o);
    window.dispatchEvent(new Event("cr7-update"));
  };

  const publish = async () => {
    const res = await fetch("/api/overrides", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(overrides),
    });
    if (!res.ok) throw new Error("Publish failed");
  };

  const reset = () => {
    localStorage.removeItem(KEY);
    setOverrides({ eras: {}, moments: {} });
    window.dispatchEvent(new Event("cr7-update"));
  };

  const eras = ERAS_DATA.map((e: any) => ({
    ...e,
    ...overrides.eras[e.id],
    heroImages:
      overrides.eras[e.id]?.heroImages ||
      e.heroImages ||
      (e.heroImage ? [e.heroImage] : []),
  }));

  const moments = MOMENTS_DATA.map((m: any) => ({ ...m, ...overrides.moments[m.id] }));

  return { eras, moments, overrides, save, reset, publish };
}
