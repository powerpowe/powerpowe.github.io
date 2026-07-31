import fs from "node:fs";
import path from "node:path";

import { imageSize } from "image-size";

const PUBLIC_DIR = path.join(process.cwd(), "public");

/** Build-time lookups repeat across pages; the files never change mid-build. */
const cache = new Map<string, { width: number; height: number } | null>();

/**
 * Intrinsic dimensions of a file under `public/`, addressed by its URL path
 * (e.g. "/images/logos/dbpia.webp"). Returns null for remote URLs, missing
 * files, or formats `image-size` cannot parse.
 *
 * Server-side only — it reads from disk.
 */
export function getPublicImageSize(
  src: string,
): { width: number; height: number } | null {
  if (!src.startsWith("/")) return null;

  const cached = cache.get(src);
  if (cached !== undefined) return cached;

  let result: { width: number; height: number } | null = null;
  const file = path.join(PUBLIC_DIR, src.split(/[?#]/)[0]);

  // Guard against a `..` in the path escaping public/.
  if (file.startsWith(PUBLIC_DIR) && fs.existsSync(file)) {
    try {
      const { width, height } = imageSize(fs.readFileSync(file));
      if (width && height) result = { width, height };
    } catch {
      // Unsupported format — callers fall back to intrinsic sizing.
    }
  }

  cache.set(src, result);
  return result;
}
