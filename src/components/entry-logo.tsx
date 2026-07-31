import { getPublicImageSize } from "@/lib/public-image-size";

/** Rendered height, in px. Width follows from the logo's own aspect ratio. */
const HEIGHT = 24;

/** Cap for very wide wordmarks, in px. */
const MAX_WIDTH = 160;

/**
 * Logo above a CV entry.
 *
 * Normalised by *height*, not into a square. Real logos range from 1:1 icons
 * to wordmarks like DBpia's 500×75 (6.67:1) — forcing those into a square box
 * shrinks them to a few pixels tall. Matching the height instead makes every
 * logo read at the same optical weight regardless of shape.
 *
 * Because the resulting widths differ per row, this sits on its own line above
 * the title rather than beside it; otherwise each row's text would start at a
 * different x.
 *
 * The intrinsic size is read off disk at build time so the exact box is
 * reserved before the file loads and the row never shifts.
 */
export function EntryLogo({ src, org }: { src?: string; org: string }) {
  if (!src) return null;

  const intrinsic = getPublicImageSize(src);
  const width = intrinsic
    ? Math.min(
        MAX_WIDTH,
        Math.round((HEIGHT * intrinsic.width) / intrinsic.height),
      )
    : undefined;

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      // The organisation is written next to this in text, so the logo is
      // decorative — announcing it again would just be noise.
      alt=""
      aria-hidden="true"
      loading="lazy"
      decoding="async"
      title={org}
      height={HEIGHT}
      width={width}
      style={{ height: HEIGHT, width: width ?? "auto" }}
      className="mb-2.5 max-w-40 object-contain object-left"
    />
  );
}
