import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

const CONTENT_DIR = path.join(process.cwd(), "content", "blog");

export type Post = {
  slug: string;
  title: string;
  summary: string;
  date: string;
  /** ISO date, for <time dateTime> and RSS. */
  isoDate: string;
  tags: string[];
  draft: boolean;
  readingMinutes: number;
  body: string;
};

/**
 * Korean prose runs far denser per character than English, so a single
 * words-per-minute figure is misleading. Weight CJK codepoints separately.
 */
function estimateReadingMinutes(body: string): number {
  const text = body
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/!?\[([^\]]*)\]\([^)]*\)/g, "$1")
    .replace(/[#>*_`~|-]/g, " ");

  const cjk = (text.match(/[ㄱ-힝一-鿿぀-ヿ]/g) ?? [])
    .length;
  const words = text
    .replace(/[ㄱ-힝一-鿿぀-ヿ]/g, " ")
    .split(/\s+/)
    .filter(Boolean).length;

  return Math.max(1, Math.round(cjk / 500 + words / 220));
}

function formatDate(iso: string): string {
  return new Date(`${iso}T00:00:00Z`).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  });
}

function readPost(fileName: string): Post {
  const slug = fileName.replace(/\.mdx?$/, "");
  const raw = fs.readFileSync(path.join(CONTENT_DIR, fileName), "utf8");
  const { data, content } = matter(raw);

  if (!data.title || !data.date) {
    throw new Error(`content/blog/${fileName}: 'title' and 'date' are required`);
  }

  const isoDate = new Date(data.date).toISOString().slice(0, 10);

  return {
    slug,
    title: String(data.title),
    summary: String(data.summary ?? ""),
    date: formatDate(isoDate),
    isoDate,
    tags: Array.isArray(data.tags) ? data.tags.map(String) : [],
    draft: data.draft === true,
    readingMinutes: estimateReadingMinutes(content),
    body: content,
  };
}

/** All publishable posts, newest first. Drafts are excluded outside dev. */
export function getPosts(): Post[] {
  if (!fs.existsSync(CONTENT_DIR)) return [];

  return fs
    .readdirSync(CONTENT_DIR)
    .filter((f) => /\.mdx?$/.test(f))
    .map(readPost)
    .filter((p) => !p.draft || process.env.NODE_ENV === "development")
    .sort((a, b) => b.isoDate.localeCompare(a.isoDate));
}

export function getPost(slug: string): Post | undefined {
  return getPosts().find((p) => p.slug === slug);
}

export function getAllTags(): string[] {
  const tags = new Set<string>();
  for (const post of getPosts()) {
    for (const tag of post.tags) tags.add(tag);
  }
  return [...tags].sort();
}

export function getPostsByTag(tag: string): Post[] {
  return getPosts().filter((p) => p.tags.includes(tag));
}
