import { useEffect, useRef, useState, type ReactNode, type MouseEvent as ReactMouseEvent } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface EditorialCarouselProps {
  children: ReactNode;
  className?: string;
  showArrows?: boolean;
  showProgress?: boolean;
}

export function EditorialCarousel({
  children,
  className,
  showArrows = true,
  showProgress = true,
}: EditorialCarouselProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeftPos, setScrollLeftPos] = useState(0);

  const updateScrollState = () => {
    const el = containerRef.current;
    if (!el) return;

    const maxScroll = el.scrollWidth - el.clientWidth;
    if (maxScroll <= 0) {
      setScrollProgress(1);
      setCanScrollLeft(false);
      setCanScrollRight(false);
      return;
    }

    const currentScroll = el.scrollLeft;
    const progress = Math.min(1, Math.max(0, currentScroll / maxScroll));
    setScrollProgress(progress);
    setCanScrollLeft(currentScroll > 5);
    setCanScrollRight(currentScroll < maxScroll - 5);
  };

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    updateScrollState();
    el.addEventListener("scroll", updateScrollState, { passive: true });
    window.addEventListener("resize", updateScrollState);

    return () => {
      el.removeEventListener("scroll", updateScrollState);
      window.removeEventListener("resize", updateScrollState);
    };
  }, []);

  const scrollByAmount = (amount: number) => {
    const el = containerRef.current;
    if (!el) return;
    el.scrollBy({ left: amount, behavior: "smooth" });
  };

  const handleMouseDown = (e: ReactMouseEvent) => {
    const el = containerRef.current;
    if (!el) return;
    setIsDragging(true);
    setStartX(e.pageX - el.offsetLeft);
    setScrollLeftPos(el.scrollLeft);
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseMove = (e: ReactMouseEvent) => {
    if (!isDragging) return;
    e.preventDefault();
    const el = containerRef.current;
    if (!el) return;
    const x = e.pageX - el.offsetLeft;
    const walk = (x - startX) * 1.5;
    el.scrollLeft = scrollLeftPos - walk;
  };

  return (
    <div className="group/carousel relative w-full">
      {/* Optional Top Arrow Navigation Controls */}
      {showArrows && (
        <div className="mb-4 flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={() => scrollByAmount(-300)}
            disabled={!canScrollLeft}
            aria-label="Previous items"
            className={cn(
              "flex h-9 w-9 items-center justify-center rounded-full border border-border bg-background text-foreground transition-all duration-300 hover:border-bakebook-blue hover:bg-bakebook-blue hover:text-white disabled:opacity-20 disabled:pointer-events-none shadow-sm",
              !canScrollLeft && "opacity-20"
            )}
          >
            <ArrowLeft className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            onClick={() => scrollByAmount(300)}
            disabled={!canScrollRight}
            aria-label="Next items"
            className={cn(
              "flex h-9 w-9 items-center justify-center rounded-full border border-border bg-background text-foreground transition-all duration-300 hover:border-bakebook-blue hover:bg-bakebook-blue hover:text-white disabled:opacity-20 disabled:pointer-events-none shadow-sm",
              !canScrollRight && "opacity-20"
            )}
          >
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>
      )}

      {/* Edge-to-Edge Carousel Track */}
      <div
        ref={containerRef}
        onMouseDown={handleMouseDown}
        onMouseLeave={handleMouseLeave}
        onMouseUp={handleMouseUp}
        onMouseMove={handleMouseMove}
        className={cn(
          "carousel-snap-x no-scrollbar flex w-full overflow-x-auto select-none py-2 gap-4 sm:gap-5 md:gap-6 cursor-grab active:cursor-grabbing",
          isDragging && "scroll-auto select-none",
          className
        )}
      >
        {children}
      </div>

      {/* Poilâne Hairline Scroll Progress Bar */}
      {showProgress && (
        <div className="mt-6 mx-auto w-full max-w-sm h-[1.5px] bg-border/40 rounded-full overflow-hidden">
          <div
            className="h-full bg-bakebook-blue transition-all duration-200 ease-out"
            style={{
              width: `${Math.max(15, scrollProgress * 100)}%`,
              marginLeft: `${Math.min(85, scrollProgress * 85)}%`,
            }}
          />
        </div>
      )}
    </div>
  );
}
