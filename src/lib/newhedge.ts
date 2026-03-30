// =============================================================================
// NewHedge API client — Bitcoin on-chain metrics, normalization, and composite
// health scoring for the Cycle Compass.
//
// Base URL : https://newhedge.io/api/v2/metrics/{slug}/{field}?api_token=KEY
// Auth     : process.env.NEWHEDGE_API_KEY
// Caching  : Next.js ISR with revalidate = 14400 (4 hours)
// =============================================================================

const BASE = "https://newhedge.io/api/v2/metrics";
const API_KEY = () => process.env.NEWHEDGE_API_KEY ?? "";

// ---------------------------------------------------------------------------
// Interfaces
// ---------------------------------------------------------------------------

export interface MetricScore {
  name: string;
  slug: string;
  raw: number;
  percentile: number;
  change24h: number | null;
  ma7d: number;
  avgYearly: number;
  normMethod: "percentile" | "detrend" | "rolling4y" | "etf-special";
}

export interface CategoryScore {
  name: string;
  slug: string;
  metrics: MetricScore[];
  score: number;
  status: string;
  statusColor: string;
  description: string;
}

export interface CyclePhase {
  phase: string;
  confidence: number;
  description: string;
}

export interface MonthlyReturn {
  x: number;
  y: number;
  value: number;
  open_price: number;
  close_price: number;
}

export interface BitcoinVitals {
  categories: CategoryScore[];
  healthScore: number;
  cyclePhase: CyclePhase;
  monthlyReturns: MonthlyReturn[];
  fetchedAt: string;
}

// A single data point from NewHedge: [timestamp_ms, value]
type DataPoint = [number, number];

// ---------------------------------------------------------------------------
// Metric definitions
// ---------------------------------------------------------------------------

interface MetricDef {
  slug: string;
  field: string;
  name: string;
  normMethod: "percentile" | "detrend" | "rolling4y" | "etf-special";
  category: string;
}

const METRICS: MetricDef[] = [
  // --- Cyclical (full-history percentile) ---
  { slug: "mvrv-z-score", field: "mvrv_z", name: "MVRV Z-Score", normMethod: "percentile", category: "valuation" },
  { slug: "puell-multiple", field: "puell_multiple", name: "Puell Multiple", normMethod: "percentile", category: "miner-economics" },
  { slug: "reserve-risk", field: "reserve_risk", name: "Reserve Risk", normMethod: "percentile", category: "valuation" },
  { slug: "long-term-holder-sopr", field: "sopr_lth", name: "LTH SOPR", normMethod: "percentile", category: "holder-behavior" },
  { slug: "sharpe-ratio", field: "sharpe_1w", name: "Sharpe Ratio (1W)", normMethod: "percentile", category: "risk-signals" },
  { slug: "coin-days-destroyed", field: "coin_days_destroyed", name: "Coin Days Destroyed", normMethod: "percentile", category: "holder-behavior" },

  // --- Growth (detrend-then-percentile) ---
  { slug: "hashrate-vs-price", field: "hashrate", name: "Hashrate", normMethod: "detrend", category: "network-strength" },
  { slug: "network-difficulty", field: "network_difficulty", name: "Network Difficulty", normMethod: "detrend", category: "network-strength" },
  { slug: "total-futures-open-interest", field: "total_futures_open_interest", name: "Futures Open Interest", normMethod: "detrend", category: "institutional-flow" },
  { slug: "miner-revenue", field: "miner_revenue", name: "Miner Revenue", normMethod: "detrend", category: "miner-economics" },

  // --- Regime-shifting (rolling 4-year percentile) ---
  { slug: "active-addresses", field: "active_addresses", name: "Active Addresses", normMethod: "rolling4y", category: "network-strength" },
  { slug: "fees-per-transaction-usd", field: "fees_per_transaction_usd", name: "Fees per Tx", normMethod: "rolling4y", category: "network-strength" },

  // --- ETF flows (special) ---
  { slug: "spot-bitcoin-etf-flows", field: "ibit_etf_spot_flows_usd", name: "iShares ETF Flows", normMethod: "etf-special", category: "institutional-flow" },
  { slug: "spot-bitcoin-etf-flows", field: "fbtc_etf_spot_flows_usd", name: "Fidelity ETF Flows", normMethod: "etf-special", category: "institutional-flow" },
  { slug: "spot-bitcoin-etf-flows", field: "gbtc_etf_spot_flows_usd", name: "Grayscale ETF Flows", normMethod: "etf-special", category: "institutional-flow" },
  { slug: "spot-bitcoin-etf-flows", field: "arkb_etf_spot_flows_usd", name: "ARK ETF Flows", normMethod: "etf-special", category: "institutional-flow" },
  { slug: "spot-bitcoin-etf-flows", field: "bitb_etf_spot_flows_usd", name: "Bitwise ETF Flows", normMethod: "etf-special", category: "institutional-flow" },

  // --- Pi Cycle Top (special — full-history percentile) ---
  { slug: "pi-cycle-top-indicator", field: "dma_350_btc_2", name: "Pi Cycle Top (350DMA×2)", normMethod: "percentile", category: "risk-signals" },
];

