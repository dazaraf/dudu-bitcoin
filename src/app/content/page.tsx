import type { Metadata } from "next";
import Link from "next/link";
import Section from "@/components/Section";
import EmailCapture from "@/components/EmailCapture";
import ScrollReveal from "@/components/ScrollReveal";
import { fetchBtcMarketData } from "@/lib/bitcoin-data";
import BitcoinHoldersChart from "@/components/BitcoinHoldersChart";
import FlippeningChart from "@/components/FlippeningChart";

export const metadata: Metadata = {
  title: "Bitcoin Research, AI Verification Reports & Live Data Tools",
  description:
    "Free Bitcoin data tools (top BTC holders, flippening tracker) and original ZKML research on AI verification. Live data updated every 5 minutes. From Dudu Bitcoin.",
  openGraph: {
    type: "website",
    title: "Content & Research | Dudu Bitcoin",
    description:
      "Original AI verification research, live Bitcoin holder rankings, flippening tracker, and insights on the agentic economy.",
    url: "/content",
  },
};

export default async function ContentPage() {
  const btcData = await fetchBtcMarketData();

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
          <p className="text-lg md:text-xl text-obsidian/60 max-w-[640px] mx-auto leading-relaxed text-balance">
            Original research, live data tools, and insights on Bitcoin and
            the agentic economy.
          </p>
        </div>
      </section>

      {/* 2. Intelligence Briefing — report gets top billing */}
      <ScrollReveal>
        <Section
          title="Intelligence Briefing"
          subtitle="Original research you won't find anywhere else."
        >
          <Link
            href="/content/gtm-report"
            className="group block max-w-[900px] overflow-hidden rounded-xl border border-card-border bg-obsidian shadow-sm hover:shadow-lg transition-shadow"
          >
            <div className="p-8 sm:p-10 md:p-12">
              <span className="inline-block px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] rounded-full bg-primary text-white mb-5">
                Alpha Report
              </span>
              <h3 className="text-2xl sm:text-3xl md:text-4xl font-black text-white leading-tight mb-4 text-balance">
                $2.5T Spent on AI.<br />Zero Way to Verify It.
              </h3>
              <p className="text-sm sm:text-base text-white/90 max-w-[600px] leading-relaxed mb-6">
                Enterprises are pouring trillions into AI systems they fundamentally cannot verify. Zero-knowledge cryptography changes that equation entirely. This report maps the competitive landscape, breaks down the GTM strategies, and identifies where the real leverage sits.
              </p>

              <ul className="text-sm text-white/80 space-y-2 mb-8 max-w-[500px]">
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-0.5">&#x25B8;</span>
                  Why ZK proofs are the only viable path to AI trust
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-0.5">&#x25B8;</span>
                  Competitive landscape: who&apos;s building verification infrastructure
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-0.5">&#x25B8;</span>
                  A GTM playbook for the $2.5T trust gap
                </li>
              </ul>

              <div className="flex items-center gap-4">
                <span className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-primary text-white font-semibold text-sm group-hover:brightness-110 transition-all">
                  Unlock the Research
                  <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </span>
                <span className="text-[10px] text-white/80 uppercase tracking-wider">
                  Free with email
                </span>
              </div>
            </div>
          </Link>

          {/* SEC x CFTC Guidance */}
          <a
            href="/content/sec-cftc-guidance/"
            className="group block max-w-[900px] overflow-hidden rounded-xl border border-card-border bg-white shadow-sm hover:shadow-lg transition-shadow mt-6"
          >
            <div className="p-8 sm:p-10">
              <span className="inline-block px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] rounded-full bg-obsidian text-white mb-5">
                Regulation Breakdown
              </span>
              <h3 className="text-2xl sm:text-3xl font-black text-obsidian leading-tight mb-4 text-balance">
                SEC &amp; CFTC Crypto Guidance 2026:<br />What Is and Isn&apos;t a Security
              </h3>
              <p className="text-sm sm:text-base text-obsidian/60 max-w-[600px] leading-relaxed mb-6">
                The SEC and CFTC jointly classified crypto assets into 5 categories. BTC, ETH, SOL, DOGE, XRP are officially digital commodities. Staking, mining, NFTs, memecoins cleared. Full 68-page breakdown — reviewed with DLT Law.
              </p>

              <ul className="text-sm text-obsidian/40 space-y-2 mb-8 max-w-[500px]">
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-0.5">&#x25B8;</span>
                  5 new asset categories &mdash; what&apos;s a security, what&apos;s not
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-0.5">&#x25B8;</span>
                  13 tokens explicitly named as digital commodities
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-0.5">&#x25B8;</span>
                  Expert commentary from DLT Law
                </li>
              </ul>

              <div className="flex items-center gap-4">
                <span className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-primary text-white font-semibold text-sm group-hover:brightness-110 transition-all">
                  Read the Breakdown
                  <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </span>
                <span className="text-[10px] text-obsidian/30 uppercase tracking-wider">
                  With DLT Law
                </span>
              </div>
            </div>
          </a>
        </Section>
      </ScrollReveal>

      {/* 3. Live Data Tools */}
      <ScrollReveal>
        <Section title="Live Data Tools" subtitle="Free charts — updated every 5 minutes." variant="light">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-[1200px]">
            {/* Bitcoin Holders */}
            <Link
              href="/content/bitcoin-holders"
              className="group block overflow-hidden rounded-xl border border-card-border bg-white shadow-sm hover:shadow-md transition-shadow"
            >
              <BitcoinHoldersChart btcData={btcData} compact />
              <div className="p-5">
                <h3 className="text-lg font-bold text-obsidian mb-1">
                  Who Holds The Most Bitcoin?
                </h3>
                <p className="text-sm text-obsidian/60 leading-relaxed mb-2">
                  A breakdown of the largest Bitcoin holders — from Satoshi to
                  sovereign nations.
                </p>
                <span className="inline-flex items-center gap-1 text-xs text-primary font-medium group-hover:underline">
                  View full breakdown
                  <svg className="w-3 h-3 transition-transform group-hover:translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </span>
              </div>
            </Link>

            {/* Flippening Watch */}
            <Link
              href="/content/flippening"
              className="group block overflow-hidden rounded-xl border border-card-border bg-white shadow-sm hover:shadow-md transition-shadow"
            >
              <FlippeningChart btcData={btcData} compact />
              <div className="p-5">
                <h3 className="text-lg font-bold text-obsidian mb-1">
                  Bitcoin Flippening Watch
                </h3>
                <p className="text-sm text-obsidian/60 leading-relaxed mb-2">
                  Tracking Bitcoin&apos;s race to become the #1 asset on earth by
                  market cap.
                </p>
                <span className="inline-flex items-center gap-1 text-xs text-primary font-medium group-hover:underline">
                  View live tracker
                  <svg className="w-3 h-3 transition-transform group-hover:translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </span>
              </div>
            </Link>

            {/* Bitcoin Vital Signs */}
            <Link
              href="/content/vital-signs"
              className="group block overflow-hidden rounded-xl border border-card-border bg-white shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="h-[200px] bg-obsidian flex items-center justify-center relative overflow-hidden">
                {/* Decorative grid lines */}
                <div className="absolute inset-0 opacity-[0.06]" style={{ backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
                {/* Mini gauge + EKG line */}
                <div className="flex flex-col items-center gap-3 relative z-10">
                  <svg width="100" height="56" viewBox="0 0 100 56">
                    <path d="M8 48 A 42 42 0 1 1 92 48" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="6" strokeLinecap="round" />
                    <path d="M8 48 A 42 42 0 1 1 92 48" fill="none" stroke="#F7931A" strokeWidth="6" strokeLinecap="round" strokeDasharray="132" strokeDashoffset="40" />
                    <text x="50" y="46" textAnchor="middle" fill="white" fontSize="18" fontWeight="700" fontFamily="Inter, sans-serif">70</text>
                  </svg>
                  <svg width="120" height="24" viewBox="0 0 120 24" className="text-primary">
                    <polyline points="0,12 20,12 30,12 35,2 40,22 45,8 50,14 55,12 70,12 80,12 85,4 90,20 95,10 100,13 105,12 120,12" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <p className="text-[10px] text-white/50 uppercase tracking-widest font-medium">Live On-Chain Health</p>
                </div>
              </div>
              <div className="p-5">
                <h3 className="text-lg font-bold text-obsidian mb-1">
                  Bitcoin Vital Signs
                </h3>
                <p className="text-sm text-obsidian/60 leading-relaxed mb-2">
                  6 categories of on-chain health metrics scored 0-100. Live data, transparent methodology.
                </p>
                <span className="inline-flex items-center gap-1 text-xs text-primary font-medium group-hover:underline">
                  View dashboard
                  <svg className="w-3 h-3 transition-transform group-hover:translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </span>
              </div>
            </Link>
          </div>
        </Section>
      </ScrollReveal>

      {/* 4. Newsletter CTA */}
      <ScrollReveal>
        <Section>
          <EmailCapture
            headline="Never miss an insight"
            subtext="Get my best thinking on AI, macro, and the agentic economy — straight to your inbox."
          />
          <p className="text-center text-xs text-obsidian/40 mt-4">
            Unsubscribe anytime. Signal only.
          </p>
        </Section>
      </ScrollReveal>
    </>
  );
}
