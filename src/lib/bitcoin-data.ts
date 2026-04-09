const COINGECKO_BASE = "https://api.coingecko.com/api/v3";

export type HolderType = "individual" | "exchange" | "etf" | "company" | "nation";
export interface Holder {
  name: string;
  btc: number;
  type: HolderType;
}

export interface BtcMarketData {
  price: number;
  marketCap: number;
  lastUpdated: string;
}

export async function fetchBtcMarketData(): Promise<BtcMarketData> {
  const res = await fetch(
    `${COINGECKO_BASE}/simple/price?ids=bitcoin&vs_currencies=usd&include_market_cap=true`,
    { next: { revalidate: 300 } } // refresh every 5 min
  );

  if (!res.ok) {
    // Fallback if CoinGecko is down
    return { price: 0, marketCap: 0, lastUpdated: new Date().toISOString() };
  }

  const data = await res.json();
  return {
    price: data.bitcoin.usd,
    marketCap: data.bitcoin.usd_market_cap,
    lastUpdated: new Date().toISOString(),
  };
}

// Static fallback / exchange data (CoinGlass requires browser, can't scrape server-side)
// Exchange values updated manually; ETFs/companies/nations scraped daily from Bitbo
// Values in thousands of BTC
export const TOP_HOLDERS: Holder[] = [
  { name: "Satoshi", btc: 1100, type: "individual" },
  { name: "Coinbase", btc: 857, type: "exchange" },
  { name: "BlackRock", btc: 786, type: "etf" },
  { name: "Strategy", btc: 761, type: "company" },
  { name: "Binance", btc: 632, type: "exchange" },
  { name: "Bitfinex", btc: 401, type: "exchange" },
  { name: "Grayscale", btc: 208, type: "etf" },
  { name: "USA", btc: 198, type: "nation" },
  { name: "China", btc: 194, type: "nation" },
  { name: "Fidelity", btc: 189, type: "etf" },
  { name: "Kraken", btc: 192, type: "exchange" },
  { name: "Block.one", btc: 140, type: "company" },
];

// --- Bitbo scraper (SSR-friendly, no browser needed) ---

function findBtcAmount(text: string, entity: string, startFrom = 0): number | null {
  const searchText = text.slice(startFrom);
  let idx = 0;
  while (idx < searchText.length) {
    const pos = searchText.indexOf(entity, idx);
    if (pos === -1) return null;
    const window = searchText.slice(pos, pos + 500);
    const matches = [...window.matchAll(/([\d,]+(?:\.\d+)?)/g)];
    for (const m of matches) {
      const num = parseFloat(m[1].replace(/,/g, ""));
      if (num >= 1000) return num;
    }
    idx = pos + entity.length;
  }
  return null;
}

async function scrapeBitbo(): Promise<Holder[]> {
  const res = await fetch("https://bitbo.io/treasuries/", {
    next: { revalidate: 86400 }, // 24 hours
  });
  if (!res.ok) return [];
  const raw = await res.text();
  const text = raw.replace(/<[^>]+>/g, " ").replace(/&[a-z]+;/g, " ").replace(/\s+/g, " ");

  const holders: Holder[] = [];

  // ETFs — search after ETFs section header
  const etfStart = text.indexOf("ETFs");
  if (etfStart >= 0) {
    const ibit = findBtcAmount(text, "iShares Bitcoin Trust", etfStart);
    if (ibit) holders.push({ name: "BlackRock", btc: Math.round(ibit / 1000), type: "etf" });

    const fbtc = findBtcAmount(text, "Fidelity Wise Origin", etfStart);
    if (fbtc) holders.push({ name: "Fidelity", btc: Math.round(fbtc / 1000), type: "etf" });

    const gbtc = findBtcAmount(text, "Grayscale Bitcoin Trust", etfStart) || 0;
    const mini = findBtcAmount(text, "Grayscale Bitcoin Mini", etfStart) || 0;
    if (gbtc > 0) holders.push({ name: "Grayscale", btc: Math.round((gbtc + mini) / 1000), type: "etf" });
  }

  // Public companies — search after "Public Companies that Own Bitcoin"
  const compStart = text.indexOf("Public Companies that Own Bitcoin");
  if (compStart >= 0) {
    const strategy = findBtcAmount(text, "Strategy (MicroStrategy)", compStart);
    if (strategy) holders.push({ name: "Strategy", btc: Math.round(strategy / 1000), type: "company" });
  }

  // Private companies — search after "Private Companies" section
  const privStart = text.indexOf("Private Companies");
  if (privStart >= 0) {
    const blockone = findBtcAmount(text, "Block.one", privStart);
    if (blockone) holders.push({ name: "Block.one", btc: Math.round(blockone / 1000), type: "company" });
  }

  // Nations — search after "Countries"
  const natStart = text.indexOf("Countries");
  if (natStart >= 0) {
    const usa = findBtcAmount(text, "USA", natStart);
    if (usa) holders.push({ name: "USA", btc: Math.round(usa / 1000), type: "nation" });

    const china = findBtcAmount(text, "China", natStart);
    if (china) holders.push({ name: "China", btc: Math.round(china / 1000), type: "nation" });
  }

  return holders;
}

