"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export type CvSection = { id: string; label: string };

/**
 * Sticky section index for the CV.
 *
 * Hidden below `lg` — 130px of rail would come out of the content column on a
 * phone, where the page is short enough to scroll anyway — and hidden in print,
 * where a jump list means nothing.
 */
export function CvNav({ sections }: { sections: CvSection[] }) {
  const { active, select } = useScrollSpy(sections.map((s) => s.id));

  return (
    <nav className="no-print hidden lg:block" aria-label="CV 섹션">
      <ul className="sticky top-24 space-y-1">
        {sections.map((section) => {
          const isActive = section.id === active;
          return (
            <li key={section.id}>
              <a
                href={`#${section.id}`}
                onClick={() => select(section.id)}
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

/**
 * Id of the section the reader is currently in.
 *
 * Computed from scroll position rather than with IntersectionObserver. An
 * observer answers "is this element inside a band?", which leaves a hole: when
 * no section is in the band, there is no answer, and the highlight silently
 * keeps its last value. That happens routinely on a short page — jump to the
 * final section and the page hits its scroll limit before that section reaches
 * a band near the top, so it never lights up.
 *
 * Asking "which section have I scrolled past?" always has an answer.
 */
function useScrollSpy(ids: string[]) {
  const [active, setActive] = useState<string>();
  /**
   * A click pins its own section until the reader scrolls for themselves.
   *
   * Without this, clicking one of the last entries on a short page highlights
   * a different one: the page bottoms out, so by position the reader really is
   * in the final section. True, but useless as feedback — the question the
   * highlight answers right after a click is "what did I just pick?".
   */
  const pinned = useRef(false);

  // Re-run only when the set of ids actually changes, not on every render.
  const key = ids.join(",");

  const select = useCallback((id: string) => {
    pinned.current = true;
    setActive(id);
  }, []);

  useEffect(() => {
    const sectionIds = key ? key.split(",") : [];
    if (sectionIds.length === 0) return;

    let frame = 0;

    const update = () => {
      frame = 0;
      if (pinned.current) return;

      // The line a section must cross to count as current. Kept below the
      // sticky header so a section is never "current" while hidden behind it.
      const line = Math.max(120, window.innerHeight * 0.25);

      // Bottom of the page: the last section wins outright. Without this the
      // trailing sections of a short page are unreachable, since the scroll
      // runs out before they climb past the line.
      const atBottom =
        window.innerHeight + window.scrollY >=
        document.documentElement.scrollHeight - 2;

      if (atBottom) {
        setActive(sectionIds[sectionIds.length - 1]);
        return;
      }

      // Otherwise the last section whose top has crossed the line, falling
      // back to the first when the reader is still above all of them.
      let current = sectionIds[0];
      for (const id of sectionIds) {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top <= line) current = id;
        else break;
      }
      setActive(current);
    };

    // Coalesce the burst of scroll events a smooth jump produces.
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    // Release the pin only on a gesture the reader made themselves. Plain
    // scroll events are no good here: the smooth jump a click triggers fires
    // them too, which would unpin immediately.
    const unpin = () => {
      pinned.current = false;
      onScroll();
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    window.addEventListener("wheel", unpin, { passive: true });
    window.addEventListener("touchmove", unpin, { passive: true });
    window.addEventListener("keydown", unpin);
    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      window.removeEventListener("wheel", unpin);
      window.removeEventListener("touchmove", unpin);
      window.removeEventListener("keydown", unpin);
    };
  }, [key]);

  return { active, select };
}
