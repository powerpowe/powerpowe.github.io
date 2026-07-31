"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { nav } from "@/lib/site";

export function HeaderNav() {
  const pathname = usePathname();

  return (
    <nav className="flex items-center gap-1 sm:gap-2" aria-label="주요">
      {nav.map((item) => {
        // Nothing is active on the landing page — it is a front door, not one
        // of the sections. Tag pages count as part of Writing.
        const active =
          pathname === item.href ||
          pathname.startsWith(`${item.href}/`) ||
          (item.href === "/blog" && pathname.startsWith("/tags/"));

        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={active ? "page" : undefined}
            className={`px-2 py-1 font-label text-xs uppercase tracking-[0.12em] transition-colors ${
              active ? "text-foreground" : "text-faint hover:text-foreground"
            }`}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
