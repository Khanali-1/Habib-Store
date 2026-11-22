"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import {
  countries,
  useCountry,
  type CountryCode,
} from "@/context/CountryContext";
import { collections } from "@/lib/collections";

const navLinks = [
  { name: "Home", href: "/" },
  { name: "Shop", href: "/products" },
  { name: "About", href: "/about" },
  { name: "Contact", href: "/contact" },
  { name: "My Orders", href: "/orders" },
];

// Real routes only (see lib/collections.ts)
const categories = collections.map((item) => ({
  name: item.label,
  href: item.href,
}));

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [categoriesOpen, setCategoriesOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const pathname = usePathname();
  const { selectedCountry, setSelectedCountry } = useCountry();

  const closeMenu = () => {
    setMenuOpen(false);
    setCategoriesOpen(false);
  };

  const handleCountryChange = (value: string) => {
    setSelectedCountry(value as CountryCode);
  };

  const selectedCountryInfo = countries.find(
    (country) => country.code === selectedCountry
  );

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  const categoryActive = categories.some((category) => isActive(category.href));

  // Subtle solid-on-scroll header
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Lock page scroll and support Escape while the drawer is open
  useEffect(() => {
    if (!menuOpen) return;

    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMenuOpen(false);
        setCategoriesOpen(false);
      }
    };

    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKey);
    };
  }, [menuOpen]);

  const iconClass = "h-5 w-5";
  const iconButton =
    "text-brand transition-colors duration-300 hover:text-wine-700";

  return (
    <header
      className={`sticky top-0 z-50 border-b bg-ivory/90 backdrop-blur-xl transition-shadow duration-500 ${
        scrolled ? "border-sand shadow-[0_6px_24px_-12px_rgba(63,15,26,0.25)]" : "border-sand/70"
      }`}
    >
      {/* MAIN NAVBAR */}
      <div className="mx-auto flex h-[76px] max-w-7xl items-center justify-between gap-5 px-5 lg:px-8">
        {/* LOGO */}
        <Link href="/" className="flex shrink-0 items-center gap-3">
          <span className="grid h-10 w-10 place-items-center bg-wine-700 font-serif text-2xl italic text-white">
            H
          </span>

          <span className="font-serif text-xl tracking-tight text-brand">
            H Super
            <span className="text-wine-700"> Store.</span>
          </span>
        </Link>

        {/* DESKTOP NAVIGATION */}
        <nav aria-label="Main" className="hidden items-center gap-8 lg:flex">
          {navLinks.slice(0, 2).map((link) => (
            <Link
              key={link.name}
              href={link.href}
              aria-current={isActive(link.href) ? "page" : undefined}
              className={`link-underline py-2 text-[13px] font-medium transition-colors ${
                isActive(link.href)
                  ? "text-wine-700 after:scale-x-100"
                  : "text-gray-600 hover:text-wine-700"
              }`}
            >
              {link.name}
            </Link>
          ))}

          {/* DESKTOP CATEGORIES */}
          <div className="group relative">
            <button
              type="button"
              aria-haspopup="true"
              className={`flex items-center gap-2 py-2 text-[13px] font-medium transition-colors hover:text-wine-700 ${
                categoryActive ? "text-wine-700" : "text-gray-600"
              }`}
            >
              Categories
              <svg
                className="h-3 w-3 transition-transform duration-300 group-hover:rotate-180 group-focus-within:rotate-180"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                aria-hidden="true"
              >
                <path d="m6 9 6 6 6-6" />
              </svg>
            </button>

            <div className="invisible absolute left-1/2 top-full z-50 w-[300px] -translate-x-1/2 translate-y-3 border border-sand bg-ivory opacity-0 shadow-[0_24px_48px_-20px_rgba(63,15,26,0.35)] transition-all duration-300 ease-[var(--ease-luxe)] group-focus-within:visible group-focus-within:translate-y-0 group-focus-within:opacity-100 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100">
              <div className="border-b border-sand px-6 py-5">
                <h3 className="text-2xl">Shop by category</h3>
              </div>

              <div className="p-2">
                {categories.map((category) => (
                  <Link
                    key={category.name}
                    href={category.href}
                    className="group/item flex items-center justify-between px-4 py-3.5 text-sm text-gray-700 transition-colors hover:bg-cream hover:text-wine-700"
                  >
                    <span className="transition-transform duration-300 group-hover/item:translate-x-1">
                      {category.name}
                    </span>
                    <span
                      aria-hidden="true"
                      className="text-gray-400 transition-all duration-300 group-hover/item:translate-x-1 group-hover/item:text-wine-700"
                    >
                      →
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {navLinks.slice(2).map((link) => (
            <Link
              key={link.name}
              href={link.href}
              aria-current={isActive(link.href) ? "page" : undefined}
              className={`link-underline py-2 text-[13px] font-medium transition-colors ${
                isActive(link.href)
                  ? "text-wine-700 after:scale-x-100"
                  : "text-gray-600 hover:text-wine-700"
              }`}
            >
              {link.name}
            </Link>
          ))}
        </nav>

        {/* RIGHT ACTIONS */}
        <div className="flex items-center gap-3 sm:gap-5">
          {/* DESKTOP COUNTRY SELECTOR */}
          <div className="hidden sm:block">
            <label htmlFor="desktop-country" className="sr-only">
              Select country
            </label>

            <select
              id="desktop-country"
              value={selectedCountry}
              onChange={(event) => handleCountryChange(event.target.value)}
              className="max-w-[150px] cursor-pointer border border-sand bg-ivory px-2 py-2 text-xs font-medium text-brand outline-none transition hover:border-wine-700 focus:border-wine-700"
            >
              {countries.map((country) => (
                <option key={country.code} value={country.code}>
                  {country.flag} {country.name} ({country.currency})
                </option>
              ))}
            </select>
          </div>

          {/* SEARCH */}
          <Link href="/search" aria-label="Search" className={iconButton}>
            <svg className={iconClass} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
              <circle cx="11" cy="11" r="7" />
              <path d="m16 16 4 4" />
            </svg>
          </Link>

          {/* ACCOUNT */}
          <Link href="/login" aria-label="Sign in or account" className={`hidden sm:block ${iconButton}`}>
            <svg className={iconClass} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
              <circle cx="12" cy="8" r="4" />
              <path d="M4 21c0-4.4 3.6-7 8-7s8 2.6 8 7" />
            </svg>
          </Link>

          {/* WISHLIST */}
          <Link href="/wishlist" aria-label="Wishlist" className={`hidden sm:block ${iconButton}`}>
            <svg className={iconClass} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
              <path d="M20.8 8.8c0 5.5-8.8 11-8.8 11s-8.8-5.5-8.8-11a4.7 4.7 0 0 1 8.8-2.2 4.7 4.7 0 0 1 8.8 2.2Z" />
            </svg>
          </Link>

          {/* CART */}
          <Link href="/cart" aria-label="Cart" className={iconButton}>
            <svg className={iconClass} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M3 3h2l2.5 12h11l2-8H6" />
              <circle cx="9" cy="19" r="1" />
              <circle cx="18" cy="19" r="1" />
            </svg>
          </Link>

          {/* MOBILE MENU ICON */}
          <button
            type="button"
            onClick={() => setMenuOpen(true)}
            aria-label="Open menu"
            aria-expanded={menuOpen}
            className="ml-1 text-brand lg:hidden"
          >
            <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" aria-hidden="true">
              <path d="M4 7h16M4 12h16M4 17h10" />
            </svg>
          </button>
        </div>
      </div>

      {/* MOBILE DARK OVERLAY */}
      <div
        onClick={closeMenu}
        aria-hidden="true"
        className={`fixed inset-0 z-[60] bg-wine-950/60 backdrop-blur-[2px] transition-opacity duration-500 lg:hidden ${
          menuOpen ? "visible opacity-100" : "invisible opacity-0"
        }`}
      />

      {/* RIGHT SIDE MOBILE DRAWER */}
      <aside
        inert={!menuOpen}
        aria-hidden={!menuOpen}
        aria-label="Menu"
        className={`fixed right-0 top-0 z-[70] flex h-dvh w-[86%] max-w-[360px] flex-col bg-ivory shadow-2xl transition-transform duration-500 ease-[var(--ease-luxe)] lg:hidden ${
          menuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* DRAWER HEADER */}
        <div className="flex h-[76px] shrink-0 items-center justify-between border-b border-sand px-6">
          <Link href="/" onClick={closeMenu} className="flex items-center gap-2.5">
            <span className="grid h-9 w-9 place-items-center bg-wine-700 font-serif text-xl italic text-white">
              H
            </span>
            <span className="font-serif text-lg text-brand">
              H Super<span className="text-wine-700"> Store.</span>
            </span>
          </Link>

          <button
            type="button"
            onClick={closeMenu}
            aria-label="Close menu"
            className="grid h-10 w-10 place-items-center text-3xl leading-none text-gray-600 transition-colors duration-300 hover:text-wine-700"
          >
            ×
          </button>
        </div>

        {/* DRAWER CONTENT */}
        <nav aria-label="Mobile" className="flex-1 overflow-y-auto px-6 py-6">
          {/* MOBILE COUNTRY SELECTOR */}
          <div className="mb-7">
            <label htmlFor="mobile-country" className="mb-2 block text-xs text-gray-500">
              Your country and currency
            </label>

            <select
              id="mobile-country"
              value={selectedCountry}
              onChange={(event) => handleCountryChange(event.target.value)}
              className="field font-medium"
            >
              {countries.map((country) => (
                <option key={country.code} value={country.code}>
                  {country.flag} {country.name} ({country.currency})
                </option>
              ))}
            </select>

            <p className="mt-2 text-xs text-gray-500">
              Selected: {selectedCountryInfo?.name}, {selectedCountryInfo?.currency}
            </p>
          </div>

          {/* MAIN LINKS */}
          {navLinks.slice(0, 2).map((link) => (
            <Link
              key={link.name}
              href={link.href}
              onClick={closeMenu}
              className="flex items-center justify-between border-b border-sand py-4 font-serif text-lg text-brand transition-colors duration-300 hover:text-wine-700"
            >
              {link.name}
            </Link>
          ))}

          {/* MOBILE CATEGORIES */}
          <div className="border-b border-sand">
            <button
              type="button"
              onClick={() => setCategoriesOpen(!categoriesOpen)}
              className="flex w-full items-center justify-between py-4 font-serif text-lg text-brand"
              aria-expanded={categoriesOpen}
            >
              Categories
              <svg
                className={`h-4 w-4 transition-transform duration-500 ${categoriesOpen ? "rotate-180" : ""}`}
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                aria-hidden="true"
              >
                <path d="m6 9 6 6 6-6" />
              </svg>
            </button>

            <div
              className={`grid transition-all duration-500 ease-[var(--ease-luxe)] ${
                categoriesOpen ? "grid-rows-[1fr] pb-3 opacity-100" : "grid-rows-[0fr] opacity-0"
              }`}
            >
              <div className="overflow-hidden">
                {categories.map((category) => (
                  <Link
                    key={category.name}
                    href={category.href}
                    onClick={closeMenu}
                    tabIndex={categoriesOpen ? 0 : -1}
                    className="block py-2.5 pl-4 text-sm text-gray-600 transition-colors duration-300 hover:text-wine-700"
                  >
                    {category.name}
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* OTHER LINKS */}
          {navLinks.slice(2).map((link) => (
            <Link
              key={link.name}
              href={link.href}
              onClick={closeMenu}
              className="flex items-center justify-between border-b border-sand py-4 font-serif text-lg text-brand transition-colors duration-300 hover:text-wine-700"
            >
              {link.name}
            </Link>
          ))}

          {/* ACCOUNT */}
          <div className="mt-7 grid grid-cols-2 gap-3">
            <Link href="/login" onClick={closeMenu} className="btn-dark py-3">
              Sign in
            </Link>
            <Link href="/register" onClick={closeMenu} className="btn-outline py-3">
              Register
            </Link>
          </div>

          {/* WISHLIST */}
          <Link
            href="/wishlist"
            onClick={closeMenu}
            className="mt-4 flex items-center gap-3 px-1 py-3 text-sm font-medium text-gray-600 transition-colors duration-300 hover:text-wine-700"
          >
            My wishlist
          </Link>
        </nav>

        {/* DRAWER FOOTER */}
        <div className="shrink-0 border-t border-sand px-6 py-5">
          <p className="text-center text-xs text-gray-500">
            Discover your style with H Stores
          </p>
        </div>
      </aside>
    </header>
  );
}
