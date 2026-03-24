"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import type { VitalSignsData } from "@/lib/newhedge";
import ShareButtons from "@/components/ShareButtons";

const CATEGORY_ICONS: Record<string, string> = {
  Valuation: "\u{1F4CA}",
  "Network Strength": "\u{1F310}",
  "Miner Economics": "\u26CF\uFE0F",
  "Holder Behavior": "\u{1F4B0}",
  "Institutional Flow": "\u{1F3E6}",
  "Risk Signals": "\u{1F6E1}\uFE0F",
};

function ScoreRing({ score, size = 140 }: { score: number; size?: number }) {
  const [animatedScore, setAnimatedScore] = useState(0);
  const radius = (size - 14) / 2;
  const circumference = 2 * Math.PI * radius;
  const displayScore = animatedScore;
  const offset = circumference - (displayScore / 100) * circumference;
  const color =
    score >= 70 ? "#16A34A" : score >= 40 ? "#F7931A" : "#DC2626";

  const glowColor =
    score >= 70
      ? "rgba(22, 163, 74, 0.25)"
      : score >= 40
        ? "rgba(247, 147, 26, 0.25)"
        : "rgba(220, 38, 38, 0.25)";

  useEffect(() => {
    const duration = 1000;
    const steps = 40;
    const stepTime = duration / steps;
    let current = 0;
    const timer = setInterval(() => {
      current++;
      const progress = current / steps;
      // ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setAnimatedScore(Math.round(eased * score));
      if (current >= steps) clearInterval(timer);
    }, stepTime);
    return () => clearInterval(timer);
  }, [score]);

  return (
    <div className="flex flex-col items-center">
      <div
        className="relative inline-flex items-center justify-center"
        style={{
          width: size,
          height: size,
          filter: `drop-shadow(0 0 16px ${glowColor})`,
        }}
      >
        <svg width={size} height={size} className="-rotate-90">
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="#F3F4F6"
            strokeWidth={12}
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth={12}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            className="transition-all duration-1000 ease-out"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span
            className="font-black leading-none"
            style={{ color, fontSize: size * 0.26 }}
          >
            {displayScore}
          </span>
        </div>
      </div>
      <span
        className="mt-2 text-xs font-bold uppercase tracking-widest"
        style={{ color }}
      >
        Composite Health
      </span>
    </div>
  );
}

