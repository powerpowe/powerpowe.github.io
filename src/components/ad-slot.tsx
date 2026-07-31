/**
 * Provider-agnostic ad placeholder.
 *
 * Nothing is rendered in production until ads are actually wired up — see
 * "광고 붙이기" in the README. The point of having this component now is that
 * every slot reserves its height up front, so dropping real units in later
 * cannot shift the layout (CLS).
 *
 * In development each slot draws a dashed outline so the placements are
 * visible while writing.
 */

type SlotName = "sidebar" | "in-feed" | "in-article";

/** Reserved heights. Match these to the unit sizes you eventually book. */
const SLOTS: Record<SlotName, { minHeight: string; label: string }> = {
  sidebar: { minHeight: "600px", label: "sidebar · 300×600" },
  "in-feed": { minHeight: "280px", label: "in-feed · responsive" },
  "in-article": { minHeight: "280px", label: "in-article · responsive" },
};

const ADS_ENABLED = process.env.NEXT_PUBLIC_ADS_ENABLED === "true";

export function AdSlot({
  name,
  className = "",
}: {
  name: SlotName;
  className?: string;
}) {
  const { minHeight, label } = SLOTS[name];

  if (!ADS_ENABLED) {
    // Placeholder only while developing; invisible in a production build.
    if (process.env.NODE_ENV !== "development") return null;

    return (
      <div
        className={`flex items-center justify-center rounded-md border border-dashed border-hairline font-mono text-[0.6875rem] text-faint ${className}`}
        style={{ minHeight }}
      >
        AD · {label}
      </div>
    );
  }

  return (
    <div
      className={className}
      style={{ minHeight }}
      data-ad-slot={name}
      aria-hidden="true"
    >
      {/* Paste the provider's unit here — e.g. an <ins class="adsbygoogle">
          block, or a <script> tag from your ad server. Keep the wrapper's
          minHeight so the reserved space stays correct. */}
    </div>
  );
}
