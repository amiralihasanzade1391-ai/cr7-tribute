"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AdminNavbar } from "@/components/admin/AdminNavbar";
import { ToastContainer } from "@/components/admin/toast";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // If on the login page, render full screen without admin chrome
  if (pathname === "/admin/login") {
    return (
      <div className="min-h-screen bg-black text-white">
        {children}
        <ToastContainer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#070707] text-zinc-100 selection:bg-[#FEBE10] selection:text-black">
      <AdminSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex flex-col min-h-screen lg:pl-72 transition-all duration-300">
        <AdminNavbar onToggleSidebar={() => setSidebarOpen((prev) => !prev)} />
        <main className="flex-1 p-6 sm:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>

      <ToastContainer />
    </div>
  );
}
