import fs from "node:fs";
import path from "node:path";

const PUBLIC_DIR = path.join(process.cwd(), "public");

const cache = new Map<string, boolean>();

/**
 * Whether an image under `public/` can carry transparency.
 *
 * Read from the file header rather than guessed from the extension, because
 * "is it a PNG" and "does it have an alpha channel" are different questions —
 * plenty of PNGs are exported as opaque RGB with a background baked in, and
 * those need the same backing tile a JPEG does.
 *
 * This reports whether an alpha *channel* exists, not whether any pixel is
 * actually transparent; deciding that would mean decoding the image. An
 * opaque-but-alpha-carrying PNG will read as transparent here.
 */
export function supportsTransparency(src: string): boolean {
  if (!src.startsWith("/")) return true;

  const cached = cache.get(src);
  if (cached !== undefined) return cached;

  const file = path.join(PUBLIC_DIR, src.split(/[?#]/)[0]);
  let result = true;

  if (file.startsWith(PUBLIC_DIR) && fs.existsSync(file)) {
    try {
      result = detect(fs.readFileSync(file), path.extname(file).toLowerCase());
    } catch {
      result = true; // Unreadable — assume the logo is fine as-is.
    }
  }

  cache.set(src, result);
  return result;
}

function detect(buf: Buffer, ext: string): boolean {
  // JPEG has no alpha channel in any variant.
  if (ext === ".jpg" || ext === ".jpeg") return false;

  // SVG is markup — transparent unless it paints its own background.
  if (ext === ".svg") return true;

  if (isPng(buf)) return pngHasAlpha(buf);
  if (isWebp(buf)) return webpHasAlpha(buf);

  // GIF, AVIF and anything unrecognised: assume it can be transparent.
  return true;
}

function isPng(buf: Buffer): boolean {
  return buf.length > 26 && buf.toString("binary", 1, 4) === "PNG";
}

/**
 * IHDR colour type lives at byte 25: 4 = grey+alpha, 6 = RGBA. Palette images
 * (3) carry transparency in a separate tRNS chunk.
 */
function pngHasAlpha(buf: Buffer): boolean {
  const colorType = buf[25];
  if (colorType === 4 || colorType === 6) return true;
  if (colorType === 3) return buf.includes(Buffer.from("tRNS", "binary"));
  return false;
}

function isWebp(buf: Buffer): boolean {
  return (
    buf.length > 16 &&
    buf.toString("binary", 0, 4) === "RIFF" &&
    buf.toString("binary", 8, 12) === "WEBP"
  );
}

function webpHasAlpha(buf: Buffer): boolean {
  const format = buf.toString("binary", 12, 16);
  // Extended format: bit 4 of the flags byte marks an alpha channel.
  if (format === "VP8X") return (buf[20] & 0x10) !== 0;
  // Lossless always carries alpha; plain lossy VP8 never does.
  if (format === "VP8L") return true;
  return false;
}
