import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Dudu Bitcoin | Growth Architect";
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
          backgroundColor: "#1A1A1A",
          fontFamily: "sans-serif",
        }}
      >
        {/* Orange accent bar */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: 6,
            backgroundColor: "#F7931A",
          }}
        />
        <div
          style={{
            fontSize: 64,
            fontWeight: 800,
            color: "#FFFFFF",
            marginBottom: 16,
            letterSpacing: "-0.02em",
          }}
        >
          Dudu Bitcoin
        </div>
        <div
          style={{
            fontSize: 28,
            color: "#F7931A",
            fontWeight: 600,
          }}
        >
          Growth Architect
        </div>
        <div
          style={{
            fontSize: 20,
            color: "#999999",
            marginTop: 24,
            maxWidth: 600,
            textAlign: "center",
            lineHeight: 1.5,
          }}
        >
          AI growth strategy, Bitcoin research, and the agentic economy
        </div>
      </div>
    ),
    { ...size }
  );
}
