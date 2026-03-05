"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/tools", label: "Tools" },
  { href: "/content", label: "Content" },
];

export default function Navigation() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  return (
    <>
      <nav
        aria-label="Main navigation"
        className={`fixed top-0 left-0 right-0 z-50 h-[72px] flex items-center transition-colors duration-300 ${
          scrolled
            ? "bg-white/90 backdrop-blur-lg border-b border-card-border"
            : "bg-transparent"
        }`}
      >
        <div className="mx-auto w-full max-w-[1200px] px-4 sm:px-6 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="text-xl font-bold tracking-tight text-obsidian">
            DUDU BITCOIN
          </Link>

          {/* Center nav links - desktop */}
          <ul className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className={`relative text-sm font-medium transition-colors duration-200 pb-1 ${
                      isActive
                        ? "text-obsidian"
                        : "text-fog hover:text-obsidian"
                    }`}
                  >
                    {link.label}
                    {isActive && (
                      <span className="absolute left-0 right-0 -bottom-0.5 h-0.5 bg-primary rounded-full" />
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>

          {/* Right side */}
          <div className="flex items-center gap-4">
            <Link
              href="/#newsletter"
              className="hidden md:inline-flex items-center px-5 py-2 text-sm font-semibold rounded-full bg-primary text-white hover:brightness-110 transition-all duration-200"
            >
              Get the Signal
            </Link>

            {/* Mobile hamburger */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden flex flex-col justify-center items-center w-11 h-11 gap-1.5"
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
              aria-expanded={mobileOpen}
            >
              <span
                className={`block w-6 h-0.5 bg-obsidian transition-all duration-300 ${
                  mobileOpen ? "rotate-45 translate-y-2" : ""
                }`}
              />
              <span
                className={`block w-6 h-0.5 bg-obsidian transition-all duration-300 ${
                  mobileOpen ? "opacity-0" : ""
                }`}
              />
              <span
                className={`block w-6 h-0.5 bg-obsidian transition-all duration-300 ${
                  mobileOpen ? "-rotate-45 -translate-y-2" : ""
                }`}
              />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile drawer overlay */}
      {mobileOpen && (
        <nav aria-label="Mobile navigation" className="fixed inset-0 z-40 bg-white flex flex-col items-center justify-center gap-8 md:hidden">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className={`text-3xl font-semibold transition-colors ${
                  isActive ? "text-primary" : "text-fog hover:text-obsidian"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
          <Link
            href="/#newsletter"
            onClick={() => setMobileOpen(false)}
            className="mt-4 px-8 py-3 text-lg font-semibold rounded-full bg-primary text-white hover:brightness-110 transition-all duration-200"
          >
            Get the Signal
          </Link>
        </nav>
      )}
    </>
  );
}
