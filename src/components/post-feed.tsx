import Link from "next/link";

import { AdSlot } from "@/components/ad-slot";
import type { Post } from "@/lib/posts";

/** Insert an in-feed slot after this many posts, repeating. */
const AD_EVERY = 4;

export function PostFeed({
  posts,
  ads = true,
}: {
  posts: Post[];
  ads?: boolean;
}) {
  if (posts.length === 0) {
    return (
      <p className="py-12 text-muted">
        아직 글이 없습니다.{" "}
        <code className="font-mono text-sm">content/blog/</code> 에 `.mdx` 파일을
        추가해 보세요.
      </p>
    );
  }

  return (
    <div className="divide-y divide-hairline border-t border-hairline">
      {posts.map((post, i) => (
        <div key={post.slug}>
          <PostCard post={post} />
          {/* Only between posts — never trailing, and never on short lists. */}
          {ads && (i + 1) % AD_EVERY === 0 && i < posts.length - 1 && (
            <AdSlot name="in-feed" className="my-8" />
          )}
        </div>
      ))}
    </div>
  );
}

function PostCard({ post }: { post: Post }) {
  return (
    <article className="group relative py-8">
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 font-label text-xs text-faint">
        <time dateTime={post.isoDate} className="tabular-nums">
          {post.isoDate}
        </time>
        <span aria-hidden="true">·</span>
        <span>{post.readingMinutes} min</span>
      </div>

      <h2 className="mt-2.5 font-display text-xl font-semibold leading-snug tracking-tight transition-colors group-hover:text-accent sm:text-[1.375rem]">
        <Link href={`/blog/${post.slug}`}>
          {/* Stretched link: the whole card is the hit area, but tag links
              below stay clickable because they sit above it in z-order. */}
          <span className="absolute inset-0" aria-hidden="true" />
          {post.title}
        </Link>
      </h2>

      {post.summary && (
        <p className="mt-2.5 leading-relaxed text-muted">{post.summary}</p>
      )}

      {post.tags.length > 0 && (
        <div className="relative z-10 mt-3.5 flex flex-wrap gap-x-3 gap-y-1">
          {post.tags.map((tag) => (
            <Link
              key={tag}
              href={`/tags/${tag}`}
              className="font-label text-[0.6875rem] text-faint transition-colors hover:text-accent"
            >
              #{tag}
            </Link>
          ))}
        </div>
      )}
    </article>
  );
}