// ---------------------------------------------------------------------------
// Fetch helper
// ---------------------------------------------------------------------------

/**
 * Fetch a single metric series from the NewHedge API.
 * Returns an array of [timestamp_ms, value] tuples (full history).
 */
export async function fetchNewHedgeMetric(
  slug: string,
  field: string,
): Promise<DataPoint[]> {
  const url = `${BASE}/${slug}/${field}?api_token=${API_KEY()}`;

  const res = await fetch(url, {
    next: { revalidate: 14400 },
  });

  if (!res.ok) {
    console.error(`[NewHedge] ${slug}/${field} → ${res.status} ${res.statusText}`);
    return [];
  }

  const json = await res.json();

  // The API returns either a top-level array or { data: [...] }
  const raw: unknown[] = Array.isArray(json) ? json : json?.data ?? json?.values ?? [];

  // Filter to valid [number, number] pairs
  return raw.filter(
    (d): d is DataPoint =>
      Array.isArray(d) && d.length >= 2 && typeof d[0] === "number" && typeof d[1] === "number",
  );
}

// ---------------------------------------------------------------------------
// Normalization helpers
// ---------------------------------------------------------------------------

/** Clamp a value to [0, 100]. */
function clamp(v: number): number {
  return Math.max(0, Math.min(100, v));
}

/**
 * Full-history percentile.
 * percentile = (count of values <= current) / total_count * 100
 */
export function computePercentile(data: DataPoint[], currentValue: number): number {
  const vals = data.map((d) => d[1]).filter((v) => Number.isFinite(v));
  if (vals.length === 0) return 50;
  const countBelow = vals.filter((v) => v <= currentValue).length;
  return clamp((countBelow / vals.length) * 100);
}

/**
 * Detrend-then-percentile (for growth metrics).
 * 1. Compute ratio = value / 365-day moving average for each point.
 * 2. Sample ~200 evenly-spaced historical ratios.
 * 3. Compute percentile of current ratio within that sample.
 *
 * Falls back to full-history percentile if fewer than 365 data points.
 */
