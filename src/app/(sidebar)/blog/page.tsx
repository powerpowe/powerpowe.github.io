import type { Metadata } from "next";

import { PostFeed } from "@/components/post-feed";
import { getPosts } from "@/lib/posts";

export const metadata: Metadata = {
  title: "Writing",
  description: "논문 리뷰와 일하며 배운 것들.",
  alternates: { canonical: "/blog" },
};

export default function BlogPage() {
  const posts = getPosts();

  return (
    <div className="animate-fade-up">
      <div className="mb-8 flex items-baseline justify-between gap-4">
        <h1 className="font-label text-[0.6875rem] uppercase tracking-[0.2em] text-faint">
          Writing
        </h1>
        <span className="font-label text-[0.6875rem] tabular-nums text-faint">
          {posts.length}
        </span>
      </div>

      <PostFeed posts={posts} />
    </div>
  );
}
