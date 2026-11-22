
"use client";

import { useEffect, useState } from "react";

type SettingsData = {
  profile: {
    name: string;
    email: string;
    phone: string;
  };
  store: {
    name: string;
    email: string;
    phone: string;
    address: string;
    currency: string;
    tax: number;
  };
  notifications: {
    newOrders: boolean;
    orderUpdates: boolean;
    lowStock: boolean;
    newCustomers: boolean;
    marketing: boolean;
  };
  preferences: {
    language: string;
    timezone: string;
    dateFormat: string;
  };
};

const defaultSettings: SettingsData = {
  profile: {
    name: "Admin",
    email: "admin@hstore.com",
    phone: "",
  },
  store: {
    name: "H Store",
    email: "contact@hstore.com",
    phone: "",
    address: "",
    currency: "PKR",
    tax: 0,
  },
  notifications: {
    newOrders: true,
    orderUpdates: true,
    lowStock: true,
    newCustomers: false,
    marketing: false,
  },
  preferences: {
    language: "English",
    timezone: "Asia/Karachi",
    dateFormat: "DD/MM/YYYY",
  },
};

type Section = "profile" | "store" | "notifications" | "preferences";

export default function SettingsPage() {
  const [settings, setSettings] = useState<SettingsData>(defaultSettings);
  const [activeTab, setActiveTab] = useState<Section>("profile");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // LOAD SETTINGS FROM DATABASE
  useEffect(() => {
    const loadSettings = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch("/api/admin/settings", {
          method: "GET",
          credentials: "include",
          cache: "no-store",
        });

        const result = await response.json();

        if (!response.ok || !result.success) {
          throw new Error(result.message || "Failed to load settings");
        }

        setSettings({
          profile: {
            ...defaultSettings.profile,
            ...result.data.profile,
          },
          store: {
            ...defaultSettings.store,
            ...result.data.store,
          },
          notifications: {
            ...defaultSettings.notifications,
            ...result.data.notifications,
          },
          preferences: {
            ...defaultSettings.preferences,
            ...result.data.preferences,
          },
        });
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Something went wrong"
        );
      } finally {
        setLoading(false);
      }
    };

    loadSettings();
  }, []);

  // UPDATE TEXT / NUMBER INPUTS
  const handleChange = (
    section: "profile" | "store" | "preferences",
    field: string,
    value: string
  ) => {
    setSettings((previous) => ({
      ...previous,
      [section]: {
        ...previous[section],
        [field]: section === "store" && field === "tax"
          ? Number(value)
          : value,
      },
    }));
  };

  // UPDATE NOTIFICATION SWITCHES
  const handleToggle = (
    field: keyof SettingsData["notifications"]
  ) => {
    setSettings((previous) => ({
      ...previous,
      notifications: {
        ...previous.notifications,
        [field]: !previous.notifications[field],
      },
    }));
  };

  // SAVE SETTINGS TO DATABASE
  const handleSave = async () => {
    try {
      setSaving(true);
      setMessage("");
      setError("");

      const response = await fetch("/api/admin/settings", {
        method: "PUT",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(settings),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Failed to save settings");
      }

      setMessage("Settings saved successfully!");

      if (result.data) {
        setSettings((previous) => ({
          ...previous,
          ...result.data,
        }));
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Something went wrong"
      );
    } finally {
      setSaving(false);
    }
  };

  const tabs: { id: Section; label: string }[] = [
    { id: "profile", label: "Profile" },
    { id: "store", label: "Store" },
    { id: "notifications", label: "Notifications" },
    { id: "preferences", label: "Preferences" },
  ];

  const inputClass =
    "w-full rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm text-gray-800 outline-none transition focus:border-gray-500";

  const labelClass = "mb-2 block text-sm font-medium text-gray-700";

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <p className="text-sm text-gray-500">Loading settings...</p>
      </div>
    );
  }

  return (
    <div className="w-full space-y-6 pb-10">
      {/* HEADER */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">
            Settings
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage your account and store settings.
          </p>
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          className="rounded-lg bg-gray-900 px-6 py-3 text-sm font-medium text-white transition hover:bg-gray-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </div>

      {/* SUCCESS / ERROR MESSAGE */}
      {message && (
        <div className="rounded-lg border border-green-200 bg-green-50 p-3 text-sm text-green-700">
          {message}
        </div>
      )}

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* TABS */}
      <div className="flex flex-wrap gap-2 border-b border-gray-200 pb-3">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => {
              setActiveTab(tab.id);
              setMessage("");
              setError("");
            }}
            className={`rounded-lg px-4 py-2.5 text-sm font-medium transition ${
              activeTab === tab.id
                ? "bg-gray-900 text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* PROFILE SETTINGS */}
      {activeTab === "profile" && (
        <section className="rounded-xl border border-gray-200 bg-white p-5 sm:p-7">
          <h2 className="text-lg font-semibold text-gray-900">
            Admin Profile
          </h2>
          <p className="mb-6 mt-1 text-sm text-gray-500">
            Manage your administrator information.
          </p>

          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label className={labelClass}>Full Name</label>
              <input
                className={inputClass}
                value={settings.profile.name}
                onChange={(e) =>
                  handleChange("profile", "name", e.target.value)
                }
                placeholder="Enter your name"
              />
            </div>

            <div>
              <label className={labelClass}>Email Address</label>
              <input
                type="email"
                className={inputClass}
                value={settings.profile.email}
                onChange={(e) =>
                  handleChange("profile", "email", e.target.value)
                }
                placeholder="admin@example.com"
              />
            </div>

            <div>
              <label className={labelClass}>Phone Number</label>
              <input
                className={inputClass}
                value={settings.profile.phone}
                onChange={(e) =>
                  handleChange("profile", "phone", e.target.value)
                }
                placeholder="Enter phone number"
              />
            </div>
          </div>
        </section>
      )}

      {/* STORE SETTINGS */}
      {activeTab === "store" && (
        <section className="rounded-xl border border-gray-200 bg-white p-5 sm:p-7">
          <h2 className="text-lg font-semibold text-gray-900">
            Store Information
          </h2>
          <p className="mb-6 mt-1 text-sm text-gray-500">
            Manage your H Store details.
          </p>

          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label className={labelClass}>Store Name</label>
              <input
                className={inputClass}
                value={settings.store.name}
                onChange={(e) =>
                  handleChange("store", "name", e.target.value)
                }
              />
            </div>

            <div>
              <label className={labelClass}>Store Email</label>
              <input
                type="email"
                className={inputClass}
                value={settings.store.email}
                onChange={(e) =>
                  handleChange("store", "email", e.target.value)
                }
              />
            </div>

            <div>
              <label className={labelClass}>Phone Number</label>
              <input
                className={inputClass}
                value={settings.store.phone}
                onChange={(e) =>
                  handleChange("store", "phone", e.target.value)
                }
              />
            </div>

            <div>
              <label className={labelClass}>Currency</label>
              <select
                className={inputClass}
                value={settings.store.currency}
                onChange={(e) =>
                  handleChange("store", "currency", e.target.value)
                }
              >
                <option value="PKR">PKR - Pakistani Rupee</option>
                <option value="USD">USD - US Dollar</option>
                <option value="EUR">EUR - Euro</option>
                <option value="GBP">GBP - British Pound</option>
              </select>
            </div>

            <div className="sm:col-span-2">
              <label className={labelClass}>Store Address</label>
              <textarea
                rows={3}
                className={inputClass}
                value={settings.store.address}
                onChange={(e) =>
                  handleChange("store", "address", e.target.value)
                }
                placeholder="Enter store address"
              />
            </div>

            <div>
              <label className={labelClass}>Tax Percentage (%)</label>
              <input
                type="number"
                min="0"
                max="100"
                className={inputClass}
                value={settings.store.tax}
                onChange={(e) =>
                  handleChange("store", "tax", e.target.value)
                }
              />
            </div>
          </div>
        </section>
      )}

      {/* NOTIFICATION SETTINGS */}
      {activeTab === "notifications" && (
        <section className="rounded-xl border border-gray-200 bg-white p-5 sm:p-7">
          <h2 className="text-lg font-semibold text-gray-900">
            Notification Settings
          </h2>
          <p className="mb-6 mt-1 text-sm text-gray-500">
            Choose which notifications you want to enable.
          </p>

          <div className="space-y-5">
            {(
              [
                ["newOrders", "New Orders", "Receive notifications for new orders."],
                ["orderUpdates", "Order Updates", "Receive order status update notifications."],
                ["lowStock", "Low Stock Alerts", "Get notified when product stock is low."],
                ["newCustomers", "New Customers", "Receive notifications when customers register."],
                ["marketing", "Marketing Updates", "Receive promotional and marketing updates."],
              ] as const
            ).map(([key, title, description]) => (
              <div
                key={key}
                className="flex items-center justify-between gap-4 border-b border-gray-100 pb-4 last:border-0"
              >
                <div>
                  <h3 className="text-sm font-medium text-gray-800">
                    {title}
                  </h3>
                  <p className="mt-1 text-xs text-gray-500">
                    {description}
                  </p>
                </div>

                <button
                  type="button"
                  role="switch"
                  aria-checked={settings.notifications[key]}
                  onClick={() => handleToggle(key)}
                  className={`relative h-6 w-11 shrink-0 rounded-full transition ${
                    settings.notifications[key]
                      ? "bg-gray-900"
                      : "bg-gray-300"
                  }`}
                >
                  <span
                    className={`absolute top-1 h-4 w-4 rounded-full bg-white transition ${
                      settings.notifications[key]
                        ? "left-6"
                        : "left-1"
                    }`}
                  />
                </button>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* PREFERENCES */}
      {activeTab === "preferences" && (
        <section className="rounded-xl border border-gray-200 bg-white p-5 sm:p-7">
          <h2 className="text-lg font-semibold text-gray-900">
            Preferences
          </h2>
          <p className="mb-6 mt-1 text-sm text-gray-500">
            Customize your dashboard preferences.
          </p>

          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label className={labelClass}>Language</label>
              <select
                className={inputClass}
                value={settings.preferences.language}
                onChange={(e) =>
                  handleChange("preferences", "language", e.target.value)
                }
              >
                <option value="English">English</option>
                <option value="Urdu">Urdu</option>
              </select>
            </div>

            <div>
              <label className={labelClass}>Timezone</label>
              <select
                className={inputClass}
                value={settings.preferences.timezone}
                onChange={(e) =>
                  handleChange("preferences", "timezone", e.target.value)
                }
              >
                <option value="Asia/Karachi">Asia/Karachi</option>
                <option value="Asia/Dubai">Asia/Dubai</option>
                <option value="Europe/London">Europe/London</option>
                <option value="America/New_York">America/New_York</option>
              </select>
            </div>

            <div>
              <label className={labelClass}>Date Format</label>
              <select
                className={inputClass}
                value={settings.preferences.dateFormat}
                onChange={(e) =>
                  handleChange("preferences", "dateFormat", e.target.value)
                }
              >
                <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                <option value="YYYY-MM-DD">YYYY-MM-DD</option>
              </select>
            </div>
          </div>
        </section>
      )}

      {/* BOTTOM SAVE BUTTON */}
      <div className="flex justify-end">
        <button
          onClick={handleSave}
          disabled={saving}
          className="rounded-lg bg-gray-900 px-6 py-3 text-sm font-medium text-white transition hover:bg-gray-700 disabled:opacity-60"
        >
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </div>
  );
}
