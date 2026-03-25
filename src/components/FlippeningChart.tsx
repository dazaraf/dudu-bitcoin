import { FlippeningAsset, BtcMarketData, FLIPPENING_ASSETS } from "@/lib/bitcoin-data";
import AssetLogo from "@/components/AssetLogo";

interface Props {
  btcData: BtcMarketData;
  assets?: FlippeningAsset[];
  compact?: boolean;
}

export default function FlippeningChart({ btcData, assets, compact }: Props) {
  const btcCapT = btcData.marketCap / 1e12;
  const source = assets ?? FLIPPENING_ASSETS;
  // Already sorted descending by market cap from fetchFlippeningAssets
  const items = compact ? source.slice(0, 5) : source;

  // Find BTC rank among all assets
  const btcRank = source.filter((a) => a.marketCapT > btcCapT).length + 1;

  // Max market cap for bar width scaling (Gold is always largest)
  const maxCapT = items[0]?.marketCapT ?? 1;

  return (
    <div className="w-full rounded-xl bg-obsidian p-5 sm:p-8 overflow-hidden">
      {/* Header */}
      <div className="flex items-start justify-between mb-1">
        <div>
          <h3 className="text-2xl sm:text-3xl font-black text-white uppercase leading-tight tracking-tight">
            Bitcoin Flippening<br />Watch
          </h3>
          <p className="text-white/90 text-sm mt-1">
            The race to #1 asset on earth
          </p>
        </div>
        <div className="text-right">
          {btcData.price > 0 && (
            <>
              <p className="text-[10px] text-primary uppercase tracking-wider font-medium">
                Current BTC Price
              </p>
              <p className="text-2xl sm:text-3xl font-bold text-primary leading-tight">
                ${btcData.price.toLocaleString("en-US", { maximumFractionDigits: 0 })}
              </p>
              <p className="text-xs text-white/80 mt-0.5">
                Market Cap: ${btcCapT.toFixed(3)}T
              </p>
              <span className="inline-block mt-1 px-2 py-0.5 text-[10px] font-bold rounded border border-primary/40 text-primary">
                RANK #{btcRank}
              </span>
            </>
          )}
        </div>
      </div>

      {/* Bar chart — descending by market cap, showing Xx to catch */}
      <div className="mt-5 space-y-2">
        {items.map((asset, i) => {
          const multiple = btcCapT > 0 ? asset.marketCapT / btcCapT : 0;
          const flipped = btcCapT >= asset.marketCapT;
          const barPct = (asset.marketCapT / maxCapT) * 100;
          const flipPrice =
            btcData.price > 0 && btcCapT > 0
              ? (btcData.price * asset.marketCapT) / btcCapT
              : 0;

          return (
            <div
              key={asset.key}
              className="flex items-center gap-2 sm:gap-3"
            >
              {/* Rank */}
              <span className="text-white/80 font-bold text-sm w-6 text-right shrink-0">
                #{i + 1}
              </span>

              {/* Logo + Name */}
              <span className="shrink-0">
                <AssetLogo assetKey={asset.key} />
              </span>
              <div className="w-[70px] sm:w-[90px] shrink-0">
                <p className="text-white font-bold text-sm leading-tight truncate">
                  {asset.name}
                </p>
                <p className="text-white/80 text-[10px]">
                  ${asset.marketCapT.toFixed(2)}T
                </p>
              </div>

              {/* Bar — width proportional to market cap */}
              <div className="flex-1 h-7 sm:h-8 bg-white/5 rounded-sm overflow-hidden relative">
                <div
                  className="absolute inset-y-0 left-0 rounded-sm flex items-center justify-between px-2 transition-all duration-700"
                  style={{
                    width: `${Math.max(barPct, 8)}%`,
                    background: flipped
                      ? "linear-gradient(90deg, #22c55e, #16a34a)"
                      : "linear-gradient(90deg, #F7931ACC, #F7931A)",
                  }}
                >
                  <span className="text-white font-bold text-xs whitespace-nowrap">
                    {flipped
                      ? "FLIPPED"
                      : `${multiple.toFixed(1)}x`}
                  </span>
                </div>
              </div>

              {/* Flip price */}
              {!compact && flipPrice > 0 && (
                <div className="text-right w-[60px] sm:w-[70px] shrink-0 hidden md:block">
                  <p className="text-white font-bold text-xs">
                    ${flipPrice >= 1e6
                      ? `${(flipPrice / 1e6).toFixed(2)}M`
                      : `${(flipPrice / 1e3).toFixed(0)}K`}
                  </p>
                  <p className="text-white/80 text-[9px] uppercase">Flip Price</p>
                </div>
              )}
            </div>
          );
        })}

        {/* BTC bar for reference */}
        <div className="flex items-center gap-2 sm:gap-3 mt-1 pt-2 border-t border-white/10">
          <span className="text-primary font-bold text-sm w-6 text-right shrink-0">
            ₿
          </span>
          <span className="shrink-0 w-7 h-7 rounded-full bg-primary flex items-center justify-center">
            <span className="text-white text-xs font-bold">₿</span>
          </span>
          <div className="w-[70px] sm:w-[90px] shrink-0">
            <p className="text-primary font-bold text-sm leading-tight">
              Bitcoin
            </p>
            <p className="text-white/80 text-[10px]">
              ${btcCapT.toFixed(2)}T
            </p>
          </div>
          <div className="flex-1 h-7 sm:h-8 bg-white/5 rounded-sm overflow-hidden relative">
            <div
              className="absolute inset-y-0 left-0 rounded-sm flex items-center px-2"
              style={{
                width: `${Math.max((btcCapT / maxCapT) * 100, 5)}%`,
                background: "linear-gradient(90deg, #F7931A, #F7931ACC)",
              }}
            >
              <span className="text-white font-bold text-xs whitespace-nowrap">
                YOU ARE HERE
              </span>
            </div>
          </div>
          {!compact && (
            <div className="text-right w-[60px] sm:w-[70px] shrink-0 hidden md:block">
              <p className="text-primary font-bold text-xs">
                ${btcData.price > 0 ? btcData.price.toLocaleString("en-US", { maximumFractionDigits: 0 }) : "—"}
              </p>
              <p className="text-white/80 text-[9px] uppercase">Current</p>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between">
        <span className="text-[10px] text-white/80 uppercase tracking-wider">
          dudubitcoin.com — live data
        </span>
        {compact && (
          <span className="text-xs text-primary font-medium">
            + {source.length - items.length} more →
          </span>
        )}
      </div>
    </div>
  );
}
