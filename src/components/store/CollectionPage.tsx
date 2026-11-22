"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import api from "@/lib/api";
import Reveal from "@/components/ui/Reveal";
import SafeImage from "@/components/ui/SafeImage";
import ProductCard, { type CardProduct } from "@/components/store/ProductCard";
import {
  collections,
  getCollection,
  matchesCollection,
  type CollectionSlug,
} from "@/lib/collections";

interface Product extends CardProduct {
  status: "Active" | "Inactive";
  category: { _id: string; name: string } | string;
}

interface ProductsResponse {
  success: boolean;
  data: Product[];
  message?: string;
}

type SortKey = "featured" | "name" | "newest";

export default function CollectionPage({ slug }: { slug: CollectionSlug }) {
  const collection = getCollection(slug);

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [sort, setSort] = useState<SortKey>("featured");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await api.get<ProductsResponse>("/products");

        if (response.data.success) {
          setProducts(response.data.data || []);
        } else {
          setError(response.data.message || "Unable to load products");
        }
      } catch (err) {
        console.error(`${collection.label} products error:`, err);
        setError("Something went wrong while loading products.");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [collection.label]);

  // Only active products that belong to this collection's category
  const items = useMemo(() => {
    const filtered = products.filter(
      (product) =>
        product.status === "Active" &&
        matchesCollection(product.category, collection)
    );

    if (sort === "name") {
      return [...filtered].sort((a, b) => a.name.localeCompare(b.name));
    }

    return filtered;
  }, [products, collection, sort]);

  const others = collections.filter((item) => item.slug !== slug);

  return (
    <div className="bg-ivory text-brand">
      {/* HERO */}
      <section className="relative isolate overflow-hidden bg-wine-950">
        <SafeImage
          src={collection.heroImage}
          alt=""
          loading="eager"
          className="animate-drift absolute inset-0 -z-20 h-full w-full object-cover"
        />
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-wine-950/85 via-wine-950/55 to-wine-950/10" />

        <div className="mx-auto flex min-h-[340px] max-w-7xl flex-col justify-end px-5 pb-12 pt-24 sm:min-h-[420px] lg:px-8">
          <nav aria-label="Breadcrumb" className="mb-5 text-xs text-white/70">
            <Link href="/" className="transition hover:text-white">
              Home
            </Link>
            <span className="mx-2" aria-hidden="true">
              /
            </span>
            <span className="text-white">{collection.label}</span>
          </nav>

          <h1 className="animate-rise max-w-2xl text-4xl leading-[1.05] text-white sm:text-6xl">
            {collection.title}
          </h1>

          <p
            className="animate-rise mt-5 max-w-xl text-sm leading-7 text-white/80 sm:text-base"
            style={{ animationDelay: "120ms" }}
          >
            {collection.description}
          </p>
        </div>
      </section>

      {/* PRODUCTS */}
      <section className="mx-auto max-w-7xl px-5 py-12 lg:px-8 lg:py-16">
        <div className="mb-9 flex flex-col gap-4 border-b border-sand pb-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-2xl sm:text-3xl">
              Shop {collection.label}
            </h2>

            <p className="mt-2 text-sm text-gray-500" aria-live="polite">
              {loading
                ? "Loading products..."
                : `${items.length} ${items.length === 1 ? "product" : "products"}`}
            </p>
          </div>

          {!loading && !error && items.length > 1 && (
            <div className="flex items-center gap-3">
              <label htmlFor="collection-sort" className="text-xs text-gray-500">
                Sort by
              </label>

              <select
                id="collection-sort"
                value={sort}
                onChange={(event) => setSort(event.target.value as SortKey)}
                className="field w-auto py-2.5 text-xs"
              >
                <option value="featured">Featured</option>
                <option value="name">Name: A to Z</option>
              </select>
            </div>
          )}
        </div>

        {loading && (
          <div className="grid grid-cols-2 gap-x-4 gap-y-10 lg:grid-cols-4 lg:gap-x-7">
            {Array.from({ length: 8 }).map((_, index) => (
              <div key={index} aria-hidden="true">
                <div className="skeleton aspect-[3/4]" />
                <div className="skeleton mt-4 h-4 w-3/4" />
                <div className="skeleton mt-3 h-3 w-1/3" />
              </div>
            ))}
          </div>
        )}

        {!loading && error && (
          <div className="py-24 text-center">
            <h2 className="text-2xl">We couldn&apos;t load this collection</h2>
            <p className="mt-3 text-sm text-wine-700">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="btn-outline mt-7"
            >
              Try again
            </button>
          </div>
        )}

        {!loading && !error && items.length > 0 && (
          <div className="grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-6 lg:grid-cols-4 lg:gap-x-7">
            {items.map((product, index) => (
              <Reveal key={product._id} delay={(index % 4) * 70}>
                <ProductCard
                  product={product}
                  fallbackImage={collection.fallbackImage}
                />
              </Reveal>
            ))}
          </div>
        )}

        {!loading && !error && items.length === 0 && (
          <div className="py-24 text-center">
            <h2 className="text-2xl">Nothing here yet</h2>
            <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-gray-500">
              New {collection.label.toLowerCase()} pieces are on their way. In the
              meantime, browse the full shop.
            </p>
            <Link href="/products" className="btn-primary mt-7">
              Browse the shop
            </Link>
          </div>
        )}
      </section>

      {/* OTHER COLLECTIONS */}
      <section className="border-t border-sand bg-cream">
        <div className="mx-auto max-w-7xl px-5 py-12 lg:px-8">
          <h2 className="mb-6 text-xl">More collections</h2>

          <div className="flex flex-wrap gap-3">
            {others.map((item) => (
              <Link
                key={item.slug}
                href={item.href}
                className="border border-sand bg-ivory px-6 py-3 text-sm transition-colors duration-300 hover:border-wine-700 hover:bg-wine-700 hover:text-white"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
