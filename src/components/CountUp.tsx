"use client";

import { useEffect, useRef, useState } from "react";

interface CountUpProps {
  value: string; // e.g. "50+", "11K", "500K+"
  className?: string;
}

function parseValue(value: string): { num: number; prefix: string; suffix: string } {
  // Extract numeric part and any prefix/suffix
  const match = value.match(/^([^\d]*)(\d+)(.*)/);
  if (!match) return { num: 0, prefix: "", suffix: value };

  let num = parseInt(match[2], 10);
  let suffix = match[3] || "";
  const prefix = match[1] || "";

  // Handle K suffix (e.g. "11K" -> 11, suffix "K")
  // The K and + are already in the original string
  return { num, prefix, suffix };
}

export default function CountUp({ value, className = "" }: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const [displayed, setDisplayed] = useState("0");
  const [hasAnimated, setHasAnimated] = useState(false);
  const { num, prefix, suffix } = parseValue(value);

  useEffect(() => {
    const node = ref.current;
    if (!node || hasAnimated) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setHasAnimated(true);
          observer.unobserve(node);

          const duration = 1500; // ms
          const startTime = performance.now();

          function animate(currentTime: number) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            // Ease-out cubic
            const eased = 1 - Math.pow(1 - progress, 3);
            const current = Math.round(eased * num);
            setDisplayed(`${prefix}${current}${suffix}`);

            if (progress < 1) {
              requestAnimationFrame(animate);
            }
          }

          requestAnimationFrame(animate);
        }
      },
      { threshold: 0.3 }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [hasAnimated, num, prefix, suffix]);

  return (
    <span ref={ref} className={className}>
      {hasAnimated ? displayed : `${prefix}0${suffix}`}
    </span>
  );
}
