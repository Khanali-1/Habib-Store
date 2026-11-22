"use client";

import {
  useEffect,
  useMemo,
  useState,
  type FormEvent,
  type ChangeEvent,
} from "react";

import axios from "axios";
import api from "@/lib/api";

import {
  FiPlus,
  FiSearch,
  FiEdit2,
  FiTrash2,
  FiPackage,
  FiX,
  FiImage,
  FiUpload,
  FiTag,
} from "react-icons/fi";

interface CountryPrices {
  PK?: number;
  FR?: number;
  US?: number;
  IT?: number;
  ES?: number;
  OM?: number;
  SA?: number;
}

interface Product {
  _id: string;
  name: string;
  description: string;
  image: string;
  category: {
    _id: string;
    name: string;
  };
  price: number;
  prices?: CountryPrices;
  stock: number;
  status: "Active" | "Inactive";
}

interface Category {
  _id: string;
  name: string;
  status: "Active" | "Inactive";
}

interface ProductForm {
  name: string;
  description: string;
  image: string;
  category: string;

  prices: {
    PK: string;
    FR: string;
    US: string;
    IT: string;
    ES: string;
    OM: string;
    SA: string;
  };

  stock: string;
  status: "Active" | "Inactive";
}

const inputClass =
  "w-full rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-wine-500 focus:ring-2 focus:ring-wine-100";

const initialForm: ProductForm = {
  name: "",
  description: "",
  image: "",
  category: "",

  prices: {
    PK: "",
    FR: "",
    US: "",
    IT: "",
    ES: "",
    OM: "",
    SA: "",
  },

  stock: "",
  status: "Active",
};

const countries = [
  { code: "PK" as const, name: "Pakistan", flag: "🇵🇰", currency: "PKR" },
  { code: "FR" as const, name: "France", flag: "🇫🇷", currency: "EUR" },
  { code: "US" as const, name: "USA", flag: "🇺🇸", currency: "USD" },
  { code: "IT" as const, name: "Italy", flag: "🇮🇹", currency: "EUR" },
  { code: "ES" as const, name: "Spain", flag: "🇪🇸", currency: "EUR" },
  { code: "OM" as const, name: "Oman", flag: "🇴🇲", currency: "OMR" },
  { code: "SA" as const, name: "Saudi Arabia", flag: "🇸🇦", currency: "SAR" },
];

