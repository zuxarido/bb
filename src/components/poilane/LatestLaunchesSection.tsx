import { Link } from "@tanstack/react-router";
import { ScrollReveal } from "./ScrollReveal";

import imgNutellaCookie from "@/assets/product-cookie-nutella.png";
import imgVanillaCake from "@/assets/product-cake-vanilla.png";
import featureMatcha from "@/assets/feature-matcha.jpg";
import featureFood from "@/assets/feature-food.jpg";

export function LatestLaunchesSection() {
  return (
    <section className="bg-muted/40 py-16 sm:py-24 md:py-36 border-t border-border">
      <div className="mx-auto max-w-[1600px] px-5 sm:px-8 md:px-10 lg:px-12">
        
        {/* Section Header */}
        <ScrollReveal variant="fade-up">
          <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between border-b border-border pb-5 sm:pb-6">
            <div>
              <span className="editorial-label text-bakebook-blue font-medium">
                — FRESH FROM THE OVEN
              </span>
              <h2 className="mt-2 font-display text-3xl xs:text-4xl sm:text-5xl md:text-6xl font-medium uppercase leading-none tracking-[-0.03em] text-foreground">
                OUR LATEST LAUNCHES
              </h2>
            </div>
            
            <p className="max-w-xs text-xs md:text-sm text-muted-foreground font-light leading-relaxed md:text-right">
              Newly perfected recipes from our Delhi test kitchen.
            </p>
          </div>
        </ScrollReveal>

        {/* Asymmetrical Feature Spread */}
        <div className="mt-8 sm:mt-12 md:mt-16 grid grid-cols-1 lg:grid-cols-[1.3fr_1fr] gap-6 sm:gap-8 md:gap-12 items-center">
          
          {/* Main Hero Spotlight Feature Left */}
          <ScrollReveal variant="scale-up">
            <Link
              to="/cafe"
              className="group relative flex flex-col justify-between overflow-hidden rounded-[20px] sm:rounded-[24px] border border-border bg-background p-6 sm:p-8 min-h-[360px] sm:min-h-[440px] md:min-h-[500px] transition-all duration-500 hover:shadow-2xl active:scale-[0.99]"
            >
              <div className="absolute inset-0 z-0">
                <img
                  src={featureMatcha}
                  alt="Iced Ceremonial Matcha Cloud"
                  className="h-full w-full object-cover editorial-image-zoom brightness-[0.88]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/10" />
              </div>

              {/* Top Tags */}
              <div className="relative z-10 flex items-center justify-between">
                <span className="editorial-label text-bakebook-blue bg-black/60 px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-full backdrop-blur-md border border-white/10 font-bold text-[9px] sm:text-xs">
                  Spotlight Launch
                </span>
                <span className="editorial-label text-white font-bold bg-white/20 backdrop-blur-md px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-full text-[10px] sm:text-xs">
                  ₹320
                </span>
              </div>

              {/* Bottom Spotlight Copy */}
              <div className="relative z-10 space-y-2 sm:space-y-3 text-white mt-auto pt-10">
                <span className="editorial-label text-bakebook-blue text-[9px] sm:text-xs">
                  01 — Ceremonial Matcha Bar
                </span>
                <h3 className="font-display text-2xl sm:text-3xl md:text-4xl font-medium tracking-tight leading-snug">
                  Iced Ceremonial Matcha Cloud
                </h3>
                <p className="text-xs sm:text-sm font-light text-white/80 max-w-md leading-relaxed line-clamp-2 sm:line-clamp-none">
                  First-harvest Uji matcha whisked to order over cold velvety oat foam. A crisp, refreshing signature for morning rituals.
                </p>
                <div className="pt-2">
                  <span className="editorial-label inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 sm:px-6 sm:py-3 text-black text-[10px] sm:text-xs font-bold transition-all group-hover:bg-bakebook-blue group-hover:text-white shadow-md">
                    Order Spotlight Launch →
                  </span>
                </div>
              </div>
            </Link>
          </ScrollReveal>

          {/* Secondary Launch List Right */}
          <div className="space-y-4 sm:space-y-6">
            {[
              {
                id: "l2",
                title: "Nutella Sea Salt Cookie",
                tag: "Molten Centre",
                price: "₹300",
                img: imgNutellaCookie,
                link: "/cakery",
              },
              {
                id: "l3",
                title: "Vanilla Almond Caramel Cake",
                tag: "Signature Layer",
                price: "₹880",
                img: imgVanillaCake,
                link: "/cakery",
              },
              {
                id: "l4",
                title: "Smoked Burrata Sourdough",
                tag: "Kitchen Special",
                price: "₹450",
                img: featureFood,
                link: "/cafe",
              },
            ].map((item, idx) => (
              <ScrollReveal key={item.id} variant="fade-up" delay={idx * 100}>
                <Link
                  to={item.link}
                  className="group flex items-center gap-4 sm:gap-5 rounded-[16px] sm:rounded-[20px] border border-border/80 bg-background p-3.5 sm:p-4 transition-all duration-300 hover:-translate-y-1 hover:border-bakebook-blue/40 hover:shadow-md active:scale-[0.98]"
                >
                  <div className="relative h-20 w-24 sm:h-24 sm:w-28 flex-shrink-0 overflow-hidden rounded-[12px] sm:rounded-[14px] bg-muted">
                    <img
                      src={item.img}
                      alt={item.title}
                      className="h-full w-full object-cover editorial-image-zoom"
                    />
                  </div>
                  <div className="flex flex-1 flex-col justify-between py-0.5">
                    <div className="flex items-center justify-between">
                      <span className="editorial-label text-bakebook-blue text-[8px] sm:text-[9px]">
                        {item.tag}
                      </span>
                      <span className="font-display font-semibold text-foreground text-xs">
                        {item.price}
                      </span>
                    </div>
                    <h4 className="font-display text-base sm:text-lg font-medium text-foreground transition-colors group-hover:text-bakebook-blue tracking-tight mt-1 leading-snug">
                      {item.title}
                    </h4>
                    <span className="poilane-link editorial-label text-[9px] sm:text-[10px] font-semibold text-foreground group-hover:text-bakebook-blue mt-1.5 self-start">
                      Explore →
                    </span>
                  </div>
                </Link>
              </ScrollReveal>
            ))}
          </div>

        </div>

      </div>
    </section>
  );
}
