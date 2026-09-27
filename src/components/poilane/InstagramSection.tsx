import { ScrollReveal } from "./ScrollReveal";
import galleryBread from "@/assets/gallery-bread.jpg";
import galleryPour from "@/assets/gallery-pour.jpg";
import gallerySlice from "@/assets/gallery-slice.jpg";
import cafeInterior from "@/assets/cafe-interior.jpg";
import customCake from "@/assets/custom-cake.jpg";
import cupHolding from "@/assets/cup-holding.png";

const INSTA_POSTS = [
  { id: "p1", img: galleryBread, caption: "Fresh sourdough loaves cooling by the window." },
  { id: "p2", img: galleryPour, caption: "Single-origin espresso & silky microfoam art." },
  { id: "p3", img: gallerySlice, caption: "Vanilla caramel cake layer by delicate layer." },
  { id: "p4", img: cupHolding, caption: "Warm hands around fresh Arabica brews." },
  { id: "p5", img: cafeInterior, caption: "Quiet morning corners in Anand Vihar." },
  { id: "p6", img: customCake, caption: "Bespoke celebration cake piping details." },
];

export function InstagramSection() {
  return (
    <section className="bg-background py-28 md:py-40 border-t border-border overflow-hidden">
      <div className="mx-auto max-w-[1600px] px-6 md:px-10 lg:px-12">
        
        {/* Section Header */}
        <ScrollReveal variant="fade-up">
          <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between border-b border-border pb-8">
            <div>
              <p className="editorial-label text-bakebook-blue">— 05. Community & Stories</p>
              <h2 className="mt-4 font-display text-4xl sm:text-6xl md:text-7xl font-medium uppercase leading-tight tracking-[-0.03em] text-foreground">
                INSTAGRAM
              </h2>
              <p className="mt-1 font-display text-xl text-bakebook-blue font-semibold">
                @bakebookbakery
              </p>
            </div>
            
            <div className="flex flex-col items-start md:items-end gap-3 max-w-md">
              <p className="text-sm md:text-base text-muted-foreground leading-relaxed md:text-right">
                Daily moments from our oven in Delhi. Tag us in your visits and celebrations.
              </p>
              <a
                href="https://instagram.com/bakebookbakery"
                target="_blank"
                rel="noreferrer"
                className="poilane-link editorial-label text-xs tracking-[0.16em] font-semibold text-foreground hover:text-bakebook-blue"
              >
                FOLLOW @BAKEBOOKBAKERY →
              </a>
            </div>
          </div>
        </ScrollReveal>

        {/* Editorial Photo Grid */}
        <div className="mt-16 md:mt-20 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-5">
          {INSTA_POSTS.map((post, idx) => (
            <ScrollReveal
              key={post.id}
              variant="fade-up"
              delay={idx * 80}
            >
              <a
                href="https://instagram.com/bakebookbakery"
                target="_blank"
                rel="noreferrer"
                className="group relative block aspect-square w-full overflow-hidden rounded-[20px] bg-muted border border-border/70 shadow-sm"
              >
                <img
                  src={post.img}
                  alt={post.caption}
                  className="h-full w-full object-cover editorial-image-zoom"
                  loading="lazy"
                />
                
                {/* Overlay on hover */}
                <div className="absolute inset-0 bg-black/60 opacity-0 transition-opacity duration-300 group-hover:opacity-100 flex flex-col justify-end p-4 text-white">
                  <span className="editorial-label text-bakebook-blue text-[10px]">
                    @bakebookbakery
                  </span>
                  <p className="mt-1 text-xs font-light line-clamp-2 leading-tight text-white/90">
                    {post.caption}
                  </p>
                </div>
              </a>
            </ScrollReveal>
          ))}
        </div>

      </div>
    </section>
  );
}
