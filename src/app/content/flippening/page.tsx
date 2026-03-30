import type { Metadata } from "next";
import Link from "next/link";
import { fetchBtcMarketData, fetchFlippeningAssets } from "@/lib/bitcoin-data";
import FlippeningChart from "@/components/FlippeningChart";
import Section from "@/components/Section";
import ScrollReveal from "@/components/ScrollReveal";
import EmailCapture from "@/components/EmailCapture";
import ExportableChart from "@/components/ExportableChart";

export const metadata: Metadata = {
  title: "Bitcoin Flippening Index — Live BTC vs Gold, Apple, NVIDIA Market Cap Tracker",
  description:
    "Live Bitcoin flippening tracker: see how close BTC is to surpassing Gold ($31T), Apple, NVIDIA, Microsoft, Amazon, and Alphabet by market cap. Flip price calculator updated daily with real-time data from Alpha Vantage and CoinGecko.",
  openGraph: {
    type: "article",
    title: "Bitcoin Flippening Index — Live Market Cap Tracker",
    description:
      "Track Bitcoin's race to #1 asset on earth. Live comparison vs Gold, NVIDIA, Apple, and more with real-time market cap data. See the exact BTC price needed to flip each asset.",
    url: "/content/flippening",
  },
};

export default async function FlippeningPage() {
  const [btcData, assets] = await Promise.all([
    fetchBtcMarketData(),
    fetchFlippeningAssets(),
  ]);
  const btcCapT = btcData.marketCap / 1e12;

  const flipped = assets.filter((a) => btcCapT >= a.marketCapT);
  const remaining = assets.filter((a) => btcCapT < a.marketCapT);
  const nextTarget = remaining.sort((a, b) => a.marketCapT - b.marketCapT)[0];
  const goldAsset = assets.find((a) => a.key === "gold");
  const goldPctRaw = goldAsset && btcCapT > 0 ? (btcCapT / goldAsset.marketCapT) * 100 : 0;
  const goldPct = goldPctRaw.toFixed(1);
  const goldMultiple = goldAsset && btcCapT > 0 ? (goldAsset.marketCapT / btcCapT) : 0;
  const goldMultipleStr = goldMultiple.toFixed(1);
  const goldFlipPrice =
    goldAsset && btcData.price > 0 && btcCapT > 0
      ? (btcData.price * goldAsset.marketCapT) / btcCapT
      : 0;

  const today = new Date().toISOString().split("T")[0];

  // JSON-LD: BreadcrumbList schema
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://dudubitcoin.com" },
      { "@type": "ListItem", position: 2, name: "Content", item: "https://dudubitcoin.com/content" },
      { "@type": "ListItem", position: 3, name: "Flippening Index", item: "https://dudubitcoin.com/content/flippening" },
    ],
  };

  // JSON-LD: Article schema
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "Bitcoin Flippening Index — Live BTC vs Gold Market Cap Tracker",
    description:
      "Live tracker comparing Bitcoin's market cap against Gold, Apple, NVIDIA, Microsoft, Amazon, and Alphabet. Updated daily with real-time data.",
    author: { "@type": "Person", name: "Dudu" },
    publisher: {
      "@type": "Organization",
      name: "Dudu Bitcoin",
      url: "https://dudubitcoin.com",
    },
    datePublished: "2026-03-08",
    dateModified: today,
    mainEntityOfPage: "https://dudubitcoin.com/content/flippening",
  };

  // JSON-LD: FAQ schema
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "What is the Bitcoin flippening?",
        acceptedAnswer: {
          "@type": "Answer",
          text: `The Bitcoin flippening refers to the moment Bitcoin surpasses another major asset in total market capitalization. As of ${today}, Bitcoin has flipped ${flipped.length} of ${assets.length} tracked assets. The next target is ${nextTarget?.name ?? "Gold"}.`,
        },
      },
      {
        "@type": "Question",
        name: "What price does Bitcoin need to reach to flip Gold?",
        acceptedAnswer: {
          "@type": "Answer",
          text: `Bitcoin would need to reach approximately $${goldFlipPrice >= 1e6 ? `${(goldFlipPrice / 1e6).toFixed(2)} million` : `${(goldFlipPrice / 1e3).toFixed(0)}K`} per BTC to match Gold's market cap of $${goldAsset?.marketCapT.toFixed(1) ?? "31"}T. Currently, Bitcoin's market cap is ${goldPct}% of Gold's.`,
        },
      },
      {
        "@type": "Question",
        name: "How is the flip price calculated?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "The flip price shows what BTC would need to reach per coin to equal an asset's market cap, calculated as: (BTC price × target asset market cap) ÷ BTC market cap. This assumes the same circulating supply. As Bitcoin's supply grows slightly via mining (~0.8% annual inflation in 2026), the actual flip price shifts marginally over time.",
        },
      },
      {
        "@type": "Question",
        name: "How often is the flippening data updated?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Bitcoin price and market cap refresh every 5 minutes via the CoinGecko API. Stock market caps (Apple, NVIDIA, Microsoft, Amazon, Alphabet) and commodity prices (Gold, Silver) update daily via the Alpha Vantage API.",
        },
      },
      {
        "@type": "Question",
        name: "Which assets has Bitcoin already flipped?",
        acceptedAnswer: {
          "@type": "Answer",
          text:
            flipped.length > 0
              ? `As of ${today}, Bitcoin has flipped ${flipped.map((a) => a.name).join(", ")} by market capitalization.`
              : `As of ${today}, Bitcoin has not yet flipped any of the ${assets.length} tracked assets, but is closest to surpassing ${nextTarget?.name ?? "the smallest target"}.`,
        },
      },
    ],
  };

  return (
    <>
      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      {/* Breadcrumb */}
      <div className="w-full bg-white border-b border-card-border">
        <div className="max-w-[900px] mx-auto px-4 sm:px-6 py-3">
          <nav className="text-sm text-obsidian/60">
            <Link href="/content" className="hover:text-primary transition-colors">
              Content
            </Link>
            <span className="mx-2">›</span>
            <span className="text-obsidian font-medium">Flippening Index</span>
          </nav>
        </div>
      </div>

      {/* BLUF — direct answer first */}
      <ScrollReveal>
        <Section>
          <div className="max-w-[900px]">
            <h1 className="text-3xl sm:text-4xl font-black text-obsidian mb-4 leading-tight">
              Bitcoin Flippening Index — Live Market Cap Tracker
            </h1>
            <p className="text-obsidian/60 text-lg leading-relaxed mb-6 max-w-[720px]">
              Bitcoin still has a <strong className="text-obsidian">{goldMultipleStr}x</strong> climb
              to catch Gold&apos;s ${goldAsset?.marketCapT.toFixed(1) ?? "31"}T market cap.
              At <strong className="text-obsidian">${btcCapT.toFixed(2)}T</strong>, BTC has
              flipped <strong className="text-obsidian">{flipped.length} of {assets.length}</strong> tracked
              assets.{" "}
              {nextTarget && (
                <>
                  Next up: <strong className="text-obsidian">{nextTarget.name}</strong> at
                  ${nextTarget.marketCapT.toFixed(2)}T — requiring BTC to
                  reach ~$
                  {(() => {
                    const fp =
                      btcData.price > 0 && btcCapT > 0
                        ? (btcData.price * nextTarget.marketCapT) / btcCapT
                        : 0;
                    return fp >= 1e6
                      ? `${(fp / 1e6).toFixed(1)}M`
                      : `${(fp / 1e3).toFixed(0)}K`;
                  })()}
                  .
                </>
              )}
            </p>
            <ExportableChart filename="bitcoin-flippening-index">
              <FlippeningChart btcData={btcData} assets={assets} />
            </ExportableChart>

            <p className="text-xs text-obsidian/60 mt-3">
              Last updated: {today}. BTC price via CoinGecko (5-min refresh). Asset market caps via Alpha Vantage (daily).
              Gold supply estimate: 215,000 tonnes (World Gold Council). Silver supply: ~1.74M tonnes (Silver Institute).
            </p>
          </div>
        </Section>
      </ScrollReveal>

      {/* Key stats summary */}
      <ScrollReveal>
        <Section variant="light">
          <div className="max-w-[720px]">
            <h2 className="text-2xl font-bold text-obsidian mb-4">
              Bitcoin Flippening Stats — {today}
            </h2>

            {btcData.price > 0 && (
              <div className="not-prose grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                <div className="p-4 rounded-lg border border-card-border bg-white text-center">
                  <p className="text-xs text-obsidian/60 uppercase tracking-wider mb-1">
                    BTC Market Cap
                  </p>
                  <p className="text-xl font-bold text-obsidian">
                    ${btcCapT.toFixed(3)}T
                  </p>
                </div>
                <div className="p-4 rounded-lg border border-card-border bg-white text-center">
                  <p className="text-xs text-obsidian/60 uppercase tracking-wider mb-1">
                    Assets Flipped
                  </p>
                  <p className="text-xl font-bold text-green-600">
                    {flipped.length} / {assets.length}
                  </p>
                </div>
                {nextTarget && (
                  <div className="p-4 rounded-lg border border-card-border bg-white text-center">
                    <p className="text-xs text-obsidian/60 uppercase tracking-wider mb-1">
                      Next Target
                    </p>
                    <p className="text-xl font-bold text-primary">
                      {nextTarget.name}
                    </p>
                    <p className="text-xs text-obsidian/60">
                      ${nextTarget.marketCapT.toFixed(3)}T
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Comparison table for AI extraction */}
            <h3 className="text-lg font-bold text-obsidian mt-6 mb-3">
              Bitcoin Flip Price by Asset
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left border border-card-border rounded-lg overflow-hidden">
                <thead className="bg-gray-50 text-obsidian/60 text-xs uppercase">
                  <tr>
                    <th className="px-4 py-2">Asset</th>
                    <th className="px-4 py-2 text-right">Market Cap</th>
                    <th className="px-4 py-2 text-right">BTC Progress</th>
                    <th className="px-4 py-2 text-right">Flip Price</th>
                    <th className="px-4 py-2 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-card-border">
                  {assets.map((asset) => {
                    const pct = btcCapT > 0 ? (btcCapT / asset.marketCapT) * 100 : 0;
                    const fp =
                      btcData.price > 0 && btcCapT > 0
                        ? (btcData.price * asset.marketCapT) / btcCapT
                        : 0;
                    const isFlipped = btcCapT >= asset.marketCapT;
                    return (
                      <tr key={asset.key} className="bg-white">
                        <td className="px-4 py-2 font-medium text-obsidian">{asset.name}</td>
                        <td className="px-4 py-2 text-right text-obsidian/60">${asset.marketCapT.toFixed(2)}T</td>
                        <td className="px-4 py-2 text-right text-obsidian/60">{pct.toFixed(1)}%</td>
                        <td className="px-4 py-2 text-right font-medium text-obsidian">
                          ${fp >= 1e6 ? `${(fp / 1e6).toFixed(2)}M` : `${(fp / 1e3).toFixed(0)}K`}
                        </td>
                        <td className={`px-4 py-2 text-right font-bold ${isFlipped ? "text-green-600" : "text-obsidian/60"}`}>
                          {isFlipped ? "FLIPPED" : "Pending"}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </Section>
      </ScrollReveal>

      {/* Explainer — structured for AI extraction */}
      <ScrollReveal>
        <Section>
          <div className="max-w-[720px] prose prose-sm">
            <h2 className="text-2xl font-bold text-obsidian mb-4">
              What Is The Bitcoin Flippening?
            </h2>
            <p className="text-obsidian/60 leading-relaxed mb-4">
              The Bitcoin flippening refers to the moment Bitcoin&apos;s total market
              capitalization surpasses that of another major asset class or company. Each
              flip is a milestone in Bitcoin&apos;s journey toward becoming the world&apos;s
              most valuable asset. The term was popularized in the crypto community
              and is now tracked by institutional analysts and media outlets worldwide.
            </p>

            <h3 className="text-lg font-bold text-obsidian mt-6 mb-3">
              How Is The Flip Price Calculated?
            </h3>
            <p className="text-obsidian/60 leading-relaxed mb-4">
              The flip price shows the per-coin BTC price needed to equal a target
              asset&apos;s market cap. The formula is: <strong>(BTC price × target market cap) ÷ BTC market cap</strong>.
              As Bitcoin&apos;s circulating supply grows via mining at approximately 0.8%
              annual inflation in 2026 (decreasing after each halving), the actual flip
              price shifts marginally over time. Bitcoin&apos;s next halving is expected in
              2028, which will reduce the block reward from 3.125 BTC to 1.5625 BTC.
            </p>

            <h3 className="text-lg font-bold text-obsidian mt-6 mb-3">
              Data Sources and Methodology
            </h3>
            <p className="text-obsidian/60 leading-relaxed mb-4">
              Bitcoin price and market cap data comes from the{" "}
              <strong>CoinGecko API</strong>, refreshing every 5 minutes. Stock market
              capitalizations for Apple, NVIDIA, Microsoft, Amazon, and Alphabet are
              sourced from <strong>Alpha Vantage</strong> and update daily. Gold and Silver
              market caps are calculated using spot prices from Alpha Vantage multiplied
              by above-ground supply estimates: 215,000 tonnes for Gold (World Gold Council)
              and approximately 1.74 million tonnes for Silver (Silver Institute).
            </p>
          </div>
        </Section>
      </ScrollReveal>

      {/* FAQ — structured for AI extraction */}
      <ScrollReveal>
        <Section variant="light">
          <div className="max-w-[720px] prose prose-sm">
            <h2 className="text-2xl font-bold text-obsidian mb-6">
              Frequently Asked Questions
            </h2>

            <h3 className="text-base font-bold text-obsidian mt-4 mb-2">
              What is the Bitcoin flippening?
            </h3>
            <p className="text-obsidian/60 leading-relaxed mb-4">
              The Bitcoin flippening is the moment Bitcoin surpasses another major asset
              in total market capitalization. As of {today}, Bitcoin has flipped{" "}
              {flipped.length} of {assets.length} tracked assets. The largest remaining
              target is Gold at ${goldAsset?.marketCapT.toFixed(1)}T.
            </p>

            <h3 className="text-base font-bold text-obsidian mt-4 mb-2">
              What price does Bitcoin need to reach to flip Gold?
            </h3>
            <p className="text-obsidian/60 leading-relaxed mb-4">
              Bitcoin would need to reach approximately $
              {goldFlipPrice >= 1e6
                ? `${(goldFlipPrice / 1e6).toFixed(2)} million`
                : `${(goldFlipPrice / 1e3).toFixed(0)}K`}{" "}
              per BTC to match Gold&apos;s market cap of $
              {goldAsset?.marketCapT.toFixed(1)}T. Currently, Bitcoin&apos;s market cap
              represents {goldPct}% of Gold&apos;s.
            </p>

            <h3 className="text-base font-bold text-obsidian mt-4 mb-2">
              How often is the flippening data updated?
            </h3>
            <p className="text-obsidian/60 leading-relaxed mb-4">
              Bitcoin price and market cap refresh every 5 minutes via CoinGecko. Stock
              market caps (Apple, NVIDIA, Microsoft, Amazon, Alphabet) and commodity
              spot prices (Gold, Silver) update daily via Alpha Vantage.
            </p>

            <h3 className="text-base font-bold text-obsidian mt-4 mb-2">
              Which assets has Bitcoin already flipped?
            </h3>
            <p className="text-obsidian/60 leading-relaxed mb-4">
              {flipped.length > 0
                ? `As of ${today}, Bitcoin has surpassed ${flipped.map((a) => `${a.name} ($${a.marketCapT.toFixed(2)}T)`).join(", ")} by total market capitalization.`
                : `As of ${today}, Bitcoin has not yet flipped any of the ${assets.length} major assets tracked here. The closest target is ${nextTarget?.name ?? "pending"}.`}
            </p>

            <h3 className="text-base font-bold text-obsidian mt-4 mb-2">
              How is the flip price calculated?
            </h3>
            <p className="text-obsidian/60 leading-relaxed mb-4">
              The flip price equals (current BTC price × target asset&apos;s market cap) ÷
              Bitcoin&apos;s market cap. This gives the per-coin BTC price at which both
              assets would have equal total market capitalizations, assuming Bitcoin&apos;s
              current circulating supply of approximately 19.85 million BTC.
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
