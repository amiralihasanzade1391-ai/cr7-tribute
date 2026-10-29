"use client";

import { useState, useEffect } from "react";
import {
  Layers,
  Palette,
  Image as ImageIcon,
  Edit3,
  Trash2,
  Plus,
  RefreshCw,
  X,
  ExternalLink,
  Eye,
  Sliders,
  Check,
  ChevronRight,
  Flame,
} from "lucide-react";
import { toast } from "@/components/admin/toast";

interface EraItem {
  id: string;
  name: string;
  years: string;
  description: string;
  primaryColor: string;
  accentColor: string;
  bgColor: string;
  textColor: string;
  images: string; // JSON array string
  order: number;
}

export default function AdminErasPage() {
  const [eras, setEras] = useState<EraItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedEra, setSelectedEra] = useState<EraItem | null>(null);

  // Edit State
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    id: "",
    name: "",
    years: "",
    description: "",
    primaryColor: "#FEBE10",
    accentColor: "#FEBE10",
    bgColor: "#000000",
    textColor: "#FFFFFF",
    images: [] as string[],
    newImageUrl: "",
  });

  const loadEras = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/eras");
      const data = await res.json();
      if (data.ok) {
        setEras(data.eras || []);
        if (data.eras?.length > 0 && !selectedEra) {
          setSelectedEra(data.eras[0]);
        }
      } else {
        toast.error("Failed to load eras: " + data.error);
      }
    } catch {
      toast.error("Network error loading eras");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEras();
  }, []);

  const openEditModal = (era: EraItem) => {
    let parsedImages: string[] = [];
    try {
      const res = JSON.parse(era.images);
      parsedImages = Array.isArray(res) ? res : [era.images];
    } catch {
      parsedImages = [era.images];
    }

    setFormData({
      id: era.id,
      name: era.name,
      years: era.years,
      description: era.description,
      primaryColor: era.primaryColor || "#FEBE10",
      accentColor: era.accentColor || "#FEBE10",
      bgColor: era.bgColor || "#000000",
      textColor: era.textColor || "#FFFFFF",
      images: parsedImages,
      newImageUrl: "",
    });
    setIsEditModalOpen(true);
  };

  const handleAddImage = () => {
    if (!formData.newImageUrl.trim()) return;
    setFormData((prev) => ({
      ...prev,
      images: [...prev.images, prev.newImageUrl.trim()],
      newImageUrl: "",
    }));
  };

  const handleRemoveImage = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const handleSaveEra = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.years.trim()) return;

    try {
      const res = await fetch("/api/admin/eras", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: formData.id,
          name: formData.name,
          years: formData.years,
          description: formData.description,
          primaryColor: formData.primaryColor,
          accentColor: formData.accentColor,
          bgColor: formData.bgColor,
          textColor: formData.textColor,
          images: formData.images,
        }),
      });

      const data = await res.json();
      if (data.ok) {
        toast.success(`Updated era: ${formData.name}`);
        setIsEditModalOpen(false);
        loadEras();
        if (selectedEra?.id === formData.id) {
          setSelectedEra(data.era);
        }
      } else {
        toast.error(data.error || "Failed to update era");
      }
    } catch {
      toast.error("Network error updating era");
    }
  };

  // Extract photos for currently selected era
  let selectedImages: string[] = [];
  if (selectedEra) {
    try {
      const res = JSON.parse(selectedEra.images);
      selectedImages = Array.isArray(res) ? res : [selectedEra.images];
    } catch {
      selectedImages = [selectedEra.images];
    }
  }

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            Career Eras & Chapter Simulator
            <span className="text-xs px-2 py-0.5 rounded font-mono bg-zinc-800 text-[#FEBE10] border border-zinc-700">
              {eras.length} Chapters
            </span>
          </h2>
          <p className="text-xs text-zinc-400 mt-0.5">
            Craft narratives, hero photo galleries, and real-time custom club palettes from Lisbon to Riyadh.
          </p>
        </div>

        <button
          onClick={loadEras}
          className="self-start sm:self-auto flex items-center gap-2 px-3 py-1.5 text-xs font-mono font-semibold rounded-lg bg-zinc-850 hover:bg-zinc-800 text-zinc-300 border border-zinc-750"
        >
          <RefreshCw className={`w-3.5 h-3.5 text-[#FEBE10] ${loading ? "animate-spin" : ""}`} />
          <span>Refresh Eras</span>
        </button>
      </div>

      {/* Eras Selector Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
        {eras.map((era) => {
          const isSelected = selectedEra?.id === era.id;
          return (
            <button
              key={era.id}
              onClick={() => setSelectedEra(era)}
              className={`p-3 rounded-xl border text-left transition-all relative overflow-hidden group ${
                isSelected
                  ? "bg-zinc-900 border-[#FEBE10] shadow-[0_0_15px_rgba(254,190,16,0.25)]"
                  : "bg-zinc-900/50 border-zinc-800/80 hover:border-zinc-700"
              }`}
            >
              {/* Top color indicator line */}
              <div
                className="absolute top-0 left-0 right-0 h-1 transition-transform group-hover:scale-x-105"
                style={{ backgroundColor: era.primaryColor || "#FEBE10" }}
              />
              <p className="text-xs font-bold text-white truncate mt-1">{era.name}</p>
              <p className="text-[10px] font-mono text-zinc-400 truncate">{era.years}</p>
            </button>
          );
        })}
      </div>

      {/* Main Two-Column View: Left details/editor, Right Feature #5 Interactive Era Theme Simulator */}
      {selectedEra && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Era Details & Photo Gallery (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            <div className="p-6 rounded-2xl bg-zinc-900/60 border border-zinc-800/80 space-y-5">
              <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-black text-white tracking-tight">
                      {selectedEra.name}
                    </h3>
                    <span className="text-xs font-mono px-2 py-0.5 rounded bg-zinc-800 text-[#FEBE10] border border-zinc-700">
                      {selectedEra.years}
                    </span>
                  </div>
                  <p className="text-xs text-zinc-400 mt-0.5">Historical Chapter</p>
                </div>

                <button
                  onClick={() => openEditModal(selectedEra)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#FEBE10] text-black font-bold text-xs hover:opacity-90 shadow-sm"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Edit Era & Colors</span>
                </button>
              </div>

              {/* Narrative Story */}
              <div>
                <h4 className="text-xs font-mono uppercase tracking-wider text-zinc-400 mb-2">
                  Chapter Narrative
                </h4>
                <p className="text-xs text-zinc-300 leading-relaxed bg-zinc-950/70 p-4 rounded-xl border border-zinc-800/80">
                  {selectedEra.description}
                </p>
              </div>

              {/* Verified Hero Photos */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-xs font-mono uppercase tracking-wider text-zinc-400">
                    Hero Photos ({selectedImages.length})
                  </h4>
                  <span className="text-[11px] font-mono text-zinc-500">Verified Wikimedia URLs</span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {selectedImages.map((imgUrl, i) => (
                    <div
                      key={i}
                      className="group relative aspect-[4/3] rounded-lg overflow-hidden bg-zinc-950 border border-zinc-800"
                    >
                      <img
                        src={imgUrl}
                        alt={`${selectedEra.name} photo ${i + 1}`}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        onError={(e) => {
                          (e.target as HTMLElement).style.display = "none";
                        }}
                      />
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <a
                          href={imgUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1.5 rounded bg-zinc-800 text-white hover:text-[#FEBE10]"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Creative Feature #5: Interactive Theme & Color Palette Simulator (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            <div className="p-6 rounded-2xl bg-zinc-900/60 border border-zinc-800/80 space-y-4">
              <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
                <div className="flex items-center gap-2">
                  <Palette className="w-4 h-4 text-[#FEBE10]" />
                  <h3 className="text-sm font-bold text-white uppercase font-mono tracking-wider">
                    Live Palette Simulator
                  </h3>
                </div>
                <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                  Feature #5 Active
                </span>
              </div>

              {/* Color Swatches Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                <div className="p-2.5 rounded-lg bg-zinc-950 border border-zinc-800 space-y-1">
                  <span className="text-[10px] font-mono text-zinc-400 block">Primary</span>
                  <div className="flex items-center gap-1.5">
                    <span
                      className="w-4 h-4 rounded border border-white/20 shrink-0"
                      style={{ backgroundColor: selectedEra.primaryColor }}
                    />
                    <span className="text-[11px] font-mono text-white truncate">
                      {selectedEra.primaryColor}
                    </span>
                  </div>
                </div>

                <div className="p-2.5 rounded-lg bg-zinc-950 border border-zinc-800 space-y-1">
                  <span className="text-[10px] font-mono text-zinc-400 block">Accent</span>
                  <div className="flex items-center gap-1.5">
                    <span
                      className="w-4 h-4 rounded border border-white/20 shrink-0"
                      style={{ backgroundColor: selectedEra.accentColor }}
                    />
                    <span className="text-[11px] font-mono text-white truncate">
                      {selectedEra.accentColor}
                    </span>
                  </div>
                </div>

                <div className="p-2.5 rounded-lg bg-zinc-950 border border-zinc-800 space-y-1">
                  <span className="text-[10px] font-mono text-zinc-400 block">Background</span>
                  <div className="flex items-center gap-1.5">
                    <span
                      className="w-4 h-4 rounded border border-white/20 shrink-0"
                      style={{ backgroundColor: selectedEra.bgColor }}
                    />
                    <span className="text-[11px] font-mono text-white truncate">
                      {selectedEra.bgColor}
                    </span>
                  </div>
                </div>

                <div className="p-2.5 rounded-lg bg-zinc-950 border border-zinc-800 space-y-1">
                  <span className="text-[10px] font-mono text-zinc-400 block">Text Color</span>
                  <div className="flex items-center gap-1.5">
                    <span
                      className="w-4 h-4 rounded border border-white/20 shrink-0"
                      style={{ backgroundColor: selectedEra.textColor }}
                    />
                    <span className="text-[11px] font-mono text-white truncate">
                      {selectedEra.textColor}
                    </span>
                  </div>
                </div>
              </div>

              {/* Dynamic Interactive Render Card */}
              <div className="pt-2">
                <p className="text-[11px] font-mono text-zinc-400 mb-2">
                  Live Public Site Preview:
                </p>

                <div
                  className="rounded-2xl p-5 border relative overflow-hidden transition-all duration-300 shadow-2xl"
                  style={{
                    backgroundColor: selectedEra.bgColor || "#09090b",
                    borderColor: selectedEra.primaryColor || "#FEBE10",
                    color: selectedEra.textColor || "#FFFFFF",
                  }}
                >
                  {/* Subtle gradient splash */}
                  <div
                    className="absolute top-0 right-0 w-48 h-48 rounded-full blur-3xl opacity-30 pointer-events-none"
                    style={{ backgroundColor: selectedEra.primaryColor }}
                  />

                  <div className="relative z-10 space-y-4">
                    <div className="flex items-center justify-between">
                      <span
                        className="text-[10px] font-mono uppercase tracking-widest font-black px-2 py-0.5 rounded border"
                        style={{
                          backgroundColor: `${selectedEra.primaryColor}20`,
                          borderColor: selectedEra.primaryColor,
                          color: selectedEra.primaryColor,
                        }}
                      >
                        {selectedEra.years}
                      </span>
                      <Flame
                        className="w-4 h-4"
                        style={{ color: selectedEra.accentColor }}
                      />
                    </div>

                    <div>
                      <h4
                        className="text-2xl font-black tracking-tight"
                        style={{ color: selectedEra.textColor }}
                      >
                        {selectedEra.name}
                      </h4>
                      <p className="text-xs opacity-75 mt-1 line-clamp-3 leading-relaxed">
                        {selectedEra.description}
                      </p>
                    </div>

                    <div className="pt-2 flex items-center justify-between">
                      <button
                        className="px-3.5 py-1.5 rounded-lg text-xs font-bold font-mono transition-transform active:scale-95 shadow"
                        style={{
                          backgroundColor: selectedEra.primaryColor,
                          color: "#000000",
                        }}
                      >
                        Explore Era
                      </button>
                      <span
                        className="text-xs font-mono font-semibold"
                        style={{ color: selectedEra.accentColor }}
                      >
                        {selectedImages.length} High-Res Assets
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Era & Palette Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
          <div className="relative w-full max-w-2xl rounded-2xl bg-zinc-900 border border-zinc-800 p-6 shadow-2xl space-y-5 my-8">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <div className="flex items-center gap-2">
                <Palette className="w-5 h-5 text-[#FEBE10]" />
                <h3 className="text-base font-bold text-white">
                  Edit Era: {formData.name}
                </h3>
              </div>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="p-1 rounded text-zinc-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEra} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-mono font-semibold text-zinc-300 mb-1">
                    Era Club / Identity *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 bg-zinc-950 border border-zinc-700 rounded-lg text-xs text-white focus:outline-none focus:border-[#FEBE10]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono font-semibold text-zinc-300 mb-1">
                    Years Period *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.years}
                    onChange={(e) => setFormData({ ...formData, years: e.target.value })}
                    placeholder="2009–2018"
                    className="w-full px-3 py-2 bg-zinc-950 border border-zinc-700 rounded-lg text-xs text-white focus:outline-none focus:border-[#FEBE10]"
                  />
                </div>
              </div>

              {/* Color Pickers */}
              <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 space-y-3">
                <h4 className="text-xs font-mono uppercase tracking-wider text-zinc-400 font-semibold">
                  Club Color Palette
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div>
                    <label className="block text-[11px] font-mono text-zinc-400 mb-1">
                      Primary
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={formData.primaryColor}
                        onChange={(e) => setFormData({ ...formData, primaryColor: e.target.value })}
                        className="w-8 h-8 rounded cursor-pointer bg-transparent border-0"
                      />
                      <input
                        type="text"
                        value={formData.primaryColor}
                        onChange={(e) => setFormData({ ...formData, primaryColor: e.target.value })}
                        className="w-20 px-2 py-1 bg-zinc-900 border border-zinc-700 rounded text-xs font-mono text-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-mono text-zinc-400 mb-1">
                      Accent
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={formData.accentColor}
                        onChange={(e) => setFormData({ ...formData, accentColor: e.target.value })}
                        className="w-8 h-8 rounded cursor-pointer bg-transparent border-0"
                      />
                      <input
                        type="text"
                        value={formData.accentColor}
                        onChange={(e) => setFormData({ ...formData, accentColor: e.target.value })}
                        className="w-20 px-2 py-1 bg-zinc-900 border border-zinc-700 rounded text-xs font-mono text-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-mono text-zinc-400 mb-1">
                      Background
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={formData.bgColor}
                        onChange={(e) => setFormData({ ...formData, bgColor: e.target.value })}
                        className="w-8 h-8 rounded cursor-pointer bg-transparent border-0"
                      />
                      <input
                        type="text"
                        value={formData.bgColor}
                        onChange={(e) => setFormData({ ...formData, bgColor: e.target.value })}
                        className="w-20 px-2 py-1 bg-zinc-900 border border-zinc-700 rounded text-xs font-mono text-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-mono text-zinc-400 mb-1">
                      Text
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={formData.textColor}
                        onChange={(e) => setFormData({ ...formData, textColor: e.target.value })}
                        className="w-8 h-8 rounded cursor-pointer bg-transparent border-0"
                      />
                      <input
                        type="text"
                        value={formData.textColor}
                        onChange={(e) => setFormData({ ...formData, textColor: e.target.value })}
                        className="w-20 px-2 py-1 bg-zinc-900 border border-zinc-700 rounded text-xs font-mono text-white"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Photos Manager */}
              <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-mono uppercase tracking-wider text-zinc-400 font-semibold">
                    Era Photos Gallery
                  </h4>
                  <span className="text-[11px] font-mono text-zinc-500">
                    {formData.images.length} Image(s)
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="url"
                    placeholder="Paste verified image URL (e.g. Wikimedia)..."
                    value={formData.newImageUrl}
                    onChange={(e) => setFormData({ ...formData, newImageUrl: e.target.value })}
                    className="flex-1 px-3 py-1.5 bg-zinc-900 border border-zinc-700 rounded text-xs text-white focus:outline-none focus:border-[#FEBE10]"
                  />
                  <button
                    type="button"
                    onClick={handleAddImage}
                    className="px-3 py-1.5 rounded bg-[#FEBE10] text-black text-xs font-bold hover:opacity-90"
                  >
                    Add
                  </button>
                </div>

                <div className="space-y-1.5 max-h-36 overflow-y-auto">
                  {formData.images.map((url, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-2 rounded bg-zinc-900 border border-zinc-800 text-xs"
                    >
                      <span className="truncate max-w-md font-mono text-zinc-300 text-[11px]">
                        {url}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(idx)}
                        className="p-1 text-zinc-400 hover:text-rose-400"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Narrative */}
              <div>
                <label className="block text-xs font-mono font-semibold text-zinc-300 mb-1">
                  Chapter Narrative & Legacy Story
                </label>
                <textarea
                  rows={4}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 bg-zinc-950 border border-zinc-700 rounded-lg text-xs text-white focus:outline-none focus:border-[#FEBE10]"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-zinc-800">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-4 py-2 text-xs font-medium rounded-lg bg-zinc-800 text-zinc-300 hover:bg-zinc-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold rounded-lg bg-[#FEBE10] text-black hover:opacity-90"
                >
                  Save Era Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
