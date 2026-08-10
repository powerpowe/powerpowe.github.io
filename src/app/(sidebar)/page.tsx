import Link from "next/link";

import { SectionLabel } from "@/components/section-label";
import { getPosts } from "@/lib/posts";
import { site, socials } from "@/lib/site";

export default function LandingPage() {
  const posts = getPosts();
  const [featured, ...rest] = posts;
  const recent = rest.slice(0, 4);
  const links = socials.filter((s) => s.href && s.label !== "CV");

  return (
    // The group layout supplies <main> and the two-column shell.
    <>
      <section className="animate-fade-up">
        {/* The tagline is the page heading — it says what the site is, which
            is what an <h1> on the root URL should do. */}
        <h1 className="font-display text-2xl font-semibold leading-snug tracking-tight sm:text-[1.75rem]">
          {site.tagline}
        </h1>
        <p className="mt-4 leading-relaxed text-muted">
          읽은 논문, 일하면서 경험한 것들, 그리고 일상을 정리합니다.
        </p>

        <div className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-2">
          {links.map((s) => (
            <a
              key={s.label}
              href={s.href}
              className="font-label text-xs text-faint transition-colors hover:text-accent"
            >
              {s.label}
            </a>
          ))}
        </div>
      </section>

      {featured && (
        <section className="animate-fade-up animate-delay-1 mt-16">
          <SectionLabel>Latest</SectionLabel>

          <Link href={`/blog/${featured.slug}`} className="group block">
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 font-label text-xs text-faint">
              <time dateTime={featured.isoDate} className="tabular-nums">
                {featured.isoDate}
              </time>
              <span aria-hidden="true">·</span>
              <span>{featured.readingMinutes} min</span>
              {featured.tags.map((tag) => (
                <span key={tag}>{tag}</span>
              ))}
            </div>

            {/* h3, not h2 — it sits under the "Latest" section heading.
                Heading level tracks structure, size tracks emphasis. */}
            <h3 className="display-tight mt-3 text-[1.75rem] font-semibold transition-colors group-hover:text-accent sm:text-[2.25rem]">
              {featured.title}
            </h3>

            {featured.summary && (
              <p className="mt-4 text-[1.0625rem] leading-relaxed text-muted">
                {featured.summary}
              </p>
            )}

            <span className="mt-5 inline-flex items-center gap-1.5 font-label text-xs text-accent">
              계속 읽기
              <span className="transition-transform group-hover:translate-x-0.5">
                →
              </span>
            </span>
          </Link>
        </section>
      )}

      {recent.length > 0 && (
        <section className="animate-fade-up animate-delay-2 mt-16">
          <SectionLabel
            action={
              <Link
                href="/blog"
                className="font-label text-[0.6875rem] uppercase tracking-[0.15em] text-faint transition-colors hover:text-accent"
              >
                글 모두 보기 →
              </Link>
            }
          >
            Recent
          </SectionLabel>

          <ul className="-mx-3">
            {recent.map((post) => (
              <li key={post.slug}>
                <Link
                  href={`/blog/${post.slug}`}
                  className="group flex items-baseline gap-4 rounded-md px-3 py-3 transition-colors hover:bg-surface"
                >
                  <time
                    dateTime={post.isoDate}
                    className="hidden w-24 shrink-0 font-label text-xs tabular-nums text-faint sm:block"
                  >
                    {post.isoDate}
                  </time>
                  <span className="min-w-0 font-display font-medium leading-snug tracking-tight transition-colors group-hover:text-accent">
                    {post.title}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      {posts.length === 0 && (
        <p className="mt-20 text-muted">
          아직 글이 없습니다.{" "}
          <code className="font-mono text-sm">content/blog/</code> 에 `.mdx`
          파일을 추가해 보세요.
        </p>
      )}
    </>
  );
}
