"use client";

import { useEffect, useMemo, useState, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Search, X, ArrowRight, ShoppingBag } from "lucide-react";
import api from "@/lib/api";
import SafeImage from "@/components/ui/SafeImage";
import { collections, categoryNameOf } from "@/lib/collections";

interface SearchProduct {
  _id: string;
  name: string;
  image?: string;
  status: string;
  category?: { _id: string; name: string } | string;
}

// Only routes that exist in the project
const pageItems = [
  ...collections.map((item) => ({
    title: `${item.label} Collection`,
    category: "Collection",
    href: item.href,
  })),
  { title: "Shop all products", category: "Page", href: "/products" },
  { title: "About Us", category: "Page", href: "/about" },
  { title: "Contact Us", category: "Page", href: "/contact" },
  { title: "My Wishlist", category: "Page", href: "/wishlist" },
  { title: "My Orders", category: "Page", href: "/orders" },
];

function SearchContent() {
  const searchParams = useSearchParams();

  const [search, setSearch] = useState(searchParams.get("q") || "");
  const [products, setProducts] = useState<SearchProduct[]>([]);

  // Real products come from the same endpoint the shop uses
  useEffect(() => {
    const load = async () => {
      try {
        const response = await api.get("/products");

        if (response.data.success) {
          setProducts(
            (response.data.data as SearchProduct[]).filter(
              (product) => product.status === "Active"
            )
          );
        }
      } catch (err) {
        console.error("Search products error:", err);
      }
    };

    load();
  }, []);

  const query = search.trim().toLowerCase();

  const pageResults = useMemo(() => {
    if (!query) return [];
    return pageItems.filter((item) => item.title.toLowerCase().includes(query));
  }, [query]);

  const productResults = useMemo(() => {
    if (!query) return [];
    return products
      .filter(
        (product) =>
          product.name.toLowerCase().includes(query) ||
          categoryNameOf(product.category).toLowerCase().includes(query)
      )
      .slice(0, 12);
  }, [query, products]);

  const total = pageResults.length + productResults.length;

  return (
    <div className="bg-ivory px-4 py-16 sm:px-8">
      <div className="mx-auto w-full md:w-[70%]">
        {/* Search Heading */}
        <div className="mb-10 text-center">
          <h1 className="text-4xl sm:text-5xl">Search</h1>

          <p className="mt-3 text-sm text-gray-500">
            Find exactly what you are looking for.
          </p>
        </div>

        {/* Search Box */}
        <div className="flex items-center border-b border-brand py-4 transition-colors focus-within:border-wine-700">
          <Search size={23} className="shrink-0 text-brand" aria-hidden="true" />

          <label htmlFor="site-search" className="sr-only">
            Search products and pages
          </label>
          <input
            id="site-search"
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="What are you looking for?"
            className="ml-4 w-full bg-transparent text-base text-brand outline-none placeholder:text-gray-400 sm:text-lg"
            autoFocus
          />

          {search && (
            <button
              type="button"
              onClick={() => setSearch("")}
              className="ml-3 text-gray-500 hover:text-wine-700"
              aria-label="Clear search"
            >
              <X size={21} />
            </button>
          )}
        </div>

        {/* Search Results */}
        <div className="mt-10" aria-live="polite">
          {!query ? (
            <div className="py-12 text-center">
              <ShoppingBag size={35} className="mx-auto mb-4 text-wine-300" aria-hidden="true" />
              <p className="text-sm text-gray-500">
                Start typing to discover something you love.
              </p>
            </div>
          ) : total > 0 ? (
            <>
              <p className="mb-5 text-sm text-gray-500">
                {total} {total === 1 ? "result" : "results"}
              </p>

              {productResults.length > 0 && (
                <div className="mb-10">
                  <h2 className="mb-2 text-xl">Products</h2>

                  <div className="divide-y divide-sand">
                    {productResults.map((product) => (
                      <Link
                        key={product._id}
                        href={`/products/${product._id}`}
                        className="group flex items-center gap-4 py-4 transition-colors hover:bg-cream"
                      >
                        <div className="h-16 w-14 shrink-0 overflow-hidden bg-cream">
                          <SafeImage
                            src={product.image}
                            alt={product.name}
                            className="h-full w-full object-cover"
                          />
                        </div>

                        <div className="min-w-0 flex-1">
                          <p className="truncate font-serif text-lg">{product.name}</p>
                          <p className="mt-0.5 text-xs text-gray-500">
                            {categoryNameOf(product.category) || "Product"}
                          </p>
                        </div>

                        <ArrowRight
                          size={19}
                          className="text-gray-400 transition-transform group-hover:translate-x-1 group-hover:text-wine-700"
                          aria-hidden="true"
                        />
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {pageResults.length > 0 && (
                <div>
                  <h2 className="mb-2 text-xl">Collections and pages</h2>

                  <div className="divide-y divide-sand">
                    {pageResults.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        className="group flex items-center justify-between py-4 transition-colors hover:bg-cream"
                      >
                        <div>
                          <p className="font-serif text-lg">{item.title}</p>
                          <p className="mt-0.5 text-xs text-gray-500">{item.category}</p>
                        </div>

                        <ArrowRight
                          size={19}
                          className="text-gray-400 transition-transform group-hover:translate-x-1 group-hover:text-wine-700"
                          aria-hidden="true"
                        />
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="py-16 text-center">
              <Search size={35} className="mx-auto mb-4 text-wine-300" aria-hidden="true" />

              <h2 className="text-xl">No results found</h2>

              <p className="mt-2 text-sm text-gray-500">
                Try a different keyword, or browse the{" "}
                <Link href="/products" className="text-wine-700 underline underline-offset-4">
                  full shop
                </Link>
                .
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-ivory">
          <p className="text-sm text-gray-500">Loading search...</p>
        </div>
      }
    >
      <SearchContent />
    </Suspense>
  );
}
