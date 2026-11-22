
"use client";

import { useState } from "react";
import Link from "next/link";

const categories = [
  { name: "Men", href: "/men", number: "01" },
  { name: "Women", href: "/women", number: "02" },
  { name: "Kids", href: "/kids", number: "03" },
  { name: "Fragrance", href: "/fragrance", number: "04" },
  { name: "Jewellery", href: "/jewellery", number: "05" },
  { name: "Accessories", href: "/accessories", number: "06" },
];

export default function CategoryDropdown() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div
      className="relative"
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      {/* Categories Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        className="flex items-center gap-2 py-3 text-sm font-medium hover:text-gray-500 transition"
      >
        Categories

        <svg
          className={`w-3 h-3 transition-transform duration-300 ${
            isOpen ? "rotate-180" : ""
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="m6 9 6 6 6-6"
          />
        </svg>
      </button>

      {/* Dropdown */}
      <div
        className={`absolute left-1/2 top-full z-50 w-[340px] -translate-x-1/2 bg-white border border-gray-100 shadow-xl transition-all duration-300 ${
          isOpen
            ? "visible opacity-100 translate-y-0"
            : "invisible opacity-0 translate-y-3"
        }`}
      >
        <div className="px-6 pt-6 pb-4 border-b border-gray-100">
          <p className="text-xs uppercase tracking-[3px] text-gray-400">
            Explore H Stores
          </p>

          <h3 className="text-2xl font-serif mt-2">
            Shop By Category
          </h3>
        </div>

        <div className="p-3">
          {categories.map((category) => (
            <Link
              key={category.name}
              href={category.href}
              onClick={() => setIsOpen(false)}
              className="group flex items-center justify-between px-4 py-4 hover:bg-[#f7f6f3] transition"
            >
              <div className="flex items-center gap-4">
                <span className="text-xs text-gray-400">
                  {category.number}
                </span>

                <span className="text-sm font-medium group-hover:translate-x-1 transition-transform">
                  {category.name}
                </span>
              </div>

              <span className="text-lg text-gray-400 group-hover:text-black group-hover:translate-x-1 transition-all">
                →
              </span>
            </Link>
          ))}
        </div>

        <div className="bg-[#f7f6f3] px-6 py-4">
          <p className="text-xs text-gray-500 text-center tracking-wide">
            DISCOVER YOUR STYLE WITH H STORES
          </p>
        </div>
      </div>
    </div>
  );
}
