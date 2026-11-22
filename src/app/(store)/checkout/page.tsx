
"use client";

import { Suspense, useEffect, useState, type FormEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import api from "@/lib/api";

interface Product {
  _id: string;
  name: string;
  image: string;
  description: string;
  stock: number;
  prices?: {
    PK?: number;
    FR?: number;
    US?: number;
    IT?: number;
    ES?: number;
    OM?: number;
    SA?: number;
  };
  price: number;
}

const countryCurrencies: Record<string, string> = {
  PK: "PKR",
  FR: "EUR",
  US: "USD",
  IT: "EUR",
  ES: "EUR",
  OM: "OMR",
  SA: "SAR",
};

function CheckoutContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const productId = searchParams.get("productId");

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [placingOrder, setPlacingOrder] = useState(false);
  const [error, setError] = useState("");

  const [countryCode, setCountryCode] = useState("PK");
  const [quantity, setQuantity] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState("cash_on_delivery");

  const [address, setAddress] = useState({
    fullName: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    postalCode: "",
    country: "Pakistan",
  });

  useEffect(() => {
    const savedCountry = localStorage.getItem("h-store-country");

    if (savedCountry && countryCurrencies[savedCountry]) {
      setCountryCode(savedCountry);

      const names: Record<string, string> = {
        PK: "Pakistan",
        FR: "France",
        US: "United States",
        IT: "Italy",
        ES: "Spain",
        OM: "Oman",
        SA: "Saudi Arabia",
      };

      setAddress((previous) => ({
        ...previous,
        country: names[savedCountry] || "Pakistan",
      }));
    }
  }, []);

  useEffect(() => {
    async function loadProduct() {
      if (!productId) {
        setError("Product ID is missing");
        setLoading(false);
        return;
      }

      try {
        const response = await api.get("/products");

        const products = response.data.data || [];

        const foundProduct = products.find(
          (item: Product) => item._id === productId
        );

        if (!foundProduct || foundProduct.stock < 1) {
          setError("Product is not available");
          return;
        }

        setProduct(foundProduct);
      } catch (error) {
        console.error(error);
        setError("Unable to load product");
      } finally {
        setLoading(false);
      }
    }

    loadProduct();
  }, [productId]);

  const price = product?.prices?.[
    countryCode as keyof NonNullable<Product["prices"]>
  ];

  const total = typeof price === "number" ? price * quantity : 0;

  function handleChange(
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    const { name, value } = event.target;

    setAddress((previous) => ({
      ...previous,
      [name]: value,
    }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    if (!product) return;

    if (typeof price !== "number" || price <= 0) {
      setError("This product is not available in your selected country.");
      return;
    }

    try {
      setPlacingOrder(true);

      const response = await api.post("/orders", {
        productId: product._id,
        quantity,
        shippingAddress: address,
        paymentMethod,
        countryCode,
      });

      if (response.data.success) {
        router.push("/orders");
      }
    } catch (error: any) {
      setError(
        error.response?.data?.message || "Unable to place your order"
      );
    } finally {
      setPlacingOrder(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading checkout...
      </div>
    );
  }

  if (error && !product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <p className="text-red-600">{error}</p>
        <Link href="/men" className="underline">
          Back to shopping
        </Link>
      </div>
    );
  }

  if (!product) return null;

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-12 text-gray-900">
      <div className="mx-auto max-w-6xl">
        <Link href={`/products/${product._id}`} className="text-sm text-gray-500">
          ← Back to product
        </Link>

        <h1 className="mt-5 text-3xl font-bold">Checkout</h1>
        <p className="mt-2 text-gray-500">
          Complete your shipping information to place your order.
        </p>

        <div className="mt-10 grid grid-cols-1 gap-8 lg:grid-cols-3">
          <form onSubmit={handleSubmit} className="space-y-8 lg:col-span-2">
            <section className="rounded-2xl border bg-white p-6">
              <h2 className="mb-5 text-xl font-semibold">
                Shipping Information
              </h2>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <input
                  required
                  name="fullName"
                  value={address.fullName}
                  onChange={handleChange}
                  placeholder="Full Name"
                  className="rounded-lg border p-3 outline-none focus:border-wine-700"
                />

                <input
                  required
                  name="phone"
                  value={address.phone}
                  onChange={handleChange}
                  placeholder="Phone Number"
                  className="rounded-lg border p-3 outline-none focus:border-wine-700"
                />

                <input
                  required
                  name="city"
                  value={address.city}
                  onChange={handleChange}
                  placeholder="City"
                  className="rounded-lg border p-3 outline-none focus:border-wine-700"
                />

                <input
                  name="state"
                  value={address.state}
                  onChange={handleChange}
                  placeholder="State / Province"
                  className="rounded-lg border p-3 outline-none focus:border-wine-700"
                />

                <input
                  name="postalCode"
                  value={address.postalCode}
                  onChange={handleChange}
                  placeholder="Postal Code"
                  className="rounded-lg border p-3 outline-none focus:border-wine-700"
                />

                <input
                  required
                  name="country"
                  value={address.country}
                  onChange={handleChange}
                  placeholder="Country"
                  className="rounded-lg border p-3 outline-none focus:border-wine-700"
                />

                <textarea
                  required
                  name="address"
                  value={address.address}
                  onChange={handleChange}
                  placeholder="Complete Address"
                  rows={3}
                  className="rounded-lg border p-3 outline-none focus:border-wine-700 sm:col-span-2"
                />
              </div>
            </section>

            <section className="rounded-2xl border bg-white p-6">
              <h2 className="mb-5 text-xl font-semibold">
                Payment Method
              </h2>

              <div className="space-y-3">
                <label className="flex cursor-pointer items-center gap-3 rounded-lg border p-4">
                  <input
                    type="radio"
                    name="payment"
                    value="cash_on_delivery"
                    checked={paymentMethod === "cash_on_delivery"}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  />
                  <span>Cash on Delivery</span>
                </label>

                <label className="flex cursor-pointer items-center gap-3 rounded-lg border p-4">
                  <input
                    type="radio"
                    name="payment"
                    value="card"
                    checked={paymentMethod === "card"}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  />
                  <span>Card Payment</span>
                </label>

                <label className="flex cursor-pointer items-center gap-3 rounded-lg border p-4">
                  <input
                    type="radio"
                    name="payment"
                    value="bank_transfer"
                    checked={paymentMethod === "bank_transfer"}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  />
                  <span>Bank Transfer</span>
                </label>
              </div>
            </section>

            {error && (
              <p className="rounded-lg bg-red-50 p-3 text-sm text-red-600">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={
                placingOrder ||
                typeof price !== "number" ||
                quantity < 1 ||
                quantity > product.stock
              }
              className="w-full rounded-xl bg-brand px-6 py-4 font-semibold text-white transition hover:bg-wine-800 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {placingOrder ? "Placing Order..." : "Place Order"}
            </button>
          </form>

          <aside className="h-fit rounded-2xl border bg-white p-6">
            <h2 className="mb-5 text-xl font-semibold">Order Summary</h2>

            <div className="flex gap-4">
              <img
                src={product.image}
                alt={product.name}
                className="h-24 w-24 rounded-xl object-cover"
              />

              <div className="min-w-0">
                <h3 className="font-semibold">{product.name}</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Stock: {product.stock}
                </p>
                <p className="mt-2 font-medium">
                  {typeof price === "number"
                    ? `${countryCurrencies[countryCode]} ${price.toLocaleString()}`
                    : "Not available in this country"}
                </p>
              </div>
            </div>

            <div className="mt-6">
              <label className="mb-2 block text-sm font-medium">
                Quantity
              </label>

              <div className="flex items-center gap-4">
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="h-10 w-10 rounded-lg border"
                >
                  -
                </button>

                <span className="font-semibold">{quantity}</span>

                <button
                  type="button"
                  onClick={() =>
                    setQuantity((q) => Math.min(product.stock, q + 1))
                  }
                  disabled={quantity >= product.stock}
                  className="h-10 w-10 rounded-lg border disabled:opacity-40"
                >
                  +
                </button>
              </div>
            </div>

            <div className="mt-6 space-y-3 border-t pt-5 text-sm">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>
                  {countryCurrencies[countryCode]}{" "}
                  {total.toLocaleString()}
                </span>
              </div>

              <div className="flex justify-between">
                <span>Shipping</span>
                <span>Free</span>
              </div>

              <div className="flex justify-between border-t pt-4 text-lg font-bold">
                <span>Total</span>
                <span>
                  {countryCurrencies[countryCode]}{" "}
                  {total.toLocaleString()}
                </span>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center">
          Loading checkout...
        </div>
      }
    >
      <CheckoutContent />
    </Suspense>
  );
}
