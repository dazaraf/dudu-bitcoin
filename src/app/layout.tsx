import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";
import Script from "next/script";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import LeadMagnetPopup from "@/components/LeadMagnetPopup";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-display",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://dudubitcoin.com"),
  title: "Dudu Bitcoin | Growth Architect for the Agentic Economy",
  description:
    "Growth architect helping founders and builders win the agentic economy. 50+ expert conversations, 500K+ views, weekly signal for 11K+ subscribers.",
  icons: {
    icon: "/icon.svg",
  },
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "Dudu Bitcoin",
    title: "Dudu Bitcoin | Growth Architect for the Agentic Economy",
    description:
      "Growth architect helping founders and builders win the agentic economy. 50+ expert conversations, 500K+ views, weekly signal for 11K+ subscribers.",
  },
  twitter: {
    card: "summary_large_image",
    creator: "@dudu_bitcoin",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Person",
      name: "David Azaraf",
      alternateName: "Dudu Bitcoin",
      jobTitle: "Growth Architect for the Agentic Economy",
      description:
        "Growth architect helping founders and builders win the agentic economy. Strategic consultant, livestream host, AI optimist, and Bitcoiner.",
      url: "https://dudubitcoin.com",
      sameAs: [
        "https://www.linkedin.com/in/davidazaraf/",
        "https://x.com/dudu_bitcoin",
        "https://www.youtube.com/@dudubitcoin",
      ],
    },
    {
      "@type": "WebSite",
      name: "Dudu Bitcoin",
      url: "https://dudubitcoin.com",
      description:
        "Growth architect helping founders and builders win the agentic economy. 50+ expert conversations, 500K+ views, weekly signal for 11K+ subscribers.",
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <Script src="https://www.googletagmanager.com/gtag/js?id=G-1HY2RZP2Y1" strategy="afterInteractive" />
      <Script id="gtag-init" strategy="afterInteractive">
        {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', 'G-1HY2RZP2Y1');`}
      </Script>
      <body className={`${inter.variable} ${spaceGrotesk.variable} antialiased`}>
        <a href="#main-content" className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:bg-primary focus:text-black focus:rounded-full focus:font-semibold focus:text-sm">
          Skip to main content
        </a>
        <Navigation />
        <main id="main-content" className="min-h-screen pt-[72px]">{children}</main>
        <Footer />
        <LeadMagnetPopup />
      </body>
    </html>
  );
}