function CategoryCard({
  name,
  score,
  status,
  statusColor,
  metrics,
  isExpanded,
  onToggle,
}: {
  name: string;
  score: number;
  status: string;
  statusColor: string;
  metrics: VitalSignsData["categories"][0]["metrics"];
  isExpanded: boolean;
  onToggle: () => void;
}) {
  const icon = CATEGORY_ICONS[name] || "\u{1F4C8}";

  return (
    <div
      className="bg-white rounded-xl border border-[#E5E5E5] overflow-hidden transition-all duration-200"
      style={{
        boxShadow: isExpanded
          ? "0 4px 24px rgba(0,0,0,0.06)"
          : "0 1px 3px rgba(0,0,0,0.04)",
      }}
      onMouseEnter={(e) => {
        if (!isExpanded)
          (e.currentTarget as HTMLElement).style.boxShadow =
            "0 4px 16px rgba(0,0,0,0.07)";
      }}
      onMouseLeave={(e) => {
        if (!isExpanded)
          (e.currentTarget as HTMLElement).style.boxShadow =
            "0 1px 3px rgba(0,0,0,0.04)";
      }}
    >
      {/* Header */}
      <button
        onClick={onToggle}
        className="w-full px-5 py-4 flex items-center justify-between cursor-pointer"
      >
        <div className="flex items-center gap-3">
          <div
            className="w-11 h-10 rounded-lg flex items-center justify-center font-black text-white shrink-0"
            style={{ backgroundColor: statusColor, fontSize: score >= 100 ? "0.875rem" : "1.125rem" }}
          >
            {score}
          </div>
          <div className="text-left">
            <h3 className="text-sm font-bold text-obsidian flex items-center gap-1.5">
              <span className="text-base" role="img" aria-label={name}>
                {icon}
              </span>
              {name}
            </h3>
            <span
              className="text-xs font-semibold"
              style={{ color: statusColor }}
            >
              {status}
            </span>
          </div>
        </div>
        {/* Progress bar + chevron */}
        <div className="flex items-center gap-3">
          <div className="w-24 h-2.5 bg-[#F3F4F6] rounded-full overflow-hidden hidden sm:block">
            <div
              className="h-full rounded-full transition-all duration-700"
              style={{
                width: `${score}%`,
                backgroundColor: statusColor,
              }}
            />
          </div>
          <svg
            className={`w-4 h-4 text-fog transition-transform duration-200 ${isExpanded ? "rotate-180" : ""}`}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </div>
      </button>

      {/* Expanded metrics */}
      {isExpanded && (
        <div className="px-5 pb-4 border-t border-[#EEEEEE]">
          <table className="w-full mt-3">
            <thead>
              <tr className="text-[10px] font-semibold text-fog uppercase tracking-wider">
                <th className="text-left pb-2">Metric</th>
                <th className="text-right pb-2">Value</th>
                <th className="text-right pb-2">Score</th>
                <th className="text-right pb-2 hidden sm:table-cell">24h</th>
                <th className="text-right pb-2 hidden sm:table-cell">7d Avg</th>
              </tr>
            </thead>
            <tbody>
              {metrics.map((m, i) => (
                <tr
                  key={i}
                  className="border-t border-[#F3F4F6]"
                  style={{
                    backgroundColor: i % 2 === 0 ? "transparent" : "#FAFAFA",
                  }}
                >
                  <td className="py-2.5 pl-2 text-sm font-medium text-obsidian rounded-l">
                    {m.label}
                  </td>
                  <td className="py-2.5 text-sm text-right font-mono text-fog">
                    {formatValue(m.value)}
                  </td>
                  <td className="py-2.5 text-right">
                    <span
                      className="inline-block min-w-[32px] px-2 py-0.5 rounded-full text-xs font-bold text-white text-center"
                      style={{
                        backgroundColor:
                          m.normalizedScore >= 70
                            ? "#16A34A"
                            : m.normalizedScore >= 40
                              ? "#F7931A"
                              : "#DC2626",
                      }}
                    >
                      {Math.round(m.normalizedScore)}
                    </span>
                  </td>
                  <td
                    className="py-2.5 text-right text-xs font-semibold hidden sm:table-cell"
                    style={{
                      color: m.change24h >= 0 ? "#16A34A" : "#DC2626",
                    }}
                  >
                    {m.change24h >= 0 ? "+" : ""}
                    {m.change24h.toFixed(1)}%
                  </td>
                  <td className="py-2.5 pr-2 text-right text-xs font-mono text-fog hidden sm:table-cell rounded-r">
                    {formatValue(m.avg7d)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function formatValue(v: number | null | undefined): string {
  if (v === null || v === undefined || isNaN(v)) return "\u2014";
  if (v === 0) return "0";
  if (Math.abs(v) >= 1e12) return (v / 1e12).toFixed(2) + "T";
  if (Math.abs(v) >= 1e9) return (v / 1e9).toFixed(2) + "B";
  if (Math.abs(v) >= 1e6) return (v / 1e6).toFixed(2) + "M";
  if (Math.abs(v) >= 1e3) return (v / 1e3).toFixed(1) + "K";
  if (Math.abs(v) < 0.01) return v.toExponential(2);
  if (Math.abs(v) < 1) return v.toFixed(4);
  return v.toFixed(2);
}

function formatTimestamp(iso: string): string {
  const d = new Date(iso);
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffMins = Math.floor(diffMs / 60000);

  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins}m ago`;

  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours}h ago`;

  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export default function VitalSignsClient({ data, canonicalUrl }: { data: VitalSignsData; canonicalUrl?: string }) {
  const [expanded, setExpanded] = useState<Set<number>>(new Set());

  const toggle = (i: number) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(i)) next.delete(i);
      else next.add(i);
      return next;
    });
  };

  const expandAll = () => {
    if (expanded.size === data.categories.length) {
      setExpanded(new Set());
    } else {
      setExpanded(new Set(data.categories.map((_, i) => i)));
    }
  };

  if (!data.dataAvailable) {
    return (
      <div className="max-w-3xl mx-auto">
        {/* Back link */}
        <div className="mb-6">
          <Link
            href="/content"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-fog hover:text-primary transition-colors"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            Back to Content
          </Link>
        </div>
        <div className="text-center py-16 px-6">
          <div className="w-16 h-16 rounded-full bg-[#F3F4F6] flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8 text-fog"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"
              />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-obsidian mb-2">
            Data temporarily unavailable
          </h2>
          <p className="text-sm text-fog max-w-md mx-auto">
            On-chain metrics could not be loaded right now. This usually
            resolves within a few minutes. Please check back shortly.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      {/* Back link */}
      <div className="mb-8">
        <Link
          href="/content"
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-fog hover:text-primary transition-colors"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          Back to Content
        </Link>
      </div>

      {/* Composite score + BTC price */}
      <div className="text-center mb-10">
        <ScoreRing score={data.compositeScore} />
        {data.btcPrice > 0 && (
          <p className="mt-4 text-sm text-fog">
            BTC{" "}
            <span className="font-bold text-obsidian text-base">
              ${data.btcPrice.toLocaleString()}
            </span>
          </p>
        )}
        <p className="text-xs text-fog/60 mt-1.5 flex items-center justify-center gap-1.5">
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#16A34A] animate-pulse" />
          Updated {formatTimestamp(data.lastUpdated)}
        </p>
      </div>

      {/* Expand/collapse all */}
      <div className="flex justify-end mb-3">
        <button
          onClick={expandAll}
          className="text-xs font-semibold text-primary hover:underline cursor-pointer"
        >
          {expanded.size === data.categories.length
            ? "Collapse all"
            : "Expand all"}
        </button>
      </div>

      {/* Category cards */}
      <div className="space-y-3 mb-12">
        {data.categories.map((cat, i) => (
          <CategoryCard
            key={cat.name}
            name={cat.name}
            score={cat.score}
            status={cat.status}
            statusColor={cat.statusColor}
            metrics={cat.metrics}
            isExpanded={expanded.has(i)}
            onToggle={() => toggle(i)}
          />
        ))}
      </div>

      {/* Methodology */}
      <details className="mb-12 bg-white rounded-xl border border-[#E5E5E5] overflow-hidden">
        <summary className="px-5 py-4 text-sm font-bold text-obsidian cursor-pointer hover:bg-[#FAFAFA] transition-colors">
          How We Score Bitcoin&apos;s Health
        </summary>
        <div className="px-5 pb-5 text-sm text-fog leading-relaxed space-y-3">
          <p>
            Every metric is scored from 0 to 100 using normalization methods
            matched to how each metric actually behaves.
          </p>
          <p>
            <strong className="text-obsidian">Cyclical metrics</strong> (MVRV,
            Puell, Reserve Risk) use historical percentile ranking — comparing
            today&apos;s reading against every reading in Bitcoin&apos;s
            history.
          </p>
          <p>
            <strong className="text-obsidian">Growth metrics</strong>{" "}
            (hashrate, difficulty, futures OI) are detrended first — we
            measure how far the current value deviates from its 365-day
            moving average, then percentile-rank that deviation.
          </p>
          <p>
            <strong className="text-obsidian">Regime-shifting metrics</strong>{" "}
            (active addresses, fees) use a rolling 4-year percentile, so the
            score stays contextually relevant.
          </p>
          <p>
            The composite Health Score is the equal-weight average of all six
            categories. A score of 100 doesn&apos;t mean &ldquo;buy&rdquo;
            — it means Bitcoin&apos;s on-chain fundamentals are at their
            historical extremes.
          </p>
        </div>
      </details>

      {/* Share */}
      <div className="mb-8">
        <ShareButtons
          title="Bitcoin Vital Signs"
          url={canonicalUrl}
          tweetText={`Bitcoin Health Score: ${data.compositeScore}/100\n\nValuation: ${data.categories[0]?.status}\nNetwork: ${data.categories[1]?.status}\nMiners: ${data.categories[2]?.status}\nHolders: ${data.categories[3]?.status}\nInstitutional: ${data.categories[4]?.status}\nRisk: ${data.categories[5]?.status}\n\nLive dashboard by @dudu_bitcoin`}
        />
      </div>
    </div>
  );
}