const MAX_IMAGE_SIZE = 1.4 * 1024 * 1024;

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);

  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [creatingCategory, setCreatingCategory] = useState(false);

  const [newCategoryName, setNewCategoryName] = useState("");

  const [form, setForm] = useState<ProductForm>(initialForm);

  // Fetch products
  const fetchProducts = async () => {
    try {
      const response = await api.get("/products");
      setProducts(response.data.data || []);
    } catch (error) {
      console.error("Products fetch error:", error);
      alert("Failed to fetch products.");
    }
  };

  // Fetch categories
  const fetchCategories = async () => {
    try {
      const response = await api.get("/categories");

      const categoryData: Category[] = response.data.data || [];

      const activeCategories = categoryData.filter(
        (category) => category.status === "Active"
      );

      setCategories(activeCategories);

      return activeCategories;
    } catch (error) {
      console.error("Categories fetch error:", error);
      alert("Failed to fetch categories.");
      return [];
    }
  };

  // Initial page loading
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);

      await Promise.all([
        fetchProducts(),
        fetchCategories(),
      ]);

      setLoading(false);
    };

    loadData();
  }, []);

  // Search products
  const filteredProducts = useMemo(() => {
    const searchValue = search.toLowerCase();

    return products.filter(
      (product) =>
        product.name.toLowerCase().includes(searchValue) ||
        product.category?.name?.toLowerCase().includes(searchValue) ||
        product.description?.toLowerCase().includes(searchValue)
    );
  }, [products, search]);

  // Statistics
  const totalProducts = products.length;

  const activeProducts = products.filter(
    (product) => product.status === "Active"
  ).length;

  const inactiveProducts = products.filter(
    (product) => product.status === "Inactive"
  ).length;

  // Open add form
  const openAddForm = () => {
    setEditId(null);

    setForm({
      ...initialForm,
      prices: { ...initialForm.prices },
      category: categories[0]?._id || "",
    });

    setNewCategoryName("");
    setShowForm(true);
  };

  // Open edit form
  const openEditForm = (product: Product) => {
    setEditId(product._id);

    setForm({
      name: product.name,
      description: product.description || "",
      image: product.image || "",
      category: product.category?._id || "",

      prices: {
        PK: String(product.prices?.PK ?? product.price ?? ""),
        FR: String(product.prices?.FR ?? ""),
        US: String(product.prices?.US ?? ""),
        IT: String(product.prices?.IT ?? ""),
        ES: String(product.prices?.ES ?? ""),
        OM: String(product.prices?.OM ?? ""),
        SA: String(product.prices?.SA ?? ""),
      },

      stock: String(product.stock ?? 0),
      status: product.status,
    });

    setNewCategoryName("");
    setShowForm(true);
  };

  // Handle country price changes
  const handlePriceChange = (
    countryCode: keyof ProductForm["prices"],
    value: string
  ) => {
    setForm((prev) => ({
      ...prev,
      prices: {
        ...prev.prices,
        [countryCode]: value,
      },
    }));
  };

  // Upload and convert image to Base64
  const handleImageChange = (
    e: ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Please select a valid image file.");
      e.target.value = "";
      return;
    }

    if (file.size > MAX_IMAGE_SIZE) {
      alert("Image size must be less than 1.4 MB.");
      e.target.value = "";
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      if (typeof reader.result === "string") {
        setForm((prev) => ({
          ...prev,
          image: reader.result as string,
        }));
      }
    };

    reader.onerror = () => {
      alert("Failed to read image.");
    };

    reader.readAsDataURL(file);
  };

  // Create category directly from product form
  const handleCreateCategory = async () => {
    const categoryName = newCategoryName.trim();

    if (!categoryName) {
      alert("Please enter a category name.");
      return;
    }

    const alreadyExists = categories.some(
      (category) =>
        category.name.toLowerCase() === categoryName.toLowerCase()
    );

    if (alreadyExists) {
      alert(
        "This category already exists. Please select it from the dropdown."
      );
      return;
    }

    try {
      setCreatingCategory(true);

      const response = await api.post("/categories", {
        name: categoryName,
        description: "",
        status: "Active",
      });

      const newCategory: Category = response.data.data;

      if (!newCategory?._id) {
        throw new Error(
          "Category was created but its data was not returned."
        );
      }

      setCategories((prev) => [...prev, newCategory]);

      setForm((prev) => ({
        ...prev,
        category: newCategory._id,
      }));

      setNewCategoryName("");

      alert("Category created successfully!");
    } catch (error) {
      console.error("Category creation error:", error);

      const message = axios.isAxiosError(error)
        ? error.response?.data?.message
        : error instanceof Error
          ? error.message
          : null;

      alert(message || "Failed to create category.");
    } finally {
      setCreatingCategory(false);
    }
  };

  // Add or update product
  const handleSubmit = async (
    e: FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    if (!form.name.trim()) {
      alert("Please enter product name.");
      return;
    }

    if (!form.category) {
      alert("Please select or create a category.");
      return;
    }

    // Pakistan price is required
    if (form.prices.PK.trim() === "") {
      alert("Please enter Pakistan product price.");
      return;
    }

    const countryPrices: Partial<Record<keyof ProductForm["prices"], number>> = {};

    for (const country of countries) {
      const value = form.prices[country.code].trim();

      // Other country prices are optional
      if (value === "") continue;

      const numericPrice = Number(value);

      if (!Number.isFinite(numericPrice) || numericPrice < 0) {
        alert(`Please enter a valid ${country.name} price.`);
        return;
      }

      countryPrices[country.code] = numericPrice;
    }

    const stock =
      form.stock.trim() === "" ? 0 : Number(form.stock);

    if (!Number.isInteger(stock) || stock < 0) {
      alert("Stock must be a valid whole number.");
      return;
    }

    const selectedCategory = categories.find(
      (category) => category._id === form.category
    );

    if (!selectedCategory) {
      alert("Please select a valid category.");
      return;
    }

    const payload = {
      name: form.name.trim(),
      description: form.description.trim(),
      image: form.image,
      category: selectedCategory.name,

      // Old field retained for compatibility
      price: countryPrices.PK,

      // New country-wise prices
      prices: countryPrices,

      stock,
      status: form.status,
    };

    try {
      setSaving(true);

      if (editId) {
        await api.put(`/products/${editId}`, payload);
        alert("Product updated successfully!");
      } else {
        await api.post("/products", payload);
        alert("Product added successfully!");
      }

      setShowForm(false);
      setEditId(null);
      setForm({
        ...initialForm,
        prices: { ...initialForm.prices },
      });
      setNewCategoryName("");

      await fetchProducts();
    } catch (error) {
      console.error("Product save error:", error);

      const message = axios.isAxiosError(error)
        ? error.response?.data?.message
        : null;

      alert(message || "Failed to save product.");
    } finally {
      setSaving(false);
    }
  };

  // Delete product
  const handleDelete = async (id: string) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this product?"
    );

    if (!confirmed) return;

    try {
      await api.delete(`/products/${id}`);

      alert("Product deleted successfully!");

      await fetchProducts();
    } catch (error) {
      console.error("Product delete error:", error);

      const message = axios.isAxiosError(error)
        ? error.response?.data?.message
        : null;

      alert(message || "Failed to delete product.");
    }
  };

  return (
    <div className="space-y-6">

      {/* Page Heading */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">
            Products
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Manage your store products and inventory.
          </p>
        </div>

        <button
          type="button"
          onClick={openAddForm}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-wine-700 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-wine-800"
        >
          <FiPlus size={18} />
          Add Product
        </button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">
                Total Products
              </p>

              <h2 className="mt-2 text-2xl font-bold text-slate-800">
                {totalProducts}
              </h2>
            </div>

            <div className="rounded-lg bg-wine-50 p-3 text-wine-700">
              <FiPackage size={22} />
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">
            Active Products
          </p>

          <h2 className="mt-2 text-2xl font-bold text-emerald-600">
            {activeProducts}
          </h2>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">
            Inactive Products
          </p>

          <h2 className="mt-2 text-2xl font-bold text-rose-600">
            {inactiveProducts}
          </h2>
        </div>

      </div>

      {/* Add / Edit Product Form */}
      {showForm && (
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">

          <div className="mb-5 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-slate-800">
                {editId ? "Edit Product" : "Add New Product"}
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Enter your product information and country-wise prices.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-800"
              aria-label="Close form"
            >
              <FiX size={20} />
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

              {/* Product Image */}
              <div className="md:col-span-2">
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Product Image
                </label>

                <div className="flex flex-col gap-4 sm:flex-row sm:items-start">

                  <div className="flex h-36 w-36 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-dashed border-slate-300 bg-slate-50">
                    {form.image ? (
                      <img
                        src={form.image}
                        alt="Product preview"
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="text-center text-slate-400">
                        <FiImage className="mx-auto mb-2" size={32} />
                        <span className="text-xs">
                          No image selected
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="space-y-3">
                    <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50">
                      <FiUpload size={17} />
                      Upload Image

                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="hidden"
                      />
                    </label>

                    {form.image && (
                      <button
                        type="button"
                        onClick={() =>
                          setForm((prev) => ({
                            ...prev,
                            image: "",
                          }))
                        }
                        className="ml-2 rounded-lg bg-rose-50 px-4 py-2.5 text-sm font-medium text-rose-600 transition hover:bg-rose-100"
                      >
                        Remove Image
                      </button>
                    )}

                    <p className="text-xs text-slate-500">
                      JPG, PNG, WEBP. Maximum image size: 1.4 MB.
                    </p>
                  </div>

                </div>
              </div>

              {/* Product Name */}
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Product Name *
                </label>

                <input
                  type="text"
                  placeholder="Enter product name"
                  className={inputClass}
                  value={form.name}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      name: e.target.value,
                    }))
                  }
                  required
                />
              </div>

              {/* Product Category */}
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Category *
                </label>

                <select
                  className={inputClass}
                  value={form.category}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      category: e.target.value,
                    }))
                  }
                  required
                >
                  <option value="">Select Category</option>

                  {categories.map((category) => (
                    <option
                      key={category._id}
                      value={category._id}
                    >
                      {category.name}
                    </option>
                  ))}
                </select>

                {categories.length === 0 && (
                  <p className="mt-1 text-xs text-amber-600">
                    No categories available. Create one below.
                  </p>
                )}
              </div>

              {/* Create New Category */}
              <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 md:col-span-2">
                <label className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-700">
                  <FiTag size={16} />
                  Create New Category
                </label>

                <div className="flex flex-col gap-3 sm:flex-row">
                  <input
                    type="text"
                    placeholder="Enter new category name"
                    className={inputClass}
                    value={newCategoryName}
                    onChange={(e) =>
                      setNewCategoryName(e.target.value)
                    }
                  />

                  <button
                    type="button"
                    onClick={handleCreateCategory}
                    disabled={
                      creatingCategory ||
                      !newCategoryName.trim()
                    }
                    className="inline-flex shrink-0 items-center justify-center gap-2 rounded-lg bg-slate-800 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <FiPlus size={17} />
                    {creatingCategory
                      ? "Creating..."
                      : "Add Category"}
                  </button>
                </div>

                <p className="mt-2 text-xs text-slate-500">
                  Create a category here and it will automatically be selected.
                </p>
              </div>

              {/* Country-wise Pricing */}
              <div className="rounded-xl border border-wine-100 bg-wine-50/40 p-4 md:col-span-2 sm:p-5">

                <div className="mb-4">
                  <h3 className="text-base font-semibold text-slate-800">
                    Country-wise Pricing
                  </h3>

                  <p className="mt-1 text-xs text-slate-500">
                    Set an independent selling price for each country.
                    No automatic currency conversion.
                  </p>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">

                  {countries.map((country) => (
                    <div key={country.code}>
                      <label className="mb-2 block text-sm font-medium text-slate-700">
                        {country.flag} {country.name}
                        <span className="ml-1 text-xs text-slate-400">
                          ({country.currency})
                        </span>

                        {country.code === "PK" && (
                          <span className="ml-1 text-rose-500">*</span>
                        )}
                      </label>

                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        placeholder={`Enter ${country.currency} price`}
                        className={inputClass}
                        value={form.prices[country.code]}
                        onChange={(e) =>
                          handlePriceChange(
                            country.code,
                            e.target.value
                          )
                        }
                        required={country.code === "PK"}
                      />

                      {country.code === "PK" && (
                        <p className="mt-1 text-xs text-slate-500">
                          Required base price
                        </p>
                      )}
                    </div>
                  ))}

                </div>

                <p className="mt-4 rounded-lg bg-white p-3 text-xs text-slate-500">
                  Leave a country's price empty if you do not want to
                  sell this product in that country.
                </p>

              </div>

              {/* Product Stock */}
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Stock Quantity (Optional)
                </label>

                <input
                  type="number"
                  min="0"
                  step="1"
                  placeholder="Leave empty if unknown"
                  className={inputClass}
                  value={form.stock}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      stock: e.target.value,
                    }))
                  }
                />

                <p className="mt-1 text-xs text-slate-500">
                  Available units. Empty means 0.
                </p>
              </div>

              {/* Product Description */}
              <div className="md:col-span-2">
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Product Description
                </label>

                <textarea
                  rows={4}
                  placeholder="Write product details, features and information..."
                  className={inputClass}
                  value={form.description}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                />
              </div>

              {/* Product Status */}
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Status
                </label>

                <select
                  className={inputClass}
                  value={form.status}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      status: e.target.value as Product["status"],
                    }))
                  }
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>

            </div>

            {/* Form Buttons */}
            <div className="mt-6 flex flex-wrap gap-3">
              <button
                type="submit"
                disabled={saving || creatingCategory}
                className="rounded-lg bg-wine-700 px-6 py-2.5 text-sm font-medium text-white transition hover:bg-wine-800 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {saving
                  ? "Saving..."
                  : editId
                    ? "Update Product"
                    : "Save Product"}
              </button>

              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="rounded-lg border border-slate-200 bg-white px-6 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-slate-50"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Products Table */}
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">

        {/* Table Heading */}
        <div className="flex flex-col gap-4 border-b border-slate-200 p-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-slate-800">
              All Products
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              View and manage your products and country prices.
            </p>
          </div>

          {/* Search */}
          <div className="relative w-full sm:max-w-xs">
            <FiSearch
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              size={18}
            />

            <input
              type="text"
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className={`${inputClass} pl-10`}
            />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">

            <thead className="bg-slate-50 text-xs uppercase text-slate-500">
              <tr>
                <th className="px-6 py-4 font-semibold">Product</th>
                <th className="px-6 py-4 font-semibold">Category</th>
                <th className="px-6 py-4 font-semibold">Country Prices</th>
                <th className="px-6 py-4 font-semibold">Stock</th>
                <th className="px-6 py-4 font-semibold">Status</th>
                <th className="px-6 py-4 text-right font-semibold">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">

              {loading && (
                <tr>
                  <td
                    colSpan={6}
                    className="px-6 py-12 text-center text-slate-500"
                  >
                    Loading products...
                  </td>
                </tr>
              )}

              {!loading &&
                filteredProducts.map((product) => (
                  <tr
                    key={product._id}
                    className="transition hover:bg-slate-50"
                  >

                    {/* Product Image and Name */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">

                        <div className="flex h-[100px] w-[100px] shrink-0 items-center justify-center overflow-hidden rounded-xl border border-slate-200 bg-slate-50">
                          {product.image ? (
                            <img
                              src={product.image}
                              alt={product.name}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <FiImage
                              size={30}
                              className="text-slate-400"
                            />
                          )}
                        </div>

                        <div className="min-w-0">
                          <p className="font-medium text-slate-800">
                            {product.name}
                          </p>

                          {product.description && (
                            <p className="mt-1 max-w-48 truncate text-xs text-slate-400">
                              {product.description}
                            </p>
                          )}
                        </div>

                      </div>
                    </td>

                    {/* Category */}
                    <td className="whitespace-nowrap px-6 py-4 text-slate-600">
                      {product.category?.name || "No Category"}
                    </td>

                    {/* Country Prices */}
                    <td className="min-w-64 px-6 py-4">
                      <div className="space-y-1.5">
                        {countries.map((country) => {
                          const price =
                            product.prices?.[country.code] ??
                            (country.code === "PK" ? product.price : undefined);

                          return (
                            <div
                              key={country.code}
                              className="flex items-center justify-between gap-4 text-xs"
                            >
                              <span className="text-slate-500">
                                {country.flag} {country.currency}
                              </span>

                              <span className="font-medium text-slate-700">
                                {price !== undefined
                                  ? Number(price).toLocaleString()
                                  : "Unavailable"}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </td>

                    {/* Stock */}
                    <td className="whitespace-nowrap px-6 py-4 text-slate-600">
                      {product.stock ?? 0}
                    </td>

                    {/* Status */}
                    <td className="whitespace-nowrap px-6 py-4">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-medium ${
                          product.status === "Active"
                            ? "bg-emerald-50 text-emerald-700"
                            : "bg-rose-50 text-rose-700"
                        }`}
                      >
                        {product.status}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="whitespace-nowrap px-6 py-4">
                      <div className="flex justify-end gap-2">

                        <button
                          type="button"
                          onClick={() => openEditForm(product)}
                          className="rounded-lg bg-wine-50 p-2 text-wine-700 transition hover:bg-wine-100"
                          title="Edit product"
                        >
                          <FiEdit2 size={16} />
                        </button>

                        <button
                          type="button"
                          onClick={() => handleDelete(product._id)}
                          className="rounded-lg bg-rose-50 p-2 text-rose-600 transition hover:bg-rose-100"
                          title="Delete product"
                        >
                          <FiTrash2 size={16} />
                        </button>

                      </div>
                    </td>

                  </tr>
                ))}

              {!loading && filteredProducts.length === 0 && (
                <tr>
                  <td
                    colSpan={6}
                    className="px-6 py-12 text-center text-slate-500"
                  >
                    No products found.
                  </td>
                </tr>
              )}

            </tbody>
          </table>
        </div>

        {/* Table Footer */}
        <div className="border-t border-slate-200 px-6 py-4 text-sm text-slate-500">
          Showing {filteredProducts.length} of {totalProducts} products
        </div>

      </div>
    </div>
  );
}
