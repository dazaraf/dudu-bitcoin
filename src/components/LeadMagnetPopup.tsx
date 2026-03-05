"use client";

import { useState, useEffect, FormEvent } from "react";

const STORAGE_KEY = "dudu_lead_magnet_dismissed";

export default function LeadMagnetPopup() {
  const [visible, setVisible] = useState(false);
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  useEffect(() => {
    // Don't show if already dismissed this session
    if (typeof window !== "undefined" && sessionStorage.getItem(STORAGE_KEY)) {
      return;
    }

    const handleScroll = () => {
      const scrollPercent =
        window.scrollY / (document.documentElement.scrollHeight - window.innerHeight);

      if (scrollPercent >= 0.6) {
        setVisible(true);
        window.removeEventListener("scroll", handleScroll);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const dismiss = () => {
    setVisible(false);
    sessionStorage.setItem(STORAGE_KEY, "1");
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setStatus("loading");

    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Subscription failed.");
      }

      setStatus("success");
      setEmail("");
      setTimeout(dismiss, 3000);
    } catch {
      setStatus("error");
    }
  };

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-obsidian/60 backdrop-blur-sm"
        onClick={dismiss}
        role="presentation"
        aria-hidden="true"
      />

      {/* Card */}
      <div role="dialog" aria-modal="true" aria-label="Get the Agentic Economy Playbook" className="relative w-full max-w-md rounded-2xl border border-card-border bg-white p-8 shadow-2xl">
        {/* Dismiss */}
        <button
          type="button"
          onClick={dismiss}
          className="absolute top-4 right-4 text-fog hover:text-obsidian transition-colors cursor-pointer"
          aria-label="Close popup"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Content */}
        <div className="text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
            <svg className="w-7 h-7 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>

          <h3 className="text-xl font-bold text-obsidian mb-2">
            Get the Agentic Economy Playbook
          </h3>
          <p className="text-sm text-fog mb-6">
            Free guide: How founders are building distribution with AI agents.
            Frameworks, case studies, and actionable strategies.
          </p>

          {status === "success" ? (
            <div className="flex items-center justify-center gap-2 text-green-600 font-medium py-3">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              You&apos;re in! Check your inbox (drafts &amp; spam as well) to confirm.
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-3">
              <label htmlFor="lead-magnet-email" className="sr-only">Email address</label>
              <input
                id="lead-magnet-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@email.com"
                aria-label="Email address"
                className="w-full px-4 py-3 rounded-full bg-surface border border-card-border text-obsidian placeholder:text-fog text-sm focus:outline-none focus:border-primary transition-colors"
              />
              <button
                type="submit"
                disabled={status === "loading"}
                className="w-full px-6 py-3 rounded-full bg-primary text-white font-semibold text-sm hover:brightness-110 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                {status === "loading" ? "Sending..." : "Send Me the Playbook"}
              </button>
            </form>
          )}

          <div aria-live="polite" role="status">
            {status === "error" && (
              <p className="mt-3 text-sm text-red-500">Something went wrong. Please try again.</p>
            )}
          </div>

          <p className="mt-4 text-[11px] text-fog">
            No spam. Unsubscribe anytime.
          </p>
        </div>
      </div>
    </div>
  );
}
