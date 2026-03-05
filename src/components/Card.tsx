"use client";

import { ReactNode, useRef, useState, useCallback } from "react";
import Link from "next/link";

interface CardProps {
  icon?: ReactNode;
  title: string;
  description?: string;
  link?: string;
  badge?: string;
  emojis?: string[];
}

interface EmojiParticle {
  id: number;
  emoji: string;
  left: number;
  delay: number;
}

let emojiId = 0;

export default function Card({ icon, title, description, link, badge, emojis }: CardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [particles, setParticles] = useState<EmojiParticle[]>([]);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const el = cardRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    el.style.transform = `perspective(600px) rotateY(${x * 8}deg) rotateX(${-y * 8}deg)`;
  }, []);

  const handleMouseLeave = useCallback(() => {
    const el = cardRef.current;
    if (el) el.style.transform = "";
    setParticles([]);
  }, []);

  const handleMouseEnter = useCallback(() => {
    if (!emojis || emojis.length === 0) return;
    const newParticles: EmojiParticle[] = Array.from({ length: 6 }, () => ({
      id: ++emojiId,
      emoji: emojis[Math.floor(Math.random() * emojis.length)],
      left: Math.random() * 80 + 10,
      delay: Math.random() * 0.4,
    }));
    setParticles(newParticles);
  }, [emojis]);

  const content = (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onMouseEnter={handleMouseEnter}
      className="card-gradient-border group relative flex flex-col gap-4 p-6 bg-white rounded-xl border border-card-border hover:border-transparent shadow-sm transition-all duration-300 h-full"
      style={{ transformStyle: "preserve-3d" }}
    >
      {particles.map((p) => (
        <span
          key={p.id}
          className="emoji-particle"
          style={{ left: `${p.left}%`, animationDelay: `${p.delay}s` }}
        >
          {p.emoji}
        </span>
      ))}

      {badge && (
        <span className="absolute top-4 right-4 px-3 py-1 text-[10px] font-semibold uppercase tracking-wider rounded-full bg-primary/10 text-primary border border-primary/20">
          {badge}
        </span>
      )}

      {icon && (
        <div className="w-10 h-10 flex items-center justify-center rounded-lg bg-primary/10 text-primary text-xl">
          {icon}
        </div>
      )}

      <h3 className="text-lg font-semibold text-obsidian">{title}</h3>

      {description && (
        <p className="text-sm text-obsidian/70 leading-relaxed">{description}</p>
      )}

      {link && (
        <span className="mt-auto text-sm font-medium text-primary opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          Learn more &rarr;
        </span>
      )}
    </div>
  );

  if (link) {
    return <Link href={link}>{content}</Link>;
  }

  return content;
}
