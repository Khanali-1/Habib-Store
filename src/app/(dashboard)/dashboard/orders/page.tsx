
"use client";

import { useCallback, useEffect, useState } from "react";
import api from "@/lib/api";
import {
  FiPackage,
  FiClock,
  FiTruck,
  FiCheckCircle,
  FiXCircle,
  FiSearch,
  FiEye,
  FiX,
  FiRefreshCw,
  FiDollarSign,
} from "react-icons/fi";

type OrderStatus =
  | "pending"
  | "processing"
  | "shipped"
  | "delivered"
  | "cancelled";

type PaymentStatus =
  | "pending"
  | "paid"
  | "failed"
  | "refunded";

interface OrderItem {
  product: string;
  name: string;
  image?: string;
  price: number;
  quantity: number;
}

interface ShippingAddress {
  fullName: string;
  phone: string;
  address: string;
  city: string;
  state?: string;
  postalCode?: string;
  country: string;
}

interface Order {
  _id: string;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  items: OrderItem[];
  shippingAddress: ShippingAddress;
  subtotal: number;
  shippingFee: number;
  tax: number;
  totalAmount: number;
  paymentMethod: string;
  paymentStatus: PaymentStatus;
  orderStatus: OrderStatus;
  createdAt: string;
}

interface OrderStats {
  total: number;
  pending: number;
  processing: number;
  shipped: number;
  delivered: number;
  cancelled: number;
  revenue: number;
}

const initialStats: OrderStats = {
  total: 0,
  pending: 0,
  processing: 0,
  shipped: 0,
  delivered: 0,
  cancelled: 0,
  revenue: 0,
};

const statusOptions: OrderStatus[] = [
  "pending",
  "processing",
  "shipped",
  "delivered",
  "cancelled",
];

const paymentOptions: PaymentStatus[] = [
  "pending",
  "paid",
  "failed",
  "refunded",
];

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat("en-PK", {
    style: "currency",
    currency: "PKR",
    maximumFractionDigits: 0,
  }).format(amount || 0);

