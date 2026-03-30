"use client";

import { useState } from "react";

export default function MethodologySection() {
  const [open, setOpen] = useState(false);

  return (
    <div className="bg-white rounded-xl border border-card-border overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between p-5 md:p-6 text-left hover:bg-gray-50 transition-colors"
      >
        <h3 className="text-lg font-bold text-obsidian font-heading">
          How We Score
        </h3>
        <svg
          width="20"
          height="20"
          viewBox="0 0 20 20"
          className={`text-obsidian/40 transition-transform duration-300 ${
            open ? "rotate-180" : ""
          }`}
        >
          <path
            d="M5 7.5 L10 12.5 L15 7.5"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      <div
        className={`transition-all duration-300 ease-in-out overflow-hidden ${
          open ? "max-h-[2000px] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="px-5 md:px-6 pb-6 space-y-4 text-sm text-obsidian/70 leading-relaxed">
          <p className="font-bold text-obsidian text-base">
            How We Score Bitcoin&apos;s Health
          </p>
          <p>
            Every metric on this dashboard is scored from 0 to 100 — but not all
            Bitcoin data behaves the same way, so we normalize each metric
            according to how it actually moves.
          </p>

          <p>
            <span className="font-bold text-obsidian">Cyclical metrics</span>{" "}
            like MVRV Z-Score, Puell Multiple, and Reserve Risk naturally
            oscillate between highs and lows with each Bitcoin cycle. For these,
            we use{" "}
            <em>historical percentile ranking</em> — we compare today&apos;s
            reading against every reading in Bitcoin&apos;s history to see where
            it falls. A score of 75 means the current value is higher than 75%
            of all values ever recorded.
          </p>

          <p>
            <span className="font-bold text-obsidian">Growth metrics</span> like
            hashrate, network difficulty, and futures open interest tend to go up
            over time as Bitcoin matures. Comparing today&apos;s hashrate to
            2015 would be meaningless. Instead, we{" "}
            <em>detrend</em> the data first — we measure how far the current
            value deviates from its own 365-day moving average. Then we
            percentile-rank that deviation. This tells you whether growth is
            accelerating or slowing relative to its own trend, regardless of the
            absolute number.
          </p>

          <p>
            <span className="font-bold text-obsidian">
              Regime-shifting metrics
            </span>{" "}
            like active addresses and transaction fees go through structural
            level shifts — what was &quot;high&quot; in 2018 is &quot;low&quot;
            in 2025. For these, we use a{" "}
            <em>rolling 4-year percentile</em> — ranking today&apos;s value
            against only the last cycle&apos;s worth of data, so the score stays
            contextually relevant.
          </p>

          <p>
            The composite Bitcoin Health Score is the average across all six
            categories, each weighted equally. A score of 100 doesn&apos;t mean
            &quot;buy&quot; and 0 doesn&apos;t mean &quot;sell&quot; — it means
            Bitcoin&apos;s on-chain fundamentals are running at their historical
            extremes.
          </p>
        </div>
      </div>
    </div>
  );
}
