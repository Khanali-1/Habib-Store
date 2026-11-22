"use client";

import Link from "next/link";
import { useState } from "react";
import type { FormEvent, ChangeEvent } from "react";
import api from "@/lib/api";
import axios from "axios";

// Signup data interface
interface SignupData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

// Backend response interface
interface SignupResponse {
  message: string;
  user?: {
    _id: string;
    name: string;
    email: string;
  };
}

export default function RegisterPage() {

  const [formData, setFormData] = useState<SignupData>({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  // Handle input changes
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {

    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

  };

  // Signup form submit
  const signup = async (e: FormEvent<HTMLFormElement>) => {

    e.preventDefault();

    setMessage("");

    // Confirm password validation
    if (formData.password !== formData.confirmPassword) {
      setMessage("Passwords do not match!");
      return;
    }

    try {

      setLoading(true);

      // POST request to backend
      const response = await api.post<SignupResponse>(
        "/auth/register",
        {
          name: formData.name,
          email: formData.email,
          password: formData.password,
        }
      );

      // Backend response
      setMessage(response.data.message);

      console.log("Backend Response:", response.data);

      // Reset form
      setFormData({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
      });

    }

    catch (error: unknown) {

      if (axios.isAxiosError(error)) {

        setMessage(
          error.response?.data?.message || "Something went wrong!"
        );

      } else {

        setMessage("Unexpected error occurred!");

      }

    }

    finally {

      setLoading(false);

    }

  };

  return (
    <main className="min-h-screen bg-ivory px-5 py-12 sm:py-16">

      <div className="mx-auto grid max-w-5xl overflow-hidden bg-white shadow-xl md:grid-cols-2">

        {/* LEFT DESIGN */}
        <div className="relative hidden min-h-[750px] flex-col justify-between overflow-hidden bg-brand p-12 text-white md:flex">

          <div className="absolute inset-0 opacity-30">
            <img
              src="https://images.unsplash.com/photo-1445205170230-053b83016050?w=1000"
              alt="Fashion collection"
              className="h-full w-full object-cover"
            />
          </div>

          <div className="absolute inset-0 bg-wine-950/55" />

          <Link href="/" className="relative z-10 text-2xl font-extrabold">
            H Super<span className="text-wine-700">Store.</span>
          </Link>

          <div className="relative z-10">
            <p className="mb-4 text-[10px] uppercase tracking-[4px] text-gray-300">
              Join Our Community
            </p>

            <h1 className="font-serif text-5xl leading-tight">
              Your Style Journey Starts Here.
            </h1>

            <p className="mt-6 max-w-sm text-sm leading-7 text-gray-300">
              Create your account and explore fashion, lifestyle
              and exclusive collections made for you.
            </p>
          </div>

          <p className="relative z-10 text-[10px] tracking-[3px] text-gray-300">
            DISCOVER YOUR STYLE WITH H STORES
          </p>

        </div>

        {/* RIGHT REGISTER FORM */}
        <div className="flex items-center justify-center px-6 py-12 sm:px-12">

          <div className="w-full max-w-md">

            <Link
              href="/"
              className="mb-10 inline-block text-sm text-gray-400 transition hover:text-wine-700"
            >
              ← Back to Home
            </Link>

            <div className="mb-8">
              <p className="mb-3 text-[10px] font-semibold uppercase tracking-[3px] text-wine-700">
                Create Your Account
              </p>

              <h2 className="font-serif text-4xl text-brand">
                Join H Stores
              </h2>

              <p className="mt-3 text-sm text-gray-500">
                Create an account to enjoy a better shopping experience.
              </p>
            </div>

            <form onSubmit={signup} className="space-y-5">

              {/* FULL NAME */}
              <div>
                <label className="mb-2 block text-xs font-semibold text-gray-700">
                  Full Name
                </label>

                <input
                  type="text"
                  name="name"
                  placeholder="Enter your full name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  minLength={3}
                  className="h-12 w-full border border-gray-200 px-4 text-sm outline-none transition focus:border-wine-700"
                />
              </div>

              {/* EMAIL */}
              <div>
                <label className="mb-2 block text-xs font-semibold text-gray-700">
                  Email Address
                </label>

                <input
                  type="email"
                  name="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="h-12 w-full border border-gray-200 px-4 text-sm outline-none transition focus:border-wine-700"
                />
              </div>

              {/* PASSWORD */}
              <div>
                <label className="mb-2 block text-xs font-semibold text-gray-700">
                  Password
                </label>

                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="Create a password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    minLength={8}
                    className="h-12 w-full border border-gray-200 px-4 pr-12 text-sm outline-none transition focus:border-wine-700"
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-gray-400 hover:text-wine-700"
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </div>
              </div>

              {/* CONFIRM PASSWORD */}
              <div>
                <label className="mb-2 block text-xs font-semibold text-gray-700">
                  Confirm Password
                </label>

                <div className="relative">
                  <input
                    type={showConfirm ? "text" : "password"}
                    name="confirmPassword"
                    placeholder="Confirm your password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                    minLength={8}
                    className="h-12 w-full border border-gray-200 px-4 pr-12 text-sm outline-none transition focus:border-wine-700"
                  />

                  <button
                    type="button"
                    onClick={() => setShowConfirm(!showConfirm)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-gray-400 hover:text-wine-700"
                  >
                    {showConfirm ? "Hide" : "Show"}
                  </button>
                </div>
              </div>

              {/* TERMS */}
              <label className="flex cursor-pointer items-start gap-2 text-xs leading-5 text-gray-500">
                <input
                  type="checkbox"
                  required
                  className="mt-1 accent-wine-700"
                />
                <span>
                  I agree to the Terms & Conditions and Privacy Policy.
                </span>
              </label>

              {/* MESSAGE */}
              {message && (
                <p className="text-sm text-wine-700">
                  {message}
                </p>
              )}

              {/* SUBMIT */}
              <button
                type="submit"
                disabled={loading}
                className="h-12 w-full bg-brand text-xs font-semibold uppercase tracking-[2px] text-white transition duration-300 hover:bg-wine-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? "Creating Account..." : "Create Account"}
              </button>

            </form>

            <p className="mt-8 text-center text-sm text-gray-500">
              Already have an account?{" "}
              <Link
                href="/login"
                className="font-semibold text-wine-700 hover:underline"
              >
                Sign In
              </Link>
            </p>

            <p className="mt-10 text-center text-[10px] tracking-widest text-gray-400">
              © 2026 H SUPER STORE. ALL RIGHTS RESERVED.
            </p>

          </div>
        </div>

      </div>
    </main>
  );
}
