import { TOP_HOLDERS, BtcMarketData } from "@/lib/bitcoin-data";

interface Props {
  btcData: BtcMarketData;
  compact?: boolean;
}

const TYPE_COLORS: Record<string, string> = {
  individual: "#F7931A",
  exchange: "#F4A942",
  etf: "#D4792A",
  company: "#E8A84C",
  nation: "#F5D580",
};

export default function BitcoinHoldersChart({ btcData, compact }: Props) {
  const maxBtc = TOP_HOLDERS[0].btc;
  const items = compact ? TOP_HOLDERS.slice(0, 6) : TOP_HOLDERS;

  return (
    <div className="w-full rounded-xl bg-obsidian p-5 sm:p-8 overflow-hidden">
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h3 className="text-2xl sm:text-3xl font-bold text-white leading-tight">
            Who Holds The Most{" "}
            <span className="text-primary">Bitcoin?</span>
          </h3>
          <p className="text-xs text-white/50 mt-1 flex items-center gap-1.5">
            <span className="inline-block w-2 h-2 rounded-full bg-primary" />
            Bitcoin Held (thousands)
          </p>
        </div>
        {btcData.price > 0 && (
          <div className="text-right hidden sm:block">
            <p className="text-xs text-white/40 uppercase tracking-wider">BTC Price</p>
            <p className="text-lg font-bold text-primary">
              ${btcData.price.toLocaleString("en-US", { maximumFractionDigits: 0 })}
            </p>
          </div>
        )}
      </div>

      {/* Bars */}
      <div className="space-y-2.5">
        {items.map((holder) => {
          const widthPct = (holder.btc / maxBtc) * 100;
          const color = TYPE_COLORS[holder.type] || "#F7931A";

          return (
            <div key={holder.name} className="flex items-center gap-3">
              <span className="text-white font-bold text-sm w-[90px] sm:w-[110px] text-right shrink-0 truncate">
                {holder.name}
              </span>
              <div className="flex-1 relative h-8 sm:h-9">
                <div
                  className="absolute inset-y-0 left-0 rounded-r-md flex items-center justify-end pr-3 transition-all duration-700"
                  style={{
                    width: `${Math.max(widthPct, 8)}%`,
                    background: `linear-gradient(90deg, ${color}CC, ${color})`,
                  }}
                >
                  <span className="text-white font-bold text-xs sm:text-sm whitespace-nowrap">
                    {holder.btc.toLocaleString()}
                  </span>
                </div>
              </div>
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
            + {TOP_HOLDERS.length - items.length} more →
          </span>
        )}
      </div>
    </div>
  );
}
