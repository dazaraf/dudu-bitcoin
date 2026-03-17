"use client";

import { useState, useEffect } from "react";

interface FlowerMonitorProps {
  centerScore: number; // 0-100 aggregate
  categories: Array<{
    name: string;
    score: number;
    status: string;
    statusColor: string;
    position: "top" | "right" | "bottom" | "left";
  }>;
}

const positionCoords: Record<string, { cx: number; cy: number }> = {
  top: { cx: 250, cy: 105 },
  right: { cx: 395, cy: 250 },
  bottom: { cx: 250, cy: 395 },
  left: { cx: 105, cy: 250 },
};

function getLabel(score: number): string {
  if (score >= 70) return "we're so back";
  if (score >= 50) return "cautiously optimistic";
  if (score >= 30) return "not great, not terrible";
  return "it's so over";
}

export default function FlowerMonitor({
  centerScore,
  categories,
}: FlowerMonitorProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Trigger mount animation on next frame
    const raf = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(raf);
  }, []);

  const centerR = 110;
  const outerR = 80;
  const strokeWidth = 4;

  return (
    <div className="max-w-[500px] mx-auto w-full">
      <svg
        viewBox="0 0 500 500"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto"
      >
        {/* Watermark */}
        <text
          x={250}
          y={260}
          textAnchor="middle"
          fill="rgba(255,255,255,0.07)"
          fontWeight="900"
          fontSize="42"
          letterSpacing="6"
          transform="rotate(-20, 250, 250)"
          style={{ pointerEvents: "none", textTransform: "uppercase" }}
        >
          dudubitcoin.com
        </text>

        {/* Center circle */}
        <g
          style={{
            transform: mounted ? "scale(1)" : "scale(0)",
            transformOrigin: "250px 250px",
            transition: "transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)",
          }}
        >
          <circle cx={250} cy={250} r={centerR} fill="#F7931A" />
        </g>

        {/* Surrounding circles — rendered on top with background-colored stroke for gap */}
        {categories.map((cat, i) => {
          const pos = positionCoords[cat.position];
          if (!pos) return null;

          return (
            <g
              key={cat.position}
              style={{
                transform: mounted ? "scale(1)" : "scale(0)",
                transformOrigin: `${pos.cx}px ${pos.cy}px`,
                transition: `transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) ${
                  0.15 + i * 0.08
                }s`,
              }}
            >
              {/* White stroke ring creates the clean bite/gap effect */}
              <circle
                cx={pos.cx}
                cy={pos.cy}
                r={outerR + strokeWidth / 2}
                fill="none"
                stroke="#0a0a0a"
                strokeWidth={strokeWidth}
              />
              {/* Filled circle */}
              <circle
                cx={pos.cx}
                cy={pos.cy}
                r={outerR}
                fill={cat.statusColor}
              />

              {/* Category name */}
              <text
                x={pos.cx}
                y={pos.cy - 18}
                textAnchor="middle"
                fill="white"
                fontWeight="700"
                fontSize="11"
                style={{ pointerEvents: "none" }}
              >
                {cat.name}
              </text>

              {/* Score */}
              <text
                x={pos.cx}
                y={pos.cy + 10}
                textAnchor="middle"
                fill="white"
                fontWeight="700"
                fontSize="24"
                style={{ pointerEvents: "none" }}
              >
                {cat.score}
              </text>

              {/* Status text */}
              <text
                x={pos.cx}
                y={pos.cy + 28}
                textAnchor="middle"
                fill="rgba(255,255,255,0.8)"
                fontSize="10"
                style={{ pointerEvents: "none" }}
              >
                {cat.status}
              </text>
            </g>
          );
        })}

        {/* Center text — rendered last so it's on top */}
        <g
          style={{
            opacity: mounted ? 1 : 0,
            transition: "opacity 0.4s ease 0.3s",
          }}
        >
          {/* Score number */}
          <text
            x={250}
            y={250}
            textAnchor="middle"
            dominantBaseline="central"
            fill="white"
            fontWeight="800"
            fontSize="48"
            dy="-8"
            style={{ pointerEvents: "none" }}
          >
            {centerScore}
          </text>

          {/* Label */}
          <text
            x={250}
            y={250}
            textAnchor="middle"
            dominantBaseline="central"
            fill="white"
            fontSize="14"
            dy="24"
            style={{ pointerEvents: "none" }}
          >
            {getLabel(centerScore)}
          </text>
        </g>
      </svg>
    </div>
  );
}
