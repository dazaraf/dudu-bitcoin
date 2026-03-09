const COINGECKO_BASE = "https://api.coingecko.com/api/v3";

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

// Top Bitcoin holders — updated 2026-03-09 via bitbo.io/treasuries
// Values in thousands of BTC
export const TOP_HOLDERS = [
  { name: "Satoshi", btc: 1100, type: "individual" as const },
  { name: "Coinbase", btc: 885, type: "exchange" as const },
  { name: "BlackRock", btc: 774, type: "etf" as const },
  { name: "Strategy", btc: 739, type: "company" as const },
  { name: "Binance", btc: 629, type: "exchange" as const },
  { name: "Bitfinex", btc: 390, type: "exchange" as const },
  { name: "USA", btc: 198, type: "nation" as const },
  { name: "China", btc: 194, type: "nation" as const },
  { name: "Fidelity", btc: 185, type: "etf" as const },
  { name: "Robinhood", btc: 177, type: "exchange" as const },
  { name: "Grayscale", btc: 156, type: "etf" as const },
  { name: "Block.one", btc: 140, type: "company" as const },
];

// Assets to compare for flippening (market caps in trillions USD)
export const FLIPPENING_ASSETS = [
  { name: "Gold", marketCapT: 21.7, icon: "🥇" },
  { name: "NVIDIA", marketCapT: 4.502, icon: "🟢" },
  { name: "Silver", marketCapT: 4.808, icon: "⬜" },
  { name: "Alphabet", marketCapT: 4.016, icon: "🔵" },
  { name: "Apple", marketCapT: 3.845, icon: "🍎" },
  { name: "Microsoft", marketCapT: 3.546, icon: "🟦" },
  { name: "Amazon", marketCapT: 2.634, icon: "📦" },
];
