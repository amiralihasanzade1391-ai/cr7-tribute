"use client";

import { useState, useEffect } from "react";
import {
  Sparkles,
  Plus,
  Search,
  Edit2,
  Trash2,
  Play,
  Heart,
  ExternalLink,
  RefreshCw,
  X,
  Flame,
  Layers,
  ArrowUp,
  ArrowDown,
} from "lucide-react";
import { toast } from "@/components/admin/toast";

interface MomentItem {
  id: string;
  title: string;
  description: string;
  year: number;
  opponent: string | null;
  competition: string | null;
  category: string;
  imageUrl: string;
  videoId: string | null;
  tags: string; // JSON array or comma separated
  likes: number;
  order: number;
  aspectRatio: string;
}

export default function AdminMomentsPage() {
  const [moments, setMoments] = useState<MomentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMoment, setEditingMoment] = useState<MomentItem | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    id: "",
    title: "",
    description: "",
    year: 2018,
    opponent: "",
    competition: "",
    category: "goal",
    imageUrl: "",
    videoId: "",
    tags: "",
    likes: 5000,
    aspectRatio: "tall",
  });

  const loadMoments = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/admin/moments?category=${categoryFilter}&search=${encodeURIComponent(search)}`);
      const data = await res.json();
      if (data.ok) {
        setMoments(data.moments || []);
      } else {
        toast.error("Failed to load moments: " + data.error);
      }
    } catch {
      toast.error("Network error loading moments");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMoments();
  }, [categoryFilter]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loadMoments();
  };

  const openAddModal = () => {
    setEditingMoment(null);
    setFormData({
      id: "",
      title: "",
      description: "",
      year: 2018,
      opponent: "",
      competition: "",
      category: "goal",
      imageUrl: "",
      videoId: "",
      tags: "UCL, Real Madrid, Iconic",
      likes: 5000,
      aspectRatio: "tall",
    });
    setIsModalOpen(true);
  };

  const openEditModal = (m: MomentItem) => {
    setEditingMoment(m);
    let tagsStr = "";
    try {
      const parsed = JSON.parse(m.tags);
      tagsStr = Array.isArray(parsed) ? parsed.join(", ") : m.tags;
    } catch {
      tagsStr = m.tags;
    }

    setFormData({
      id: m.id,
      title: m.title,
      description: m.description,
      year: m.year,
      opponent: m.opponent || "",
      competition: m.competition || "",
      category: m.category,
      imageUrl: m.imageUrl,
      videoId: m.videoId || "",
      tags: tagsStr,
      likes: m.likes,
      aspectRatio: m.aspectRatio || "tall",
    });
    setIsModalOpen(true);
  };

  const handleSaveMoment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.imageUrl.trim()) return;

    try {
      const isEdit = Boolean(editingMoment);
      const url = "/api/admin/moments";
      const method = isEdit ? "PUT" : "POST";

      const payload = {
        ...formData,
        id: isEdit ? editingMoment!.id : formData.id || undefined,
      };

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (data.ok) {
        toast.success(isEdit ? "Moment updated!" : "Moment created!");
        setIsModalOpen(false);
        loadMoments();
      } else {
        toast.error(data.error || "Failed to save moment");
      }
    } catch {
      toast.error("Network error saving moment");
    }
  };

  const handleDeleteMoment = async (m: MomentItem) => {
    if (!confirm(`Delete moment "${m.title}"?`)) return;

    try {
      const res = await fetch(`/api/admin/moments?id=${m.id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.ok) {
        toast.success("Moment deleted");
        setMoments((prev) => prev.filter((item) => item.id !== m.id));
      } else {
        toast.error(data.error || "Failed to delete");
      }
    } catch {
      toast.error("Network error deleting moment");
    }
  };

  // Reorder up/down
  const moveMoment = async (index: number, direction: "up" | "down") => {
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= moments.length) return;

    const reordered = [...moments];
    const temp = reordered[index];
    reordered[index] = reordered[targetIndex];
    reordered[targetIndex] = temp;

    const payload = reordered.map((item, idx) => ({ id: item.id, order: idx }));
    setMoments(reordered);

    try {
      await fetch("/api/admin/moments", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reorder: payload }),
      });
      toast.success("Display order updated");
    } catch {
      toast.error("Failed to save order");
      loadMoments();
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            Iconic Moments Archive
            <span className="text-xs px-2 py-0.5 rounded font-mono bg-zinc-800 text-[#FEBE10] border border-zinc-700">
              {moments.length} Moments
            </span>
          </h2>
          <p className="text-xs text-zinc-400 mt-0.5">
            Curate legendary bicycle kicks, last-gasp free kicks, historic celebrations, and video highlights.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={openAddModal}
            className="flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-lg bg-gradient-to-r from-[#FEBE10] to-[#e5ab0f] text-black hover:opacity-90 transition-all font-mono shadow-[0_0_15px_rgba(254,190,16,0.25)]"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Moment</span>
          </button>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 p-4 rounded-xl bg-zinc-900/70 border border-zinc-800/80">
        <form onSubmit={handleSearchSubmit} className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
          <input
            type="text"
            placeholder="Search moments by title, opponent, or tags..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-zinc-950/80 border border-zinc-800 rounded-lg text-xs text-zinc-200 placeholder:text-zinc-500 focus:outline-none focus:border-[#FEBE10]/60 transition-colors"
          />
        </form>

        <div className="flex items-center gap-2">
          <div className="flex items-center rounded-lg bg-zinc-950/80 border border-zinc-800 p-1">
            {[
              { id: "all", label: "All" },
              { id: "goal", label: "Goals" },
              { id: "celebration", label: "Celebrations" },
              { id: "trophy", label: "Silverware" },
              { id: "personal", label: "The Man" },
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => setCategoryFilter(cat.id)}
                className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
                  categoryFilter === cat.id
                    ? "bg-[#FEBE10] text-black font-semibold"
                    : "text-zinc-400 hover:text-zinc-200"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          <button
            onClick={loadMoments}
            title="Refresh"
            className="p-2 rounded-lg bg-zinc-950/80 border border-zinc-800 text-zinc-400 hover:text-white transition-colors"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          </button>
        </div>
      </div>

      {/* Grid of Moments */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-64 rounded-xl bg-zinc-900/50 border border-zinc-800 animate-pulse" />
          ))}
        </div>
      ) : moments.length === 0 ? (
        <div className="text-center py-16 rounded-2xl bg-zinc-900/30 border border-zinc-800/80">
          <Sparkles className="w-12 h-12 text-zinc-600 mx-auto mb-3" />
          <h3 className="text-sm font-bold text-zinc-300">No moments found</h3>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {moments.map((m, index) => {
            let tagsArray: string[] = [];
            try {
              const res = JSON.parse(m.tags);
              tagsArray = Array.isArray(res) ? res : [m.tags];
            } catch {
              tagsArray = m.tags.split(",").map((s) => s.trim()).filter(Boolean);
            }

            return (
              <div
                key={m.id}
                className="group flex flex-col rounded-xl overflow-hidden bg-zinc-900/70 border border-zinc-800 hover:border-zinc-700 transition-all shadow-lg"
              >
                {/* Image & Overlay Header */}
                <div className="relative aspect-video w-full bg-zinc-950 overflow-hidden">
                  <img
                    src={m.imageUrl}
                    alt={m.title}
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='400' height='225' fill='%23111'><rect width='400' height='225'/><text x='50%' y='50%' fill='%23666' font-size='14' text-anchor='middle'>Photo Not Loaded</text></svg>";
                    }}
                  />

                  {/* Year & Category Badge */}
                  <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
                    <span className="px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-black/80 text-white backdrop-blur-md border border-white/10">
                      {m.year}
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold uppercase bg-[#FEBE10]/90 text-black">
                      {m.category}
                    </span>
                  </div>

                  {/* Video Indicator */}
                  {m.videoId && (
                    <div className="absolute top-2.5 right-2.5 p-1.5 rounded-full bg-red-600/90 text-white shadow-md">
                      <Play className="w-3 h-3 fill-white" />
                    </div>
                  )}

                  {/* Reorder Buttons Overlay */}
                  <div className="absolute bottom-2 right-2 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity bg-black/70 p-1 rounded backdrop-blur">
                    <button
                      onClick={() => moveMoment(index, "up")}
                      disabled={index === 0}
                      className="p-1 rounded text-zinc-300 hover:text-white disabled:opacity-30"
                    >
                      <ArrowUp className="w-3 h-3" />
                    </button>
                    <button
                      onClick={() => moveMoment(index, "down")}
                      disabled={index === moments.length - 1}
                      className="p-1 rounded text-zinc-300 hover:text-white disabled:opacity-30"
                    >
                      <ArrowDown className="w-3 h-3" />
                    </button>
                  </div>
                </div>

                {/* Details Body */}
                <div className="p-4 flex-1 flex flex-col justify-between space-y-3 bg-zinc-950/60">
                  <div>
                    <h4 className="text-sm font-bold text-white tracking-tight line-clamp-1">
                      {m.title}
                    </h4>
                    {m.competition && (
                      <p className="text-[11px] font-mono text-[#FEBE10] mt-0.5 line-clamp-1">
                        {m.competition} {m.opponent ? `vs ${m.opponent}` : ""}
                      </p>
                    )}
                    <p className="text-xs text-zinc-400 mt-2 line-clamp-2 leading-relaxed">
                      {m.description}
                    </p>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1">
                    {tagsArray.slice(0, 3).map((tag, i) => (
                      <span
                        key={i}
                        className="text-[10px] px-2 py-0.5 rounded bg-zinc-800 text-zinc-400 font-mono"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>

                  {/* Footer Bar */}
                  <div className="pt-2 border-t border-zinc-800 flex items-center justify-between text-xs">
                    <span className="flex items-center gap-1 text-[11px] font-mono text-zinc-400">
                      <Heart className="w-3 h-3 text-rose-500 fill-rose-500/20" />
                      {m.likes.toLocaleString()}
                    </span>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => openEditModal(m)}
                        className="p-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 hover:text-[#FEBE10] border border-zinc-700 transition-colors"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeleteMoment(m)}
                        className="p-1.5 rounded-lg bg-zinc-800 hover:bg-rose-500/20 text-zinc-400 hover:text-rose-400 border border-zinc-700 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add / Edit Moment Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
          <div className="relative w-full max-w-xl rounded-2xl bg-zinc-900 border border-zinc-800 p-6 shadow-2xl space-y-4 my-8">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-[#FEBE10]" />
                <h3 className="text-base font-bold text-white">
                  {editingMoment ? "Edit Iconic Moment" : "Add New Moment"}
                </h3>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded text-zinc-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveMoment} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-mono font-semibold text-zinc-300 mb-1">
                    Moment Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="The Turin Bicycle Kick"
                    className="w-full px-3 py-2 bg-zinc-950 border border-zinc-700 rounded-lg text-xs text-white focus:outline-none focus:border-[#FEBE10]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono font-semibold text-zinc-300 mb-1">
                    Year *
                  </label>
                  <input
                    type="number"
                    required
                    value={formData.year}
                    onChange={(e) => setFormData({ ...formData, year: parseInt(e.target.value, 10) || 2020 })}
                    className="w-full px-3 py-2 bg-zinc-950 border border-zinc-700 rounded-lg text-xs text-white focus:outline-none focus:border-[#FEBE10]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-mono font-semibold text-zinc-300 mb-1">
                    Category
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3 py-2 bg-zinc-950 border border-zinc-700 rounded-lg text-xs text-white focus:outline-none focus:border-[#FEBE10]"
                  >
                    <option value="goal">Iconic Goal</option>
                    <option value="celebration">Celebration (SIUUU / Calma)</option>
                    <option value="trophy">Silverware / Trophy Lift</option>
                    <option value="personal">Personal / The Man</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-mono font-semibold text-zinc-300 mb-1">
                    Aspect Ratio
                  </label>
                  <select
                    value={formData.aspectRatio}
                    onChange={(e) => setFormData({ ...formData, aspectRatio: e.target.value })}
                    className="w-full px-3 py-2 bg-zinc-950 border border-zinc-700 rounded-lg text-xs text-white focus:outline-none focus:border-[#FEBE10]"
                  >
                    <option value="tall">Tall (Portrait)</option>
                    <option value="square">Square</option>
                    <option value="wide">Wide (16:9)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-mono font-semibold text-zinc-300 mb-1">
                    Opponent (Optional)
                  </label>
                  <input
                    type="text"
                    value={formData.opponent}
                    onChange={(e) => setFormData({ ...formData, opponent: e.target.value })}
                    placeholder="Juventus"
                    className="w-full px-3 py-2 bg-zinc-950 border border-zinc-700 rounded-lg text-xs text-white focus:outline-none focus:border-[#FEBE10]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono font-semibold text-zinc-300 mb-1">
                    Competition (Optional)
                  </label>
                  <input
                    type="text"
                    value={formData.competition}
                    onChange={(e) => setFormData({ ...formData, competition: e.target.value })}
                    placeholder="UEFA Champions League Quarter-Final"
                    className="w-full px-3 py-2 bg-zinc-950 border border-zinc-700 rounded-lg text-xs text-white focus:outline-none focus:border-[#FEBE10]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono font-semibold text-zinc-300 mb-1">
                  Verified Image URL *
                </label>
                <input
                  type="url"
                  required
                  value={formData.imageUrl}
                  onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                  placeholder="https://upload.wikimedia.org/.../500px-ronaldo.jpg"
                  className="w-full px-3 py-2 bg-zinc-950 border border-zinc-700 rounded-lg text-xs text-white focus:outline-none focus:border-[#FEBE10]"
                />
                {formData.imageUrl && (
                  <div className="mt-2 p-2 rounded bg-zinc-950 border border-zinc-800 flex items-center gap-3">
                    <img
                      src={formData.imageUrl}
                      alt="Preview"
                      className="w-16 h-12 object-cover rounded"
                    />
                    <span className="text-[11px] text-zinc-400 font-mono">Image verified preview</span>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-mono font-semibold text-zinc-300 mb-1">
                    YouTube Video ID (Optional)
                  </label>
                  <input
                    type="text"
                    value={formData.videoId}
                    onChange={(e) => setFormData({ ...formData, videoId: e.target.value })}
                    placeholder="vFjt-YWS6pc"
                    className="w-full px-3 py-2 bg-zinc-950 border border-zinc-700 rounded-lg text-xs text-white focus:outline-none focus:border-[#FEBE10]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono font-semibold text-zinc-300 mb-1">
                    Likes Counter
                  </label>
                  <input
                    type="number"
                    value={formData.likes}
                    onChange={(e) => setFormData({ ...formData, likes: parseInt(e.target.value, 10) || 0 })}
                    className="w-full px-3 py-2 bg-zinc-950 border border-zinc-700 rounded-lg text-xs text-white focus:outline-none focus:border-[#FEBE10]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono font-semibold text-zinc-300 mb-1">
                  Tags (Comma separated)
                </label>
                <input
                  type="text"
                  value={formData.tags}
                  onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                  placeholder="Bicycle Kick, Real Madrid, Turin, UCL"
                  className="w-full px-3 py-2 bg-zinc-950 border border-zinc-700 rounded-lg text-xs text-white focus:outline-none focus:border-[#FEBE10]"
                />
              </div>

              <div>
                <label className="block text-xs font-mono font-semibold text-zinc-300 mb-1">
                  Moment Story & Description *
                </label>
                <textarea
                  rows={3}
                  required
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="April 3, 2018: Minute 64. A superhuman 2.38-meter overhead bicycle kick..."
                  className="w-full px-3 py-2 bg-zinc-950 border border-zinc-700 rounded-lg text-xs text-white focus:outline-none focus:border-[#FEBE10]"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-zinc-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs font-medium rounded-lg bg-zinc-800 text-zinc-300 hover:bg-zinc-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold rounded-lg bg-[#FEBE10] text-black hover:opacity-90"
                >
                  {editingMoment ? "Save Moment" : "Create Moment"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
