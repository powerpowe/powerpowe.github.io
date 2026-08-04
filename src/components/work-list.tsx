import type { ReactNode } from "react";

import { highlightAuthors, type CvWork } from "@/lib/cv";
import { getPublicImageSize } from "@/lib/public-image-size";

/** Rendered width of the teaser figure, in px. Height follows the aspect. */
const THUMB_WIDTH = 176;

/**
 * Papers and projects: teaser figure on the left, details on the right.
 *
 * The figure earns the space — a paper's teaser communicates the idea faster
 * than its title, which is why academic homepages are laid out this way. The
 * column collapses below `sm`, where 176px of image would leave nothing for
 * the text.
 */
export function WorkList({ works }: { works: CvWork[] }) {
  return (
    <ul className="space-y-9">
      {works.map((work) => (
        <li
          key={work.title}
          className="print-break-avoid flex flex-col gap-4 sm:flex-row sm:gap-6"
        >
          <Thumb src={work.thumb} title={work.title} />

          <div className="min-w-0 flex-1">
            <h3 className="font-display font-medium leading-snug tracking-tight">
              {work.links?.length ? (
                <a
                  href={work.links[0].href}
                  className="transition-colors hover:text-accent"
                >
                  {work.title}
                </a>
              ) : (
                work.title
              )}
            </h3>

            {work.authors && (
              <p className="mt-1.5 text-sm leading-relaxed text-muted">
                <Authors names={work.authors} />
              </p>
            )}

            <p className="mt-1.5 text-sm italic text-foreground">
              {work.venue}
              {work.note && (
                <span className="not-italic text-accent"> · {work.note}</span>
              )}
            </p>

            {work.links && work.links.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1">
                {work.links.map((link) => (
                  <a
                    key={link.label}
                    href={link.href}
                    className="font-label text-xs text-faint transition-colors hover:text-accent"
                  >
                    [{link.label}]
                  </a>
                ))}
              </div>
            )}
          </div>
        </li>
      ))}
    </ul>
  );
}

function Thumb({ src, title }: { src?: string; title: string }) {
  if (!src) return null;

  // Read the real dimensions at build time so the row reserves its box and
  // nothing jumps as figures load.
  const intrinsic = getPublicImageSize(src);
  const height = intrinsic
    ? Math.round((THUMB_WIDTH * intrinsic.height) / intrinsic.width)
    : undefined;

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      // The title sits right beside it, so a description here would be
      // duplicate noise for a screen reader.
      alt=""
      aria-hidden="true"
      loading="lazy"
      decoding="async"
      title={title}
      width={THUMB_WIDTH}
      height={height}
      style={{ width: THUMB_WIDTH, height }}
      className="shrink-0 rounded border border-hairline bg-white object-contain"
    />
  );
}

/**
 * Bolds your own name wherever it appears, so a reader scanning a long author
 * list finds you without reading it. Matches a trailing asterisk too, so the
 * co-first-author marker stays attached to the name.
 */
function Authors({ names }: { names: string }) {
  const pattern = highlightAuthors
    .map((n) => n.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"))
    .join("|");

  if (!pattern) return <>{names}</>;

  const parts = names.split(new RegExp(`((?:${pattern})\\*?)`, "g"));
  const out: ReactNode[] = parts.map((part, i) =>
    // Odd indices are the captured matches.
    i % 2 === 1 ? (
      <strong key={i} className="font-semibold text-foreground">
        {part}
      </strong>
    ) : (
      part
    ),
  );

  return <>{out}</>;
}
