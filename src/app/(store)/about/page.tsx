
"use client";

import Link from "next/link";
import { useState } from "react";

const collections = [
  {
    name: "Men",
    subtitle: "Everyday essentials & modern style",
    image:
      "https://images.unsplash.com/photo-1617137968427-85924c800a22?auto=format&fit=crop&w=1000&q=85",
    href: "/men",
  },
  {
    name: "Women",
    subtitle: "Explore your personal style",
    image:
      "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=1000&q=85",
    href: "/women",
  },
  {
    name: "Kids",
    subtitle: "Comfortable styles for little ones",
    image:
      "https://images.unsplash.com/photo-1503919005314-30d93d07d823?auto=format&fit=crop&w=1000&q=85",
    href: "/kids",
  },
];

const benefits = [
  {
    icon: "✦",
    title: "Curated Collections",
    description:
      "Discover carefully selected styles for different tastes, occasions, and lifestyles.",
  },
  {
    icon: "♡",
    title: "Style & Comfort",
    description:
      "Explore fashion that brings together everyday comfort and modern style.",
  },
  {
    icon: "◇",
    title: "Something for Everyone",
    description:
      "From men's and women's fashion to kids' collections and accessories.",
  },
  {
    icon: "↗",
    title: "Easy Shopping",
    description:
      "Browse collections and discover your next favourite look with ease.",
  },
];

const faqs = [
  {
    question: "What can I shop at H Stores?",
    answer:
      "You can explore men's fashion, women's fashion, kids' collections, fragrance, jewellery, and accessories.",
  },
  {
    question: "Can I browse different product categories?",
    answer:
      "Yes! Use the Categories menu in the navbar to explore the different collections available at H Stores.",
  },
  {
    question: "Can I select my country and currency?",
    answer:
      "Yes! Select your country from the country selector in the navbar. Product prices are displayed according to the prices configured for that country.",
  },
  {
    question: "How can I contact H Stores?",
    answer:
      "Visit our Contact page and send us a message. Our team will be happy to assist you.",
  },
];

