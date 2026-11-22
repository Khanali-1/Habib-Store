"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import axios from "axios";
import api from "@/lib/api";
import SafeImage from "@/components/ui/SafeImage";
import { useCountry } from "@/context/CountryContext";
import { getDisplayPrice } from "@/lib/pricing";
import { collections, matchesCollection } from "@/lib/collections";

interface Product {
  _id: string;
  name: string;
  description: string;
  image: string;
  price: number;
  prices?: {
    PK?: number;
    FR?: number;
    US?: number;
    IT?: number;
    ES?: number;
    OM?: number;
    SA?: number;
  };
  stock: number;
  status: "Active" | "Inactive";
  category: {
    _id: string;
    name: string;
  };
}

interface ProductsResponse {
  success: boolean;
  data: Product[];
}

interface ProductDetailsPageProps {
  params: Promise<{ id: string }>;
}

export default function ProductDetailsPage({
  params,
}: ProductDetailsPageProps) {
  const router = useRouter();
  const { selectedCountry } = useCountry();

  const [id, setId] = useState("");
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [wishlistBusy, setWishlistBusy] = useState(false);
  const [wishlistNote, setWishlistNote] = useState("");

  // Get dynamic product ID from URL
  useEffect(() => {
    params.then((value) => {
      setId(value.id);
    });
  }, [params]);

  // Fetch product
  useEffect(() => {
    if (!id) return;

    const getProduct = async () => {
      try {
        setLoading(true);

        const response = await api.get<ProductsResponse>("/products");

        const selectedProduct = response.data.data.find(
          (item) => item._id === id
        );

        if (!selectedProduct || selectedProduct.status !== "Active") {
          setError("Product not found or unavailable.");
          return;
        }

        setProduct(selectedProduct);

        // Wishlist state comes from the same API the /wishlist page uses
        try {
          const wishlistResponse = await api.get("/wishlist");

          if (wishlistResponse.data.success) {
            setIsWishlisted(
              (wishlistResponse.data.data as { _id: string }[]).some(
                (item) => item._id === selectedProduct._id
              )
            );
          }
        } catch {
          // Not signed in: the heart simply starts empty
        }
      } catch (err) {
        console.error(err);
        setError("Unable to load product.");
      } finally {
        setLoading(false);
      }
    };

    getProduct();
  }, [id]);

  // Wishlist functionality (saved to the database, same as the Wishlist page)
  const handleWishlist = async () => {
    if (!product || wishlistBusy) return;

    setWishlistBusy(true);
    setWishlistNote("");

    try {
      if (isWishlisted) {
        await api.delete("/wishlist", { data: { productId: product._id } });
        setIsWishlisted(false);
      } else {
        await api.post("/wishlist", { productId: product._id });
        setIsWishlisted(true);
      }
    } catch (err) {
      if (axios.isAxiosError(err) && err.response?.status === 401) {
        router.push("/login");
        return;
      }

      setWishlistNote("Couldn't update your wishlist. Please try again.");
    } finally {
      setWishlistBusy(false);
    }
  };

  // Order functionality
  const handleOrder = () => {
    if (!product) return;

    router.push(`/checkout?productId=${product._id}`);
  };

  if (loading) {
    return (
      <div className="mx-auto grid max-w-6xl gap-10 px-5 py-14 md:grid-cols-2 lg:gap-16" aria-busy="true">
        <div className="skeleton aspect-[4/5]" />
        <div className="space-y-5 pt-6">
          <div className="skeleton h-4 w-1/4" />
          <div className="skeleton h-10 w-3/4" />
          <div className="skeleton h-4 w-full" />
          <div className="skeleton h-4 w-5/6" />
          <div className="skeleton h-8 w-1/3" />
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-5 px-5 text-center">
        <h2 className="text-3xl">{error || "Product not found"}</h2>

        <Link href="/products" className="btn-primary">
          Back to the shop
        </Link>
      </div>
    );
  }

  const display = getDisplayPrice(product, selectedCountry);
  const collection = collections.find((item) =>
    matchesCollection(product.category, item)
  );
  const canOrder = product.stock > 0 && display.available;

  return (
    <div className="bg-ivory px-5 py-10 text-brand md:px-12 lg:py-14">
      <nav aria-label="Breadcrumb" className="mx-auto mb-8 flex max-w-6xl flex-wrap items-center gap-2 text-xs text-gray-500">
        <button
          type="button"
          onClick={() => router.back()}
          className="transition hover:text-wine-700"
        >
          Back
        </button>
        <span aria-hidden="true">/</span>
        {collection && (
          <>
            <Link href={collection.href} className="transition hover:text-wine-700">
              {collection.label}
            </Link>
            <span aria-hidden="true">/</span>
          </>
        )}
        <span className="text-wine-700">{product.name}</span>
      </nav>

      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-10 md:grid-cols-2 lg:gap-16">
        {/* Product Image */}
        <div className="group relative aspect-[4/5] overflow-hidden bg-cream">
          <SafeImage
            src={product.image}
            fallbackSrc={collection?.fallbackImage}
            alt={product.name}
            loading="eager"
            className="h-full w-full object-cover transition-transform duration-[1200ms] ease-[var(--ease-luxe)] group-hover:scale-[1.05]"
          />
        </div>

        {/* Product Details */}
        <div className="flex flex-col justify-center">
          <p className="mb-3 text-sm text-wine-700">
            {product.category?.name || "Collection"}
          </p>

          <h1 className="mb-5 text-4xl leading-[1.1] md:text-5xl">
            {product.name}
          </h1>

          <p className="mb-7 max-w-lg leading-7 text-gray-600">
            {product.description}
          </p>

          <div className="mb-3">
            {display.available ? (
              <p className="font-serif text-3xl text-wine-700">{display.text}</p>
            ) : (
              <p className="text-sm text-gray-600">
                Not available in {display.countryName}. Choose another country in
                the header to see its price.
              </p>
            )}
          </div>

          <p
            className={`mb-8 text-sm font-medium ${
              product.stock > 0 ? "text-emerald-700" : "text-wine-700"
            }`}
          >
            {product.stock > 0
              ? `${product.stock} items available`
              : "Out of stock"}
          </p>

          <button
            type="button"
            onClick={handleWishlist}
            disabled={wishlistBusy}
            aria-pressed={isWishlisted}
            className="btn-outline mb-4 w-full"
          >
            {isWishlisted ? "♥ Added to wishlist" : "♡ Add to wishlist"}
          </button>

          <button
            type="button"
            onClick={handleOrder}
            disabled={!canOrder}
            className="btn-primary w-full py-4"
          >
            Order now
          </button>

          <p className="mt-4 min-h-5 text-xs text-wine-700" aria-live="polite">
            {wishlistNote}
          </p>
        </div>
      </div>
    </div>
  );
}
