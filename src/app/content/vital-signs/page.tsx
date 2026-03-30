import type { Metadata } from "next";
import Link from "next/link";
import { fetchBitcoinVitals } from "@/lib/newhedge";
import Section from "@/components/Section";
import ScrollReveal from "@/components/ScrollReveal";
import HealthScore from "@/components/HealthScore";
import CycleCompass from "@/components/CycleCompass";
import CategoryCard from "@/components/CategoryCard";
import MonthlyReturnsHeatmap from "@/components/MonthlyReturnsHeatmap";
import MethodologySection from "@/components/MethodologySection";

export const revalidate = 14400;

export const metadata: Metadata = {
  title: "Bitcoin Vital Signs — Live On-Chain Health Dashboard",
  description:
    "Real-time Bitcoin health dashboard tracking 6 categories and 18 on-chain metrics. MVRV, Puell Multiple, hashrate, ETF flows, holder behavior, and risk signals scored 0-100 with cycle phase detection. Updated every 4 hours.",
  openGraph: {
    type: "article",
    title: "Bitcoin Vital Signs — Live On-Chain Health Dashboard",
    description:
      "Track Bitcoin's on-chain health across 6 categories and 18 metrics. Composite health score, cycle phase detection, and monthly returns heatmap — updated every 4 hours.",
    url: "/content/vital-signs",
  },
};

export default async function VitalSignsPage() {
  const vitals = await fetchBitcoinVitals();

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: "https://dudubitcoin.com",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Content",
        item: "https://dudubitcoin.com/content",
      },
      {
        "@type": "ListItem",
        position: 3,
        name: "Bitcoin Vital Signs",
        item: "https://dudubitcoin.com/content/vital-signs",
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      {/* ── Dark Hero ── */}
      <section className="bg-obsidian py-16 md:py-24">
        <div className="max-w-[1200px] mx-auto px-5 sm:px-6">
          <div className="text-center mb-10">
            <h1 className="text-3xl md:text-5xl font-bold text-white font-heading mb-3">
              Bitcoin Vital Signs
            </h1>
            <p className="text-fog text-base md:text-lg max-w-[600px] mx-auto leading-relaxed">
              18 on-chain metrics across 6 categories, normalized and scored
              0-100. Updated every 4 hours.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center max-w-4xl mx-auto">
            <ScrollReveal>
              <HealthScore score={vitals.healthScore} />
            </ScrollReveal>
            <ScrollReveal delay={150}>
              <CycleCompass
                phase={vitals.cyclePhase.phase}
                confidence={vitals.cyclePhase.confidence}
                description={vitals.cyclePhase.description}
              />
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* ── Category Cards ── */}
      <Section title="Vital Signs" subtitle="6 categories of Bitcoin on-chain health, each scored independently.">
        <div className="grid md:grid-cols-2 gap-5">
          {vitals.categories.map((cat, i) => (
            <ScrollReveal key={cat.slug} delay={i * 80}>
              <CategoryCard
                name={cat.name}
                slug={cat.slug}
                metrics={cat.metrics}
                score={cat.score}
                status={cat.status}
                statusColor={cat.statusColor}
                description={cat.description}
              />
            </ScrollReveal>
          ))}
        </div>
      </Section>

      {/* ── Monthly Returns Heatmap ── */}
      <Section
        title="Historical Returns"
        subtitle="Monthly Bitcoin returns by year. Green means gains, red means losses."
        variant="light"
      >
        <ScrollReveal>
          <MonthlyReturnsHeatmap monthlyReturns={vitals.monthlyReturns} />
        </ScrollReveal>
      </Section>

      {/* ── Methodology ── */}
      <Section title="Methodology">
        <ScrollReveal>
          <MethodologySection />
        </ScrollReveal>
      </Section>

      {/* ── Attribution + Back link ── */}
      <section className="bg-surface py-10">
        <div className="max-w-[1200px] mx-auto px-5 sm:px-6 text-center">
          <p className="text-sm text-obsidian/40">
            Powered by{" "}
            <a
              href="https://newhedge.io"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-obsidian/60 transition-colors"
            >
              NewHedge
            </a>{" "}
            · Updated every 4 hours
          </p>
          <p className="text-xs text-obsidian/30 mt-1">
            Last fetched: {new Date(vitals.fetchedAt).toLocaleString("en-US", {
              dateStyle: "medium",
              timeStyle: "short",
            })}
          </p>
          <Link
            href="/content"
            className="inline-block mt-6 text-sm font-medium text-primary hover:text-primary/80 transition-colors"
          >
            ← Back to all content
          </Link>
        </div>
      </section>
    </>
  );
}
