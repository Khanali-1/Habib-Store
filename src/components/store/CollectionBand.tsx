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
  price: number;
  status: string;
  category: { _id: string; name: string };
}

interface CollectionBandProps {
  slug: CollectionSlug;
  tagline: string;
  /** Puts the text panel on the right on large screens */
  flip?: boolean;
}

/**
 * Homepage band showing the first three real products of a collection.
 * Data logic is the same as the previous Women/Men/Kids components.
 */
export default function CollectionBand({ slug, tagline, flip = false }: CollectionBandProps) {
  const collection = getCollection(slug);

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const getData = async () => {
      try {
        const response = await api.get("/products");
        const allProducts: Product[] = response.data.data;

        const matched = allProducts.filter(
          (product) =>
            product.status === "Active" &&
            matchesCollection(product.category, collection) &&
            product.image
        );

        setProducts(matched.slice(0, 3));
      } catch (err) {
        console.error(`${collection.label} products error:`, err);
        setError(`Unable to load ${collection.label.toLowerCase()} products.`);
      } finally {
        setLoading(false);
      }
    };

    getData();
  }, [collection]);

  return (
    <section className="mx-auto max-w-7xl px-5 py-10 lg:px-8 lg:py-14">
      <div className="grid items-stretch gap-5 lg:grid-cols-[5fr_7fr]">
        {/* TEXT PANEL */}
        <Reveal className={flip ? "lg:order-2" : ""}>
          <div className="flex h-full min-h-[280px] flex-col justify-center bg-cream px-8 py-12 sm:px-12">
            <p className="mb-4 text-sm text-wine-700">{tagline}</p>

            <h2 className="text-4xl leading-[1.05] sm:text-5xl">
              {collection.label}
              <span className="block font-normal italic text-wine-700">
                Collection
              </span>
            </h2>

            <p className="mt-5 max-w-sm text-sm leading-7 text-gray-600">
              {collection.description}
            </p>

            <Link href={collection.href} className="link-underline mt-8 w-fit text-sm font-medium text-brand hover:text-wine-700">
              Explore all {collection.label.toLowerCase()}
            </Link>
          </div>
        </Reveal>

        {/* PRODUCTS */}
        <div className="grid grid-cols-3 gap-2 sm:gap-4">
          {loading ? (
            Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="skeleton min-h-[260px]" aria-hidden="true" />
            ))
          ) : error ? (
            <p className="col-span-3 flex items-center justify-center py-10 text-sm text-wine-700">
              {error}
            </p>
          ) : products.length === 0 ? (
            <p className="col-span-3 flex items-center justify-center py-10 text-sm text-gray-500">
              No {collection.label.toLowerCase()} products available yet.
            </p>
          ) : (
            products.map((item, index) => (
              <Reveal key={item._id} delay={index * 90} className="min-w-0">
                <Link
                  href={`/products/${item._id}`}
                  className="group relative block aspect-[3/4] overflow-hidden bg-cream sm:aspect-auto sm:h-full sm:min-h-[340px]"
                >
                  <SafeImage
                    src={item.image}
                    fallbackSrc={collection.fallbackImage}
                    alt={item.name}
                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-[900ms] ease-[var(--ease-luxe)] group-hover:scale-[1.06]"
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-wine-950/75 via-transparent to-transparent" />

                  <div className="absolute inset-x-0 bottom-0 p-3 text-white sm:p-4">
                    <h3 className="line-clamp-2 font-serif text-sm sm:text-lg">
                      {item.name}
                    </h3>
                    <span className="mt-1 inline-block border-b border-white/70 pb-0.5 text-[11px] transition-all duration-300 group-hover:border-white sm:text-xs">
                      View product
                    </span>
                  </div>
                </Link>
              </Reveal>
            ))
          )}
        </div>
      </div>
    </section>
  );
}
