import { createFileRoute, Link } from "@tanstack/react-router";
import { Logomark } from "@/components/Logo";
import { Marquee } from "@/components/Marquee";
import heroVideo from "@/assets/hero-bakebook-clips3.mp4";
import page06 from "@/assets/page_06.png";
import featureCoffee from "@/assets/feature-coffee.jpg";
import featureMatcha from "@/assets/feature-matcha.jpg";
import featureFood from "@/assets/feature-food.jpg";
import featureCake from "@/assets/feature-cake.jpg";
import cafeInterior from "@/assets/cafe-interior.jpg";
import customCake from "@/assets/custom-cake.jpg";
import galleryBread from "@/assets/gallery-bread.jpg";
import galleryPour from "@/assets/gallery-pour.jpg";
import gallerySlice from "@/assets/gallery-slice.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Bakebook Bakery — Baked to be remembered" },
      {
        name: "description",
        content:
          "A bakery, a cafe, a cakery. Specialty coffee, matcha, sandwiches and bespoke cakes — Delhi, baked fresh daily.",
      },
      { property: "og:title", content: "Bakebook Bakery — Baked to be remembered" },
      {
        property: "og:description",
        content: "Specialty coffee, matcha, sandwiches and bespoke cakes. Delhi.",
      },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <div>
      <Hero />
      <Rewards />
      <CafePreview />
      <FeatureGrid />
      <SignatureCake />
      <Gallery />
      <Visit />
      <Closing />
    </div>
  );
}

/* ──────────────────────────────────────────────────────────────────────────
   HERO
   ────────────────────────────────────────────────────────────────────────── */
