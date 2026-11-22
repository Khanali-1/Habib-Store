"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import axios from "axios";
import api from "@/lib/api";
import SafeImage from "@/components/ui/SafeImage";

interface OrderItem {
  name: string;
  image?: string;
  price: number;
  quantity: number;
}

interface Order {
  _id: string;
  orderNumber: string;
  items: OrderItem[];
  totalAmount: number;
  orderStatus: string;
  paymentStatus: string;
  createdAt: string;
}

const statusStyle: Record<string, string> = {
  pending: "bg-amber-50 text-amber-800 border-amber-200",
  processing: "bg-sky-50 text-sky-800 border-sky-200",
  shipped: "bg-indigo-50 text-indigo-800 border-indigo-200",
  delivered: "bg-emerald-50 text-emerald-800 border-emerald-200",
  cancelled: "bg-wine-50 text-wine-800 border-wine-200",
};

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [needsLogin, setNeedsLogin] = useState(false);

  useEffect(() => {
    async function getOrders() {
      try {
        const response = await api.get("/orders");

        if (response.data.success) {
          setOrders(response.data.data);
        }
      } catch (err) {
        if (axios.isAxiosError(err) && err.response?.status === 401) {
          setNeedsLogin(true);
        }

        setError(
          axios.isAxiosError(err) && err.response?.data?.message
            ? (err.response.data.message as string)
            : "Unable to load orders"
        );
      } finally {
        setLoading(false);
      }
    }

    getOrders();
  }, []);

  if (loading) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-14" aria-busy="true">
        <div className="skeleton mb-8 h-10 w-48" />
        <div className="skeleton h-64" />
      </div>
    );
  }

  return (
    <div className="bg-ivory px-4 py-14 text-brand">
      <div className="mx-auto max-w-5xl">
        <h1 className="text-4xl sm:text-5xl">My orders</h1>
        <p className="mt-3 text-gray-500">
          Check your purchases and delivery status.
        </p>

        {error && (
          <div role="alert" className="mt-8 border border-wine-200 bg-wine-50 p-5 text-wine-800">
            <p>{error}</p>
            {needsLogin && (
              <Link href="/login" className="btn-primary mt-4">
                Sign in
              </Link>
            )}
          </div>
        )}

        {!error && orders.length === 0 && (
          <div className="mt-10 border border-sand bg-cream p-12 text-center">
            <h2 className="text-2xl">No orders yet</h2>

            <p className="mt-2 text-gray-500">
              You haven&apos;t placed any orders yet.
            </p>

            <Link href="/products" className="btn-primary mt-7">
              Start shopping
            </Link>
          </div>
        )}

        <div className="mt-8 space-y-6">
          {orders.map((order) => (
            <div key={order._id} className="border border-sand bg-white p-5 sm:p-7">
              <div className="flex flex-wrap justify-between gap-3 border-b border-sand pb-4">
                <div>
                  <p className="text-sm text-gray-500">Order number</p>
                  <h2 className="font-serif text-xl">{order.orderNumber}</h2>
                  <p className="mt-1 text-xs text-gray-400">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </p>
                </div>

                <span
                  className={`h-fit border px-4 py-1.5 text-xs font-medium capitalize ${
                    statusStyle[order.orderStatus] ??
                    "bg-cream text-gray-700 border-sand"
                  }`}
                >
                  {order.orderStatus}
                </span>
              </div>

              {order.items.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center gap-4 border-b border-sand py-5"
                >
                  <div className="h-20 w-20 shrink-0 overflow-hidden bg-cream">
                    <SafeImage
                      src={item.image}
                      alt={item.name}
                      className="h-full w-full object-cover"
                    />
                  </div>

                  <div className="flex-1">
                    <h3 className="font-serif text-lg">{item.name}</h3>
                    <p className="mt-1 text-sm text-gray-500">
                      Quantity: {item.quantity}
                    </p>
                    <p className="text-sm text-gray-500">
                      Price: {item.price.toLocaleString()}
                    </p>
                  </div>

                  <p className="font-semibold">
                    {(item.price * item.quantity).toLocaleString()}
                  </p>
                </div>
              ))}

              <div className="flex flex-wrap items-center justify-between gap-3 pt-5">
                <div>
                  <p className="text-sm text-gray-500 capitalize">
                    Payment: {order.paymentStatus}
                  </p>
                  <p className="mt-1 font-serif text-2xl text-wine-700">
                    Total: {order.totalAmount.toLocaleString()}
                  </p>
                </div>

                <span className="text-sm text-gray-500">
                  Your order is {order.orderStatus}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