export function computeDetrendedPercentile(
  data: DataPoint[],
  currentValue: number,
  maWindow = 365,
): number {
  if (data.length < maWindow) {
    // Fallback: not enough data for the MA
    return computePercentile(data, currentValue);
  }

  // Compute ratio (value / MA) for every point that has enough history
  const ratios: number[] = [];
  for (let i = maWindow - 1; i < data.length; i++) {
    let sum = 0;
    for (let j = i - maWindow + 1; j <= i; j++) {
      sum += data[j][1];
    }
    const ma = sum / maWindow;
    if (ma !== 0 && Number.isFinite(ma)) {
      ratios.push(data[i][1] / ma);
    }
  }

  if (ratios.length === 0) return 50;

  // Current ratio
  let currentMA = 0;
  for (let i = data.length - maWindow; i < data.length; i++) {
    currentMA += data[i][1];
  }
  currentMA /= maWindow;
  if (currentMA === 0 || !Number.isFinite(currentMA)) return 50;

  const currentRatio = currentValue / currentMA;

  // Sample ~200 evenly-spaced ratios for the distribution
  const sampleSize = Math.min(200, ratios.length);
  const step = ratios.length / sampleSize;
  const sampled: number[] = [];
  for (let i = 0; i < sampleSize; i++) {
    sampled.push(ratios[Math.floor(i * step)]);
  }

  const countBelow = sampled.filter((r) => r <= currentRatio).length;
  return clamp((countBelow / sampled.length) * 100);
}

/**
 * Rolling 4-year percentile (for regime-shifting metrics).
 * Uses only the last 1460 data points (~4 years).
 */
export function computeRollingPercentile(
  data: DataPoint[],
  currentValue: number,
  windowDays = 1460,
): number {
  const window = data.slice(-windowDays);
  if (window.length === 0) return 50;

  const vals = window.map((d) => d[1]).filter((v) => Number.isFinite(v));
  if (vals.length === 0) return 50;

  const countBelow = vals.filter((v) => v <= currentValue).length;
  return clamp((countBelow / vals.length) * 100);
}

/**
 * ETF special percentile.
 * 1. Compute rolling 7-day sums from all combined flow history.
 * 2. Compute percentile of current 7-day sum in that distribution.
 */
export function computeETFPercentile(
  allFlowsData: DataPoint[],
  currentWeekSum: number,
): number {
  if (allFlowsData.length < 7) return 50;

  // Compute rolling 7-day sums
  const sums: number[] = [];
  for (let i = 6; i < allFlowsData.length; i++) {
    let sum = 0;
    for (let j = i - 6; j <= i; j++) {
      sum += allFlowsData[j][1];
    }
    sums.push(sum);
  }

  if (sums.length === 0) return 50;

  const countBelow = sums.filter((s) => s <= currentWeekSum).length;
  return clamp((countBelow / sums.length) * 100);
}

// ---------------------------------------------------------------------------
// Comparison helpers
// ---------------------------------------------------------------------------

/**
 * 24-hour change: compares latest value to the value ~24h ago.
 * Returns null if not enough data.
 */
export function getChange24h(data: DataPoint[]): number | null {
  if (data.length < 2) return null;

  const latest = data[data.length - 1];
  const targetTs = latest[0] - 86_400_000; // 24h in ms

  // Find closest point to 24h ago
  let closest = data[0];
  let bestDiff = Math.abs(data[0][0] - targetTs);
  for (let i = data.length - 2; i >= 0; i--) {
    const diff = Math.abs(data[i][0] - targetTs);
    if (diff < bestDiff) {
      bestDiff = diff;
      closest = data[i];
    } else {
      break; // timestamps are sorted, so once diff grows we can stop
    }
  }

  if (closest[1] === 0) return null;
  return ((latest[1] - closest[1]) / Math.abs(closest[1])) * 100;
}

/**
 * Simple moving average of the last `window` data points.
 */
export function getMA(data: DataPoint[], window = 7): number {
  if (data.length === 0) return 0;
  const slice = data.slice(-window);
  const sum = slice.reduce((s, d) => s + d[1], 0);
  return sum / slice.length;
}

/**
 * Average value over the most recent ~365 data points.
 */
export function getYearlyAvg(data: DataPoint[]): number {
  if (data.length === 0) return 0;
  const slice = data.slice(-365);
  const sum = slice.reduce((s, d) => s + d[1], 0);
  return sum / slice.length;
}

// ---------------------------------------------------------------------------
// Category status mapping
// ---------------------------------------------------------------------------

interface StatusDef {
  label: string;
  color: string;
}

