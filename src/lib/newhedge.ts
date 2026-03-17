// ─── NewHedge API Integration ───────────────────────────────────────────────
// Fetches on-chain / institutional metrics from NewHedge, normalises each
// to a 0-100 percentile via one of three statistical methods, groups them into
// 4 categories, and derives a composite health score + cycle phase.
// ISR revalidation: every 4 hours (14 400 s).

const NEWHEDGE_BASE = "https://newhedge.io/api/v2/metrics";

// ─── Colours ────────────────────────────────────────────────────────────────
const GREEN  = "#22c55e";
const BLUE   = "#3b82f6";
const YELLOW = "#eab308";
const ORANGE = "#f97316";
const RED    = "#ef4444";

// ─── Public interfaces ─────────────────────────────────────────────────────

export interface MetricScore {
  name: string;
  slug: string;
  raw: number;
  percentile: number;          // 0-100
  change24h: number | null;    // vs ~1 day ago
  ma7d: number;                // 7-point moving average
  avgYearly: number;           // 365-point average
  normMethod: "percentile" | "detrend" | "rolling4y" | "etf-special";
}

export interface CategoryScore {
  name: string;
  slug: string;
  question: string;
  metrics: MetricScore[];
  score: number;               // average of metric percentiles
  status: string;
  statusColor: string;
  description: string;
}

export interface CyclePhase {
  phase: "Accumulation" | "Early Bull" | "Mid Bull" | "Late Bull" | "Distribution" | "Capitulation";
  confidence: number;
  description: string;
}

export interface MonthlyReturn {
  x: number;          // monthIndex 0-11
  y: number;          // year
  value: number;      // percentage
  open_price: number;
  close_price: number;
}

export interface BitcoinVitals {
  categories: CategoryScore[];
  healthScore: number;         // 0-100
  cyclePhase: CyclePhase;
  monthlyReturns: MonthlyReturn[];
  fetchedAt: string;
}

// ─── Metric definitions ────────────────────────────────────────────────────

type NormMethod = "percentile" | "detrend" | "rolling4y" | "etf-special";

interface MetricDef {
  name: string;
  slug: string;
  field: string;
  norm: NormMethod;
}

const CYCLICAL_METRICS: MetricDef[] = [
  { name: "MVRV Z-Score",          slug: "mvrv-z-score",          field: "mvrv_z",              norm: "percentile" },
  { name: "Puell Multiple",        slug: "puell-multiple",        field: "puell_multiple",      norm: "percentile" },
  { name: "Reserve Risk",          slug: "reserve-risk",          field: "reserve_risk",        norm: "percentile" },
  { name: "LTH SOPR",             slug: "long-term-holder-sopr", field: "sopr_lth",            norm: "percentile" },
  { name: "Sharpe Ratio (1w)",     slug: "sharpe-ratio",          field: "sharpe_1w",           norm: "percentile" },
  { name: "Coin Days Destroyed",   slug: "coin-days-destroyed",   field: "coin_days_destroyed", norm: "percentile" },
  { name: "STH SOPR",              slug: "short-term-holder-sopr", field: "sopr_sth",            norm: "percentile" },
  { name: "Mayer Multiple",        slug: "mayer-multiple",         field: "mayer_multiple",      norm: "percentile" },
  { name: "Google Trends",         slug: "google-trends",          field: "google_trends",       norm: "percentile" },
  { name: "LTH Supply Change",    slug: "long-term-holder-supply-change", field: "supply_change_lth", norm: "percentile" },
];

const GROWTH_METRICS: MetricDef[] = [
  { name: "Hashrate",              slug: "hashrate-vs-price",              field: "hashrate",                     norm: "detrend" },
  { name: "Network Difficulty",    slug: "network-difficulty",             field: "network_difficulty",           norm: "detrend" },
  { name: "Futures Open Interest", slug: "total-futures-open-interest",    field: "total_futures_open_interest",  norm: "detrend" },
  { name: "Miner Revenue",         slug: "miner-revenue",                 field: "miner_revenue",                norm: "detrend" },
  { name: "Hash Price",            slug: "hashprice",                     field: "hashprice_usd",                norm: "detrend" },
];

const REGIME_METRICS: MetricDef[] = [
  { name: "Active Addresses",      slug: "active-addresses",              field: "active_addresses",             norm: "rolling4y" },
  { name: "Fees per Tx (USD)",     slug: "fees-per-transaction-usd",      field: "fees_per_transaction_usd",     norm: "rolling4y" },
];

