"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import api from "@/lib/api";
import Reveal from "@/components/ui/Reveal";
import SafeImage from "@/components/ui/SafeImage";
import { collections } from "@/lib/collections";

// Category Type
interface Category {
  _id: string;
  name: string;
  status: string;
}

// Product Type
interface Product {
  _id: string;
  name: string;
  image: string;
  status: string;
  category: {
    _id: string;
    name: string;
  };
}

export default function ShopByCategory() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch Categories and Products from Backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [categoryResponse, productResponse] = await Promise.all([
          api.get("/categories"),
          api.get("/products"),
        ]);

        // Save active categories
        setCategories(
          categoryResponse.data.data.filter(
            (category: Category) => category.status === "Active"
          )
        );

        // Save active products with images
        setProducts(
          productResponse.data.data.filter(
            (product: Product) =>
              product.status === "Active" && product.image
          )
        );
      } catch (error) {
        console.error("Shop By Category Error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <section className="mx-auto max-w-7xl px-5 py-12 lg:px-8 lg:py-16">
      {/* Heading and collection links */}
      <div className="mb-8 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
        <h2 className="text-3xl sm:text-4xl">Shop by category</h2>

        <nav aria-label="Collections" className="flex items-center gap-6 overflow-x-auto pb-1">
          {collections.map((tab) => (
            <Link
              key={tab.slug}
              href={tab.href}
              className="link-underline shrink-0 text-sm text-gray-600 hover:text-wine-700"
            >
              {tab.label}
            </Link>
          ))}
        </nav>
      </div>

      {/* Loading State */}
      {loading ? (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5" aria-hidden="true">
          {Array.from({ length: 5 }).map((_, index) => (
            <div key={index} className="skeleton h-[300px] sm:h-[380px] lg:h-[460px]" />
          ))}
        </div>
      ) : (
        /* Category Cards */
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {categories.slice(0, 5).map((category, index) => {
            // Find first product of current category
            const categoryProduct = products.find(
              (product) => product.category?._id === category._id
            );

            return (
              <Reveal key={category._id} delay={index * 80}>
                <Link
                  href={`/products?category=${category._id}`}
                  className="group relative block h-[300px] overflow-hidden bg-cream sm:h-[380px] lg:h-[460px]"
                >
                  {categoryProduct?.image ? (
                    <SafeImage
                      src={categoryProduct.image}
                      alt={category.name}
                      loading={index < 2 ? "eager" : "lazy"}
                      className="h-full w-full object-cover object-top transition-transform duration-[900ms] ease-[var(--ease-luxe)] group-hover:scale-[1.06]"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-cream to-sand">
                      <span className="text-sm text-gray-500">No product image</span>
                    </div>
                  )}

                  <div className="absolute inset-0 bg-gradient-to-t from-wine-950/80 via-transparent to-transparent" />

                  <div className="absolute inset-x-3 bottom-6 z-10 text-center text-white">
                    <h3 className="text-xl md:text-2xl">{category.name}</h3>
                    <p className="mt-1 text-xs text-white/80 transition-all duration-500 group-hover:tracking-wide">
                      Explore collection
                    </p>
                  </div>
                </Link>
              </Reveal>
            );
          })}
        </div>
      )}

      {/* Empty State */}
      {!loading && categories.length === 0 && (
        <p className="py-10 text-center text-gray-500">No categories available.</p>
      )}
    </section>
  );
}
