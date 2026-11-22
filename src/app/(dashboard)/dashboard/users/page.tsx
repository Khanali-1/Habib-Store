
"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";

import {
  FiUsers,
  FiUserCheck,
  FiUserX,
  FiSearch,
  FiRefreshCw,
  FiEye,
  FiLock,
  FiUnlock,
  FiX,
  FiMail,
  FiCalendar,
  FiAlertCircle,
} from "react-icons/fi";

interface Customer {
  _id: string;
  name: string;
  email: string;
  role: "customer";
  isBlocked: boolean;
  blockedAt: string | null;
  createdAt: string;
}

interface CustomerStats {
  total: number;
  active: number;
  blocked: number;
}

type FilterStatus = "all" | "active" | "blocked";

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [stats, setStats] = useState<CustomerStats>({
    total: 0,
    active: 0,
    blocked: 0,
  });

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<FilterStatus>("all");
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [selectedCustomer, setSelectedCustomer] =
    useState<Customer | null>(null);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/admin/customers", {
        params: {
          search: search.trim(),
          status: filter,
        },
      });

      setCustomers(response.data.data || []);
      setStats(
        response.data.stats || {
          total: 0,
          active: 0,
          blocked: 0,
        }
      );
    } catch (err: any) {
      console.error("Customers fetch error:", err);

      setError(
        err.response?.data?.message ||
          "Unable to fetch customers."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchCustomers();
    }, 300);

    return () => clearTimeout(timer);
  }, [search, filter]);

  const handleBlockToggle = async (customer: Customer) => {
    const action = customer.isBlocked ? "unblock" : "block";

    const confirmed = window.confirm(
      `Are you sure you want to ${action} ${customer.name}?`
    );

    if (!confirmed) return;

    try {
      setActionLoading(customer._id);
      setMessage("");
      setError("");

      await api.patch(
        `/admin/customers/${customer._id}/${action}`
      );

      setMessage(
        `${customer.name} has been ${action}ed successfully.`
      );

      if (selectedCustomer?._id === customer._id) {
        setSelectedCustomer({
          ...customer,
          isBlocked: !customer.isBlocked,
          blockedAt: customer.isBlocked
            ? null
            : new Date().toISOString(),
        });
      }

      await fetchCustomers();
    } catch (err: any) {
      console.error("Customer status update error:", err);

      setError(
        err.response?.data?.message ||
          `Failed to ${action} customer.`
      );
    } finally {
      setActionLoading(null);
    }
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("en-PK", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 text-gray-900 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl space-y-7">

        {/* Header */}
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
              Customers
            </h1>
            <p className="mt-2 text-sm text-gray-500">
              Manage your registered customers and their accounts.
            </p>
          </div>

          <button
            onClick={fetchCustomers}
            disabled={loading}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold shadow-sm transition hover:bg-gray-100 disabled:opacity-50"
          >
            <FiRefreshCw
              className={loading ? "animate-spin" : ""}
            />
            Refresh
          </button>
        </div>

        {/* Messages */}
        {message && (
          <div className="flex items-center justify-between rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
            {message}
            <button onClick={() => setMessage("")}>
              <FiX />
            </button>
          </div>
        )}

        {error && (
          <div className="flex items-center justify-between rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            <span className="flex items-center gap-2">
              <FiAlertCircle />
              {error}
            </span>
            <button onClick={() => setError("")}>
              <FiX />
            </button>
          </div>
        )}

        {/* Statistics */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">

          <StatCard
            title="Total Customers"
            value={stats.total}
            icon={<FiUsers />}
            color="blue"
          />

          <StatCard
            title="Active Customers"
            value={stats.active}
            icon={<FiUserCheck />}
            color="green"
          />

          <StatCard
            title="Blocked Customers"
            value={stats.blocked}
            icon={<FiUserX />}
            color="red"
          />

        </div>

        {/* Customers Section */}
        <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">

          {/* Search and Filters */}
          <div className="flex flex-col gap-4 border-b border-gray-100 p-5 lg:flex-row lg:items-center lg:justify-between">

            <div>
              <h2 className="text-lg font-bold">
                Customer Directory
              </h2>
              <p className="mt-1 text-sm text-gray-500">
                View and manage all registered customers.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">

              <div className="relative">
                <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />

                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search name or email..."
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 py-2.5 pl-10 pr-4 text-sm outline-none transition focus:border-wine-500 focus:bg-white sm:w-64"
                />
              </div>

              <div className="flex rounded-xl border border-gray-200 bg-gray-50 p-1">
                {(
                  ["all", "active", "blocked"] as FilterStatus[]
                ).map((item) => (
                  <button
                    key={item}
                    onClick={() => setFilter(item)}
                    className={`rounded-lg px-3 py-2 text-xs font-semibold capitalize transition sm:text-sm ${
                      filter === item
                        ? "bg-wine-700 text-white shadow-sm"
                        : "text-gray-500 hover:text-gray-900"
                    }`}
                  >
                    {item}
                  </button>
                ))}
              </div>

            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">

            <table className="w-full min-w-[850px] text-left">

              <thead className="bg-gray-50 text-xs uppercase tracking-wider text-gray-500">
                <tr>
                  <th className="px-6 py-4 font-semibold">Customer</th>
                  <th className="px-6 py-4 font-semibold">Email</th>
                  <th className="px-6 py-4 font-semibold">Joined Date</th>
                  <th className="px-6 py-4 font-semibold">Status</th>
                  <th className="px-6 py-4 text-right font-semibold">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100">

                {loading ? (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-6 py-16 text-center text-sm text-gray-500"
                    >
                      Loading customers...
                    </td>
                  </tr>
                ) : customers.length === 0 ? (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-6 py-16 text-center"
                    >
                      <FiUsers className="mx-auto mb-3 text-3xl text-gray-300" />
                      <p className="font-semibold text-gray-700">
                        No customers found
                      </p>
                      <p className="mt-1 text-sm text-gray-400">
                        Registered customers will appear here.
                      </p>
                    </td>
                  </tr>
                ) : (
                  customers.map((customer) => (
                    <tr
                      key={customer._id}
                      className="transition hover:bg-gray-50"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-wine-100 font-bold text-wine-800">
                            {customer.name?.charAt(0).toUpperCase()}
                          </div>

                          <div>
                            <p className="font-semibold text-gray-800">
                              {customer.name}
                            </p>
                            <p className="text-xs text-gray-400">
                              Customer
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-4 text-sm text-gray-600">
                        {customer.email}
                      </td>

                      <td className="px-6 py-4 text-sm text-gray-600">
                        {formatDate(customer.createdAt)}
                      </td>

                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${
                            customer.isBlocked
                              ? "bg-red-50 text-red-600"
                              : "bg-green-50 text-green-600"
                          }`}
                        >
                          <span
                            className={`h-1.5 w-1.5 rounded-full ${
                              customer.isBlocked
                                ? "bg-red-500"
                                : "bg-green-500"
                            }`}
                          />
                          {customer.isBlocked ? "Blocked" : "Active"}
                        </span>
                      </td>

                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2">

                          <button
                            onClick={() =>
                              setSelectedCustomer(customer)
                            }
                            title="View customer"
                            className="rounded-lg border border-gray-200 p-2 text-gray-600 transition hover:bg-gray-100"
                          >
                            <FiEye />
                          </button>

                          <button
                            onClick={() =>
                              handleBlockToggle(customer)
                            }
                            disabled={
                              actionLoading === customer._id
                            }
                            title={
                              customer.isBlocked
                                ? "Unblock customer"
                                : "Block customer"
                            }
                            className={`flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold transition disabled:opacity-50 ${
                              customer.isBlocked
                                ? "bg-green-50 text-green-700 hover:bg-green-100"
                                : "bg-red-50 text-red-600 hover:bg-red-100"
                            }`}
                          >
                            {actionLoading === customer._id ? (
                              <FiRefreshCw className="animate-spin" />
                            ) : customer.isBlocked ? (
                              <FiUnlock />
                            ) : (
                              <FiLock />
                            )}

                            {customer.isBlocked ? "Unblock" : "Block"}
                          </button>

                        </div>
                      </td>
                    </tr>
                  ))
                )}

              </tbody>
            </table>
          </div>

          {/* Footer */}
          <div className="border-t border-gray-100 px-6 py-4 text-sm text-gray-500">
            Showing {customers.length} customer
            {customers.length !== 1 ? "s" : ""}
          </div>

        </div>
      </div>

      {/* Customer Details Modal */}
      {selectedCustomer && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-wine-950/50 p-4"
          onClick={() => setSelectedCustomer(null)}
        >
          <div
            className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >

            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-xl font-bold">
                Customer Details
              </h2>

              <button
                onClick={() => setSelectedCustomer(null)}
                className="rounded-lg p-2 text-gray-500 hover:bg-gray-100"
              >
                <FiX />
              </button>
            </div>

            <div className="mb-6 flex flex-col items-center">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-wine-100 text-3xl font-bold text-wine-800">
                {selectedCustomer.name?.charAt(0).toUpperCase()}
              </div>

              <h3 className="mt-3 text-lg font-bold">
                {selectedCustomer.name}
              </h3>

              <span
                className={`mt-2 rounded-full px-3 py-1 text-xs font-semibold ${
                  selectedCustomer.isBlocked
                    ? "bg-red-50 text-red-600"
                    : "bg-green-50 text-green-600"
                }`}
              >
                {selectedCustomer.isBlocked ? "Blocked" : "Active"}
              </span>
            </div>

            <div className="space-y-4">

              <DetailRow
                icon={<FiMail />}
                label="Email Address"
                value={selectedCustomer.email}
              />

              <DetailRow
                icon={<FiCalendar />}
                label="Registration Date"
                value={formatDate(selectedCustomer.createdAt)}
              />

              <DetailRow
                icon={<FiUsers />}
                label="Account Role"
                value="Customer"
              />

              {selectedCustomer.blockedAt && (
                <DetailRow
                  icon={<FiLock />}
                  label="Blocked Date"
                  value={formatDate(selectedCustomer.blockedAt)}
                />
              )}

            </div>

            <button
              onClick={() => handleBlockToggle(selectedCustomer)}
              disabled={actionLoading === selectedCustomer._id}
              className={`mt-7 flex w-full items-center justify-center gap-2 rounded-xl py-3 text-sm font-semibold transition disabled:opacity-50 ${
                selectedCustomer.isBlocked
                  ? "bg-green-600 text-white hover:bg-green-700"
                  : "bg-red-600 text-white hover:bg-red-700"
              }`}
            >
              {selectedCustomer.isBlocked ? (
                <>
                  <FiUnlock />
                  Unblock Customer
                </>
              ) : (
                <>
                  <FiLock />
                  Block Customer
                </>
              )}
            </button>

          </div>
        </div>
      )}
    </div>
  );
}

// Statistics Card
function StatCard({
  title,
  value,
  icon,
  color,
}: {
  title: string;
  value: number;
  icon: React.ReactNode;
  color: "blue" | "green" | "red";
}) {
  const styles = {
    blue: "bg-blue-50 text-blue-600",
    green: "bg-green-50 text-green-600",
    red: "bg-red-50 text-red-600",
  };

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-gray-500">
          {title}
        </p>

        <div
          className={`flex h-11 w-11 items-center justify-center rounded-xl text-xl ${styles[color]}`}
        >
          {icon}
        </div>
      </div>

      <p className="mt-4 text-3xl font-bold tracking-tight">
        {value.toLocaleString()}
      </p>
    </div>
  );
}

// Customer Detail Row
function DetailRow({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <div className="mt-0.5 text-gray-400">{icon}</div>

      <div className="min-w-0">
        <p className="text-xs text-gray-400">{label}</p>
        <p className="break-all text-sm font-medium text-gray-800">
          {value}
        </p>
      </div>
    </div>
  );
}
