"use client";

import Link from "next/link";
import { useState } from "react";
import {
  FiTrash2,
  FiMinus,
  FiPlus,
  FiArrowLeft,
  FiShoppingBag,
} from "react-icons/fi";
import SafeImage from "@/components/ui/SafeImage";

interface CartItem {
  id: number;
  name: string;
  category: string;
  price: number;
  quantity: number;
  image: string;
}

export default function CartPage() {
  // The cart is not connected to the database yet. It used to be pre-filled with
  // two demo products (with images that do not exist), so it now starts empty
  // instead of showing items that cannot be bought.
  const [cart, setCart] = useState<CartItem[]>([]);

  const updateQuantity = (id: number, change: number) => {
    setCart((previous) =>
      previous
        .map((item) =>
          item.id === id
            ? { ...item, quantity: item.quantity + change }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const removeItem = (id: number) => {
    setCart((previous) => previous.filter((item) => item.id !== id));
  };

  const subtotal = cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  const shipping = cart.length > 0 ? 200 : 0;
  const total = subtotal + shipping;

  return (
    <div className="bg-ivory px-4 py-14 sm:px-8 lg:py-20">
      <div className="mx-auto max-w-7xl">
        {/* Heading */}
        <div className="mb-12 text-center">
          <h1 className="text-4xl sm:text-5xl">Shopping cart</h1>

          <p className="mt-3 text-sm text-gray-500">
            {cart.length} different {cart.length === 1 ? "item" : "items"} in
            your cart
          </p>
        </div>

        {cart.length === 0 ? (
          <div className="mx-auto max-w-md border border-sand bg-cream px-8 py-16 text-center">
            <FiShoppingBag size={44} className="mx-auto mb-6 text-wine-300" aria-hidden="true" />

            <h2 className="text-2xl">Your cart is empty</h2>

            <p className="mt-3 text-sm leading-6 text-gray-500">
              You haven&apos;t added anything yet. Open a product and choose
              Order now to buy it.
            </p>

            <Link href="/products" className="btn-primary mt-8">
              Continue shopping
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-[1fr_380px]">
            {/* Products */}
            <div>
              <div className="hidden grid-cols-[1fr_120px_120px] border-b border-sand pb-5 text-xs text-gray-500 sm:grid">
                <span>Product</span>
                <span className="text-center">Quantity</span>
                <span className="text-right">Total</span>
              </div>

              <div className="divide-y divide-sand">
                {cart.map((item) => (
                  <div
                    key={item.id}
                    className="grid grid-cols-1 gap-5 py-7 sm:grid-cols-[1fr_120px_120px] sm:items-center"
                  >
                    {/* Product Info */}
                    <div className="flex gap-5">
                      <div className="relative h-32 w-24 shrink-0 overflow-hidden bg-cream">
                        <SafeImage
                          src={item.image}
                          alt={item.name}
                          className="h-full w-full object-cover"
                        />
                      </div>

                      <div className="flex flex-col justify-center">
                        <h3 className="font-serif text-lg">{item.name}</h3>

                        <p className="mt-1 text-xs text-gray-500">
                          {item.category}
                        </p>

                        <p className="mt-3 text-sm">
                          Rs. {item.price.toLocaleString()}
                        </p>

                        <button
                          type="button"
                          onClick={() => removeItem(item.id)}
                          className="mt-3 flex w-fit items-center gap-2 text-xs text-gray-500 transition hover:text-wine-700"
                        >
                          <FiTrash2 size={14} aria-hidden="true" />
                          Remove
                        </button>
                      </div>
                    </div>

                    {/* Quantity */}
                    <div className="flex items-center sm:justify-center">
                      <div className="flex items-center border border-sand bg-white">
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.id, -1)}
                          className="p-2.5 transition hover:bg-cream"
                          aria-label="Decrease quantity"
                        >
                          <FiMinus size={14} />
                        </button>

                        <span className="min-w-8 text-center text-sm">
                          {item.quantity}
                        </span>

                        <button
                          type="button"
                          onClick={() => updateQuantity(item.id, 1)}
                          className="p-2.5 transition hover:bg-cream"
                          aria-label="Increase quantity"
                        >
                          <FiPlus size={14} />
                        </button>
                      </div>
                    </div>

                    {/* Total */}
                    <div className="text-sm sm:text-right">
                      Rs. {(item.price * item.quantity).toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>

              <Link
                href="/products"
                className="link-underline mt-7 inline-flex items-center gap-2 text-xs text-gray-600 hover:text-wine-700"
              >
                <FiArrowLeft size={15} aria-hidden="true" />
                Continue shopping
              </Link>
            </div>

            {/* Order Summary */}
            <aside className="h-fit border border-sand bg-cream p-6 sm:p-8">
              <h2 className="mb-7 text-2xl">Order summary</h2>

              <div className="space-y-5 border-b border-sand pb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Subtotal</span>
                  <span>Rs. {subtotal.toLocaleString()}</span>
                </div>

                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Shipping</span>
                  <span>Rs. {shipping.toLocaleString()}</span>
                </div>
              </div>

              <div className="flex justify-between py-6">
                <span className="text-sm font-medium">Total</span>
                <span className="font-serif text-2xl text-wine-700">
                  Rs. {total.toLocaleString()}
                </span>
              </div>

              <button
                type="button"
                onClick={() => alert("Checkout will be connected soon!")}
                className="btn-primary w-full py-4"
              >
                Proceed to checkout
              </button>

              <p className="mt-5 text-center text-xs text-gray-500">
                Shipping charges are estimated.
              </p>
            </aside>
          </div>
        )}
      </div>
    </div>
  );
}
