import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import Section from "@/components/Section";
import EmailCapture from "@/components/EmailCapture";
import ScrollReveal from "@/components/ScrollReveal";

export const metadata: Metadata = {
  title: "Content & Research | Dudu Bitcoin",
  description:
    "Free Bitcoin infographics, deep-dive research reports, and insights on the agentic economy from Dudu Bitcoin.",
  openGraph: {
    type: "website",
    title: "Content & Research | Dudu Bitcoin",
    description:
      "Free Bitcoin infographics, deep-dive research reports, and insights on the agentic economy from Dudu Bitcoin.",
    url: "/content",
  },
};

const infographics = [
  {
    title: "Who Holds The Most Bitcoin?",
    description:
      "A breakdown of the largest Bitcoin holders — from Satoshi to sovereign nations.",
    image: "/top-bitcoin-holders.jpeg",
    updated: "Updated regularly",
  },
  {
    title: "Bitcoin Flippening Watch",
    description:
      "Tracking Bitcoin's race to become the #1 asset on earth by market cap.",
    image: "/bitcoin-flippening.jpeg",
    updated: "Updated regularly",
  },
];

export default function ContentPage() {
  return (
    <>
      {/* 1. Hero */}
      <section className="relative w-full py-20 md:py-28 flex items-center justify-center overflow-hidden bg-white">
        <div
          className="absolute inset-0 opacity-[0.4]"
          style={{
            backgroundImage: `
              linear-gradient(#E5E5E5 1px, transparent 1px),
              linear-gradient(90deg, #E5E5E5 1px, transparent 1px)
            `,
            backgroundSize: "60px 60px",
          }}
        />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-primary/5 blur-[120px] pointer-events-none" />

        <div className="relative z-10 max-w-[900px] mx-auto px-4 sm:px-6 text-center">
          <h1 className="text-4xl sm:text-5xl md:text-[64px] font-bold leading-[1.1] tracking-tight text-obsidian mb-6 text-balance">
            Content &amp; Research
          </h1>
          <p className="text-lg md:text-xl text-fog max-w-[640px] mx-auto leading-relaxed text-balance">
            Free infographics, deep-dive reports, and insights on Bitcoin and
            the agentic economy.
          </p>
        </div>
      </section>

      {/* 2. Signature Charts */}
      <ScrollReveal>
        <Section title="Signature Charts" subtitle="Free infographics — updated regularly.">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-[900px]">
            {infographics.map((item) => (
              <div
                key={item.title}
                className="group overflow-hidden rounded-xl border border-card-border bg-white shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="relative aspect-square overflow-hidden bg-obsidian">
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    className="object-cover"
                  />
                  <span className="absolute top-3 right-3 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider rounded-full bg-green-50 text-green-700 border border-green-200">
                    Free
                  </span>
                </div>
                <div className="p-5">
                  <h3 className="text-lg font-bold text-obsidian mb-1">
                    {item.title}
                  </h3>
                  <p className="text-sm text-fog leading-relaxed mb-2">
                    {item.description}
                  </p>
                  <span className="text-xs text-primary font-medium">
                    {item.updated}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </Section>
      </ScrollReveal>

      {/* 3. Deep Dives */}
      <ScrollReveal>
        <Section
          title="Deep Dives"
          subtitle="In-depth research and analysis."
          variant="light"
        >
          <Link
            href="/content/gtm-report"
            className="block max-w-[900px] overflow-hidden rounded-xl border border-card-border bg-white shadow-sm hover:shadow-md transition-shadow group"
          >
            <div className="relative aspect-[21/9] overflow-hidden bg-gradient-to-br from-obsidian to-obsidian/80 flex items-center justify-center">
              <div className="text-center px-6">
                <span className="inline-block text-xs font-mono uppercase tracking-[0.25em] text-primary bg-primary/10 px-2.5 py-1 rounded mb-3">
                  GTM Intelligence Report
                </span>
                <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-white text-balance">
                  How Lying AI Became The Next Trillion Dollar Global Problem
                </h3>
              </div>
              <span className="absolute bottom-4 left-4 px-3 py-1 text-[10px] font-semibold uppercase tracking-wider rounded-full bg-primary text-white">
                Report
              </span>
              <span className="absolute bottom-4 right-4 px-3 py-1 text-[10px] font-semibold uppercase tracking-wider rounded-full bg-amber-50 text-amber-700 border border-amber-200">
                Email to Unlock
              </span>
            </div>
            <div className="p-6 md:p-8">
              <p className="text-sm text-fog leading-relaxed max-w-[720px]">
                Enterprises will spend $2.5 trillion on AI this year. Who&apos;s
                verifying that the AIs are telling the truth? A deep-dive into
                the trust deficit, verification approaches, competitive
                landscape, and GTM strategy.
              </p>
              <span className="inline-flex items-center gap-1 mt-4 text-sm font-semibold text-primary group-hover:underline">
                Read the teaser
                <svg
                  className="w-4 h-4 transition-transform group-hover:translate-x-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </span>
            </div>
          </Link>
        </Section>
      </ScrollReveal>

      {/* 4. Newsletter CTA */}
      <ScrollReveal>
        <Section>
          <EmailCapture
            headline="Never miss an insight"
            subtext="Get my best thinking on AI, macro, and the agentic economy — straight to your inbox."
          />
          <p className="text-center text-xs text-fog mt-4">
            Unsubscribe anytime. Signal only.
          </p>
        </Section>
      </ScrollReveal>
    </>
  );
}
