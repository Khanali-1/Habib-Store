"use client";

import Link from "next/link";
import { FiMenu } from "react-icons/fi";

export default function DashboardNavbar({
  onMenuClick,
}: {
  onMenuClick?: () => void;
}) {
  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-sand bg-ivory/90 px-4 backdrop-blur-md sm:px-6 lg:px-8">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onMenuClick}
          aria-label="Open menu"
          className="text-brand transition hover:text-wine-700 lg:hidden"
        >
          <FiMenu size={22} />
        </button>

        <h2 className="font-serif text-lg text-wine-700">Dashboard</h2>
      </div>

      <Link
        href="/"
        className="link-underline text-xs font-medium text-gray-600 hover:text-wine-700"
      >
        View store
      </Link>
    </header>
  );
}
