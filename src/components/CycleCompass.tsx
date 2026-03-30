"use client";

interface CycleCompassProps {
  phase: string;
  confidence: number;
  description: string;
}

const PHASES = [
  "Bear",
  "Accumulation",
  "Early Bull",
  "Mid Bull",
  "Late Bull",
  "Distribution",
] as const;

export default function CycleCompass({
  phase,
  confidence,
  description,
}: CycleCompassProps) {
  const activeIndex = PHASES.findIndex((p) => p === phase);

  return (
    <div className="w-full max-w-2xl mx-auto bg-white/5 backdrop-blur rounded-2xl p-6 md:p-8">
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-sm font-medium tracking-widest uppercase text-fog">
          Cycle Compass
        </h3>
        <span className="text-xs font-semibold px-3 py-1 rounded-full bg-primary/20 text-primary">
          {confidence}% confidence
        </span>
      </div>

      {/* Phase bar */}
      <div className="relative">
        <div className="flex gap-1 rounded-lg overflow-hidden">
          {PHASES.map((p, i) => {
            const isActive = i === activeIndex;
            return (
              <div
                key={p}
                className={`relative flex-1 h-10 flex items-center justify-center text-[10px] sm:text-xs font-semibold transition-all duration-500 ${
                  isActive
                    ? "bg-primary text-obsidian"
                    : "bg-white/10 text-white/80"
                }`}
              >
                <span className="hidden sm:inline">{p}</span>
                <span className="sm:hidden">
                  {p.split(" ").map((w) => w[0]).join("")}
                </span>
                {isActive && (
                  <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[6px] border-r-[6px] border-t-[6px] border-transparent border-t-primary" />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Phase label + description */}
      <div className="mt-6 text-center">
        <p className="text-lg font-bold text-white">{phase}</p>
        <p className="mt-2 text-sm text-fog leading-relaxed">{description}</p>
      </div>
    </div>
  );
}
