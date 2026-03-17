import { Metadata } from "next";
import { fetchBitcoinVitals } from "@/lib/newhedge";
import Section from "@/components/Section";
import ScrollReveal from "@/components/ScrollReveal";
import FlowerMonitor from "@/components/FlowerMonitor";
import CategoryCard from "@/components/CategoryCard";
import MonthlyReturnsHeatmap from "@/components/MonthlyReturnsHeatmap";
import MethodologySection from "@/components/MethodologySection";
import ShareButtons from "@/components/ShareButtons";

export const revalidate = 14400;

export const metadata: Metadata = {
  title: "Bitcoin Vital Signs | Dudu Bitcoin",
  description:
    "Real-time on-chain health dashboard — 4 categories, 13 metrics, one composite score. Is it so over, or are we so back?",
};

const CATEGORY_POSITIONS: Record<string, "top" | "right" | "bottom" | "left"> = {
  "miner-economics": "top",
  "holder-behavior": "left",
  "institutional-flow": "right",
  "top-signals": "bottom",
};

export default async function VitalSignsPage() {
  const vitals = await fetchBitcoinVitals();

  const flowerCategories = vitals.categories.map((cat) => ({
    name: cat.name,
    score: cat.score,
    status: cat.status,
    statusColor: cat.statusColor,
    position: CATEGORY_POSITIONS[cat.slug] ?? ("top" as const),
  }));

  return (
    <main>
      {/* ── Hero: FlowerMonitor ── */}
      <section className="bg-obsidian py-16 md:py-24">
        <div className="max-w-[1200px] mx-auto px-5 sm:px-6">
          <FlowerMonitor
            centerScore={vitals.healthScore}
            categories={flowerCategories}
          />
        </div>
      </section>

      {/* ── Share Buttons ── */}
      <div className="max-w-[1200px] mx-auto px-5 sm:px-6 py-5">
        <ShareButtons
          title="Bitcoin Vital Signs — Real-Time On-Chain Health Dashboard"
          tweetText="Is Bitcoin healthy right now? Real-time on-chain dashboard tracking 13 metrics across 4 categories. Check the vital signs."
        />
      </div>

      {/* ── Category Cards ── */}
      <Section
        title="The Diagnostics"
        subtitle="Expand each category to see individual metrics, comparisons, and scoring methodology."
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {vitals.categories.map((cat, i) => (
            <ScrollReveal key={cat.slug} delay={i * 100}>
              <CategoryCard {...cat} />
            </ScrollReveal>
          ))}
        </div>
      </Section>

      {/* ── Historical Returns ── */}
      <Section title="Historical Returns" variant="light">
        <ScrollReveal>
          <MonthlyReturnsHeatmap data={vitals.monthlyReturns} />
        </ScrollReveal>
      </Section>

      {/* ── Context ── */}
      <Section variant="light">
        <div className="max-w-[720px] prose prose-sm">
          <h2 className="text-2xl font-bold text-obsidian mb-4">
            How to Read Bitcoin Vital Signs
          </h2>
          <p className="text-obsidian/80 leading-relaxed mb-4">
            This dashboard distills 13 on-chain and market metrics into a single
            composite health score. Think of it as a doctor&apos;s checkup for
            Bitcoin — not a crystal ball, but a diagnostic snapshot of the network&apos;s
            current condition based on verifiable data.
          </p>
          <p className="text-obsidian/80 leading-relaxed mb-4">
            Each category captures a different angle: <strong className="text-obsidian">Miner Economics</strong> tracks
            the profitability and behavior of the entities securing the network.{" "}
            <strong className="text-obsidian">Holder Behavior</strong> watches for signs of accumulation
            or distribution among long-term holders. <strong className="text-obsidian">Institutional Flow</strong> measures
            ETF inflows and exchange reserve changes. <strong className="text-obsidian">Top Signals</strong> aggregates
            the highest-signal indicators that historically correlate with cycle tops and bottoms.
          </p>
          <p className="text-obsidian/80 leading-relaxed mb-4">
            The health score isn&apos;t a buy/sell signal. It&apos;s a framework for
            thinking about where we are in the cycle — and whether the data supports
            the narrative you&apos;re hearing on Twitter.
          </p>

        </div>
      </Section>

      {/* ── Methodology ── */}
      <MethodologySection />

      {/* ── Attribution ── */}
      <div className="pb-12 text-center">
        <p className="text-xs text-fog">
          Powered by{" "}
          <a
            href="https://newhedge.io"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-primary transition-colors"
          >
            NewHedge
          </a>{" "}
          &middot; Updated every 4 hours
        </p>
      </div>
    </main>
  );
}
