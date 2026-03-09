"use client";

interface CalendlyButtonProps {
  text?: string;
  className?: string;
}

export default function CalendlyButton({
  text = "Book a Call",
  className = "",
}: CalendlyButtonProps) {
  const handleClick = () => {
    const width = 700;
    const height = 750;
    const left = Math.round(window.screenX + (window.outerWidth - width) / 2);
    const top = Math.round(window.screenY + (window.outerHeight - height) / 2);

    window.open(
      "https://calendly.com/dazaraf/meet-dudu",
      "calendly-popup",
      `width=${width},height=${height},left=${left},top=${top},scrollbars=yes,resizable=yes`
    );
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className={`inline-flex items-center justify-center rounded-full transition-all duration-200 cursor-pointer bg-primary text-white font-semibold hover:brightness-110 active:brightness-95 btn-glow px-8 py-3.5 text-base min-h-[44px] ${className}`}
    >
      {text}
    </button>
  );
}
