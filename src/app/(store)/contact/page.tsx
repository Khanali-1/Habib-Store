
"use client";

import Link from "next/link";
import { useState, type FormEvent, type ChangeEvent } from "react";
import api from "@/lib/api";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [feedbackType, setFeedbackType] = useState<"success" | "error" | "">("");

  // Input ki value update karna
  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Form submit karna
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      setLoading(true);
      setFeedback("");
      setFeedbackType("");

      const response = await api.post("/contact", formData);

      if (response.data.success) {
        setFeedback(
          response.data.message || "Your message has been sent successfully!"
        );
        setFeedbackType("success");

        // Form empty karna
        setFormData({
          name: "",
          email: "",
          subject: "",
          message: "",
        });
      }
    } catch (error: unknown) {
      const err = error as {
        response?: {
          data?: {
            message?: string;
          };
        };
      };

      setFeedback(
        err.response?.data?.message ||
          "Something went wrong. Please try again."
      );
      setFeedbackType("error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white text-gray-900">

      {/* Hero Section */}
      <section className="bg-cream py-20 md:py-28 px-5 text-center">
        <p className="uppercase tracking-[4px] text-sm text-gray-500 mb-5">
          Get In Touch
        </p>

        <h1 className="text-4xl md:text-6xl font-serif mb-6">
          Contact Us
        </h1>

        <p className="max-w-xl mx-auto text-gray-600 leading-7">
          Have a question or need assistance? We're here to help.
          Get in touch with the H Stores team.
        </p>
      </section>

      {/* Contact Content */}
      <section className="max-w-7xl mx-auto px-5 md:px-10 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">

          {/* Contact Information */}
          <div>
            <p className="uppercase tracking-[3px] text-sm text-gray-500 mb-4">
              Contact Information
            </p>

            <h2 className="text-3xl md:text-4xl font-serif mb-6">
              We'd Love to Hear From You
            </h2>

            <p className="text-gray-500 leading-8 mb-10">
              Whether you have questions about our products,
              your orders, or anything else, our team is ready
              to answer all your questions.
            </p>

            <div className="space-y-8">

              <div className="flex gap-5 items-start">
                <div className="w-12 h-12 flex items-center justify-center bg-cream text-xl">
                  ✉
                </div>
                <div>
                  <h3 className="font-medium mb-2">Email Us</h3>
                  <p className="text-gray-500 text-sm">
                    support@hstores.com
                  </p>
                </div>
              </div>

              <div className="flex gap-5 items-start">
                <div className="w-12 h-12 flex items-center justify-center bg-cream text-xl">
                  ☎
                </div>
                <div>
                  <h3 className="font-medium mb-2">Call Us</h3>
                  <p className="text-gray-500 text-sm">
                    +92 XXX XXXXXXX
                  </p>
                </div>
              </div>

              <div className="flex gap-5 items-start">
                <div className="w-12 h-12 flex items-center justify-center bg-cream text-xl">
                  ◷
                </div>
                <div>
                  <h3 className="font-medium mb-2">Working Hours</h3>
                  <p className="text-gray-500 text-sm">
                    Monday - Saturday
                  </p>
                  <p className="text-gray-500 text-sm mt-1">
                    9:00 AM - 6:00 PM
                  </p>
                </div>
              </div>

            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-ivory border border-gray-100 p-7 md:p-10">

            <h2 className="text-2xl font-serif mb-3">
              Send Us a Message
            </h2>

            <p className="text-sm text-gray-500 mb-8">
              Fill out the form below and we'll get back to you.
            </p>

            <form onSubmit={handleSubmit} className="space-y-6">

              {/* Name */}
              <div>
                <label htmlFor="name" className="block text-sm mb-2">
                  Your Name
                </label>

                <input
                  id="name"
                  type="text"
                  name="name"
                  placeholder="Enter your name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  maxLength={80}
                  className="w-full bg-white border border-gray-200 px-4 py-4 outline-none focus:border-wine-700 transition"
                />
              </div>

              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm mb-2">
                  Email Address
                </label>

                <input
                  id="email"
                  type="email"
                  name="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  maxLength={150}
                  className="w-full bg-white border border-gray-200 px-4 py-4 outline-none focus:border-wine-700 transition"
                />
              </div>

              {/* Subject */}
              <div>
                <label htmlFor="subject" className="block text-sm mb-2">
                  Subject
                </label>

                <input
                  id="subject"
                  type="text"
                  name="subject"
                  placeholder="How can we help?"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  maxLength={150}
                  className="w-full bg-white border border-gray-200 px-4 py-4 outline-none focus:border-wine-700 transition"
                />
              </div>

              {/* Message */}
              <div>
                <label htmlFor="message" className="block text-sm mb-2">
                  Your Message
                </label>

                <textarea
                  id="message"
                  name="message"
                  rows={5}
                  placeholder="Write your message here..."
                  value={formData.message}
                  onChange={handleChange}
                  required
                  maxLength={3000}
                  className="w-full bg-white border border-gray-200 px-4 py-4 outline-none focus:border-wine-700 transition resize-none"
                />
              </div>

              {/* Feedback */}
              {feedback && (
                <div
                  role="status"
                  className={`p-4 text-sm ${
                    feedbackType === "success"
                      ? "bg-green-50 text-green-700 border border-green-200"
                      : "bg-red-50 text-red-700 border border-red-200"
                  }`}
                >
                  {feedback}
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-brand text-white py-4 uppercase tracking-[2px] text-sm hover:bg-wine-800 transition disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading ? "Sending Message..." : "Send Message"}
              </button>

            </form>
          </div>

        </div>
      </section>

      {/* Bottom Banner */}
      <section className="bg-wine-950 text-white py-16 px-5 text-center">
        <h2 className="text-3xl md:text-4xl font-serif mb-5">
          Thank You for Choosing H Stores
        </h2>

        <p className="text-gray-300 mb-8">
          Your style and satisfaction mean everything to us.
        </p>

        <Link
          href="/products"
          className="inline-block bg-white text-brand px-9 py-4 text-sm uppercase tracking-widest hover:bg-sand transition"
        >
          Explore Collections
        </Link>
      </section>

    </div>
  );
}
