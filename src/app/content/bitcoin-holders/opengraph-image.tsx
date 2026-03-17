import { ImageResponse } from "next/og";
import { TOP_HOLDERS } from "@/lib/bitcoin-data";

export const runtime = "edge";
export const alt = "Who Holds The Most Bitcoin? — Live Top Holders List";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OGImage() {
  const holders = TOP_HOLDERS.slice(0, 6);
  const maxBtc = holders[0].btc;

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
              Who Holds The Most
            </div>
            <div style={{ fontSize: 48, fontWeight: 800, color: "#F7931A", letterSpacing: "-0.02em", lineHeight: 1.1 }}>
              Bitcoin?
            </div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end" }}>
            <div style={{ fontSize: 14, color: "#666", textTransform: "uppercase", letterSpacing: "0.1em" }}>Live Data</div>
            <div style={{ fontSize: 16, color: "#F7931A", fontWeight: 600, marginTop: 4 }}>Updated every 5 min</div>
          </div>
        </div>

        {/* Holder bars */}
        <div style={{ display: "flex", flexDirection: "column", gap: 12, flex: 1 }}>
          {holders.map((h) => {
            const width = (h.btc / maxBtc) * 100;
            return (
              <div key={h.name} style={{ display: "flex", alignItems: "center", gap: 16 }}>
                <div style={{ width: 160, textAlign: "right", fontSize: 18, fontWeight: 700, color: "#FFFFFF", flexShrink: 0 }}>
                  {h.name}
                </div>
                <div style={{ flex: 1, height: 36, position: "relative", display: "flex" }}>
                  <div
                    style={{
                      width: `${Math.max(width, 8)}%`,
                      height: "100%",
                      background: "linear-gradient(90deg, #F7931ACC, #F7931A)",
                      borderRadius: "0 6px 6px 0",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "flex-end",
                      paddingRight: 12,
                    }}
                  >
                    <span style={{ color: "#FFFFFF", fontWeight: 700, fontSize: 16 }}>
                      {h.btc.toLocaleString()}K
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 24, borderTop: "1px solid rgba(255,255,255,0.1)", paddingTop: 16 }}>
          <div style={{ fontSize: 16, color: "rgba(255,255,255,0.3)", textTransform: "uppercase", letterSpacing: "0.15em", fontWeight: 700 }}>
            dudubitcoin.com
          </div>
          <div style={{ fontSize: 14, color: "#666" }}>
            Top Bitcoin Holders 2026
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
