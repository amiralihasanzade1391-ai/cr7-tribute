"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import {
  LayoutDashboard,
  Image as ImageIcon,
  Trophy,
  Sparkles,
  Layers,
  Settings,
  ExternalLink,
  LogOut,
  Shield,
  ChevronRight,
  Flame,
} from "lucide-react";

interface AdminSidebarProps {
  isOpen: boolean;
  onClose?: () => void;
}

export function AdminSidebar({ isOpen, onClose }: AdminSidebarProps) {
  const pathname = usePathname();
  const { data: session } = useSession();

  const navItems = [
    {
      label: "Dashboard",
      href: "/admin",
      icon: LayoutDashboard,
      badge: "Live",
    },
    {
      label: "Media Vault",
      href: "/admin/media",
      icon: ImageIcon,
    },
    {
      label: "Trophy Cabinet",
      href: "/admin/trophies",
      icon: Trophy,
    },
    {
      label: "Iconic Moments",
      href: "/admin/moments",
      icon: Sparkles,
    },
    {
      label: "Career Eras",
      href: "/admin/eras",
      icon: Layers,
    },
    {
      label: "Settings & SEO",
      href: "/admin/settings",
      icon: Settings,
    },
  ];

  const userRole = (session?.user as any)?.role || "ADMIN";
  const userEmail = session?.user?.email || "admin@cr7office.ir";

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-black/80 backdrop-blur-sm lg:hidden transition-opacity"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 flex flex-col w-72 bg-[#09090b]/95 border-r border-zinc-800/80 backdrop-blur-xl transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Brand Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-zinc-800/80">
          <Link href="/admin" className="flex items-center gap-3 group">
            <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-[#FEBE10] to-[#b3860b] shadow-[0_0_20px_rgba(254,190,16,0.35)] group-hover:scale-105 transition-transform">
              <span className="font-black text-black text-lg tracking-tighter">CR7</span>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-black tracking-widest text-sm text-white uppercase">
                  CMS CORE
                </span>
                <span className="text-[10px] px-1.5 py-0.5 rounded font-mono font-bold bg-[#FEBE10]/15 text-[#FEBE10] border border-[#FEBE10]/30">
                  v2.5
                </span>
              </div>
              <p className="text-[11px] font-mono text-zinc-400">Enterprise Edition</p>
            </div>
          </Link>
        </div>

        {/* Quick Nav Links */}
        <div className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto custom-scrollbar">
          <div className="px-3 pb-2 text-[10px] font-bold tracking-wider text-zinc-500 uppercase font-mono">
            Content Architecture
          </div>

          {navItems.map((item) => {
            const isActive =
              item.href === "/admin"
                ? pathname === "/admin"
                : pathname.startsWith(item.href);

            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={`group flex items-center justify-between px-3.5 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  isActive
                    ? "bg-[#FEBE10]/10 text-[#FEBE10] border border-[#FEBE10]/30 shadow-[0_0_15px_rgba(254,190,16,0.12)] font-semibold"
                    : "text-zinc-300 hover:text-white hover:bg-zinc-800/50 border border-transparent"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className={`w-4 h-4 transition-transform group-hover:scale-110 ${
                      isActive ? "text-[#FEBE10]" : "text-zinc-400 group-hover:text-zinc-200"
                    }`}
                  />
                  <span>{item.label}</span>
                </div>

                {item.badge ? (
                  <span className="text-[10px] px-2 py-0.5 rounded-full font-mono font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 animate-pulse">
                    {item.badge}
                  </span>
                ) : (
                  <ChevronRight
                    className={`w-3.5 h-3.5 transition-transform ${
                      isActive ? "opacity-100 text-[#FEBE10]" : "opacity-0 group-hover:opacity-100 text-zinc-500"
                    }`}
                  />
                )}
              </Link>
            );
          })}

          <div className="pt-6 px-3 pb-2 text-[10px] font-bold tracking-wider text-zinc-500 uppercase font-mono">
            Public Website
          </div>

          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between px-3.5 py-2.5 rounded-lg text-sm font-medium text-zinc-300 hover:text-white hover:bg-zinc-800/50 border border-transparent transition-all group"
          >
            <div className="flex items-center gap-3">
              <ExternalLink className="w-4 h-4 text-zinc-400 group-hover:text-zinc-200" />
              <span>Live Site Preview</span>
            </div>
            <span className="text-[11px] text-zinc-500 font-mono group-hover:text-zinc-400">cr7office.ir ↗</span>
          </a>
        </div>

        {/* User Profile & Logout */}
        <div className="p-4 border-t border-zinc-800/80 bg-zinc-950/60">
          <div className="flex items-center justify-between mb-3 px-2">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center font-bold text-xs text-[#FEBE10]">
                CR
              </div>
              <div className="overflow-hidden">
                <p className="text-xs font-semibold text-zinc-200 truncate w-32">
                  {userEmail}
                </p>
                <div className="flex items-center gap-1 mt-0.5">
                  <Shield className="w-2.5 h-2.5 text-[#FEBE10]" />
                  <span className="text-[10px] font-mono font-bold text-[#FEBE10] tracking-wider uppercase">
                    {userRole}
                  </span>
                </div>
              </div>
            </div>

            <button
              onClick={() => signOut({ callbackUrl: "/admin/login" })}
              title="Sign Out"
              className="p-2 text-zinc-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg border border-transparent hover:border-rose-500/20 transition-colors"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>

          <div className="px-2 py-1.5 rounded bg-zinc-900/80 border border-zinc-800 flex items-center justify-between text-[11px] font-mono text-zinc-400">
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              SQLite DB Online
            </span>
            <span className="text-zinc-500">dev.db</span>
          </div>
        </div>
      </aside>
    </>
  );
}
