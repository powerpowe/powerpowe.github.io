import fs from "node:fs";
import path from "node:path";

import { imageSize } from "image-size";
import { visit } from "unist-util-visit";
import type { Element, Root } from "hast";

const CONTENT_DIR = path.join(process.cwd(), "content", "blog");
const PUBLIC_DIR = path.join(process.cwd(), "public");

/** Must match `BLOG_ASSETS_DIR` in scripts/sync-blog-assets.mjs. */
const BLOG_ASSETS = "blog-assets";

/**
 * Resolves and measures images in posts.
 *
 * Two jobs, both at build time:
 *
 * 1. Rewrites references to figures sitting beside the post — `./chart.png` or
 *    just `chart.png` — to the public path the sync script copies them to. That
 *    lets a post keep its images in `content/blog/` next to the `.mdx`.
 * 2. Stamps intrinsic width/height on every local image. Markdown carries no
 *    dimensions, so without this a figure reserves no space and shoves the text
 *    down as it loads.
 *
 * Remote images are left alone — their size cannot be known without fetching.
 */
export function rehypePostImages() {
  return (tree: Root) => {
    visit(tree, "element", (node: Element) => {
      if (node.tagName !== "img") return;

      const props = node.properties;
      const rawSrc = props?.src;
      if (typeof rawSrc !== "string") return;
      if (/^[a-z]+:/i.test(rawSrc)) return; // http:, data:, mailto: …

      const clean = rawSrc.split(/[?#]/)[0];
      let file: string;

      if (clean.startsWith("/")) {
        // Already an absolute public path.
        file = path.join(PUBLIC_DIR, clean);
      } else {
        // Beside the post. Rewrite to where the sync script puts it.
        const name = clean.replace(/^\.\//, "");
        file = path.join(CONTENT_DIR, name);
        props.src = `/${BLOG_ASSETS}/${name}`;
      }

      if (props.width && props.height) return;
      if (!file.startsWith(PUBLIC_DIR) && !file.startsWith(CONTENT_DIR)) return;
      if (!fs.existsSync(file)) return;

      try {
        const { width, height } = imageSize(fs.readFileSync(file));
        if (width && height) {
          props.width = width;
          props.height = height;
        }
      } catch {
        // Unsupported format — the component falls back to a plain <img>.
      }
    });
  };
}
