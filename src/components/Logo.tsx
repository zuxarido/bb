import { cn } from "@/lib/utils";

/**
 * Bakebook logomark — the blue bookmark with a soft curved base.
 * Shape locked per brand guidelines; do not modify proportions.
 */
export function Logomark({
  className,
  color = "currentColor",
}: {
  className?: string;
  color?: string;
}) {
  return (
    <svg
      viewBox="0 0 64 88"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("inline-block", className)}
      aria-hidden="true"
      focusable="false"
    >
      {/* Bookmark with concave bottom curve */}
      <path
        d="M8 0 H56 A8 8 0 0 1 64 8 V88 C64 88 48 70 32 70 C16 70 0 88 0 88 V8 A8 8 0 0 1 8 0 Z"
        fill={color}
      />
    </svg>
  );
}

/**
 * Stacked "BAKEBOOK / BAKERY" wordmark + bookmark lockup.
 * Geometric, hairline weight to evoke the original lockup.
 */
export function Wordmark({
  className,
  showMark = true,
}: {
  className?: string;
  showMark?: boolean;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-end gap-2 font-display text-[1.05rem] font-medium uppercase leading-[0.95] tracking-[-0.01em] text-foreground",
        className,
      )}
      aria-label="Bakebook Bakery"
    >
      <span className="flex flex-col">
        <span>Bakebook</span>
        <span>Bakery</span>
      </span>
      {showMark && (
        <Logomark
          className="h-[1.6em] w-auto translate-y-[2px]"
          color="var(--color-bakebook-blue)"
        />
      )}
    </span>
  );
}
