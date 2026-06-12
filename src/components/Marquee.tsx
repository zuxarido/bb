import { cn } from "@/lib/utils";

/**
 * Quiet editorial marquee — slow, single direction, no interaction.
 * Used as a thin band to carry brand poetry between sections.
 */
export function Marquee({
  items,
  className,
  separator = "·",
}: {
  items: string[];
  className?: string;
  separator?: string;
}) {
  const loop = [...items, ...items, ...items];
  return (
    <div className={cn("relative overflow-hidden border-y border-border py-5", className)}>
      <div className="flex w-max animate-[marquee_60s_linear_infinite] gap-10 whitespace-nowrap">
        {loop.map((item, i) => (
          <span
            key={i}
            className="editorial-label inline-flex items-center gap-10 text-foreground/70"
          >
            {item}
            <span className="text-bakebook-blue" aria-hidden>
              {separator}
            </span>
          </span>
        ))}
      </div>
      <style>{`@keyframes marquee { from { transform: translateX(0) } to { transform: translateX(-33.333%) } }`}</style>
    </div>
  );
}
