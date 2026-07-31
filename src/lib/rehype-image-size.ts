import fs from "node:fs";
import path from "node:path";

import { imageSize } from "image-size";
import { visit } from "unist-util-visit";
import type { Element, Root } from "hast";

const PUBLIC_DIR = path.join(process.cwd(), "public");

/**
 * Stamps intrinsic width/height onto local `<img>` elements at build time.
 *
 * Markdown image syntax carries no dimensions, so without this every image in
 * a post would reserve no space and shove the text down as it loads. Reading
 * the real size off disk lets `<Mdx>` hand the numbers to `next/image`, which
 * needs them to reserve the box and to generate responsive sources.
 *
 * Only touches paths starting with `/` — remote images are left alone, since
 * their dimensions cannot be known without fetching them.
 */
export function rehypeImageSize() {
  return (tree: Root) => {
    visit(tree, "element", (node: Element) => {
      if (node.tagName !== "img") return;

      const props = node.properties;
      const src = props?.src;
      if (typeof src !== "string" || !src.startsWith("/")) return;
      if (props.width && props.height) return;

      // Strip any query/hash before resolving against the filesystem.
      const file = path.join(PUBLIC_DIR, src.split(/[?#]/)[0]);
      if (!file.startsWith(PUBLIC_DIR) || !fs.existsSync(file)) return;

      try {
        const { width, height } = imageSize(fs.readFileSync(file));
        if (width && height) {
          props.width = width;
          props.height = height;
        }
      } catch {
        // Unreadable or unsupported format — fall back to a plain <img>.
      }
    });
  };
}
