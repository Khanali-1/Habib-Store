"use client";

import { useState, type ReactNode } from "react";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import DashboardNavbar from "@/components/dashboard/DashboardNavbar";

/** Holds the mobile-menu state so the layout itself can stay a Server Component. */
export default function DashboardShell({ children }: { children: ReactNode }) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-ivory">
      <DashboardSidebar open={menuOpen} onClose={() => setMenuOpen(false)} />

      <div className="min-h-screen min-w-0 lg:ml-64">
        <DashboardNavbar onMenuClick={() => setMenuOpen(true)} />

        <main className="p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
