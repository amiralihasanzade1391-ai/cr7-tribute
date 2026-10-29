"use client";

import { useState, useEffect } from "react";
import {
  Trophy,
  Plus,
  Search,
  Edit2,
  Trash2,
  ArrowUp,
  ArrowDown,
  ExternalLink,
  Check,
  AlertTriangle,
  X,
  RefreshCw,
  Sparkles,
  Layers,
} from "lucide-react";
import { toast } from "@/components/admin/toast";

interface TrophyItem {
  id: string;
  name: string;
  count: number;
  years: string; // JSON string
  icon: string;
  image: string | null;
  tier: string;
  category: string;
  description: string;
  firstWon: number | null;
  mostRecent: number | null;
  order: number;
}

export default function AdminTrophiesPage() {
  const [trophies, setTrophies] = useState<TrophyItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTrophy, setEditingTrophy] = useState<TrophyItem | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    id: "",
    name: "",
    count: 1,
    years: "",
    icon: "🏆",
    image: "",
    tier: "gold",
    category: "club",
    description: "",
    firstWon: "",
    mostRecent: "",
  });

  const loadTrophies = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/trophies");
      const data = await res.json();
      if (data.ok) {
        setTrophies(data.trophies || []);
      } else {
        toast.error("Failed to load trophies: " + data.error);
      }
    } catch {
      toast.error("Network error loading trophies");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTrophies();
  }, []);

  const openAddModal = () => {
    setEditingTrophy(null);
    setFormData({
      id: "",
      name: "",
      count: 1,
      years: "2008, 2014, 2016, 2017, 2018",
      icon: "🏆",
      image: "",
      tier: "gold",
      category: "club",
      description: "",
      firstWon: "2008",
      mostRecent: "2018",
    });
    setIsModalOpen(true);
  };

  const openEditModal = (t: TrophyItem) => {
    setEditingTrophy(t);
    let yearsStr = "";
    try {
      const parsed = JSON.parse(t.years);
      yearsStr = Array.isArray(parsed) ? parsed.join(", ") : t.years;
    } catch {
      yearsStr = t.years;
    }

    setFormData({
      id: t.id,
      name: t.name,
      count: t.count,
      years: yearsStr,
      icon: t.icon,
      image: t.image || "",
      tier: t.tier,
      category: t.category,
      description: t.description,
      firstWon: t.firstWon ? String(t.firstWon) : "",
      mostRecent: t.mostRecent ? String(t.mostRecent) : "",
    });
    setIsModalOpen(true);
  };

  const handleSaveTrophy = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    try {
      const isEdit = Boolean(editingTrophy);
      const url = "/api/admin/trophies";
      const method = isEdit ? "PUT" : "POST";

      const payload = {
        ...formData,
        id: isEdit ? editingTrophy!.id : formData.id || undefined,
      };

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (data.ok) {
        toast.success(isEdit ? "Trophy updated!" : "Trophy created!");
        setIsModalOpen(false);
        loadTrophies();
      } else {
        toast.error(data.error || "Failed to save trophy");
      }
    } catch {
      toast.error("Network error saving trophy");
    }
  };

  const handleDeleteTrophy = async (t: TrophyItem) => {
    if (!confirm(`Delete trophy "${t.name}"?`)) return;

    try {
      const res = await fetch(`/api/admin/trophies?id=${t.id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.ok) {
        toast.success("Trophy removed");
        setTrophies((prev) => prev.filter((item) => item.id !== t.id));
      } else {
        toast.error(data.error || "Failed to delete");
      }
    } catch {
      toast.error("Network error deleting trophy");
    }
  };

  // Reorder up / down
  const moveTrophy = async (index: number, direction: "up" | "down") => {
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= trophies.length) return;

    const reordered = [...trophies];
    const temp = reordered[index];
    reordered[index] = reordered[targetIndex];
    reordered[targetIndex] = temp;

    const payload = reordered.map((item, idx) => ({ id: item.id, order: idx }));
    setTrophies(reordered);

    try {
      await fetch("/api/admin/trophies", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reorder: payload }),
      });
      toast.success("Display order saved");
    } catch {
      toast.error("Failed to save order");
      loadTrophies();
    }
  };

  const filtered = trophies.filter((t) => {
    const matchCat = categoryFilter === "all" || t.category === categoryFilter;
    const matchSearch =
      !search ||
      t.name.toLowerCase().includes(search.toLowerCase()) ||
      t.description.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            CR7 Trophy Cabinet
            <span className="text-xs px-2 py-0.5 rounded font-mono bg-zinc-800 text-[#FEBE10] border border-zinc-700">
              {trophies.length} Titles
            </span>
          </h2>
          <p className="text-xs text-zinc-400 mt-0.5">
            Manage official silverware, count multipliers, winning years, and verified trophy photos.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={openAddModal}
            className="flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-lg bg-gradient-to-r from-[#FEBE10] to-[#e5ab0f] text-black hover:opacity-90 transition-all font-mono shadow-[0_0_15px_rgba(254,190,16,0.25)]"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Trophy</span>
          </button>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 p-4 rounded-xl bg-zinc-900/70 border border-zinc-800/80">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
          <input
            type="text"
            placeholder="Search trophies by name or description..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-zinc-950/80 border border-zinc-800 rounded-lg text-xs text-zinc-200 placeholder:text-zinc-500 focus:outline-none focus:border-[#FEBE10]/60 transition-colors"
          />
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center rounded-lg bg-zinc-950/80 border border-zinc-800 p-1">
            {["all", "club", "international", "individual"].map((cat) => (
              <button
                key={cat}
                onClick={() => setCategoryFilter(cat)}
                className={`px-3 py-1 rounded text-xs font-medium capitalize transition-colors ${
                  categoryFilter === cat
                    ? "bg-[#FEBE10] text-black font-semibold"
                    : "text-zinc-400 hover:text-zinc-200"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <button
            onClick={loadTrophies}
            title="Refresh"
            className="p-2 rounded-lg bg-zinc-950/80 border border-zinc-800 text-zinc-400 hover:text-white transition-colors"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          </button>
        </div>
      </div>

      {/* Trophy Cards Table / List */}
      {loading ? (
        <div className="space-y-3">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-20 rounded-xl bg-zinc-900/50 border border-zinc-800 animate-pulse" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 rounded-2xl bg-zinc-900/30 border border-zinc-800/80">
          <Trophy className="w-12 h-12 text-zinc-600 mx-auto mb-3" />
          <h3 className="text-sm font-bold text-zinc-300">No trophies match filter</h3>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((t, index) => {
            let parsedYears: string[] = [];
            try {
              const res = JSON.parse(t.years);
              parsedYears = Array.isArray(res) ? res : [t.years];
            } catch {
              parsedYears = [t.years];
            }

            return (
              <div
                key={t.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl bg-zinc-900/60 hover:bg-zinc-900/90 border border-zinc-800 hover:border-zinc-700 transition-all gap-4"
              >
                {/* Left: Reorder, Image, Name & Info */}
                <div className="flex items-center gap-4">
                  {/* Reorder Buttons */}
                  <div className="flex flex-col gap-1">
                    <button
                      onClick={() => moveTrophy(index, "up")}
                      disabled={index === 0}
                      className="p-1 rounded bg-zinc-800/80 hover:bg-zinc-700 text-zinc-400 hover:text-white disabled:opacity-30 disabled:pointer-events-none"
                    >
                      <ArrowUp className="w-3 h-3" />
                    </button>
                    <button
                      onClick={() => moveTrophy(index, "down")}
                      disabled={index === trophies.length - 1}
                      className="p-1 rounded bg-zinc-800/80 hover:bg-zinc-700 text-zinc-400 hover:text-white disabled:opacity-30 disabled:pointer-events-none"
                    >
                      <ArrowDown className="w-3 h-3" />
                    </button>
                  </div>

                  {/* Thumbnail */}
                  <div className="relative w-14 h-14 rounded-lg bg-zinc-950 border border-zinc-800 flex items-center justify-center overflow-hidden shrink-0">
                    {t.image ? (
                      <img
                        src={t.image}
                        alt={t.name}
                        className="w-full h-full object-contain p-1"
                        onError={(e) => {
                          (e.target as HTMLElement).style.display = "none";
                        }}
                      />
                    ) : (
                      <span className="text-xl">{t.icon || "🏆"}</span>
                    )}
                  </div>

                  {/* Details */}
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-bold text-white tracking-tight">{t.name}</h4>
                      <span className="text-xs px-2 py-0.5 rounded font-mono font-bold bg-[#FEBE10]/15 text-[#FEBE10] border border-[#FEBE10]/30">
                        x{t.count}
                      </span>
                      <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-400 border border-zinc-700">
                        {t.category}
                      </span>
                    </div>
                    <p className="text-xs text-zinc-400 line-clamp-1">{t.description}</p>
                    <div className="flex flex-wrap items-center gap-1.5 text-[10px] font-mono text-zinc-500">
                      <span>Years:</span>
                      {parsedYears.slice(0, 8).map((y, idx) => (
                        <span key={idx} className="text-zinc-300">
                          {y}
                          {idx < parsedYears.length - 1 && idx < 7 ? "," : ""}
                        </span>
                      ))}
                      {parsedYears.length > 8 && <span>+{parsedYears.length - 8} more</span>}
                    </div>
                  </div>
                </div>

                {/* Right: Actions */}
                <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
                  <button
                    onClick={() => openEditModal(t)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-medium border border-zinc-700 hover:border-zinc-600 transition-colors"
                  >
                    <Edit2 className="w-3.5 h-3.5 text-[#FEBE10]" />
                    <span>Edit</span>
                  </button>

                  <button
                    onClick={() => handleDeleteTrophy(t)}
                    className="p-1.5 rounded-lg bg-zinc-800 hover:bg-rose-500/20 text-zinc-400 hover:text-rose-400 border border-zinc-700 hover:border-rose-500/30 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add / Edit Trophy Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
          <div className="relative w-full max-w-xl rounded-2xl bg-zinc-900 border border-zinc-800 p-6 shadow-2xl space-y-5 my-8">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <div className="flex items-center gap-2">
                <Trophy className="w-5 h-5 text-[#FEBE10]" />
                <h3 className="text-base font-bold text-white">
                  {editingTrophy ? "Edit Trophy Details" : "Add New Silverware"}
                </h3>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded text-zinc-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveTrophy} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-mono font-semibold text-zinc-300 mb-1">
                    Trophy Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="UEFA Champions League"
                    className="w-full px-3 py-2 bg-zinc-950 border border-zinc-700 rounded-lg text-xs text-white focus:outline-none focus:border-[#FEBE10]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono font-semibold text-zinc-300 mb-1">
                    Count Won *
                  </label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={formData.count}
                    onChange={(e) => setFormData({ ...formData, count: parseInt(e.target.value, 10) || 1 })}
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
                    <option value="club">Club Silverware</option>
                    <option value="international">International (Portugal)</option>
                    <option value="individual">Individual Honors</option>
                    <option value="records">Records & Milestones</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-mono font-semibold text-zinc-300 mb-1">
                    Tier / Prestige
                  </label>
                  <select
                    value={formData.tier}
                    onChange={(e) => setFormData({ ...formData, tier: e.target.value })}
                    className="w-full px-3 py-2 bg-zinc-950 border border-zinc-700 rounded-lg text-xs text-white focus:outline-none focus:border-[#FEBE10]"
                  >
                    <option value="gold">Gold (Elite Trophy)</option>
                    <option value="silver">Silver (Major Cup)</option>
                    <option value="bronze">Bronze (Supercup / Regional)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono font-semibold text-zinc-300 mb-1">
                  Years Won (Comma separated)
                </label>
                <input
                  type="text"
                  value={formData.years}
                  onChange={(e) => setFormData({ ...formData, years: e.target.value })}
                  placeholder="2008, 2014, 2016, 2017, 2018"
                  className="w-full px-3 py-2 bg-zinc-950 border border-zinc-700 rounded-lg text-xs text-white focus:outline-none focus:border-[#FEBE10]"
                />
              </div>

              <div>
                <label className="block text-xs font-mono font-semibold text-zinc-300 mb-1">
                  Verified Wikimedia / CDN Image URL
                </label>
                <input
                  type="url"
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  placeholder="https://upload.wikimedia.org/.../500px-trophy.jpg"
                  className="w-full px-3 py-2 bg-zinc-950 border border-zinc-700 rounded-lg text-xs text-white focus:outline-none focus:border-[#FEBE10]"
                />
                {formData.image && (
                  <div className="mt-2 p-2 rounded bg-zinc-950 border border-zinc-800 flex items-center gap-3">
                    <img
                      src={formData.image}
                      alt="Preview"
                      className="w-12 h-12 object-contain bg-zinc-900 rounded p-1"
                    />
                    <span className="text-[11px] text-zinc-400 font-mono">Live image preview</span>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs font-mono font-semibold text-zinc-300 mb-1">
                  Historical Significance / Description
                </label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Won five times across Manchester United and Real Madrid..."
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
                  {editingTrophy ? "Save Changes" : "Create Trophy"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
