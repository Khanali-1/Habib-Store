"use client";

import Link from "next/link";
import { useState, type FormEvent, type ChangeEvent } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import api from "@/lib/api";

interface LoginForm {
  email: string;
  password: string;
}

interface LoginResponse {
  success?: boolean;
  message?: string;
  data?: {
    user?: {
      name?: string;
      email?: string;
      role?: "admin" | "customer";
    };
  };
}

export default function LoginPage() {
  const router = useRouter();

  const [form, setForm] = useState<LoginForm>({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    setError("");
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (!form.email.trim() || !form.password.trim()) {
      setError("Please enter your email and password.");
      return;
    }

    try {
      setLoading(true);

      const response = await api.post<LoginResponse>(
        "/auth/login",
        {
          email: form.email.trim(),
          password: form.password,
        }
      );

      const role = response.data.data?.user?.role;

      if (role !== "admin" && role !== "customer") {
        setError("User role not found. Please contact support.");
        return;
      }

      setSuccess(response.data.message || "Login successful!");

      setTimeout(() => {
        if (role === "admin") {
          router.push("/dashboard");
        } else {
          router.push("/");
        }

        router.refresh();
      }, 1000);

    } catch (err: unknown) {
      if (axios.isAxiosError<LoginResponse>(err)) {
        setError(
          err.response?.data?.message ||
          "Invalid email or password. Please try again."
        );
      } else {
        setError("Something went wrong. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-ivory flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">

        <div className="text-center mb-8">
          <Link
            href="/"
            className="text-3xl font-bold tracking-widest text-brand"
          >
            H<span className="text-red-600">.</span>STORE
          </Link>

          <h1 className="text-2xl font-semibold text-gray-900 mt-7">
            Welcome Back
          </h1>

          <p className="text-gray-500 text-sm mt-2">
            Login to your account to continue shopping.
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-7 sm:p-9">

          <form onSubmit={handleSubmit} className="space-y-5">

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Email Address
              </label>

              <input
                id="email"
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="Enter your email"
                autoComplete="email"
                className="w-full px-4 py-3 border border-gray-200 rounded-lg outline-none focus:border-wine-700 focus:ring-1 focus:ring-wine-700 transition"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700"
                >
                  Password
                </label>

                <Link
                  href="/forgot-password"
                  className="text-xs font-medium text-red-600 hover:text-red-700"
                >
                  Forgot Password?
                </Link>
              </div>

              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  className="w-full px-4 py-3 pr-16 border border-gray-200 rounded-lg outline-none focus:border-wine-700 focus:ring-1 focus:ring-wine-700 transition"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-medium text-gray-500 hover:text-wine-700"
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg px-4 py-3">
                {error}
              </div>
            )}

            {success && (
              <div className="bg-green-50 border border-green-200 text-green-700 text-sm rounded-lg px-4 py-3">
                {success}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-brand text-white py-3.5 rounded-lg font-semibold hover:bg-red-600 transition duration-300 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? "Logging in..." : "Login"}
            </button>

          </form>

          <div className="text-center mt-7">
            <p className="text-sm text-gray-500">
              Don't have an account?{" "}
              <Link
                href="/register"
                className="text-red-600 font-semibold hover:underline"
              >
                Create Account
              </Link>
            </p>
          </div>

        </div>

        <div className="text-center mt-6">
          <Link
            href="/"
            className="text-sm text-gray-500 hover:text-wine-700 transition"
          >
            ← Back to Home
          </Link>
        </div>

      </div>
    </div>
  );
}
