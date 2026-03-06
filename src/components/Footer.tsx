import Link from "next/link";
import EmailCapture from "./EmailCapture";

const navigation = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/content", label: "Content" },
];

const contentLinks = [
  { href: "/content", label: "Newsletter" },
  { href: "/content", label: "Deep Dives" },
  { href: "/content", label: "Podcast" },
  { href: "/content", label: "Videos" },
];

const socials = [
  {
    label: "LinkedIn",
    href: "https://linkedin.com/in/davidazaraf",
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
      </svg>
    ),
  },
  {
    label: "X / Twitter",
    href: "https://x.com/dudu_bitcoin",
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
  },
  {
    label: "YouTube",
    href: "https://youtube.com/@dudubitcoin",
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
      </svg>
    ),
  },
];

export default function Footer() {
  return (
    <footer className="bg-obsidian">
      {/* Newsletter strip */}
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-16 border-b border-white/10">
        <EmailCapture
          headline="Join the Inner Circle"
          subtext="Weekly insights on Bitcoin, abundance, and building distribution. Free."
        />
      </div>

      {/* Columns */}
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-12 grid grid-cols-2 md:grid-cols-4 gap-8">
        {/* Brand */}
        <div className="col-span-2 md:col-span-1">
          <Link href="/" className="text-lg font-bold text-white">
            DUDU BITCOIN
          </Link>
          <p className="mt-3 text-sm text-white/50 leading-relaxed">
            Growth Architect for the Agentic Economy.
          </p>
        </div>

        {/* Navigation */}
        <nav aria-label="Footer navigation">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-white/40 mb-4">
            Navigation
          </h4>
          <ul className="flex flex-col gap-2.5">
            {navigation.map((link) => (
              <li key={link.label}>
                <Link
                  href={link.href}
                  className="text-sm text-white/60 hover:text-white transition-colors link-underline"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Content */}
        <nav aria-label="Content links">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-white/40 mb-4">
            Content
          </h4>
          <ul className="flex flex-col gap-2.5">
            {contentLinks.map((link) => (
              <li key={link.label}>
                <Link
                  href={link.href}
                  className="text-sm text-white/60 hover:text-white transition-colors link-underline"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Connect */}
        <div>
          <h4 className="text-xs font-semibold uppercase tracking-wider text-white/40 mb-4">
            Connect
          </h4>
          <div className="flex gap-3">
            {socials.map((social) => (
              <a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={social.label}
                className="w-10 h-10 flex items-center justify-center rounded-lg bg-white/5 text-white/60 hover:text-primary hover:bg-primary/10 transition-all duration-200"
              >
                {social.icon}
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-6 border-t border-white/10">
        <p className="text-xs text-white/30 text-center">
          &copy; {new Date().getFullYear()} Dudu Bitcoin. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
