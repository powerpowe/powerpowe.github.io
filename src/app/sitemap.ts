import type { MetadataRoute } from "next";

import { getAllTags, getPosts } from "@/lib/posts";
import { site } from "@/lib/site";

// Required by `output: "export"`, and harmless otherwise — this file has
// no request-time inputs.
export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = ["", "/blog", "/about", "/cv"].map((route) => ({
    url: `${site.url}${route}`,
    changeFrequency: "weekly" as const,
    priority: route === "" || route === "/blog" ? 1 : 0.7,
  }));

  const postRoutes = getPosts().map((post) => ({
    url: `${site.url}/blog/${post.slug}`,
    lastModified: post.isoDate,
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  const tagRoutes = getAllTags().map((tag) => ({
    url: `${site.url}/tags/${tag}`,
    changeFrequency: "weekly" as const,
    priority: 0.4,
  }));

  return [...staticRoutes, ...postRoutes, ...tagRoutes];
}
