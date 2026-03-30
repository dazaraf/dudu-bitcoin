"use client";

import { useMemo } from "react";
import type { MonthlyReturn } from "@/lib/newhedge";

interface MonthlyReturnsHeatmapProps {
  monthlyReturns: MonthlyReturn[];
}

const MONTH_LABELS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

function getCellColor(value: number): string {
  if (value === 0) return "#f5f5f5";

  // Clamp for color purposes
  const clamped = Math.max(-50, Math.min(50, value));

  if (clamped > 0) {
    // Green scale
    const intensity = Math.min(clamped / 40, 1);
    const r = Math.round(255 - intensity * 221);
    const g = Math.round(255 - intensity * 58);
    const b = Math.round(255 - intensity * 221);
    return `rgb(${r}, ${g}, ${b})`;
  } else {
    // Red scale
    const intensity = Math.min(Math.abs(clamped) / 40, 1);
    const r = Math.round(255 - intensity * 16);
    const g = Math.round(255 - intensity * 187);
    const b = Math.round(255 - intensity * 187);
    return `rgb(${r}, ${g}, ${b})`;
  }
}

function getTextColor(value: number): string {
  const abs = Math.abs(value);
  return abs > 20 ? "#ffffff" : "#1a1a1a";
}

export default function MonthlyReturnsHeatmap({ monthlyReturns }: MonthlyReturnsHeatmapProps) {
  const { years, grid } = useMemo(() => {
    // Group by year
    const yearSet = new Set<number>();
    const map = new Map<string, MonthlyReturn>();

    for (const r of monthlyReturns) {
      yearSet.add(r.x);
      map.set(`${r.x}-${r.y}`, r);
    }

    const sortedYears = Array.from(yearSet).sort((a, b) => b - a); // newest first

    const gridData = sortedYears.map((year) => ({
      year,
      months: Array.from({ length: 12 }, (_, i) => {
        const key = `${year}-${i + 1}`;
        return map.get(key) ?? null;
      }),
    }));

    return { years: sortedYears, grid: gridData };
  }, [monthlyReturns]);

  if (years.length === 0) {
    return <p className="text-obsidian/50 text-sm">No monthly returns data available.</p>;
  }

  return (
    <div className="overflow-x-auto -mx-5 px-5">
      <table className="w-full border-collapse min-w-[640px]">
        <thead>
          <tr>
            <th className="text-left text-xs font-semibold text-obsidian/50 py-2 px-1 w-16">
              Year
            </th>
            {MONTH_LABELS.map((m) => (
              <th
                key={m}
                className="text-center text-xs font-semibold text-obsidian/50 py-2 px-0.5"
              >
                {m}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {grid.map(({ year, months }) => (
            <tr key={year}>
              <td className="text-sm font-bold text-obsidian py-0.5 px-1 font-mono">
                {year}
              </td>
              {months.map((cell, i) => {
                if (!cell) {
                  return (
                    <td key={i} className="py-0.5 px-0.5">
                      <div className="w-full h-9 rounded bg-gray-50" />
                    </td>
                  );
                }
                const bg = getCellColor(cell.value);
                const fg = getTextColor(cell.value);
                return (
                  <td key={i} className="py-0.5 px-0.5">
                    <div
                      className="w-full h-9 rounded flex items-center justify-center text-[11px] font-semibold font-mono transition-colors"
                      style={{ backgroundColor: bg, color: fg }}
                      title={`${MONTH_LABELS[i]} ${year}: ${cell.value >= 0 ? "+" : ""}${cell.value.toFixed(1)}%`}
                    >
                      {cell.value >= 0 ? "+" : ""}
                      {cell.value.toFixed(0)}%
                    </div>
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
