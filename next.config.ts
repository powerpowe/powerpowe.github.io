import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /**
   * Static export for GitHub Pages — the build emits plain files into `out/`
   * with no Node server behind them.
   *
   * No `basePath`: this deploys as a *user* site (repo named
   * `powerpowe.github.io`), so it is served from the domain root. A project
   * site at `/repo-name` would need `basePath` and `assetPrefix` set to that
   * path, or every asset 404s.
   */
  output: "export",

  /**
   * GitHub Pages resolves a directory URL to `index.html` inside it. Without
   * this, `/blog` would need `blog.html`, which Pages does not look for.
   */
  trailingSlash: true,

  /**
   * `/_next/image` is a server route and cannot exist on static hosting.
   * Images still render, and blur placeholders still work (they are inlined
   * at build time) — only the on-the-fly resizing is gone. Size images
   * sensibly before committing them.
   */
  images: { unoptimized: true },

  outputFileTracingIncludes: {
    "/blog/**": ["./content/**/*"],
    "/rss.xml": ["./content/**/*"],
  },
};

export default nextConfig;