const ETF_FIELDS = [
  "ibit_etf_spot_flows_usd",
  "fbtc_etf_spot_flows_usd",
  "gbtc_etf_spot_flows_usd",
  "arkb_etf_spot_flows_usd",
  "bitb_etf_spot_flows_usd",
] as const;

// ─── Time-series type ──────────────────────────────────────────────────────

type DataPoint = [number, number];   // [timestamp_ms, value]
type TimeSeries = DataPoint[];

// ─── Low-level fetcher ─────────────────────────────────────────────────────

export async function fetchNewHedgeMetric(
  slug: string,
  field: string,
): Promise<unknown | null> {
  const apiKey = process.env.NEWHEDGE_API_KEY;
  if (!apiKey) {
    console.error("[newhedge] NEWHEDGE_API_KEY is not set");
    return null;
  }
  const url = `${NEWHEDGE_BASE}/${slug}/${field}?api_token=${apiKey}`;
  try {
    const res = await fetch(url, { next: { revalidate: 14400 } });
    if (!res.ok) {
      console.error(`[newhedge] ${slug}/${field} → ${res.status} ${res.statusText}`);
      return null;
    }
    return await res.json();
  } catch (err) {
    console.error(`[newhedge] Failed to fetch ${slug}/${field}:`, err);
    return null;
  }
}

// ─── Helpers ───────────────────────────────────────────────────────────────

function asTimeSeries(data: unknown): TimeSeries {
  if (!Array.isArray(data)) return [];
  return data.filter(
    (p): p is DataPoint =>
      Array.isArray(p) && p.length >= 2 && typeof p[1] === "number" && !Number.isNaN(p[1]),
  );
}

function lastVal(ts: TimeSeries): number {
  return ts.length > 0 ? ts[ts.length - 1][1] : 0;
}

function clamp(v: number, lo: number, hi: number): number {
  return Math.max(lo, Math.min(hi, v));
}

/** Average of the last `n` values. */
function avgLastN(ts: TimeSeries, n: number): number {
  if (ts.length === 0) return 0;
  const slice = ts.slice(-n);
  return slice.reduce((s, p) => s + p[1], 0) / slice.length;
}

// ─── Normalisation functions ───────────────────────────────────────────────

/** Full-history percentile rank of the current value. */
function fullHistoryPercentile(ts: TimeSeries): number {
  if (ts.length < 2) return 50;
  const current = lastVal(ts);
  const values = ts.map((p) => p[1]);
  const countBelow = values.filter((v) => v <= current).length;
  return (countBelow / values.length) * 100;
}

/**
 * Detrend-then-percentile: ratio = current / 365d-SMA, percentile-ranked
 * against ~200 evenly-spaced historical samples.
 * Falls back to full-history percentile if fewer than 365 points.
 */
function detrendPercentile(ts: TimeSeries): number {
  if (ts.length < 365) return fullHistoryPercentile(ts);

  const current = lastVal(ts);

  // Current 365d SMA (last 365 points)
  const recentSlice = ts.slice(-365);
  const currentSMA = recentSlice.reduce((s, p) => s + p[1], 0) / recentSlice.length;
  if (currentSMA === 0) return 50;
  const currentRatio = current / currentSMA;

  // Build ~200 sampled ratios from history (each needs 365 points behind it)
  const sampleCount = 200;
  const startIdx = 365;                       // first index where a 365d window exists
  const endIdx = ts.length - 1;
  const step = Math.max(1, Math.floor((endIdx - startIdx) / sampleCount));

  const ratios: number[] = [];
  for (let i = startIdx; i <= endIdx; i += step) {
    const window = ts.slice(i - 365, i);
    const sma = window.reduce((s, p) => s + p[1], 0) / window.length;
    if (sma !== 0) ratios.push(ts[i][1] / sma);
  }

  if (ratios.length === 0) return 50;
  const countBelow = ratios.filter((r) => r <= currentRatio).length;
  return (countBelow / ratios.length) * 100;
}

/** Rolling 4-year (1460 point) percentile. */
function rolling4yPercentile(ts: TimeSeries): number {
  if (ts.length < 30) return 50;
  const window = ts.slice(-1460);
  const current = lastVal(ts);
  const countBelow = window.filter((p) => p[1] <= current).length;
  return (countBelow / window.length) * 100;
}

