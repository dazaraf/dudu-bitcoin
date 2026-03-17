"use client";

import { useState } from "react";

export default function MethodologySection() {
  const [open, setOpen] = useState(false);

  return (
    <div className="max-w-[900px] mx-auto px-5 sm:px-6 py-12 md:py-16">
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full bg-surface rounded-xl px-6 py-5 flex items-center justify-between group cursor-pointer hover:bg-surface/80 transition-colors"
      >
        <h3 className="text-lg font-bold text-obsidian">
          How We Score Bitcoin&apos;s Health
        </h3>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={`text-fog transition-transform duration-300 ${
            open ? "rotate-180" : ""
          }`}
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      {open && (
        <div className="bg-surface rounded-b-xl px-6 pb-6 -mt-2 pt-4">
          <div className="prose prose-sm max-w-none text-obsidian/80 leading-relaxed space-y-4">
            <p>
              Every metric on this dashboard is scored from 0 to 100 — but not
              all Bitcoin data behaves the same way, so we normalize each metric
              according to how it actually moves.
            </p>

            <p>
              <strong className="text-obsidian">Cyclical metrics</strong> like
              MVRV Z-Score, Puell Multiple, and Reserve Risk naturally oscillate
              between highs and lows with each Bitcoin cycle. For these, we use{" "}
              <em>historical percentile ranking</em> — we compare today&apos;s
              reading against every reading in Bitcoin&apos;s history to see
              where it falls. A score of 75 means the current value is higher
              than 75% of all values ever recorded.
            </p>

            <p>
              <strong className="text-obsidian">Growth metrics</strong> like
              hashrate, network difficulty, and futures open interest tend to go
              up over time as Bitcoin matures. Comparing today&apos;s hashrate
              to 2015 would be meaningless. Instead, we <em>detrend</em> the
              data first — we measure how far the current value deviates from
              its own 365-day moving average. Then we percentile-rank that
              deviation. This tells you whether growth is accelerating or
              slowing relative to its own trend, regardless of the absolute
              number.
            </p>

            <p>
              <strong className="text-obsidian">Regime-shifting metrics</strong>{" "}
              like active addresses and transaction fees go through structural
              level shifts — what was &ldquo;high&rdquo; in 2018 is
              &ldquo;low&rdquo; in 2025. For these, we use a{" "}
              <em>rolling 4-year percentile</em> — ranking today&apos;s value
              against only the last cycle&apos;s worth of data, so the score
              stays contextually relevant.
            </p>

            <p>
              The composite Bitcoin Health Score is the average across all six
              categories, each weighted equally. A score of 100 doesn&apos;t
              mean &ldquo;buy&rdquo; and 0 doesn&apos;t mean &ldquo;sell&rdquo;
              — it means Bitcoin&apos;s on-chain fundamentals are running at
              their historical extremes.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
