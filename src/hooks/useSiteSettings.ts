"use client";

import { useState, useEffect } from "react";

export interface SiteSettingsMap {
  site_title?: string;
  site_description?: string;
  site_keywords?: string;
  og_image?: string;
  maintenance_mode?: string;
  announcement_banner?: string;
  footer_text?: string;
  twitter_url?: string;
  instagram_url?: string;
  youtube_url?: string;
  visibility_hero?: string;
  visibility_stats?: string;
  visibility_timeline?: string;
  visibility_moments?: string;
  visibility_trophies?: string;
  visibility_reel?: string;
  visibility_cyborg?: string;
  sound_fx?: string;
  background_audio?: string;
  cursor_effects?: string;
  canvas_particles?: string;
  [key: string]: string | undefined;
}

const DEFAULT_SETTINGS: SiteSettingsMap = {
  site_title: "CR7 — The Official Cristiano Ronaldo Tribute Experience",
  maintenance_mode: "false",
  announcement_banner: "Official 981 Career Goals Tally — The Road to 1,000",
  visibility_hero: "true",
  visibility_stats: "true",
  visibility_timeline: "true",
  visibility_moments: "true",
  visibility_trophies: "true",
  visibility_reel: "true",
  visibility_cyborg: "true",
  sound_fx: "true",
  background_audio: "true",
  cursor_effects: "true",
  canvas_particles: "true",
};

export function useSiteSettings() {
  const [settings, setSettings] = useState<SiteSettingsMap>(DEFAULT_SETTINGS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    const fetchSettings = async () => {
      try {
        const res = await fetch("/api/admin/settings");
        if (!res.ok) return;
        const data = await res.json();
        if (mounted && data.ok && data.settings) {
          setSettings((prev) => ({ ...prev, ...data.settings }));
        }
      } catch (err) {
        // Fallback gracefully to default settings
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchSettings();
    return () => {
      mounted = false;
    };
  }, []);

  const isSectionVisible = (key: string) => {
    return settings[`visibility_${key}`] !== "false";
  };

  const isMaintenance = settings.maintenance_mode === "true";
  const soundEnabled = settings.sound_fx !== "false";
  const cursorEnabled = settings.cursor_effects !== "false";
  const particlesEnabled = settings.canvas_particles !== "false";

  return {
    settings,
    loading,
    isMaintenance,
    isSectionVisible,
    soundEnabled,
    cursorEnabled,
    particlesEnabled,
  };
}
