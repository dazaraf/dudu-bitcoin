const API_BASE = "https://newhedge.io/api/v2/metrics";

type DataPoint = [number, number]; // [timestamp_ms, value]

interface MetricConfig {
  slug: string;
  field: string;
  label: string;
  normalization: "full" | "detrend" | "rolling4y" | "etf";
}

interface MetricResult {
  label: string;
  value: number | null;
  normalizedScore: number; // 0-100
  change24h: number; // percentage
  avg7d: number | null;
  avgYearly: number | null;
}

interface CategoryResult {
  name: string;
  score: number; // 0-100
  status: string;
  statusColor: string;
  metrics: MetricResult[];
}

export interface VitalSignsData {
  compositeScore: number;
  categories: CategoryResult[];
  btcPrice: number;
  lastUpdated: string;
  dataAvailable: boolean;
}

// All 18 metrics organized by category
const CATEGORIES: {
  name: string;
  metrics: MetricConfig[];
  statusLabels: [string, string, string, string];
  statusThresholds: [number, number, number]; // boundaries between labels
  invertRisk?: boolean;
}[] = [
  {
    name: "Valuation",
    metrics: [
      { slug: "mvrv-z-score", field: "mvrv_z", label: "MVRV Z-Score", normalization: "full" },
      { slug: "reserve-risk", field: "reserve_risk", label: "Reserve Risk", normalization: "full" },
    ],
    statusLabels: ["Undervalued", "Fair Value", "Elevated", "Extreme"],
    statusThresholds: [25, 60, 85],
  },
  {
    name: "Network Strength",
    metrics: [
      { slug: "active-addresses", field: "active_addresses", label: "Active Addresses", normalization: "rolling4y" },
      { slug: "hashrate-vs-price", field: "hashrate", label: "Hashrate", normalization: "detrend" },
      { slug: "network-difficulty", field: "network_difficulty", label: "Difficulty", normalization: "detrend" },
      { slug: "fees-per-transaction-usd", field: "fees_per_transaction_usd", label: "Fees/Tx", normalization: "rolling4y" },
    ],
    statusLabels: ["Weak", "Stable", "Strong", "Surging"],
    statusThresholds: [25, 50, 75],
  },
  {
    name: "Miner Economics",
    metrics: [
      { slug: "puell-multiple", field: "puell_multiple", label: "Puell Multiple", normalization: "full" },
      { slug: "miner-revenue", field: "miner_revenue", label: "Miner Revenue", normalization: "detrend" },
    ],
    statusLabels: ["Capitulation", "Stressed", "Healthy", "Euphoric"],
    statusThresholds: [20, 45, 70],
  },
  {
    name: "Holder Behavior",
    metrics: [
      { slug: "long-term-holder-sopr", field: "sopr_lth", label: "LTH SOPR", normalization: "full" },
      { slug: "coin-days-destroyed", field: "coin_days_destroyed", label: "Coin Days Destroyed", normalization: "full" },
    ],
    statusLabels: ["Accumulating", "Holding", "Distributing", "Dumping"],
    statusThresholds: [30, 60, 80],
  },
  {
    name: "Institutional Flow",
    metrics: [
      { slug: "total-futures-open-interest", field: "total_futures_open_interest", label: "Futures OI", normalization: "detrend" },
    ],
    statusLabels: ["Outflows", "Neutral", "Inflows", "Aggressive"],
    statusThresholds: [25, 50, 75],
  },
  {
    name: "Risk Signals",
    metrics: [
      { slug: "sharpe-ratio", field: "sharpe_1w", label: "Sharpe Ratio", normalization: "full" },
    ],
    statusLabels: ["Low Risk", "Moderate", "Elevated", "Critical"],
    statusThresholds: [30, 60, 80],
    invertRisk: true,
  },
];

async function fetchMetric(slug: string, field: string): Promise<DataPoint[]> {
  const apiKey = process.env.NEWHEDGE_API_KEY;
  if (!apiKey) {
    console.warn(`[vital-signs] NEWHEDGE_API_KEY is not set — skipping ${slug}/${field}`);
    return [];
  }
  try {
    const res = await fetch(`${API_BASE}/${slug}/${field}?api_token=${apiKey}`, {
      next: { revalidate: 3600 }, // cache 1 hour
    });
    if (!res.ok) {
      console.error(`[vital-signs] ${slug}/${field} returned HTTP ${res.status}`);
      return [];
    }
    const data = await res.json();
    // Filter out null/NaN values
    return (data as DataPoint[]).filter(
      ([, v]) => v !== null && !isNaN(v) && isFinite(v)
    );
  } catch (err) {
    console.error(`[vital-signs] ${slug}/${field} fetch failed:`, err);
    return [];
  }
}

function percentile(values: number[], current: number): number {
  const below = values.filter((v) => v <= current).length;
  return (below / values.length) * 100;
}