type CategoryStatusMap = { thresholds: [number, StatusDef][]; description: string };

const CATEGORY_STATUS: Record<string, CategoryStatusMap> = {
  valuation: {
    description: "Is Bitcoin cheap or expensive?",
    thresholds: [
      [25, { label: "Undervalued", color: "#22c55e" }],
      [60, { label: "Fair Value", color: "#3b82f6" }],
      [85, { label: "Elevated", color: "#f97316" }],
      [Infinity, { label: "Extreme", color: "#ef4444" }],
    ],
  },
  "network-strength": {
    description: "Is the network healthy?",
    thresholds: [
      [25, { label: "Weak", color: "#ef4444" }],
      [50, { label: "Stable", color: "#3b82f6" }],
      [75, { label: "Strong", color: "#22c55e" }],
      [Infinity, { label: "Surging", color: "#22c55e" }],
    ],
  },
  "miner-economics": {
    description: "Are miners profitable?",
    thresholds: [
      [20, { label: "Capitulation", color: "#ef4444" }],
      [45, { label: "Stressed", color: "#f97316" }],
      [70, { label: "Healthy", color: "#22c55e" }],
      [Infinity, { label: "Euphoric", color: "#f97316" }],
    ],
  },
  "holder-behavior": {
    description: "What are HODLers doing?",
    thresholds: [
      [30, { label: "Accumulating", color: "#22c55e" }],
      [60, { label: "Holding", color: "#3b82f6" }],
      [80, { label: "Distributing", color: "#f97316" }],
      [Infinity, { label: "Dumping", color: "#ef4444" }],
    ],
  },
  "institutional-flow": {
    description: "Is smart money buying?",
    thresholds: [
      [25, { label: "Outflows", color: "#ef4444" }],
      [50, { label: "Neutral", color: "#3b82f6" }],
      [75, { label: "Inflows", color: "#22c55e" }],
      [Infinity, { label: "Aggressive", color: "#22c55e" }],
    ],
  },
  "risk-signals": {
    description: "Are we near danger?",
    thresholds: [
      [30, { label: "Low Risk", color: "#22c55e" }],
      [60, { label: "Moderate", color: "#3b82f6" }],
      [80, { label: "Elevated", color: "#f97316" }],
      [Infinity, { label: "Critical", color: "#ef4444" }],
    ],
  },
};

function getStatus(categorySlug: string, score: number): StatusDef {
  const map = CATEGORY_STATUS[categorySlug];
  if (!map) return { label: "Unknown", color: "#6b7280" };
  for (const [threshold, status] of map.thresholds) {
    if (score < threshold) return status;
  }
  return map.thresholds[map.thresholds.length - 1][1];
}

// ---------------------------------------------------------------------------
// Cycle phase computation
// ---------------------------------------------------------------------------

/**
 * Derive cycle phase from valuation, holder behavior, and risk signal scores.
 *
 * Phases:
 *   Accumulation  — low valuation, holders accumulating, low risk
 *   Early Bull    — rising valuation, holders still holding, moderate risk
 *   Mid Bull      — elevated valuation, moderate distribution, rising risk
 *   Late Bull     — extreme valuation, active distribution, high risk
 *   Distribution  — high valuation combined with heavy selling
 *   Bear          — valuation declining, capitulation behavior
 */
