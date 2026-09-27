import { Link } from "@tanstack/react-router";

import heroVideo from "@/assets/hero-bakebook-clips-copy-02.mp4";
import featureCoffee from "@/assets/feature-coffee.jpg";
import featureMatcha from "@/assets/feature-matcha.jpg";
import featureFood from "@/assets/feature-food.jpg";
import featureCake from "@/assets/feature-cake.jpg";
import customCake from "@/assets/custom-cake.jpg";
import cafeInterior from "@/assets/cafe-interior.jpg";
import galleryBread from "@/assets/gallery-bread.jpg";
import galleryPour from "@/assets/gallery-pour.jpg";
import gallerySlice from "@/assets/gallery-slice.jpg";

export type IdeaTheme = {
  id: string;
  title: string;
  line: string;
  text: string;
  accent: string;
  shell: string;
  surface: string;
  panel: string;
  textColor: string;
  muted: string;
  border: string;
  button: string;
  buttonText: string;
};

export function IdeaLandingPage({ idea, layout }: { idea: IdeaTheme; layout: "morning" | "cut" | "window" | "shelf" | "drift" | "monolith" }) {
  const cards = [
    { label: "coffee", title: "espresso / cream / slow pour", img: featureCoffee },
    { label: "matcha", title: "whisk / stone / cool foam", img: featureMatcha },
    { label: "food", title: "bread / crust / noon bite", img: featureFood },
  ];

  const gallery = [
    { img: galleryBread, label: "loaf" },
    { img: galleryPour, label: "steam" },
    { img: gallerySlice, label: "layer" },
  ];

  const reveal = (offset: number) => ({ transform: `translateY(${offset}px)` });

  const foodSection = (
    <section className="mx-auto max-w-[1600px] px-6 py-24 md:px-10 md:py-32">
      <div className="mb-10 flex items-end justify-between gap-4">
        <p className="editorial-label" style={{ color: idea.accent }}>food / drink</p>
      </div>
      <div className="grid gap-6 md:grid-cols-3">
        {cards.map((card, index) => (
          <article
            key={card.label}
            className="group overflow-hidden rounded-[28px] border"
            style={{
              background: idea.panel,
              borderColor: idea.border,
              ...reveal(index * 12),
            }}
          >
            <div className="relative aspect-[4/5] overflow-hidden">
              <img
                src={card.img}
                alt={card.label}
                className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.04]"
                loading="lazy"
              />
            </div>
            <div className="space-y-3 p-6">
              <p className="editorial-label" style={{ color: idea.accent }}>{card.label}</p>
              <p className="font-display text-2xl uppercase tracking-[-0.06em]">{card.title}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );

  const cafeCakeSection = (
    <section className="mx-auto max-w-[1600px] px-6 pb-24 md:px-10 md:pb-32">
      <div className="grid gap-6 md:grid-cols-[1.15fr_0.85fr] md:items-center">
        <div className="relative overflow-hidden rounded-[30px] border ani-float-slow" style={{ background: idea.surface, borderColor: idea.border }}>
          <img src={cafeInterior} alt="Bakebook cafe interior" className="h-full w-full object-cover" loading="lazy" />
        </div>

        <div className="grid gap-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="relative aspect-[3/4] overflow-hidden rounded-[24px] border ani-drift-left" style={{ borderColor: idea.border }}>
              <img src={featureCake} alt="Bakebook cake" className="h-full w-full object-cover" loading="lazy" />
            </div>
            <div className="relative aspect-[3/4] overflow-hidden rounded-[24px] border ani-drift-right" style={{ borderColor: idea.border }}>
              <img src={customCake} alt="Custom cake in progress" className="h-full w-full object-cover" loading="lazy" />
            </div>
          </div>
          <div className="rounded-[22px] border p-6" style={{ background: idea.panel, borderColor: idea.border }}>
            <p className="editorial-label" style={{ color: idea.accent }}>room / cake / ritual</p>
            <p className="mt-3 font-display text-4xl uppercase tracking-[-0.06em]">coffee • matcha • cake</p>
          </div>
        </div>
      </div>
    </section>
  );

  const gallerySection = (
    <section className="mx-auto max-w-[1600px] px-6 py-24 md:px-10 md:py-32">
      <div className="grid gap-4 md:grid-cols-3">
        {gallery.map((item, index) => (
          <figure
            key={item.label}
            className="overflow-hidden rounded-[24px] border ani-float-slow"
            style={{
              background: idea.panel,
              borderColor: idea.border,
              animationDelay: `${index * 120}ms`,
              ...reveal(index * 10),
            }}
          >
            <div className="relative aspect-[4/5] overflow-hidden">
              <img src={item.img} alt={item.label} className="h-full w-full object-cover" loading="lazy" />
            </div>
            <figcaption className="p-5">
              <p className="editorial-label" style={{ color: idea.accent }}>{item.label}</p>
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );

  const visitSection = (
    <section className="border-t px-6 py-24 md:px-10 md:py-32" style={{ borderColor: idea.border, background: idea.surface }}>
      <div className="mx-auto grid max-w-[1600px] items-end gap-8 md:grid-cols-[1fr_auto]">
        <div>
          <p className="editorial-label" style={{ color: idea.accent }}>visit</p>
          <h2 className="mt-3 font-display text-5xl uppercase leading-[0.9] tracking-[-0.08em] md:text-7xl">
            warm room
            <br />
            in delhi
          </h2>
        </div>
        <Link
          to="/contact"
          className="editorial-label inline-flex items-center gap-2 rounded-full border px-6 py-4 transition hover:bg-foreground hover:text-background"
          style={{ borderColor: idea.border, color: idea.textColor }}
        >
          get directions
        </Link>
      </div>
    </section>
  );

  if (layout === "morning") {
    return (
      <div className="min-h-screen overflow-x-hidden" style={{ background: idea.shell, color: idea.textColor }}>
        <header className="absolute inset-x-0 top-0 z-30 mx-auto flex w-full max-w-[1600px] items-center justify-between px-6 py-6 md:px-10">
          <Link to="/" className="font-display text-[0.8rem] uppercase tracking-[0.2em] text-white">Bakebook</Link>
          <div className="flex items-center gap-3">
            <Link to="/" className="editorial-label text-white/75 hover:text-white">home</Link>
            <a href="https://order.bakebook.example" className="editorial-label rounded-full border border-white/40 bg-white/5 px-4 py-2 text-white backdrop-blur-sm transition hover:bg-white hover:text-black">order now</a>
          </div>
        </header>

        <section className="relative h-[90vh] min-h-[760px] w-full overflow-hidden">
          <div className="absolute inset-0">
            <video src={heroVideo} className="h-full w-full object-cover object-center scale-[1.05]" autoPlay loop muted playsInline />
            <div className="absolute inset-0 bg-gradient-to-t from-black/68 via-black/14 to-black/32" />
          </div>
          <div className="absolute inset-x-0 bottom-0 z-20 mx-auto w-full max-w-[1600px] px-6 pb-10 md:px-10 md:pb-14">
            <div className="grid gap-8 md:grid-cols-[1.2fr_0.8fr] md:items-end">
              <div>
                <p className="editorial-label mb-4 text-white/70">{idea.line}</p>
                <h1 className="font-display text-[12vw] font-black uppercase leading-[0.76] tracking-[-0.08em] text-white sm:text-[9vw] lg:text-[7.6rem]">{idea.title}</h1>
              </div>
              <div className="md:justify-self-end">
                <p className="max-w-xs text-sm leading-relaxed text-white/75 md:text-right">{idea.text}</p>
              </div>
            </div>
          </div>
        </section>

        {foodSection}
        {cafeCakeSection}
        {gallerySection}
        {visitSection}
      </div>
    );
  }

  if (layout === "cut") {
    return (
      <div className="min-h-screen overflow-x-hidden" style={{ background: idea.shell, color: idea.textColor }}>
        <header className="absolute inset-x-0 top-0 z-30 mx-auto flex w-full max-w-[1600px] items-center justify-between px-6 py-6 md:px-10">
          <Link to="/" className="font-display text-[0.8rem] uppercase tracking-[0.2em] text-white">Bakebook</Link>
          <div className="flex items-center gap-3">
            <Link to="/" className="editorial-label text-white/75 hover:text-white">home</Link>
            <a href="https://order.bakebook.example" className="editorial-label rounded-full border border-white/40 bg-white/5 px-4 py-2 text-white backdrop-blur-sm transition hover:bg-white hover:text-black">order now</a>
          </div>
        </header>

        <section className="relative h-[88vh] min-h-[700px] w-full overflow-hidden">
          <div className="absolute inset-0">
            <video src={heroVideo} className="h-full w-full object-cover object-center scale-[1.05]" autoPlay loop muted playsInline />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/15 to-black/40" />
          </div>
          <div className="absolute inset-x-0 bottom-0 z-20 mx-auto w-full max-w-[1600px] px-6 pb-10 md:px-10 md:pb-14">
            <p className="editorial-label mb-4 text-white/70">{idea.line}</p>
            <h1 className="font-display text-[12vw] font-black uppercase leading-[0.76] tracking-[-0.08em] text-white sm:text-[9vw] lg:text-[7.5rem]">{idea.title}</h1>
          </div>
        </section>

        <section className="mx-auto max-w-[1600px] px-6 py-24 md:px-10 md:py-32">
          <div className="flex gap-4 overflow-x-auto pb-2 md:gap-6">
            {[featureCoffee, cafeInterior, galleryBread, featureCake, galleryPour, featureMatcha, customCake, featureFood].map((img, index) => (
              <div
                key={`${img}-${index}`}
                className="group relative min-w-[260px] overflow-hidden rounded-[22px] border md:min-w-[380px]"
                style={{
                  background: idea.surface,
                  borderColor: idea.border,
                  transform: index % 2 === 0 ? "translateY(0)" : "translateY(18px)",
                }}
              >
                <div className="relative aspect-[4/5] overflow-hidden">
                  <img src={img} alt="Bakebook frame" className="h-full w-full object-cover transition duration-700 group-hover:scale-105" loading="lazy" />
                </div>
                <div className="flex items-center justify-between p-4 text-[0.6rem] uppercase tracking-[0.22em]" style={{ color: idea.muted }}>
                  <span>{index + 1}</span>
                  <span>scene</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {foodSection}
        {cafeCakeSection}
        {gallerySection}
        {visitSection}
      </div>
    );
  }

  if (layout === "window") {
    return (
      <div className="min-h-screen overflow-x-hidden" style={{ background: idea.shell, color: idea.textColor }}>
        <header className="absolute inset-x-0 top-0 z-30 mx-auto flex w-full max-w-[1600px] items-center justify-between px-6 py-6 md:px-10">
          <Link to="/" className="font-display text-[0.8rem] uppercase tracking-[0.2em] text-white">Bakebook</Link>
          <div className="flex items-center gap-3">
            <Link to="/" className="editorial-label text-white/75 hover:text-white">home</Link>
            <a href="https://order.bakebook.example" className="editorial-label rounded-full border border-white/40 bg-white/5 px-4 py-2 text-white backdrop-blur-sm transition hover:bg-white hover:text-black">order now</a>
          </div>
        </header>

        <section className="relative h-[86vh] min-h-[700px] w-full overflow-hidden">
          <div className="absolute inset-0">
            <video src={heroVideo} className="h-full w-full object-cover object-center scale-[1.08]" autoPlay loop muted playsInline />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/18 to-black/35" />
          </div>
          <div className="absolute inset-x-0 bottom-0 z-20 mx-auto w-full max-w-[1600px] px-6 pb-12 md:px-10 md:pb-16">
            <div className="max-w-xl">
              <p className="editorial-label text-white/70">{idea.line}</p>
              <h1 className="mt-4 font-display text-[12vw] font-black uppercase leading-[0.76] tracking-[-0.08em] text-white sm:text-[9vw] lg:text-[7.5rem]">{idea.title}</h1>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-[1600px] px-6 py-24 md:px-10 md:py-32">
          <div className="grid gap-6 md:grid-cols-[1.15fr_0.85fr] md:items-center">
            <div className="relative overflow-hidden rounded-[32px] border ani-float-slow" style={{ background: idea.panel, borderColor: idea.border }}>
              <img src={cafeInterior} alt="Cafe interior" className="h-full w-full object-cover" loading="lazy" />
            </div>
            <div className="space-y-5">
              <div className="rounded-[24px] border p-6" style={{ background: idea.surface, borderColor: idea.border }}>
                <p className="editorial-label" style={{ color: idea.accent }}>window / room</p>
                <p className="mt-3 font-display text-4xl uppercase tracking-[-0.06em]">bread / light / stay</p>
              </div>
              <div className="relative aspect-[3/4] overflow-hidden rounded-[24px] border ani-drift-left" style={{ borderColor: idea.border }}>
                <img src={featureCake} alt="Cake" className="h-full w-full object-cover" loading="lazy" />
              </div>
            </div>
          </div>
        </section>

        {foodSection}
        {cafeCakeSection}
        {gallerySection}
        {visitSection}
      </div>
    );
  }

  if (layout === "shelf") {
    return (
      <div className="min-h-screen overflow-x-hidden" style={{ background: idea.shell, color: idea.textColor }}>
        <header className="absolute inset-x-0 top-0 z-30 mx-auto flex w-full max-w-[1600px] items-center justify-between px-6 py-6 md:px-10">
          <Link to="/" className="font-display text-[0.8rem] uppercase tracking-[0.2em] text-white">Bakebook</Link>
          <div className="flex items-center gap-3">
            <Link to="/" className="editorial-label text-white/75 hover:text-white">home</Link>
            <a href="https://order.bakebook.example" className="editorial-label rounded-full border border-white/40 bg-white/5 px-4 py-2 text-white backdrop-blur-sm transition hover:bg-white hover:text-black">order now</a>
          </div>
        </header>

        <section className="relative h-[88vh] min-h-[700px] w-full overflow-hidden">
          <div className="absolute inset-0">
            <video src={heroVideo} className="h-full w-full object-cover object-center scale-[1.05]" autoPlay loop muted playsInline />
            <div className="absolute inset-0 bg-gradient-to-t from-black/68 via-black/15 to-black/35" />
          </div>
          <div className="absolute inset-x-0 bottom-0 z-20 mx-auto w-full max-w-[1600px] px-6 pb-12 md:px-10 md:pb-16">
            <div className="grid gap-8 md:grid-cols-[1fr_1fr] md:items-end">
              <h1 className="font-display text-[12vw] font-black uppercase leading-[0.76] tracking-[-0.08em] text-white sm:text-[9vw] lg:text-[7.5rem]">{idea.title}</h1>
              <p className="max-w-sm justify-self-end text-sm leading-relaxed text-white/75 md:text-right">{idea.text}</p>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-[1600px] px-6 py-24 md:px-10 md:py-32">
          <div className="grid gap-4 md:grid-cols-3">
            {gallery.map((item, index) => (
              <figure
                key={item.label}
                className="overflow-hidden rounded-[26px] border ani-float-slow"
                style={{
                  background: idea.panel,
                  borderColor: idea.border,
                  animationDelay: `${index * 120}ms`,
                  transform: `translateY(${index * 12}px)`,
                }}
              >
                <div className="relative aspect-[4/5] overflow-hidden">
                  <img src={item.img} alt={item.label} className="h-full w-full object-cover" loading="lazy" />
                </div>
                <figcaption className="p-5">
                  <p className="editorial-label" style={{ color: idea.accent }}>{item.label}</p>
                </figcaption>
              </figure>
            ))}
          </div>
        </section>

        {foodSection}
        {cafeCakeSection}
        {visitSection}
      </div>
    );
  }

  if (layout === "drift") {
    return (
      <div className="min-h-screen overflow-x-hidden" style={{ background: idea.shell, color: idea.textColor }}>
        <header className="absolute inset-x-0 top-0 z-30 mx-auto flex w-full max-w-[1600px] items-center justify-between px-6 py-6 md:px-10">
          <Link to="/" className="font-display text-[0.8rem] uppercase tracking-[0.2em] text-white">Bakebook</Link>
          <div className="flex items-center gap-3">
            <Link to="/" className="editorial-label text-white/75 hover:text-white">home</Link>
            <a href="https://order.bakebook.example" className="editorial-label rounded-full border border-white/40 bg-white/5 px-4 py-2 text-white backdrop-blur-sm transition hover:bg-white hover:text-black">order now</a>
          </div>
        </header>

        <section className="relative h-[90vh] min-h-[760px] w-full overflow-hidden">
          <div className="absolute inset-0">
            <video src={heroVideo} className="h-full w-full object-cover object-center scale-[1.05]" autoPlay loop muted playsInline />
            <div className="absolute inset-0 bg-gradient-to-t from-black/68 via-black/16 to-black/38" />
          </div>
          <div className="absolute inset-x-0 bottom-0 z-20 mx-auto w-full max-w-[1600px] px-6 pb-10 md:px-10 md:pb-14">
            <div className="max-w-2xl">
              <p className="editorial-label text-white/70">{idea.line}</p>
              <h1 className="mt-4 font-display text-[12vw] font-black uppercase leading-[0.76] tracking-[-0.08em] text-white sm:text-[9vw] lg:text-[7.6rem]">{idea.title}</h1>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-[1600px] px-6 py-24 md:px-10 md:py-32">
          <div className="space-y-6">
            {[
              { label: "loaf", img: galleryBread },
              { label: "bean", img: featureCoffee },
              { label: "sandwich", img: cafeInterior },
              { label: "cake", img: featureCake },
            ].map((item, index) => (
              <div
                key={item.label}
                className="grid gap-4 rounded-[26px] border p-4 md:grid-cols-[180px_1fr] md:items-center md:p-5"
                style={{
                  background: idea.panel,
                  borderColor: idea.border,
                  transform: index % 2 === 0 ? "translateX(0)" : "translateX(18px)",
                }}
              >
                <div className="font-display text-3xl uppercase tracking-[-0.07em]">{item.label}</div>
                <div className="relative aspect-[16/9] overflow-hidden rounded-[18px] border ani-float-slow" style={{ borderColor: idea.border }}>
                  <img src={item.img} alt={item.label} className="h-full w-full object-cover" loading="lazy" />
                </div>
              </div>
            ))}
          </div>
        </section>

        {foodSection}
        {cafeCakeSection}
        {gallerySection}
        {visitSection}
      </div>
    );
  }

  return (
    <div className="min-h-screen overflow-x-hidden" style={{ background: idea.shell, color: idea.textColor }}>
      <header className="absolute inset-x-0 top-0 z-30 mx-auto flex w-full max-w-[1600px] items-center justify-between px-6 py-6 md:px-10">
        <Link to="/" className="font-display text-[0.8rem] uppercase tracking-[0.2em] text-white">Bakebook</Link>
        <div className="flex items-center gap-3">
          <Link to="/" className="editorial-label text-white/75 hover:text-white">home</Link>
          <a href="https://order.bakebook.example" className="editorial-label rounded-full border border-white/40 bg-white/5 px-4 py-2 text-white backdrop-blur-sm transition hover:bg-white hover:text-black">order now</a>
        </div>
      </header>

      <section className="relative h-[88vh] min-h-[700px] w-full overflow-hidden">
        <div className="absolute inset-0">
          <video src={heroVideo} className="h-full w-full object-cover object-center scale-[1.05]" autoPlay loop muted playsInline />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/18 to-black/38" />
        </div>
        <div className="absolute inset-x-0 bottom-0 z-20 mx-auto w-full max-w-[1600px] px-6 pb-12 md:px-10 md:pb-16">
          <div className="max-w-2xl">
            <p className="editorial-label text-white/70">{idea.line}</p>
            <h1 className="mt-4 font-display text-[12vw] font-black uppercase leading-[0.74] tracking-[-0.08em] text-white sm:text-[9vw] lg:text-[7.5rem]">{idea.title}</h1>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1600px] px-6 py-24 md:px-10 md:py-32">
        <div className="grid gap-6 md:grid-cols-[0.9fr_1.1fr] md:items-center">
          <div className="space-y-4">
            <div className="rounded-[26px] border p-6" style={{ background: idea.surface, borderColor: idea.border }}>
              <p className="editorial-label" style={{ color: idea.accent }}>bread / bean / steam</p>
              <p className="mt-3 font-display text-5xl uppercase tracking-[-0.07em]">warm • slow • bright</p>
            </div>
            <div className="rounded-[26px] border p-6" style={{ background: idea.panel, borderColor: idea.border }}>
              <p className="editorial-label" style={{ color: idea.accent }}>room / cake / stay</p>
              <p className="mt-3 font-display text-5xl uppercase tracking-[-0.07em]">coffee • matcha • cake</p>
            </div>
          </div>
          <div className="relative overflow-hidden rounded-[30px] border ani-float-slow" style={{ borderColor: idea.border }}>
            <img src={cafeInterior} alt="Cafe interior" className="h-full w-full object-cover" loading="lazy" />
          </div>
        </div>
      </section>

      {foodSection}
      {cafeCakeSection}
      {gallerySection}
      {visitSection}
    </div>
  );
}
