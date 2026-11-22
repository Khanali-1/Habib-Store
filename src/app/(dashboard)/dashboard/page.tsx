"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  FiArrowRight,
  FiLayers,
  FiPackage,
  FiPlus,
  FiShoppingBag,
  FiUsers,
  FiAlertCircle,
} from "react-icons/fi";
import api from "@/lib/api";

interface RecentOrder {
  _id: string;
  orderNumber: string;
  customerName: string;
  totalAmount: number;
  orderStatus: string;
  createdAt: string;
}

interface Overview {
  totalOrders: number | null;
  recentOrders: RecentOrder[] | null;
  totalCustomers: number | null;
  totalProducts: number | null;
  outOfStock: number | null;
}

const quickActions = [
  {
    icon: FiPlus,
    title: "Add New Product",
    description: "Add products to your store",
    href: "/dashboard/products",
  },
  {
    icon: FiLayers,
    title: "Create Category",
    description: "Organize your products",
    href: "/dashboard/categories",
  },
  {
    icon: FiShoppingBag,
    title: "Manage Orders",
    description: "View and manage orders",
    href: "/dashboard/orders",
  },
  {
    icon: FiUsers,
    title: "View Customers",
    description: "Manage your customers",
    href: "/dashboard/users",
  },
];

const statusStyle: Record<string, string> = {
  pending: "bg-amber-50 text-amber-800",
  processing: "bg-sky-50 text-sky-800",
  shipped: "bg-indigo-50 text-indigo-800",
  delivered: "bg-emerald-50 text-emerald-800",
  cancelled: "bg-wine-50 text-wine-800",
};

const show = (value: number | null) =>
  value === null ? "-" : value.toLocaleString("en-US");

export default function DashboardPage() {
  const [data, setData] = useState<Overview | null>(null);

  // Real numbers from the existing admin APIs (no API changes).
  // Each request is independent, so one failing does not blank the page.
  useEffect(() => {
    const load = async () => {
      const [orders, customers, products] = await Promise.allSettled([
        api.get("/admin/orders", { params: { limit: 5 } }),
        api.get("/admin/customers"),
        api.get("/products"),
      ]);

      setData({
        totalOrders:
          orders.status === "fulfilled" && orders.value.data.success
            ? orders.value.data.pagination.totalOrders
            : null,
        recentOrders:
          orders.status === "fulfilled" && orders.value.data.success
            ? orders.value.data.data
            : null,
        totalCustomers:
          customers.status === "fulfilled" && customers.value.data.success
            ? customers.value.data.stats.total
            : null,
        totalProducts:
          products.status === "fulfilled" && products.value.data.success
            ? products.value.data.data.length
            : null,
        outOfStock:
          products.status === "fulfilled" && products.value.data.success
            ? (products.value.data.data as { stock: number }[]).filter(
                (product) => product.stock <= 0
              ).length
            : null,
      });
    };

    load();
  }, []);

  const loading = data === null;

  const stats = [
    { label: "Total orders", value: data?.totalOrders ?? null, icon: FiShoppingBag, href: "/dashboard/orders" },
    { label: "Customers", value: data?.totalCustomers ?? null, icon: FiUsers, href: "/dashboard/users" },
    { label: "Products", value: data?.totalProducts ?? null, icon: FiPackage, href: "/dashboard/products" },
    { label: "Out of stock", value: data?.outOfStock ?? null, icon: FiAlertCircle, href: "/dashboard/products" },
  ];

  return (
    <div className="mx-auto w-full min-w-0 max-w-7xl space-y-8">
      {/* PAGE HEADING */}
      <section>
        <h1 className="text-3xl sm:text-4xl">Dashboard overview</h1>
        <p className="mt-2 text-sm text-gray-500">
          Live figures from your store.
        </p>
      </section>

      {/* STATS (real data) */}
      <section aria-label="Store statistics" className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;

          return (
            <Link
              key={stat.label}
              href={stat.href}
              className="group border border-sand bg-white p-6 transition-all duration-300 hover:-translate-y-0.5 hover:border-wine-300 hover:shadow-[0_20px_32px_-22px_rgba(63,15,26,0.4)]"
            >
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-500">{stat.label}</p>
                <span className="grid h-10 w-10 place-items-center bg-wine-50 text-wine-700 transition-colors group-hover:bg-wine-700 group-hover:text-white">
                  <Icon size={18} aria-hidden="true" />
                </span>
              </div>

              {loading ? (
                <div className="skeleton mt-5 h-9 w-20" />
              ) : (
                <p className="mt-4 font-serif text-4xl">{show(stat.value)}</p>
              )}
            </Link>
          );
        })}
      </section>

      {/* RECENT ORDERS (real data) */}
      <section className="border border-sand bg-white">
        <div className="flex items-center justify-between border-b border-sand px-5 py-5 sm:px-6">
          <h2 className="text-xl sm:text-2xl">Recent orders</h2>

          <Link
            href="/dashboard/orders"
            className="inline-flex items-center gap-2 text-sm font-medium text-wine-700 transition hover:text-wine-900"
          >
            View all
            <FiArrowRight size={15} aria-hidden="true" />
          </Link>
        </div>

        {loading ? (
          <div className="space-y-3 p-6" aria-busy="true">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="skeleton h-10" />
            ))}
          </div>
        ) : data?.recentOrders === null ? (
          <p className="p-8 text-center text-sm text-wine-700">
            Recent orders couldn&apos;t be loaded.
          </p>
        ) : data?.recentOrders.length === 0 ? (
          <p className="p-8 text-center text-sm text-gray-500">
            No orders have been placed yet.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[560px] text-left text-sm">
              <thead className="bg-cream text-xs text-gray-500">
                <tr>
                  <th className="px-6 py-3 font-medium">Order</th>
                  <th className="px-6 py-3 font-medium">Customer</th>
                  <th className="px-6 py-3 font-medium">Date</th>
                  <th className="px-6 py-3 font-medium">Total</th>
                  <th className="px-6 py-3 font-medium">Status</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-sand">
                {data?.recentOrders?.map((order) => (
                  <tr key={order._id} className="transition-colors hover:bg-cream/60">
                    <td className="px-6 py-4 font-medium">{order.orderNumber}</td>
                    <td className="px-6 py-4 text-gray-600">{order.customerName}</td>
                    <td className="px-6 py-4 text-gray-500">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">{order.totalAmount.toLocaleString()}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 text-xs font-medium capitalize ${
                          statusStyle[order.orderStatus] ?? "bg-cream text-gray-700"
                        }`}
                      >
                        {order.orderStatus}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* QUICK ACTIONS */}
      <section>
        <h2 className="mb-4 text-xl sm:text-2xl">Quick actions</h2>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {quickActions.map((action) => {
            const Icon = action.icon;

            return (
              <Link
                key={action.title}
                href={action.href}
                className="group flex items-center gap-4 border border-sand bg-white p-5 transition-all duration-300 hover:border-wine-300 hover:bg-wine-50"
              >
                <span className="grid h-11 w-11 shrink-0 place-items-center bg-cream text-wine-700 transition-colors group-hover:bg-wine-700 group-hover:text-white">
                  <Icon size={19} aria-hidden="true" />
                </span>

                <span>
                  <span className="block text-sm font-semibold">{action.title}</span>
                  <span className="mt-0.5 block text-xs text-gray-500">
                    {action.description}
                  </span>
                </span>
              </Link>
            );
          })}
        </div>
      </section>
    </div>
  );
}