function deriveCyclePhase(categories: CategoryScore[]): CyclePhase {
  const valueOf = (slug: string) => categories.find((c) => c.slug === slug)?.score ?? 50;

  const valuation = valueOf("valuation");
  const holder = valueOf("holder-behavior");
  const risk = valueOf("risk-signals");
  const avg = (valuation + holder + risk) / 3;

  if (avg < 25) {
    return {
      phase: "Accumulation",
      confidence: clamp(100 - avg * 2),
      description:
        "Bitcoin appears undervalued with long-term holders accumulating. Historically the best risk/reward entry zone.",
    };
  }
  if (avg < 40) {
    return {
      phase: "Early Bull",
      confidence: clamp(70 + (avg - 25) * 1.5),
      description:
        "Valuation is recovering and on-chain activity is expanding. Early stages of a new uptrend.",
    };
  }
  if (avg < 55) {
    return {
      phase: "Mid Bull",
      confidence: clamp(60 + (avg - 40)),
      description:
        "Market momentum is strong with healthy network growth. The trend is established but not yet overheated.",
    };
  }
  if (avg < 70) {
    return {
      phase: "Late Bull",
      confidence: clamp(55 + (avg - 55)),
      description:
        "Valuation is stretched and long-term holders are beginning to distribute. Caution warranted.",
    };
  }
  if (avg < 85) {
    return {
      phase: "Distribution",
      confidence: clamp(50 + (avg - 70) * 2),
      description:
        "Heavy selling by long-term holders with extreme valuation. Risk of major correction is elevated.",
    };
  }
  return {
    phase: "Bear",
    confidence: clamp(40 + (100 - avg)),
    description:
      "Market is overheated with extreme risk signals. Previous cycle peaks have shown similar readings.",
  };
}

// ---------------------------------------------------------------------------
// Monthly returns heatmap
// ---------------------------------------------------------------------------

async function fetchMonthlyReturns(): Promise<MonthlyReturn[]> {
  const url = `${BASE}/monthly-returns-heatmap/monthly_returns?api_token=${API_KEY()}`;

  const res = await fetch(url, { next: { revalidate: 14400 } });
  if (!res.ok) {
    console.error(`[NewHedge] monthly-returns-heatmap → ${res.status}`);
    return [];
  }

  const json = await res.json();
  const raw: unknown[] = Array.isArray(json) ? json : json?.data ?? [];

  return raw
    .filter(
      (d): d is MonthlyReturn =>
        typeof d === "object" &&
        d !== null &&
        "x" in d &&
        "y" in d &&
        "value" in d,
    )
    .map((d) => ({
      x: Number(d.x),
      y: Number(d.y),
      value: Number(d.value),
      open_price: Number((d as unknown as Record<string, unknown>).open_price ?? 0),
      close_price: Number((d as unknown as Record<string, unknown>).close_price ?? 0),
    }));
}

// ---------------------------------------------------------------------------
// Core: fetchBitcoinVitals
// ---------------------------------------------------------------------------

/**
 * Fetches ALL 18 metric endpoints in parallel, normalizes each value,
 * computes category scores, a composite health score, cycle phase, and
 * monthly returns heatmap data.
 */
