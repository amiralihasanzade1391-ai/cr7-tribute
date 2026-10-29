"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { Menu, RefreshCw, ExternalLink, Database, Check, AlertCircle } from "lucide-react";
import { toast } from "@/components/admin/toast";

interface AdminNavbarProps {
  onToggleSidebar: () => void;
}

export function AdminNavbar({ onToggleSidebar }: AdminNavbarProps) {
  const pathname = usePathname();
  const [isSyncing, setIsSyncing] = useState(false);

  const getPageTitle = (path: string) => {
    if (path === "/admin") return { title: "Command Center", subtitle: "Real-time Site Metrics & System Health" };
    if (path.startsWith("/admin/media")) return { title: "Media Vault", subtitle: "Upload, Host & Manage Assets" };
    if (path.startsWith("/admin/trophies")) return { title: "Trophy Cabinet", subtitle: "Club, International & Individual Silverware" };
    if (path.startsWith("/admin/moments")) return { title: "Iconic Moments", subtitle: "Bicycle Kicks, Clutches & Celebrations" };
    if (path.startsWith("/admin/eras")) return { title: "Career Eras", subtitle: "Sporting to Al Nassr Storylines & Color Palettes" };
    if (path.startsWith("/admin/settings")) return { title: "Global Settings & SEO", subtitle: "Meta tags, Section Toggles & Visual FX" };
    return { title: "Admin Portal", subtitle: "CR7 Content Management System" };
  };

  const { title, subtitle } = getPageTitle(pathname);

  const handleSyncData = async () => {
    if (isSyncing) return;
    setIsSyncing(true);
    try {
      const res = await fetch("/api/admin/seed", { method: "POST" });
      const data = await res.json();
      if (data.ok) {
        toast.success("Database synced successfully with official CR7 records!");
        // Small delay to allow DB commit then refresh view
        setTimeout(() => {
          window.location.reload();
        }, 800);
      } else {
        toast.error("Sync failed: " + (data.error || "Unknown error"));
      }
    } catch (err: any) {
      toast.error("Network error during sync");
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between h-20 px-6 bg-[#070707]/90 border-b border-zinc-800/80 backdrop-blur-xl">
      {/* Left: Mobile trigger & Breadcrumb */}
      <div className="flex items-center gap-4">
        <button
          onClick={onToggleSidebar}
          className="p-2 text-zinc-400 hover:text-white rounded-lg hover:bg-zinc-800/60 lg:hidden border border-zinc-800"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div>
          <h1 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
            {title}
            <span className="w-1.5 h-1.5 rounded-full bg-[#FEBE10]" />
          </h1>
          <p className="text-xs text-zinc-400 hidden sm:block">{subtitle}</p>
        </div>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-3">
        {/* Quick Sync Button */}
        <button
          onClick={handleSyncData}
          disabled={isSyncing}
          className="flex items-center gap-2 px-3 py-1.5 text-xs font-semibold rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-200 border border-zinc-700/80 hover:border-[#FEBE10]/50 transition-all shadow-sm active:scale-95 disabled:opacity-50"
          title="Sync/Seed all trophies, moments, and eras from official records into SQLite"
        >
          <RefreshCw className={`w-3.5 h-3.5 text-[#FEBE10] ${isSyncing ? "animate-spin" : ""}`} />
          <span className="hidden sm:inline">{isSyncing ? "Syncing DB..." : "Sync DB"}</span>
        </button>

        {/* Database Status badge */}
        <div className="hidden md:flex items-center gap-2 px-3 py-1.5 text-xs rounded-lg bg-zinc-900/60 border border-zinc-800 text-zinc-300 font-mono">
          <Database className="w-3.5 h-3.5 text-emerald-400" />
          <span>SQLite Local</span>
          <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
        </div>

        {/* View Public Site button */}
        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-gradient-to-r from-[#FEBE10] to-[#e5ab0f] text-black hover:opacity-90 transition-all font-mono shadow-[0_0_15px_rgba(254,190,16,0.25)]"
        >
          <span>Live Site</span>
          <ExternalLink className="w-3 h-3 text-black" />
        </a>
      </div>
    </header>
  );
}
