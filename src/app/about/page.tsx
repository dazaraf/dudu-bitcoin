import type { Metadata } from "next";
import Image from "next/image";
import Section from "@/components/Section";
import Card from "@/components/Card";
import SocialProof from "@/components/SocialProof";
import Button from "@/components/Button";
import CalendlyButton from "@/components/CalendlyButton";
import ScrollReveal from "@/components/ScrollReveal";

export const metadata: Metadata = {
  title: "About David Azaraf (Dudu Bitcoin) — Growth Architect, Crypto GTM Strategist",
  description:
    "David Azaraf (Dudu Bitcoin) is a growth architect and crypto GTM strategist. Former Head of Marketing at Bancor and INX, now consulting AI-native founders on go-to-market, demand gen, and audience building.",
  openGraph: {
    type: "profile",
    title: "About David Azaraf (Dudu Bitcoin)",
    description:
      "Growth architect and crypto GTM strategist. 50+ expert conversations, 500K+ views. Consulting founders on AI growth strategy and the agentic economy.",
    url: "/about",
  },
};

const timelineEntries = [
  {
    period: "1992–2014",
    title: "South Africa",
    description:
      "Grew up in South Africa, graduated with a B.Sc in Statistics & Actuarial Science.",
  },
  {
    period: "2015–2017",
    title: "Israel & Tech",
    description:
      "Moved to Israel, worked in tech as a Data Analyst. Last corporate role at eBay.",
  },
  {
    period: "2018–2024",
    title: "Crypto Native",
    description:
      "Discovered Bitcoin. Led content, growth and GTM for a number of startups in the Israeli Web3 ecosystem. Founded the Yalla Bitcoin community.",
  },
  {
    period: "2024–2025",
    title: "Agency Builder",
    description:
      "Co-founded a marketing agency, grew to $500k revenue in 18 months. Clients: Lombard, Coti, Mavryk.",
  },
];

const thesisCards = [
  {
    icon: <span>&#x20BF;</span>,
    title: "Bitcoin Is the Reserve Currency of the Agentic Future",
    description:
      "As AI agents transact autonomously, they need a permissionless, programmable, globally accepted money. Bitcoin is the only asset that fits — neutral, scarce, and unstoppable.",
  },
  {
    icon: <span>&#x2728;</span>,
    title: "The Age of Abundance Is Here",
    description:
      "AI removes scarcity from creation. Content, code, design — the cost of producing all of it is collapsing to zero. What remains scarce is judgment.",
  },
  {
    icon: <span>&#x1F3AF;</span>,
    title: "80/20: AI Does the Work, Taste Is the Edge",
    description:
      "AI handles 80% of the execution. Your taste, curation, and trust are the other 20% — and that 20% is where all the value accrues.",
  },
  {
    icon: <span>&#x1F4E1;</span>,
    title: "Distribution Is the New Moat",
    description:
      "In a world of infinite supply, the bottleneck is attention. Founders who build their own distribution — audience, community, brand — win.",
  },
];

export default function AboutPage() {
  return (
    <>
      {/* 1. Hero */}
      <section className="relative w-full py-20 md:py-28 flex items-center justify-center overflow-hidden bg-white">
        {/* Grid pattern */}
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
          {/* Avatar */}
          <div className="w-32 h-32 mx-auto mb-8 rounded-full border-2 border-primary/30 overflow-hidden shadow-lg">
            <Image
              src="/dudu-avatar.jpeg"
              alt="Dudu Bitcoin"
              width={128}
              height={128}
              className="w-full h-full object-cover"
              priority
            />
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-[64px] font-bold leading-[1.1] tracking-tight text-obsidian mb-4 text-balance">
            About Dudu
          </h1>
          <p className="text-lg md:text-xl text-fog max-w-[640px] mx-auto leading-relaxed text-balance">
            Growth Architect. Builder. Curator of signal.
          </p>
        </div>
      </section>

      {/* 2. Timeline */}
      <ScrollReveal>
        <section className="relative w-full py-20 md:py-28 bg-obsidian overflow-hidden">
          {/* Subtle grid on dark */}
          <div
            className="absolute inset-0 opacity-[0.06]"
            style={{
              backgroundImage: `
                linear-gradient(rgba(255,255,255,1) 1px, transparent 1px),
                linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)
              `,
              backgroundSize: "60px 60px",
            }}
          />

          <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-3">
                The Journey
              </h2>
              <p className="text-white/90 text-lg">
                From South Africa to the frontier of crypto & AI.
              </p>
            </div>

            {/* Desktop: horizontal timeline */}
            <div className="hidden md:block">
              {/* Horizontal line */}
              <div className="relative">
                <div className="absolute top-4 left-0 right-0 h-[2px] bg-white/10" />
                <div className="grid grid-cols-4 gap-8">
                  {timelineEntries.map((entry) => (
                    <div key={entry.period} className="relative pt-12">
                      {/* Orange dot */}
                      <div className="absolute top-0 left-1/2 -translate-x-1/2">
                        <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                          <div className="w-3 h-3 rounded-full bg-primary" />
                        </div>
                      </div>
                      <span className="block text-primary font-mono text-sm font-semibold mb-2">
                        {entry.period}
                      </span>
                      <h3 className="text-white font-semibold text-lg mb-2">
                        {entry.title}
                      </h3>
                      <p className="text-white/60 text-sm leading-relaxed">
                        {entry.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Mobile: vertical timeline */}
            <div className="md:hidden">
              <div className="relative pl-10">
                {/* Vertical line */}
                <div className="absolute top-0 bottom-0 left-[15px] w-[2px] bg-white/10" />
                <div className="space-y-10">
                  {timelineEntries.map((entry) => (
                    <div key={entry.period} className="relative">
                      {/* Orange dot */}
                      <div className="absolute -left-10 top-1">
                        <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                          <div className="w-3 h-3 rounded-full bg-primary" />
                        </div>
                      </div>
                      <span className="block text-primary font-mono text-sm font-semibold mb-1">
                        {entry.period}
                      </span>
                      <h3 className="text-white font-semibold text-lg mb-1">
                        {entry.title}
                      </h3>
                      <p className="text-white/60 text-sm leading-relaxed">
                        {entry.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      </ScrollReveal>

      {/* 3. Credentials */}
      <ScrollReveal>
        <SocialProof
          stats={[
            { value: "50+", label: "Expert Conversations" },
            { value: "11K", label: "LinkedIn Network" },
            { value: "500K+", label: "Lifetime Views" },
          ]}
        />
      </ScrollReveal>

      {/* 4. What I Believe */}
      <ScrollReveal>
        <Section
          title="What I Believe"
          subtitle="Four theses that drive everything I build."
          variant="light"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {thesisCards.map((card) => (
              <Card
                key={card.title}
                icon={card.icon}
                title={card.title}
                description={card.description}
              />
            ))}
          </div>
        </Section>
      </ScrollReveal>

      {/* 6. CTA */}
      <ScrollReveal>
        <Section title="Want to Work Together?">
          <div className="max-w-[600px] space-y-6">
            <p className="text-fog leading-relaxed">
              Whether you want weekly signal delivered to your inbox, access to my
              tools and research, or hands-on consulting for your AI-native
              venture — there&apos;s a way in.
            </p>
            <div className="flex flex-wrap items-center gap-4">
              <Button variant="primary" size="lg" href="/#newsletter">
                Subscribe to the Signal
              </Button>
              <CalendlyButton text="Book a Consulting Call" />
            </div>
          </div>
        </Section>
      </ScrollReveal>
    </>
  );
}