/** Normalise a single metric according to its method. */
function normalise(ts: TimeSeries, method: NormMethod): number {
  switch (method) {
    case "percentile":  return fullHistoryPercentile(ts);
    case "detrend":     return detrendPercentile(ts);
    case "rolling4y":   return rolling4yPercentile(ts);
    default:            return 50;
  }
}

// ─── Comparison helpers ────────────────────────────────────────────────────

/** Value from ~1 day ago (find nearest point ≥ 23h ago). */
function change24h(ts: TimeSeries): number | null {
  if (ts.length < 2) return null;
  const latest = ts[ts.length - 1];
  const oneDayMs = 23 * 60 * 60 * 1000;
  const cutoff = latest[0] - oneDayMs;
  // Walk backwards to find first point at or before cutoff
  for (let i = ts.length - 2; i >= 0; i--) {
    if (ts[i][0] <= cutoff) {
      const prev = ts[i][1];
      if (prev === 0) return null;
      return ((latest[1] - prev) / Math.abs(prev)) * 100;
    }
  }
  return null;
}

// ─── ETF special normalisation ─────────────────────────────────────────────

interface ETFResult {
  percentile: number;
  raw: number;       // current 7d sum
  change24h: number | null;
  ma7d: number;
  avgYearly: number;
}

function normaliseETFFlows(seriesArr: TimeSeries[]): ETFResult {
  // Sum daily flows across all ETFs, keyed by timestamp
  const dayMap = new Map<number, number>();
  for (const series of seriesArr) {
    for (const [ts, val] of series) {
      dayMap.set(ts, (dayMap.get(ts) ?? 0) + val);
    }
  }
  const sorted = Array.from(dayMap.entries()).sort((a, b) => a[0] - b[0]);
  if (sorted.length < 7) {
    return { percentile: 50, raw: 0, change24h: null, ma7d: 0, avgYearly: 0 };
  }

  // Build rolling 7d sums
  const rolling7d: number[] = [];
  for (let i = 6; i < sorted.length; i++) {
    let sum = 0;
    for (let j = i - 6; j <= i; j++) sum += sorted[j][1];
    rolling7d.push(sum);
  }

  const current7d = rolling7d[rolling7d.length - 1];
  const countBelow = rolling7d.filter((s) => s <= current7d).length;
  const percentile = (countBelow / rolling7d.length) * 100;

  // Helpers on combined daily series
  const combined: TimeSeries = sorted.map(([ts, val]) => [ts, val]);
  const ch = change24h(combined);
  const ma = avgLastN(combined, 7);
  const yearly = avgLastN(combined, 365);

  return { percentile, raw: current7d, change24h: ch, ma7d: ma, avgYearly: yearly };
}

// ─── Pi Cycle special ──────────────────────────────────────────────────────

/**
 * Pi Cycle Top: the 350DMA×2 line. When price approaches it from below,
 * risk is high. We percentile-rank the ratio (price / 350DMA×2):
 * closer to 1 ⇒ higher risk percentile.
 */
function normalisePiCycle(ts: TimeSeries): number {
  // The endpoint returns the 350DMA×2 values. Without the price series we
  // just percentile-rank the raw values — higher = closer to a top signal.
  return fullHistoryPercentile(ts);
}

// ─── Build a MetricScore from a time series ────────────────────────────────

function buildMetricScore(def: MetricDef, ts: TimeSeries): MetricScore {
  return {
    name: def.name,
    slug: def.slug,
    raw: lastVal(ts),
    percentile: clamp(Math.round(normalise(ts, def.norm)), 0, 100),
    change24h: change24h(ts),
    ma7d: avgLastN(ts, 7),
    avgYearly: avgLastN(ts, 365),
    normMethod: def.norm,
  };
}

// ─── Category definitions ──────────────────────────────────────────────────

interface CategoryDef {
  name: string;
  slug: string;
  question: string;
  statusBrackets: { threshold: number; label: string; color: string }[];
}

