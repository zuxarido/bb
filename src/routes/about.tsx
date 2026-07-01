import { createFileRoute } from "@tanstack/react-router";
import imgCafeInterior from "@/assets/cafe-interior.jpg";
import imgGalleryPour from "@/assets/gallery-pour.jpg";
import imgGallerySlice from "@/assets/gallery-slice.jpg";
import imgFeatureCake from "@/assets/feature-cake.jpg";
import imgFeatureMatcha from "@/assets/feature-matcha.jpg";
import imgFeatureFood from "@/assets/feature-food.jpg";
import imgGalleryBread from "@/assets/gallery-bread.jpg";
import imgCustomCake from "@/assets/custom-cake.jpg";
import imgFeatureCoffee from "@/assets/feature-coffee.jpg";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About Us — Bakebook Bakery" },
      {
        name: "description",
        content:
          "Bakebook Bakery — a neighbourhood spot in Rishabh Vihar, East Delhi, making handcrafted desserts, specialty coffee, and bespoke cakes baked with passion and premium ingredients.",
      },
    ],
  }),
  component: AboutPage,
});

function AboutPage() {
  return (
    <div className="min-h-screen bg-white text-foreground">

      {/* ─── CINEMATIC HERO ─────────────────────────────────────────────── */}
      <section className="relative h-screen overflow-hidden bg-bakebook-ink">
        <img
          src={imgCafeInterior}
          alt="Inside Bakebook Bakery"
          className="absolute inset-0 h-full w-full object-cover opacity-50"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-black/30" />

        <div className="absolute inset-0 flex flex-col justify-end px-8 md:px-20 pb-20 z-10">
          <p className="editorial-label text-bakebook-blue mb-6 tracking-[0.3em]">
            Our Story
          </p>
          <h1
            className="display-caps text-white leading-none mb-8"
            style={{ fontSize: "clamp(4rem, 10vw, 12rem)" }}
          >
            Baked to<br />be remem&shy;bered.
          </h1>
          <div className="flex items-end justify-between border-t border-white/20 pt-8 max-w-[1200px]">
            <p className="text-white/55 text-base font-light max-w-md leading-relaxed">
              A neighbourhood bakery on Maharaja Surajmal Marg, East Delhi — making every moment a little sweeter.
            </p>
            <p className="hidden md:block editorial-label text-white/30 tracking-[0.2em]">
              Rishabh Vihar, Delhi
            </p>
          </div>
        </div>
      </section>

      {/* ─── SECTION 1: WHO WE ARE ─ side by side ──────────────────────── */}
      <section className="mx-auto max-w-[1400px] px-8 md:px-20 py-32">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-20 md:gap-32 items-start">

          {/* LEFT: Images stacked */}
          <div className="flex flex-col gap-6">
            <div className="aspect-[4/5] w-full overflow-hidden rounded-2xl">
              <img
                src={imgGallerySlice}
                alt="A perfectly sliced cake at Bakebook"
                className="h-full w-full object-cover hover:scale-[1.04] transition-transform duration-700"
              />
            </div>
            <div className="grid grid-cols-2 gap-6">
              <div className="aspect-square overflow-hidden rounded-2xl bg-muted">
                <img
                  src={imgFeatureCake}
                  alt="Celebration cake"
                  className="h-full w-full object-cover hover:scale-[1.04] transition-transform duration-700"
                />
              </div>
              <div className="aspect-square overflow-hidden rounded-2xl bg-bakebook-blue flex items-center justify-center p-6 text-center">
                <div>
                  <p className="editorial-label text-white/60 mb-2 tracking-[0.2em]">Flagship</p>
                  <p className="font-display text-white font-black text-xl tracking-tight leading-tight">
                    Rishabh<br />Vihar
                  </p>
                  <p className="editorial-label text-white/50 mt-2 tracking-[0.15em] text-[9px]">Delhi 110092</p>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT: Story copy */}
          <div className="md:pt-8 flex flex-col gap-10">
            <div>
              <p className="editorial-label text-bakebook-blue mb-5 tracking-[0.3em]">Who We Are</p>
              <h2
                className="display-caps text-foreground leading-none mb-8"
                style={{ fontSize: "clamp(2.5rem, 4vw, 5.5rem)" }}
              >
                Made with<br />passion.
              </h2>
            </div>

            <div className="space-y-6 text-base leading-[1.8] text-foreground/65 font-light">
              <p>
                At Bakebook Bakery, we believe every celebration deserves something sweet, beautiful, and unforgettable. Tucked away on Maharaja Surajmal Marg in the heart of Rishabh Vihar, we set out with one simple conviction: that genuinely great baking — made with care, restraint, and premium ingredients — belongs in your neighbourhood.
              </p>
              <p>
                We started small. A tight menu. A short list of things we wanted to do really, really well — and no interest in doing them any other way. The white walls and blue door became a postcode for people who know what they're looking for: food that doesn't need to shout.
              </p>
              <p>
                Today, Bakebook is where East Delhi comes for Belgian waffles on a Sunday afternoon, a slice of cake for a Tuesday you didn't expect to be special, or a completely custom-built centrepiece for the birthday your mum will actually remember. Every single item leaves the oven the day you order it. No exceptions.
              </p>
            </div>

            <div className="flex flex-col gap-4 pt-4 border-t border-border/50">
              <div className="flex items-start gap-5">
                <span className="mt-1 h-2 w-2 rounded-full bg-bakebook-blue flex-shrink-0" />
                <div>
                  <p className="font-display font-bold tracking-tight mb-1">Handcrafted Daily</p>
                  <p className="text-sm font-light text-foreground/55 leading-relaxed">
                    Everything on the menu is made from scratch, every day. We don't hold product overnight and we don't compromise on freshness.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-5">
                <span className="mt-1 h-2 w-2 rounded-full bg-bakebook-blue flex-shrink-0" />
                <div>
                  <p className="font-display font-bold tracking-tight mb-1">Premium Ingredients, Always</p>
                  <p className="text-sm font-light text-foreground/55 leading-relaxed">
                    Quality chocolate, fresh dairy, carefully sourced sugars. We spend more on ingredients than we should, because you taste the difference.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-5">
                <span className="mt-1 h-2 w-2 rounded-full bg-bakebook-blue flex-shrink-0" />
                <div>
                  <p className="font-display font-bold tracking-tight mb-1">Eggless by Choice</p>
                  <p className="text-sm font-light text-foreground/55 leading-relaxed">
                    Our entire dessert menu is egg-free — not as a limitation, but as a commitment to making great food that more people can enjoy.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── FULL-BLEED BREAK ───────────────────────────────────────────── */}
      <section className="h-[60vh] overflow-hidden relative">
        <img
          src={imgGalleryPour}
          alt="Craft pour at Bakebook"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent" />
        <div className="absolute inset-0 flex items-center px-8 md:px-20">
          <blockquote
            className="display-caps text-white leading-none max-w-2xl"
            style={{ fontSize: "clamp(2rem, 4.5vw, 6rem)" }}
          >
            "Every moment<br />deserves something<br />
            <span className="text-bakebook-blue">unforgettable."</span>
          </blockquote>
        </div>
      </section>

      {/* ─── SECTION 2: WHAT WE MAKE ─ side by side ────────────────────── */}
      <section className="mx-auto max-w-[1400px] px-8 md:px-20 py-32">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-20 md:gap-32 items-start">

          {/* LEFT: copy */}
          <div className="flex flex-col gap-10 md:sticky md:top-28">
            <div>
              <p className="editorial-label text-bakebook-blue mb-5 tracking-[0.3em]">The Menu</p>
              <h2
                className="display-caps text-foreground leading-none mb-8"
                style={{ fontSize: "clamp(2.5rem, 4vw, 5.5rem)" }}
              >
                What we<br />make.
              </h2>
            </div>

            <div className="space-y-6 text-base leading-[1.8] text-foreground/65 font-light">
              <p>
                The menu at Bakebook isn't a laundry list — it's a carefully considered set of things we genuinely think we do well. Every category started with a question: what would the ideal version of this actually taste like? Then we worked backwards.
              </p>
              <p>
                Our cakes are where it all started. Vanilla sponge with house-made salted caramel. Deep devil's chocolate with a mirror-finish ganache. Each one is a signature. Each one is assembled by hand, layered slowly, and finished the day it goes out.
              </p>
              <p>
                The Belgian waffles came next — crisp on the outside, soft in the centre, and served with toppings you actually choose. The Dutch mini pancakes followed, made to order and endlessly customisable. These are the things people come back for.
              </p>
              <p>
                On the drinks side, we keep a focused specialty menu: coffees made with care, seasonal specials, and the Mango Matcha that became an instant staple. We're not trying to be everything — just very, very good at a few things.
              </p>
            </div>

            <a
              href="/cakery"
              className="self-start inline-flex items-center gap-3 px-8 py-4 bg-foreground text-background text-[9px] font-bold tracking-[0.22em] uppercase rounded-full hover:bg-bakebook-blue hover:text-white transition-colors duration-300"
            >
              Shop the Cakery →
            </a>
          </div>

          {/* RIGHT: stacked product images */}
          <div className="flex flex-col gap-6">
            <div className="aspect-[4/3] w-full overflow-hidden rounded-2xl">
              <img
                src={imgFeatureMatcha}
                alt="Mango Matcha specialty drink"
                className="h-full w-full object-cover hover:scale-[1.04] transition-transform duration-700"
              />
            </div>
            <div className="aspect-[4/3] w-full overflow-hidden rounded-2xl">
              <img
                src={imgGalleryBread}
                alt="Belgian waffles and pastries"
                className="h-full w-full object-cover hover:scale-[1.04] transition-transform duration-700"
              />
            </div>
            <div className="aspect-[4/3] w-full overflow-hidden rounded-2xl">
              <img
                src={imgFeatureCoffee}
                alt="Specialty coffee at Bakebook"
                className="h-full w-full object-cover hover:scale-[1.04] transition-transform duration-700"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ─── SECTION 3: BESPOKE CAKES ─ side by side ───────────────────── */}
      <section className="bg-muted">
        <div className="mx-auto max-w-[1400px] px-8 md:px-20 py-32">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-20 md:gap-32 items-center">

            {/* LEFT: image */}
            <div className="flex flex-col gap-6">
              <div className="aspect-[3/4] overflow-hidden rounded-2xl">
                <img
                  src={imgCustomCake}
                  alt="Bespoke custom celebration cake"
                  className="h-full w-full object-cover hover:scale-[1.04] transition-transform duration-700"
                />
              </div>
            </div>

            {/* Right: copy */}
            <div className="flex flex-col gap-8">
              <div>
                <p className="editorial-label text-bakebook-coral mb-5 tracking-[0.3em]">Commission</p>
                <h2
                  className="display-caps text-foreground leading-none mb-8"
                  style={{ fontSize: "clamp(2.5rem, 4vw, 5.5rem)" }}
                >
                  Your cake,<br />your story.
                </h2>
              </div>

              <div className="space-y-5 text-base leading-[1.8] text-foreground/65 font-light">
                <p>
                  Some moments in life deserve more than just a cake from a shelf. A first birthday. A retirement you've been counting down to. An anniversary that marks something real. These are the occasions where Bakebook's bespoke service exists.
                </p>
                <p>
                  We work with you directly — on WhatsApp, at your pace — to understand exactly what you're envisioning. Flavour profiles, portion sizes, decorative finish, any dietary requirements. We bring the craft; you bring the story. Together, we make something that people remember.
                </p>
                <p>
                  No templates, no off-the-shelf finish. Every commissioned cake is made from scratch, to order, and designed exclusively for you. We'd love to hear what you have in mind.
                </p>
              </div>

              <a
                href="https://wa.me/919773889591?text=Hi!%20I%20would%20like%20to%20commission%20a%20custom%20cake."
                target="_blank"
                rel="noopener noreferrer"
                className="self-start inline-flex items-center gap-3 px-8 py-4 bg-foreground text-background text-[9px] font-bold tracking-[0.22em] uppercase rounded-full hover:bg-bakebook-blue hover:text-white transition-colors duration-300"
              >
                Start Your Order on WhatsApp
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ─── SECTION 4: THE SPACE ─ side by side ───────────────────────── */}
      <section className="mx-auto max-w-[1400px] px-8 md:px-20 py-32">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-20 md:gap-32 items-start">

          {/* LEFT: copy */}
          <div className="flex flex-col gap-10">
            <div>
              <p className="editorial-label text-bakebook-blue mb-5 tracking-[0.3em]">The Space</p>
              <h2
                className="display-caps text-foreground leading-none mb-8"
                style={{ fontSize: "clamp(2.5rem, 4vw, 5.5rem)" }}
              >
                A place<br />to linger.
              </h2>
            </div>

            <div className="space-y-5 text-base leading-[1.8] text-foreground/65 font-light">
              <p>
                Bakebook is what people mean when they say a neighbourhood spot. The kind of place where you drop in on a Tuesday just to see what's fresh. White walls. The signature blue door. A menu on the counter and space to sit and actually enjoy what you ordered.
              </p>
              <p>
                We're not a destination that requires a special occasion. We're a part of Rishabh Vihar — for the people who live nearby, work nearby, or just happen to know where to look. The space is cosy, considered, and deliberately unhurried.
              </p>
              <p>
                People have called it a great spot for a date, for catching up with someone you've been meaning to see, or for simply treating yourself on a slow afternoon. We like that. That's exactly the energy we were going for.
              </p>
            </div>

            {/* Info grid */}
            <div className="grid grid-cols-2 gap-6 border-t border-border/50 pt-8">
              <div>
                <p className="editorial-label text-bakebook-blue mb-2 tracking-[0.25em]">Location</p>
                <p className="text-sm font-light text-foreground/65 leading-relaxed">
                  78, Maharaja Surajmal Marg<br />
                  Rishabh Vihar, Bahubali Enclave<br />
                  Anand Vihar, Delhi — 110092
                </p>
              </div>
              <div>
                <p className="editorial-label text-bakebook-blue mb-2 tracking-[0.25em]">Hours</p>
                <p className="text-sm font-light text-foreground/65 leading-relaxed">
                  Tuesday – Sunday<br />
                  12:00 PM — 11:00 PM<br />
                  <span className="text-foreground/35">Closed on Mondays</span>
                </p>
              </div>
              <div>
                <p className="editorial-label text-bakebook-blue mb-2 tracking-[0.25em]">Phone</p>
                <a
                  href="tel:+919773889591"
                  className="text-sm font-light text-foreground/65 hover:text-foreground transition-colors"
                >
                  +91 97738 89591
                </a>
              </div>
              <div>
                <p className="editorial-label text-bakebook-blue mb-2 tracking-[0.25em]">Instagram</p>
                <a
                  href="https://www.instagram.com/bakebookbakery/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-light text-foreground/65 hover:text-bakebook-blue transition-colors"
                >
                  @bakebookbakery
                </a>
              </div>
            </div>
          </div>

          {/* RIGHT: images */}
          <div className="flex flex-col gap-6">
            <div className="aspect-square overflow-hidden rounded-2xl">
              <img
                src={imgCafeInterior}
                alt="Bakebook cafe interior"
                className="h-full w-full object-cover hover:scale-[1.04] transition-transform duration-700"
              />
            </div>
            <div className="aspect-[16/9] overflow-hidden rounded-2xl">
              <img
                src={imgFeatureFood}
                alt="Food at Bakebook"
                className="h-full w-full object-cover hover:scale-[1.04] transition-transform duration-700"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ─── FINAL CTA ─────────────────────────────────────────────────── */}
      <section className="bg-bakebook-ink py-32 px-8 md:px-20">
        <div className="mx-auto max-w-[1400px] grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <div>
            <p className="editorial-label text-bakebook-blue mb-6 tracking-[0.3em]">Come Visit</p>
            <h2
              className="display-caps text-white leading-none"
              style={{ fontSize: "clamp(2.5rem, 5vw, 7rem)" }}
            >
              Good things<br />are worth<br />baking for.
            </h2>
          </div>
          <div className="flex flex-col gap-6">
            <p className="text-base font-light leading-[1.8] text-white/55">
              Whether you're popping in for a waffle and a coffee, picking up a cake for someone you love, or commissioning something entirely your own — we'd love to see you. Walk in, reach out, or follow along on Instagram. The door is always open.
            </p>
            <div className="flex flex-wrap gap-4 pt-4">
              <a
                href="/cakery"
                className="inline-flex items-center gap-2 px-8 py-4 bg-bakebook-blue text-white text-[9px] font-bold tracking-[0.22em] uppercase rounded-full hover:bg-white hover:text-foreground transition-colors duration-300"
              >
                Shop the Cakery
              </a>
              <a
                href="https://www.instagram.com/bakebookbakery/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-8 py-4 border border-white/20 text-white text-[9px] font-bold tracking-[0.22em] uppercase rounded-full hover:border-white/50 transition-colors duration-300"
              >
                Follow on Instagram
              </a>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
