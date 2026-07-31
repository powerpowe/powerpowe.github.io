/**
 * Pages that run without the right-hand rail: /about and /cv.
 *
 * No ad slot here on purpose. These are the two pages you send to a person —
 * a recruiter opening your CV should not find a banner next to it — and they
 * carry a negligible share of traffic anyway, since search lands readers on
 * articles. The rail earns its keep on the reading pages, not here.
 *
 * Wider than the article column but still capped: a CV set across the full
 * 1152px would be unreadable.
 */
export default function FullLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <main className="print-reset mx-auto w-full max-w-4xl px-5 py-12 sm:px-8">
      {children}
    </main>
  );
}
