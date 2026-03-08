"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";

type Testimonial = {
  quote: string;
  name: string;
  role: string;
  company: string;
  image?: string;
  logo?: string;
  initials?: string;
  color?: string;
};

const testimonials: Testimonial[] = [
  {
    quote:
      "Dudu's expertise was invaluable in helping our team make the right decisions for our stablecoin launch.",
    name: "Gidon Ronthal",
    role: "Executive",
    company: "Super Group",
    image: "/testimonials/gidon-ronthal.jpeg",
    logo: "/testimonials/supergroup-logo.webp",
  },
  {
    quote:
      "It's always a treat to join Dudu for a livestream. His energy and deep knowledge make every session engaging and insightful.",
    name: "Anton Golub",
    role: "Founder",
    company: "RWALabs.ae",
    image: "/testimonials/antongolub.jpeg",
    logo: "/testimonials/rwalabs-blue_white_gradient.webp",
  },
  {
    quote:
      "Dudu always brought high caliber guests as a cohost of our show for years. His ability to elevate every conversation is unmatched.",
    name: "Mati Greenspan",
    role: "Founder & CEO",
    company: "Quantum Economics",
    image: "/testimonials/matigreenspan.jpeg",
    logo: "/testimonials/quantum_economics_cover.jpeg",
  },
];

const AUTO_ROTATE_MS = 5000;

function Avatar({ t, size = 80 }: { t: Testimonial; size?: number }) {
  if (t.image) {
    return (
      <div
        className="rounded-full overflow-hidden ring-4 ring-white shadow-lg mx-auto"
        style={{ width: size, height: size }}
      >
        <Image
          src={t.image}
          alt={t.name}
          width={size}
          height={size}
          className="object-cover w-full h-full"
        />
      </div>
    );
  }
  return (
    <div
      className={`rounded-full ${t.color} flex items-center justify-center text-white font-bold ring-4 ring-white shadow-lg mx-auto`}
      style={{ width: size, height: size, fontSize: size * 0.3 }}
    >
      {t.initials}
    </div>
  );
}

function Card({
  t,
  position,
}: {
  t: Testimonial;
  position: "center" | "left" | "right" | "far-left" | "far-right" | "hidden";
}) {
  const positionStyles: Record<string, string> = {
    center: "z-30 scale-100 opacity-100 translate-x-0",
    left: "z-20 scale-90 opacity-50 -translate-x-[65%] sm:-translate-x-[75%]",
    right: "z-20 scale-90 opacity-50 translate-x-[65%] sm:translate-x-[75%]",
    "far-left": "z-10 scale-80 opacity-0 -translate-x-[120%]",
    "far-right": "z-10 scale-80 opacity-0 translate-x-[120%]",
    hidden: "z-0 scale-75 opacity-0 translate-x-0",
  };

  return (
    <div
      className={`absolute top-0 left-1/2 -ml-[160px] sm:-ml-[200px] w-[320px] sm:w-[400px] transition-all duration-500 ease-in-out ${positionStyles[position]}`}
    >
      <div className="rounded-2xl overflow-hidden shadow-xl bg-white border border-card-border">
        {/* Orange header band */}
        <div className="h-20 bg-gradient-to-br from-primary to-[#E8820F] relative">
          {/* Avatar overlapping the band */}
          <div className="absolute -bottom-10 left-0 right-0">
            <Avatar t={t} size={80} />
          </div>
        </div>

        {/* Content below band */}
        <div className="pt-14 pb-8 px-6 text-center">
          <h3 className="text-lg font-bold text-obsidian">{t.name}</h3>

          {t.logo ? (
            <Image
              src={t.logo}
              alt={t.company}
              width={200}
              height={56}
              className="h-12 w-auto object-contain mx-auto mt-2 mb-4"
            />
          ) : (
            <p className="text-sm font-semibold text-primary/70 uppercase tracking-wide mt-1 mb-4">
              {t.company}
            </p>
          )}

          <p className="text-sm text-obsidian/70 leading-relaxed">
            &ldquo;{t.quote}&rdquo;
          </p>
        </div>
      </div>
    </div>
  );
}

export default function Testimonials() {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const len = testimonials.length;

  const next = useCallback(() => {
    setActive((a) => (a + 1) % len);
  }, [len]);

  const prev = useCallback(() => {
    setActive((a) => (a - 1 + len) % len);
  }, [len]);

  useEffect(() => {
    if (paused) return;
    const timer = setInterval(next, AUTO_ROTATE_MS);
    return () => clearInterval(timer);
  }, [next, paused]);

  function getPosition(index: number) {
    const diff = ((index - active) % len + len) % len;
    if (diff === 0) return "center" as const;
    if (diff === 1) return "right" as const;
    if (diff === len - 1) return "left" as const;
    if (diff === 2) return "far-right" as const;
    if (diff === len - 2) return "far-left" as const;
    return "hidden" as const;
  }

  return (
    <div
      className="flex flex-col items-center"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Carousel container */}
      <div className="relative w-full max-w-4xl h-[380px] sm:h-[400px]">
        {testimonials.map((t, i) => (
          <Card key={t.name} t={t} position={getPosition(i)} />
        ))}
      </div>

      {/* Controls */}
      <div className="flex items-center gap-6 mt-4">
        <button
          onClick={prev}
          aria-label="Previous"
          className="w-10 h-10 rounded-full border border-card-border bg-white flex items-center justify-center text-fog hover:text-primary hover:border-primary transition-colors cursor-pointer"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>

        <div className="flex gap-2">
          {testimonials.map((_, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              aria-label={`Go to testimonial ${i + 1}`}
              className={`w-2.5 h-2.5 rounded-full transition-all duration-300 cursor-pointer ${
                i === active
                  ? "bg-primary scale-125"
                  : "bg-fog/30 hover:bg-fog/60"
              }`}
            />
          ))}
        </div>

        <button
          onClick={next}
          aria-label="Next"
          className="w-10 h-10 rounded-full border border-card-border bg-white flex items-center justify-center text-fog hover:text-primary hover:border-primary transition-colors cursor-pointer"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </button>
      </div>
    </div>
  );
}
