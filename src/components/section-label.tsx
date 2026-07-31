import type { ReactNode } from "react";

/** The mono caption that heads each section, over a hairline rule. */
export function SectionLabel({
  children,
  action,
  id,
}: {
  children: ReactNode;
  action?: ReactNode;
  id?: string;
}) {
  return (
    <div
      id={id}
      className="mb-4 flex items-baseline justify-between gap-4 border-b border-hairline pb-3"
    >
      <h2 className="font-label text-[0.6875rem] uppercase tracking-[0.2em] text-faint">
        {children}
      </h2>
      {action}
    </div>
  );
}
