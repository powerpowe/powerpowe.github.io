/**
 * Single source of truth for identity, metadata and nav.
 * Edit this file first — most of the site reads from here.
 */
export const site = {
  name: "Byungjoon Lee",
  nameKo: "이병준",
  // Header wordmark. Set in mono, lowercase, handle-style — no icon or mark
  // beside it, so this string is doing all the work. Keep it short.
  logo: "byungjoon.lee",
  role: "AI Engineer",
  affiliation: "Nurimedia (DBpia)",
  url: "https://powerpowe.github.io",
  locale: "ko_KR",
  // Shown as the search-result snippet and in link previews. Not in the tab.
  description: "AI 기술 리뷰와 일상을 올리는 블로그입니다.",
  // One or two sentences under the name on the home page. Supports <em>.
  tagline:
    "👋 Welcome to Byungjoon.lee blog",
  email: "2001lbj49@gmail.com",
  links: {
    github: "https://github.com/powerpowe",
    linkedin: "https://www.linkedin.com/in/byung-joon-lee/",
    scholar: "https://scholar.google.com/citations?user=WE0Z-u0AAAAJ&hl=ko",
    cv: "/cv",
  },
} as const;

export const nav = [
  { href: "/blog", label: "Writing" },
  { href: "/about", label: "About" },
  { href: "/cv", label: "CV" },
] as const;

/** Social row on the home page. Empty `href` entries are skipped. */
export const socials = [
  { label: "GitHub", href: site.links.github },
  { label: "LinkedIn", href: site.links.linkedin },
  { label: "Google Scholar", href: site.links.scholar },
  { label: "Email", href: `mailto:${site.email}` },
  { label: "CV", href: site.links.cv },
] as const;