function Hero() {
  return (
    <section className="relative h-screen w-full overflow-hidden bg-muted">
      {/* Full screen background image */}
      <div className="grain grain-strong absolute inset-0 h-full w-full">
        <video
          src={heroVideo}
          className="h-full w-full object-cover object-center"
          autoPlay
          loop
          muted
          playsInline
        />
        {/* Vignette/overlay for readability */}
        <div className="pointer-events-none absolute inset-0 z-[1] bg-gradient-to-t from-black/50 via-transparent to-black/30" />
      </div>

      {/* Hero content overlay */}
      <div className="absolute inset-x-0 bottom-0 z-10 mx-auto w-full max-w-[1600px] px-6 pb-12 md:px-10 md:pb-16 lg:pb-20">
        <div className="grid grid-cols-1 items-end gap-8 md:grid-cols-2 md:gap-16">
          {/* Bottom Left Title */}
          <div>
            <h1 className="font-display text-[12vw] font-black uppercase leading-none tracking-tighter text-white sm:text-[9vw] md:text-[6.5vw] lg:text-[7.5rem]">
              BE CAREFUL,<br />
              WE'RE HOT.
            </h1>
          </div>

          {/* Bottom Right CTA */}
          <div className="flex flex-col items-start md:items-end md:text-right">
            <div className="mt-6">
              <a
                href="https://order.bakebook.example"
                className="editorial-label inline-flex items-center gap-2 rounded-full border border-white px-7 py-3.5 text-white transition-all duration-300 hover:bg-white hover:text-black"
              >
                Order Now
                <Arrow />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ──────────────────────────────────────────────────────────────────────────
   REWARDS — Blank Street style rewards section
   ────────────────────────────────────────────────────────────────────────── */
function Rewards() {
  return (
    <section className="mx-auto max-w-[1600px] px-6 py-28 md:px-10 md:py-40">
      <div className="grid grid-cols-1 items-center gap-12 md:grid-cols-2 md:gap-16 lg:gap-24">
        {/* Left Side: Text Content */}
        <div className="max-w-xl">
          <h2 className="font-display text-[10vw] font-black uppercase leading-[0.9] tracking-[-0.02em] text-foreground sm:text-[8vw] md:text-5xl lg:text-[5.5rem]">
            REWARDS THAT<br />
            MEAN BUSINESS.
          </h2>
          <p className="mt-6 text-base leading-relaxed text-foreground/80 md:text-lg">
            We make drinks that make your day. We thought rewards should match. Earn points on every order and redeem them for discounts.
          </p>
          <div className="mt-8">
            <Link
              to="/about"
              className="editorial-label inline-flex items-center gap-2 font-bold transition-colors hover:text-bakebook-blue"
            >
              LEARN MORE
              <Arrow />
            </Link>
          </div>
        </div>
        
        {/* Right Side: Image */}
        <div className="relative w-full">
          <div className="relative w-full overflow-hidden bg-muted">
            <img
              src={page06}
              alt="Rewards that mean business"
              className="h-full w-full object-cover object-center"
              loading="lazy"
              width={1600}
              height={1200}
            />
          </div>
        </div>
      </div>
    </section>
  );
}

/* ──────────────────────────────────────────────────────────────────────────
   CAFE PREVIEW — split-screen, image left, type right
   ────────────────────────────────────────────────────────────────────────── */
function CafePreview() {
  return (
    <section className="border-t border-border">
      <div className="mx-auto grid max-w-[1600px] grid-cols-1 md:grid-cols-2">
        <div className="relative aspect-[4/5] w-full overflow-hidden rounded-[24px] bg-muted md:rounded-[32px] md:aspect-auto md:min-h-[720px]">
          <img
            src={cafeInterior}
            alt="The Bakebook cafe interior in soft afternoon light"
            className="h-full w-full object-cover"
            loading="lazy"
            width={1920}
            height={1080}
          />
        </div>
        <div className="flex flex-col justify-between p-8 md:p-16 lg:p-24">
          <p className="editorial-label text-bakebook-blue">— The Cafe</p>
          <div className="mt-12 md:mt-0">
            <h2 className="display-caps text-5xl text-foreground md:text-7xl">
              You came
              <br />
              for coffee.
              <br />
              You'll stay
              <br />
              for the
              <br />
              sandwich.
            </h2>
            <p className="mt-10 max-w-md text-base leading-relaxed text-foreground/75">
              A small room of light wood and white walls. Arabica beans roasted for
              Bakebook, ceremonial matcha whisked to order, and bread sliced into
              sandwiches worth staying for.
            </p>
            <div className="mt-10 flex flex-wrap gap-3">
              <Link
                to="/cafe"
                className="editorial-label inline-flex items-center gap-2 rounded-full bg-foreground px-6 py-4 text-background transition-colors hover:bg-bakebook-blue"
              >
                Explore the Cafe
                <Arrow />
              </Link>
              <a
                href="https://order.bakebook.example"
                className="editorial-label inline-flex items-center gap-2 rounded-full border border-foreground px-6 py-4 text-foreground transition-colors hover:bg-foreground hover:text-background"
              >
                Order Now
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ──────────────────────────────────────────────────────────────────────────
   FEATURE GRID — Coffee · Matcha · Food
   ────────────────────────────────────────────────────────────────────────── */
function FeatureGrid() {
  const items = [
    {
      label: "01 — Coffee",
      title: "Arabica, roasted for Bakebook",
      caption: "Single-origin espresso, slow-pour filter, flat whites poured by hand.",
      img: featureCoffee,
      alt: "A small white cup of espresso on a pale grey surface",
    },
    {
      label: "02 — Matcha",
      title: "Ceremonial grade, whisked to order",
      caption: "Stone-milled in Uji, prepared the traditional way. Hot or iced.",
      img: featureMatcha,
      alt: "Matcha latte with delicate foam art on a marble table",
    },
    {
      label: "03 — Food",
      title: "Sandwiches on the bread we bake",
      caption: "Sourdough at sunrise. Crisp crust, open crumb, built with intention.",
      img: featureFood,
      alt: "A gourmet sandwich on artisan sourdough",
    },
  ];

  return (
    <section className="mx-auto max-w-[1600px] px-6 py-28 md:px-10 md:py-40">
      <div className="grid grid-cols-1 gap-12 md:grid-cols-[auto_1fr] md:items-end md:gap-24">
        <h2 className="display-caps text-5xl text-foreground md:text-7xl">
          The small
          <br />
          menu.
        </h2>
        <p className="max-w-sm pb-2 text-sm leading-relaxed text-muted-foreground md:text-right">
          A handful of things, made well. Three pillars and a rotating list of seasonal
          pastries.
        </p>
      </div>

      <div className="mt-16 grid grid-cols-1 gap-10 md:mt-24 md:grid-cols-3 md:gap-8">
        {items.map((item) => (
          <article key={item.label} className="group flex flex-col">
            <div className="relative aspect-[4/5] w-full overflow-hidden rounded-[20px] bg-muted">
              <img
                src={item.img}
                alt={item.alt}
                className="h-full w-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-[1.03]"
                loading="lazy"
                width={1080}
                height={1350}
              />
            </div>
            <div className="mt-6">
              <p className="editorial-label text-bakebook-blue">{item.label}</p>
              <h3 className="mt-4 font-display text-2xl leading-tight tracking-[-0.015em] text-foreground md:text-3xl">
                {item.title}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                {item.caption}
              </p>
            </div>
          </article>
        ))}
      </div>

      <div className="mt-16 flex justify-end md:mt-20">
        <Link
          to="/cafe"
          className="editorial-label inline-flex items-center gap-2 border-b border-foreground pb-1 text-foreground transition-colors hover:text-bakebook-blue hover:border-bakebook-blue"
        >
          View the full menu
          <Arrow />
        </Link>
      </div>
    </section>
  );
}

/* ──────────────────────────────────────────────────────────────────────────
   SIGNATURE CAKE / CUSTOM CAKE TEASER — full-bleed editorial spread
   ────────────────────────────────────────────────────────────────────────── */
function SignatureCake() {
  return (
    <section className="border-t border-border bg-muted/40">
      <div className="mx-auto max-w-[1600px] px-6 py-28 md:px-10 md:py-40">
        <div className="grid grid-cols-1 gap-16 md:grid-cols-[1fr_1fr] md:items-end md:gap-20">
          <div className="order-2 md:order-1">
            <p className="editorial-label text-bakebook-blue">— The Cakery</p>
            <h2 className="mt-6 display-caps text-5xl text-foreground md:text-7xl">
              Cakes,
              <br />
              made the
              <br />
              long way.
            </h2>
            <p className="mt-10 max-w-md text-base leading-relaxed text-foreground/80">
              From ready-made signatures to fully bespoke celebration cakes. Tell us
              what you're celebrating; we'll bake something worth remembering.
            </p>
            <div className="mt-10 flex flex-wrap gap-3">
              <Link
                to="/cakery"
                className="editorial-label inline-flex items-center gap-2 rounded-full bg-foreground px-6 py-4 text-background transition-colors hover:bg-bakebook-blue"
              >
                Shop Cakes
                <Arrow />
              </Link>
              <Link
                to="/cakery"
                className="editorial-label inline-flex items-center gap-2 rounded-full border border-foreground px-6 py-4 text-foreground transition-colors hover:bg-foreground hover:text-background"
              >
                Commission a Custom Cake
              </Link>
            </div>
          </div>

          <div className="order-1 grid grid-cols-2 gap-3 md:order-2 md:gap-4">
            <div className="relative aspect-[3/4] overflow-hidden rounded-[20px] bg-background">
              <img
                src={featureCake}
                alt="Minimal white celebration cake on a pedestal"
                className="h-full w-full object-cover"
                loading="lazy"
                width={1400}
                height={1750}
              />
            </div>
            <div className="mt-12 flex flex-col gap-3 md:gap-4">
              <div className="relative aspect-square overflow-hidden rounded-[20px] bg-background">
                <img
                  src={customCake}
                  alt="A baker piping cream onto a custom cake"
                  className="h-full w-full object-cover"
                  loading="lazy"
                  width={1600}
                  height={1100}
                />
              </div>
              <div className="border-t border-border pt-4">
                <p className="editorial-label text-muted-foreground">Lead time</p>
                <p className="mt-2 font-display text-2xl tracking-[-0.02em] text-foreground">
                  72 hours
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  for bespoke cakes. Ready-made cakes ship same day.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ──────────────────────────────────────────────────────────────────────────
   GALLERY — three frames, editorial captions
   ────────────────────────────────────────────────────────────────────────── */
function Gallery() {
  const frames = [
    { img: galleryBread, label: "001 — Loaves", caption: "Sourdough, dusted, racked." },
    { img: galleryPour, label: "002 — Pour", caption: "Steamed milk into espresso." },
    { img: gallerySlice, label: "003 — Layer", caption: "Vanilla sponge, cream filling." },
  ];

  return (
    <section className="border-y border-border">
      <Marquee
        items={[
          "Baked fresh daily",
          "Arabica beans roasted for Bakebook",
          "Best things are always in between the bread",
          "Sweet and precise",
          "Delicate layers",
        ]}
      />
      <div className="mx-auto grid max-w-[1600px] grid-cols-1 md:grid-cols-3">
        {frames.map((f, i) => (
          <figure
            key={f.label}
            className={`relative ${i !== 0 ? "md:border-l md:border-border" : ""} ${i !== 0 ? "border-t border-border md:border-t-0" : ""}`}
          >
            <div className="relative aspect-[4/5] overflow-hidden rounded-[20px] bg-muted">
              <img
                src={f.img}
                alt={f.caption}
                className="h-full w-full object-cover"
                loading="lazy"
                width={1200}
                height={1500}
              />
            </div>
            <figcaption className="flex items-center justify-between p-6">
              <span className="editorial-label text-muted-foreground">{f.label}</span>
              <span className="text-xs italic text-foreground/70">{f.caption}</span>
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}

/* ──────────────────────────────────────────────────────────────────────────
   VISIT — location block
   ────────────────────────────────────────────────────────────────────────── */
function Visit() {
  return (
    <section className="mx-auto max-w-[1600px] px-6 py-28 md:px-10 md:py-40">
      <div className="grid grid-cols-1 gap-16 md:grid-cols-[1.1fr_1fr] md:gap-24">
        <div>
          <p className="editorial-label text-bakebook-blue">— Visit</p>
          <h2 className="mt-6 display-caps text-5xl text-foreground md:text-7xl">
            One room,
            <br />
            in Delhi.
          </h2>
          <p className="mt-8 max-w-md text-base leading-relaxed text-foreground/80">
            Tucked between Rishabh Vihar and Bahubali Enclave on Maharaja Surajmal
            Marg. Walk in, sit by the window, watch the bread cool.
          </p>

          <dl className="mt-12 grid grid-cols-2 gap-y-8 border-t border-border pt-10 text-sm">
            <div>
              <dt className="editorial-label text-muted-foreground">Address</dt>
              <dd className="mt-3 leading-relaxed text-foreground">
                78, Maharaja Surajmal Marg
                <br />
                Rishabh Vihar, Anand Vihar
                <br />
                Delhi — 110092
              </dd>
            </div>
            <div>
              <dt className="editorial-label text-muted-foreground">Hours</dt>
              <dd className="mt-3 leading-relaxed text-foreground">
                Mon – Fri  ·  8 – 10
                <br />
                Sat – Sun  ·  9 – 11
              </dd>
            </div>
            <div>
              <dt className="editorial-label text-muted-foreground">Phone</dt>
              <dd className="mt-3 text-foreground">+91 11 0000 0000</dd>
            </div>
            <div>
              <dt className="editorial-label text-muted-foreground">Social</dt>
              <dd className="mt-3 text-foreground">@bakebookbakery</dd>
            </div>
          </dl>

          <div className="mt-10">
            <Link
              to="/contact"
              className="editorial-label inline-flex items-center gap-2 border-b border-foreground pb-1 text-foreground transition-colors hover:text-bakebook-blue hover:border-bakebook-blue"
            >
              Get directions
              <Arrow />
            </Link>
          </div>
        </div>

        {/* Minimal map placeholder — single Bakebook bookmark pin on a grid */}
        <div className="relative aspect-square w-full overflow-hidden rounded-[24px] border border-border bg-muted">
          <MinimalMap />
        </div>
      </div>
    </section>
  );
}

function MinimalMap() {
  return (
    <div className="relative h-full w-full">
      {/* faint grid */}
      <svg
        className="absolute inset-0 h-full w-full"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        aria-hidden
      >
        <defs>
          <pattern id="g" width="6.25" height="6.25" patternUnits="userSpaceOnUse">
            <path d="M 6.25 0 L 0 0 0 6.25" fill="none" stroke="currentColor" strokeWidth="0.15" />
          </pattern>
        </defs>
        <rect width="100" height="100" fill="url(#g)" className="text-foreground/15" />
        {/* "road" diagonals */}
        <line x1="0" y1="65" x2="100" y2="35" stroke="currentColor" strokeWidth="0.6" className="text-foreground/30" />
        <line x1="35" y1="0" x2="55" y2="100" stroke="currentColor" strokeWidth="0.4" className="text-foreground/25" />
      </svg>
      {/* pin */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-full">
        <Logomark className="h-12 w-auto drop-shadow-sm" color="var(--color-bakebook-blue)" />
      </div>
      <div className="absolute left-1/2 top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-bakebook-blue/20 ring-1 ring-bakebook-blue/40" />
      <p className="editorial-label absolute bottom-5 left-5 text-foreground/70">
        Bakebook · Anand Vihar
      </p>
    </div>
  );
}

/* ──────────────────────────────────────────────────────────────────────────
   CLOSING — soft sign-off
   ────────────────────────────────────────────────────────────────────────── */
function Closing() {
  return (
    <section className="border-t border-border bg-foreground text-background">
      <div className="mx-auto max-w-[1600px] px-6 py-32 md:px-10 md:py-48">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-[auto_1fr] md:items-end md:gap-24">
          <Logomark className="h-16 w-auto md:h-24" color="var(--color-bakebook-blue)" />
          <div>
            <h2 className="display-caps text-5xl md:text-8xl">
              You always
              <br />
              do.
            </h2>
            <p className="mt-8 max-w-md text-base leading-relaxed text-background/70">
              You came for coffee, but you'll stay for the sandwich. We'll keep the
              kettle on.
            </p>
            <div className="mt-10 flex flex-wrap gap-3">
              <a
                href="https://order.bakebook.example"
                className="editorial-label inline-flex items-center gap-2 rounded-full bg-background px-6 py-4 text-foreground transition-colors hover:bg-bakebook-blue hover:text-background"
              >
                Order Now
                <Arrow />
              </a>
              <Link
                to="/contact"
                className="editorial-label inline-flex items-center gap-2 rounded-full border border-background/40 px-6 py-4 text-background transition-colors hover:bg-background hover:text-foreground"
              >
                Visit Us
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ──────────────────────────────────────────────────────────────────────────
   Bits
   ────────────────────────────────────────────────────────────────────────── */
function Arrow() {
  return (
    <svg width="14" height="10" viewBox="0 0 14 10" fill="none" aria-hidden>
      <path
        d="M1 5h12m0 0L9 1m4 4L9 9"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinecap="square"
      />
    </svg>
  );
}
