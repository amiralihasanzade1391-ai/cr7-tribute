"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, Search, Trash2, Copy } from "lucide-react";
import { toast, ToastContainer } from "@/components/admin/toast";

export default function MediaLibrary() {
  const [media, setMedia] = useState<Record<string, string[]>>({});
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const loadMedia = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/media");
      const data = await res.json();
      setMedia(data);
    } catch {
      toast.error("Failed to load media");
    }
    setLoading(false);
  };

  useEffect(() => {
    loadMedia();
  }, []);

  const copyPath = (folder: string, filename: string) => {
    const path = `/images/${folder}/${filename}`;
    navigator.clipboard.writeText(path);
    toast.success("Copied: " + path);
  };

  const deleteFile = async (folder: string, filename: string) => {
    if (!confirm(`Delete ${filename}?`)) return;
    const path = `/images/${folder}/${filename}`;
    try {
      const res = await fetch("/api/media", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ paths: [path] }),
      });
      if (res.ok) {
        toast.success("Deleted");
        setSelected((prev) => {
          const next = new Set(prev);
          next.delete(path);
          return next;
        });
        loadMedia();
      } else {
        toast.error("Delete failed");
      }
    } catch {
      toast.error("Delete failed");
    }
  };

  const filteredMedia = Object.entries(media).reduce((acc, [folder, files]) => {
    const filtered = files.filter((f) =>
      f.toLowerCase().includes(search.toLowerCase())
    );
    if (filtered.length > 0 || !search) acc[folder] = filtered;
    return acc;
  }, {} as Record<string, string[]>);

  const totalFiles = Object.values(media).reduce((sum, files) => sum + files.length, 0);

  const toggleSelect = (path: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(path)) next.delete(path);
      else next.add(path);
      return next;
    });
  };

  const selectAll = () => {
    const allVisible = new Set<string>();
    Object.entries(filteredMedia).forEach(([folder, files]) => {
      files.forEach((file) => allVisible.add(`/images/${folder}/${file}`));
    });
    setSelected(allVisible);
  };

  const deselectAll = () => {
    setSelected(new Set());
  };

  const deleteSelected = async () => {
    if (selected.size === 0) return;
    if (!confirm(`Delete ${selected.size} selected file(s)?`)) return;
    try {
      const res = await fetch("/api/media", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ paths: Array.from(selected) }),
      });
      if (res.ok) {
        toast.success(`Deleted ${selected.size} files`);
        setSelected(new Set());
        loadMedia();
      } else {
        toast.error("Delete failed");
      }
    } catch {
      toast.error("Delete failed");
    }
  };

  return (
    <div className="min-h-screen bg-black text-white p-8 pb-24">
      <div className="max-w-7xl mx-auto">
        <Link href="/admin" className="text-yellow-400 flex items-center gap-2 mb-4 hover:underline">
          <ArrowLeft size={16} /> Back to Admin
        </Link>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-4xl font-bold text-yellow-400 font-anton uppercase">
              Media Library
            </h1>
            <p className="text-zinc-500 mt-1">
              {totalFiles} files across {Object.keys(media).length} folders
            </p>
          </div>
        </div>

        {/* Toolbar: Bulk Selection & Search */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8 bg-zinc-900 border border-zinc-800 p-4 rounded-xl">
          <div className="flex items-center gap-3">
            <button
              onClick={selectAll}
              className="px-3.5 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-xs font-semibold text-zinc-200 transition"
            >
              Select All
            </button>
            <button
              onClick={deselectAll}
              className="px-3.5 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-xs font-semibold text-zinc-200 transition"
            >
              Deselect All
            </button>
            <span className="text-xs text-yellow-400 font-mono">
              {selected.size} selected
            </span>
          </div>

          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={16} />
            <input
              type="text"
              placeholder="Search files..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 pr-4 py-2 rounded-lg bg-zinc-950 border border-zinc-800 text-white w-72 text-sm focus:outline-none focus:border-yellow-400 transition"
            />
          </div>
        </div>

        {loading && <p className="text-zinc-500">Loading media files...</p>}

        {Object.entries(filteredMedia).map(([folder, files]) => (
          <div key={folder} className="mb-10">
            <h2 className="text-xl font-bold text-yellow-400 mb-4 capitalize">
              {folder} <span className="text-zinc-600 text-sm">({files.length})</span>
            </h2>
            {files.length === 0 ? (
              <p className="text-zinc-600 text-sm">No files</p>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3">
                {files.map((file) => {
                  const filePath = `/images/${folder}/${file}`;
                  const isChecked = selected.has(filePath);

                  return (
                    <div
                      key={file}
                      className={`group relative bg-zinc-900 rounded-lg overflow-hidden border transition ${
                        isChecked
                          ? "border-yellow-400 ring-2 ring-yellow-400"
                          : "border-zinc-800 hover:border-yellow-500/50"
                      }`}
                    >
                      {/* Checkbox top-left */}
                      <div
                        className={`absolute top-1.5 left-1.5 z-10 transition cursor-pointer ${
                          isChecked ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                        }`}
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleSelect(filePath);
                        }}
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => {}}
                          className="w-4 h-4 rounded accent-yellow-400 cursor-pointer"
                        />
                      </div>

                      <img
                        src={filePath}
                        alt={file}
                        className="w-full h-32 object-cover cursor-pointer"
                        onClick={() => toggleSelect(filePath)}
                      />
                      <div className="p-2">
                        <p className="text-[10px] text-zinc-400 truncate" title={file}>
                          {file}
                        </p>
                      </div>
                      <div className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition flex gap-1 z-10">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            copyPath(folder, file);
                          }}
                          className="bg-blue-600 hover:bg-blue-500 p-1.5 rounded text-white transition"
                          title="Copy path"
                        >
                          <Copy size={12} />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteFile(folder, file);
                          }}
                          className="bg-red-600 hover:bg-red-500 p-1.5 rounded text-white transition"
                          title="Delete"
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        ))}

        {/* Floating Bulk Action Bar */}
        {selected.size > 0 && (
          <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-40 bg-zinc-900/95 border border-zinc-700 backdrop-blur-md px-6 py-3.5 rounded-2xl shadow-2xl flex items-center gap-4 animate-in slide-in-from-bottom">
            <span className="text-sm font-semibold text-yellow-400">
              {selected.size} file{selected.size > 1 ? "s" : ""} selected
            </span>
            <button
              onClick={deleteSelected}
              className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white font-semibold text-xs transition flex items-center gap-1.5 shadow-lg shadow-red-600/20"
            >
              <Trash2 size={14} />
              <span>Delete Selected</span>
            </button>
            <button
              onClick={deselectAll}
              className="px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-medium text-xs transition"
            >
              Clear
            </button>
          </div>
        )}

        <ToastContainer />
      </div>
    </div>
  );
}
