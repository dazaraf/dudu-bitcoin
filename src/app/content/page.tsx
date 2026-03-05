import type { Metadata } from "next";
import Section from "@/components/Section";
import EmailCapture from "@/components/EmailCapture";
import ContentPageClient from "./ContentPageClient";
import ScrollReveal from "@/components/ScrollReveal";

export const metadata: Metadata = {
  title: "Content & Webinars | Dudu Bitcoin",
  description:
    "Insights on the agentic economy, AI, macro, and Bitcoin. Webinars, articles, and livestreams from Dudu Bitcoin.",
  openGraph: {
    type: "website",
    title: "Content & Webinars | Dudu Bitcoin",
    description:
      "Insights on the agentic economy, AI, macro, and Bitcoin. Webinars, articles, and livestreams from Dudu Bitcoin.",
    url: "/content",
  },
};

const featuredContent = {
  title:
    "The Agentic Economy Thesis: Why AI Agents Will Become Economic Participants",
  date: "Feb 12, 2026",
  category: "Webinar",
  excerpt:
    "The defining thesis of the next decade: AI agents won't just assist humans — they'll become autonomous economic actors. In this deep-dive webinar, I break down the infrastructure, incentives, and implications for founders building in this new paradigm.",
  locked: false,
};

const allContent = [
  {
    title: "How AI Agents Will Replace 80% of SaaS",
    date: "Feb 17, 2026",
    category: "Article",
    excerpt:
      "The SaaS model is built on humans clicking buttons. When agents can do the clicking, the entire category gets repriced.",

    locked: false,
  },
  {
    title: "Bitcoin as Settlement Layer for Autonomous Agents",
    date: "Feb 14, 2026",
    category: "Webinar",
    excerpt:
      "Why Bitcoin's programmable settlement layer is the natural home for agent-to-agent transactions at scale.",

    locked: true,
  },
  {
    title: "Building Distribution as a Solo Creator",
    date: "Feb 10, 2026",
    category: "Livestream",
    excerpt:
      "A candid 90-minute session on how I built an audience and 500K views without a team, budget, or ad spend.",

    locked: false,
  },
  {
    title: "Signal vs Noise: Separating AI Hype from Reality",
    date: "Feb 7, 2026",
    category: "Article",
    excerpt:
      "A framework for evaluating AI claims, filtering genuine breakthroughs from marketing theater.",

    locked: true,
  },
  {
    title: "The 80/20 Rule for AI-Native Founders",
    date: "Feb 3, 2026",
    category: "Webinar",
    excerpt:
      "How to structure your startup so AI handles 80% of execution while you focus on the 20% that creates real moats.",

    locked: true,
  },
  {
    title: "Macro Trends Shaping the Agentic Economy in 2026",
    date: "Jan 28, 2026",
    category: "Livestream",
    excerpt:
      "Geopolitics, interest rates, regulation, and compute — the macro forces that will determine which AI ventures survive.",

    locked: false,
  },
];

export default function ContentPage() {
  return (
    <>
      {/* 1. Hero */}
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
          <h1 className="text-4xl sm:text-5xl md:text-[64px] font-bold leading-[1.1] tracking-tight text-obsidian mb-6 text-balance">
            Content &amp; Webinars
          </h1>
          <p className="text-lg md:text-xl text-fog max-w-[640px] mx-auto leading-relaxed text-balance">
            Insights on the agentic economy, AI, macro, and Bitcoin.
          </p>
        </div>
      </section>

      {/* 2. Featured Content */}
      <ScrollReveal>
        <Section title="Featured">
          <div
            className="max-w-[900px] overflow-hidden rounded-xl border border-card-border bg-white shadow-sm"
          >
            {/* Thumbnail area */}
            <div className="relative aspect-[21/9] overflow-hidden bg-surface">
              <div className="w-full h-full flex items-center justify-center text-card-border">
                <svg
                  className="w-20 h-20"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1}
                    d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1}
                    d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <span className="absolute bottom-4 left-4 px-3 py-1 text-[10px] font-semibold uppercase tracking-wider rounded-full bg-primary text-white">
                {featuredContent.category}
              </span>
              <span className="absolute bottom-4 right-4 px-3 py-1 text-[10px] font-semibold uppercase tracking-wider rounded-full bg-green-50 text-green-700 border border-green-200">
                Free
              </span>
            </div>
            <div className="p-6 md:p-8">
              <time className="text-xs text-fog mb-2 block">
                {featuredContent.date}
              </time>
              <h3 className="text-xl md:text-2xl font-bold text-obsidian mb-3 text-balance">
                {featuredContent.title}
              </h3>
              <p className="text-sm text-fog leading-relaxed max-w-[720px]">
                {featuredContent.excerpt}
              </p>
            </div>
          </div>
        </Section>
      </ScrollReveal>

      {/* 3 & 4. Filter Tabs + Content Grid (client component) */}
      <ScrollReveal>
        <ContentPageClient content={allContent} />
      </ScrollReveal>

      {/* 5. Newsletter CTA */}
      <ScrollReveal>
        <Section variant="light">
          <EmailCapture
            headline="Never miss an insight"
            subtext="Get my best thinking on AI, macro, and the agentic economy — straight to your inbox."
          />
          <p className="text-center text-xs text-fog mt-4">
            Unsubscribe anytime. Signal only.
          </p>
        </Section>
      </ScrollReveal>

    </>
  );
}