const CATEGORY_DEFS: CategoryDef[] = [
  {
    name: "Miner Economics",
    slug: "miner-economics",
    question: "Are miners profitable and secure?",
    statusBrackets: [
      { threshold: 20, label: "Capitulation", color: RED },
      { threshold: 45, label: "Stressed",     color: ORANGE },
      { threshold: 70, label: "Healthy",      color: BLUE },
      { threshold: 101, label: "Euphoric",    color: GREEN },
    ],
  },
  {
    name: "Holder Behavior",
    slug: "holder-behavior",
    question: "Are holders accumulating or selling?",
    statusBrackets: [
      { threshold: 30, label: "Accumulating",  color: GREEN },
      { threshold: 60, label: "Holding",       color: BLUE },
      { threshold: 80, label: "Distributing",  color: ORANGE },
      { threshold: 101, label: "Dumping",      color: RED },
    ],
  },
  {
    name: "Institutional Flow",
    slug: "institutional-flow",
    question: "Is institutional money entering or leaving?",
    statusBrackets: [
      { threshold: 25, label: "Outflows",    color: RED },
      { threshold: 50, label: "Neutral",     color: YELLOW },
      { threshold: 75, label: "Inflows",     color: BLUE },
      { threshold: 101, label: "Aggressive", color: GREEN },
    ],
  },
  {
    name: "Top Signals",
    slug: "top-signals",
    question: "How elevated is cycle-top risk?",
    statusBrackets: [
      { threshold: 30, label: "Low Risk",  color: GREEN },
      { threshold: 60, label: "Moderate",  color: BLUE },
      { threshold: 80, label: "Elevated",  color: ORANGE },
      { threshold: 101, label: "Critical", color: RED },
    ],
  },
];

function resolveStatus(
  score: number,
  brackets: CategoryDef["statusBrackets"],
): { status: string; statusColor: string } {
  for (const b of brackets) {
    if (score < b.threshold) return { status: b.label, statusColor: b.color };
  }
  const last = brackets[brackets.length - 1];
  return { status: last.label, statusColor: last.color };
}

function buildCategory(
  def: CategoryDef,
  metrics: MetricScore[],
): CategoryScore {
  const score = metrics.length > 0
    ? Math.round(metrics.reduce((s, m) => s + m.percentile, 0) / metrics.length)
    : 50;
  const { status, statusColor } = resolveStatus(score, def.statusBrackets);
  return {
    name: def.name,
    slug: def.slug,
    question: def.question,
    metrics,
    score,
    status,
    statusColor,
    description: `${def.name}: ${status} (${score}/100)`,
  };
}

// ─── Cycle phase computation ───────────────────────────────────────────────

function computeCyclePhase(categories: CategoryScore[]): CyclePhase {
  const avg = categories.length > 0
    ? categories.reduce((s, c) => s + c.score, 0) / categories.length
    : 50;

  // Map 0-100 composite to six phases
  if (avg < 15) {
    return {
      phase: "Capitulation",
      confidence: clamp(Math.round(90 - avg), 50, 95),
      description: "All indicators point to extreme undervaluation. Historically the best time to accumulate.",
    };
  }
  if (avg < 30) {
    return {
      phase: "Accumulation",
      confidence: clamp(Math.round(70 + (30 - avg)), 50, 95),
      description: "Smart money accumulation phase. Risk/reward strongly favours buyers.",
    };
  }
  if (avg < 45) {
    return {
      phase: "Early Bull",
      confidence: clamp(Math.round(65 + (45 - avg)), 50, 95),
      description: "Early bull market — momentum building. On-chain fundamentals confirm uptrend.",
    };
  }
  if (avg < 62) {
    return {
      phase: "Mid Bull",
      confidence: clamp(Math.round(60 + Math.abs(avg - 53)), 50, 95),
      description: "Mid-cycle bull run. Strong fundamentals but watch for overheating.",
    };
  }
  if (avg < 80) {
    return {
      phase: "Late Bull",
      confidence: clamp(Math.round(60 + (avg - 62)), 50, 95),
      description: "Late-stage bull market. Elevated risk — consider taking profits.",
    };
  }
  return {
    phase: "Distribution",
    confidence: clamp(Math.round(60 + (avg - 80)), 50, 95),
    description: "Distribution phase — smart money exiting. High risk of significant correction.",
  };
}

// ─── Main fetch: fetchBitcoinVitals ────────────────────────────────────────

