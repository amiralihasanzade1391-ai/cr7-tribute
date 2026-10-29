"use client";

import { useState, useEffect, useRef } from "react";
import {
  Settings,
  Globe,
  Sliders,
  Volume2,
  MousePointer,
  Sparkles,
  Download,
  Upload,
  AlertTriangle,
  Save,
  RefreshCw,
  Check,
  ShieldAlert,
  Share2,
  Eye,
  Flame,
  Bot,
  MessageSquare,
  Key,
  Send,
} from "lucide-react";
import { toast } from "@/components/admin/toast";

export default function AdminSettingsPage() {
  const [activeTab, setActiveTab] = useState<"general" | "sections" | "fx" | "maintenance" | "backup" | "ai">("general");
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isRestoring, setIsRestoring] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Test AI sandbox state
  const [testPrompt, setTestPrompt] = useState("Cristiano, how do you handle intense pressure?");
  const [testResult, setTestResult] = useState("");
  const [isTestingAi, setIsTestingAi] = useState(false);

  const [settings, setSettings] = useState<Record<string, string>>({
    site_title: "CR7 — The Official Cristiano Ronaldo Tribute Experience",
    site_description:
      "A cinematic, Awwwards-caliber digital monument honoring the all-time leading goalscorer and five-time Ballon d'Or champion.",
    site_keywords: "Cristiano Ronaldo, CR7, Real Madrid, Portugal, Manchester United, Juventus, Al Nassr, Ballon d'Or",
    og_image:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8c/Cristiano_Ronaldo_2018.jpg/500px-Cristiano_Ronaldo_2018.jpg",
    maintenance_mode: "false",
    announcement_banner: "Official 981 Career Goals Tally — The Road to 1,000",
    footer_text: "© 2026 CR7 Office. Built with dedication to the GOAT.",
    twitter_url: "https://twitter.com/cristiano",
    instagram_url: "https://instagram.com/cristiano",
    youtube_url: "https://youtube.com/@cristiano",

    // Section visibility toggles
    visibility_hero: "true",
    visibility_stats: "true",
    visibility_timeline: "true",
    visibility_moments: "true",
    visibility_trophies: "true",
    visibility_reel: "true",
    visibility_records: "true",
    visibility_timemachine: "true",
    visibility_quotes: "true",
    visibility_cyborg: "true",

    // Visual FX & Sound
    sound_fx: "true",
    background_audio: "true",
    cursor_effects: "true",
    canvas_particles: "true",

    // The GOAT AI Settings (Phase 11)
    gemini_api_key: "",
    cr7_system_prompt:
      "You are Cristiano Ronaldo (CR7). You are the greatest footballer of all time. You are highly confident, hardworking, and motivational. You refer to yourself in the third person occasionally (e.g., 'Cristiano works hard'). You love your fans and always mention 'Siuuu!' when appropriate. Keep answers short, energetic, and inspiring. Never break character.",
    chat_enabled: "true",
  });

  const loadSettings = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/settings");
      const data = await res.json();
      if (data.ok && data.settings) {
        setSettings((prev) => ({ ...prev, ...data.settings }));
      }
    } catch {
      toast.error("Failed to load settings");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSettings();
  }, []);

  const handleSaveSettings = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsSaving(true);
    try {
      const res = await fetch("/api/admin/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ settings }),
      });
      const data = await res.json();
      if (data.ok) {
        toast.success("Site configuration saved successfully!");
      } else {
        toast.error("Failed to save: " + data.error);
      }
    } catch {
      toast.error("Network error saving settings");
    } finally {
      setIsSaving(false);
    }
  };

  const toggleBoolean = (key: string) => {
    setSettings((prev) => ({
      ...prev,
      [key]: prev[key] === "true" ? "false" : "true",
    }));
  };

  const handleDownloadBackup = () => {
    window.open("/api/admin/export", "_blank");
    toast.success("Downloading database JSON snapshot...");
  };

  const handleRestoreBackup = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const file = files[0];
    setIsRestoring(true);

    try {
      const text = await file.text();
      const json = JSON.parse(text);

      const res = await fetch("/api/admin/import", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(json),
      });

      const data = await res.json();
      if (data.ok) {
        toast.success(`Successfully restored ${data.restored} records!`);
        loadSettings();
      } else {
        toast.error("Restore failed: " + data.error);
      }
    } catch (err) {
      toast.error("Invalid backup file");
    } finally {
      setIsRestoring(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleTestAi = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!testPrompt.trim()) return;
    setIsTestingAi(true);
    setTestResult("");
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: testPrompt, history: [] }),
      });
      const data = await res.json();
      if (data.ok && data.response) {
        setTestResult(data.response);
      } else {
        setTestResult("Error: " + (data.error || "Unable to reach Gemini API"));
      }
    } catch {
      setTestResult("Network error testing AI");
    } finally {
      setIsTestingAi(false);
    }
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            System & SEO Control Deck
            <span className="text-xs px-2 py-0.5 rounded font-mono bg-zinc-800 text-[#FEBE10] border border-zinc-700">
              Settings v2.5
            </span>
          </h2>
          <p className="text-xs text-zinc-400 mt-0.5">
            Configure metadata, section visibility, interactive audio/visual effects, and database vaults.
          </p>
        </div>

        <button
          onClick={() => handleSaveSettings()}
          disabled={isSaving}
          className="self-start sm:self-auto flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-lg bg-gradient-to-r from-[#FEBE10] to-[#e5ab0f] text-black hover:opacity-90 transition-all font-mono shadow-[0_0_15px_rgba(254,190,16,0.25)] disabled:opacity-50"
        >
          <Save className="w-3.5 h-3.5" />
          <span>{isSaving ? "Saving Config..." : "Save All Changes"}</span>
        </button>
      </div>

      {/* Tabs Strip */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 border-b border-zinc-800">
        {[
          { id: "general", label: "General & SEO", icon: Globe },
          { id: "ai", label: "The GOAT AI (Phase 11)", icon: Bot },
          { id: "sections", label: "Section Stager (Feature #4)", icon: Sliders },
          { id: "fx", label: "Audio & FX Lab (Feature #2 & #3)", icon: Volume2 },
          { id: "maintenance", label: "Maintenance Mode", icon: ShieldAlert },
          { id: "backup", label: "Database Vault (Feature #7)", icon: Download },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                isActive
                  ? "bg-[#FEBE10] text-black font-semibold shadow-sm"
                  : "text-zinc-400 hover:text-white hover:bg-zinc-850"
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab 1: General & SEO */}
      {activeTab === "general" && (
        <form onSubmit={handleSaveSettings} className="space-y-6">
          <div className="p-6 rounded-2xl bg-zinc-900/60 border border-zinc-800/80 space-y-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono flex items-center gap-2">
              <Globe className="w-4 h-4 text-[#FEBE10]" />
              Metadata & Search Optimization
            </h3>

            <div>
              <label className="block text-xs font-mono font-semibold text-zinc-300 mb-1">
                Site Title (Title Tag)
              </label>
              <input
                type="text"
                value={settings.site_title || ""}
                onChange={(e) => setSettings({ ...settings, site_title: e.target.value })}
                className="w-full px-3 py-2 bg-zinc-950 border border-zinc-700 rounded-lg text-xs text-white focus:outline-none focus:border-[#FEBE10]"
              />
            </div>

            <div>
              <label className="block text-xs font-mono font-semibold text-zinc-300 mb-1">
                Meta Description
              </label>
              <textarea
                rows={3}
                value={settings.site_description || ""}
                onChange={(e) => setSettings({ ...settings, site_description: e.target.value })}
                className="w-full px-3 py-2 bg-zinc-950 border border-zinc-700 rounded-lg text-xs text-white focus:outline-none focus:border-[#FEBE10]"
              />
            </div>

            <div>
              <label className="block text-xs font-mono font-semibold text-zinc-300 mb-1">
                Meta Keywords
              </label>
              <input
                type="text"
                value={settings.site_keywords || ""}
                onChange={(e) => setSettings({ ...settings, site_keywords: e.target.value })}
                className="w-full px-3 py-2 bg-zinc-950 border border-zinc-700 rounded-lg text-xs text-white focus:outline-none focus:border-[#FEBE10]"
              />
            </div>

            <div>
              <label className="block text-xs font-mono font-semibold text-zinc-300 mb-1">
                OpenGraph Share Image URL
              </label>
              <input
                type="url"
                value={settings.og_image || ""}
                onChange={(e) => setSettings({ ...settings, og_image: e.target.value })}
                className="w-full px-3 py-2 bg-zinc-950 border border-zinc-700 rounded-lg text-xs text-white focus:outline-none focus:border-[#FEBE10]"
              />
              {settings.og_image && (
                <div className="mt-2 p-2 rounded bg-zinc-950 border border-zinc-800 flex items-center gap-3">
                  <img
                    src={settings.og_image}
                    alt="OG Preview"
                    className="w-20 h-12 object-cover rounded"
                  />
                  <span className="text-[11px] text-zinc-400 font-mono">
                    OpenGraph social share preview card
                  </span>
                </div>
              )}
            </div>

            <div>
              <label className="block text-xs font-mono font-semibold text-zinc-300 mb-1">
                Global Announcement Banner
              </label>
              <input
                type="text"
                value={settings.announcement_banner || ""}
                onChange={(e) => setSettings({ ...settings, announcement_banner: e.target.value })}
                placeholder="Official 981 Career Goals Tally — The Road to 1,000"
                className="w-full px-3 py-2 bg-zinc-950 border border-zinc-700 rounded-lg text-xs text-white focus:outline-none focus:border-[#FEBE10]"
              />
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-zinc-900/60 border border-zinc-800/80 space-y-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono flex items-center gap-2">
              <Share2 className="w-4 h-4 text-[#FEBE10]" />
              Official Social Media Handles
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-mono text-zinc-300 mb-1">Twitter / X</label>
                <input
                  type="url"
                  value={settings.twitter_url || ""}
                  onChange={(e) => setSettings({ ...settings, twitter_url: e.target.value })}
                  className="w-full px-3 py-2 bg-zinc-950 border border-zinc-700 rounded-lg text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-zinc-300 mb-1">Instagram</label>
                <input
                  type="url"
                  value={settings.instagram_url || ""}
                  onChange={(e) => setSettings({ ...settings, instagram_url: e.target.value })}
                  className="w-full px-3 py-2 bg-zinc-950 border border-zinc-700 rounded-lg text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-zinc-300 mb-1">YouTube</label>
                <input
                  type="url"
                  value={settings.youtube_url || ""}
                  onChange={(e) => setSettings({ ...settings, youtube_url: e.target.value })}
                  className="w-full px-3 py-2 bg-zinc-950 border border-zinc-700 rounded-lg text-xs text-white"
                />
              </div>
            </div>
          </div>
        </form>
      )}

      {/* Tab: The GOAT AI Persona Configuration (Phase 11) */}
      {activeTab === "ai" && (
        <div className="space-y-6">
          <div className="p-6 rounded-2xl bg-zinc-900/60 border border-zinc-800/80 space-y-5">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
              <div>
                <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono flex items-center gap-2">
                  <Bot className="w-4 h-4 text-[#FEBE10]" />
                  The GOAT AI Persona Engine
                </h3>
                <p className="text-xs text-zinc-400 mt-1">
                  Powered by Google Gemini. Allows visitors to converse directly with an AI trained on Cristiano Ronaldo&apos;s mindset and speech patterns.
                </p>
              </div>

              {/* Chat Enable Switch */}
              <div className="flex items-center gap-3">
                <span className="text-xs font-mono text-zinc-300">Floating Chatbot:</span>
                <button
                  onClick={() => toggleBoolean("chat_enabled")}
                  className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                    settings.chat_enabled !== "false" ? "bg-[#FEBE10]" : "bg-zinc-800"
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-black shadow ring-0 transition duration-200 ease-in-out ${
                      settings.chat_enabled !== "false" ? "translate-x-5" : "translate-x-0 bg-zinc-400"
                    }`}
                  />
                </button>
              </div>
            </div>

            {/* Gemini API Key */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-mono font-semibold text-zinc-300">
                  Google Gemini API Key
                </label>
                <a
                  href="https://aistudio.google.com/app/apikey"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[11px] font-mono text-[#FEBE10] hover:underline flex items-center gap-1"
                >
                  Get a free Gemini API key ↗
                </a>
              </div>
              <div className="relative">
                <input
                  type="password"
                  placeholder="AIzaSy... (leave blank to use server environment variable or smart fallback)"
                  value={settings.gemini_api_key || ""}
                  onChange={(e) => setSettings({ ...settings, gemini_api_key: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-zinc-950 border border-zinc-700 rounded-lg text-xs font-mono text-white placeholder:text-zinc-600 focus:outline-none focus:border-[#FEBE10]"
                />
              </div>
              <p className="text-[11px] text-zinc-500 font-mono">
                Key is securely stored in your local SQLite database and never exposed to the client browser.
              </p>
            </div>

            {/* CR7 System Prompt */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-mono font-semibold text-zinc-300">
                  CR7 Persona System Prompt
                </label>
                <button
                  type="button"
                  onClick={() =>
                    setSettings({
                      ...settings,
                      cr7_system_prompt:
                        "You are Cristiano Ronaldo (CR7). You are the greatest footballer of all time. You are highly confident, hardworking, and motivational. You refer to yourself in the third person occasionally (e.g., 'Cristiano works hard'). You love your fans and always mention 'Siuuu!' when appropriate. Keep answers short, energetic, and inspiring. Never break character.",
                    })
                  }
                  className="text-[11px] font-mono text-zinc-400 hover:text-[#FEBE10] transition-colors"
                >
                  Reset to Default
                </button>
              </div>
              <textarea
                rows={4}
                value={settings.cr7_system_prompt || ""}
                onChange={(e) => setSettings({ ...settings, cr7_system_prompt: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-zinc-950 border border-zinc-700 rounded-lg text-xs font-mono text-white focus:outline-none focus:border-[#FEBE10] leading-relaxed"
              />
            </div>
          </div>

          {/* Persona Live Test Sandbox */}
          <div className="p-6 rounded-2xl bg-zinc-900/60 border border-zinc-800/80 space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white font-mono flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-[#FEBE10]" />
              Live Persona Sandbox Test
            </h4>

            <form onSubmit={handleTestAi} className="flex gap-2">
              <input
                type="text"
                placeholder="Ask Cristiano a test question..."
                value={testPrompt}
                onChange={(e) => setTestPrompt(e.target.value)}
                className="flex-1 px-3.5 py-2 bg-zinc-950 border border-zinc-700 rounded-lg text-xs text-white focus:outline-none focus:border-[#FEBE10]"
              />
              <button
                type="submit"
                disabled={isTestingAi}
                className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#FEBE10] text-black font-bold text-xs font-mono hover:opacity-90 disabled:opacity-50 transition-all shrink-0"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{isTestingAi ? "Thinking..." : "Send Test"}</span>
              </button>
            </form>

            {testResult && (
              <div className="p-4 rounded-xl bg-zinc-950 border border-[#FEBE10]/30 space-y-1.5 animate-in fade-in">
                <div className="flex items-center gap-2 text-[10px] font-mono text-[#FEBE10]">
                  <Flame className="w-3 h-3 fill-[#FEBE10]" />
                  <span>CR7 Persona Response:</span>
                </div>
                <p className="text-xs text-zinc-200 leading-relaxed font-sans">
                  {testResult}
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tab 2: Feature #4 - Section Stager & Visibility */}
      {activeTab === "sections" && (
        <div className="p-6 rounded-2xl bg-zinc-900/60 border border-zinc-800/80 space-y-5">
          <div>
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono flex items-center gap-2">
                <Sliders className="w-4 h-4 text-[#FEBE10]" />
                Section Visibility Stager
              </h3>
              <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                Feature #4 Active
              </span>
            </div>
            <p className="text-xs text-zinc-400 mt-1">
              Toggle public site sections on or off in real time without code deployment.
            </p>
          </div>

          <div className="space-y-3">
            {[
              { key: "visibility_hero", label: "Hero Kinetic Reveal Section", desc: "100vh full-screen cinematic intro with 3D typography" },
              { key: "visibility_stats", label: "Live Stats & Road to 1,000 Goals Counter", desc: "Interactive career metrics and 981 goals odometer" },
              { key: "visibility_timeline", label: "Career Timeline & Eras Stream", desc: "Horizontal scroll pinned journey from Sporting to Al Nassr" },
              { key: "visibility_moments", label: "Iconic Moments Gallery", desc: "3D tilt masonry cards with verified photos and video reels" },
              { key: "visibility_trophies", label: "Trophy Cabinet & Silverware", desc: "Gold/Silver major trophies and individual honors showcase" },
              { key: "visibility_reel", label: "Goal Reel (Legendary Strikes)", desc: "Highlight carousel of top goals" },
              { key: "visibility_records", label: "The Record Vault", desc: "All-time UCL, international, and historic scoring records" },
              { key: "visibility_timemachine", label: "The CR7 Time Machine", desc: "Interactive 2002 to 2026 year-by-year journey slider" },
              { key: "visibility_quotes", label: "King's Quotes & Mindset", desc: "Iconic quotes on dedication, resilience, and mentality" },
              { key: "visibility_cyborg", label: "The Cyborg Lab", desc: "Superhuman biometric telemetry and athletic analytics" },
            ].map((sec) => {
              const isEnabled = settings[sec.key] !== "false";
              return (
                <div
                  key={sec.key}
                  className="flex items-center justify-between p-4 rounded-xl bg-zinc-950/70 border border-zinc-800/80 hover:border-zinc-700 transition-colors"
                >
                  <div>
                    <h4 className="text-xs font-bold text-white font-mono">{sec.label}</h4>
                    <p className="text-[11px] text-zinc-400 mt-0.5">{sec.desc}</p>
                  </div>

                  <button
                    onClick={() => toggleBoolean(sec.key)}
                    className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                      isEnabled ? "bg-[#FEBE10]" : "bg-zinc-800"
                    }`}
                  >
                    <span
                      className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-black shadow ring-0 transition duration-200 ease-in-out ${
                        isEnabled ? "translate-x-5" : "translate-x-0 bg-zinc-400"
                      }`}
                    />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Tab 3: Feature #2 & #3 - Audio & FX Lab */}
      {activeTab === "fx" && (
        <div className="p-6 rounded-2xl bg-zinc-900/60 border border-zinc-800/80 space-y-5">
          <div>
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono flex items-center gap-2">
                <Volume2 className="w-4 h-4 text-[#FEBE10]" />
                Audio & Visual FX Lab Manager
              </h3>
              <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                Features #2 & #3 Active
              </span>
            </div>
            <p className="text-xs text-zinc-400 mt-1">
              Control dynamic SIUUU stadium acoustic effects, ambient music, custom cursor physics, and particle layers.
            </p>
          </div>

          <div className="space-y-3">
            {[
              {
                key: "sound_fx",
                label: "SIUUU & Stadium Sound FX (Feature #2)",
                desc: "Play authentic Santiago Bernabéu SIUUU cheer on interactive clicks and goals",
                icon: Volume2,
              },
              {
                key: "background_audio",
                label: "Cinematic Ambient Soundtrack",
                desc: "Background motivational orchestration with volume controller in bottom corner",
                icon: Volume2,
              },
              {
                key: "cursor_effects",
                label: "Spring Physics Custom Cursor (Feature #3)",
                desc: "Golden halo cursor with magnetic snap and velocity trail",
                icon: MousePointer,
              },
              {
                key: "canvas_particles",
                label: "Gold Cyberpunk Canvas Particles",
                desc: "Interactive floating particle mesh reacting to mouse movement",
                icon: Sparkles,
              },
            ].map((item) => {
              const isEnabled = settings[item.key] !== "false";
              const Icon = item.icon;
              return (
                <div
                  key={item.key}
                  className="flex items-center justify-between p-4 rounded-xl bg-zinc-950/70 border border-zinc-800/80 hover:border-zinc-700 transition-colors"
                >
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-zinc-800 text-[#FEBE10]">
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-white font-mono">{item.label}</h4>
                      <p className="text-[11px] text-zinc-400 mt-0.5">{item.desc}</p>
                    </div>
                  </div>

                  <button
                    onClick={() => toggleBoolean(item.key)}
                    className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                      isEnabled ? "bg-[#FEBE10]" : "bg-zinc-800"
                    }`}
                  >
                    <span
                      className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-black shadow ring-0 transition duration-200 ease-in-out ${
                        isEnabled ? "translate-x-5" : "translate-x-0 bg-zinc-400"
                      }`}
                    />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Tab 4: Maintenance Mode */}
      {activeTab === "maintenance" && (
        <div className="p-6 rounded-2xl bg-zinc-900/60 border border-zinc-800/80 space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-rose-400" />
                Emergency Maintenance Mode
              </h3>
              <p className="text-xs text-zinc-400 mt-1">
                When active, visitors see the cinematic &quot;Under Maintenance — The King Will Return&quot; splash. Admin panel remains accessible.
              </p>
            </div>

            <button
              onClick={() => toggleBoolean("maintenance_mode")}
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                settings.maintenance_mode === "true" ? "bg-rose-500" : "bg-zinc-800"
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-black shadow ring-0 transition duration-200 ease-in-out ${
                  settings.maintenance_mode === "true" ? "translate-x-5 bg-white" : "translate-x-0 bg-zinc-400"
                }`}
              />
            </button>
          </div>

          {/* Maintenance Screen Live Preview */}
          <div className="border border-zinc-800 rounded-xl p-8 bg-zinc-950 text-center space-y-3 relative overflow-hidden">
            <div className="inline-flex p-3 rounded-full bg-[#FEBE10]/10 border border-[#FEBE10]/30 text-[#FEBE10]">
              <Flame className="w-8 h-8 fill-[#FEBE10]" />
            </div>
            <h4 className="text-xl font-black text-white">UNDER MAINTENANCE</h4>
            <p className="text-xs text-zinc-400 max-w-md mx-auto">
              The CR7 Tribute platform is currently receiving a performance tune-up. The King will return shortly.
            </p>
            <div className="pt-2">
              <span className="text-[10px] font-mono text-[#FEBE10] bg-[#FEBE10]/15 px-3 py-1 rounded-full border border-[#FEBE10]/30">
                Status: {settings.maintenance_mode === "true" ? "MAINTENANCE ACTIVE" : "ONLINE / PUBLIC"}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Tab 5: Feature #7 - Database Vault & Backup */}
      {activeTab === "backup" && (
        <div className="p-6 rounded-2xl bg-zinc-900/60 border border-zinc-800/80 space-y-6">
          <div>
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono flex items-center gap-2">
                <Download className="w-4 h-4 text-[#FEBE10]" />
                Database Snapshot & Backup Vault
              </h3>
              <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                Feature #7 Active
              </span>
            </div>
            <p className="text-xs text-zinc-400 mt-1">
              Export complete JSON snapshots of all silverware, moments, career chapters, media, and settings.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Download Snapshot */}
            <div className="p-5 rounded-xl bg-zinc-950 border border-zinc-800 space-y-3 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 text-white font-bold text-sm">
                  <Download className="w-4 h-4 text-[#FEBE10]" />
                  <span>Download Snapshot</span>
                </div>
                <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
                  Generates an immutable JSON archive of SQLite tables for cold storage or migration.
                </p>
              </div>

              <button
                onClick={handleDownloadBackup}
                className="w-full py-2.5 px-4 rounded-lg bg-zinc-850 hover:bg-zinc-800 text-white font-mono text-xs font-bold border border-zinc-700 flex items-center justify-center gap-2 transition-colors"
              >
                <Download className="w-3.5 h-3.5 text-[#FEBE10]" />
                <span>Export cr7-backup.json</span>
              </button>
            </div>

            {/* Restore from Snapshot */}
            <div className="p-5 rounded-xl bg-zinc-950 border border-zinc-800 space-y-3 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 text-white font-bold text-sm">
                  <Upload className="w-4 h-4 text-emerald-400" />
                  <span>Restore from Backup</span>
                </div>
                <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
                  Upload an existing JSON backup to restore all trophies, moments, and configurations.
                </p>
              </div>

              <div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".json"
                  className="hidden"
                  onChange={(e) => handleRestoreBackup(e.target.files)}
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isRestoring}
                  className="w-full py-2.5 px-4 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 font-mono text-xs font-bold border border-emerald-500/30 flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>{isRestoring ? "Restoring..." : "Upload & Restore JSON"}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
