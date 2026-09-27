import { Link } from "@tanstack/react-router";
import heroVideo from "@/assets/hero-bakebook-clips-copy-02.mp4";
import { Logomark } from "@/components/Logo";
import { ScrollReveal } from "./ScrollReveal";

export function HeroSection() {
  return (
    <section className="relative h-screen w-full overflow-hidden bg-bakebook-ink text-white">
      {/* Full-bleed Full Screen Background Video */}
      <div className="grain grain-strong absolute inset-0 h-full w-full">
        <video
          src={heroVideo}
          className="h-full w-full object-cover object-center scale-[1.02] transition-transform duration-[3000ms] ease-out hover:scale-100"
          autoPlay
          loop
          muted
          playsInline
        />
        {/* Editorial vignette gradient overlay */}
        <div className="pointer-events-none absolute inset-0 z-[1] bg-gradient-to-t from-black/80 via-transparent to-black/40" />
      </div>

      {/* Hero Content Overlay — Positioned at the bottom of the 100vh screen */}
      <div className="absolute inset-x-0 bottom-0 z-10 mx-auto w-full max-w-[1600px] px-6 pb-12 md:px-10 md:pb-16 lg:pb-20">
        <div className="grid grid-cols-1 items-end gap-8 md:grid-cols-2 md:gap-16">
          
          {/* Bottom Left Title */}
          <ScrollReveal variant="fade-up" duration={900}>
            <div>
              <span className="editorial-label text-bakebook-blue font-semibold tracking-[0.2em] mb-3 block">
                — Bakebook Bakery · Delhi
              </span>
              <h1 className="font-display text-[12vw] sm:text-[9vw] md:text-[6.5vw] lg:text-[7.2rem] font-medium uppercase leading-[0.88] tracking-[-0.04em] text-white">
                BE CAREFUL,<br />
                WE'RE HOT.
              </h1>
            </div>
          </ScrollReveal>

          {/* Bottom Right CTA */}
          <ScrollReveal variant="fade-up" duration={900} delay={150}>
            <div className="flex flex-col items-start md:items-end md:text-right space-y-5">
              <p className="max-w-md text-sm sm:text-base md:text-lg font-light leading-relaxed text-white/90">
                Specialty coffee, Uji matcha, sourdough sandwiches, and bespoke celebration cakes — baked fresh daily in Delhi.
              </p>
              
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <Link
                  to="/cakery"
                  className="editorial-label inline-flex items-center gap-3 rounded-full bg-white px-8 py-4 text-black text-xs font-bold tracking-[0.16em] transition-all duration-300 hover:bg-bakebook-blue hover:text-white shadow-xl"
                >
                  Order Online Now →
                </Link>
                <Link
                  to="/about"
                  className="editorial-label inline-flex items-center gap-2 rounded-full border border-white/40 px-7 py-4 text-white text-xs font-semibold tracking-[0.14em] transition-all duration-300 hover:border-white hover:bg-white/10 backdrop-blur-sm"
                >
                  Our Story
                </Link>
              </div>
            </div>
          </ScrollReveal>

        </div>
      </div>

      {/* Minimal Bottom Info Bar */}
      <div className="absolute inset-x-0 bottom-0 z-20 border-t border-white/10 bg-black/40 backdrop-blur-md px-6 py-3 hidden md:block">
        <div className="mx-auto flex max-w-[1600px] items-center justify-between text-[11px] tracking-widest text-white/70 uppercase">
          <div className="flex items-center gap-2">
            <Logomark className="h-4 w-auto" color="var(--color-bakebook-blue)" />
            <span>Maharaja Surajmal Marg · Anand Vihar, Delhi</span>
          </div>
          <div className="flex items-center gap-4">
            <span>Mon–Sun 8:00 – 22:00</span>
            <span>•</span>
            <span>Fresh Batches Daily</span>
          </div>
        </div>
      </div>
    </section>
  );
}
