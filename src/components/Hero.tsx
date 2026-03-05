"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import Button from "./Button";

interface HeroProps {
  headline: string;
  typewriterText?: string;
  primaryCta?: { label: string; href: string };
}

function useTypewriter(text: string, speed = 40, startDelay = 1200) {
  const [displayed, setDisplayed] = useState("");
  const [done, setDone] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => {
      let i = 0;
      const interval = setInterval(() => {
        i++;
        setDisplayed(text.slice(0, i));
        if (i >= text.length) {
          clearInterval(interval);
          setDone(true);
        }
      }, speed);
      return () => clearInterval(interval);
    }, startDelay);
    return () => clearTimeout(timeout);
  }, [text, speed, startDelay]);

  return { displayed, done };
}

export default function Hero({
  headline,
  typewriterText = "",
  primaryCta,
}: HeroProps) {
  const [loaded, setLoaded] = useState(false);
  const heroRef = useRef<HTMLElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  const { displayed: typedText, done: typingDone } = useTypewriter(typewriterText, 30, 1200);

  useEffect(() => {
    const timer = setTimeout(() => setLoaded(true), 100);
    return () => clearTimeout(timer);
  }, []);

  // Mouse parallax for background grid
  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLElement>) => {
    if (!gridRef.current || !heroRef.current) return;
    const rect = heroRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 12;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * 12;
    gridRef.current.style.transform = `translate(${x}px, ${y}px)`;
  }, []);

  return (
    <section
      ref={heroRef}
      onMouseMove={handleMouseMove}
      className="relative w-full min-h-[90vh] flex items-center justify-center overflow-hidden bg-white py-24 md:py-32"
    >
      {/* Subtle grid pattern — parallax layer */}
      <div
        ref={gridRef}
        className="absolute inset-[-20px] opacity-[0.4] transition-transform duration-150 ease-out will-change-transform"
        style={{
          backgroundImage: `
            linear-gradient(#E5E5E5 1px, transparent 1px),
            linear-gradient(90deg, #E5E5E5 1px, transparent 1px)
          `,
          backgroundSize: "60px 60px",
        }}
      />

      {/* Soft radial glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-primary/5 blur-[120px] pointer-events-none" />

      {/* Bottom orange gradient accent */}
      <div className="hero-bottom-gradient" />

      <div className="relative z-10 max-w-[900px] mx-auto px-5 sm:px-6 text-center">
        {/* Avatar with glow ring */}
        <div
          className={`hero-enter ${loaded ? "hero-enter--visible" : ""} mx-auto mb-8`}
          style={{ transitionDelay: "0ms" }}
        >
          <div className="relative w-36 h-36 sm:w-44 sm:h-44 mx-auto">
            {/* Rotating gradient ring */}
            <div className="absolute inset-[-4px] rounded-full avatar-ring-spin"
              style={{
                background: "conic-gradient(from 0deg, #F7931A, #F7931A33, #F7931A, #F7931A33, #F7931A)",
              }}
            />
            {/* White spacer ring */}
            <div className="absolute inset-0 rounded-full bg-white" />
            {/* Avatar image */}
            <div className="absolute inset-[3px] rounded-full overflow-hidden avatar-glow">
              <Image
                src="/dudu-avatar.jpeg"
                alt="Dudu Bitcoin"
                fill
                className="object-cover"
                priority
              />
            </div>
          </div>
        </div>

        {/* Headline */}
        <h1
          className={`hero-enter ${loaded ? "hero-enter--visible" : ""} text-4xl sm:text-5xl md:text-6xl font-bold leading-[1.1] text-obsidian mb-6 text-balance`}
          style={{ transitionDelay: "200ms" }}
        >
          {headline}
        </h1>

        {/* Typewriter subheadline */}
        {typewriterText && (
          <p
            className={`hero-enter ${loaded ? "hero-enter--visible" : ""} text-lg md:text-xl text-primary font-medium max-w-[720px] mx-auto mb-10 leading-relaxed text-balance min-h-[3em]`}
            style={{ transitionDelay: "400ms" }}
          >
            <span>{typedText}</span>
            {!typingDone && <span className="typewriter-cursor" />}
          </p>
        )}

        {/* CTA */}
        {primaryCta && (
          <div
            className={`hero-enter ${loaded ? "hero-enter--visible" : ""}`}
            style={{ transitionDelay: "600ms" }}
          >
            <Button variant="primary" size="lg" href={primaryCta.href}>
              {primaryCta.label}
            </Button>
          </div>
        )}
      </div>
    </section>
  );
}
