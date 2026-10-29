"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Shield, Lock, Mail, ArrowRight, Sparkles, AlertCircle } from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await signIn("credentials", {
        redirect: false,
        email,
        password,
      });

      if (res?.error) {
        setError("Invalid credentials. Please verify your email and password.");
      } else {
        router.push("/admin");
        router.refresh();
      }
    } catch (err: any) {
      setError(err?.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  const handleQuickFill = (role: "admin" | "editor") => {
    if (role === "admin") {
      setEmail("admin@cr7office.ir");
      setPassword("siuuu2026");
    } else {
      setEmail("editor@cr7office.ir");
      setPassword("siuuu2026");
    }
  };

  return (
    <div className="min-h-screen bg-[#070707] text-white flex items-center justify-center p-4 relative overflow-hidden font-sans">
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 -left-32 w-96 h-96 bg-[#FEBE10]/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-red-600/10 rounded-full blur-[140px] pointer-events-none" />

      {/* Cyber/Carbon grid overlay */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(#FEBE10 1px, transparent 1px), linear-gradient(to right, #FEBE10 1px, transparent 1px)`,
          backgroundSize: "40px 40px",
        }}
      />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-md relative z-10"
      >
        {/* Card Header Badge */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ repeat: Infinity, duration: 4, repeatType: "reverse" }}
            className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-[#FEBE10]/20 to-zinc-900 border border-[#FEBE10]/40 shadow-[0_0_30px_rgba(254,190,16,0.25)] mb-4"
          >
            <Shield className="w-8 h-8 text-[#FEBE10]" />
          </motion.div>
          <div className="flex items-center justify-center gap-2 mb-2">
            <span className="h-1.5 w-1.5 rounded-full bg-[#FEBE10] animate-ping" />
            <span className="text-xs font-mono uppercase tracking-[0.3em] text-[#FEBE10]">
              CR7 Enterprise CMS
            </span>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white font-bebas uppercase">
            Command Center Login
          </h1>
          <p className="text-xs text-zinc-400 max-w-xs mx-auto mt-1">
            Restricted area. Authorize to control content, media, stats, and real-time settings.
          </p>
        </div>

        {/* Login Form Box */}
        <div className="rounded-2xl border border-zinc-800/80 bg-zinc-900/60 backdrop-blur-xl p-8 shadow-2xl relative">
          {error && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="mb-6 p-3 rounded-lg bg-red-950/50 border border-red-500/30 text-red-200 text-xs flex items-center gap-2.5"
            >
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
              <span>{error}</span>
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-mono text-zinc-300 uppercase tracking-wider mb-2">
                Administrator Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-500">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@cr7office.ir"
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-zinc-950/80 border border-zinc-800 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-[#FEBE10] focus:ring-1 focus:ring-[#FEBE10] transition-colors"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-xs font-mono text-zinc-300 uppercase tracking-wider">
                  Access Key
                </label>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-500">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-zinc-950/80 border border-zinc-800 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-[#FEBE10] focus:ring-1 focus:ring-[#FEBE10] transition-colors"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-3.5 px-4 rounded-xl bg-gradient-to-r from-[#FEBE10] to-[#E5AB0E] hover:from-[#e5ab0e] hover:to-[#cb980b] text-black font-bold text-sm tracking-wider uppercase transition-all duration-200 flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(254,190,16,0.3)] disabled:opacity-50 disabled:cursor-not-allowed group cursor-pointer"
            >
              {loading ? (
                <>
                  <span className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                  <span>Verifying clearance...</span>
                </>
              ) : (
                <>
                  <span>Authenticate & Enter</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Credentials */}
          <div className="mt-8 pt-6 border-t border-zinc-800/80">
            <div className="flex items-center justify-between mb-3 text-[11px] text-zinc-400 font-mono">
              <span className="flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#FEBE10]" />
                Demo Credentials:
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleQuickFill("admin")}
                className="px-3 py-2 rounded-lg bg-zinc-950 border border-zinc-800 hover:border-[#FEBE10]/60 text-[11px] text-zinc-300 hover:text-white transition-colors text-left flex flex-col cursor-pointer"
              >
                <span className="font-semibold text-[#FEBE10]">Master Admin</span>
                <span className="text-[10px] text-zinc-500 font-mono">Full Permissions</span>
              </button>
              <button
                type="button"
                onClick={() => handleQuickFill("editor")}
                className="px-3 py-2 rounded-lg bg-zinc-950 border border-zinc-800 hover:border-zinc-600 text-[11px] text-zinc-300 hover:text-white transition-colors text-left flex flex-col cursor-pointer"
              >
                <span className="font-semibold text-zinc-300">Editor Role</span>
                <span className="text-[10px] text-zinc-500 font-mono">Content Only</span>
              </button>
            </div>
          </div>
        </div>

        {/* Back to Site link */}
        <div className="text-center mt-6">
          <a
            href="/"
            className="text-xs text-zinc-500 hover:text-[#FEBE10] transition-colors font-mono tracking-wider"
          >
            ← Return to Public Tribute
          </a>
        </div>
      </motion.div>
    </div>
  );
}
