
"use client";

import { useEffect, useState, type FormEvent } from "react";
import api from "@/lib/api";

interface Category {
  _id: string;
  name: string;
  description: string;
  status: "Active" | "Inactive";
}

interface CategoryForm {
  name: string;
  description: string;
  status: "Active" | "Inactive";
}

const initialForm: CategoryForm = {
  name: "",
  description: "",
  status: "Active",
};

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<CategoryForm>(initialForm);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [actionId, setActionId] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // GET CATEGORIES FROM DATABASE
  async function fetchCategories() {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/categories");

      setCategories(
        Array.isArray(response.data.data)
          ? response.data.data
          : []
      );
    } catch (err: any) {
      console.error("Fetch categories error:", err);
      setError(
        err.response?.data?.message || "Failed to load categories."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchCategories();
  }, []);

  // SEARCH
  const filteredCategories = categories.filter((category) =>
    category.name.toLowerCase().includes(search.toLowerCase())
  );

  // STATISTICS
  const activeCount = categories.filter(
    (category) => category.status === "Active"
  ).length;

  const inactiveCount = categories.filter(
    (category) => category.status === "Inactive"
  ).length;

  // OPEN ADD FORM
  function openAddForm() {
    setEditingId(null);
    setFormData(initialForm);
    setError("");
    setSuccess("");
    setShowForm(true);
  }

  // OPEN EDIT FORM
  function openEditForm(category: Category) {
    setEditingId(category._id);

    setFormData({
      name: category.name,
      description: category.description || "",
      status: category.status,
    });

    setError("");
    setSuccess("");
    setShowForm(true);
  }

  // CLOSE FORM
  function closeForm() {
    setShowForm(false);
    setEditingId(null);
    setFormData(initialForm);
    setError("");
  }

  // CREATE / UPDATE
  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!formData.name.trim()) {
      setError("Please enter category name.");
      return;
    }

    try {
      setSaving(true);
      setError("");
      setSuccess("");

      const payload = {
        name: formData.name.trim(),
        description: formData.description.trim(),
        status: formData.status,
      };

      if (editingId) {
        await api.put(`/categories/${editingId}`, payload);
        setSuccess("Category updated successfully.");
      } else {
        await api.post("/categories", payload);
        setSuccess("Category created successfully.");
      }

      closeForm();
      await fetchCategories();
    } catch (err: any) {
      console.error("Save category error:", err);
      setError(
        err.response?.data?.message || "Failed to save category."
      );
    } finally {
      setSaving(false);
    }
  }

  // DELETE
  async function handleDelete(id: string) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this category?"
    );

    if (!confirmed) return;

    try {
      setActionId(id);
      setError("");
      setSuccess("");

      await api.delete(`/categories/${id}`);

      setSuccess("Category deleted successfully.");
      await fetchCategories();
    } catch (err: any) {
      console.error("Delete category error:", err);
      setError(
        err.response?.data?.message || "Failed to delete category."
      );
    } finally {
      setActionId(null);
    }
  }

  // TOGGLE STATUS
  async function toggleStatus(category: Category) {
    const newStatus =
      category.status === "Active" ? "Inactive" : "Active";

    try {
      setActionId(category._id);
      setError("");
      setSuccess("");

      await api.put(`/categories/${category._id}`, {
        name: category.name,
        description: category.description || "",
        status: newStatus,
      });

      setSuccess(`Category ${newStatus.toLowerCase()} successfully.`);
      await fetchCategories();
    } catch (err: any) {
      console.error("Update category status error:", err);
      setError(
        err.response?.data?.message ||
          "Failed to update category status."
      );
    } finally {
      setActionId(null);
    }
  }

  return (
    <div>
      {/* PAGE HEADING */}
      <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 sm:text-3xl">
            Categories
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            Organize and manage your store categories.
          </p>
        </div>

        <button
          type="button"
          onClick={openAddForm}
          className="rounded-xl bg-wine-700 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-wine-200 transition hover:bg-wine-800"
        >
          + Add New Category
        </button>
      </div>

      {/* ALERTS */}
      {success && (
        <div className="mb-5 flex items-center justify-between rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
          {success}
          <button onClick={() => setSuccess("")}>×</button>
        </div>
      )}

      {error && !showForm && (
        <div className="mb-5 flex items-center justify-between rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
          <button onClick={() => setError("")}>×</button>
        </div>
      )}

      {/* STATISTICS */}
      <div className="mb-8 grid grid-cols-1 gap-5 sm:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">Total Categories</p>
          <h2 className="mt-3 text-3xl font-bold text-slate-800">
            {categories.length}
          </h2>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">Active Categories</p>
          <h2 className="mt-3 text-3xl font-bold text-emerald-600">
            {activeCount}
          </h2>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">Inactive Categories</p>
          <h2 className="mt-3 text-3xl font-bold text-amber-600">
            {inactiveCount}
          </h2>
        </div>
      </div>

      {/* ADD / EDIT FORM */}
      {showForm && (
        <div className="mb-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-slate-800">
                {editingId ? "Edit Category" : "Add New Category"}
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Enter your category information below.
              </p>
            </div>

            <button
              type="button"
              onClick={closeForm}
              className="text-2xl text-slate-400 hover:text-red-500"
              aria-label="Close form"
            >
              ×
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            {error && (
              <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                {error}
              </div>
            )}

            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Category Name
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      name: e.target.value,
                    })
                  }
                  placeholder="Enter category name"
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-wine-500 focus:ring-2 focus:ring-wine-100"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Status
                </label>
                <select
                  value={formData.status}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      status: e.target.value as "Active" | "Inactive",
                    })
                  }
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-wine-500 focus:ring-2 focus:ring-wine-100"
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Description
                </label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      description: e.target.value,
                    })
                  }
                  placeholder="Write category description..."
                  className="w-full resize-none rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-wine-500 focus:ring-2 focus:ring-wine-100"
                />
              </div>
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              <button
                type="submit"
                disabled={saving}
                className="rounded-xl bg-wine-700 px-6 py-3 text-sm font-semibold text-white transition hover:bg-wine-800 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {saving
                  ? "Saving..."
                  : editingId
                    ? "Update Category"
                    : "Save Category"}
              </button>

              <button
                type="button"
                onClick={closeForm}
                className="rounded-xl border border-slate-200 px-6 py-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* CATEGORIES TABLE */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-col justify-between gap-4 border-b border-slate-100 p-5 sm:flex-row sm:items-center">
          <div>
            <h2 className="font-bold text-slate-800">All Categories</h2>
            <p className="mt-1 text-xs text-slate-400">
              Manage all your store categories here.
            </p>
          </div>

          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search category..."
            className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-wine-500 sm:w-64"
          />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[650px] text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase text-slate-500">
              <tr>
                <th className="px-6 py-4 font-semibold">Category</th>
                <th className="px-6 py-4 font-semibold">Description</th>
                <th className="px-6 py-4 font-semibold">Status</th>
                <th className="px-6 py-4 text-right font-semibold">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-slate-400">
                    Loading categories...
                  </td>
                </tr>
              ) : filteredCategories.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-slate-400">
                    {search
                      ? "No matching categories found."
                      : "No categories in database. Click Add New Category to create one."}
                  </td>
                </tr>
              ) : (
                filteredCategories.map((category) => (
                  <tr
                    key={category._id}
                    className="transition hover:bg-slate-50"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-wine-50 text-lg font-bold text-wine-700">
                          {category.name.charAt(0).toUpperCase()}
                        </div>
                        <span className="font-semibold text-slate-800">
                          {category.name}
                        </span>
                      </div>
                    </td>

                    <td className="max-w-xs px-6 py-4 text-slate-500">
                      {category.description || "No description"}
                    </td>

                    <td className="px-6 py-4">
                      <button
                        type="button"
                        disabled={actionId === category._id}
                        onClick={() => toggleStatus(category)}
                        className={`rounded-full px-3 py-1 text-xs font-semibold disabled:opacity-50 ${
                          category.status === "Active"
                            ? "bg-emerald-50 text-emerald-600"
                            : "bg-amber-50 text-amber-600"
                        }`}
                      >
                        {actionId === category._id
                          ? "Updating..."
                          : category.status}
                      </button>
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => openEditForm(category)}
                          className="rounded-lg bg-wine-50 px-3 py-2 text-xs font-semibold text-wine-700 transition hover:bg-wine-100"
                        >
                          Edit
                        </button>

                        <button
                          type="button"
                          disabled={actionId === category._id}
                          onClick={() => handleDelete(category._id)}
                          className="rounded-lg bg-red-50 px-3 py-2 text-xs font-semibold text-red-600 transition hover:bg-red-100 disabled:opacity-50"
                        >
                          {actionId === category._id ? "Please wait..." : "Delete"}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="border-t border-slate-100 px-6 py-4 text-xs text-slate-400">
          Showing {filteredCategories.length} of {categories.length} categories
        </div>
      </div>
    </div>
  );
}
