import { Link } from "@tanstack/react-router";
import { ScrollReveal } from "./ScrollReveal";

import galleryBread from "@/assets/gallery-bread.jpg";
import featureCake from "@/assets/feature-cake.jpg";
import heroCroissant from "@/assets/hero-croissant.jpg";
import featureCoffee from "@/assets/feature-coffee.jpg";
import imgCookiePhoto from "@/assets/Cookie_new.png";
import featureFood from "@/assets/feature-food.jpg";

const CATEGORIES = [
  {
    id: "cat-pains",
    number: "01",
    title: "Sourdough & Breads",
    subtag: "Artisan Loaves",
    description: "72-hour slow fermentation sourdoughs & rustic loaves baked fresh daily.",
    img: galleryBread,
    link: "/cafe",
  },
  {
    id: "cat-gateaux",
    number: "02",
    title: "Cakes & Celebration",
    subtag: "Signature Cakes",
    description: "Ready-made signature slices & bespoke celebration cake commissions.",
    img: featureCake,
    link: "/cakery",
  },
  {
    id: "cat-viennoiseries",
    number: "03",
    title: "Pastries & Viennoiserie",
    subtag: "Butter Croissants",
    description: "Flaky butter croissants, golden cardamom knots & seasonal fruit tarts.",
    img: heroCroissant,
    link: "/cafe",
  },
  {
    id: "cat-boissons",
    number: "04",
    title: "Coffee & Uji Matcha",
    subtag: "Specialty Brews",
    description: "Single-origin Arabica espresso pours & stone-milled ceremonial Uji matcha.",
    img: featureCoffee,
    link: "/cafe",
  },
  {
    id: "cat-biscuits",
    number: "05",
    title: "Cookies & Sweets",
    subtag: "Handcrafted Cookies",
    description: "Nutella stuffed molten sea salt cookies, double chocolate & butter cookies.",
    img: imgCookiePhoto,
    link: "/cakery",
  },
  {
    id: "cat-provisions",
    number: "06",
    title: "Sandwiches & Savouries",
    subtag: "Cafe Kitchen",
    description: "Smoked burrata sourdough sandwiches & daily hot kitchen specials.",
    img: featureFood,
    link: "/cafe",
  },
];

export function OurProductsSection() {
  return (
    <section className="bg-background py-24 md:py-36 border-t border-border">
      <div className="mx-auto max-w-[1600px] px-6 md:px-10 lg:px-12">
        
        <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_2fr] gap-12 lg:gap-20 items-start">
          
          {/* STATIC / STICKY LEFT COLUMN */}
          <div className="lg:sticky lg:top-28 space-y-6">
            <ScrollReveal variant="fade-up">
              <span className="editorial-label text-bakebook-blue font-medium">
                — OUR PRODUCTS
              </span>
              <h2 className="mt-3 font-display text-4xl sm:text-6xl lg:text-7xl font-medium uppercase leading-[0.9] tracking-[-0.03em] text-foreground">
                OUR<br />PRODUCTS.
              </h2>
            </ScrollReveal>

            <ScrollReveal variant="fade-up" delay={100}>
              <p className="text-sm md:text-base text-muted-foreground font-light leading-relaxed max-w-sm">
                Explore the core sections of our Delhi bakery & cafe — from 72-hour sourdough to bespoke cakes and specialty coffee.
              </p>
            </ScrollReveal>

            <ScrollReveal variant="fade-up" delay={200}>
              <div className="pt-2">
                <Link
                  to="/cakery"
                  className="poilane-link editorial-label text-xs tracking-[0.16em] font-semibold text-foreground hover:text-bakebook-blue"
                >
                  EXPLORE ALL SECTIONS →
                </Link>
              </div>
            </ScrollReveal>
          </div>

          {/* RIGHT COLUMN: SCROLLING GRID OF 2 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-8">
            {CATEGORIES.map((cat, idx) => (
              <ScrollReveal
                key={cat.id}
                variant="fade-up"
                delay={idx * 60}
              >
                <Link
                  to={cat.link}
                  className="group flex flex-col justify-between overflow-hidden rounded-[20px] border border-border/80 bg-background p-5 transition-all duration-300 hover:-translate-y-1.5 hover:border-bakebook-blue/40 hover:shadow-lg"
                >
                  {/* Category Image */}
                  <div className="relative aspect-[4/3] w-full overflow-hidden rounded-[14px] bg-muted">
                    <img
                      src={cat.img}
                      alt={cat.title}
                      className="h-full w-full object-cover editorial-image-zoom"
                      loading="lazy"
                    />
                    <div className="absolute top-3 left-3 rounded-full bg-background/90 px-2.5 py-0.5 text-[9px] font-bold text-foreground backdrop-blur-md shadow-xs">
                      {cat.number}
                    </div>
                  </div>

                  {/* Details */}
                  <div className="mt-5 space-y-1">
                    <h3 className="font-display text-xl font-medium tracking-tight text-foreground transition-colors group-hover:text-bakebook-blue">
                      {cat.title}
                    </h3>
                    <p className="text-[11px] text-muted-foreground font-light">
                      {cat.subtag}
                    </p>
                    <p className="text-xs text-muted-foreground leading-relaxed pt-1 font-light line-clamp-2">
                      {cat.description}
                    </p>
                  </div>

                  {/* Minimal Link */}
                  <div className="mt-6 pt-3 border-t border-border/60 flex items-center justify-between text-[10px]">
                    <span className="editorial-label text-muted-foreground text-[9px]">
                      Section
                    </span>
                    <span className="poilane-link font-semibold text-foreground group-hover:text-bakebook-blue">
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
