import type { Metadata } from "next";
import Section from "@/components/Section";
import Card from "@/components/Card";
import Button from "@/components/Button";
import CalendlyButton from "@/components/CalendlyButton";
import ScrollReveal from "@/components/ScrollReveal";

export const metadata: Metadata = {
  title: "Tools & Projects | Dudu Bitcoin",
  description:
    "AI-powered tools and projects built by Dudu Bitcoin — from daily intelligence briefings to prediction markets and LinkedIn growth engines.",
  openGraph: {
    type: "website",
    title: "Tools & Projects | Dudu Bitcoin",
    description:
      "AI-powered tools and projects built by Dudu Bitcoin — from daily intelligence briefings to prediction markets and LinkedIn growth engines.",
    url: "/tools",
  },
};

const tools = [
  {
    icon: <span>&#x2600;&#xFE0F;</span>,
    title: "Morning Briefing System",
    description:
      "AI-powered daily macro, crypto & geopolitics intelligence. Wake up to the signal that matters — curated and summarized by autonomous agents every morning.",
    status: "Live",
    statusColor: "bg-green-50 text-green-700 border-green-200",
  },
  {
    icon: <span>&#x1F3B2;</span>,
    title: "Yalla Bets",
    description:
      "Telegram-native prediction market with crypto escrow on Base. Put skin in the game on macro calls, AI milestones, and geopolitical events.",
    status: "Beta",
    statusColor: "bg-yellow-50 text-yellow-700 border-yellow-200",
  },
  {
    icon: <span>&#x1F517;</span>,
    title: "LinkyBoss",
    description:
      "LinkedIn growth tool for founders — craft messages that convert. AI-assisted outreach, connection management, and content optimization.",
    status: "Coming Soon",
    statusColor: "bg-blue-50 text-blue-700 border-blue-200",
  },
  {
    icon: <span>&#x26A1;</span>,
    title: "Content Pipeline",
    description:
      "Automated content creation and distribution engine. From idea to published post across multiple platforms — with human taste as the final filter.",
    status: "Live",
    statusColor: "bg-green-50 text-green-700 border-green-200",
  },
];

export default function ToolsPage() {
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
            Tools &amp; Projects
          </h1>
          <p className="text-lg md:text-xl text-fog max-w-[640px] mx-auto leading-relaxed text-balance">
            Things I build in the age of abundance.
          </p>
        </div>
      </section>

      {/* 2. Tools Grid */}
      <ScrollReveal>
        <Section
          title="What I'm Building"
          subtitle="AI-native tools for founders, creators, and builders."
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {tools.map((tool) => (
              <div key={tool.title} className="relative">
                <Card
                  icon={tool.icon}
                  title={tool.title}
                  description={tool.description}
                />
                {/* Status badge overlay */}
                <span
                  className={`absolute top-4 right-4 px-3 py-1 text-[10px] font-semibold uppercase tracking-wider rounded-full border ${tool.statusColor}`}
                >
                  {tool.status}
                </span>
              </div>
            ))}
          </div>
        </Section>
      </ScrollReveal>

      {/* 3. Building in Public */}
      <ScrollReveal>
        <Section
          title="Building in Public"
          subtitle="Transparency is a feature, not a bug."
          variant="light"
        >
          <div className="max-w-[720px] space-y-6 text-fog leading-relaxed">
            <p>
              Every tool I ship is built in the open. I share the process — the
              architecture decisions, the dead ends, the breakthroughs — because I
              believe the future belongs to builders who earn trust through
              transparency. When you see a tool here marked &ldquo;Live,&rdquo;
              you can trace its entire journey from idea to production.
            </p>
            <p>
              Follow along on my livestreams and content to see how these projects
              evolve in real time. Subscribers get early access to betas and the
              opportunity to shape what gets built next.
            </p>
          </div>
        </Section>
      </ScrollReveal>

      {/* 4. CTA */}
      <ScrollReveal>
        <Section title="Let&apos;s Build Together">
          <div className="max-w-[600px] space-y-6">
            <p className="text-fog leading-relaxed">
              Need something custom built for your startup? Let&apos;s talk.
            </p>
            <CalendlyButton text="Book a Call" />
          </div>
        </Section>
      </ScrollReveal>
    </>
  );
}
