"use client";

import { useEffect, useState } from "react";

export type CvSection = { id: string; label: string };

/**
 * Sticky section index for the CV.
 *
 * Hidden below `lg` — 130px of rail would come out of the content column on a
 * phone, where the page is short enough to scroll anyway — and hidden in print,
 * where a jump list means nothing.
 */
export function CvNav({ sections }: { sections: CvSection[] }) {
  const active = useScrollSpy(sections.map((s) => s.id));

  return (
    <nav
      className="no-print hidden lg:block"
      aria-label="CV 섹션"
    >
      <ul className="sticky top-24 space-y-1">
        {sections.map((section) => {
          const isActive = section.id === active;
          return (
            <li key={section.id}>
              <a
                href={`#${section.id}`}
                aria-current={isActive ? "true" : undefined}
                className="group flex items-center py-1.5"
              >
                <span
                  className={`mr-3 h-px transition-all duration-200 ${
                    isActive
                      ? "w-6 bg-accent"
                      : "w-3 bg-hairline group-hover:w-6 group-hover:bg-foreground"
                  }`}
                />
                <span
                  className={`font-label text-[0.6875rem] uppercase tracking-[0.15em] transition-colors ${
                    isActive
                      ? "text-foreground"
                      : "text-faint group-hover:text-foreground"
                  }`}
                >
                  {section.label}
                </span>
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

/** Id of the topmost section currently intersecting the viewport. */
function useScrollSpy(ids: string[]) {
  const [active, setActive] = useState<string>();
  // Re-run only when the set of ids actually changes, not on every render.
  const key = ids.join(",");

  useEffect(() => {
    const sectionIds = key ? key.split(",") : [];
    const elements = sectionIds
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);

    if (elements.length === 0) return;

    const visible = new Set<string>();

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) visible.add(entry.target.id);
          else visible.delete(entry.target.id);
        }
        // Document order, so the highest section on screen wins.
        const first = sectionIds.find((id) => visible.has(id));
        if (first) setActive(first);
      },
      // Biased to the upper half so a section lights up as it arrives rather
      // than once it fills the screen.
      { rootMargin: "-15% 0px -70% 0px" },
    );

    for (const el of elements) observer.observe(el);
    return () => observer.disconnect();
  }, [key]);

  return active;
}
