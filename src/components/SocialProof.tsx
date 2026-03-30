import CountUp from "./CountUp";

interface Stat {
  value: string;
  label: string;
}

const defaultStats: Stat[] = [
  { value: "50+", label: "Conversations" },
  { value: "11K", label: "LinkedIn" },
  { value: "500K+", label: "Views" },
];

interface SocialProofProps {
  stats?: Stat[];
}

export default function SocialProof({ stats = defaultStats }: SocialProofProps) {
  return (
    <section className="w-full bg-surface border-y border-card-border py-10 md:py-14">
      <div className="max-w-[1200px] mx-auto px-5 sm:px-6">
        <div className="grid grid-cols-3 gap-8 md:gap-4">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="text-3xl md:text-4xl font-bold text-obsidian mb-1">
                <CountUp value={stat.value} />
              </p>
              <p className="text-xs uppercase tracking-wider text-obsidian/60 font-medium">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
