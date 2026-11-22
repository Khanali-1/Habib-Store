"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import SafeImage from "@/components/ui/SafeImage";

const photo = (id: string) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=2000&q=80`;

// Each slide now points at the matching collection page
const slides = [
  {
    image: photo("photo-1541643600914-78b084683601"),
    subtitle: "Discover your signature scent",
    title: "Feel Beautiful,",
    highlight: "Smell Amazing",
    description:
      "Discover beautiful fragrances and make every moment unforgettable.",
    href: "/fragrance",
    cta: "Shop fragrance",
  },
  {
    image: photo("photo-1483985988355-763728e1935b"),
    subtitle: "Timeless fashion and elegance",
    title: "Dress With",
    highlight: "Confidence",
    description:
      "Explore elegant fashion, beautiful outfits, and timeless styles at H-Store.",
    href: "/women",
    cta: "Shop women",
  },
  {
    image: photo("photo-1503919005314-30d93d07d823"),
    subtitle: "Little styles, happy smiles",
    title: "Made For",
    highlight: "Little Stars",
    description:
      "Find lovely kids' outfits and comfortable everyday styles for your little ones.",
    href: "/kids",
    cta: "Shop kids",
  },
];

// Duplicate first slide for seamless looping
const infiniteSlides = [...slides, slides[0]];

export default function HeroSlider() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [transitionEnabled, setTransitionEnabled] = useState(true);
  const [paused, setPaused] = useState(false);

  // Automatic slider (pauses on hover or focus)
  useEffect(() => {
    if (paused) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => prev + 1);
    }, 5500);

    return () => clearInterval(interval);
  }, [paused]);

  // Reset position after reaching duplicate first slide
  const handleTransitionEnd = () => {
    if (currentSlide === slides.length) {
      setTransitionEnabled(false);
      setCurrentSlide(0);
    }
  };

  // Restore transition after reset
  useEffect(() => {
    if (!transitionEnabled) {
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setTransitionEnabled(true);
        });
      });
    }
  }, [transitionEnabled]);

  // Manual navigation
  const goToSlide = (index: number) => {
    setTransitionEnabled(true);
    setCurrentSlide(index);
  };

  const activeIndex = currentSlide % slides.length;
  const active = slides[activeIndex];

  return (
    <section
      aria-roledescription="carousel"
      aria-label="Featured collections"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
      className="relative h-[calc(100svh-76px)] min-h-[520px] w-full overflow-hidden bg-wine-950"
    >
      {/* Infinite Image Track */}
      <div
        onTransitionEnd={handleTransitionEnd}
        className={`flex h-full w-full ${
          transitionEnabled
            ? "transition-transform duration-[1500ms] ease-[var(--ease-luxe)]"
            : ""
        }`}
        style={{ transform: `translateX(-${currentSlide * 100}%)` }}
      >
        {infiniteSlides.map((slide, index) => (
          <div key={index} className="relative h-full min-w-full shrink-0 overflow-hidden">
            <SafeImage
              src={slide.image}
              alt=""
              loading={index === 0 ? "eager" : "lazy"}
              className="animate-drift h-full w-full object-cover"
            />
          </div>
        ))}
      </div>

      {/* Colour wash for legibility */}
      <div className="absolute inset-0 z-10 bg-gradient-to-t from-wine-950/80 via-wine-950/35 to-wine-950/20" />

      {/* Content */}
      <div className="absolute inset-0 z-20 flex items-end px-5 pb-20 text-white sm:items-center sm:pb-0 lg:px-16">
        <div key={activeIndex} className="animate-rise max-w-2xl" aria-live="polite">
          <p className="mb-5 text-sm tracking-wide text-wine-100 sm:text-base">
            {active.subtitle}
          </p>

          <h1 className="text-5xl leading-[1.02] sm:text-6xl md:text-7xl">
            {active.title}
            <br />
            <span className="italic text-wine-100">{active.highlight}</span>
          </h1>

          <p className="mt-6 max-w-lg text-base leading-8 text-white/85 sm:text-lg">
            {active.description}
          </p>

          <div className="mt-9 flex flex-wrap items-center gap-4">
            <Link
              href={active.href}
              className="inline-flex items-center gap-3 bg-ivory px-9 py-4 text-sm font-medium text-wine-900 transition-colors duration-300 hover:bg-white"
            >
              {active.cta}
            </Link>

            <Link
              href="/products"
              className="link-underline text-sm font-medium text-white"
            >
              Browse everything
            </Link>
          </div>
        </div>
      </div>

      {/* Slider Dots */}
      <div className="absolute bottom-7 left-5 z-30 flex gap-3 lg:left-16">
        {slides.map((slide, index) => (
          <button
            key={slide.title}
            type="button"
            onClick={() => goToSlide(index)}
            aria-label={`Go to slide ${index + 1}`}
            aria-current={activeIndex === index}
            className={`h-[3px] transition-all duration-700 ${
              activeIndex === index ? "w-12 bg-white" : "w-6 bg-white/50 hover:bg-white/80"
            }`}
          />
        ))}
      </div>
    </section>
  );
}