export async function fetchBitcoinVitals(): Promise<BitcoinVitals> {
  // 1. Fetch all metric data in parallel
  const metricFetches = METRICS.map((m) =>
    fetchNewHedgeMetric(m.slug, m.field).then((data) => ({ def: m, data })),
  );

  const [metricResults, monthlyReturns] = await Promise.all([
    Promise.all(metricFetches),
    fetchMonthlyReturns(),
  ]);

  // 2. Identify ETF flow data — we need to combine them before scoring
  const etfFields = [
    "ibit_etf_spot_flows_usd",
    "fbtc_etf_spot_flows_usd",
    "gbtc_etf_spot_flows_usd",
    "arkb_etf_spot_flows_usd",
    "bitb_etf_spot_flows_usd",
  ];

  const etfDataSets = metricResults.filter((r) => etfFields.includes(r.def.field));

  // Merge all ETF flows into a single time-aligned series (sum per day)
  const etfCombined = mergeETFFlows(etfDataSets.map((e) => e.data));
  const etf7dSum = etfCombined.length >= 7
    ? etfCombined.slice(-7).reduce((s, d) => s + d[1], 0)
    : 0;
  const etfPercentile = computeETFPercentile(etfCombined, etf7dSum);

  // 3. Compute MetricScore for every metric
  const scoredMetrics: (MetricScore & { category: string })[] = metricResults.map((r) => {
    const { def, data } = r;
    const currentValue = data.length > 0 ? data[data.length - 1][1] : 0;

    let percentile: number;
    switch (def.normMethod) {
      case "percentile":
        percentile = computePercentile(data, currentValue);
        break;
      case "detrend":
        percentile = computeDetrendedPercentile(data, currentValue, 365);
        break;
      case "rolling4y":
        percentile = computeRollingPercentile(data, currentValue, 1460);
        break;
      case "etf-special":
        // All ETF funds share the same combined percentile
        percentile = etfPercentile;
        break;
      default:
        percentile = 50;
    }

    return {
      name: def.name,
      slug: `${def.slug}/${def.field}`,
      raw: currentValue,
      percentile,
      change24h: getChange24h(data),
      ma7d: getMA(data, 7),
      avgYearly: getYearlyAvg(data),
      normMethod: def.normMethod,
      category: def.category,
    };
  });

  // 4. Group metrics into categories and compute category scores
  const categoryOrder = [
    "valuation",
    "network-strength",
    "miner-economics",
    "holder-behavior",
    "institutional-flow",
    "risk-signals",
  ];

  const CATEGORY_NAMES: Record<string, string> = {
    valuation: "Valuation",
    "network-strength": "Network Strength",
    "miner-economics": "Miner Economics",
    "holder-behavior": "Holder Behavior",
    "institutional-flow": "Institutional Flow",
    "risk-signals": "Risk Signals",
  };

  const categories: CategoryScore[] = categoryOrder.map((catSlug) => {
    const catMetrics = scoredMetrics.filter((m) => m.category === catSlug);

    // For institutional flow, count the 5 ETF funds as ONE combined metric
    let effectivePercentiles: number[];
    if (catSlug === "institutional-flow") {
      const nonEtf = catMetrics.filter((m) => m.normMethod !== "etf-special");
      effectivePercentiles = [
        ...nonEtf.map((m) => m.percentile),
        etfPercentile, // single combined ETF score
      ];
    } else {
      effectivePercentiles = catMetrics.map((m) => m.percentile);
    }

    const score = effectivePercentiles.length > 0
      ? effectivePercentiles.reduce((a, b) => a + b, 0) / effectivePercentiles.length
      : 50;

    const status = getStatus(catSlug, score);
    const statusMap = CATEGORY_STATUS[catSlug];

    return {
      name: CATEGORY_NAMES[catSlug] ?? catSlug,
      slug: catSlug,
      metrics: catMetrics.map(({ category: _cat, ...rest }) => rest),
      score: Math.round(score * 10) / 10,
      status: status.label,
      statusColor: status.color,
      description: statusMap?.description ?? "",
    };
  });

  // 5. Composite health score = average of all 6 category scores
  const healthScore =
    Math.round(
      (categories.reduce((s, c) => s + c.score, 0) / categories.length) * 10,
    ) / 10;

  // 6. Cycle phase
  const cyclePhase = deriveCyclePhase(categories);

  return {
    categories,
    healthScore,
    cyclePhase,
    monthlyReturns,
    fetchedAt: new Date().toISOString(),
  };
}

// ---------------------------------------------------------------------------
// ETF flow merging
// ---------------------------------------------------------------------------

/**
 * Merge multiple ETF flow series into a single combined daily series.
 * Aligns by day (truncates timestamps to midnight) and sums values.
 */
function mergeETFFlows(series: DataPoint[][]): DataPoint[] {
  const dayMap = new Map<number, number>();

  for (const s of series) {
    for (const [ts, val] of s) {
      if (!Number.isFinite(val)) continue;
      // Truncate to day
      const day = Math.floor(ts / 86_400_000) * 86_400_000;
      dayMap.set(day, (dayMap.get(day) ?? 0) + val);
    }
  }

  return Array.from(dayMap.entries())
    .sort((a, b) => a[0] - b[0])
    .map(([ts, val]) => [ts, val] as DataPoint);
}
