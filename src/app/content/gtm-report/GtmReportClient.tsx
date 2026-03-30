"use client";

import { Suspense } from "react";
import EmailGate from "@/components/EmailGate";

function TeaserContent() {
  return (
    <article className="prose-custom">
      {/* Section 1: The Trust Deficit */}
      <div className="mb-4">
        <span className="inline-block text-xs font-mono uppercase tracking-[0.25em] text-primary bg-primary/5 px-2.5 py-1 rounded">
          01 — The Trust Deficit
        </span>
      </div>
      <h2 className="text-2xl sm:text-3xl font-bold text-obsidian mb-4">
        AI&apos;s $2.5 Trillion Blind Spot
      </h2>
      <div className="space-y-4 text-obsidian/60 leading-relaxed">
        <p>
          In the next twelve months, enterprise AI spending will cross{" "}
          <strong className="text-obsidian">$2.5 trillion globally</strong>. AI
          agents will autonomously execute trades, approve loans, triage
          patients, draft contracts, and manage supply chains. Every one of those
          actions depends on an unverified assumption:
        </p>
        <ol className="list-decimal list-inside space-y-2 pl-2">
          <li>That the model is the model you think it is.</li>
          <li>That the data hasn&apos;t been poisoned.</li>
          <li>That the output hasn&apos;t been tampered with.</li>
        </ol>
        <p>
          Today, there is no way to cryptographically prove any of that. We
          trust vendor logs. We trust API responses. We trust that the inference
          server wasn&apos;t compromised, that the model weights weren&apos;t
          swapped, that a malicious prompt wasn&apos;t injected between your
          request and the model&apos;s response.
        </p>
      </div>
    </article>
  );
}

function FullReport() {
  return (
    <div className="mt-12">
      <iframe
        src="/reports/gtm-report.html"
        title="GTM Intelligence Report — Full Version"
        className="w-full border-0 rounded-xl"
        style={{ height: "80vh", minHeight: 600 }}
      />
    </div>
  );
}

function GtmReportGate() {
  return (
    <EmailGate teaser={<TeaserContent />}>
      <FullReport />
    </EmailGate>
  );
}

export default function GtmReportClient() {
  return (
    <Suspense fallback={<TeaserContent />}>
      <GtmReportGate />
    </Suspense>
  );
}
