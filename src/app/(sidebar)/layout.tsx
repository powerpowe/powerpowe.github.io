import { Sidebar } from "@/components/sidebar";

/**
 * The reading routes — landing, post list, articles, tag pages. Content column
 * sized for reading; the 300px rail carries topics and the ad unit, and
 * disappears below `lg` rather than squeezing the text.
 *
 * /about and /cv live in the `(full)` group instead and get no rail.
 */
export default function SidebarLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="print-reset mx-auto w-full max-w-6xl px-5 py-12 sm:px-8 lg:grid lg:grid-cols-[minmax(0,1fr)_300px] lg:gap-14">
      <main className="print-reset min-w-0">{children}</main>
      <Sidebar />
    </div>
  );
}
