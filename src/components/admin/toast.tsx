"use client";
import { useState, useEffect } from "react";
import { Check, X, AlertTriangle } from "lucide-react";

let toastId = 0;
const listeners: Set<(toast: any) => void> = new Set();

export const toast = {
  success: (msg: string) => listeners.forEach(l => l({ id: ++toastId, type: "success", msg })),
  error: (msg: string) => listeners.forEach(l => l({ id: ++toastId, type: "error", msg })),
  warning: (msg: string) => listeners.forEach(l => l({ id: ++toastId, type: "warning", msg })),
};

export function ToastContainer() {
  const [toasts, setToasts] = useState<any[]>([]);
  useEffect(() => {
    const handler = (t: any) => {
      setToasts(p => [...p, t]);
      setTimeout(() => setToasts(p => p.filter(x => x.id !== t.id)), 3500);
    };
    listeners.add(handler);
    return () => { listeners.delete(handler); };
  }, []);

  return (
    <div className="fixed bottom-6 right-6 z-50 space-y-2">
      {toasts.map(t => (
        <div key={t.id} className={`flex items-center gap-3 px-5 py-3 rounded-xl shadow-2xl border backdrop-blur-md animate-in slide-in-from-right ${
          t.type === "success" ? "bg-green-950/90 border-green-500/50 text-green-300" :
          t.type === "error" ? "bg-red-950/90 border-red-500/50 text-red-300" :
          "bg-yellow-950/90 border-yellow-500/50 text-yellow-300"
        }`}>
          {t.type === "success" && <Check size={18} />}
          {t.type === "error" && <X size={18} />}
          {t.type === "warning" && <AlertTriangle size={18} />}
          <span className="text-sm font-medium">{t.msg}</span>
        </div>
      ))}
    </div>
  );
}
