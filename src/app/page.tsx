import Hero from "@/components/Hero";
import Section from "@/components/Section";
import Card from "@/components/Card";
import EmailCapture from "@/components/EmailCapture";

import ScrollReveal from "@/components/ScrollReveal";
import Testimonials from "@/components/Testimonials";
import Button from "@/components/Button";
import RotatingSubtitle from "@/components/RotatingSubtitle";
import { fetchBtcMarketData } from "@/lib/bitcoin-data";
import BitcoinHoldersChart from "@/components/BitcoinHoldersChart";
import FlippeningChart from "@/components/FlippeningChart";
import Link from "next/link";
import Image from "next/image";

const whatIDo = [
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
      </svg>
    ),
    title: "GTM Strategy",
    description:
      "I help founders go from \"we built a thing\" to \"people are actually using it.\" Positioning, distribution, launch playbooks. End-to-end.",
    emojis: ["🚀", "📈", "🎯", "💡"],
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5Z" />
      </svg>
    ),
    title: "Demand Gen",
    description:
      "Pipeline doesn't build itself. I design systems that turn attention into leads and leads into revenue. Funnels, campaigns, conversion.",
    emojis: ["💰", "🔥", "📊", "⚡"],
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
    title: "Audience Building",
    description:
      "I grew my own audience talking about crypto, making memes, and hosting live conversations. Now I help founders and brands do the same. Community, content, compounding distribution.",
    emojis: ["🎙️", "👥", "🐸", "📣"],
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2L2 7l10 5 10-5-10-5Z" />
        <path d="M2 17l10 5 10-5" />
        <path d="M2 12l10 5 10-5" />
      </svg>
    ),
    title: "AI Tools",
    description:
      "I vibe-code tools that solve real problems. From internal dashboards to customer-facing products. If it can be built with AI, I'll ship it.",
    emojis: ["🤖", "⚙️", "🧠", "✨"],
  },
];


export default async function Home() {
  const btcData = await fetchBtcMarketData();
  return (
    <>
      {/* 1. Hero */}
      <Hero
        headline="I'm Dudu, Growth Architect."
        typewriterText="I build growth playbooks, host founder interviews, and ship vibe-coded tools to help humans win the agentic economy."
        primaryCta={{ label: "Get Inside the Agentic Economy", href: "#newsletter" }}
      />

      {/* 2. What I Do */}
      <Section
        title={`"What do you do, Dudu?"`}
        subtitle={<RotatingSubtitle />}
        padding="md"
      >
        {/* Meme Row */}
        <ScrollReveal>
          <div className="mb-10 max-w-[480px] mx-auto">
            <Image
              src="/homepage-meme.png"
              alt="What do you do, Dudu?"
              width={480}
              height={274}
              className="w-full h-auto rounded-2xl"
            />
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {whatIDo.map((item, i) => (
            <ScrollReveal key={item.title} delay={i * 100} className="h-full">
              <Card
                icon={item.icon}
                title={item.title}
                description={item.description}
                emojis={item.emojis}
              />
            </ScrollReveal>
          ))}
        </div>
      </Section>

      {/* 4. From the Builders (Testimonials) */}
      <ScrollReveal>
        <Section title="From the Builders" variant="light" padding="sm">
          <Testimonials />
        </Section>
      </ScrollReveal>

      {/* 5. Fresh Signal */}
      <Section title="Fresh Signal" subtitle="Live charts and research — updated automatically." padding="md">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Bitcoin Holders card */}
          <ScrollReveal>
            <Link
              href="/content/bitcoin-holders"
              className="group block overflow-hidden rounded-xl border border-card-border bg-white shadow-sm hover:shadow-md transition-shadow h-full"
            >
              <BitcoinHoldersChart btcData={btcData} compact />
              <div className="p-4">
                <h3 className="text-sm font-bold text-obsidian">Who Holds The Most Bitcoin?</h3>
                <p className="text-xs text-fog mt-1">Live breakdown of the largest BTC holders</p>
              </div>
            </Link>
          </ScrollReveal>

          {/* Flippening card */}
          <ScrollReveal delay={100}>
            <Link
              href="/content/flippening"
              className="group block overflow-hidden rounded-xl border border-card-border bg-white shadow-sm hover:shadow-md transition-shadow h-full"
            >
              <FlippeningChart btcData={btcData} compact />
              <div className="p-4">
                <h3 className="text-sm font-bold text-obsidian">Bitcoin Flippening Watch</h3>
                <p className="text-xs text-fog mt-1">Tracking BTC&apos;s race to #1 asset on earth</p>
              </div>
            </Link>
          </ScrollReveal>

          {/* GTM Report card */}
          <ScrollReveal delay={200}>
            <Link
              href="/content/gtm-report"
              className="group block overflow-hidden rounded-xl border border-card-border bg-white shadow-sm hover:shadow-md transition-shadow h-full"
            >
              <div className="aspect-[4/3] bg-gradient-to-br from-obsidian to-obsidian/80 flex items-center justify-center p-6">
                <div className="text-center">
                  <span className="inline-block text-[10px] font-mono uppercase tracking-[0.25em] text-primary bg-primary/10 px-2 py-0.5 rounded mb-2">
                    GTM Report
                  </span>
                  <h3 className="text-base sm:text-lg font-bold text-white text-balance leading-snug">
                    How Lying AI Became The Next Trillion Dollar Problem
                  </h3>
                </div>
              </div>
              <div className="p-4">
                <h3 className="text-sm font-bold text-obsidian">Deep Dive: AI Trust Deficit</h3>
                <p className="text-xs text-fog mt-1">Email-gated research report</p>
              </div>
            </Link>
          </ScrollReveal>
        </div>
        <div className="mt-10 text-center">
          <Link
            href="/content"
            className="text-sm font-medium text-primary hover:text-primary/80 transition-colors link-underline"
          >
            View All Content &rarr;
          </Link>
        </div>
      </Section>

      {/* 6. Newsletter CTA */}
      <ScrollReveal>
        <Section id="newsletter" variant="light" padding="xl">
          <EmailCapture
            headline="Get Inside the Agentic Economy"
            subtext="Join 11K+ builders, founders, and operators getting weekly playbooks, interviews, and tools. One email. Zero noise."
          />
          <p className="text-center text-xs text-fog mt-4">
            Unsubscribe anytime. Your inbox, your rules.
          </p>
        </Section>
      </ScrollReveal>

      {/* 7. Book a Call */}
      <ScrollReveal>
        <Section id="book-a-call" padding="xl">
          <div className="text-center max-w-[600px] mx-auto">
            <h2 className="text-3xl sm:text-4xl font-bold text-obsidian mb-4">
              Building something in the agentic economy?
            </h2>
            <p className="text-lg text-fog mb-10 text-balance">
              Whether you&apos;re a founder looking for your edge, a team that needs to understand what&apos;s coming, or an event that wants the signal. I&apos;d love to hear what you&apos;re working on.
            </p>
            <Button variant="primary" size="lg" href="https://calendly.com/dazaraf/meet-dudu">
              Grab 30 Minutes with Dudu
            </Button>
          </div>
        </Section>
      </ScrollReveal>
    </>
  );
}
