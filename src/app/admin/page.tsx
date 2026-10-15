"use client";

import React, { useState, useEffect, useRef } from "react";
import { useSiteData, SiteOverrides } from "@/lib/use-site-data";
import { Save, RotateCcw, Plus, Trash2, Lock, Check, AlertCircle, Upload, Globe, RefreshCw } from "lucide-react";
import { ColorPicker } from "@/components/admin/color-picker";
import { toast, ToastContainer } from "@/components/admin/toast";
import { SortableList } from "@/components/admin/sortable-list";

export default function AdminPage() {
  const [password, setPassword] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authError, setAuthError] = useState(false);
  const [activeTab, setActiveTab] = useState<"eras" | "moments">("eras");
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [activePreview, setActivePreview] = useState<string | null>(null);

  const uploadFile = async (file: File, folder: string, onSuccess: (url: string) => void) => {
    const fd = new FormData();
    fd.append("file", file);
    fd.append("folder", folder);
    const res = await fetch("/api/upload", { method: "POST", body: fd });
    const data = await res.json();
    if (data.url) onSuccess(data.url);
  };

  const { eras, moments, overrides, save, reset, publish } = useSiteData();
  const [localEras, setLocalEras] = useState<any[]>([]);
  const [localMoments, setLocalMoments] = useState<any[]>([]);

  const updateNestedEra = (eraId: string, path: string, value: any) => {
    setLocalEras((prev) =>
      prev.map((era) => {
        if (era.id !== eraId) return era;
        const updated = JSON.parse(JSON.stringify(era));
        const keys = path.split(".");
        let obj: any = updated;
        for (let i = 0; i < keys.length - 1; i++) {
          obj[keys[i]] = obj[keys[i]] || {};
          obj = obj[keys[i]];
        }
        obj[keys[keys.length - 1]] = value;
        return updated;
      })
    );
  };

  const getOverridesDraft = (): SiteOverrides => {
    const overrides: SiteOverrides = { eras: {}, moments: {} };
    localEras.forEach((era) => {
      overrides.eras[era.id] = {
        heroImages: era.heroImages || [],
        tagline: era.tagline || "",
        objectPosition: era.objectPosition || 25,
        quote: era.quote,
        colors: era.colors,
        kitNumber: era.kitNumber,
        period: era.period,
        startYear: era.startYear,
        endYear: era.endYear,
        keyStats: era.keyStats,
      };
    });
    localMoments.forEach((moment) => {
      overrides.moments[moment.id] = {
        title: moment.title || "",
        image: moment.image || "",
        videoId: moment.videoId || "",
        objectPosition: moment.objectPosition || 25,
      };
    });
    return overrides;
  };

  const handlePublish = async () => {
    try {
      const draft = getOverridesDraft();
      save(draft);
      const res = await fetch("/api/overrides", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(draft),
      });
      if (res.ok) {
        toast.success("Published!");
      } else {
        toast.error("Publish failed");
      }
    } catch (e: any) {
      toast.error("Publish error: " + e.message);
    }
  };

  const handleReloadFromServer = async () => {
    try {
      const res = await fetch("/api/overrides");
      const data = await res.json();
      save(data);
      setLocalEras([]);
      setLocalMoments([]);
      toast.success("Reloaded from server!");
    } catch {
      toast.error("Failed to reload overrides from server");
    }
  };

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "s") {
        e.preventDefault();
        const draft = getOverridesDraft();
        save(draft);
        toast.success("Saved!");
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [localEras, localMoments]);

  useEffect(() => {
    if (eras.length > 0 && localEras.length === 0) {
      setLocalEras(eras);
    }
  }, [eras, localEras.length]);

  useEffect(() => {
    if (moments.length > 0 && localMoments.length === 0) {
      setLocalMoments(moments);
    }
  }, [moments, localMoments.length]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === "cr7admin2026") {
      setIsAuthenticated(true);
      setAuthError(false);
    } else {
      setAuthError(true);
    }
  };

  const handleSaveAll = () => {
    const overrides: SiteOverrides = {
      eras: {},
      moments: {},
    };

    localEras.forEach((era) => {
      overrides.eras[era.id] = {
        heroImages: era.heroImages || [],
        tagline: era.tagline || "",
        objectPosition: era.objectPosition || 25,
        quote: era.quote,
      };
    });

    localMoments.forEach((moment) => {
      overrides.moments[moment.id] = {
        title: moment.title || "",
        image: moment.image || "",
        videoId: moment.videoId || "",
        objectPosition: moment.objectPosition || 25,
      };
    });

    save(overrides);
    setSavedSuccess(true);
    toast.success("Saved all changes!");
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleReset = () => {
    if (window.confirm("Reset all customizations back to factory defaults?")) {
      reset();
      setLocalEras([]);
      setLocalMoments([]);
      setSavedSuccess(true);
      toast.success("Reset to defaults!");
      setTimeout(() => setSavedSuccess(false), 3000);
    }
  };

  // Era helpers
  const handleEraChange = (index: number, field: string, value: any) => {
    setLocalEras((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  const handleEraImageChange = (eraIdx: number, imgIdx: number, val: string) => {
    setLocalEras((prev) => {
      const updated = [...prev];
      const images = [...(updated[eraIdx].heroImages || [])];
      images[imgIdx] = val;
      updated[eraIdx] = { ...updated[eraIdx], heroImages: images };
      return updated;
    });
  };

  const handleAddEraImage = (eraIdx: number) => {
    setLocalEras((prev) => {
      const updated = [...prev];
      const images = [...(updated[eraIdx].heroImages || []), ""];
      updated[eraIdx] = { ...updated[eraIdx], heroImages: images };
      return updated;
    });
  };

  const handleRemoveEraImage = (eraIdx: number, imgIdx: number) => {
    setLocalEras((prev) => {
      const updated = [...prev];
      const images = [...(updated[eraIdx].heroImages || [])];
      images.splice(imgIdx, 1);
      updated[eraIdx] = { ...updated[eraIdx], heroImages: images };
      return updated;
    });
  };

  // Moment helpers
  const handleMomentChange = (index: number, field: string, value: any) => {
    setLocalMoments((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  const updateMoment = (momentId: string, field: string, value: any) => {
    setLocalMoments((prev) =>
      prev.map((m) => (m.id === momentId ? { ...m, [field]: value } : m))
    );
  };

  if (!isAuthenticated) {
    return (
      <main className="min-h-screen bg-black text-white flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-2xl p-8 shadow-2xl">
          <div className="flex items-center justify-center mb-6">
            <div className="w-14 h-14 rounded-full bg-yellow-500/10 border border-yellow-500/30 flex items-center justify-center text-yellow-400">
              <Lock className="w-7 h-7" />
            </div>
          </div>

          <h1 className="text-2xl font-bold text-center tracking-tight text-white mb-2 font-anton uppercase">
            CR7 Admin Access
          </h1>
          <p className="text-sm text-zinc-400 text-center mb-6">
            Enter administrative credentials to manage timeline & moments
          </p>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setAuthError(false);
                }}
                className="w-full px-4 py-3 bg-zinc-950 border border-zinc-800 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:border-yellow-400 transition"
              />
            </div>

            {authError && (
              <div className="flex items-center space-x-2 text-red-400 text-sm bg-red-950/40 border border-red-900/50 p-3 rounded-lg">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>Incorrect password. Please try again.</span>
              </div>
            )}

            <button
              type="submit"
              className="w-full py-3 bg-yellow-500 hover:bg-yellow-400 text-black font-semibold rounded-xl transition duration-200 shadow-lg shadow-yellow-500/20"
            >
              Authenticate
            </button>
          </form>
        </div>
      </main>
    );
  }

  const selectedEra = localEras.find((e) => e.id === activePreview) || null;
  const selectedMoment = localMoments.find((m) => m.id === activePreview) || null;

  return (
    <main className="min-h-screen bg-black text-white p-4 sm:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Top Header */}
        <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-zinc-900 border border-zinc-800 p-6 rounded-2xl">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-yellow-400 font-anton uppercase">
              CR7 Admin Panel
            </h1>
            <p className="text-sm text-zinc-400 mt-1">
              Live customizer for Eras timeline and Iconic Moments gallery
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <button
              onClick={handleReloadFromServer}
              className="flex items-center space-x-2 px-3.5 py-2.5 rounded-xl border border-zinc-700 bg-zinc-800/80 hover:bg-zinc-700 text-zinc-200 transition text-sm font-medium"
              title="Reload from Server"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Reload from Server</span>
            </button>

            <button
              onClick={handleReset}
              className="flex items-center space-x-2 px-3.5 py-2.5 rounded-xl border border-zinc-700 bg-zinc-800/80 hover:bg-zinc-700 text-zinc-200 transition text-sm font-medium"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Reset</span>
            </button>

            <button
              onClick={handleSaveAll}
              className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-zinc-700 hover:bg-zinc-600 text-white font-semibold transition text-sm"
            >
              <Save className="w-4 h-4" />
              <span>Save All</span>
            </button>

            <button
              onClick={handlePublish}
              className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-yellow-500 hover:bg-yellow-400 text-black font-semibold transition text-sm shadow-lg shadow-yellow-500/20"
            >
              <Globe className="w-4 h-4" />
              <span>Publish to Server</span>
            </button>
          </div>
        </header>

        {savedSuccess && (
          <div className="flex items-center space-x-2 bg-yellow-500/10 border border-yellow-500/30 text-yellow-400 p-4 rounded-xl text-sm font-medium">
            <Check className="w-5 h-5 shrink-0" />
            <span>Changes successfully written to local overrides!</span>
          </div>
        )}

        {/* Tab Switcher */}
        <div className="flex space-x-2 border-b border-zinc-800 pb-2">
          <button
            onClick={() => setActiveTab("eras")}
            className={`px-6 py-2.5 rounded-xl font-semibold text-sm transition ${
              activeTab === "eras"
                ? "bg-yellow-500 text-black shadow-md shadow-yellow-500/20"
                : "bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800"
            }`}
          >
            Eras ({localEras.length})
          </button>
          <button
            onClick={() => setActiveTab("moments")}
            className={`px-6 py-2.5 rounded-xl font-semibold text-sm transition ${
              activeTab === "moments"
                ? "bg-yellow-500 text-black shadow-md shadow-yellow-500/20"
                : "bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800"
            }`}
          >
            Moments ({localMoments.length})
          </button>
        </div>

        {/* Main 2-Column Split: Form (60%) & Sticky Live Preview (40%) */}
        <div className="flex flex-col lg:flex-row gap-8 items-start">
          {/* Left Column: Form Controls (60%) */}
          <div className="w-full lg:w-[60%] space-y-6">
            {/* Eras Section */}
            {activeTab === "eras" && (
              <section className="space-y-6">
                {localEras.map((era, eraIdx) => {
                  const currentPos = era.objectPosition ?? 25;
                  const images: string[] = era.heroImages || [];
                  const isSelected = activePreview === era.id;

                  return (
                    <div
                      key={era.id || eraIdx}
                      className={`bg-zinc-900 border ${
                        isSelected
                          ? "border-yellow-400 ring-2 ring-yellow-400/30"
                          : "border-zinc-800 hover:border-zinc-700"
                      } rounded-2xl p-6 space-y-5 transition`}
                    >
                      <div
                        className="flex items-center justify-between border-b border-zinc-800/80 pb-4 cursor-pointer"
                        onClick={() => setActivePreview(era.id)}
                      >
                    <div className="flex items-center space-x-4">
                      {images[0] && (
                        <img
                          src={images[0]}
                          alt={era.club}
                          className="w-20 h-20 object-cover rounded-lg border border-zinc-700 shrink-0"
                          style={{
                            objectPosition:
                              typeof currentPos === "number"
                                ? `center ${currentPos}%`
                                : currentPos,
                          }}
                        />
                      )}
                      <div>
                        <h2 className="text-xl font-bold text-white flex items-center space-x-2">
                          <span className="text-yellow-400 font-mono text-sm bg-yellow-400/10 px-2 py-0.5 rounded">
                            0{eraIdx + 1}
                          </span>
                          <span>{era.club}</span>
                        </h2>
                        <span className="text-xs text-zinc-400">{era.period}</span>
                      </div>
                    </div>
                  </div>

                  {/* Image List */}
                  <div className="space-y-3">
                    <label className="text-xs font-semibold tracking-wider uppercase text-zinc-400 block">
                      Slideshow Images ({images.length})
                    </label>

                    <SortableList
                      items={images}
                      onReorder={(newImages) => handleEraChange(eraIdx, "heroImages", newImages)}
                      renderItem={(img, idx) => (
                        <div className="flex gap-2 w-full">
                          <input
                            type="text"
                            value={img}
                            onChange={(e) => {
                              const newImages = [...images];
                              newImages[idx] = e.target.value;
                              handleEraChange(eraIdx, "heroImages", newImages);
                            }}
                            className="flex-1 p-2 rounded-lg bg-black border border-zinc-700 text-white text-sm"
                          />
                          <label className="cursor-pointer bg-yellow-600 px-3 rounded-lg flex items-center">
                            <Upload size={16} />
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) uploadFile(file, "eras", (url) => {
                                  const newImages = [...images];
                                  newImages[idx] = url;
                                  handleEraChange(eraIdx, "heroImages", newImages);
                                });
                              }}
                            />
                          </label>
                          <button
                            type="button"
                            onClick={() => {
                              const newImages = images.filter((_, i) => i !== idx);
                              handleEraChange(eraIdx, "heroImages", newImages);
                            }}
                            className="bg-red-600 px-3 rounded-lg hover:bg-red-500 text-white transition flex items-center justify-center"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      )}
                    />

                    <button
                      type="button"
                      onClick={() => handleAddEraImage(eraIdx)}
                      className="inline-flex items-center space-x-1.5 text-xs font-semibold text-yellow-400 hover:text-yellow-300 py-1.5"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add Image URL</span>
                    </button>
                  </div>

                  {/* Object Position Slider */}
                  <div className="space-y-2">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-semibold tracking-wider uppercase text-zinc-400">
                        Image Vertical Focus (Object Position Y)
                      </span>
                      <span className="font-mono text-yellow-400 font-bold">
                        {currentPos}%
                      </span>
                    </div>
                    <input
                      type="range"
                      min={0}
                      max={100}
                      value={currentPos}
                      onChange={(e) =>
                        handleEraChange(eraIdx, "objectPosition", Number(e.target.value))
                      }
                      className="w-full accent-yellow-400 cursor-pointer"
                    />
                    <div className="flex justify-between text-[10px] text-zinc-500">
                      <span>0% (Top)</span>
                      <span>25% (Ronaldo Upper Body)</span>
                      <span>50% (Center)</span>
                      <span>100% (Bottom)</span>
                    </div>
                  </div>

                  {/* Tagline */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold tracking-wider uppercase text-zinc-400 block">
                      Era Tagline
                    </label>
                    <input
                      type="text"
                      value={era.tagline || ""}
                      onChange={(e) =>
                        handleEraChange(eraIdx, "tagline", e.target.value)
                      }
                      className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-sm text-zinc-200 focus:outline-none focus:border-yellow-400"
                    />
                  </div>

                  {/* Quote */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold tracking-wider uppercase text-zinc-400 block">
                      Era Quote
                    </label>
                    <textarea
                      rows={2}
                      value={era.quote?.text || ""}
                      onChange={(e) =>
                        handleEraChange(eraIdx, "quote", {
                          ...era.quote,
                          text: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-sm text-zinc-200 focus:outline-none focus:border-yellow-400"
                    />
                  </div>

                  {/* Kit & Period Section */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 border-t border-zinc-800/80 pt-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold tracking-wider uppercase text-zinc-400 block">
                        Kit Number
                      </label>
                      <input
                        type="text"
                        value={era.kitNumber || ""}
                        onChange={(e) =>
                          handleEraChange(eraIdx, "kitNumber", e.target.value)
                        }
                        placeholder="#7"
                        className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-sm text-zinc-200 focus:outline-none focus:border-yellow-400"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold tracking-wider uppercase text-zinc-400 block">
                        Start Year
                      </label>
                      <input
                        type="number"
                        value={era.startYear || 2003}
                        onChange={(e) => {
                          const startYear = Number(e.target.value);
                          const endYear = era.endYear || startYear;
                          handleEraChange(eraIdx, "startYear", startYear);
                          handleEraChange(
                            eraIdx,
                            "period",
                            `${startYear} — ${endYear}`
                          );
                        }}
                        className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-sm text-zinc-200 focus:outline-none focus:border-yellow-400"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold tracking-wider uppercase text-zinc-400 block">
                        End Year
                      </label>
                      <input
                        type="number"
                        value={era.endYear || 2009}
                        onChange={(e) => {
                          const endYear = Number(e.target.value);
                          const startYear = era.startYear || 2003;
                          handleEraChange(eraIdx, "endYear", endYear);
                          handleEraChange(
                            eraIdx,
                            "period",
                            `${startYear} — ${endYear}`
                          );
                        }}
                        className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-sm text-zinc-200 focus:outline-none focus:border-yellow-400"
                      />
                    </div>
                  </div>

                  {/* Colors Section */}
                  <div className="space-y-3 border-t border-zinc-800/80 pt-4">
                    <label className="text-xs font-semibold tracking-wider uppercase text-zinc-400 block">
                      Era Colors Palette
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                      <ColorPicker
                        label="Primary"
                        value={era.colors?.primary || "#DA291C"}
                        onChange={(c) => updateNestedEra(era.id, "colors.primary", c)}
                      />
                      <ColorPicker
                        label="Accent"
                        value={era.colors?.accent || "#FBE122"}
                        onChange={(c) => updateNestedEra(era.id, "colors.accent", c)}
                      />
                      <ColorPicker
                        label="Background"
                        value={era.colors?.bg || "#150405"}
                        onChange={(c) => updateNestedEra(era.id, "colors.bg", c)}
                      />
                      <ColorPicker
                        label="Text"
                        value={era.colors?.text || "#FFFFFF"}
                        onChange={(c) => updateNestedEra(era.id, "colors.text", c)}
                      />
                      <ColorPicker
                        label="Card BG"
                        value={era.colors?.cardBg || "rgba(218, 41, 28, 0.1)"}
                        onChange={(c) => updateNestedEra(era.id, "colors.cardBg", c)}
                      />
                    </div>
                  </div>

                  {/* Stats Editor Section */}
                  <div className="space-y-3 border-t border-zinc-800/80 pt-4">
                    <div className="flex justify-between items-center">
                      <label className="text-xs font-semibold tracking-wider uppercase text-zinc-400 block">
                        Key Stats ({era.keyStats?.length || 0})
                      </label>
                      <button
                        type="button"
                        onClick={() => {
                          const updatedStats = [
                            ...(era.keyStats || []),
                            { label: "New Stat", value: "0", suffix: "" },
                          ];
                          handleEraChange(eraIdx, "keyStats", updatedStats);
                        }}
                        className="inline-flex items-center space-x-1 text-xs text-yellow-400 hover:text-yellow-300 font-semibold"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Add Stat</span>
                      </button>
                    </div>

                    <div className="space-y-2">
                      {(era.keyStats || []).map((st: any, stIdx: number) => (
                        <div key={stIdx} className="flex items-center space-x-2">
                          <input
                            type="text"
                            value={st.value ?? ""}
                            onChange={(e) => {
                              const newStats = [...(era.keyStats || [])];
                              newStats[stIdx] = { ...newStats[stIdx], value: e.target.value };
                              handleEraChange(eraIdx, "keyStats", newStats);
                            }}
                            placeholder="Value"
                            className="w-24 px-3 py-1.5 bg-zinc-950 border border-zinc-800 rounded-xl text-xs text-zinc-200 focus:outline-none focus:border-yellow-400"
                          />
                          <input
                            type="text"
                            value={st.suffix ?? ""}
                            onChange={(e) => {
                              const newStats = [...(era.keyStats || [])];
                              newStats[stIdx] = { ...newStats[stIdx], suffix: e.target.value };
                              handleEraChange(eraIdx, "keyStats", newStats);
                            }}
                            placeholder="Suffix"
                            className="w-20 px-3 py-1.5 bg-zinc-950 border border-zinc-800 rounded-xl text-xs text-zinc-200 focus:outline-none focus:border-yellow-400"
                          />
                          <input
                            type="text"
                            value={st.label ?? ""}
                            onChange={(e) => {
                              const newStats = [...(era.keyStats || [])];
                              newStats[stIdx] = { ...newStats[stIdx], label: e.target.value };
                              handleEraChange(eraIdx, "keyStats", newStats);
                            }}
                            placeholder="Label"
                            className="flex-1 px-3 py-1.5 bg-zinc-950 border border-zinc-800 rounded-xl text-xs text-zinc-200 focus:outline-none focus:border-yellow-400"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              const newStats = [...(era.keyStats || [])];
                              newStats.splice(stIdx, 1);
                              handleEraChange(eraIdx, "keyStats", newStats);
                            }}
                            className="p-1.5 rounded-lg bg-zinc-800 hover:bg-red-950/60 hover:text-red-400 text-zinc-400 border border-zinc-700 transition"
                            title="Delete stat"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </section>
        )}

        {/* Moments Section */}
        {activeTab === "moments" && (
          <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {localMoments.map((moment, momIdx) => {
              const currentPos = moment.objectPosition ?? 25;
              const isSelected = activePreview === moment.id;
              const ov = { ...overrides?.moments?.[moment.id], ...moment };
              const videoId = ov.videoId || moment.videoId || "";

              return (
                <div
                  key={moment.id || momIdx}
                  className={`bg-zinc-900 border ${
                    isSelected
                      ? "border-yellow-400 ring-2 ring-yellow-400/30"
                      : "border-zinc-800 hover:border-zinc-700"
                  } rounded-2xl p-6 space-y-4 transition cursor-pointer`}
                  onClick={() => setActivePreview(moment.id)}
                >
                  <div className="flex items-center space-x-4 border-b border-zinc-800 pb-3">
                    {moment.image && (
                      <img
                        src={moment.image}
                        alt={moment.title}
                        className="w-20 h-20 object-cover rounded-lg border border-zinc-700 shrink-0"
                        style={{
                          objectPosition:
                            typeof currentPos === "number"
                              ? `center ${currentPos}%`
                              : currentPos,
                        }}
                      />
                    )}
                    <div className="overflow-hidden">
                      <span className="text-xs font-mono text-yellow-400 uppercase tracking-widest block">
                        {moment.category || "Moment"} • {moment.year}
                      </span>
                      <h3 className="text-base font-bold text-white truncate mt-0.5">
                        {moment.title}
                      </h3>
                    </div>
                  </div>

                  {/* Title input */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold tracking-wider uppercase text-zinc-400 block">
                      Title
                    </label>
                    <input
                      type="text"
                      value={moment.title || ""}
                      onChange={(e) =>
                        handleMomentChange(momIdx, "title", e.target.value)
                      }
                      className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-sm text-zinc-200 focus:outline-none focus:border-yellow-400"
                    />
                  </div>

                  {/* Image input */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold tracking-wider uppercase text-zinc-400 block">
                      Image URL
                    </label>
                    <div className="flex items-center space-x-2">
                      <input
                        type="text"
                        value={moment.image || ""}
                        onChange={(e) =>
                          handleMomentChange(momIdx, "image", e.target.value)
                        }
                        placeholder="https://... or /images/..."
                        className="flex-1 px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-sm text-zinc-200 focus:outline-none focus:border-yellow-400"
                      />
                      <label
                        className="cursor-pointer bg-yellow-600 hover:bg-yellow-500 text-black px-3 py-2 rounded-xl flex items-center justify-center transition shrink-0"
                        title="Upload from computer"
                      >
                        <Upload size={16} />
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              uploadFile(file, "moments", (url) => {
                                handleMomentChange(momIdx, "image", url);
                              });
                            }
                          }}
                        />
                      </label>
                    </div>
                  </div>

                  {/* YouTube Video ID */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold tracking-wider uppercase text-zinc-400 block">
                      YOUTUBE VIDEO ID
                    </label>
                    <input
                      type="text"
                      placeholder="e.g., vJ3B8sFEZvw"
                      value={ov.videoId || moment.videoId || ""}
                      onChange={(e) =>
                        updateMoment(moment.id, "videoId", e.target.value)
                      }
                      className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-sm text-zinc-200 focus:outline-none focus:border-yellow-400"
                    />
                    <div className="pt-1 flex items-center gap-4">
                      {videoId ? (
                        <>
                          <img
                            src={`https://img.youtube.com/vi/${videoId}/hqdefault.jpg`}
                            alt="YouTube preview"
                            className="w-32 h-20 rounded object-cover"
                          />
                          <a
                            href={`https://www.youtube.com/watch?v=${videoId}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-yellow-400 hover:text-yellow-300 underline font-medium"
                          >
                            Test on YouTube
                          </a>
                        </>
                      ) : (
                        <div className="w-32 h-20 rounded border border-dashed border-zinc-800 bg-zinc-950/60 flex items-center justify-center text-xs text-zinc-500">
                          No video
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Object Position Slider */}
                  <div className="space-y-2">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-semibold tracking-wider uppercase text-zinc-400">
                        Vertical Alignment (Y)
                      </span>
                      <span className="font-mono text-yellow-400 font-bold">
                        {currentPos}%
                      </span>
                    </div>
                    <input
                      type="range"
                      min={0}
                      max={100}
                      value={currentPos}
                      onChange={(e) =>
                        handleMomentChange(momIdx, "objectPosition", Number(e.target.value))
                      }
                      className="w-full accent-yellow-400 cursor-pointer"
                    />
                  </div>
                </div>
              );
            })}
          </section>
        )}
          </div>

          {/* Right Column: Sticky Live Preview Panel (40%) */}
          <div className="w-full lg:w-[40%] lg:sticky lg:top-20 lg:h-[calc(100vh-5rem)] lg:overflow-y-auto space-y-4">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
              <span className="text-xs font-semibold tracking-wider uppercase text-zinc-400">
                Live Preview
              </span>
              <span className="text-[11px] font-mono text-yellow-400 truncate max-w-[180px]">
                {activeTab === "eras"
                  ? (selectedEra ? selectedEra.club : "No era selected")
                  : (selectedMoment ? selectedMoment.title : "No moment selected")}
              </span>
            </div>

            {activeTab === "eras" && (
              selectedEra ? (
                <div
                  className="w-full max-w-[420px] mx-auto rounded-3xl border shadow-2xl overflow-hidden relative transition-all duration-300 flex flex-col justify-between p-5"
                  style={{
                    backgroundColor: selectedEra.colors?.bg || "#0D0B05",
                    color: selectedEra.colors?.text || "#FFFFFF",
                    borderColor: selectedEra.colors?.borderColor || "rgba(255,255,255,0.15)",
                    minHeight: "440px",
                  }}
                >
                  {/* Film strip 35mm top effect */}
                  <div className="absolute top-0 left-0 right-0 h-2.5 bg-black/80 flex items-center justify-between px-1 overflow-hidden pointer-events-none">
                    {Array.from({ length: 24 }).map((_, i) => (
                      <span key={i} className="w-1.5 h-1.5 rounded-[0.5px] bg-white/10 shrink-0 mx-0.5" />
                    ))}
                  </div>

                  {/* Top Badge & Period */}
                  <div className="flex items-center justify-between pt-1 text-xs">
                    <span
                      className="px-2 py-0.5 rounded-full font-bebas text-xs uppercase border tracking-wider"
                      style={{
                        borderColor: selectedEra.colors?.borderColor || "rgba(255,255,255,0.2)",
                        backgroundColor: selectedEra.colors?.cardBg || "rgba(255,255,255,0.05)",
                        color: selectedEra.colors?.primary || "#FEBE10",
                      }}
                    >
                      Era • {selectedEra.kitNumber || "#7"}
                    </span>
                    <span className="font-bebas text-sm tracking-widest text-zinc-400">
                      {selectedEra.period}
                    </span>
                  </div>

                  {/* Club & Tagline */}
                  <div className="my-2">
                    <h3
                      className="font-anton text-3xl uppercase tracking-tight leading-none drop-shadow-md"
                      style={{ color: selectedEra.colors?.primary || "#FEBE10" }}
                    >
                      {selectedEra.club}
                    </h3>
                    <p
                      className="font-bebas text-sm uppercase tracking-wider mt-1"
                      style={{ color: selectedEra.colors?.primary || "#FEBE10" }}
                    >
                      {selectedEra.tagline}
                    </p>
                  </div>

                  {/* Hero Visual Image */}
                  <div
                    className="relative w-full h-44 rounded-2xl overflow-hidden border shadow-lg my-2"
                    style={{
                      borderColor: selectedEra.colors?.borderColor || "rgba(255,255,255,0.2)",
                    }}
                  >
                    <img
                      src={selectedEra.heroImages?.[0] || "/images/hero/hero-fallback.jpg"}
                      alt={selectedEra.club}
                      className="w-full h-full object-cover"
                      style={{
                        objectPosition:
                          typeof selectedEra.objectPosition === "number"
                            ? `center ${selectedEra.objectPosition}%`
                            : (selectedEra.objectPosition || "center 25%"),
                      }}
                    />
                    <div
                      className="absolute inset-0 pointer-events-none"
                      style={{
                        background: `linear-gradient(to top, ${selectedEra.colors?.bg || "#0D0B05"}F2 0%, transparent 60%)`,
                      }}
                    />
                  </div>

                  {/* Quote Mini */}
                  {selectedEra.quote?.text && (
                    <p className="font-inter text-xs text-zinc-300 italic line-clamp-2 px-1">
                      &ldquo;{selectedEra.quote.text}&rdquo;
                    </p>
                  )}

                  {/* 3 Core Stats Grid */}
                  <div className="grid grid-cols-3 gap-2 mt-3">
                    {(selectedEra.keyStats || []).slice(0, 3).map((st: any, i: number) => (
                      <div
                        key={i}
                        className="p-2 rounded-xl border text-center"
                        style={{
                          backgroundColor: selectedEra.colors?.cardBg || "rgba(255,255,255,0.06)",
                          borderColor: selectedEra.colors?.borderColor || "rgba(255,255,255,0.12)",
                        }}
                      >
                        <div
                          className="font-anton text-lg leading-tight"
                          style={{ color: selectedEra.colors?.primary || "#FEBE10" }}
                        >
                          {st.value}
                          {st.suffix || ""}
                        </div>
                        <div className="font-bebas text-[10px] text-zinc-400 uppercase truncate mt-0.5">
                          {st.label}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Film strip 35mm bottom effect */}
                  <div className="absolute bottom-0 left-0 right-0 h-2.5 bg-black/80 flex items-center justify-between px-1 overflow-hidden pointer-events-none">
                    {Array.from({ length: 24 }).map((_, i) => (
                      <span key={i} className="w-1.5 h-1.5 rounded-[0.5px] bg-white/10 shrink-0 mx-0.5" />
                    ))}
                  </div>
                </div>
              ) : (
                <div className="p-12 text-center text-zinc-400 border border-dashed border-zinc-800 rounded-2xl bg-zinc-950/60 flex flex-col items-center justify-center space-y-2">
                  <span className="text-sm font-medium">Click any era to preview</span>
                  <span className="text-xs text-zinc-500">Select an era card on the left to see its live styling</span>
                </div>
              )
            )}

            {activeTab === "moments" && (
              selectedMoment ? (
                <div className="w-full max-w-[420px] mx-auto rounded-3xl border border-white/10 bg-[#0c0c10] overflow-hidden shadow-2xl p-4 space-y-3">
                  <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden border border-white/10 bg-zinc-950">
                    <img
                      src={selectedMoment.image || "/images/hero/hero-fallback.jpg"}
                      alt={selectedMoment.title}
                      className="w-full h-full object-cover"
                      style={{
                        objectPosition:
                          typeof selectedMoment.objectPosition === "number"
                            ? `center ${selectedMoment.objectPosition}%`
                            : (selectedMoment.objectPosition || "center 50%"),
                      }}
                    />
                    <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-black/70 border border-gold/30 text-gold font-bebas text-xs uppercase tracking-wider">
                      {selectedMoment.category} • {selectedMoment.year}
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent pointer-events-none" />
                    <div className="absolute bottom-3 left-3 right-3 text-white">
                      <h4 className="font-anton text-lg uppercase tracking-wide">
                        {selectedMoment.title}
                      </h4>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-12 text-center text-zinc-400 border border-dashed border-zinc-800 rounded-2xl bg-zinc-950/60 flex flex-col items-center justify-center space-y-2">
                  <span className="text-sm font-medium">Click any moment to preview</span>
                  <span className="text-xs text-zinc-500">Select a moment card on the left to see its live preview</span>
                </div>
              )
            )}
          </div>
        </div>
        <ToastContainer />
      </div>
    </main>
  );
}

