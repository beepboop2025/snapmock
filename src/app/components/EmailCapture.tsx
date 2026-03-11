"use client";

import { useState } from "react";
import { track } from "@vercel/analytics";
import { CONFIG } from "../config";

export default function EmailCapture() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const hasEndpoint = !!CONFIG.EMAIL_ENDPOINT;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !hasEndpoint) return;

    setStatus("loading");
    track("email_signup");

    try {
      await fetch(CONFIG.EMAIL_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      setStatus("success");
      setEmail("");
    } catch {
      setStatus("error");
    }
  };

  if (status === "success") {
    return (
      <section className="py-20 px-4 sm:px-6">
        <div className="max-w-xl mx-auto text-center fade-slide-in">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-emerald-500/10 border border-emerald-500/20 mb-4">
            <svg className="w-7 h-7 text-emerald-400 check-animate" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-white">You&apos;re in!</h3>
          <p className="text-white/40 mt-2">We&apos;ll notify you about new features and templates.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 px-4 sm:px-6">
      <div className="max-w-xl mx-auto text-center">
        <div className="w-12 h-12 rounded-xl bg-violet-500/10 border border-violet-500/15 flex items-center justify-center mx-auto mb-5">
          <svg className="w-6 h-6 text-violet-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-white mb-3">
          Get Notified About New Features
        </h2>
        <p className="text-white/35 mb-8">
          New backgrounds, frames, and export options coming soon. Be the first to know.
        </p>
        {hasEndpoint ? (
          <>
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                className="flex-1 px-4 py-3 bg-white/[0.03] border border-white/[0.06] rounded-xl text-sm text-white placeholder-white/25 focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500/30 transition-all duration-300"
              />
              <button
                type="submit"
                disabled={status === "loading"}
                className="btn-press px-6 py-3 bg-gradient-to-r from-violet-600 to-fuchsia-500 hover:from-violet-500 hover:to-fuchsia-400 text-white font-semibold rounded-xl disabled:from-white/5 disabled:to-white/5 disabled:text-white/25 transition-all duration-300 text-sm whitespace-nowrap hover:shadow-lg hover:shadow-violet-500/20"
              >
                {status === "loading" ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
                    Joining...
                  </span>
                ) : "Notify Me"}
              </button>
            </form>
            {status === "error" && (
              <p className="text-red-400 text-xs mt-2 fade-slide-in">Something went wrong. Please try again.</p>
            )}
            <p className="text-xs text-white/20 mt-3">No spam, ever. Unsubscribe anytime.</p>
          </>
        ) : (
          <p className="text-sm text-white/25 mt-4">Coming soon &mdash; check back later!</p>
        )}
      </div>
    </section>
  );
}
