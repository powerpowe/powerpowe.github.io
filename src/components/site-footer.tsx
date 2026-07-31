import Link from "next/link";

import { nav, site } from "@/lib/site";

export function SiteFooter() {
  return (
    <footer className="no-print border-t border-hairline">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-5 py-10 font-label text-xs text-faint sm:px-8">
        <span>
          © {new Date().getFullYear()} {site.name}
        </span>

        <div className="flex items-center gap-4">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="transition-colors hover:text-accent"
            >
              {item.label}
            </Link>
          ))}
          <a href="/rss.xml" className="transition-colors hover:text-accent">
            RSS
          </a>
        </div>
      </div>
    </footer>
  );
}
