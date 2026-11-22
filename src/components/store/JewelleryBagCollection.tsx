"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import api from "@/lib/api";
import Reveal from "@/components/ui/Reveal";
import SafeImage from "@/components/ui/SafeImage";
import {
  getCollection,
  matchesCollection,
  type CollectionSlug,
} from "@/lib/collections";

interface Product {
  _id: string;
  name: string;
  image: string;
  status: string;
  category: { _id: string; name: string };
}

const tiles: { slug: CollectionSlug; blurb: string }[] = [
  { slug: "jewellery", blurb: "Gold, stone and everyday shine" },
  { slug: "fragrance", blurb: "Scents worth remembering" },
  { slug: "accessories", blurb: "The details that finish a look" },
];

export default function JewelleryBagCollection() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const getData = async () => {
      try {
        const response = await api.get("/products");
        setProducts(response.data.data);
      } catch (err) {
        console.error("Collection products error:", err);
        setError("Unable to load collection products.");
      } finally {
        setLoading(false);
      }
    };

    getData();
  }, []);

  return (
    <section className="mx-auto max-w-7xl px-5 py-12 lg:px-8 lg:py-16">
      <div className="mb-8 max-w-xl">
        <h2 className="text-3xl sm:text-4xl">Finishing touches</h2>
        <p className="mt-3 text-sm leading-7 text-gray-600">
          Jewellery, fragrance and accessories to complete every outfit.
        </p>
      </div>

      {error && <p className="mb-6 text-sm text-wine-700">{error}</p>}

      <div className="grid gap-4 sm:grid-cols-3 sm:gap-5">
        {tiles.map((tile, index) => {
          const collection = getCollection(tile.slug);

          // Real product image first; editorial photo only when none exists
          const product = products.find(
            (item) =>
              item.status === "Active" &&
              item.image &&
              matchesCollection(item.category, collection)
          );

          return (
            <Reveal key={tile.slug} delay={index * 100}>
              <Link
                href={collection.href}
                className="group relative block aspect-[4/5] overflow-hidden bg-cream"
              >
                {loading ? (
                  <div className="skeleton absolute inset-0" aria-hidden="true" />
                ) : (
                  <SafeImage
                    src={product?.image}
                    fallbackSrc={collection.fallbackImage}
                    alt={product?.name ?? collection.label}
                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-[900ms] ease-[var(--ease-luxe)] group-hover:scale-[1.06]"
                  />
                )}

                <div className="absolute inset-0 bg-gradient-to-t from-wine-950/80 via-wine-950/10 to-transparent" />

                <div className="absolute inset-x-0 bottom-0 p-6 text-white">
                  <h3 className="text-2xl">{collection.label}</h3>
                  <p className="mt-1 text-sm text-white/80">{tile.blurb}</p>
                  <span className="mt-4 inline-block border-b border-white/70 pb-0.5 text-xs transition-all duration-300 group-hover:border-white">
                    Shop {collection.label.toLowerCase()}
                  </span>
                </div>
              </Link>
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}
