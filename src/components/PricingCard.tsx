import Button from "./Button";

interface PricingCardProps {
  name: string;
  price: string;
  period?: string;
  features: string[];
  highlighted?: boolean;
  badge?: string;
  ctaText?: string;
  ctaHref?: string;
}

export default function PricingCard({
  name,
  price,
  period = "/mo",
  features,
  highlighted = false,
  badge,
  ctaText = "Get Started",
  ctaHref = "/subscribe",
}: PricingCardProps) {
  return (
    <div
      className={`relative flex flex-col p-8 rounded-2xl border transition-all duration-300 ${
        highlighted
          ? "bg-white border-primary shadow-[0_0_40px_rgba(247,147,26,0.1)]"
          : "bg-white border-card-border hover:border-card-hover"
      }`}
    >
      {badge && (
        <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 text-[11px] font-bold uppercase tracking-wider rounded-full bg-primary text-white">
          {badge}
        </span>
      )}

      <h3 className="text-lg font-semibold text-obsidian mb-1">{name}</h3>

      <div className="flex items-baseline gap-1 mb-6">
        <span className="text-4xl font-bold text-obsidian">{price}</span>
        {period && <span className="text-sm text-fog">{period}</span>}
      </div>

      <ul className="flex flex-col gap-3 mb-8 flex-1">
        {features.map((feature) => (
          <li key={feature} className="flex items-start gap-2.5 text-sm text-fog">
            <svg
              className="w-4 h-4 mt-0.5 text-primary shrink-0"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            {feature}
          </li>
        ))}
      </ul>

      <Button
        variant={highlighted ? "primary" : "secondary"}
        size="md"
        href={ctaHref}
        className="w-full"
      >
        {ctaText}
      </Button>
    </div>
  );
}
