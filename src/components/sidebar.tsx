import Link from "next/link";

import { AdSlot } from "@/components/ad-slot";
import { getPosts } from "@/lib/posts";

/**
 * Right column. Hidden below `lg` — on narrow screens the content is the whole
 * page and the ad moves in-feed instead.
 *
 * No identity blurb here: it read as a duplicate next to /about and /cv, which
 * already say the same thing at full size. What is left is navigation between
 * topics plus the ad, which sticks so it keeps dwell time as the page scrolls.
 */
export function Sidebar() {
  const tags = topTags(6);

  return (
    <aside className="no-print hidden lg:block">
      <div className="space-y-10">
        {tags.length > 0 && (
          <section>
            <h2 className="font-label text-[0.6875rem] uppercase tracking-[0.2em] text-faint">
              Topics
            </h2>
            <ul className="mt-3 space-y-1">
              {tags.map(([tag, count]) => (
                <li key={tag}>
                  <Link
                    href={`/tags/${tag}`}
                    className="group flex items-baseline justify-between gap-2 py-0.5 text-sm"
                  >
                    <span className="text-muted transition-colors group-hover:text-accent">
                      {tag}
                    </span>
                    <span className="font-label text-xs tabular-nums text-faint">
                      {count}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}

        <div className="sticky top-24">
          <AdSlot name="sidebar" />
        </div>
      </div>
    </aside>
  );
}

function topTags(limit: number): [string, number][] {
  const counts = new Map<string, number>();
  for (const post of getPosts()) {
    for (const tag of post.tags) {
      counts.set(tag, (counts.get(tag) ?? 0) + 1);
    }
  }
  return [...counts.entries()].sort((a, b) => b[1] - a[1]).slice(0, limit);
}
