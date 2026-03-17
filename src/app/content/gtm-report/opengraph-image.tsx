import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "$2.5T Spent on AI. Zero Way to Verify It.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#0D0D0D",
          fontFamily: "sans-serif",
          padding: "60px",
          position: "relative",
        }}
      >
        {/* Orange accent bar */}
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 6, backgroundColor: "#F7931A" }} />

        {/* Grid background */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            opacity: 0.15,
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />

        {/* Badge */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            padding: "6px 16px",
            borderRadius: 100,
            backgroundColor: "#F7931A",
            marginBottom: 32,
            fontSize: 13,
            fontWeight: 700,
            color: "#FFFFFF",
            textTransform: "uppercase",
            letterSpacing: "0.2em",
          }}
        >
          Alpha Report
        </div>

        {/* Title */}
        <div
          style={{
            fontSize: 56,
            fontWeight: 900,
            color: "#FFFFFF",
            textAlign: "center",
            lineHeight: 1.1,
            letterSpacing: "-0.02em",
            marginBottom: 20,
          }}
        >
          $2.5T Spent on AI.
        </div>
        <div
          style={{
            fontSize: 56,
            fontWeight: 900,
            color: "#FFFFFF",
            textAlign: "center",
            lineHeight: 1.1,
            letterSpacing: "-0.02em",
            marginBottom: 28,
          }}
        >
          Zero Way to Verify It.
        </div>

        {/* Subtitle */}
        <div
          style={{
            fontSize: 22,
            color: "rgba(255,255,255,0.5)",
            textAlign: "center",
            maxWidth: 700,
            lineHeight: 1.5,
          }}
        >
          Original research on the AI verification gap, zero-knowledge proofs, and the competitive landscape
        </div>

        {/* Footer */}
        <div
          style={{
            position: "absolute",
            bottom: 30,
            left: 60,
            right: 60,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            borderTop: "1px solid rgba(255,255,255,0.1)",
            paddingTop: 16,
          }}
        >
          <div style={{ fontSize: 16, color: "rgba(255,255,255,0.3)", textTransform: "uppercase", letterSpacing: "0.15em", fontWeight: 700 }}>
            dudubitcoin.com
          </div>
          <div style={{ fontSize: 14, color: "#666" }}>
            Free with email signup
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
