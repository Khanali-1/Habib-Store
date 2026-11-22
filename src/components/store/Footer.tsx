"use client";

import Link from "next/link";
import { useState } from "react";
import {
  FaFacebook,
  FaInstagram,
  FaWhatsapp,
  FaLinkedinIn,
  FaArrowRight,
  FaArrowUp,
  FaWhatsappSquare,
} from "react-icons/fa";
import { collections } from "@/lib/collections";

// NOTE: social URLs are still the original generic placeholders.
const socialLinks = [
  { name: "Facebook", icon: FaFacebook, href: "https://facebook.com" },
  { name: "Instagram", icon: FaInstagram, href: "https://instagram.com" },
  { name: "Whatsapp", icon: FaWhatsapp, href: "https://wa.me/" },
  { name: "Linkedin", icon: FaLinkedinIn, href: "https://linkedin.com" },
  { name: "Whatsapp Channel", icon: FaWhatsappSquare, href: "https://whatsapp.com" },
];

// Only routes that exist in the project
const footerLinks = [
  {
    title: "Shop",
    links: [
      ...collections.map((item) => ({ name: item.label, href: item.href })),
      { name: "All products", href: "/products" },
    ],
  },
  {
    title: "Information",
    links: [
      { name: "About us", href: "/about" },
      { name: "Contact us", href: "/contact" },
      { name: "Search", href: "/search" },
    ],
  },
  {
    title: "My account",
    links: [
      { name: "Sign in", href: "/login" },
      { name: "Create account", href: "/register" },
      { name: "My orders", href: "/orders" },
      { name: "Wishlist", href: "/wishlist" },
      { name: "Cart", href: "/cart" },
    ],
  },
];

export default function Footer() {
  const [email, setEmail] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubscribe = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!agreed) {
      setMessage("Please agree to receive marketing emails.");
      return;
    }

    if (!email.trim()) return;

    setMessage("Thank you for subscribing!");
    setEmail("");
    setAgreed(false);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="relative mt-20 bg-wine-950 text-white">
      {/* Newsletter */}
      <div className="border-b border-white/10">
        <div className="mx-auto flex max-w-3xl flex-col items-center px-5 py-16 text-center">
          <h2 className="text-3xl sm:text-4xl">Join the H Store list</h2>

          <p className="mt-3 text-sm text-white/70">
            Sign up for our newsletter and receive exclusive offers.
          </p>

          <form onSubmit={handleSubscribe} className="mt-7 w-full max-w-[520px]">
            <div className="flex h-12 border border-white/30 transition-colors focus-within:border-wine-200">
              <label htmlFor="newsletter-email" className="sr-only">
                Email address
              </label>

              <input
                id="newsletter-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your email address"
                className="w-full bg-transparent px-4 text-sm text-white outline-none placeholder:text-white/50"
              />

              <button
                type="submit"
                aria-label="Subscribe"
                className="px-5 text-lg transition-colors hover:bg-white hover:text-wine-900"
              >
                <FaArrowRight />
              </button>
            </div>

            <label className="mt-4 flex cursor-pointer items-center justify-center gap-2 text-center text-xs text-white/70">
              <input
                type="checkbox"
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
                className="h-3.5 w-3.5 accent-wine-300"
              />
              <span>I agree to receive marketing emails and special deals</span>
            </label>

            <p className="mt-3 min-h-5 text-xs text-wine-200" aria-live="polite">
              {message}
            </p>
          </form>
        </div>
      </div>

      {/* Main footer */}
      <div className="mx-auto grid max-w-7xl gap-12 px-6 py-14 sm:px-8 lg:grid-cols-[1.2fr_2fr]">
        <div>
          <Link href="/" className="inline-flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center bg-white font-serif text-2xl italic text-wine-800">
              H
            </span>
            <span className="font-serif text-xl">H Super Store.</span>
          </Link>

          <p className="mt-5 max-w-xs text-sm leading-7 text-white/65">
            Fashion, fragrance and finishing touches for the whole family,
            delivered to your door.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            {socialLinks.map((social) => {
              const Icon = social.icon;

              return (
                <a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.name}
                  className="grid h-10 w-10 place-items-center border border-white/25 text-base transition-all duration-300 hover:-translate-y-0.5 hover:border-wine-200 hover:bg-white hover:text-wine-800"
                >
                  <Icon />
                </a>
              );
            })}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-10 sm:grid-cols-3">
          {footerLinks.map((section) => (
            <div key={section.title}>
              <h3 className="mb-5 font-serif text-lg">{section.title}</h3>

              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-sm text-white/65 transition-colors duration-300 hover:text-white"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-6 py-5 text-xs text-white/55 sm:flex-row sm:px-8">
          <p>© 2026 H Store. All rights reserved.</p>

          <Link href="/contact" className="transition-colors hover:text-white">
            Contact us
          </Link>
        </div>
      </div>

      {/* Floating WhatsApp */}
      <a
        href="https://wa.me/"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="WhatsApp"
        className="fixed bottom-5 left-4 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#20d366] text-3xl text-white shadow-lg transition hover:scale-105"
      >
        <FaWhatsapp />
      </a>

      {/* Back To Top */}
      <button
        type="button"
        onClick={scrollToTop}
        aria-label="Back to top"
        className="fixed bottom-6 right-5 z-50 flex h-11 w-11 items-center justify-center bg-wine-700 text-lg text-white shadow-lg transition hover:bg-wine-800"
      >
        <FaArrowUp />
      </button>
    </footer>
  );
}
