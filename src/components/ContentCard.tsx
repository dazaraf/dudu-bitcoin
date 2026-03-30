import Link from "next/link";

interface ContentCardProps {
  title: string;
  date?: string;
  category?: string;
  excerpt?: string;
  thumbnail?: string;
  locked?: boolean;
  href?: string;
}

function getCategoryGradient(category?: string): string {
  switch (category?.toLowerCase()) {
    case "webinar":
      return "bg-gradient-to-br from-white to-[rgba(247,147,26,0.05)]";
    case "article":
      return "bg-gradient-to-br from-white to-[rgba(13,13,13,0.03)]";
    case "livestream":
      return "bg-gradient-to-br from-white to-[rgba(247,247,247,0.8)]";
    default:
      return "bg-white";
  }
}

export default function ContentCard({
  title,
  date,
  category,
  excerpt,
  thumbnail,
  locked = false,
  href,
}: ContentCardProps) {
  const isLive = category?.toLowerCase() === "livestream";

  const card = (
    <article className={`relative overflow-hidden rounded-xl border border-card-border shadow-sm card-hover-lift hover:border-card-hover ${getCategoryGradient(category)}`}>
      {/* Thumbnail */}
      <div className="relative aspect-video overflow-hidden bg-surface">
        {thumbnail ? (
          <img
            src={thumbnail}
            alt={title}
            className={`w-full h-full object-cover ${href ? "transition-transform duration-500 group-hover:scale-105" : ""}`}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-card-border">
            <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
            </svg>
          </div>
        )}

        {/* Lock icon for premium */}
        {locked && (
          <div className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center rounded-full bg-white/80 backdrop-blur-sm shadow-sm">
            <svg className="w-4 h-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
        )}

        {/* Category badge with optional pulse dot */}
        {category && (
          <span className="absolute bottom-3 left-3 px-3 py-1 text-[10px] font-semibold uppercase tracking-wider rounded-full bg-primary text-white inline-flex items-center gap-1.5">
            {isLive && <span className="signal-pulse-dot !w-[6px] !h-[6px]" />}
            {category}
          </span>
        )}
      </div>

      {/* Text content */}
      <div className="p-5">
        {date && (
          <time className="text-xs text-obsidian/60 mb-2 block">{date}</time>
        )}
        <h3 className={`text-base font-semibold text-obsidian mb-2 line-clamp-2 ${href ? "group-hover:text-primary transition-colors duration-200" : ""}`}>
          {title}
        </h3>
        {excerpt && (
          <p className="text-sm text-obsidian/60 line-clamp-2 leading-relaxed">
            {excerpt}
          </p>
        )}
      </div>
    </article>
  );

  if (!href) return card;

  return (
    <Link href={href} className="group block">
      {card}
    </Link>
  );
}
