import { Link } from "@tanstack/react-router";
import page06 from "@/assets/page_06.png";
import cafeInterior from "@/assets/cafe-interior.jpg";
import { ScrollReveal } from "./ScrollReveal";

export function AboutSection() {
  return (
    <section className="relative bg-background py-16 sm:py-28 md:py-40 lg:py-48 overflow-hidden">
      <div className="mx-auto max-w-[1600px] px-5 sm:px-8 md:px-10 lg:px-12">
        
        {/* Section Header Eyebrow */}
        <ScrollReveal variant="fade-up">
          <div className="flex items-center gap-3 border-b border-border pb-4 sm:pb-6">
            <span className="editorial-label text-bakebook-blue">— 01. The Bakebook Story</span>
            <span className="text-[10px] sm:text-xs uppercase tracking-widest text-muted-foreground ml-auto">
              Delhi, India
            </span>
          </div>
        </ScrollReveal>

        {/* Editorial Grid */}
        <div className="mt-10 sm:mt-16 md:mt-24 grid grid-cols-1 gap-12 sm:gap-16 lg:grid-cols-[1.1fr_1fr] lg:gap-24 items-center">
          
          {/* Left Column */}
          <div className="space-y-6 sm:space-y-8">
            <ScrollReveal variant="fade-up" delay={100}>
              <h2 className="font-display text-3xl xs:text-4xl sm:text-6xl md:text-7xl lg:text-[5.2rem] font-medium uppercase leading-[0.92] tracking-[-0.03em] text-foreground">
                A BAKERY.<br />
                A CAFE.<br />
                A CAKERY.
              </h2>
            </ScrollReveal>

            <ScrollReveal variant="fade-up" delay={200}>
              <p className="text-base sm:text-lg md:text-xl font-light leading-relaxed text-foreground/85 max-w-xl">
                Founded with a conviction that good bread and coffee belong together. We craft single-origin Arabica espresso, ceremonial Uji matcha, slow-fermented sourdoughs, and bespoke cakes that linger in your memory long after the last bite.
              </p>
            </ScrollReveal>

            <ScrollReveal variant="fade-up" delay={300}>
              <div className="grid grid-cols-2 gap-4 sm:gap-8 border-t border-border pt-6 sm:pt-8">
                <div>
                  <h4 className="font-display text-2xl sm:text-3xl font-medium text-foreground">72 Hrs</h4>
                  <p className="mt-1 text-[10px] sm:text-xs uppercase tracking-wider text-muted-foreground">
                    Slow Fermentation Sourdough
                  </p>
                </div>
                <div>
                  <h4 className="font-display text-2xl sm:text-3xl font-medium text-foreground">100%</h4>
                  <p className="mt-1 text-[10px] sm:text-xs uppercase tracking-wider text-muted-foreground">
                    Arabica Beans Roasted Fresh
                  </p>
                </div>
              </div>
            </ScrollReveal>

            <ScrollReveal variant="fade-up" delay={400}>
              <div className="pt-2 sm:pt-4">
                <Link
                  to="/about"
                  className="poilane-link editorial-label text-xs sm:text-sm font-semibold tracking-[0.16em] text-foreground hover:text-bakebook-blue"
                >
                  DISCOVER OUR HERITAGE & CRAFT →
                </Link>
              </div>
            </ScrollReveal>
          </div>

          {/* Right Column */}
          <div className="relative space-y-4 sm:space-y-6">
            <ScrollReveal variant="scale-up" delay={150}>
              <div className="group relative aspect-[4/5] w-full overflow-hidden rounded-[20px] sm:rounded-[24px] border border-border/60 bg-muted shadow-lg">
                <img
                  src={page06}
                  alt="Bakebook artisan coffee & rewards"
                  className="h-full w-full object-cover editorial-image-zoom"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-70" />
                <div className="absolute bottom-5 left-5 right-5 sm:bottom-6 sm:left-6 sm:right-6 text-white">
                  <span className="editorial-label text-bakebook-blue bg-black/60 px-3 py-1 rounded-full backdrop-blur-md text-[9px] sm:text-xs font-semibold">
                    Provisions for Delhi
                  </span>
                  <p className="mt-2 sm:mt-3 text-xs sm:text-sm font-medium leading-snug">
                    "We make drinks that make your day — and rewards that match."
                  </p>
                </div>
              </div>
            </ScrollReveal>

            {/* Inset Secondary Image Card */}
            <ScrollReveal variant="fade-up" delay={350}>
              <div className="flex items-center gap-4 sm:gap-6 p-4 sm:p-6 rounded-[18px] sm:rounded-[20px] border border-border/70 bg-muted/40 backdrop-blur-sm">
                <div className="h-16 w-20 sm:h-20 sm:w-24 overflow-hidden rounded-[12px] sm:rounded-[14px] flex-shrink-0 border border-border/60">
                  <img
                    src={cafeInterior}
                    alt="Cafe Interior"
                    className="h-full w-full object-cover"
                  />
                </div>
                <div>
                  <h4 className="font-display text-base sm:text-lg font-medium text-foreground">
                    Maharaja Surajmal Marg
                  </h4>
                  <p className="mt-0.5 sm:mt-1 text-[11px] sm:text-xs text-muted-foreground leading-snug">
                    A peaceful sanctuary of light wood, fresh sourdough, and warm espresso in Delhi.
                  </p>
                </div>
              </div>
            </ScrollReveal>
          </div>

        </div>
      </div>
    </section>
  );
}
