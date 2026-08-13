import type { Metadata } from "next";
import dynamic from "next/dynamic";
import { JetBrains_Mono } from "next/font/google";
import ReactDOM from "react-dom";

import "./globals.css";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { ThemeScript } from "@/components/theme-script";
import { site } from "@/lib/site";

// Wanted Sans carries both headings and body. It comes from the CDN
// stylesheet linked in <head> rather than next/font, so only the mono is
// registered here; its stacks live in globals.css as --display-font /
// --sans-font.
const WANTED_SANS_CSS =
  "https://cdn.jsdelivr.net/gh/wanteddev/wanted-sans@v1.0.3/packages/wanted-sans/fonts/webfonts/variable/split/WantedSansVariable.min.css";

// Dynamic rather than a static import guarded by NODE_ENV: a static import
// stays in the module graph even when the branch is statically false, and ends
// up in a client chunk the browser downloads. This way the switcher is split
// into a chunk that production never references.
const FontSwitcher =
  process.env.NODE_ENV === "development"
    ? dynamic(() =>
        import("@/components/font-switcher").then((m) => m.FontSwitcher),
      )
    : null;

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    // The tab shows the name alone; the description belongs in the meta tag,
    // where search results and link previews read it.
    default: site.name,
    template: `%s · ${site.name}`,
  },
  description: site.description,
  authors: [{ name: site.name, url: site.url }],
  openGraph: {
    type: "website",
    locale: site.locale,
    url: site.url,
    siteName: site.name,
    title: site.name,
    description: site.description,
  },
  twitter: { card: "summary_large_image" },
  alternates: {
    canonical: "/",
    types: { "application/rss+xml": `${site.url}/rss.xml` },
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  // The `split` build: 92 unicode-range subsets, so the browser fetches only
  // the chunks whose glyphs the page renders. No font preload — with a split
  // face there is no single file worth fetching early, and which chunks a page
  // needs depends on its text.
  //
  // preinit rather than a literal <link>: React hoists stylesheets rendered in
  // <head> and would emit the tag twice.
  ReactDOM.preinit(WANTED_SANS_CSS, { as: "style" });

  return (
    // suppressHydrationWarning: ThemeScript sets data-theme before React hydrates.
    <html lang="ko" className="h-full" suppressHydrationWarning>
      <head>
        <ThemeScript />
        <link
          rel="preconnect"
          href="https://cdn.jsdelivr.net"
          crossOrigin="anonymous"
        />
      </head>
      <body
        className={`${jetbrainsMono.variable} flex min-h-full flex-col antialiased`}
      >
        <SiteHeader />

        {/* Whether a route gets the right-hand rail is decided by the
            `(sidebar)` route group, not here — the landing page runs full
            width so the front door reads differently from everything else. */}
        <div className="print-reset flex-1">{children}</div>

        <SiteFooter />

        {/* Typography preview panel — development only. */}
        {FontSwitcher && <FontSwitcher />}
      </body>
    </html>
  );
}
