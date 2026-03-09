import type { Metadata } from "next";
import Link from "next/link";
import { fetchBtcMarketData, FLIPPENING_ASSETS } from "@/lib/bitcoin-data";
import FlippeningChart from "@/components/FlippeningChart";
import Section from "@/components/Section";
import ScrollReveal from "@/components/ScrollReveal";
import EmailCapture from "@/components/EmailCapture";

export const metadata: Metadata = {
  title: "Bitcoin Flippening Watch | Dudu Bitcoin",
  description:
    "Live tracker: Bitcoin's race to become the #1 asset on earth. See how close BTC is to flipping Gold, Apple, Microsoft, and more.",
};

export default async function FlippeningPage() {
  const btcData = await fetchBtcMarketData();
  const btcCapT = btcData.marketCap / 1e12;

  const flipped = FLIPPENING_ASSETS.filter((a) => btcCapT >= a.marketCapT);
  const nextTarget = FLIPPENING_ASSETS.filter((a) => btcCapT < a.marketCapT)
    .sort((a, b) => a.marketCapT - b.marketCapT)[0];

  return (
    <>
      {/* Breadcrumb */}
      <div className="w-full bg-white border-b border-card-border">
        <div className="max-w-[900px] mx-auto px-4 sm:px-6 py-3">
          <nav className="text-sm text-fog">
            <Link href="/content" className="hover:text-primary transition-colors">
              Content
            </Link>
            <span className="mx-2">›</span>
            <span className="text-obsidian font-medium">Flippening Watch</span>
          </nav>
        </div>
      </div>

      {/* Chart */}
      <ScrollReveal>
        <Section>
          <div className="max-w-[900px]">
            <FlippeningChart btcData={btcData} />
          </div>
        </Section>
      </ScrollReveal>

      {/* Explainer */}
      <ScrollReveal>
        <Section variant="light">
          <div className="max-w-[720px] prose prose-sm">
            <h2 className="text-2xl font-bold text-obsidian mb-4">
              What Is The Flippening?
            </h2>
            <p className="text-fog leading-relaxed mb-4">
              The &quot;flippening&quot; refers to the moment Bitcoin surpasses
              another major asset in total market capitalization. Each flip is a
              milestone in Bitcoin&apos;s journey toward becoming the world&apos;s
              most valuable asset.
            </p>

            {btcData.price > 0 && (
              <div className="not-prose grid grid-cols-1 sm:grid-cols-3 gap-4 my-6">
                <div className="p-4 rounded-lg border border-card-border bg-white text-center">
                  <p className="text-xs text-fog uppercase tracking-wider mb-1">
                    BTC Market Cap
                  </p>
                  <p className="text-xl font-bold text-obsidian">
                    ${btcCapT.toFixed(3)}T
                  </p>
                </div>
                <div className="p-4 rounded-lg border border-card-border bg-white text-center">
                  <p className="text-xs text-fog uppercase tracking-wider mb-1">
                    Assets Flipped
                  </p>
                  <p className="text-xl font-bold text-green-600">
                    {flipped.length} / {FLIPPENING_ASSETS.length}
                  </p>
                </div>
                {nextTarget && (
                  <div className="p-4 rounded-lg border border-card-border bg-white text-center">
                    <p className="text-xs text-fog uppercase tracking-wider mb-1">
                      Next Target
                    </p>
                    <p className="text-xl font-bold text-primary">
                      {nextTarget.name}
                    </p>
                    <p className="text-xs text-fog">
                      ${nextTarget.marketCapT.toFixed(3)}T
                    </p>
                  </div>
                )}
              </div>
            )}

            <h3 className="text-lg font-bold text-obsidian mt-6 mb-3">
              How The Flip Price Works
            </h3>
            <p className="text-fog leading-relaxed mb-4">
              The &quot;flip price&quot; shows what BTC would need to reach (per
              coin) to equal an asset&apos;s market cap, assuming the same circulating
              supply. As Bitcoin&apos;s supply grows slightly via mining, the actual
              flip price shifts marginally over time.
            </p>

            <p className="text-xs text-fog mt-4">
              BTC data refreshes every 5 minutes via CoinGecko. Traditional asset
              market caps are approximate and updated periodically.
            </p>
          </div>
        </Section>
      </ScrollReveal>

      {/* CTA */}
      <ScrollReveal>
        <Section>
          <EmailCapture
            headline="Get flippening alerts"
            subtext="Be the first to know when Bitcoin flips the next major asset."
          />
        </Section>
      </ScrollReveal>
    </>
  );
}