export default function AboutPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  return (
    <div className="overflow-hidden bg-white text-gray-900">

      {/* HERO SECTION */}
      <section className="relative flex min-h-[520px] items-center justify-center overflow-hidden md:min-h-[680px]">

        <img
          src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=2200&q=90"
          alt="H Stores fashion shopping experience"
          className="absolute inset-0 h-full w-full object-cover"
        />

        <div className="absolute inset-0 bg-wine-950/55" />

        <div className="relative z-10 mx-auto max-w-4xl px-5 py-24 text-center text-white">

          <span className="mb-6 inline-block border border-white/40 px-5 py-2 text-[10px] font-medium uppercase tracking-[4px]">
            Welcome to H Stores
          </span>

          <h1 className="font-serif text-5xl leading-tight sm:text-6xl md:text-7xl">
            Fashion Is More
            <br />
            Than Just Clothing.
          </h1>

          <p className="mx-auto mt-7 max-w-2xl text-sm leading-8 text-gray-200 sm:text-base">
            Discover a shopping destination where personal style,
            everyday comfort, and modern fashion come together.
          </p>

          <Link
            href="/products"
            className="mt-9 inline-flex items-center gap-3 bg-white px-9 py-4 text-xs font-semibold uppercase tracking-[2px] text-brand transition duration-300 hover:bg-wine-700 hover:text-white"
          >
            Explore Products
            <span>→</span>
          </Link>

        </div>

        <div className="absolute bottom-7 left-1/2 hidden -translate-x-1/2 text-[9px] uppercase tracking-[4px] text-white/70 sm:block">
          Discover Your Style
        </div>

      </section>

      {/* STORY SECTION */}
      <section className="mx-auto max-w-7xl px-5 py-20 md:px-10 md:py-28">

        <div className="grid items-center gap-12 md:grid-cols-2 md:gap-20">

          <div className="relative">

            <div className="relative h-[390px] overflow-hidden sm:h-[480px] md:h-[560px]">
              <img
                src="https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?auto=format&fit=crop&w=1200&q=85"
                alt="Fashion store interior and shopping experience"
                className="h-full w-full object-cover transition duration-700 hover:scale-105"
              />
            </div>

            <div className="absolute -bottom-5 -right-3 bg-wine-700 px-7 py-6 text-white sm:-right-5 sm:px-10 sm:py-8">
              <p className="font-serif text-3xl sm:text-4xl">
                H Stores
              </p>
              <p className="mt-2 text-[9px] uppercase tracking-[3px] text-white/80">
                Your Style Destination
              </p>
            </div>

          </div>

          <div className="pt-8 md:pt-0">

            <p className="mb-5 text-[10px] font-semibold uppercase tracking-[4px] text-wine-700">
              Who We Are
            </p>

            <h2 className="font-serif text-4xl leading-tight sm:text-5xl md:text-6xl">
              A Place Where
              <br />
              <span className="italic text-wine-700">
                Style Comes Alive.
              </span>
            </h2>

            <div className="my-8 h-[2px] w-16 bg-wine-700" />

            <p className="mb-5 text-sm leading-8 text-gray-600 sm:text-base">
              At H Stores, we believe fashion is more than just
              clothing. It is an expression of personality,
              confidence, and individuality.
            </p>

            <p className="mb-8 text-sm leading-8 text-gray-600 sm:text-base">
              Our goal is to bring different fashion categories
              together in one convenient shopping destination.
              Whether you are exploring everyday essentials or
              looking for something special, there is always
              something new to discover.
            </p>

            <Link
              href="/products"
              className="inline-flex items-center gap-4 border-b border-brand pb-3 text-xs font-semibold uppercase tracking-[2px] transition hover:border-wine-700 hover:text-wine-700"
            >
              Discover Our Collections
              <span className="text-lg">→</span>
            </Link>

          </div>

        </div>

      </section>

      {/* MISSION SECTION */}
      <section className="relative overflow-hidden bg-cream px-5 py-20 md:py-28">

        <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full border border-brand/5 md:h-96 md:w-96" />

        <div className="pointer-events-none absolute -bottom-28 -left-20 h-72 w-72 rounded-full border border-brand/5 md:h-96 md:w-96" />

        <div className="relative mx-auto max-w-4xl text-center">

          <p className="mb-5 text-[10px] font-semibold uppercase tracking-[4px] text-wine-700">
            What Drives Us
          </p>

          <h2 className="font-serif text-4xl leading-tight sm:text-5xl md:text-6xl">
            Our Mission
          </h2>

          <div className="mx-auto my-8 h-[2px] w-16 bg-wine-700" />

          <p className="text-sm leading-8 text-gray-600 sm:text-base md:text-lg">
            Our mission is to make fashion accessible, enjoyable,
            and inspiring for everyone. We want to create a smooth
            shopping experience through thoughtfully presented
            collections, convenient browsing, and a variety of
            styles for different lifestyles.
          </p>

          <p className="mt-8 font-serif text-2xl italic text-wine-700 sm:text-3xl">
            Your Style. Your Story.
          </p>

        </div>

      </section>

      {/* COLLECTIONS SECTION */}
      <section className="mx-auto max-w-7xl px-5 py-20 md:px-10 md:py-28">

        <div className="mb-12 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">

          <div>
            <p className="mb-4 text-[10px] font-semibold uppercase tracking-[4px] text-wine-700">
              Find Your Style
            </p>

            <h2 className="font-serif text-4xl sm:text-5xl">
              Explore Our World
            </h2>
          </div>

          <Link
            href="/products"
            className="w-fit border-b border-brand pb-2 text-xs font-semibold uppercase tracking-[2px] transition hover:border-wine-700 hover:text-wine-700"
          >
            View All Collections →
          </Link>

        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">

          {collections.map((collection) => (
            <Link
              href={collection.href}
              key={collection.name}
              className="group relative block overflow-hidden bg-gray-100"
            >

              <div className="relative h-[380px] overflow-hidden sm:h-[440px]">

                <img
                  src={collection.image}
                  alt={`${collection.name} collection at H Stores`}
                  className="h-full w-full object-cover transition duration-700 group-hover:scale-110"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent transition duration-500 group-hover:from-black/85" />

                <div className="absolute bottom-0 left-0 w-full p-7 text-white sm:p-9">

                  <p className="mb-3 text-[9px] uppercase tracking-[3px] text-white/75">
                    Explore Collection
                  </p>

                  <h3 className="font-serif text-4xl">
                    {collection.name}
                  </h3>

                  <p className="mt-2 text-xs text-gray-200">
                    {collection.subtitle}
                  </p>

                  <div className="mt-6 flex items-center gap-3 text-xs font-semibold uppercase tracking-[2px]">
                    Shop Now
                    <span className="transition-transform duration-300 group-hover:translate-x-2">
                      →
                    </span>
                  </div>

                </div>

              </div>

            </Link>
          ))}

        </div>

      </section>

      {/* WHY CHOOSE US */}
      <section className="bg-wine-950 px-5 py-20 text-white md:py-28">

        <div className="mx-auto max-w-7xl">

          <div className="mb-14 text-center">

            <p className="mb-5 text-[10px] font-semibold uppercase tracking-[4px] text-wine-200">
              The H Stores Experience
            </p>

            <h2 className="font-serif text-4xl sm:text-5xl md:text-6xl">
              Why Shop With Us?
            </h2>

            <p className="mx-auto mt-5 max-w-xl text-sm leading-7 text-gray-400">
              Discover what makes shopping at H Stores a convenient
              way to explore your personal style.
            </p>

          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">

            {benefits.map((item) => (
              <div
                key={item.title}
                className="border border-white/10 px-7 py-9 text-center transition duration-300 hover:-translate-y-2 hover:border-wine-700"
              >

                <span className="mb-6 inline-flex h-14 w-14 items-center justify-center rounded-full border border-white/20 font-serif text-3xl text-wine-200">
                  {item.icon}
                </span>

                <h3 className="mb-4 font-serif text-xl">
                  {item.title}
                </h3>

                <p className="text-sm leading-7 text-gray-400">
                  {item.description}
                </p>

              </div>
            ))}

          </div>

        </div>

      </section>

      {/* FAQ SECTION */}
      <section className="mx-auto max-w-4xl px-5 py-20 md:py-28">

        <div className="mb-12 text-center">

          <p className="mb-4 text-[10px] font-semibold uppercase tracking-[4px] text-wine-700">
            Need To Know?
          </p>

          <h2 className="font-serif text-4xl sm:text-5xl">
            Frequently Asked Questions
          </h2>

        </div>

        <div className="divide-y divide-gray-200 border-y border-gray-200">

          {faqs.map((faq, index) => (
            <div key={faq.question}>

              <button
                type="button"
                onClick={() =>
                  setOpenFaq(openFaq === index ? null : index)
                }
                aria-expanded={openFaq === index}
                className="flex w-full items-center justify-between gap-5 py-6 text-left"
              >

                <span className="text-sm font-semibold text-gray-800 sm:text-base">
                  {faq.question}
                </span>

                <span
                  className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-gray-200 text-lg transition duration-300 ${
                    openFaq === index
                      ? "rotate-45 border-wine-700 text-wine-700"
                      : "text-gray-500"
                  }`}
                >
                  +
                </span>

              </button>

              <div
                className={`grid transition-all duration-300 ${
                  openFaq === index
                    ? "grid-rows-[1fr] pb-6 opacity-100"
                    : "grid-rows-[0fr] opacity-0"
                }`}
              >

                <div className="overflow-hidden">

                  <p className="max-w-3xl text-sm leading-8 text-gray-500">
                    {faq.answer}
                  </p>

                </div>

              </div>

            </div>
          ))}

        </div>

      </section>

      {/* FINAL CTA */}
      <section className="relative overflow-hidden bg-wine-700 px-5 py-20 text-center text-white md:py-28">

        <div className="pointer-events-none absolute -left-20 -top-24 h-72 w-72 rounded-full border border-white/10" />

        <div className="pointer-events-none absolute -bottom-32 -right-20 h-96 w-96 rounded-full border border-white/10" />

        <div className="relative mx-auto max-w-3xl">

          <p className="mb-5 text-[10px] font-semibold uppercase tracking-[4px] text-white/70">
            Your Style, Your Story
          </p>

          <h2 className="font-serif text-4xl leading-tight sm:text-5xl md:text-6xl">
            Ready To Discover
            <br />
            Your Next Favourite Look?
          </h2>

          <p className="mx-auto mt-6 max-w-xl text-sm leading-8 text-white/80">
            Explore our collections and find styles that reflect
            your personality. Your next favourite piece might
            be just one click away.
          </p>

          <div className="mt-9 flex flex-col justify-center gap-4 sm:flex-row">

            <Link
              href="/products"
              className="bg-white px-9 py-4 text-xs font-semibold uppercase tracking-[2px] text-wine-700 transition hover:bg-brand hover:text-white"
            >
              Shop Now
            </Link>

            <Link
              href="/contact"
              className="border border-white/60 px-9 py-4 text-xs font-semibold uppercase tracking-[2px] text-white transition hover:bg-white hover:text-wine-700"
            >
              Contact Us
            </Link>

          </div>

        </div>

      </section>

    </div>
  );
}
