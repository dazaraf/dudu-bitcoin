"use client";

import { useEffect, useState } from "react";

interface HealthScoreProps {
  score: number;
}

function getScoreColor(score: number): string {
  if (score < 30) return "#ef4444";
  if (score < 50) return "#f97316";
  if (score < 70) return "#eab308";
  return "#22c55e";
}

function getScoreLabel(score: number): string {
  if (score < 20) return "Very Weak";
  if (score < 35) return "Weak";
  if (score < 50) return "Below Average";
  if (score < 65) return "Neutral";
  if (score < 80) return "Strong";
  return "Very Strong";
}

export default function HealthScore({ score }: HealthScoreProps) {
  const [displayScore, setDisplayScore] = useState(0);

  useEffect(() => {
    const target = Math.round(score);
    const duration = 1200;
    const startTime = performance.now();

    function animate(now: number) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplayScore(Math.round(eased * target));
      if (progress < 1) requestAnimationFrame(animate);
    }

    requestAnimationFrame(animate);
  }, [score]);

  const color = getScoreColor(score);
  const label = getScoreLabel(score);

  // SVG semicircle arc
  const size = 220;
  const strokeWidth = 14;
  const radius = (size - strokeWidth) / 2;
  const cx = size / 2;
  const cy = size / 2 + 10;

  // Arc from 180deg to 0deg (left to right, semicircle)
  const startAngle = Math.PI;
  const endAngle = 0;
  const sweepAngle = startAngle - (startAngle - endAngle) * (displayScore / 100);

  const x1 = cx + radius * Math.cos(startAngle);
  const y1 = cy - radius * Math.sin(startAngle);
  const x2 = cx + radius * Math.cos(endAngle);
  const y2 = cy - radius * Math.sin(endAngle);

  const activeX = cx + radius * Math.cos(sweepAngle);
  const activeY = cy - radius * Math.sin(sweepAngle);

  const largeArcBg = 1;
  const largeArcActive = displayScore > 50 ? 1 : 0;

  const bgPath = `M ${x1} ${y1} A ${radius} ${radius} 0 ${largeArcBg} 1 ${x2} ${y2}`;
  const activePath = `M ${x1} ${y1} A ${radius} ${radius} 0 ${largeArcActive} 1 ${activeX} ${activeY}`;

  return (
    <div className="flex flex-col items-center">
      <h3 className="text-sm font-medium tracking-widest uppercase text-fog mb-4">
        Bitcoin Health Score
      </h3>
      <div className="relative" style={{ width: size, height: size / 2 + 40 }}>
        <svg
          width={size}
          height={size / 2 + 40}
          viewBox={`0 0 ${size} ${size / 2 + 40}`}
          className="overflow-visible"
        >
          {/* Background arc */}
          <path
            d={bgPath}
            fill="none"
            stroke="rgba(255,255,255,0.1)"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
          />
          {/* Active arc */}
          {displayScore > 0 && (
            <path
              d={activePath}
              fill="none"
              stroke={color}
              strokeWidth={strokeWidth}
              strokeLinecap="round"
              style={{
                filter: `drop-shadow(0 0 8px ${color}80)`,
              }}
            />
          )}
          {/* Score text */}
          <text
            x={cx}
            y={cy - 10}
            textAnchor="middle"
            className="fill-white font-heading"
            style={{ fontSize: 56, fontWeight: 700 }}
          >
            {displayScore}
          </text>
          {/* Label */}
          <text
            x={cx}
            y={cy + 25}
            textAnchor="middle"
            style={{ fontSize: 14, fontWeight: 500, fill: color }}
          >
            {label}
          </text>
        </svg>
      </div>
    </div>
  );
}
