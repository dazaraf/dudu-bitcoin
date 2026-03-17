"use client";

import { useState } from "react";

interface MonthlyReturn {
  x: number;
  y: number;
  value: number;
  open_price: number;
  close_price: number;
}

interface MonthlyReturnsHeatmapProps {
  data: MonthlyReturn[];
}

const MONTHS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

function getCellColor(value: number): string {
  if (value === 0) return "#F7F7F7";
  if (value > 0) {
    const intensity = Math.min(value / 40, 1);
    const alpha = 0.2 + intensity * 0.8;
    return `rgba(34, 197, 94, ${alpha})`;
  }
  const intensity = Math.min(Math.abs(value) / 30, 1);
  const alpha = 0.2 + intensity * 0.8;
  return `rgba(239, 68, 68, ${alpha})`;
}

function getCellTextColor(value: number): string {
  const absVal = Math.abs(value);
  if (absVal > 15) return "rgba(255,255,255,0.95)";
  if (absVal > 5) return "rgba(255,255,255,0.85)";
  return "#0D0D0D";
}

export default function MonthlyReturnsHeatmap({ data }: MonthlyReturnsHeatmapProps) {
  const [tooltip, setTooltip] = useState<{
    x: number;
    y: number;
    entry: MonthlyReturn;
  } | null>(null);

  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  // Get last 6 years of data
  const allYears = [...new Set(data.map((d) => d.y))].sort((a, b) => a - b);
  const years = allYears.slice(-6);

  // Build lookup
  const lookup = new Map<string, MonthlyReturn>();
  for (const d of data) {
    lookup.set(`${d.y}-${d.x}`, d);
  }

  return (
    <div className="relative overflow-x-auto">
      <div className="min-w-[600px]">
        {/* Month headers */}
        <div className="grid grid-cols-[72px_repeat(12,1fr)] gap-1 mb-1">
          <div />
          {MONTHS.map((m) => (
            <div
              key={m}
              className="text-center text-xs font-medium text-fog py-2"
            >
              {m}
            </div>
          ))}
        </div>

        {/* Year rows */}
        {years.map((year) => (
          <div
            key={year}
            className="grid grid-cols-[72px_repeat(12,1fr)] gap-1 mb-1"
          >
            <div className="flex items-center text-sm font-semibold text-obsidian pr-2 justify-end">
              {year}
            </div>
            {Array.from({ length: 12 }, (_, monthIdx) => {
              const entry = lookup.get(`${year}-${monthIdx}`);
              const value = entry?.value ?? null;
              const isCurrentCell = year === currentYear && monthIdx === currentMonth;

              return (
                <div
                  key={monthIdx}
                  className={`relative aspect-[2/1] rounded flex items-center justify-center text-xs font-medium cursor-default transition-transform hover:scale-105 ${
                    isCurrentCell ? "ring-2 ring-primary ring-offset-1 ring-offset-white" : ""
                  }`}
                  style={{
                    backgroundColor:
                      value !== null ? getCellColor(value) : "#F7F7F7",
                    color:
                      value !== null ? getCellTextColor(value) : "#B0B0B0",
                  }}
                  onMouseEnter={(e) => {
                    if (entry) {
                      const rect = e.currentTarget.getBoundingClientRect();
                      setTooltip({
                        x: rect.left + rect.width / 2,
                        y: rect.top,
                        entry,
                      });
                    }
                  }}
                  onMouseLeave={() => setTooltip(null)}
                >
                  <span className="tabular-nums">
                    {value !== null
                      ? `${value > 0 ? "+" : ""}${value.toFixed(0)}%`
                      : ""}
                  </span>
                </div>
              );
            })}
          </div>
        ))}

        {/* Legend */}
        <div className="flex items-center justify-center gap-4 mt-4 text-xs text-fog">
          <div className="flex items-center gap-1.5">
            <span
              className="w-4 h-3 rounded"
              style={{ backgroundColor: "rgba(239, 68, 68, 0.7)" }}
            />
            Negative
          </div>
          <div className="flex items-center gap-1.5">
            <span
              className="w-4 h-3 rounded"
              style={{ backgroundColor: "rgba(34, 197, 94, 0.7)" }}
            />
            Positive
          </div>
        </div>
      </div>

      {/* Tooltip */}
      {tooltip && (
        <div
          className="fixed z-50 px-3 py-2 rounded-lg bg-obsidian text-white text-xs shadow-xl pointer-events-none -translate-x-1/2 -translate-y-full -mt-2"
          style={{
            left: tooltip.x,
            top: tooltip.y,
          }}
        >
          <p className="font-semibold">
            {MONTHS[tooltip.entry.x]} {tooltip.entry.y}
          </p>
          <p className="tabular-nums">
            Return:{" "}
            <span
              className={
                tooltip.entry.value >= 0 ? "text-green-400" : "text-red-400"
              }
            >
              {tooltip.entry.value > 0 ? "+" : ""}
              {tooltip.entry.value.toFixed(1)}%
            </span>
          </p>
          <p className="text-white/60 tabular-nums">
            ${tooltip.entry.open_price.toLocaleString()} &rarr; $
            {tooltip.entry.close_price.toLocaleString()}
          </p>
        </div>
      )}
    </div>
  );
}
