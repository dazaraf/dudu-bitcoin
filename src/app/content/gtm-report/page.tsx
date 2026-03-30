import type { Metadata } from "next";
import ScrollReveal from "@/components/ScrollReveal";
import GtmReportClient from "./GtmReportClient";

export const metadata: Metadata = {
  title: "AI Verification & Zero-Knowledge Proofs: The $2.5T Trust Gap (Research Report)",
  description:
    "Deep-dive ZKML research: why enterprises can't verify AI outputs, how zero-knowledge proofs fix it, the competitive landscape (Lagrange, EZKL, Modulus), and the GTM playbook for the AI verification market.",
  openGraph: {
    type: "article",
    title: "$2.5T Spent on AI. Zero Way to Verify It.",
    description:
      "Original research on AI verification, zero-knowledge machine learning (ZKML), and the race to build the trust layer for enterprise AI.",
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
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary text-white text-[10px] font-bold uppercase tracking-[0.2em] mb-6">
            Alpha Report
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black leading-[1.1] tracking-tight text-obsidian mb-4 text-balance">
            $2.5T Spent on AI.<br />Zero Way to Verify It.
          </h1>
          <p className="text-lg md:text-xl text-obsidian/60 max-w-[640px] mx-auto leading-relaxed text-balance">
            Original research on the AI verification gap — who&apos;s building the fix, who&apos;s funding it, and where zero-knowledge cryptography changes everything.
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
