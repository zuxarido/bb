import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import heroVideo from "@/assets/hero-bakebook-clips-copy-02.mp4";
import { ChevronDown } from "lucide-react";

export const Route = createFileRoute("/coming-soon")({
  head: () => ({ meta: [{ title: "Coming Soon — Bakebook Bakery" }] }),
  component: ComingSoonPage,
});

function easeInOutCubic(t: number) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

function remap(value: number, start: number, end: number) {
  return Math.max(0, Math.min((value - start) / (end - start), 1));
}

// A genuinely niche, playful bubble display font — and a bit of a pun given
// this is a bakery. See the loading note at the bottom of this file.
const DISPLAY_FONT =
  "'Bagel Fat One', 'Fredoka', ui-rounded, -apple-system, system-ui, sans-serif";

function ComingSoonPage() {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const targetProgress = useRef(0);
  const displayProgress = useRef(0);
  const rafId = useRef<number>();
  const [renderedProgress, setRenderedProgress] = useState(0);

  const [size, setSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const updateSize = () =>
      setSize({ width: window.innerWidth, height: window.innerHeight });
    updateSize();
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const viewportHeight = window.innerHeight;
      const raw =
        (container.scrollTop - viewportHeight * 0.5) / (viewportHeight * 1.6);
      targetProgress.current = Math.max(0, Math.min(raw, 1));
    };

    const tick = () => {
      const eased = easeInOutCubic(targetProgress.current);
      displayProgress.current += (eased - displayProgress.current) * 0.07;
      if (Math.abs(eased - displayProgress.current) < 0.0005) {
        displayProgress.current = eased;
      }
      setRenderedProgress(displayProgress.current);
      rafId.current = requestAnimationFrame(tick);
    };

    container.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    rafId.current = requestAnimationFrame(tick);

    return () => {
      container.removeEventListener("scroll", handleScroll);
      if (rafId.current) cancelAnimationFrame(rafId.current);
    };
  }, []);

  const MAX_WHITE_OPACITY = 0.985;
  const whiteOpacity = renderedProgress * MAX_WHITE_OPACITY;

  const blueLineProgress = remap(renderedProgress, 0.45, 0.8);
  const orangeLineProgress = remap(renderedProgress, 0.65, 1);

  // Fades out fast as soon as the person starts scrolling at all.
  const scrollHintOpacity = 1 - Math.min(renderedProgress * 5, 1);

  const { width, height } = size;
  const fontSize = width ? Math.max(40, Math.min(110, width * 0.07)) : 64;
  const letterSpacing = fontSize * 0.005;

  const comingTextRef = useRef<SVGTextElement>(null);
  const dotsTextRef = useRef<SVGTextElement>(null);
  const [comingWidth, setComingWidth] = useState(0);
  const [dotsWidth, setDotsWidth] = useState(0);

  useLayoutEffect(() => {
    if (comingTextRef.current) {
      setComingWidth(comingTextRef.current.getBBox().width);
    }
    if (dotsTextRef.current) {
      setDotsWidth(dotsTextRef.current.getBBox().width);
    }
  }, [fontSize, width, height]);

  const gap = fontSize * 0.45;
  const totalWidth = comingWidth + gap + dotsWidth;
  const groupStartX = width / 2 - totalWidth / 2;
  const comingX = groupStartX;
  const dotsX = groupStartX + comingWidth + gap;
  const textY = height / 2;
  const underlineY = textY + fontSize * 0.55 + 10;
  const strokeWidth = Math.max(5, fontSize * 0.09);

  return (
    <div className="relative h-screen w-full overflow-hidden bg-black">
      {/* This page has no header of its own. If one is still visible, it's
          coming from a shared root/layout route rendered outside this
          file — this rule force-hides it for as long as this page is
          mounted, and stops as soon as you navigate away. If you'd rather
          fix it at the source, look for wherever <SiteHeader /> is rendered
          unconditionally (likely __root.tsx) and skip it for this route. */}
      <style>{`
        header { display: none !important; }
        @keyframes scroll-hint-bounce {
          0%, 100% { transform: translateY(0); opacity: 1; }
          50% { transform: translateY(6px); opacity: 0.6; }
        }
      `}</style>

      <video
        src={heroVideo}
        autoPlay
        loop
        muted
        playsInline
        className="fixed inset-0 z-0 h-screen w-full object-cover"
      />

      {width > 0 && height > 0 && (
        <svg
          className="fixed inset-0 z-10 pointer-events-none"
          width={width}
          height={height}
          viewBox={`0 0 ${width} ${height}`}
        >
          <defs>
            <mask id="comingSoonMask">
              <rect x="0" y="0" width={width} height={height} fill="white" />
              <text
                ref={comingTextRef}
                x={comingX}
                y={textY}
                dominantBaseline="middle"
                textAnchor="start"
                fontFamily={DISPLAY_FONT}
                fontSize={fontSize}
                fontWeight={400}
                letterSpacing={letterSpacing}
                fill="black"
              >
                coming soon
              </text>
              <text
                ref={dotsTextRef}
                x={dotsX}
                y={textY}
                dominantBaseline="middle"
                textAnchor="start"
                fontFamily={DISPLAY_FONT}
                fontSize={fontSize}
                fontWeight={400}
                letterSpacing={letterSpacing}
                fill="black"
              >
                ...
              </text>
            </mask>
          </defs>

          <rect
            x="0"
            y="0"
            width={width}
            height={height}
            fill="white"
            mask="url(#comingSoonMask)"
            opacity={whiteOpacity}
          />

          {comingWidth > 0 && (
            <line
              x1={comingX}
              y1={underlineY}
              x2={comingX + comingWidth}
              y2={underlineY}
              stroke="#00AEEF"
              strokeWidth={strokeWidth}
              strokeLinecap="round"
              pathLength={1}
              strokeDasharray={1}
              strokeDashoffset={1 - blueLineProgress}
              opacity={blueLineProgress > 0 ? whiteOpacity : 0}
            />
          )}

          {dotsWidth > 0 && (
            <line
              x1={dotsX}
              y1={underlineY}
              x2={dotsX + dotsWidth}
              y2={underlineY}
              stroke="#FF6647"
              strokeWidth={strokeWidth}
              strokeLinecap="round"
              pathLength={1}
              strokeDasharray={1}
              strokeDashoffset={1 - orangeLineProgress}
              opacity={orangeLineProgress > 0 ? whiteOpacity : 0}
            />
          )}
        </svg>
      )}

      {/* Scroll-down hint, only visible before the person starts scrolling. */}
      <div
        className="fixed inset-x-0 bottom-10 z-30 flex flex-col items-center gap-3 pointer-events-none"
        style={{ opacity: scrollHintOpacity }}
      >
        <span
          className="text-xs font-medium uppercase tracking-[0.3em] text-white/90"
          style={{ fontFamily: "ui-sans-serif, system-ui, sans-serif" }}
        >
          Scroll
        </span>
        <ChevronDown
          size={32}
          color="white"
          strokeWidth={2}
          style={{ animation: "scroll-hint-bounce 1.6s ease-in-out infinite" }}
        />
      </div>

      <div
        ref={scrollContainerRef}
        className="relative z-20 h-screen w-full overflow-y-auto overflow-x-hidden"
      >
        <section className="h-screen w-full" />
        <section className="h-[160vh] w-full" />
      </div>
    </div>
  );
}

// NOTE: "Bagel Fat One" needs to be loaded — naming it alone won't make it
// render. Add this once, e.g. in index.html:
//   <link rel="preconnect" href="https://fonts.googleapis.com">
//   <link href="https://fonts.googleapis.com/css2?family=Bagel+Fat+One&display=swap" rel="stylesheet">
// It only ships one weight (400), which is why fontWeight is set to 400
// above rather than 800 — the browser can't fake a bolder cut of it.