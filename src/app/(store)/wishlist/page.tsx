"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import axios from "axios";
import api from "@/lib/api";
import Reveal from "@/components/ui/Reveal";
import SafeImage from "@/components/ui/SafeImage";

interface Product {
  _id: string;
  name: string;
  image: string;
  description: string;
  price: number;
  stock: number;
  status: string;
  category?: {
    _id: string;
    name: string;
  };
}

const messageOf = (err: unknown, fallback: string) =>
  axios.isAxiosError(err) && err.response?.data?.message
    ? (err.response.data.message as string)
    : fallback;

export default function WishlistPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [needsLogin, setNeedsLogin] = useState(false);
  const [actionError, setActionError] = useState("");

  const getWishlist = async () => {
    try {
      setLoading(true);
      setError("");
      setNeedsLogin(false);

      const response = await api.get("/wishlist");

      if (response.data.success) {
        setProducts(response.data.data);
      }
    } catch (err) {
      if (axios.isAxiosError(err) && err.response?.status === 401) {
        setNeedsLogin(true);
      }

      setError(messageOf(err, "Unable to load wishlist"));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getWishlist();
  }, []);

  const removeProduct = async (productId: string) => {
    try {
      setActionError("");

      const response = await api.delete("/wishlist", {
        data: { productId },
      });

      if (response.data.success) {
        setProducts((previous) =>
          previous.filter((product) => product._id !== productId)
        );
      }
    } catch (err) {
      setActionError(messageOf(err, "Unable to remove product"));
    }
  };

  if (loading) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-14" aria-busy="true">
        <div className="skeleton mb-10 h-10 w-56" />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="skeleton h-96" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-ivory px-4 py-14 text-brand">
      <div className="mx-auto max-w-6xl">
        <div className="mb-10">
          <h1 className="text-4xl sm:text-5xl">My wishlist</h1>
          <p className="mt-3 text-gray-500">
            Your favourite products in one place.
          </p>
        </div>

        {actionError && (
          <p role="alert" className="mb-6 border border-wine-200 bg-wine-50 p-4 text-sm text-wine-800">
            {actionError}
          </p>
        )}

        {error ? (
          <div className="border border-sand bg-cream p-10 text-center">
            <p className="text-wine-700">{error}</p>

            {needsLogin ? (
              <Link href="/login" className="btn-primary mt-6">
                Sign in
              </Link>
            ) : (
              <button type="button" onClick={getWishlist} className="btn-primary mt-6">
                Try again
              </button>
            )}
          </div>
        ) : products.length === 0 ? (
          <div className="border border-sand bg-cream px-6 py-16 text-center">
            <div className="mb-4 text-5xl text-wine-300" aria-hidden="true">♡</div>

            <h2 className="text-2xl">Your wishlist is empty</h2>

            <p className="mt-2 text-gray-500">
              Add your favourite products to your wishlist.
            </p>

            <Link href="/products" className="btn-primary mt-7">
              Explore products
            </Link>
          </div>
        ) : (
          <>
            <p className="mb-6 text-sm text-gray-500">
              {products.length} saved {products.length === 1 ? "product" : "products"}
            </p>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {products.map((product, index) => (
                <Reveal key={product._id} delay={(index % 3) * 80}>
                  <div className="group overflow-hidden border border-sand bg-white transition-shadow duration-500 hover:shadow-[0_24px_40px_-24px_rgba(63,15,26,0.35)]">
                    <Link href={`/products/${product._id}`}>
                      <div className="relative h-80 overflow-hidden bg-cream">
                        {product.image ? (
                          <SafeImage
                            src={product.image}
                            alt={product.name}
                            className="h-full w-full object-cover transition-transform duration-[900ms] ease-[var(--ease-luxe)] group-hover:scale-[1.05]"
                          />
                        ) : (
                          <div className="flex h-full items-center justify-center text-gray-400">
                            No image
                          </div>
                        )}
                      </div>
                    </Link>

                    <div className="p-5">
                      <h2 className="font-serif text-xl">{product.name}</h2>

                      <p className="mt-1 text-sm text-gray-500">
                        {product.category?.name || "Product"}
                      </p>

                      <p className="mt-3 font-semibold text-wine-700">
                        PKR {product.price.toLocaleString()}
                      </p>

                      <p className="mt-1 text-sm text-gray-500">
                        {product.stock > 0 ? "In stock" : "Out of stock"}
                      </p>

                      <div className="mt-5 flex gap-3">
                        <Link
                          href={`/products/${product._id}`}
                          className="btn-dark flex-1 px-4 py-3"
                        >
                          View product
                        </Link>

                        <button
                          type="button"
                          onClick={() => removeProduct(product._id)}
                          className="border border-sand px-4 py-3 text-sm text-wine-700 transition hover:border-wine-700 hover:bg-wine-50"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
