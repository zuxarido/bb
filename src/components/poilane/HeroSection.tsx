import { Link } from "@tanstack/react-router";
import heroVideo from "@/assets/hero-bakebook-clips-copy-02.mp4";
import { Logomark } from "@/components/Logo";
import { ScrollReveal } from "./ScrollReveal";

export function HeroSection() {
  return (
    <section className="relative h-[100svh] min-h-[580px] md:h-screen w-full overflow-hidden bg-bakebook-ink text-white">
      {/* Full-bleed Background Video */}
      <div className="grain grain-strong absolute inset-0 h-full w-full">
        <video
          src={heroVideo}
          className="h-full w-full object-cover object-center scale-[1.02] transition-transform duration-[3000ms] ease-out hover:scale-100"
          autoPlay
          loop
          muted
          playsInline
        />
        {/* Vignette gradient overlay */}
        <div className="pointer-events-none absolute inset-0 z-[1] bg-gradient-to-t from-black/85 via-black/25 to-black/40" />
      </div>

      {/* Hero Content Overlay */}
      <div className="absolute inset-x-0 bottom-10 md:bottom-12 z-10 mx-auto w-full max-w-[1600px] px-5 sm:px-8 pb-4 md:px-10 md:pb-12 lg:pb-16">
        <div className="grid grid-cols-1 items-end gap-6 sm:gap-8 md:grid-cols-2 md:gap-16">
          
          {/* Bottom Left Title */}
          <ScrollReveal variant="fade-up" duration={900}>
            <div>
              <span className="editorial-label text-bakebook-blue font-semibold tracking-[0.2em] mb-2 sm:mb-3 block text-[10px] sm:text-xs">
                — Bakebook Bakery · Delhi
              </span>
              <h1 className="font-display text-4xl xs:text-5xl sm:text-6xl md:text-[6.5vw] lg:text-[7.2rem] font-medium uppercase leading-[0.9] tracking-[-0.03em] text-white">
                BE CAREFUL,<br />
                WE'RE HOT.
              </h1>
            </div>
          </ScrollReveal>

          {/* Bottom Right CTA */}
          <ScrollReveal variant="fade-up" duration={900} delay={150}>
            <div className="flex flex-col items-start md:items-end md:text-right space-y-4 sm:space-y-5">
              <p className="max-w-md text-xs sm:text-base md:text-lg font-light leading-relaxed text-white/90">
                Specialty coffee, Uji matcha, sourdough sandwiches, and bespoke celebration cakes — baked fresh daily in Delhi.
              </p>
              
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto pt-1">
                <Link
                  to="/cakery"
                  className="editorial-label inline-flex items-center justify-center gap-2.5 rounded-full bg-white px-7 py-3.5 sm:px-8 sm:py-4 text-black text-xs font-bold tracking-[0.16em] transition-all duration-300 hover:bg-bakebook-blue hover:text-white shadow-xl active:scale-[0.98]"
                >
                  Order Online Now →
                </Link>
                <Link
                  to="/about"
                  className="editorial-label inline-flex items-center justify-center gap-2 rounded-full border border-white/40 px-6 py-3.5 sm:px-7 sm:py-4 text-white text-xs font-semibold tracking-[0.14em] transition-all duration-300 hover:border-white hover:bg-white/10 backdrop-blur-sm active:scale-[0.98]"
                >
                  Our Story
                </Link>
              </div>
            </div>
          </ScrollReveal>

        </div>
      </div>

      {/* Poilâne Minimal Bottom Info Bar (Mobile + Desktop) */}
      <div className="absolute inset-x-0 bottom-0 z-20 border-t border-white/10 bg-black/50 backdrop-blur-md px-5 py-2.5">
        <div className="mx-auto flex max-w-[1600px] items-center justify-between text-[9px] sm:text-[11px] tracking-widest text-white/75 uppercase overflow-x-auto no-scrollbar whitespace-nowrap gap-4">
          <div className="flex items-center gap-2 flex-shrink-0">
            <Logomark className="h-3.5 w-auto sm:h-4" color="var(--color-bakebook-blue)" />
            <span>Maharaja Surajmal Marg · Anand Vihar, Delhi</span>
          </div>
          <div className="flex items-center gap-3 sm:gap-4 flex-shrink-0">
            <span>Open Daily 8:00 – 22:00</span>
            <span>•</span>
            <span className="text-bakebook-blue font-semibold">Fresh Batches Daily</span>
          </div>
        </div>
      </div>
    </section>
  );
}
