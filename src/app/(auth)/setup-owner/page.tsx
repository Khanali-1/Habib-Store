"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface OwnerForm {
  name: string;
  email: string;
  password: string;
  setupKey: string;
}

export default function SetupOwnerPage() {
  const router = useRouter();

  const [form, setForm] = useState<OwnerForm>({
    name: "",
    email: "",
    password: "",
    setupKey: "",
  });

  const [loading, setLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");
  const [success, setSuccess] = useState<boolean>(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ): void => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ): Promise<void> => {
    e.preventDefault();

    setLoading(true);
    setMessage("");
    setSuccess(false);

    try {
      const response = await fetch("/api/owner/setup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const result: { message?: string } = await response.json();

      if (!response.ok) {
        throw new Error(
          result.message || "Owner account creation failed"
        );
      }

      setSuccess(true);
      setMessage("Owner account created successfully!");

      setForm({
        name: "",
        email: "",
        password: "",
        setupKey: "",
      });

      setTimeout(() => {
        router.push("/login");
      }, 2000);

    } catch (error: unknown) {
      setMessage(
        error instanceof Error
          ? error.message
          : "Something went wrong"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-100 p-5">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">

        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Create Store Owner
        </h1>

        <p className="text-gray-500 mb-7 text-sm">
          Set up your website's primary administrator account.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">

          <input
            type="text"
            name="name"
            placeholder="Owner Name"
            value={form.name}
            onChange={handleChange}
            required
            className="w-full border rounded-lg p-3 text-gray-900"
          />

          <input
            type="email"
            name="email"
            placeholder="Owner Email"
            value={form.email}
            onChange={handleChange}
            required
            className="w-full border rounded-lg p-3 text-gray-900"
          />

          <input
            type="password"
            name="password"
            placeholder="Create Password"
            value={form.password}
            onChange={handleChange}
            required
            minLength={8}
            className="w-full border rounded-lg p-3 text-gray-900"
          />

          <input
            type="password"
            name="setupKey"
            placeholder="Private Setup Key"
            value={form.setupKey}
            onChange={handleChange}
            required
            className="w-full border rounded-lg p-3 text-gray-900"
          />

          {message && (
            <p
              className={`text-sm ${
                success ? "text-green-600" : "text-red-600"
              }`}
            >
              {message}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-brand text-white rounded-lg p-3 font-medium disabled:opacity-50"
          >
            {loading
              ? "Creating Account..."
              : "Create Owner Account"}
          </button>

        </form>
      </div>
    </main>
  );
}