function normalizeMetric(
  data: DataPoint[],
  method: MetricConfig["normalization"]
): number {
  if (data.length < 30) return 50; // not enough data

  const values = data.map(([, v]) => v);
  const current = values[values.length - 1];

  switch (method) {
    case "full":
      return percentile(values, current);

    case "detrend": {
      // value / 365d MA, then percentile that ratio
      const ma365Window = 365;
      if (values.length < ma365Window + 10) return percentile(values, current);
      const ratios: number[] = [];
      for (let i = ma365Window; i < values.length; i++) {
        const maSlice = values.slice(i - ma365Window, i);
        const ma = maSlice.reduce((a, b) => a + b, 0) / ma365Window;
        if (ma > 0) ratios.push(values[i] / ma);
      }
      const maRecent = values.slice(-ma365Window);
      const currentMa = maRecent.reduce((a, b) => a + b, 0) / ma365Window;
      const currentRatio = currentMa > 0 ? current / currentMa : 1;
      return percentile(ratios, currentRatio);
    }

    case "rolling4y": {
      const window4y = Math.min(1460, values.length);
      const recent = values.slice(-window4y);
      return percentile(recent, current);
    }

    case "etf":
      // For ETF flows, just use full percentile for now
      return percentile(values, current);
  }
}

function getStatus(
  score: number,
  labels: [string, string, string, string],
  thresholds: [number, number, number]
): { status: string; statusColor: string } {
  if (score < thresholds[0])
    return { status: labels[0], statusColor: "#3B82F6" }; // blue
  if (score < thresholds[1])
    return { status: labels[1], statusColor: "#22C55E" }; // green
  if (score < thresholds[2])
    return { status: labels[2], statusColor: "#F7931A" }; // orange
  return { status: labels[3], statusColor: "#EF4444" }; // red
}

export async function fetchVitalSigns(): Promise<VitalSignsData> {
  // Collect all metrics across all categories for parallel fetching
  const allMetrics = CATEGORIES.flatMap((cat) =>
    cat.metrics.map((metric) => ({ metric, catName: cat.name }))
  );

  // Fetch BTC price promise (to be resolved later, in parallel with metrics)
  const btcPricePromise = fetch(
    "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd",
    { next: { revalidate: 300 } }
  )
    .then((res) => (res.ok ? res.json() : null))
    .then((data) => data?.bitcoin?.usd ?? 0)
    .catch(() => 0);

  // Fetch all metrics in parallel (BTC price is already in flight)
  const fetchResults = await Promise.allSettled(
    allMetrics.map(({ metric }) => fetchMetric(metric.slug, metric.field))
  );

  let successCount = 0;
  let fetchIdx = 0;

  const categoryResults: CategoryResult[] = [];

  for (const cat of CATEGORIES) {
    const metricResults: MetricResult[] = [];

    for (const metric of cat.metrics) {
      const result = fetchResults[fetchIdx++];
      const data =
        result.status === "fulfilled" ? result.value : [];

      if (result.status === "rejected") {
        console.error(`[vital-signs] ${metric.slug}/${metric.field} promise rejected:`, result.reason);
      }

      if (data.length === 0) {
        console.warn(`[vital-signs] ${metric.label} returned no data — using fallback score 50`);
        metricResults.push({
          label: metric.label,
          value: null,
          normalizedScore: 50,
          change24h: 0,
          avg7d: null,
          avgYearly: null,
        });
        continue;
      }

      successCount++;
      const values = data.map(([, v]) => v);
      const current = values[values.length - 1];
      const prev = values.length > 1 ? values[values.length - 2] : current;
      const change24h = prev !== 0 ? ((current - prev) / Math.abs(prev)) * 100 : 0;
      const last7 = values.slice(-7);
      const avg7d = last7.reduce((a, b) => a + b, 0) / last7.length;
      const last365 = values.slice(-365);
      const avgYearly = last365.reduce((a, b) => a + b, 0) / last365.length;

      metricResults.push({
        label: metric.label,
        value: current,
        normalizedScore: normalizeMetric(data, metric.normalization),
        change24h,
        avg7d,
        avgYearly,
      });
    }

    const avgScore =
      metricResults.reduce((sum, m) => sum + m.normalizedScore, 0) /
      metricResults.length;

    // For invertRisk categories, invert the score for status label purposes
    // so that high raw scores (e.g. high Sharpe) map to "Low Risk" not "Critical"
    const statusScore = cat.invertRisk ? 100 - avgScore : avgScore;
    const { status, statusColor } = getStatus(
      statusScore,
      cat.statusLabels,
      cat.statusThresholds
    );

    categoryResults.push({
      name: cat.name,
      score: Math.round(avgScore),
      status,
      statusColor,
      metrics: metricResults,
    });
  }

  const dataAvailable = successCount > 0;

  const compositeScore = Math.round(
    categoryResults.reduce((sum, c) => sum + c.score, 0) /
      categoryResults.length
  );

  // Await BTC price (already fetched in parallel with metrics)
  const btcPrice = await btcPricePromise;

  return {
    compositeScore,
    categories: categoryResults,
    btcPrice,
    lastUpdated: new Date().toISOString(),
    dataAvailable,
  };
}
