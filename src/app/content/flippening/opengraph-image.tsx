import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Bitcoin Flippening Watch — Live Market Cap Tracker";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OGImage() {
  const assets = [
    { name: "Gold", cap: "$21.7T", icon: "🥇", pct: 8 },
    { name: "Apple", cap: "$3.7T", icon: "🍎", pct: 46 },
    { name: "NVIDIA", cap: "$3.4T", icon: "💻", pct: 50 },
    { name: "Microsoft", cap: "$3.0T", icon: "🪟", pct: 57 },
    { name: "Amazon", cap: "$2.3T", icon: "📦", pct: 74 },
    { name: "Alphabet", cap: "$2.1T", icon: "🔤", pct: 81 },
    { name: "Silver", cap: "$1.8T", icon: "🥈", pct: 95, flipped: true },
  ];

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          backgroundColor: "#0D0D0D",
          fontFamily: "sans-serif",
          padding: "50px 60px",
        }}
      >
        {/* Orange accent bar */}
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 6, backgroundColor: "#F7931A" }} />

        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 36 }}>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ fontSize: 44, fontWeight: 900, color: "#FFFFFF", textTransform: "uppercase", letterSpacing: "-0.02em", lineHeight: 1.1 }}>
              Bitcoin Flippening
            </div>
            <div style={{ fontSize: 44, fontWeight: 900, color: "#FFFFFF", textTransform: "uppercase", letterSpacing: "-0.02em", lineHeight: 1.1 }}>
              Watch
            </div>
            <div style={{ fontSize: 20, color: "rgba(255,255,255,0.5)", marginTop: 8 }}>
              The race to #1 asset on earth
            </div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end" }}>
            <div style={{ fontSize: 14, color: "#F7931A", textTransform: "uppercase", letterSpacing: "0.1em", fontWeight: 600 }}>BTC Market Cap</div>
            <div style={{ fontSize: 36, fontWeight: 800, color: "#F7931A", marginTop: 4 }}>~$1.7T</div>
          </div>
        </div>

        {/* Asset rows */}
        <div style={{ display: "flex", flexDirection: "column", gap: 10, flex: 1 }}>
          {assets.map((a) => (
            <div key={a.name} style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ fontSize: 20, width: 28 }}>{a.icon}</div>
              <div style={{ width: 100, fontSize: 16, fontWeight: 700, color: "#FFFFFF" }}>{a.name}</div>
              <div style={{ width: 60, fontSize: 13, color: "rgba(255,255,255,0.3)" }}>{a.cap}</div>
              <div style={{ flex: 1, height: 28, backgroundColor: "rgba(255,255,255,0.05)", borderRadius: 4, position: "relative", display: "flex" }}>
                <div
                  style={{
                    width: `${a.pct}%`,
                    height: "100%",
                    background: a.flipped
                      ? "linear-gradient(90deg, #22c55e, #16a34a)"
                      : "linear-gradient(90deg, #F7931ACC, #F7931A)",
                    borderRadius: 4,
                    display: "flex",
                    alignItems: "center",
                    paddingLeft: 10,
                  }}
                >
                  <span style={{ color: "#FFFFFF", fontWeight: 700, fontSize: 13 }}>
                    {a.flipped ? "FLIPPED" : `${a.pct}%`}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 20, borderTop: "1px solid rgba(255,255,255,0.1)", paddingTop: 16 }}>
          <div style={{ fontSize: 16, color: "rgba(255,255,255,0.3)", textTransform: "uppercase", letterSpacing: "0.15em", fontWeight: 700 }}>
            dudubitcoin.com
          </div>
          <div style={{ fontSize: 14, color: "#666" }}>
            Live data — updated every 5 minutes
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
