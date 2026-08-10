import fs from "node:fs";
import path from "node:path";

/**
 * Copies images that live beside posts in `content/blog/` into `public/`.
 *
 * Posts and their figures belong together — you should be able to delete a post
 * and its images in one go, and see what a post owns without hunting through a
 * shared image folder. But `content/` is not served: only `public/` is copied
 * into the static export. So the files are mirrored here, at build time.
 *
 * The destination is generated and gitignored; `content/blog/` holds the
 * originals. Never edit anything under the destination directly.
 */
const SOURCE = path.join(process.cwd(), "content", "blog");
export const BLOG_ASSETS_DIR = "blog-assets";
const DEST = path.join(process.cwd(), "public", BLOG_ASSETS_DIR);

/** Everything that is not a post is treated as an asset. */
const POST_EXT = /\.mdx?$/i;

function sync() {
  // Rebuild from scratch so a deleted figure does not linger in the export.
  fs.rmSync(DEST, { recursive: true, force: true });

  if (!fs.existsSync(SOURCE)) return 0;

  const assets = fs
    .readdirSync(SOURCE, { withFileTypes: true })
    .filter((e) => e.isFile() && !POST_EXT.test(e.name));

  if (assets.length === 0) return 0;

  fs.mkdirSync(DEST, { recursive: true });
  for (const asset of assets) {
    fs.copyFileSync(path.join(SOURCE, asset.name), path.join(DEST, asset.name));
  }
  return assets.length;
}

const count = sync();
console.log(
  count === 0
    ? "blog assets: none to sync"
    : `blog assets: synced ${count} file${count === 1 ? "" : "s"} → public/${BLOG_ASSETS_DIR}/`,
);
