"use client";

export function PrintButton() {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="no-print shrink-0 rounded-md border border-hairline px-3 py-1.5 font-label text-[0.6875rem] uppercase tracking-[0.1em] text-faint transition-colors hover:border-accent hover:text-accent"
    >
      Print
    </button>
  );
}
