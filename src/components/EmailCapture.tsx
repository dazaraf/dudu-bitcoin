"use client";

import { useState, FormEvent } from "react";

interface EmailCaptureProps {
  headline?: string;
  subtext?: string;
  buttonLabel?: string;
}

export default function EmailCapture({
  headline = "Stay in the loop",
  subtext = "No spam, just signal. One email per week.",
  buttonLabel = "Subscribe",
}: EmailCaptureProps) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

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
    } catch {
      setStatus("error");
    }
  };

  return (
    <div className="w-full max-w-xl mx-auto text-center">
      <h3 className="text-2xl md:text-3xl font-bold text-obsidian mb-2">
        {headline}
      </h3>
      <p className="text-sm text-fog mb-6">{subtext}</p>

      {status === "success" ? (
        <div className="flex items-center justify-center gap-2 text-green-600 font-medium py-3">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          You&apos;re in! Check your inbox (drafts &amp; spam as well) to confirm.
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
          <label htmlFor="email-capture-input" className="sr-only">Email address</label>
          <input
            id="email-capture-input"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@email.com"
            aria-label="Email address"
            className="flex-1 px-4 py-3 min-h-[44px] rounded-full bg-white border border-card-border text-obsidian placeholder:text-fog text-sm focus:outline-none focus:border-primary transition-colors"
          />
          <button
            type="submit"
            disabled={status === "loading"}
            className="px-6 py-3 min-h-[44px] rounded-full bg-primary text-white font-semibold text-sm hover:brightness-110 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap cursor-pointer btn-glow"
          >
            {status === "loading" ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Subscribing...
              </span>
            ) : (
              buttonLabel
            )}
          </button>
        </form>
      )}

      <div aria-live="polite" role="status">
        {status === "error" && (
          <p className="mt-3 text-sm text-red-500">Something went wrong. Please try again.</p>
        )}
      </div>
    </div>
  );
}
