import Image from "next/image";
import Link from "next/link";
import type { ComponentPropsWithoutRef } from "react";
import type { MDXComponents } from "mdx/types";
import { MDXRemote } from "next-mdx-remote/rsc";
import rehypeKatex from "rehype-katex";
import rehypePrettyCode from "rehype-pretty-code";
import rehypeSlug from "rehype-slug";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import remarkUnwrapImages from "remark-unwrap-images";

import { rehypeImageSize } from "@/lib/rehype-image-size";

/**
 * Markdown images. `rehypeImageSize` has already stamped on the intrinsic
 * dimensions of anything living under `public/`, so those go through
 * `next/image` for responsive sources and reserved space. Remote images and
 * SVGs fall back to a plain tag — remote size is unknowable at build time, and
 * `next/image` refuses SVG unless `dangerouslyAllowSVG` is on (it isn't, and
 * an SVG gains nothing from the optimiser anyway).
 *
 * A markdown title — `![alt](/x.png "caption")` — becomes a <figcaption>.
 */
function MdxImage({
  src,
  alt = "",
  title,
  width,
  height,
}: ComponentPropsWithoutRef<"img">) {
  if (typeof src !== "string") return null;

  const isLocalRaster =
    src.startsWith("/") && !src.endsWith(".svg") && width && height;

  const image = isLocalRaster ? (
    <Image
      src={src}
      alt={alt}
      width={Number(width)}
      height={Number(height)}
      // The article column is ~700px at most; below `lg` it is the viewport.
      sizes="(min-width: 1024px) 700px, 100vw"
      className="h-auto w-full"
    />
  ) : (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt={alt} loading="lazy" decoding="async" />
  );

  if (!title) return image;

  return (
    <figure>
      {image}
      <figcaption>{title}</figcaption>
    </figure>
  );
}

const components: MDXComponents = {
  img: MdxImage,
  a: ({ href = "", ...props }: ComponentPropsWithoutRef<"a">) => {
    if (href.startsWith("/")) return <Link href={href} {...props} />;
    if (href.startsWith("#")) return <a href={href} {...props} />;
    return <a href={href} target="_blank" rel="noreferrer" {...props} />;
  },
  // Wide tables scroll in their own box rather than pushing the page sideways.
  table: (props: ComponentPropsWithoutRef<"table">) => (
    <div className="table-scroll">
      <table {...props} />
    </div>
  ),
};

const prettyCodeOptions = {
  theme: { light: "github-light", dark: "github-dark" },
  // Let globals.css own the code block background so it matches the palette.
  keepBackground: false,
} as const;

export function Mdx({ source }: { source: string }) {
  return (
    <MDXRemote
      source={source}
      components={components}
      options={{
        mdxOptions: {
          remarkPlugins: [
            remarkGfm,
            remarkMath,
            // A lone image would otherwise sit inside a <p>, which cannot
            // legally contain the <figure> a captioned image renders as.
            remarkUnwrapImages,
          ],
          rehypePlugins: [
            rehypeSlug,
            rehypeImageSize,
            [rehypePrettyCode, prettyCodeOptions],
            rehypeKatex,
          ],
        },
      }}
    />
  );
}
