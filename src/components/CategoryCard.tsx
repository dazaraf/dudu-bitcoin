"use client";

import type { CategoryScore, MetricScore } from "@/lib/newhedge";

/** Metric-aware number formatting for scannable display. */
function formatRaw(value: number, slug: string): string {
  switch (slug) {
    case "hashrate-vs-price":
      return `${(value / 1e18).toFixed(1)} EH/s`;
    case "active-addresses":
      return value >= 1_000_000
        ? `${(value / 1_000_000).toFixed(2)}M`
        : `${(value / 1_000).toFixed(0)}K`;
    case "miner-revenue":
      return value >= 1_000_000
        ? `$${(value / 1_000_000).toFixed(1)}M`
        : `$${(value / 1_000).toFixed(0)}K`;
    case "mvrv-z-score":
      return value.toFixed(2);
    case "reserve-risk":
      return value.toFixed(5);
    case "fees-per-transaction-usd":
      return `$${value.toFixed(2)}`;
    case "total-futures-open-interest":
      return value >= 1_000_000_000
        ? `$${(value / 1_000_000_000).toFixed(1)}B`
        : `$${(value / 1_000_000).toFixed(0)}M`;
    case "spot-bitcoin-etf-flows":
      return value >= 1_000_000_000 || value <= -1_000_000_000
        ? `$${(value / 1_000_000_000).toFixed(2)}B`
        : `$${(value / 1_000_000).toFixed(0)}M`;
    case "network-difficulty": {
      const abs = Math.abs(value);
      if (abs >= 1e12) return `${(value / 1e12).toFixed(2)}T`;
      if (abs >= 1e9) return `${(value / 1e9).toFixed(2)}B`;
      return value.toFixed(2);
    }
    case "puell-multiple":
    case "long-term-holder-sopr":
    case "sharpe-ratio":
      return value.toFixed(2);
    case "coin-days-destroyed": {
      const abs = Math.abs(value);
      if (abs >= 1_000_000_000) return `${(value / 1_000_000_000).toFixed(2)}B`;
      if (abs >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}M`;
      if (abs >= 1_000) return `${(value / 1_000).toFixed(0)}K`;
      return value.toFixed(0);
    }
    case "pi-cycle-top-indicator":
      return `$${value >= 1_000 ? (value / 1_000).toFixed(1) + "K" : value.toFixed(0)}`;
    default: {
      const abs = Math.abs(value);
      if (abs >= 1_000_000_000) return `${(value / 1_000_000_000).toFixed(2)}B`;
      if (abs >= 1_000_000) return `${(value / 1_000_000).toFixed(2)}M`;
      if (abs >= 1_000) return `${(value / 1_000).toFixed(2)}K`;
      if (abs >= 1) return value.toFixed(2);
      if (abs >= 0.001) return value.toFixed(4);
      return value.toFixed(6);
    }
  }
}

/** 5-zone percentile color: green >70, blue 50-70, yellow 30-50, orange 15-30, red <15. */
function percentileColor(p: number): string {
  if (p < 15) return "#ef4444";
  if (p < 30) return "#f97316";
  if (p < 50) return "#eab308";
  if (p < 70) return "#3b82f6";
  return "#22c55e";
}

function normLabel(method: MetricScore["normMethod"]): string {
  switch (method) {
    case "percentile": return "Percentile";
    case "detrend": return "Detrended";
    case "rolling4y": return "Rolling 4Y";
    case "etf-special": return "ETF";
  }
}

function MiniGauge({ score, color }: { score: number; color: string }) {
  const r = 14;
  const circ = 2 * Math.PI * r;
  const offset = circ * (1 - score / 100);
  return (
    <svg width="36" height="36" viewBox="0 0 36 36" className="flex-shrink-0">
      <circle cx="18" cy="18" r={r} fill="none" stroke="#E5E5E5" strokeWidth="3" />
      <circle
        cx="18"
        cy="18"
        r={r}
        fill="none"
        stroke={color}
        strokeWidth="3"
        strokeLinecap="round"
        strokeDasharray={circ}
        strokeDashoffset={offset}
        className="-rotate-90 origin-center"
      />
    </svg>
  );
}

export default function CategoryCard({
  name,
  question,
  metrics,
  score,
  status,
  statusColor,
  description,
}: CategoryScore) {
  return (
    <div
      className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden"
      style={{ borderTop: `4px solid ${statusColor}` }}
    >
      <div className="p-5">
        {/* Header row */}
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-base font-bold text-obsidian">{name}</h3>
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full bg-surface">
            <span
              className="w-2 h-2 rounded-full flex-shrink-0"
              style={{ backgroundColor: statusColor }}
            />
            <span style={{ color: statusColor }}>{status}</span>
          </span>
        </div>

        {/* Score + mini gauge */}
        <div className="flex items-center gap-3 mb-2">
          <span className="text-3xl font-bold text-obsidian tabular-nums">
            {score}
          </span>
          <MiniGauge score={score} color={statusColor} />
        </div>

        {/* Question */}
        <p className="text-sm italic text-fog mb-4">{question}</p>

        {/* Divider */}
        <div className="h-px bg-card-border mb-4" />

        {/* Metrics list */}
        <div className="space-y-3">
          {metrics.map((m) => (
            <MetricRow key={m.slug} metric={m} />
          ))}
        </div>

        {/* Description */}
        <p className="mt-4 text-xs text-fog leading-relaxed">{description}</p>
      </div>
    </div>
  );
}

function MetricRow({ metric }: { metric: MetricScore }) {
  const barColor = percentileColor(metric.percentile);

  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between gap-2">
        <span className="text-sm font-medium text-obsidian truncate">
          {metric.name}
        </span>
        <div className="flex items-center gap-2 flex-shrink-0">
          <span className="text-xs text-obsidian/70 tabular-nums">
            {formatRaw(metric.raw, metric.slug)}
          </span>
          <Change24h value={metric.change24h} />
          <span className="text-[10px] text-fog bg-surface rounded px-1.5 py-0.5">
            {normLabel(metric.normMethod)}
          </span>
        </div>
      </div>
      {/* Percentile bar */}
      <div className="w-full h-1 bg-surface rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{ width: `${metric.percentile}%`, backgroundColor: barColor }}
        />
      </div>
    </div>
  );
}

function Change24h({ value }: { value: number | null }) {
  if (value === null) {
    return <span className="text-xs text-fog tabular-nums">&mdash;</span>;
  }
  const isPositive = value > 0;
  return (
    <span
      className={`text-xs tabular-nums font-medium ${
        isPositive ? "text-green-500" : "text-red-500"
      }`}
    >
      {isPositive ? "\u25B2" : "\u25BC"}
      {Math.abs(value).toFixed(1)}%
    </span>
  );
}
