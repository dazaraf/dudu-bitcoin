"use client";

interface Props {
  title: string;
  tweetText?: string;
}

export default function ShareButtons({ title, tweetText }: Props) {
  const url = typeof window !== "undefined" ? window.location.href : "";
  const text = tweetText ?? title;

  return (
    <div className="flex items-center gap-3 justify-center">
      <span className="text-sm text-fog font-medium">Share:</span>
      <a
        href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`}
        target="_blank"
        rel="noopener noreferrer"
        className="px-4 py-2 rounded-lg bg-obsidian text-white text-sm font-medium hover:bg-obsidian/80 transition-colors"
      >
        X / Twitter
      </a>
      <a
        href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`}
        target="_blank"
        rel="noopener noreferrer"
        className="px-4 py-2 rounded-lg bg-[#0A66C2] text-white text-sm font-medium hover:bg-[#0A66C2]/80 transition-colors"
      >
        LinkedIn
      </a>
      <button
        onClick={() => navigator.clipboard?.writeText(url)}
        className="px-4 py-2 rounded-lg border border-card-border text-fog text-sm font-medium hover:bg-gray-50 transition-colors"
      >
        Copy Link
      </button>
    </div>
  );
}
