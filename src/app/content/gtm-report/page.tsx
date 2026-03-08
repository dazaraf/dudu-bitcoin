import type { Metadata } from "next";
import ScrollReveal from "@/components/ScrollReveal";
import GtmReportClient from "./GtmReportClient";

export const metadata: Metadata = {
  title: "How Lying AI Became The Next Trillion Dollar Problem | Dudu Bitcoin",
  description:
    "Enterprises will spend $2.5 trillion on AI this year. Who's verifying the AIs are telling the truth? A deep-dive GTM intelligence report.",
  openGraph: {
    type: "article",
    title: "How Lying AI Became The Next Trillion Dollar Problem",
    description:
      "Enterprises will spend $2.5 trillion on AI this year. Who's verifying the AIs are telling the truth?",
    url: "/content/gtm-report",
  },
};

export default function GtmReportPage() {
  return (
    <>
      {/* Hero */}
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
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-semibold uppercase tracking-wider mb-6">
            GTM Intelligence Report
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-[1.1] tracking-tight text-obsidian mb-4 text-balance">
            How Lying AI Became The Next Trillion Dollar Global Problem
          </h1>
          <p className="text-lg md:text-xl text-fog max-w-[640px] mx-auto leading-relaxed text-balance">
            Enterprises will spend $2.5 trillion on AI this year. Who&apos;s
            verifying that the AIs are telling the truth?
          </p>
        </div>
      </section>

      {/* Report content with gate */}
      <ScrollReveal>
        <section className="py-16 md:py-24 bg-white">
          <div className="max-w-[820px] mx-auto px-4 sm:px-6">
            <GtmReportClient />
          </div>
        </section>
      </ScrollReveal>
    </>
  );
}
