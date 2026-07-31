import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { PostFeed } from "@/components/post-feed";
import { getAllTags, getPostsByTag } from "@/lib/posts";

type Params = { params: Promise<{ tag: string }> };

export function generateStaticParams() {
  return getAllTags().map((tag) => ({ tag }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { tag } = await params;
  return {
    title: `#${tag}`,
    description: `${tag} 태그가 달린 글 목록.`,
    alternates: { canonical: `/tags/${tag}` },
  };
}

export default async function TagPage({ params }: Params) {
  const { tag } = await params;
  const posts = getPostsByTag(decodeURIComponent(tag));
  if (posts.length === 0) notFound();

  return (
    <div className="animate-fade-up">
      <Link
        href="/blog"
        className="font-label text-[0.6875rem] uppercase tracking-[0.15em] text-faint transition-colors hover:text-accent"
      >
        ← Writing
      </Link>

      <div className="mb-8 mt-6 flex items-baseline justify-between gap-4">
        <h1 className="font-display text-2xl font-semibold tracking-tight">
          <span className="text-faint">#</span>
          {decodeURIComponent(tag)}
        </h1>
        <span className="font-label text-[0.6875rem] tabular-nums text-faint">
          {posts.length}
        </span>
      </div>

      <PostFeed posts={posts} ads={false} />
    </div>
  );
}
