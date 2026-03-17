import { FLIPPENING_ASSETS, BtcMarketData } from "@/lib/bitcoin-data";

interface Props {
  btcData: BtcMarketData;
  compact?: boolean;
}

export default function FlippeningChart({ btcData, compact }: Props) {
  const btcCapT = btcData.marketCap / 1e12;
  const items = compact ? FLIPPENING_ASSETS.slice(0, 5) : FLIPPENING_ASSETS;

  // Find BTC rank
  const allAssets = [...FLIPPENING_ASSETS].sort((a, b) => b.marketCapT - a.marketCapT);
  const btcRank = allAssets.filter((a) => a.marketCapT > btcCapT).length + 1;

  return (
    <div className="w-full rounded-xl bg-obsidian p-5 sm:p-8 overflow-hidden relative">
      {/* Watermark */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden">
        <span className="text-white/[0.04] text-6xl sm:text-8xl font-black uppercase tracking-widest -rotate-12 whitespace-nowrap">
          dudubitcoin.com
        </span>
      </div>
      {/* Header */}
      <div className="flex items-start justify-between mb-1">
        <div>
          <h3 className="text-2xl sm:text-3xl font-black text-white uppercase leading-tight tracking-tight">
            Bitcoin Flippening<br />Watch
          </h3>
          <p className="text-white/50 text-sm mt-1">
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
              <p className="text-xs text-white/40 mt-0.5">
                Market Cap: ${btcCapT.toFixed(3)}T
              </p>
              <span className="inline-block mt-1 px-2 py-0.5 text-[10px] font-bold rounded border border-primary/40 text-primary">
                RANK #{btcRank}
              </span>
            </>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="mt-5 space-y-2">
        {items.map((asset, i) => {
          const pctOfAsset = btcCapT > 0 ? (btcCapT / asset.marketCapT) * 100 : 0;
          const flipPrice =
            btcData.price > 0 && btcCapT > 0
              ? (btcData.price * asset.marketCapT) / btcCapT
              : 0;
          const flipped = btcCapT >= asset.marketCapT;

          return (
            <div
              key={asset.name}
              className="flex items-center gap-2 sm:gap-3"
            >
              {/* Rank */}
              <span className="text-white/40 font-bold text-sm w-6 text-right shrink-0">
                #{i + 1}
              </span>

              {/* Icon + Name */}
              <span className="text-lg shrink-0">{asset.icon}</span>
              <div className="w-[70px] sm:w-[90px] shrink-0">
                <p className="text-white font-bold text-sm leading-tight truncate">
                  {asset.name}
                </p>
                <p className="text-white/30 text-[10px]">
                  ${asset.marketCapT.toFixed(3)}T
                </p>
              </div>

              {/* Progress bar */}
              <div className="flex-1 h-7 sm:h-8 bg-white/5 rounded-sm overflow-hidden relative">
                <div
                  className="absolute inset-y-0 left-0 rounded-sm flex items-center px-2 transition-all duration-700"
                  style={{
                    width: `${Math.min(pctOfAsset, 100)}%`,
                    background: flipped
                      ? "linear-gradient(90deg, #22c55e, #16a34a)"
                      : "linear-gradient(90deg, #F7931ACC, #F7931A)",
                  }}
                >
                  <span className="text-white font-bold text-xs whitespace-nowrap">
                    {pctOfAsset >= 100 ? "FLIPPED" : `${pctOfAsset.toFixed(pctOfAsset < 10 ? 1 : 0)}%`}
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
                  <p className="text-white/30 text-[9px] uppercase">Flip Price</p>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Footer */}
      <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between">
        <span className="text-[10px] text-white/30 uppercase tracking-wider">
          dudubitcoin.com
        </span>
        {compact && (
          <span className="text-xs text-primary font-medium">
            + {FLIPPENING_ASSETS.length - items.length} more →
          </span>
        )}
      </div>
    </div>
  );
}
