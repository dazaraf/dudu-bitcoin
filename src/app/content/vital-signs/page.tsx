import type { Metadata } from "next";
import { fetchVitalSigns } from "@/lib/newhedge";
import VitalSignsClient from "./VitalSignsClient";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Bitcoin Vital Signs | Dudu Bitcoin",
  description:
    "Live Bitcoin health dashboard. 6 categories, 14 on-chain metrics, hybrid normalization. Is Bitcoin cheap or expensive? Are miners profitable? What are HODLers doing?",
  openGraph: {
    title: "Bitcoin Vital Signs",
    description:
      "Live health score across valuation, network, miners, holders, institutions, and risk.",
    type: "website",
  },
};

export default async function VitalSignsPage() {
  const data = await fetchVitalSigns();

  return (
    <main className="min-h-screen bg-white">
      {/* Hero */}
      <section className="pt-28 pb-10 px-4 sm:px-6 text-center relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-[0.025] pointer-events-none"
          style={{
            backgroundImage:
              "linear-gradient(#0D0D0D 1px, transparent 1px), linear-gradient(90deg, #0D0D0D 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />
        <div className="relative max-w-2xl mx-auto">
          <span className="inline-block px-4 py-1.5 rounded-full text-xs font-bold tracking-wide uppercase bg-primary/10 text-primary mb-5">
            Live Data
          </span>
          <h1
            className="text-4xl sm:text-5xl font-black tracking-tight text-obsidian mb-3"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            Bitcoin Vital Signs
          </h1>
          <p className="text-lg text-fog max-w-lg mx-auto mb-1">
            How healthy is Bitcoin right now?
          </p>
          <p className="text-sm text-fog/60">
            14 on-chain metrics across 6 categories. Updated hourly. Data from
            NewHedge.
          </p>
        </div>
      </section>

      {/* Dashboard */}
      <section className="pb-20 px-4 sm:px-6">
        <VitalSignsClient data={data} canonicalUrl="https://dudubitcoin.com/content/vital-signs" />
      </section>
    </main>
  );
}
