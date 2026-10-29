"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import {
  Upload,
  Link as LinkIcon,
  Search,
  Trash2,
  Copy,
  ExternalLink,
  Eye,
  RefreshCw,
  X,
  Check,
  Film,
  Image as ImageIcon,
  CheckSquare,
  Square,
  AlertTriangle,
  FolderOpen,
} from "lucide-react";
import { toast } from "@/components/admin/toast";

interface MediaItem {
  id: string;
  filename: string;
  url: string;
  type: string;
  size: number | null;
  createdAt: string;
}

export default function MediaLibraryPage() {
  const [items, setItems] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<"all" | "image" | "video">("all");
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  // Uploading state
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [targetFolder, setTargetFolder] = useState("uploads");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // External URL modal state
  const [isUrlModalOpen, setIsUrlModalOpen] = useState(false);
  const [externalUrl, setExternalUrl] = useState("");
  const [externalFilename, setExternalFilename] = useState("");
  const [urlPreviewValid, setUrlPreviewValid] = useState<boolean | null>(null);
  const [isSubmittingUrl, setIsSubmittingUrl] = useState(false);

  // Lightbox preview modal state
  const [previewItem, setPreviewItem] = useState<MediaItem | null>(null);

  // Edit / Replace modal state
  const [editingItem, setEditingItem] = useState<MediaItem | null>(null);
  const [editUrl, setEditUrl] = useState("");
  const [editFilename, setEditFilename] = useState("");

  const loadMedia = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/media?type=${typeFilter}&search=${encodeURIComponent(search)}`);
      const data = await res.json();
      if (data.ok) {
        setItems(data.media || []);
      } else {
        toast.error("Failed to load media: " + data.error);
      }
    } catch {
      toast.error("Network error loading media");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMedia();
  }, [typeFilter]);

  // Handle Search submit / debounce
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    loadMedia();
  };

  // Upload local file
  const handleFileUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setIsUploading(true);

    try {
      let uploadedCount = 0;
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const formData = new FormData();
        formData.append("file", file);
        formData.append("folder", targetFolder);

        const res = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });
        const data = await res.json();
        if (data.ok) {
          uploadedCount++;
        }
      }

      toast.success(`Successfully uploaded ${uploadedCount} file(s)!`);
      loadMedia();
    } catch (err) {
      toast.error("Failed to upload files");
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  // Register external URL
  const handleAddExternalUrl = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!externalUrl.trim()) return;

    setIsSubmittingUrl(true);
    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          url: externalUrl.trim(),
          filename: externalFilename.trim() || undefined,
        }),
      });
      const data = await res.json();
      if (data.ok) {
        toast.success("External media registered in vault!");
        setIsUrlModalOpen(false);
        setExternalUrl("");
        setExternalFilename("");
        setUrlPreviewValid(null);
        loadMedia();
      } else {
        toast.error(data.error || "Failed to add URL");
      }
    } catch {
      toast.error("Network error adding URL");
    } finally {
      setIsSubmittingUrl(false);
    }
  };

  // Copy to clipboard
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("URL copied to clipboard!");
  };

  // Single delete
  const handleDeleteItem = async (item: MediaItem) => {
    if (!confirm(`Delete "${item.filename}"? This cannot be undone.`)) return;

    try {
      const res = await fetch("/api/media", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: item.id }),
      });
      const data = await res.json();
      if (data.ok) {
        toast.success("Media deleted successfully");
        setItems((prev) => prev.filter((i) => i.id !== item.id));
        setSelectedIds((prev) => {
          const next = new Set(prev);
          next.delete(item.id);
          return next;
        });
      } else {
        toast.error("Delete failed: " + data.error);
      }
    } catch {
      toast.error("Network error during delete");
    }
  };

  // Bulk delete
  const handleBulkDelete = async () => {
    if (selectedIds.size === 0) return;
    if (!confirm(`Permanently delete ${selectedIds.size} selected item(s)?`)) return;

    try {
      const res = await fetch("/api/media", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids: Array.from(selectedIds) }),
      });
      const data = await res.json();
      if (data.ok) {
        toast.success(`Deleted ${data.deleted} items`);
        setItems((prev) => prev.filter((i) => !selectedIds.has(i.id)));
        setSelectedIds(new Set());
      } else {
        toast.error("Bulk delete failed");
      }
    } catch {
      toast.error("Network error during bulk delete");
    }
  };

  // Toggle selection
  const toggleSelect = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  // Select all visible
  const toggleSelectAll = () => {
    if (selectedIds.size === items.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(items.map((i) => i.id)));
    }
  };

  // Handle Edit/Replace
  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;

    try {
      const res = await fetch("/api/media", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: editingItem.id,
          url: editUrl,
          filename: editFilename,
        }),
      });
      const data = await res.json();
      if (data.ok) {
        toast.success("Media record updated!");
        setEditingItem(null);
        loadMedia();
      } else {
        toast.error("Update failed: " + data.error);
      }
    } catch {
      toast.error("Network error updating item");
    }
  };

  const formatFileSize = (bytes: number | null) => {
    if (!bytes) return "External CDN";
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            CR7 Media Vault
            <span className="text-xs px-2 py-0.5 rounded font-mono bg-zinc-800 text-[#FEBE10] border border-zinc-700">
              {items.length} Assets
            </span>
          </h2>
          <p className="text-xs text-zinc-400 mt-0.5">
            Store, preview, and organize high-resolution imagery and video reels.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setIsUrlModalOpen(true)}
            className="flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-100 border border-zinc-700 hover:border-[#FEBE10]/40 transition-colors shadow-sm"
          >
            <LinkIcon className="w-3.5 h-3.5 text-[#FEBE10]" />
            <span>Add External URL</span>
          </button>

          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-lg bg-gradient-to-r from-[#FEBE10] to-[#e5ab0f] text-black hover:opacity-90 transition-all font-mono shadow-[0_0_15px_rgba(254,190,16,0.25)]"
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Upload File</span>
          </button>

          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/*,video/*"
            className="hidden"
            onChange={(e) => handleFileUpload(e.target.files)}
          />
        </div>
      </div>

      {/* Drag & Drop Upload Banner */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setIsDragging(false);
          handleFileUpload(e.dataTransfer.files);
        }}
        className={`relative border-2 border-dashed rounded-xl p-6 text-center transition-all cursor-pointer ${
          isDragging
            ? "border-[#FEBE10] bg-[#FEBE10]/10 scale-[1.01]"
            : "border-zinc-800 hover:border-zinc-700 bg-zinc-900/40"
        }`}
        onClick={() => fileInputRef.current?.click()}
      >
        <div className="flex flex-col items-center justify-center space-y-2 pointer-events-none">
          <div className="p-3 rounded-full bg-zinc-800/80 border border-zinc-700 text-[#FEBE10]">
            <Upload className={`w-6 h-6 ${isUploading ? "animate-bounce" : ""}`} />
          </div>
          <div>
            <p className="text-sm font-semibold text-zinc-200">
              {isUploading
                ? "Uploading files to server..."
                : "Drag & drop photos or clips here, or click to browse"}
            </p>
            <p className="text-xs text-zinc-500 mt-1">
              Supports JPEG, PNG, WebP, SVG, and MP4 (automatically optimized and indexed)
            </p>
          </div>
        </div>

        {/* Target Folder Selector */}
        <div
          className="mt-3 flex items-center justify-center gap-2 text-xs font-mono text-zinc-400"
          onClick={(e) => e.stopPropagation()}
        >
          <FolderOpen className="w-3.5 h-3.5 text-[#FEBE10]" />
          <span>Destination Folder:</span>
          <select
            value={targetFolder}
            onChange={(e) => setTargetFolder(e.target.value)}
            className="bg-zinc-800 border border-zinc-700 rounded px-2 py-0.5 text-xs text-zinc-200 focus:outline-none focus:border-[#FEBE10]"
          >
            <option value="uploads">/uploads (General)</option>
            <option value="eras">/images/eras</option>
            <option value="moments">/images/moments</option>
            <option value="trophies">/images/trophies</option>
            <option value="hero">/images/hero</option>
          </select>
        </div>
      </div>

      {/* Filter, Search & Bulk Actions Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 p-4 rounded-xl bg-zinc-900/70 border border-zinc-800/80">
        {/* Search */}
        <form onSubmit={handleSearch} className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
          <input
            type="text"
            placeholder="Search by filename or URL..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-zinc-950/80 border border-zinc-800 rounded-lg text-xs text-zinc-200 placeholder:text-zinc-500 focus:outline-none focus:border-[#FEBE10]/60 transition-colors"
          />
        </form>

        {/* Filter Pills */}
        <div className="flex items-center gap-2">
          <div className="flex items-center rounded-lg bg-zinc-950/80 border border-zinc-800 p-1">
            <button
              onClick={() => setTypeFilter("all")}
              className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
                typeFilter === "all"
                  ? "bg-[#FEBE10] text-black font-semibold"
                  : "text-zinc-400 hover:text-zinc-200"
              }`}
            >
              All
            </button>
            <button
              onClick={() => setTypeFilter("image")}
              className={`flex items-center gap-1 px-3 py-1 rounded text-xs font-medium transition-colors ${
                typeFilter === "image"
                  ? "bg-[#FEBE10] text-black font-semibold"
                  : "text-zinc-400 hover:text-zinc-200"
              }`}
            >
              <ImageIcon className="w-3 h-3" />
              Images
            </button>
            <button
              onClick={() => setTypeFilter("video")}
              className={`flex items-center gap-1 px-3 py-1 rounded text-xs font-medium transition-colors ${
                typeFilter === "video"
                  ? "bg-[#FEBE10] text-black font-semibold"
                  : "text-zinc-400 hover:text-zinc-200"
              }`}
            >
              <Film className="w-3 h-3" />
              Videos
            </button>
          </div>

          <button
            onClick={loadMedia}
            title="Refresh list"
            className="p-2 rounded-lg bg-zinc-950/80 border border-zinc-800 text-zinc-400 hover:text-white transition-colors"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          </button>
        </div>

        {/* Bulk select and delete */}
        <div className="flex items-center gap-2 border-t md:border-t-0 pt-2 md:pt-0 border-zinc-800">
          <button
            onClick={toggleSelectAll}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded text-xs text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50"
          >
            {selectedIds.size === items.length && items.length > 0 ? (
              <CheckSquare className="w-4 h-4 text-[#FEBE10]" />
            ) : (
              <Square className="w-4 h-4" />
            )}
            <span>Select All</span>
          </button>

          {selectedIds.size > 0 && (
            <button
              onClick={handleBulkDelete}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs font-medium hover:bg-rose-500/25 transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Delete ({selectedIds.size})</span>
            </button>
          )}
        </div>
      </div>

      {/* Media Grid Cards */}
      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {[...Array(10)].map((_, i) => (
            <div
              key={i}
              className="aspect-square rounded-xl bg-zinc-900/60 border border-zinc-800/80 animate-pulse"
            />
          ))}
        </div>
      ) : items.length === 0 ? (
        <div className="text-center py-16 rounded-2xl bg-zinc-900/30 border border-zinc-800/80">
          <ImageIcon className="w-12 h-12 text-zinc-600 mx-auto mb-3" />
          <h3 className="text-sm font-bold text-zinc-300">No media found</h3>
          <p className="text-xs text-zinc-500 mt-1 max-w-sm mx-auto">
            Upload new images or register external Wikimedia Commons URLs using the buttons above.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {items.map((item) => {
            const isSelected = selectedIds.has(item.id);
            const isVideo = item.type === "video";

            return (
              <div
                key={item.id}
                className={`group relative flex flex-col rounded-xl overflow-hidden bg-zinc-900/70 border transition-all duration-200 ${
                  isSelected
                    ? "border-[#FEBE10] shadow-[0_0_15px_rgba(254,190,16,0.2)]"
                    : "border-zinc-800 hover:border-zinc-700"
                }`}
              >
                {/* Selection Checkbox */}
                <button
                  onClick={() => toggleSelect(item.id)}
                  className="absolute top-2 left-2 z-10 p-1 rounded-md bg-black/60 backdrop-blur-md text-white transition-opacity hover:scale-110"
                >
                  {isSelected ? (
                    <CheckSquare className="w-4 h-4 text-[#FEBE10]" />
                  ) : (
                    <Square className="w-4 h-4 text-zinc-400 group-hover:text-white" />
                  )}
                </button>

                {/* Media Preview Box */}
                <div
                  onClick={() => setPreviewItem(item)}
                  className="relative aspect-square w-full bg-zinc-950 flex items-center justify-center overflow-hidden cursor-pointer"
                >
                  {isVideo ? (
                    <div className="flex flex-col items-center justify-center text-zinc-400 group-hover:text-[#FEBE10] transition-colors">
                      <Film className="w-10 h-10 mb-1" />
                      <span className="text-[10px] font-mono uppercase">Video Clip</span>
                    </div>
                  ) : (
                    <img
                      src={item.url}
                      alt={item.filename}
                      className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='100' height='100' fill='%23333'><rect width='100' height='100'/><text x='50%' y='50%' fill='%23888' font-size='10' text-anchor='middle'>Broken Image</text></svg>";
                      }}
                    />
                  )}

                  {/* Hover Overlay with Quick Actions */}
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        copyToClipboard(item.url);
                      }}
                      title="Copy URL"
                      className="p-2 rounded-lg bg-zinc-800/90 text-zinc-200 hover:text-[#FEBE10] hover:bg-zinc-800 transition-colors"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setPreviewItem(item);
                      }}
                      title="Expand Lightbox"
                      className="p-2 rounded-lg bg-zinc-800/90 text-zinc-200 hover:text-[#FEBE10] hover:bg-zinc-800 transition-colors"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteItem(item);
                      }}
                      title="Delete Asset"
                      className="p-2 rounded-lg bg-zinc-800/90 text-zinc-200 hover:text-rose-400 hover:bg-zinc-800 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Card Details */}
                <div className="p-3 bg-zinc-950/80 border-t border-zinc-800/60 flex-1 flex flex-col justify-between">
                  <div className="overflow-hidden">
                    <p
                      title={item.filename}
                      className="text-xs font-semibold text-zinc-200 truncate"
                    >
                      {item.filename}
                    </p>
                    <p className="text-[10px] font-mono text-zinc-500 truncate mt-0.5">
                      {item.url}
                    </p>
                  </div>

                  <div className="mt-2.5 flex items-center justify-between text-[10px] font-mono text-zinc-500">
                    <span>{formatFileSize(item.size)}</span>
                    <button
                      onClick={() => copyToClipboard(item.url)}
                      className="text-zinc-400 hover:text-[#FEBE10] flex items-center gap-1 font-semibold"
                    >
                      <Copy className="w-3 h-3" />
                      Copy
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* External URL Registration Modal */}
      {isUrlModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="relative w-full max-w-md rounded-2xl bg-zinc-900 border border-zinc-800 p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <div className="flex items-center gap-2">
                <LinkIcon className="w-4 h-4 text-[#FEBE10]" />
                <h3 className="text-base font-bold text-white">Add External Media URL</h3>
              </div>
              <button
                onClick={() => setIsUrlModalOpen(false)}
                className="p-1 rounded text-zinc-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddExternalUrl} className="space-y-4">
              <div>
                <label className="block text-xs font-mono font-semibold text-zinc-300 mb-1">
                  Media URL (Wikimedia Commons / CDN) *
                </label>
                <input
                  type="url"
                  required
                  placeholder="https://upload.wikimedia.org/.../500px-example.jpg"
                  value={externalUrl}
                  onChange={(e) => {
                    setExternalUrl(e.target.value);
                    setUrlPreviewValid(null);
                  }}
                  className="w-full px-3 py-2 bg-zinc-950 border border-zinc-700 rounded-lg text-xs text-white focus:outline-none focus:border-[#FEBE10]"
                />
              </div>

              <div>
                <label className="block text-xs font-mono font-semibold text-zinc-300 mb-1">
                  Custom Label / Filename (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g., 2008-ucl-final-trophy.jpg"
                  value={externalFilename}
                  onChange={(e) => setExternalFilename(e.target.value)}
                  className="w-full px-3 py-2 bg-zinc-950 border border-zinc-700 rounded-lg text-xs text-white focus:outline-none focus:border-[#FEBE10]"
                />
              </div>

              {/* Instant Image Preview */}
              {externalUrl && (
                <div className="border border-zinc-800 rounded-lg p-2 bg-zinc-950">
                  <p className="text-[10px] font-mono text-zinc-400 mb-1">Live Asset Preview:</p>
                  <div className="relative h-40 w-full flex items-center justify-center bg-zinc-900 rounded overflow-hidden">
                    <img
                      src={externalUrl}
                      alt="Preview"
                      onLoad={() => setUrlPreviewValid(true)}
                      onError={() => setUrlPreviewValid(false)}
                      className="max-h-full max-w-full object-contain"
                    />
                  </div>
                  {urlPreviewValid === true && (
                    <p className="text-[10px] text-emerald-400 font-mono mt-1 flex items-center gap-1">
                      <Check className="w-3 h-3" /> Valid media source verified
                    </p>
                  )}
                  {urlPreviewValid === false && (
                    <p className="text-[10px] text-rose-400 font-mono mt-1 flex items-center gap-1">
                      <AlertTriangle className="w-3 h-3" /> Unable to load image from URL
                    </p>
                  )}
                </div>
              )}

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsUrlModalOpen(false)}
                  className="px-4 py-2 text-xs font-medium rounded-lg bg-zinc-800 text-zinc-300 hover:bg-zinc-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingUrl || !externalUrl}
                  className="px-4 py-2 text-xs font-bold rounded-lg bg-[#FEBE10] text-black hover:opacity-90 disabled:opacity-50"
                >
                  {isSubmittingUrl ? "Saving..." : "Save to Vault"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Lightbox Modal */}
      {previewItem && (
        <div
          onClick={() => setPreviewItem(null)}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-lg"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-4xl w-full bg-zinc-900 rounded-2xl border border-zinc-800 overflow-hidden shadow-2xl"
          >
            <div className="flex items-center justify-between p-4 border-b border-zinc-800">
              <div className="overflow-hidden pr-4">
                <h4 className="text-sm font-bold text-white truncate">{previewItem.filename}</h4>
                <p className="text-[11px] font-mono text-zinc-400 truncate mt-0.5">
                  {previewItem.url}
                </p>
              </div>
              <button
                onClick={() => setPreviewItem(null)}
                className="p-1 rounded text-zinc-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="relative max-h-[65vh] flex items-center justify-center bg-black p-4 overflow-hidden">
              {previewItem.type === "video" ? (
                <video src={previewItem.url} controls className="max-h-[60vh] max-w-full rounded" />
              ) : (
                <img
                  src={previewItem.url}
                  alt={previewItem.filename}
                  className="max-h-[60vh] max-w-full object-contain rounded"
                />
              )}
            </div>

            <div className="p-4 bg-zinc-950 flex flex-wrap items-center justify-between gap-3 text-xs font-mono text-zinc-400">
              <div className="flex items-center gap-4">
                <span>Type: <strong className="text-white uppercase">{previewItem.type}</strong></span>
                <span>Size: <strong className="text-white">{formatFileSize(previewItem.size)}</strong></span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => copyToClipboard(previewItem.url)}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-zinc-800 text-zinc-200 hover:text-[#FEBE10] hover:bg-zinc-700"
                >
                  <Copy className="w-3.5 h-3.5" />
                  Copy URL
                </button>
                <a
                  href={previewItem.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#FEBE10] text-black font-bold hover:opacity-90"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  Open Direct
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
