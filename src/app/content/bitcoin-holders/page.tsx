import type { Metadata } from "next";
import Link from "next/link";
import { fetchBtcMarketData, TOP_HOLDERS } from "@/lib/bitcoin-data";
import BitcoinHoldersChart from "@/components/BitcoinHoldersChart";
import Section from "@/components/Section";
import ScrollReveal from "@/components/ScrollReveal";
import EmailCapture from "@/components/EmailCapture";
import ShareButtons from "@/components/ShareButtons";

export const metadata: Metadata = {
  title: "Who Holds The Most Bitcoin in 2026? Top BTC Holders List (Live)",
  description:
    "Live tracker of the top Bitcoin holders in 2026. See how much BTC Satoshi, BlackRock, MicroStrategy, Coinbase, Binance, and nation states hold — updated every 5 minutes with real-time USD values.",
  openGraph: {
    type: "article",
    title: "Who Holds The Most Bitcoin? — Live Top Holders List",
    description:
      "Live breakdown of the largest Bitcoin holders: Satoshi, BlackRock, Strategy, Coinbase, Binance, USA, China, and more. Updated every 5 minutes.",
    url: "/content/bitcoin-holders",
  },
};

export default async function BitcoinHoldersPage() {
  const btcData = await fetchBtcMarketData();

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
            <span className="text-obsidian font-medium">Bitcoin Holders</span>
          </nav>
        </div>
      </div>

      {/* Chart */}
      <ScrollReveal>
        <Section>
          <div className="max-w-[900px]">
            <h1 className="sr-only">Who Holds The Most Bitcoin? — Top Bitcoin Holders in 2026</h1>
            <BitcoinHoldersChart btcData={btcData} />
            <div className="mt-5">
              <ShareButtons
                title="Who Holds The Most Bitcoin in 2026? Live Top Holders List"
                tweetText="Who holds the most Bitcoin? Live tracker showing Satoshi, BlackRock, MicroStrategy, and more — updated every 5 minutes."
              />
            </div>
          </div>
        </Section>
      </ScrollReveal>

      {/* Explainer */}
      <ScrollReveal>
        <Section variant="light">
          <div className="max-w-[720px] prose prose-sm">
            <h2 className="text-2xl font-bold text-obsidian mb-4">
              Understanding Bitcoin Ownership
            </h2>
            <p className="text-obsidian/80 leading-relaxed mb-4">
              Bitcoin ownership is concentrated among a handful of entities, but the
              landscape is shifting fast. ETFs now hold more Bitcoin than any single
              nation-state, and public companies are racing to add BTC to their
              balance sheets.
            </p>

            <h3 className="text-lg font-bold text-obsidian mt-6 mb-3">
              Breakdown by Category
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 not-prose">
              {(["exchange", "etf", "company", "nation", "individual"] as const).map(
                (type) => {
                  const group = TOP_HOLDERS.filter((h) => h.type === type);
                  const total = group.reduce((sum, h) => sum + h.btc, 0);
                  const labels: Record<string, string> = {
                    exchange: "Exchanges",
                    etf: "ETFs & Funds",
                    company: "Companies",
                    nation: "Nation States",
                    individual: "Individuals",
                  };
                  return (
                    <div
                      key={type}
                      className="p-4 rounded-lg border border-card-border bg-white"
                    >
                      <p className="text-xs text-fog uppercase tracking-wider mb-1">
                        {labels[type]}
                      </p>
                      <p className="text-xl font-bold text-obsidian">
                        {total.toLocaleString()}K BTC
                      </p>
                      {btcData.price > 0 && (
                        <p className="text-xs text-fog">
                          ≈ ${((total * 1000 * btcData.price) / 1e9).toFixed(1)}B USD
                        </p>
                      )}
                      <p className="text-[10px] text-fog mt-1">
                        {group.map((h) => h.name).join(", ")}
                      </p>
                    </div>
                  );
                }
              )}
            </div>

            <h3 className="text-lg font-bold text-obsidian mt-6 mb-3">
              Why This Matters
            </h3>
            <p className="text-obsidian/80 leading-relaxed mb-4">
              Understanding who holds Bitcoin is essential for anticipating market moves.
              When BlackRock&apos;s ETF accumulates more BTC in a single quarter than most
              nations hold in total, the power dynamics of this asset class shift permanently.
              The era of retail-driven Bitcoin cycles is giving way to institutional accumulation
              on a scale most people haven&apos;t internalized yet.
            </p>
            <p className="text-obsidian/80 leading-relaxed mb-4">
              This tracker lets you see exactly where the concentration sits — and more
              importantly, how fast it&apos;s changing. Watch for the gap between ETF
              holdings and exchange reserves. When ETFs hold more Bitcoin than all
              exchanges combined, the supply squeeze thesis moves from theory to fact.
            </p>

            <p className="text-obsidian/70 leading-relaxed mt-6">
              Numbers are approximations based on on-chain analysis, public filings,
              and exchange disclosures. Actual holdings may differ.
            </p>
            <p className="text-xs text-obsidian/50 mt-2">
              Data refreshes every 5 minutes. BTC price via CoinGecko.
            </p>
          </div>
        </Section>
      </ScrollReveal>

      {/* CTA */}
      <ScrollReveal>
        <Section>
          <EmailCapture
            headline="Get notified when the rankings shift"
            subtext="Weekly updates on who's accumulating and who's selling."
          />
        </Section>
      </ScrollReveal>
    </>
  );
}
