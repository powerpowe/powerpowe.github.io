import type { MetadataRoute } from "next";

import { site } from "@/lib/site";

// Required by `output: "export"`, and harmless otherwise — this file has
// no request-time inputs.
export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: `${site.url}/sitemap.xml`,
  };
}
