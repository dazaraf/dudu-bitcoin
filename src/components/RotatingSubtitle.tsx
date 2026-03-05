"use client";

import { useState, useEffect } from "react";

const lines = [
  "Honestly? It depends on the day.",
  "Ask my mom, she still doesn't know.",
  "It's complicated.",
  "Yes.",
];

export default function RotatingSubtitle() {
  const [index, setIndex] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setVisible(false);
      setTimeout(() => {
        setIndex((prev) => (prev + 1) % lines.length);
        setVisible(true);
      }, 400);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <span
      className="inline-block transition-all duration-400 ease-in-out"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(8px)",
      }}
    >
      {lines[index]}
    </span>
  );
}