const formatDate = (date: string) =>
  new Date(date).toLocaleDateString("en-PK", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

const statusStyle: Record<string, string> = {
  pending: "bg-amber-100 text-amber-700",
  processing: "bg-blue-100 text-blue-700",
  shipped: "bg-wine-100 text-wine-800",
  delivered: "bg-green-100 text-green-700",
  cancelled: "bg-red-100 text-red-700",
  paid: "bg-green-100 text-green-700",
  failed: "bg-red-100 text-red-700",
  refunded: "bg-purple-100 text-purple-700",
};

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [stats, setStats] = useState<OrderStats>(initialStats);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");

  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [updating, setUpdating] = useState(false);

  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/admin/orders", {
        params: {
          search,
          status,
        },
      });

      setOrders(response.data.data || []);
      setStats(response.data.stats || initialStats);
    } catch (err) {
      console.error("Fetch Orders Error:", err);
      setError("Failed to load orders. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [search, status]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const updateOrder = async (
    orderId: string,
    field: "orderStatus" | "paymentStatus",
    value: OrderStatus | PaymentStatus
  ) => {
    try {
      setUpdating(true);

      await api.patch(`/admin/orders/${orderId}`, {
        [field]: value,
      });

      await fetchOrders();

      if (selectedOrder?._id === orderId) {
        const updated = await api.get(`/admin/orders/${orderId}`);
        setSelectedOrder(updated.data.data);
      }

      alert("Order updated successfully!");
    } catch (err) {
      console.error("Update Order Error:", err);
      alert("Failed to update order.");
    } finally {
      setUpdating(false);
    }
  };

  const openOrderDetails = async (orderId: string) => {
    try {
      const response = await api.get(`/admin/orders/${orderId}`);
      setSelectedOrder(response.data.data);
    } catch (err) {
      console.error("Order Details Error:", err);
      alert("Failed to load order details.");
    }
  };

  const closeModal = () => setSelectedOrder(null);

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8">
      {/* PAGE HEADER */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Orders Management
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage and track all your store orders.
          </p>
        </div>

        <button
          onClick={fetchOrders}
          disabled={loading}
          className="flex items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 disabled:opacity-50"
        >
          <FiRefreshCw className={loading ? "animate-spin" : ""} />
          Refresh Orders
        </button>
      </div>

      {/* STATISTICS */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Total Orders"
          value={stats.total}
          icon={<FiPackage />}
          color="bg-blue-50 text-blue-600"
        />

        <StatCard
          title="Pending Orders"
          value={stats.pending}
          icon={<FiClock />}
          color="bg-amber-50 text-amber-600"
        />

        <StatCard
          title="Delivered Orders"
          value={stats.delivered}
          icon={<FiCheckCircle />}
          color="bg-green-50 text-green-600"
        />

        <StatCard
          title="Total Revenue"
          value={formatCurrency(stats.revenue)}
          icon={<FiDollarSign />}
          color="bg-wine-50 text-wine-700"
        />
      </div>

      {/* STATUS SUMMARY */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <MiniStat label="Processing" value={stats.processing} />
        <MiniStat label="Shipped" value={stats.shipped} />
        <MiniStat label="Delivered" value={stats.delivered} />
        <MiniStat label="Cancelled" value={stats.cancelled} />
      </div>

      {/* SEARCH AND FILTER */}
      <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="relative w-full lg:max-w-md">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />

            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search order ID, customer name or email..."
              className="w-full rounded-lg border border-gray-200 py-3 pl-10 pr-4 text-sm text-gray-800 outline-none transition focus:border-wine-500 focus:ring-2 focus:ring-wine-100"
            />
          </div>

          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm text-gray-700 outline-none focus:border-wine-500"
          >
            <option value="all">All Orders</option>
            {statusOptions.map((item) => (
              <option key={item} value={item}>
                {item.charAt(0).toUpperCase() + item.slice(1)}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* ORDERS TABLE */}
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        <div className="border-b border-gray-100 px-5 py-4">
          <h2 className="font-semibold text-gray-900">All Orders</h2>
          <p className="mt-1 text-xs text-gray-500">
            {orders.length} orders found
          </p>
        </div>

        {loading ? (
          <div className="flex min-h-60 items-center justify-center">
            <div className="text-center">
              <FiRefreshCw className="mx-auto animate-spin text-2xl text-wine-700" />
              <p className="mt-3 text-sm text-gray-500">
                Loading orders...
              </p>
            </div>
          </div>
        ) : error ? (
          <div className="p-10 text-center">
            <p className="text-sm text-red-600">{error}</p>
            <button
              onClick={fetchOrders}
              className="mt-4 rounded-lg bg-wine-700 px-4 py-2 text-sm text-white hover:bg-wine-800"
            >
              Try Again
            </button>
          </div>
        ) : orders.length === 0 ? (
          <div className="flex min-h-60 flex-col items-center justify-center p-8 text-center">
            <FiPackage className="text-4xl text-gray-300" />
            <h3 className="mt-4 font-semibold text-gray-800">
              No Orders Found
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Orders will appear here when customers place orders.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[850px] text-left text-sm">
              <thead className="bg-gray-50 text-xs uppercase text-gray-500">
                <tr>
                  <th className="px-5 py-4">Order ID</th>
                  <th className="px-5 py-4">Customer</th>
                  <th className="px-5 py-4">Date</th>
                  <th className="px-5 py-4">Total</th>
                  <th className="px-5 py-4">Payment</th>
                  <th className="px-5 py-4">Status</th>
                  <th className="px-5 py-4">Action</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100">
                {orders.map((order) => (
                  <tr key={order._id} className="hover:bg-gray-50">
                    <td className="px-5 py-4 font-semibold text-gray-800">
                      {order.orderNumber}
                    </td>

                    <td className="px-5 py-4">
                      <p className="font-medium text-gray-800">
                        {order.customerName}
                      </p>
                      <p className="mt-1 text-xs text-gray-500">
                        {order.customerEmail}
                      </p>
                    </td>

                    <td className="px-5 py-4 text-gray-600">
                      {formatDate(order.createdAt)}
                    </td>

                    <td className="px-5 py-4 font-semibold text-gray-800">
                      {formatCurrency(order.totalAmount)}
                    </td>

                    <td className="px-5 py-4">
                      <StatusBadge status={order.paymentStatus} />
                    </td>

                    <td className="px-5 py-4">
                      <StatusBadge status={order.orderStatus} />
                    </td>

                    <td className="px-5 py-4">
                      <button
                        onClick={() => openOrderDetails(order._id)}
                        className="flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 text-xs font-medium text-gray-700 hover:border-wine-300 hover:bg-wine-50 hover:text-wine-700"
                      >
                        <FiEye />
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ORDER DETAILS MODAL */}
      {selectedOrder && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-wine-950/50 p-4"
          onClick={closeModal}
        >
          <div
            className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-2xl bg-white shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 flex items-center justify-between border-b border-gray-100 bg-white px-6 py-5">
              <div>
                <h2 className="text-lg font-bold text-gray-900">
                  Order Details
                </h2>
                <p className="mt-1 text-xs text-gray-500">
                  {selectedOrder.orderNumber}
                </p>
              </div>

              <button
                onClick={closeModal}
                className="rounded-lg p-2 text-gray-500 hover:bg-gray-100"
              >
                <FiX size={20} />
              </button>
            </div>

            <div className="space-y-6 p-6">
              {/* CUSTOMER */}
              <section>
                <h3 className="mb-3 font-semibold text-gray-900">
                  Customer Information
                </h3>
                <div className="grid gap-3 rounded-xl bg-gray-50 p-4 sm:grid-cols-2">
                  <Info label="Name" value={selectedOrder.customerName} />
                  <Info label="Email" value={selectedOrder.customerEmail} />
                  <Info
                    label="Order Date"
                    value={formatDate(selectedOrder.createdAt)}
                  />
                  <Info
                    label="Payment Method"
                    value={selectedOrder.paymentMethod.replaceAll("_", " ")}
                  />
                </div>
              </section>

              {/* SHIPPING */}
              <section>
                <h3 className="mb-3 font-semibold text-gray-900">
                  Shipping Address
                </h3>
                <div className="rounded-xl bg-gray-50 p-4 text-sm leading-6 text-gray-700">
                  <p className="font-medium">
                    {selectedOrder.shippingAddress.fullName}
                  </p>
                  <p>{selectedOrder.shippingAddress.phone}</p>
                  <p>{selectedOrder.shippingAddress.address}</p>
                  <p>
                    {selectedOrder.shippingAddress.city}
                    {selectedOrder.shippingAddress.state
                      ? `, ${selectedOrder.shippingAddress.state}`
                      : ""}
                  </p>
                  <p>{selectedOrder.shippingAddress.country}</p>
                </div>
              </section>

              {/* PRODUCTS */}
              <section>
                <h3 className="mb-3 font-semibold text-gray-900">
                  Ordered Products
                </h3>

                <div className="space-y-3">
                  {selectedOrder.items.map((item, index) => (
                    <div
                      key={`${item.product}-${index}`}
                      className="flex items-center justify-between gap-4 rounded-xl border border-gray-100 p-3"
                    >
                      <div className="flex items-center gap-3">
                        {item.image ? (
                          <img
                            src={item.image}
                            alt={item.name}
                            className="h-14 w-14 rounded-lg object-cover"
                          />
                        ) : (
                          <div className="flex h-14 w-14 items-center justify-center rounded-lg bg-gray-100">
                            <FiPackage className="text-gray-400" />
                          </div>
                        )}

                        <div>
                          <p className="font-medium text-gray-800">
                            {item.name}
                          </p>
                          <p className="text-xs text-gray-500">
                            Quantity: {item.quantity}
                          </p>
                        </div>
                      </div>

                      <p className="whitespace-nowrap font-semibold text-gray-800">
                        {formatCurrency(item.price * item.quantity)}
                      </p>
                    </div>
                  ))}
                </div>
              </section>

              {/* BILL */}
              <section className="rounded-xl bg-gray-50 p-4">
                <h3 className="mb-3 font-semibold text-gray-900">
                  Order Summary
                </h3>

                <div className="space-y-2 text-sm">
                  <SummaryRow
                    label="Subtotal"
                    value={formatCurrency(selectedOrder.subtotal)}
                  />
                  <SummaryRow
                    label="Shipping Fee"
                    value={formatCurrency(selectedOrder.shippingFee)}
                  />
                  <SummaryRow
                    label="Tax"
                    value={formatCurrency(selectedOrder.tax)}
                  />
                  <div className="border-t border-gray-200 pt-3">
                    <SummaryRow
                      label="Total Amount"
                      value={formatCurrency(selectedOrder.totalAmount)}
                      strong
                    />
                  </div>
                </div>
              </section>

              {/* UPDATE STATUS */}
              <section className="space-y-4">
                <h3 className="font-semibold text-gray-900">
                  Manage Order
                </h3>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                      Order Status
                    </label>
                    <select
                      value={selectedOrder.orderStatus}
                      disabled={updating}
                      onChange={(e) =>
                        updateOrder(
                          selectedOrder._id,
                          "orderStatus",
                          e.target.value as OrderStatus
                        )
                      }
                      className="w-full rounded-lg border border-gray-200 bg-white px-3 py-3 text-sm outline-none focus:border-wine-500"
                    >
                      {statusOptions.map((item) => (
                        <option key={item} value={item}>
                          {item.charAt(0).toUpperCase() + item.slice(1)}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                      Payment Status
                    </label>
                    <select
                      value={selectedOrder.paymentStatus}
                      disabled={updating}
                      onChange={(e) =>
                        updateOrder(
                          selectedOrder._id,
                          "paymentStatus",
                          e.target.value as PaymentStatus
                        )
                      }
                      className="w-full rounded-lg border border-gray-200 bg-white px-3 py-3 text-sm outline-none focus:border-wine-500"
                    >
                      {paymentOptions.map((item) => (
                        <option key={item} value={item}>
                          {item.charAt(0).toUpperCase() + item.slice(1)}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {updating && (
                  <p className="text-sm text-wine-700">
                    Updating order...
                  </p>
                )}
              </section>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// STATISTICS CARD
function StatCard({
  title,
  value,
  icon,
  color,
}: {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  color: string;
}) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500">{title}</p>
        <div className={`rounded-lg p-3 text-xl ${color}`}>
          {icon}
        </div>
      </div>
      <h3 className="mt-4 text-2xl font-bold text-gray-900">{value}</h3>
    </div>
  );
}

// SMALL STATISTIC
function MiniStat({
  label,
  value,
}: {
  label: string;
  value: number;
}) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4">
      <p className="text-xs text-gray-500">{label}</p>
      <p className="mt-2 text-xl font-bold text-gray-900">{value}</p>
    </div>
  );
}

// STATUS BADGE
function StatusBadge({ status }: { status: string }) {
  return (
    <span
      className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold capitalize ${
        statusStyle[status] || "bg-gray-100 text-gray-600"
      }`}
    >
      {status}
    </span>
  );
}

// INFORMATION ROW
function Info({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div>
      <p className="text-xs text-gray-500">{label}</p>
      <p className="mt-1 break-words text-sm font-medium capitalize text-gray-800">
        {value || "N/A"}
      </p>
    </div>
  );
}

// SUMMARY ROW
function SummaryRow({
  label,
  value,
  strong = false,
}: {
  label: string;
  value: string;
  strong?: boolean;
}) {
  return (
    <div
      className={`flex items-center justify-between ${
        strong ? "text-base font-bold text-gray-900" : "text-gray-600"
      }`}
    >
      <span>{label}</span>
      <span>{value}</span>
    </div>
  );
}
