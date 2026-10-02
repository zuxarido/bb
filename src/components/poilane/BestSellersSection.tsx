import { Link } from "@tanstack/react-router";
import { ScrollReveal } from "./ScrollReveal";
import { EditorialCarousel } from "./EditorialCarousel";

import imgNutellaCookie from "@/assets/product-cookie-nutella.png";
import imgDoubleChoc from "@/assets/product-cookie-double.png";
import imgVanillaCake from "@/assets/product-cake-vanilla.png";
import imgDevilsCake from "@/assets/product-cake-devil.png";
import featureCoffee from "@/assets/feature-coffee.jpg";
import featureFood from "@/assets/feature-food.jpg";

const BEST_SELLERS = [
  {
    id: "bs-chocchip",
    name: "Chocolate Chip Cookie",
    category: "Signature Cookie",
    price: "₹250",
    img: imgNutellaCookie,
    link: "/cakery",
  },
  {
    id: "bs-devils",
    name: "Devil's Ganache Cake",
    category: "Signature Cake",
    price: "₹780",
    img: imgDevilsCake,
    link: "/cakery",
  },
  {
    id: "bs-vanilla",
    name: "Vanilla Caramel Cake",
    category: "Signature Cake",
    price: "₹880",
    img: imgVanillaCake,
    link: "/cakery",
  },
  {
    id: "bs-doublechoc",
    name: "Double Chocolate Cookie",
    category: "Signature Cookie",
    price: "₹300",
    img: imgDoubleChoc,
    link: "/cakery",
  },
  {
    id: "bs-espresso",
    name: "Arabica Flat White",
    category: "Specialty Coffee",
    price: "₹220",
    img: featureCoffee,
    link: "/cafe",
  },
  {
    id: "bs-sandwich",
    name: "Burrata Sourdough",
    category: "Cafe Kitchen",
    price: "₹450",
    img: featureFood,
    link: "/cafe",
  },
];

export function BestSellersSection() {
  return (
    <section className="bg-muted/30 py-16 sm:py-20 md:py-32 border-t border-border">
      <div className="mx-auto max-w-[1600px] px-5 sm:px-8 md:px-10 lg:px-12">
        
        {/* Section Heading */}
        <ScrollReveal variant="fade-up">
          <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between border-b border-border pb-5 sm:pb-6">
            <div>
              <span className="editorial-label text-bakebook-blue font-medium">
                — BEST SELLERS
              </span>
              <h2 className="mt-2 font-display text-3xl xs:text-4xl sm:text-5xl md:text-6xl font-medium uppercase leading-none tracking-[-0.03em] text-foreground">
                BEST SELLERS
              </h2>
            </div>
            
            <p className="max-w-xs text-xs md:text-sm text-muted-foreground font-light leading-relaxed md:text-right">
              Bakebook staples ordered daily in Delhi.
            </p>
          </div>
        </ScrollReveal>

        {/* Compact Product Carousel */}
        <div className="mt-8 sm:mt-10 md:mt-14">
          <EditorialCarousel showProgress={true}>
            {BEST_SELLERS.map((item, idx) => (
              <ScrollReveal
                key={item.id}
                variant="fade-up"
                delay={idx * 60}
                className="carousel-snap-item w-[160px] xs:w-[185px] sm:w-[210px] md:w-[230px] flex-shrink-0"
              >
                <Link
                  to={item.link}
                  className="group flex h-full flex-col justify-between overflow-hidden rounded-[14px] sm:rounded-[16px] border border-border/70 bg-background p-3 sm:p-3.5 transition-all duration-300 hover:-translate-y-1 hover:border-bakebook-blue/40 hover:shadow-md active:scale-[0.98]"
                >
                  <div>
                    {/* Compact Image */}
                    <div className="relative aspect-square w-full overflow-hidden rounded-[10px] sm:rounded-[12px] bg-muted/60">
                      <img
                        src={item.img}
                        alt={item.name}
                        className="h-full w-full object-cover editorial-image-zoom"
                        loading="lazy"
                      />
                    </div>

                    {/* Product Info */}
                    <div className="mt-2.5 sm:mt-3 space-y-0.5">
                      <h3 className="font-display text-sm sm:text-base font-medium tracking-tight text-foreground truncate transition-colors group-hover:text-bakebook-blue">
                        {item.name}
                      </h3>
                      <div className="flex items-center justify-between text-xs text-muted-foreground pt-0.5">
                        <span className="text-[9px] sm:text-[10px]">{item.category}</span>
                        <span className="font-display font-semibold text-foreground text-xs">
                          {item.price}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Compact CTA */}
                  <div className="mt-3 sm:mt-4 pt-2 sm:pt-2.5 border-t border-border/50 flex items-center justify-between text-[9px] sm:text-[10px]">
                    <span className="editorial-label text-muted-foreground text-[8px] sm:text-[9px] hidden xs:inline">
                      Classic
                    </span>
                    <span className="poilane-link font-semibold text-foreground group-hover:text-bakebook-blue ml-auto">
                      Order →
                    </span>
                  </div>

                </Link>
              </ScrollReveal>
            ))}
          </EditorialCarousel>
        </div>

      </div>
    </section>
  );
}
