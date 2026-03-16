import type { Metadata } from "next";
import Link from "next/link";
import { fetchBtcMarketData, FLIPPENING_ASSETS } from "@/lib/bitcoin-data";
import FlippeningChart from "@/components/FlippeningChart";
import Section from "@/components/Section";
import ScrollReveal from "@/components/ScrollReveal";
import EmailCapture from "@/components/EmailCapture";
import ShareButtons from "@/components/ShareButtons";

export const metadata: Metadata = {
  title: "Bitcoin Flippening Watch — BTC vs Gold Market Cap Tracker (Live)",
  description:
    "Live Bitcoin flippening tracker: see how close BTC is to surpassing Gold, Apple, NVIDIA, Microsoft, and Amazon by market cap. Flip price calculator updated every 5 minutes.",
  openGraph: {
    type: "article",
    title: "Bitcoin Flippening Watch — Live Market Cap Tracker",
    description:
      "Track Bitcoin's race to #1 asset on earth. Live comparison vs Gold ($21.7T), NVIDIA, Apple, and more. See the exact BTC price needed to flip each asset.",
    url: "/content/flippening",
  },
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
            <h1 className="sr-only">Bitcoin Flippening Watch — Will BTC Surpass Gold?</h1>
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

            <h3 className="text-lg font-bold text-obsidian mt-6 mb-3">
              Why Track The Flippening?
            </h3>
            <p className="text-fog leading-relaxed mb-4">
              Every asset Bitcoin surpasses is a psychological and structural milestone.
              When BTC flipped Silver, the narrative shifted from &quot;digital experiment&quot;
              to &quot;legitimate store of value.&quot; When it flips a company like Amazon
              or Google, it proves that a decentralized network with no CEO, no headquarters,
              and no marketing budget can outvalue the most powerful corporations on earth.
            </p>
            <p className="text-fog leading-relaxed mb-4">
              The ultimate target is Gold at ~$21.7 trillion. That flip would make Bitcoin
              the single most valuable asset class in human history — a 10x from current
              levels. This tracker shows you exactly how far along that journey we are,
              updated in real time.
            </p>

            <p className="text-xs text-fog mt-4">
              BTC data refreshes every 5 minutes via CoinGecko. Traditional asset
              market caps are approximate and updated periodically.
            </p>

            <div className="mt-6 pt-6 border-t border-card-border not-prose">
              <ShareButtons
                title="Bitcoin Flippening Watch — BTC vs Gold Market Cap Tracker (Live)"
                tweetText="How close is Bitcoin to flipping Gold? Live flippening tracker with real-time market cap comparisons."
              />
            </div>
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
