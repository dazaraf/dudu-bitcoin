"use client";

import { useState, useEffect, FormEvent, ReactNode } from "react";
import { useSearchParams } from "next/navigation";

const COOKIE_NAME = "dudu_unlocked";
const COOKIE_DAYS = 90;

function setCookie(name: string, value: string, days: number) {
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  document.cookie = `${name}=${value};expires=${expires};path=/;SameSite=Lax`;
}

function getCookie(name: string): string | null {
  const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
  return match ? match[1] : null;
}

interface EmailGateProps {
  teaser: ReactNode;
  children: ReactNode;
}

export default function EmailGate({ teaser, children }: EmailGateProps) {
  const [unlocked, setUnlocked] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error" | "already"
  >("idle");
  const searchParams = useSearchParams();

  useEffect(() => {
    setMounted(true);

    // Auto-unlock from newsletter link
    if (searchParams.get("unlock") === "true") {
      setCookie(COOKIE_NAME, "1", COOKIE_DAYS);
      setUnlocked(true);
      return;
    }

    // Check existing cookie
    if (getCookie(COOKIE_NAME)) {
      setUnlocked(true);
    }
  }, [searchParams]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setStatus("loading");

    try {
      // Check if already subscribed
      const checkRes = await fetch("/api/check-subscriber", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const checkData = await checkRes.json();

      if (checkData.subscribed) {
        // Already a subscriber — unlock directly
        setCookie(COOKIE_NAME, "1", COOKIE_DAYS);
        setStatus("already");
        setTimeout(() => setUnlocked(true), 1500);
        return;
      }

      // New subscriber — subscribe via Kit
      const subRes = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (!subRes.ok) {
        const data = await subRes.json();
        throw new Error(data.error || "Subscription failed.");
      }

      setCookie(COOKIE_NAME, "1", COOKIE_DAYS);
      setStatus("success");
      setTimeout(() => setUnlocked(true), 2000);
    } catch {
      setStatus("error");
    }
  };

  // Server render: show teaser only
  if (!mounted) {
    return <>{teaser}</>;
  }

  if (unlocked) {
    return <>{children}</>;
  }

  return (
    <>
      {teaser}

      {/* Gate */}
      <div className="relative mt-8">
        {/* Fade overlay */}
        <div className="h-32 bg-gradient-to-b from-transparent to-white pointer-events-none -mt-32 relative z-10" />

        <div className="text-center py-12 px-4 border-t border-card-border">
          {status === "success" ? (
            <div className="flex flex-col items-center gap-2 text-green-600 font-medium">
              <svg
                className="w-8 h-8"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
              You&apos;re in! Unlocking the full report...
            </div>
          ) : status === "already" ? (
            <div className="flex flex-col items-center gap-2 text-primary font-medium">
              <span className="text-2xl">👋</span>
              Welcome back! Unlocking now...
            </div>
          ) : (
            <>
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-semibold uppercase tracking-wider mb-4">
                <svg
                  className="w-3.5 h-3.5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
                Premium Content
              </div>
              <h3 className="text-2xl font-bold text-obsidian mb-2">
                Read the full report
              </h3>
              <p className="text-fog text-sm mb-6 max-w-md mx-auto">
                Enter your email to unlock. Already subscribed? Just enter your
                email and we&apos;ll recognize you.
              </p>
              <form
                onSubmit={handleSubmit}
                className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
              >
                <label htmlFor="gate-email" className="sr-only">
                  Email address
                </label>
                <input
                  id="gate-email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@email.com"
                  className="flex-1 px-4 py-3 min-h-[44px] rounded-full bg-white border border-card-border text-obsidian placeholder:text-fog text-sm focus:outline-none focus:border-primary transition-colors"
                />
                <button
                  type="submit"
                  disabled={status === "loading"}
                  className="px-6 py-3 min-h-[44px] rounded-full bg-primary text-white font-semibold text-sm hover:brightness-110 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap cursor-pointer btn-glow"
                >
                  {status === "loading" ? (
                    <span className="flex items-center gap-2">
                      <svg
                        className="animate-spin w-4 h-4"
                        viewBox="0 0 24 24"
                        fill="none"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                        />
                      </svg>
                      Checking...
                    </span>
                  ) : (
                    "Unlock Report"
                  )}
                </button>
              </form>
              {status === "error" && (
                <p className="mt-3 text-sm text-red-500">
                  Something went wrong. Please try again.
                </p>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
}
