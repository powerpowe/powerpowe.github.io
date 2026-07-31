import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { AdSlot } from "@/components/ad-slot";
import { Mdx } from "@/components/mdx";
import { getPost, getPosts } from "@/lib/posts";
import { site } from "@/lib/site";

type Params = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return getPosts().map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return {};

  return {
    title: post.title,
    description: post.summary,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: {
      type: "article",
      title: post.title,
      description: post.summary,
      url: `${site.url}/blog/${post.slug}`,
      publishedTime: post.isoDate,
      authors: [site.name],
      tags: [...post.tags],
    },
  };
}

export default async function PostPage({ params }: Params) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();

  const others = getPosts()
    .filter((p) => p.slug !== post.slug)
    .slice(0, 3);

  return (
    <article className="animate-fade-up">
      <Link
        href="/blog"
        className="no-print font-label text-[0.6875rem] uppercase tracking-[0.15em] text-faint transition-colors hover:text-accent"
      >
        ← Writing
      </Link>

      <header className="mt-6">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 font-label text-xs text-faint">
          <time dateTime={post.isoDate} className="tabular-nums">
            {post.isoDate}
          </time>
          <span aria-hidden="true">·</span>
          <span>{post.readingMinutes} min</span>
        </div>

        <h1 className="display-tight mt-4 text-[2rem] font-semibold sm:text-[2.5rem]">
          {post.title}
        </h1>

        {post.summary && (
          <p className="mt-5 text-[1.0625rem] leading-relaxed text-muted">
            {post.summary}
          </p>
        )}

        {post.tags.length > 0 && (
          <div className="no-print mt-5 flex flex-wrap gap-x-3 gap-y-1">
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
      </header>

      <AdSlot name="in-article" className="mt-10" />

      {/* Cap the measure independently of the column so long-form stays
          readable even on very wide screens. */}
      <div className="prose mt-12 max-w-[68ch]">
        <Mdx source={post.body} />
      </div>

      {others.length > 0 && (
        <section className="no-print mt-20 border-t border-hairline pt-8">
          <h2 className="font-label text-[0.6875rem] uppercase tracking-[0.2em] text-faint">
            More
          </h2>
          <ul className="mt-4 space-y-1">
            {others.map((other) => (
              <li key={other.slug}>
                <Link
                  href={`/blog/${other.slug}`}
                  className="group -mx-3 flex items-baseline gap-4 rounded-md px-3 py-2.5 transition-colors hover:bg-surface"
                >
                  <time
                    dateTime={other.isoDate}
                    className="hidden w-24 shrink-0 font-label text-xs tabular-nums text-faint sm:block"
                  >
                    {other.isoDate}
                  </time>
                  <span className="font-display text-sm font-medium leading-snug tracking-tight transition-colors group-hover:text-accent">
                    {other.title}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}
    </article>
  );
}