// Fetch fresh holder data: scrapes Bitbo daily for ETFs/companies/nations,
// uses static data for exchanges (CoinGlass needs a browser).
export async function fetchTopHolders(): Promise<Holder[]> {
  try {
    const scraped = await scrapeBitbo();
    if (scraped.length === 0) return TOP_HOLDERS;

    const scrapedNames = new Set(scraped.map((h) => h.name));
    // Keep static data for entities not scraped (Satoshi + exchanges)
    const kept = TOP_HOLDERS.filter((h) => !scrapedNames.has(h.name));

    const all = [...kept, ...scraped];
    all.sort((a, b) => b.btc - a.btc);
    return all.slice(0, 12);
  } catch {
    return TOP_HOLDERS;
  }
}

// --- Flippening assets ---

export interface FlippeningAsset {
  name: string;
  key: string; // logo key
  marketCapT: number; // trillions USD
}

// Static fallback market caps (trillions USD)
const FLIPPENING_FALLBACK: FlippeningAsset[] = [
  { name: "Gold", key: "gold", marketCapT: 31.27 },
  { name: "Silver", key: "silver", marketCapT: 4.07 },
  { name: "NVIDIA", key: "nvidia", marketCapT: 4.34 },
  { name: "Alphabet", key: "alphabet", marketCapT: 4.016 },
  { name: "Apple", key: "apple", marketCapT: 3.845 },
  { name: "Microsoft", key: "microsoft", marketCapT: 3.546 },
  { name: "Amazon", key: "amazon", marketCapT: 2.634 },
];

const AV_BASE = "https://www.alphavantage.co/query";

// Above-ground supply estimates (troy ounces)
const GOLD_SUPPLY_OZ = 6_912_750_000; // 215,000 tonnes — World Gold Council
const SILVER_SUPPLY_OZ = 55_880_000_000; // ~1,738,000 tonnes — Silver Institute

function avFetch(url: string, revalidate = 86400): Promise<Response> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 10_000);
  return fetch(url, {
    signal: controller.signal,
    next: { revalidate },
  }).finally(() => clearTimeout(timeout));
}

async function fetchCommodityCapT(
  symbol: "GOLD" | "SILVER"
): Promise<number | null> {
  const key = process.env.ALPHA_VANTAGE_API_KEY;
  if (!key) return null;
  try {
    const res = await avFetch(
      `${AV_BASE}?function=GOLD_SILVER_SPOT&symbol=${symbol}&apikey=${key}`
    );
    if (!res.ok) return null;
    const data = await res.json();
    const price = parseFloat(data.price);
    if (isNaN(price)) return null;
    const supply = symbol === "GOLD" ? GOLD_SUPPLY_OZ : SILVER_SUPPLY_OZ;
    return (price * supply) / 1e12;
  } catch {
    return null;
  }
}

async function fetchStockCapT(ticker: string): Promise<number | null> {
  const key = process.env.ALPHA_VANTAGE_API_KEY;
  if (!key) return null;
  try {
    const res = await avFetch(
      `${AV_BASE}?function=OVERVIEW&symbol=${ticker}&apikey=${key}`
    );
    if (!res.ok) return null;
    const data = await res.json();
    const cap = parseInt(data.MarketCapitalization);
    return isNaN(cap) ? null : cap / 1e12;
  } catch {
    return null;
  }
}

const STOCK_TICKERS: Record<string, string> = {
  nvidia: "NVDA",
  alphabet: "GOOG",
  apple: "AAPL",
  microsoft: "MSFT",
  amazon: "AMZN",
};

// Serialize API calls with 1.5s delay to respect Alpha Vantage 5 req/min limit
async function fetchSequentially<T>(
  fns: (() => Promise<T>)[]
): Promise<(T | null)[]> {
  const results: (T | null)[] = [];
  for (let i = 0; i < fns.length; i++) {
    try {
      results.push(await fns[i]());
    } catch {
      results.push(null);
    }
    if (i < fns.length - 1) {
      await new Promise((r) => setTimeout(r, 1500));
    }
  }
  return results;
}

export async function fetchFlippeningAssets(): Promise<FlippeningAsset[]> {
  try {
    const stockKeys = Object.keys(STOCK_TICKERS);
    const fns: (() => Promise<number | null>)[] = [
      () => fetchCommodityCapT("GOLD"),
      () => fetchCommodityCapT("SILVER"),
      ...stockKeys.map((k) => () => fetchStockCapT(STOCK_TICKERS[k])),
    ];

    const results = await fetchSequentially(fns);

    const assets: FlippeningAsset[] = FLIPPENING_FALLBACK.map((fb) => {
      let live: number | null = null;
      if (fb.key === "gold") live = results[0];
      else if (fb.key === "silver") live = results[1];
      else {
        const idx = stockKeys.indexOf(fb.key);
        if (idx >= 0) live = results[2 + idx];
      }
      return { ...fb, marketCapT: live ?? fb.marketCapT };
    });

    // Sort by market cap descending
    assets.sort((a, b) => b.marketCapT - a.marketCapT);
    return assets;
  } catch {
    return FLIPPENING_FALLBACK;
  }
}

// Re-export static list for compact/homepage usage
export const FLIPPENING_ASSETS = FLIPPENING_FALLBACK;
