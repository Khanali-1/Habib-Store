"use client";

import Link from "next/link";
import { Suspense, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import api from "@/lib/api";
import Reveal from "@/components/ui/Reveal";
import ProductCard, { type CardProduct } from "@/components/store/ProductCard";
import { useCountry } from "@/context/CountryContext";
import { getDisplayPrice } from "@/lib/pricing";

interface Category {
  _id: string;
  name: string;
}

interface Product extends CardProduct {
  status?: string;
  category: Category | string;
}

interface ApiResponse<T> {
  success: boolean;
  data: T;
}

function ShopContent() {
  const searchParams = useSearchParams();
  const { selectedCountry } = useCountry();

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);

  // The homepage links here with ?category=<id>
  const [activeCategory, setActiveCategory] = useState(
    searchParams.get("category") || "All"
  );
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("featured");
  // null = no limit, so expensive products are never hidden by default
  const [maxPriceInput, setMaxPriceInput] = useState<number | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // FETCH REAL PRODUCTS AND CATEGORIES FROM DATABASE
  useEffect(() => {
    const fetchShopData = async () => {
      try {
        setLoading(true);
        setError("");

        const [productsResponse, categoriesResponse] = await Promise.all([
          api.get<ApiResponse<Product[]>>("/products"),
          api.get<ApiResponse<Category[]>>("/categories"),
        ]);

        if (productsResponse.data.success) {
          setProducts(productsResponse.data.data || []);
        }

        if (categoriesResponse.data.success) {
          setCategories(categoriesResponse.data.data || []);
        }
      } catch (err) {
        console.error("Shop data error:", err);
        setError("Unable to load products. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchShopData();
  }, []);

  // Slider range follows the real catalogue (at least Rs. 5,000)
  const maxRange = useMemo(() => {
    const highest = products.reduce(
      (max, product) => Math.max(max, Number(product.price) || 0),
      0
    );
    return Math.max(5000, Math.ceil(highest / 1000) * 1000);
  }, [products]);

  const maxPrice = maxPriceInput ?? maxRange;

  // FILTER PRODUCTS
  const filteredProducts = useMemo(() => {
    const result = products.filter((product) => {
      const categoryId =
        typeof product.category === "object" && product.category !== null
          ? product.category._id
          : product.category;

      const categoryMatch =
        activeCategory === "All" || categoryId === activeCategory;

      const searchMatch = product.name
        .toLowerCase()
        .includes(search.toLowerCase());

      const priceMatch = Number(product.price) <= maxPrice;

      return categoryMatch && searchMatch && priceMatch;
    });

    const priceOf = (product: Product) =>
      getDisplayPrice(product, selectedCountry).amount || Number(product.price);

    if (sort === "low") {
      result.sort((a, b) => priceOf(a) - priceOf(b));
    } else if (sort === "high") {
      result.sort((a, b) => priceOf(b) - priceOf(a));
    } else if (sort === "name") {
      result.sort((a, b) => a.name.localeCompare(b.name));
    }

    return result;
  }, [products, activeCategory, search, sort, maxPrice, selectedCountry]);

  // RESET FILTERS
  const resetFilters = () => {
    setActiveCategory("All");
    setSearch("");
    setSort("featured");
    setMaxPriceInput(null);
  };

  const chip = (active: boolean) =>
    `shrink-0 border px-5 py-2.5 text-xs font-medium transition-colors duration-300 ${
      active
        ? "border-wine-700 bg-wine-700 text-white"
        : "border-sand bg-ivory text-gray-600 hover:border-wine-700 hover:text-wine-700"
    }`;

  return (
    <div className="bg-ivory text-brand">
      {/* PAGE BANNER */}
      <section className="bg-cream px-5 py-16 text-center sm:py-20">
        <h1 className="animate-rise text-4xl sm:text-6xl">Our collection</h1>

        <p
          className="animate-rise mx-auto mt-5 max-w-xl text-sm leading-7 text-gray-600"
          style={{ animationDelay: "120ms" }}
        >
          Explore our carefully selected collection of fashion, accessories and
          lifestyle essentials. The newest pieces come first.
        </p>

        <nav aria-label="Breadcrumb" className="mt-6 text-xs text-gray-500">
          <Link href="/" className="transition hover:text-wine-700">
            Home
          </Link>
          <span className="mx-2" aria-hidden="true">/</span>
          <span className="text-wine-700">Shop</span>
        </nav>
      </section>

      {/* SHOP CONTENT */}
      <section className="mx-auto max-w-7xl px-5 py-12 lg:px-8">
        {/* TOP TOOLBAR */}
        <div className="mb-8 flex flex-col justify-between gap-5 border-b border-sand pb-6 md:flex-row md:items-center">
          <div>
            <h2 className="text-2xl sm:text-3xl">Shop all products</h2>

            <p className="mt-2 text-sm text-gray-500" aria-live="polite">
              Showing {filteredProducts.length} products
            </p>
          </div>

          {/* SEARCH AND SORT */}
          <div className="flex flex-col gap-3 sm:flex-row">
            <label htmlFor="shop-search" className="sr-only">
              Search products
            </label>
            <input
              id="shop-search"
              type="search"
              placeholder="Search products"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="field h-11 sm:w-60"
            />

            <label htmlFor="shop-sort" className="sr-only">
              Sort products
            </label>
            <select
              id="shop-sort"
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="field h-11 sm:w-auto"
            >
              <option value="featured">Featured</option>
              <option value="low">Price: Low to High</option>
              <option value="high">Price: High to Low</option>
              <option value="name">Name: A to Z</option>
            </select>
          </div>
        </div>

        {/* CATEGORY FILTERS - REAL DATABASE CATEGORIES */}
        <div className="mb-8 flex gap-3 overflow-x-auto pb-3">
          <button
            type="button"
            onClick={() => setActiveCategory("All")}
            aria-pressed={activeCategory === "All"}
            className={chip(activeCategory === "All")}
          >
            All
          </button>

          {categories.map((category) => (
            <button
              type="button"
              key={category._id}
              onClick={() => setActiveCategory(category._id)}
              aria-pressed={activeCategory === category._id}
              className={chip(activeCategory === category._id)}
            >
              {category.name}
            </button>
          ))}
        </div>

        {/* PRICE FILTER */}
        <div className="mb-10 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <label htmlFor="shop-max-price" className="text-xs font-medium">
              Maximum price (PKR)
            </label>

            <input
              id="shop-max-price"
              type="range"
              min="1000"
              max={maxRange}
              step="100"
              value={maxPrice}
              onChange={(e) => setMaxPriceInput(Number(e.target.value))}
              className="w-36 accent-wine-700"
            />

            <span className="text-xs font-medium text-wine-700">
              Rs. {maxPrice.toLocaleString("en-US")}
            </span>
          </div>

          <button
            type="button"
            onClick={resetFilters}
            className="text-left text-xs font-medium text-gray-500 underline underline-offset-4 transition hover:text-wine-700 sm:text-right"
          >
            Clear all filters
          </button>
        </div>

        {/* PRODUCT GRID */}
        {loading ? (
          <div className="grid grid-cols-2 gap-x-4 gap-y-10 lg:grid-cols-4 lg:gap-x-7" aria-hidden="true">
            {Array.from({ length: 8 }).map((_, index) => (
              <div key={index}>
                <div className="skeleton aspect-[3/4]" />
                <div className="skeleton mt-4 h-4 w-3/4" />
                <div className="skeleton mt-3 h-3 w-1/3" />
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="py-24 text-center">
            <h3 className="text-2xl">Something went wrong</h3>
            <p className="mt-3 text-sm text-wine-700">{error}</p>
          </div>
        ) : filteredProducts.length > 0 ? (
          <div className="grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-6 lg:grid-cols-4 lg:gap-x-7">
            {filteredProducts.map((product, index) => (
              <Reveal key={product._id} delay={(index % 4) * 70}>
                <ProductCard product={product} showCategory />
              </Reveal>
            ))}
          </div>
        ) : (
          <div className="py-24 text-center">
            <h3 className="text-2xl">No products found</h3>

            <p className="mt-3 text-sm text-gray-500">
              Try changing your search or filters.
            </p>

            <button type="button" onClick={resetFilters} className="btn-primary mt-7">
              Reset filters
            </button>
          </div>
        )}
      </section>
    </div>
  );
}

export default function ShopPage() {
  return (
    <Suspense fallback={<div className="min-h-[60vh]" aria-hidden="true" />}>
      <ShopContent />
    </Suspense>
  );
}
