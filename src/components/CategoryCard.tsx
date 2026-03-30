"use client";

import { useState } from "react";
import type { MetricScore } from "@/lib/newhedge";

interface CategoryCardProps {
  name: string;
  slug: string;
  metrics: MetricScore[];
  score: number;
  status: string;
  statusColor: string;
  description: string;
}

function formatRawValue(value: number, slug: string): string {
  // Handle special formatting based on metric characteristics
  const abs = Math.abs(value);
  if (abs >= 1_000_000_000) return `${(value / 1_000_000_000).toFixed(2)}B`;
  if (abs >= 1_000_000) return `${(value / 1_000_000).toFixed(2)}M`;
  if (abs >= 10_000) return `${(value / 1_000).toFixed(1)}K`;
  if (abs >= 1_000) return `${(value / 1_000).toFixed(2)}K`;
  if (abs < 0.001 && abs > 0) return value.toExponential(2);
  if (abs < 1) return value.toFixed(4);
  if (abs < 100) return value.toFixed(2);
  return value.toLocaleString("en-US", { maximumFractionDigits: 0 });
}

function getBarColor(percentile: number): string {
  if (percentile < 25) return "#ef4444";
  if (percentile < 50) return "#f97316";
  if (percentile < 75) return "#eab308";
  return "#22c55e";
}

function normMethodLabel(method: MetricScore["normMethod"]): string {
  switch (method) {
    case "percentile":
      return "Percentile";
    case "detrend":
      return "Detrended";
    case "rolling4y":
      return "Rolling 4Y";
    case "etf-special":
      return "ETF Special";
  }
}

function MiniGauge({ score, color }: { score: number; color: string }) {
  const size = 52;
  const strokeWidth = 5;
  const radius = (size - strokeWidth) / 2;
  const circumference = Math.PI * radius; // semicircle
  const offset = circumference - (score / 100) * circumference;
  const cx = size / 2;
  const cy = size / 2 + 4;

  const startAngle = Math.PI;
  const endAngle = 0;

  const x1 = cx + radius * Math.cos(startAngle);
  const y1 = cy - radius * Math.sin(startAngle);
  const x2 = cx + radius * Math.cos(endAngle);
  const y2 = cy - radius * Math.sin(endAngle);

  const sweepAngle = startAngle - (startAngle - endAngle) * (score / 100);
  const activeX = cx + radius * Math.cos(sweepAngle);
  const activeY = cy - radius * Math.sin(sweepAngle);
  const largeArc = score > 50 ? 1 : 0;

  return (
    <svg width={size} height={size / 2 + 10} viewBox={`0 0 ${size} ${size / 2 + 10}`}>
      <path
        d={`M ${x1} ${y1} A ${radius} ${radius} 0 1 1 ${x2} ${y2}`}
        fill="none"
        stroke="#e5e7eb"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      />
      {score > 0 && (
        <path
          d={`M ${x1} ${y1} A ${radius} ${radius} 0 ${largeArc} 1 ${activeX} ${activeY}`}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
        />
      )}
      <text
        x={cx}
        y={cy - 2}
        textAnchor="middle"
        className="fill-obsidian font-heading"
        style={{ fontSize: 14, fontWeight: 700 }}
      >
        {Math.round(score)}
      </text>
    </svg>
  );
}

export default function CategoryCard({
  name,
  metrics,
  score,
  status,
  statusColor,
  description,
}: CategoryCardProps) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div
      className="bg-white rounded-xl shadow-sm border border-card-border overflow-hidden"
      style={{ borderTopWidth: 4, borderTopColor: statusColor }}
    >
      <div className="p-5">
        {/* Header */}
        <div className="flex items-start justify-between mb-1">
          <div className="flex-1">
            <h3 className="text-lg font-bold text-obsidian font-heading">{name}</h3>
            <div className="flex items-center gap-2 mt-1">
              <span
                className="w-2 h-2 rounded-full inline-block"
                style={{ backgroundColor: statusColor }}
              />
              <span
                className="text-sm font-semibold"
                style={{ color: statusColor }}
              >
                {status}
              </span>
            </div>
            <p className="text-xs text-obsidian/50 mt-1">{description}</p>
          </div>
          <MiniGauge score={score} color={statusColor} />
        </div>

        {/* Metrics summary — always show first 2, rest on expand */}
        <div className="mt-4 space-y-3">
          {metrics.slice(0, expanded ? metrics.length : 2).map((m) => (
            <div key={m.slug} className="group">
              <div className="flex items-center justify-between text-sm">
                <span className="text-obsidian/80 font-medium truncate mr-2">
                  {m.name}
                </span>
                <div className="flex items-center gap-3 shrink-0">
                  <span className="text-obsidian font-semibold text-xs font-mono">
                    {formatRawValue(m.raw, m.slug)}
                  </span>
                  {m.change24h !== null && (
                    <span
                      className={`text-xs font-medium flex items-center gap-0.5 ${
                        m.change24h >= 0 ? "text-green-600" : "text-red-500"
                      }`}
                    >
                      <svg
                        width="10"
                        height="10"
                        viewBox="0 0 10 10"
                        className={m.change24h < 0 ? "rotate-180" : ""}
                      >
                        <path d="M5 1 L9 7 L1 7 Z" fill="currentColor" />
                      </svg>
                      {Math.abs(m.change24h).toFixed(1)}%
                    </span>
                  )}
                </div>
              </div>
              {/* Score bar */}
              <div className="mt-1 h-1 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-700"
                  style={{
                    width: `${Math.max(1, m.percentile)}%`,
                    backgroundColor: getBarColor(m.percentile),
                  }}
                />
              </div>
              {/* Norm method tag */}
              <div className="mt-0.5">
                <span className="text-[10px] text-obsidian/30 font-medium">
                  {normMethodLabel(m.normMethod)}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Expand/collapse button */}
        {metrics.length > 2 && (
          <button
            onClick={() => setExpanded(!expanded)}
            className="mt-3 text-xs font-medium text-primary hover:text-primary/80 transition-colors flex items-center gap-1"
          >
            {expanded ? "Show less" : `Show all ${metrics.length} metrics`}
            <svg
              width="12"
              height="12"
              viewBox="0 0 12 12"
              className={`transition-transform duration-200 ${expanded ? "rotate-180" : ""}`}
            >
              <path
                d="M3 4.5 L6 7.5 L9 4.5"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
}