export async function fetchBitcoinVitals(): Promise<BitcoinVitals> {
  // ── 1. Fire all 19 requests in parallel ──────────────────────────────────
  const allDefs = [...CYCLICAL_METRICS, ...GROWTH_METRICS, ...REGIME_METRICS];

  const [metricResults, etfResults, piCycleData, monthlyReturnsData] = await Promise.all([
    // Standard metrics (12)
    Promise.all(allDefs.map((d) => fetchNewHedgeMetric(d.slug, d.field))),
    // ETF flows (5)
    Promise.all(ETF_FIELDS.map((f) => fetchNewHedgeMetric("spot-bitcoin-etf-flows", f))),
    // Pi Cycle Top
    fetchNewHedgeMetric("pi-cycle-top-indicator", "dma_350_btc_2"),
    // Monthly returns
    fetchNewHedgeMetric("monthly-returns-heatmap", "monthly_returns"),
  ]);

  // ── 2. Convert raw responses to TimeSeries ───────────────────────────────
  const metricTS: TimeSeries[] = metricResults.map((r) => asTimeSeries(r));
  const etfTS: TimeSeries[] = etfResults.map((r) => asTimeSeries(r));
  const piCycleTS = asTimeSeries(piCycleData);

  // ── 3. Build MetricScores ────────────────────────────────────────────────
  const scores: MetricScore[] = allDefs.map((def, i) => buildMetricScore(def, metricTS[i]));

  // ETF combined metric
  const etf = normaliseETFFlows(etfTS);
  const etfMetric: MetricScore = {
    name: "ETF Flows (7d)",
    slug: "spot-bitcoin-etf-flows",
    raw: etf.raw,
    percentile: clamp(Math.round(etf.percentile), 0, 100),
    change24h: etf.change24h,
    ma7d: etf.ma7d,
    avgYearly: etf.avgYearly,
    normMethod: "etf-special",
  };

  // Pi Cycle metric
  const piMetric: MetricScore = {
    name: "Pi Cycle Top Proximity",
    slug: "pi-cycle-top-indicator",
    raw: lastVal(piCycleTS),
    percentile: clamp(Math.round(normalisePiCycle(piCycleTS)), 0, 100),
    change24h: change24h(piCycleTS),
    ma7d: avgLastN(piCycleTS, 7),
    avgYearly: avgLastN(piCycleTS, 365),
    normMethod: "percentile",
  };

  // ── 4. Index scores by slug for easy lookup ──────────────────────────────
  const bySlug = new Map<string, MetricScore>();
  for (const s of scores) bySlug.set(s.slug, s);
  bySlug.set(etfMetric.slug, etfMetric);
  bySlug.set(piMetric.slug, piMetric);

  const get = (slug: string): MetricScore =>
    bySlug.get(slug) ?? {
      name: slug, slug, raw: 0, percentile: 50,
      change24h: null, ma7d: 0, avgYearly: 0, normMethod: "percentile",
    };

  // ── 5. Assemble 4 categories ─────────────────────────────────────────────
  const categories: CategoryScore[] = [
    buildCategory(CATEGORY_DEFS[0], [
      get("hashrate-vs-price"),
      get("hashprice"),
      get("puell-multiple"),
      get("miner-revenue"),
    ]),
    buildCategory(CATEGORY_DEFS[1], [
      get("long-term-holder-sopr"),
      get("short-term-holder-sopr"),
      get("coin-days-destroyed"),
      get("long-term-holder-supply-change"),
    ]),
    buildCategory(CATEGORY_DEFS[2], [
      get("spot-bitcoin-etf-flows"),
      get("total-futures-open-interest"),
    ]),
    buildCategory(CATEGORY_DEFS[3], [
      get("pi-cycle-top-indicator"),
      get("mayer-multiple"),
      get("google-trends"),
    ]),
  ];

  // ── 6. Composite health score (average of 4 category scores) ─────────────
  const healthScore = Math.round(
    categories.reduce((s, c) => s + c.score, 0) / categories.length,
  );

  // ── 7. Monthly returns ───────────────────────────────────────────────────
  const monthlyReturns: MonthlyReturn[] = Array.isArray(monthlyReturnsData)
    ? (monthlyReturnsData as MonthlyReturn[])
    : [];

  // ── 8. Cycle phase ──────────────────────────────────────────────────────
  const cyclePhase = computeCyclePhase(categories);

  return {
    categories,
    healthScore,
    cyclePhase,
    monthlyReturns,
    fetchedAt: new Date().toISOString(),
  };
}
