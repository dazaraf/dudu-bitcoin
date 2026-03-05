import { ReactNode } from "react";

interface SectionProps {
  title?: string;
  subtitle?: ReactNode;
  children: ReactNode;
  variant?: "dark" | "light";
  id?: string;
  padding?: "sm" | "md" | "lg" | "xl";
}

const paddingClasses = {
  sm: "py-12 md:py-16",
  md: "py-16 md:py-20",
  lg: "py-16 md:py-24",
  xl: "py-20 md:py-32",
};

export default function Section({
  title,
  subtitle,
  children,
  variant = "dark",
  id,
  padding = "lg",
}: SectionProps) {
  return (
    <>
      <div className="section-divider" />
      <section
        id={id}
        className={`${paddingClasses[padding]} ${
          variant === "light" ? "bg-surface" : "bg-white"
        }`}
      >
        <div className="max-w-[1200px] mx-auto px-5 sm:px-6">
          {title && (
            <div className="mb-12 md:mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-obsidian mb-3 text-balance">
                {title}
                <span className="block mt-3 w-12 h-0.5 bg-primary rounded-full" />
              </h2>
              {subtitle && (
                <p className="mt-4 text-lg text-obsidian/60 max-w-[600px] leading-relaxed">
                  {subtitle}
                </p>
              )}
            </div>
          )}
          {children}
        </div>
      </section>
    </>
  );
}
