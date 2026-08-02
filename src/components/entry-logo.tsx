import { supportsTransparency } from "@/lib/image-alpha";
import { getPublicImageSize } from "@/lib/public-image-size";

/**
 * Bounding box the logo is scaled to fit inside, in px.
 *
 * Fitting a *box* rather than matching a single dimension is what keeps mixed
 * logo shapes at comparable visual weight. Matching height alone made a
 * 6.67:1 wordmark 160px wide while a square crest stayed 24px — same height,
 * wildly different mass. Constraining both lets the wide one use the width
 * budget and the square one use the height budget.
 */
const MAX_WIDTH = 170;
const MAX_HEIGHT = 32;

/** Breathing room between the logo and the tile edge, in px. */
const PADDING = 4;

/**
 * Logo above a CV entry.
 *
 * A transparent logo is drawn as-is, straight on the page. One that cannot be
 * transparent — a JPEG, or a PNG exported without an alpha channel — is put on
 * a white tile instead, so the opaque rectangle it carries reads as deliberate
 * rather than as a mistake against the dark theme. Which case applies is read
 * from the file header at build time, not guessed from the extension.
 *
 * Widths differ per row, so this goes above the title rather than beside it;
 * otherwise each row's text would start at a different x.
 *
 * The intrinsic size is read off disk at build time too, so the exact box is
 * reserved before the file loads and the row never shifts.
 */
export function EntryLogo({ src, org }: { src?: string; org: string }) {
  if (!src) return null;

  const intrinsic = getPublicImageSize(src);

  // Scale to fit inside the box, never up past its natural size.
  const scale = intrinsic
    ? Math.min(MAX_WIDTH / intrinsic.width, MAX_HEIGHT / intrinsic.height, 1)
    : null;

  const width =
    intrinsic && scale ? Math.round(intrinsic.width * scale) : undefined;
  const height =
    intrinsic && scale ? Math.round(intrinsic.height * scale) : undefined;

  const image = (
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
      width={width}
      height={height}
      style={{ width: width ?? "auto", height: height ?? MAX_HEIGHT }}
      className="object-contain"
    />
  );

  if (supportsTransparency(src)) {
    return <span className="mb-2.5 inline-flex">{image}</span>;
  }

  return (
    <span
      className="mb-2.5 inline-flex items-center justify-center rounded border border-hairline bg-white"
      style={{
        padding: PADDING,
        width: width ? width + PADDING * 2 : undefined,
        height: height ? height + PADDING * 2 : undefined,
      }}
    >
      {image}
    </span>
  );
}
