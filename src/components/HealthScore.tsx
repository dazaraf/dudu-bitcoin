"use client";

import { useEffect, useRef, useState } from "react";

interface HealthScoreProps {
  score: number;
}

function getScoreColor(score: number): string {
  if (score < 15) return "#ef4444";
  if (score < 30) return "#f97316";
  if (score < 50) return "#eab308";
  if (score < 70) return "#3b82f6";
  return "#22c55e";
}

function getScoreLabel(score: number): string {
  if (score < 15) return "Critical";
  if (score < 30) return "Weak";
  if (score < 50) return "Caution";
  if (score < 70) return "Healthy";
  return "Strong";
}

export default function HealthScore({ score }: HealthScoreProps) {
  const [displayScore, setDisplayScore] = useState(0);
  const animatedRef = useRef(false);

  useEffect(() => {
    if (animatedRef.current) return;
    animatedRef.current = true;

    const duration = 1500;
    const startTime = performance.now();

    function animate(currentTime: number) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplayScore(Math.round(eased * score));

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    }

    requestAnimationFrame(animate);
  }, [score]);

  const color = getScoreColor(score);
  const label = getScoreLabel(score);

  // SVG circle math
  const radius = 80;
  const circumference = 2 * Math.PI * radius;
  const fillPercent = displayScore / 100;
  const dashOffset = circumference * (1 - fillPercent);

  return (
    <div className="flex flex-col items-center gap-3">
      <p className="text-sm font-medium tracking-widest uppercase text-fog">
        Bitcoin Health Score
      </p>
      <div className="relative w-[200px] h-[200px]">
        <svg
          viewBox="0 0 200 200"
          className="w-full h-full -rotate-90"
        >
          {/* Background track */}
          <circle
            cx="100"
            cy="100"
            r={radius}
            fill="none"
            stroke="rgba(255,255,255,0.1)"
            strokeWidth="12"
          />
          {/* Score arc */}
          <circle
            cx="100"
            cy="100"
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth="12"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={dashOffset}
            className="transition-all duration-100"
          />
        </svg>
        {/* Center text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span
            className="text-5xl font-bold tabular-nums"
            style={{ color }}
          >
            {displayScore}
          </span>
        </div>
      </div>
      <span
        className="text-lg font-semibold tracking-wide"
        style={{ color }}
      >
        {label}
      </span>
    </div>
  );
}
