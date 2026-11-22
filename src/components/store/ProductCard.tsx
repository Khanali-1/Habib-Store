"use client";

import Link from "next/link";
import SafeImage from "@/components/ui/SafeImage";
import { useCountry } from "@/context/CountryContext";
import { getDisplayPrice } from "@/lib/pricing";
import type { CountryCode } from "@/context/CountryContext";

export interface CardProduct {
  _id: string;
  name: string;
  description?: string;
  image?: string;
  price: number;
  oldPrice?: number;
  badge?: string;
  prices?: Partial<Record<CountryCode, number>>;
  stock?: number;
  category?: { _id: string; name: string } | string;
}

interface ProductCardProps {
  product: CardProduct;
  /** Editorial image used only when the product has no image of its own */
  fallbackImage?: string;
  showCategory?: boolean;
}

export default function ProductCard({
  product,
  fallbackImage,
  showCategory = false,
}: ProductCardProps) {
  const { selectedCountry } = useCountry();
  const display = getDisplayPrice(product, selectedCountry);

  const categoryName =
    typeof product.category === "object" && product.category !== null
      ? product.category.name
      : "";

  const hasStock = typeof product.stock === "number";
  const inStock = hasStock ? (product.stock as number) > 0 : true;

  return (
    <Link
      href={`/products/${product._id}`}
      className="group block"
      aria-label={`${product.name}, view details`}
    >
      <div className="relative aspect-[3/4] overflow-hidden bg-cream">
        <SafeImage
          src={product.image}
          fallbackSrc={fallbackImage}
          alt={product.name}
          className="h-full w-full object-cover transition-transform duration-[900ms] ease-[var(--ease-luxe)] group-hover:scale-[1.06]"
        />

        {(product.badge || hasStock) && (
          <span
            className={`absolute left-3 top-3 px-3 py-1.5 text-[11px] font-medium tracking-wide ${
              inStock
                ? "bg-ivory/95 text-brand"
                : "bg-brand/90 text-white"
            }`}
          >
            {product.badge || (inStock ? "In stock" : "Sold out")}
          </span>
        )}

        <div className="absolute inset-x-0 bottom-0 translate-y-full bg-wine-800/95 py-3.5 text-center text-xs font-medium tracking-wide text-white transition-transform duration-500 ease-[var(--ease-luxe)] group-hover:translate-y-0 group-focus-visible:translate-y-0">
          View details
        </div>
      </div>

      <div className="pt-4">
        {showCategory && categoryName && (
          <p className="mb-1 text-xs text-stone">{categoryName}</p>
        )}

        <h3 className="line-clamp-1 font-serif text-[17px] text-brand transition-colors duration-300 group-hover:text-wine-700">
          {product.name}
        </h3>

        {product.description && (
          <p className="mt-1.5 line-clamp-2 text-xs leading-5 text-gray-500">
            {product.description}
          </p>
        )}

        <div className="mt-2.5 flex flex-wrap items-baseline gap-x-2.5">
          {display.available ? (
            <>
              <span className="text-sm font-semibold text-wine-700">
                {display.text}
              </span>

              {selectedCountry === "PK" &&
                product.oldPrice &&
                Number(product.oldPrice) > display.amount && (
                  <span className="text-xs text-gray-400 line-through">
                    Rs. {Number(product.oldPrice).toLocaleString("en-US")}
                  </span>
                )}
            </>
          ) : (
            <span className="text-xs text-gray-500">
              Not available in {display.countryName}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
