import { supportsTransparency } from "@/lib/image-alpha";
import { getPublicImageSize } from "@/lib/public-image-size";

/**
 * Default render height. A per-entry `logoHeight` overrides it, because equal
 * canvas height is not equal apparent size — see the note on `logoHeight` in
 * `lib/cv.ts`.
 */
const TARGET_HEIGHT = 28;

/**
 * Overflow guard, not a design target. Wide wordmarks are the reason it exists
 * — at 7.5:1 a logo already spans this much — and anything wider gets scaled
 * down below `TARGET_HEIGHT` rather than running across the column. Keep it
 * loose enough that real logos hit the full height; the widest here is DBpia's
 * 6.67:1, which lands at 187px.
 */
const MAX_WIDTH = 210;

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
export function EntryLogo({
  src,
  org,
  height: targetHeight = TARGET_HEIGHT,
}: {
  src?: string;
  org: string;
  height?: number;
}) {
  if (!src) return null;

  const intrinsic = getPublicImageSize(src);

  // Height first; the width cap only bites on unusually wide marks. No upscale
  // past the file's natural size.
  const scale = intrinsic
    ? Math.min(targetHeight / intrinsic.height, MAX_WIDTH / intrinsic.width, 1)
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
      style={{ width: width ?? "auto", height: height ?? targetHeight }}
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
