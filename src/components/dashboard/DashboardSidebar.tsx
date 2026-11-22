"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  FiGrid,
  FiPackage,
  FiLayers,
  FiShoppingBag,
  FiUsers,
  FiSettings,
  FiLogOut,
  FiX,
} from "react-icons/fi";

const menuItems = [
  { name: "Overview", href: "/dashboard", icon: FiGrid },
  { name: "Products", href: "/dashboard/products", icon: FiPackage },
  { name: "Categories", href: "/dashboard/categories", icon: FiLayers },
  { name: "Orders", href: "/dashboard/orders", icon: FiShoppingBag },
  { name: "Customers", href: "/dashboard/users", icon: FiUsers },
  { name: "Settings", href: "/dashboard/settings", icon: FiSettings },
];

interface DashboardSidebarProps {
  open?: boolean;
  onClose?: () => void;
}

export default function DashboardSidebar({
  open = false,
  onClose,
}: DashboardSidebarProps) {
  const pathname = usePathname();

  return (
    <>
      {/* Mobile overlay */}
      <div
        onClick={onClose}
        aria-hidden="true"
        className={`fixed inset-0 z-40 bg-wine-950/60 transition-opacity duration-300 lg:hidden ${
          open ? "visible opacity-100" : "invisible opacity-0"
        }`}
      />

      <aside
        aria-label="Dashboard"
        className={`fixed left-0 top-0 z-50 flex h-dvh w-64 flex-col bg-wine-950 text-white transition-transform duration-500 ease-[var(--ease-luxe)] lg:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-start justify-between border-b border-white/10 px-6 py-6">
          <div>
            <Link href="/dashboard" onClick={onClose} className="font-serif text-2xl">
              H<span className="text-wine-200">Store.</span>
            </Link>

            <p className="mt-1 text-xs text-white/55">Admin Dashboard</p>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close menu"
            className="text-white/70 transition hover:text-white lg:hidden"
          >
            <FiX size={22} />
          </button>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-6">
          <p className="mb-3 px-3 text-xs text-white/45">Main menu</p>

          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              pathname === item.href ||
              (item.href !== "/dashboard" && pathname.startsWith(item.href));

            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={onClose}
                aria-current={isActive ? "page" : undefined}
                className={`flex items-center gap-3 border-l-2 px-4 py-3 text-sm font-medium transition-all duration-300 ${
                  isActive
                    ? "border-wine-200 bg-white/10 text-white"
                    : "border-transparent text-white/65 hover:bg-white/5 hover:text-white"
                }`}
              >
                <Icon size={18} aria-hidden="true" />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-white/10 p-3">
          <Link
            href="/"
            className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-white/65 transition hover:bg-white/5 hover:text-white"
          >
            <FiLogOut size={18} aria-hidden="true" />
            <span>Back to store</span>
          </Link>
        </div>
      </aside>
    </>
  );
}
