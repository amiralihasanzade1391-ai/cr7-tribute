"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Trophy,
  Sparkles,
  Image as ImageIcon,
  Layers,
  ArrowUpRight,
  RefreshCw,
  Flame,
  ShieldCheck,
  Activity,
  PlusCircle,
  Database,
  ExternalLink,
  Sliders,
  CheckCircle2,
} from "lucide-react";
import { toast } from "@/components/admin/toast";

interface StatsData {
  mediaCount: number;
  trophyCount: number;
  momentCount: number;
  eraCount: number;
  goalsCount: number;
  settingsCount: number;
  careerGoals: number;
  roadTo1000Remaining: number;
  goalsBreakdown: Array<{
    club: string;
    goals: number;
    period: string;
    color: string;
    ratio: string;
  }>;
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<StatsData | null>(null);
  const [activityLogs, setActivityLogs] = useState<any[]>([]);
  const [system, setSystem] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/stats");
      const data = await res.json();
      if (data.ok) {
        setStats(data.stats);
        setActivityLogs(data.activityLogs || []);
        setSystem(data.system || {});
      }
    } catch (err) {
      console.error("Failed to load dashboard metrics", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const handleQuickSeed = async () => {
    if (isSyncing) return;
    setIsSyncing(true);
    try {
      const res = await fetch("/api/admin/seed", { method: "POST" });
      const data = await res.json();
      if (data.ok) {
        toast.success("Synchronized all data with SQLite database!");
        await fetchStats();
      } else {
        toast.error("Seed error: " + data.error);
      }
    } catch {
      toast.error("Network error during seed");
    } finally {
      setIsSyncing(false);
    }
  };

  const careerGoalTotal = stats?.careerGoals || 981;
  const progressTo1000 = ((careerGoalTotal / 1000) * 100).toFixed(1);

  return (
    <div className="space-y-8 pb-12">
      {/* Hero Banner with Road to 1000 Progress */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-zinc-900 via-zinc-950 to-black border border-zinc-800 p-6 md:p-8 shadow-2xl">
        <div className="absolute top-0 right-0 -mt-12 -mr-12 w-96 h-96 bg-[#FEBE10]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-bold bg-[#FEBE10]/15 text-[#FEBE10] border border-[#FEBE10]/30">
              <Flame className="w-3.5 h-3.5 fill-[#FEBE10]" />
              THE CR7 ENTERPRISE CMS
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight">
              Honoring Football&apos;s Ultimate Icon
            </h1>
            <p className="text-zinc-400 text-sm leading-relaxed">
              Manage silverware archives, high-definition moments, club eras, and system controls. All updates immediately feed the tribute experience at{" "}
              <a href="/" target="_blank" className="text-[#FEBE10] underline font-mono hover:opacity-80">
                cr7office.ir
              </a>
              .
            </p>
          </div>

          {/* Road to 1000 goals widget */}
          <div className="bg-zinc-900/90 border border-zinc-800/80 rounded-xl p-5 lg:w-80 shadow-inner">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-mono text-zinc-400">Road to 1,000 Goals</span>
              <span className="text-xs font-mono font-bold text-[#FEBE10]">
                {progressTo1000}% Complete
              </span>
            </div>
            <div className="text-3xl font-black text-white font-mono tracking-tight flex items-baseline gap-2">
              <span>{careerGoalTotal}</span>
              <span className="text-xs text-zinc-500 font-sans font-normal">/ 1,000</span>
            </div>
            <div className="w-full bg-zinc-800 h-2.5 rounded-full mt-3 overflow-hidden p-0.5">
              <div
                className="bg-gradient-to-r from-[#FEBE10] via-amber-400 to-yellow-300 h-full rounded-full transition-all duration-1000 shadow-[0_0_10px_rgba(254,190,16,0.5)]"
                style={{ width: `${progressTo1000}%` }}
              />
            </div>
            <p className="text-[11px] text-zinc-400 mt-2 font-mono flex items-center justify-between">
              <span>Only {1000 - careerGoalTotal} goals remaining</span>
              <span className="text-emerald-400 font-semibold">Active Record</span>
            </p>
          </div>
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Trophies */}
        <Link
          href="/admin/trophies"
          className="group relative overflow-hidden rounded-xl bg-zinc-900/70 hover:bg-zinc-900/90 border border-zinc-800 hover:border-[#FEBE10]/40 p-5 transition-all duration-200"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase tracking-wider text-zinc-400">Trophies</span>
            <div className="p-2 rounded-lg bg-[#FEBE10]/10 text-[#FEBE10] group-hover:scale-110 transition-transform">
              <Trophy className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-3xl font-bold font-mono text-white">
              {loading ? "..." : stats?.trophyCount ?? 34}
            </div>
            <div className="flex items-center justify-between mt-2 text-xs text-zinc-400">
              <span>Major Silverware</span>
              <span className="flex items-center text-[#FEBE10] font-semibold group-hover:translate-x-0.5 transition-transform">
                Manage <ArrowUpRight className="w-3.5 h-3.5 ml-0.5" />
              </span>
            </div>
          </div>
        </Link>

        {/* Moments */}
        <Link
          href="/admin/moments"
          className="group relative overflow-hidden rounded-xl bg-zinc-900/70 hover:bg-zinc-900/90 border border-zinc-800 hover:border-[#FEBE10]/40 p-5 transition-all duration-200"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase tracking-wider text-zinc-400">Iconic Moments</span>
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 group-hover:scale-110 transition-transform">
              <Sparkles className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-3xl font-bold font-mono text-white">
              {loading ? "..." : stats?.momentCount ?? 24}
            </div>
            <div className="flex items-center justify-between mt-2 text-xs text-zinc-400">
              <span>Goals & Celebrations</span>
              <span className="flex items-center text-emerald-400 font-semibold group-hover:translate-x-0.5 transition-transform">
                Manage <ArrowUpRight className="w-3.5 h-3.5 ml-0.5" />
              </span>
            </div>
          </div>
        </Link>

        {/* Eras */}
        <Link
          href="/admin/eras"
          className="group relative overflow-hidden rounded-xl bg-zinc-900/70 hover:bg-zinc-900/90 border border-zinc-800 hover:border-[#FEBE10]/40 p-5 transition-all duration-200"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase tracking-wider text-zinc-400">Career Eras</span>
            <div className="p-2 rounded-lg bg-sky-500/10 text-sky-400 group-hover:scale-110 transition-transform">
              <Layers className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-3xl font-bold font-mono text-white">
              {loading ? "..." : stats?.eraCount ?? 7}
            </div>
            <div className="flex items-center justify-between mt-2 text-xs text-zinc-400">
              <span>Sporting to Al Nassr</span>
              <span className="flex items-center text-sky-400 font-semibold group-hover:translate-x-0.5 transition-transform">
                Manage <ArrowUpRight className="w-3.5 h-3.5 ml-0.5" />
              </span>
            </div>
          </div>
        </Link>

        {/* Media Vault */}
        <Link
          href="/admin/media"
          className="group relative overflow-hidden rounded-xl bg-zinc-900/70 hover:bg-zinc-900/90 border border-zinc-800 hover:border-[#FEBE10]/40 p-5 transition-all duration-200"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase tracking-wider text-zinc-400">Media Vault</span>
            <div className="p-2 rounded-lg bg-purple-500/10 text-purple-400 group-hover:scale-110 transition-transform">
              <ImageIcon className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-3xl font-bold font-mono text-white">
              {loading ? "..." : stats?.mediaCount ?? 0}
            </div>
            <div className="flex items-center justify-between mt-2 text-xs text-zinc-400">
              <span>Verified CDN / Local</span>
              <span className="flex items-center text-purple-400 font-semibold group-hover:translate-x-0.5 transition-transform">
                Browse <ArrowUpRight className="w-3.5 h-3.5 ml-0.5" />
              </span>
            </div>
          </div>
        </Link>
      </div>

      {/* Feature #1: Career Goals Distribution & Trajectory Chart */}
      <div className="rounded-xl bg-zinc-900/60 border border-zinc-800/80 p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              Career Goals Distribution (981 Total)
              <span className="text-xs px-2 py-0.5 rounded font-mono bg-zinc-800 text-[#FEBE10] border border-zinc-700">
                All-Time Record
              </span>
            </h2>
            <p className="text-xs text-zinc-400 mt-1">
              Distribution of official goals scored across 6 historic chapters.
            </p>
          </div>
          <button
            onClick={handleQuickSeed}
            disabled={isSyncing}
            className="self-start sm:self-auto flex items-center gap-2 px-3 py-1.5 text-xs font-mono font-semibold rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700 hover:border-[#FEBE10]/40 transition-colors"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-[#FEBE10] ${isSyncing ? "animate-spin" : ""}`} />
            Re-sync SQLite Archive
          </button>
        </div>

        {/* Goals Distribution Progress Bars */}
        <div className="space-y-4">
          {(stats?.goalsBreakdown || []).map((item) => (
            <div key={item.club} className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="font-semibold text-zinc-200">{item.club}</span>
                  <span className="text-zinc-500 font-mono text-[11px]">({item.period})</span>
                </div>
                <div className="flex items-center gap-2 font-mono">
                  <span className="font-bold text-white">{item.goals} goals</span>
                  <span className="text-zinc-500">({item.ratio})</span>
                </div>
              </div>
              <div className="w-full bg-zinc-800/80 h-2 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-700"
                  style={{
                    width: item.ratio,
                    backgroundColor: item.color,
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Two Columns: Quick Actions & Recent Activity Log */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Actions Panel */}
        <div className="rounded-xl bg-zinc-900/60 border border-zinc-800/80 p-6 space-y-4">
          <div className="flex items-center gap-2">
            <Sliders className="w-4 h-4 text-[#FEBE10]" />
            <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
              Quick Actions
            </h3>
          </div>

          <div className="space-y-2">
            <Link
              href="/admin/media"
              className="flex items-center justify-between p-3 rounded-lg bg-zinc-800/40 hover:bg-zinc-800 border border-zinc-800 hover:border-zinc-700 transition-colors group"
            >
              <div className="flex items-center gap-3">
                <PlusCircle className="w-4 h-4 text-[#FEBE10]" />
                <span className="text-sm font-medium text-zinc-200">Upload Media Asset</span>
              </div>
              <ArrowUpRight className="w-4 h-4 text-zinc-500 group-hover:text-white transition-colors" />
            </Link>

            <Link
              href="/admin/trophies"
              className="flex items-center justify-between p-3 rounded-lg bg-zinc-800/40 hover:bg-zinc-800 border border-zinc-800 hover:border-zinc-700 transition-colors group"
            >
              <div className="flex items-center gap-3">
                <Trophy className="w-4 h-4 text-[#FEBE10]" />
                <span className="text-sm font-medium text-zinc-200">Add or Edit Trophy</span>
              </div>
              <ArrowUpRight className="w-4 h-4 text-zinc-500 group-hover:text-white transition-colors" />
            </Link>

            <Link
              href="/admin/moments"
              className="flex items-center justify-between p-3 rounded-lg bg-zinc-800/40 hover:bg-zinc-800 border border-zinc-800 hover:border-zinc-700 transition-colors group"
            >
              <div className="flex items-center gap-3">
                <Sparkles className="w-4 h-4 text-[#FEBE10]" />
                <span className="text-sm font-medium text-zinc-200">New Iconic Moment</span>
              </div>
              <ArrowUpRight className="w-4 h-4 text-zinc-500 group-hover:text-white transition-colors" />
            </Link>

            <Link
              href="/admin/settings"
              className="flex items-center justify-between p-3 rounded-lg bg-zinc-800/40 hover:bg-zinc-800 border border-zinc-800 hover:border-zinc-700 transition-colors group"
            >
              <div className="flex items-center gap-3">
                <Sliders className="w-4 h-4 text-[#FEBE10]" />
                <span className="text-sm font-medium text-zinc-200">SEO & FX Controls</span>
              </div>
              <ArrowUpRight className="w-4 h-4 text-zinc-500 group-hover:text-white transition-colors" />
            </Link>
          </div>

          <div className="pt-2">
            <button
              onClick={handleQuickSeed}
              disabled={isSyncing}
              className="w-full py-2.5 px-4 rounded-lg bg-gradient-to-r from-[#FEBE10] to-[#e5ab0f] text-black font-bold text-xs font-mono uppercase tracking-wider flex items-center justify-center gap-2 hover:opacity-90 active:scale-98 transition-all shadow-[0_0_15px_rgba(254,190,16,0.2)] disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? "animate-spin" : ""}`} />
              <span>{isSyncing ? "Syncing..." : "One-Click Sync SQLite"}</span>
            </button>
          </div>
        </div>

        {/* System Logs & Activity Feed */}
        <div className="lg:col-span-2 rounded-xl bg-zinc-900/60 border border-zinc-800/80 p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-[#FEBE10]" />
                <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
                  Live System Activity Log
                </h3>
              </div>
              <span className="text-xs font-mono text-zinc-500">Auto-audited</span>
            </div>

            <div className="space-y-3">
              {activityLogs.length === 0 ? (
                <div className="text-center py-8 text-zinc-500 text-xs font-mono">
                  No activity logged yet. Click &quot;One-Click Sync SQLite&quot; to initialize.
                </div>
              ) : (
                activityLogs.map((log) => (
                  <div
                    key={log.id}
                    className="flex items-start justify-between p-3 rounded-lg bg-zinc-950/60 border border-zinc-800/60 text-xs"
                  >
                    <div className="flex items-start gap-3">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <div>
                        <div className="font-mono font-bold text-zinc-200">{log.action}</div>
                        <div className="text-zinc-400 text-[11px] mt-0.5">{log.details}</div>
                      </div>
                    </div>
                    <div className="text-right shrink-0 ml-4">
                      <div className="text-[10px] font-mono text-zinc-500">
                        {new Date(log.createdAt).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </div>
                      <div className="text-[10px] font-mono text-[#FEBE10]">{log.user}</div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* System Footer info */}
          <div className="pt-4 mt-4 border-t border-zinc-800 flex flex-wrap items-center justify-between text-xs font-mono text-zinc-500 gap-2">
            <span className="flex items-center gap-1.5">
              <Database className="w-3.5 h-3.5 text-emerald-400" />
              Engine: SQLite (Prisma 5.21)
            </span>
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-[#FEBE10]" />
              Role: Master Admin
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
