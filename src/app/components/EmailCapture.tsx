"use client";

import { useState } from "react";
import { track } from "@vercel/analytics";
import { CONFIG } from "../config";

export default function EmailCapture() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setStatus("loading");
    track("email_signup");

    try {
      if (CONFIG.EMAIL_ENDPOINT) {
        // Submit to configured email service
        await fetch(CONFIG.EMAIL_ENDPOINT, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        });
      }
      // Always show success (even without endpoint — captures intent)
      setStatus("success");
      setEmail("");
    } catch {
      setStatus("error");
    }
  };

  if (status === "success") {
    return (
      <section className="py-16 px-4 sm:px-6">
        <div className="max-w-xl mx-auto text-center">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-green-100 mb-4">
            <svg className="w-7 h-7 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-gray-900">You&apos;re in!</h3>
          <p className="text-gray-500 mt-2">We&apos;ll notify you about new features and templates.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 px-4 sm:px-6">
      <div className="max-w-xl mx-auto text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-3">
          Get Notified About New Features
        </h2>
        <p className="text-gray-500 mb-6">
          New backgrounds, frames, and export options coming soon. Be the first to know.
        </p>
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            required
            className="flex-1 px-4 py-3 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
          />
          <button
            type="submit"
            disabled={status === "loading"}
            className="px-6 py-3 bg-violet-600 text-white font-semibold rounded-xl hover:bg-violet-700 disabled:bg-gray-300 transition-colors text-sm whitespace-nowrap"
          >
            {status === "loading" ? "Joining..." : "Notify Me"}
          </button>
        </form>
        {status === "error" && (
          <p className="text-red-500 text-xs mt-2">Something went wrong. Please try again.</p>
        )}
        <p className="text-xs text-gray-400 mt-3">No spam, ever. Unsubscribe anytime.</p>
      </div>
    </section>
  );
}
