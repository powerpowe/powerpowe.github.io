import Link from "next/link";

export default function NotFound() {
  // Rendered by the root layout, which no longer supplies a container — the
  // landing page and the `(sidebar)` group each bring their own.
  return (
    <main className="animate-fade-up mx-auto w-full max-w-6xl px-5 py-24 sm:px-8">
      <p className="font-label text-[0.6875rem] uppercase tracking-[0.2em] text-faint">
        404
      </p>
      <h1 className="display-tight mt-4 text-3xl font-semibold">
        페이지를 찾을 수 없습니다
      </h1>
      <p className="mt-4 leading-relaxed text-muted">
        주소가 바뀌었거나 삭제된 글일 수 있습니다.
      </p>
      <div className="mt-8 flex flex-wrap gap-5 font-label text-[0.6875rem] uppercase tracking-[0.15em] text-faint">
        <Link href="/" className="transition-colors hover:text-accent">
          ← Home
        </Link>
        <Link href="/blog" className="transition-colors hover:text-accent">
          Writing
        </Link>
      </div>
    </main>
  );
}
