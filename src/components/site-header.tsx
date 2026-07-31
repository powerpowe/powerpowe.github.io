import Link from "next/link";

import { HeaderNav } from "@/components/header-nav";
import { ThemeToggle } from "@/components/theme-toggle";
import { site } from "@/lib/site";

export function SiteHeader() {
  return (
    <header className="no-print sticky top-0 z-40 border-b border-hairline bg-background">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-5 sm:px-8">
        {/* No mark beside the name — the wordmark is the typography. It uses
            the label face, so it stays in family with the nav and dates. */}
        <Link
          href="/"
          className="font-label text-sm tracking-tight transition-colors hover:text-accent"
        >
          {site.logo}
        </Link>

        <div className="flex items-center gap-1 sm:gap-3">
          <HeaderNav />
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
