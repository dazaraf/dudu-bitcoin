import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Bitcoin Vital Signs — Real-Time On-Chain Health Dashboard";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OGImage() {
  const categories = [
    { name: "Miner Economics", score: 62, color: "#22c55e" },
    { name: "Holder Behavior", score: 71, color: "#22c55e" },
    { name: "Institutional Flow", score: 55, color: "#F7931A" },
    { name: "Top Signals", score: 48, color: "#F7931A" },
  ];

  const overallScore = 59;

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
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 40 }}>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ fontSize: 48, fontWeight: 800, color: "#FFFFFF", letterSpacing: "-0.02em", lineHeight: 1.1 }}>
              Bitcoin Vital Signs
            </div>
            <div style={{ fontSize: 22, color: "rgba(255,255,255,0.5)", marginTop: 10 }}>
              Real-time on-chain health dashboard
            </div>
          </div>
        </div>

        {/* Score + Categories */}
        <div style={{ display: "flex", gap: 40, flex: 1, alignItems: "center" }}>
          {/* Central Score */}
          <div
            style={{
              width: 200,
              height: 200,
              borderRadius: "50%",
              backgroundColor: "#F7931A",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <div style={{ fontSize: 72, fontWeight: 800, color: "#FFFFFF", lineHeight: 1 }}>{overallScore}</div>
            <div style={{ fontSize: 16, color: "rgba(255,255,255,0.8)", marginTop: 4 }}>cautiously optimistic</div>
          </div>

          {/* Category cards */}
          <div style={{ display: "flex", flexDirection: "column", gap: 14, flex: 1 }}>
            {categories.map((cat) => (
              <div
                key={cat.name}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  backgroundColor: "rgba(255,255,255,0.05)",
                  borderRadius: 12,
                  padding: "14px 24px",
                  borderLeft: `4px solid ${cat.color}`,
                }}
              >
                <div style={{ fontSize: 20, fontWeight: 700, color: "#FFFFFF" }}>{cat.name}</div>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{ fontSize: 32, fontWeight: 800, color: cat.color }}>{cat.score}</div>
                  <div style={{ fontSize: 14, color: "rgba(255,255,255,0.4)" }}>/100</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 24, borderTop: "1px solid rgba(255,255,255,0.1)", paddingTop: 16 }}>
          <div style={{ fontSize: 16, color: "rgba(255,255,255,0.3)", textTransform: "uppercase", letterSpacing: "0.15em", fontWeight: 700 }}>
            dudubitcoin.com
          </div>
          <div style={{ fontSize: 14, color: "#666" }}>
            13 metrics · 4 categories · Updated every 4 hours
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
