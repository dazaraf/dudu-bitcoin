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

// A company's market cap is share price × shares outstanding; a metal's is spot
// price × above-ground supply. Both scale linearly with the unit price — the part
// that actually moves day to day. So we calibrate each asset against a known
// {market cap, price} snapshot, then track the live price from Stooq (free EOD
// quotes, no API key) and scale: liveCap = refCap × livePrice / refPrice.
//
// Shares outstanding and metal supply drift only ~1%/yr, so between recalibrations
// the live price keeps each cap accurate to within a percent. Recalibrate every
// few months: pull caps from companiesmarketcap.com and the matching Stooq close.
// Last calibrated: 2026-05-24 (Stooq close 2026-05-22).
interface AssetCalibration {
  name: string;
  key: string;
  stooq: string; // Stooq symbol (e.g. "nvda.us", "xauusd")
  refCapT: number; // market cap at calibration, trillions USD (companiesmarketcap.com)
  refPrice: number; // Stooq close at calibration
}

const FLIPPENING_CALIBRATION: AssetCalibration[] = [
  { name: "Gold", key: "gold", stooq: "xauusd", refCapT: 31.361, refPrice: 4508.32 },
  { name: "NVIDIA", key: "nvidia", stooq: "nvda.us", refCapT: 5.215, refPrice: 215.33 },
  { name: "Alphabet", key: "alphabet", stooq: "goog.us", refCapT: 4.596, refPrice: 379.38 },
  { name: "Apple", key: "apple", stooq: "aapl.us", refCapT: 4.535, refPrice: 308.82 },
  { name: "Silver", key: "silver", stooq: "xagusd", refCapT: 4.273, refPrice: 75.582 },
  { name: "Microsoft", key: "microsoft", stooq: "msft.us", refCapT: 3.109, refPrice: 418.57 },
  { name: "Amazon", key: "amazon", stooq: "amzn.us", refCapT: 2.864, refPrice: 266.32 },
];

// Static fallback (= the calibration snapshot) used when Stooq is unreachable.
const FLIPPENING_FALLBACK: FlippeningAsset[] = FLIPPENING_CALIBRATION.map(
  ({ name, key, refCapT }) => ({ name, key, marketCapT: refCapT })
);

// Fetch one end-of-day price from Stooq's CSV endpoint. Returns null on any
// failure so the caller can fall back to the calibrated cap.
async function fetchStooqPrice(symbol: string): Promise<number | null> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 10_000);
  try {
    const res = await fetch(`https://stooq.com/q/l/?s=${symbol}&f=sc&e=csv`, {
      signal: controller.signal,
      next: { revalidate: 86400 }, // refresh daily
    });
    if (!res.ok) return null;
    // Body is "SYMBOL,CLOSE" (no header); the price is the last comma field.
    const lastLine = (await res.text()).trim().split("\n").pop() ?? "";
    const price = parseFloat(lastLine.split(",").pop() ?? "");
    return Number.isFinite(price) && price > 0 ? price : null;
  } catch {
    return null;
  } finally {
    clearTimeout(timeout);
  }
}

export async function fetchFlippeningAssets(): Promise<FlippeningAsset[]> {
  try {
    const prices = await Promise.all(
      FLIPPENING_CALIBRATION.map((c) => fetchStooqPrice(c.stooq))
    );

    const assets: FlippeningAsset[] = FLIPPENING_CALIBRATION.map((c, i) => {
      const live = prices[i];
      const marketCapT =
        live != null ? (c.refCapT * live) / c.refPrice : c.refCapT;
      return { name: c.name, key: c.key, marketCapT };
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
