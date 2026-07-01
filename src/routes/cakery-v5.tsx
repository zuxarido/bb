import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect, useRef } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { X, Plus, Minus, ShoppingBag } from "lucide-react";

import imgHero from "@/assets/hero-bakery-cozy.png";
import imgNutellaCookie from "@/assets/product-cookie-nutella.png";
import imgDoubleChoc from "@/assets/product-cookie-double.png";
import imgVanillaCake from "@/assets/product-cake-vanilla.png";
import imgDevilsCake from "@/assets/product-cake-devil.png";
import imgFeatureCake from "@/assets/feature-cake.jpg";
import imgGalleryPour from "@/assets/gallery-pour.jpg";
import imgGalleryBread from "@/assets/gallery-bread.jpg";

export const Route = createFileRoute("/cakery-v5")({
  head: () => ({ meta: [{ title: "The Cakery V5 — Bakebook Bakery" }] }),
  component: CakeryPageV5,
});

type Product = {
  id: string;
  name: string;
  price: number;
  image: string;
  category: "Cookie" | "Cake" | "Custom";
  description: string;
  origin?: string;
};

const PRODUCTS: Product[] = [
  {
    id: "cookie-nutella",
    name: "Nutella Sea Salt Cookie",
    price: 250,
    image: imgNutellaCookie,
    category: "Cookie",
    description: "Thick, gooey centre. Dark chocolate chunks folded through Nutella dough. Finished with Maldon sea salt flakes.",
    origin: "Best Seller",
  },
  {
    id: "cake-vanilla",
    name: "Vanilla Caramel Cake",
    price: 880,
    image: imgVanillaCake,
    category: "Cake",
    description: "Vanilla sponge layered with house-made salted caramel and roasted almonds. A study in restraint.",
    origin: "Signature",
  },
  {
    id: "cookie-double",
    name: "Double Chocolate Cookie",
    price: 250,
    image: imgDoubleChoc,
    category: "Cookie",
    description: "Dutch-process cocoa dough, semi-sweet chips, dark chocolate core. Deliberately indulgent.",
  },
  {
    id: "cake-devil",
    name: "Devil's Chocolate Cake",
    price: 780,
    image: imgDevilsCake,
    category: "Cake",
    description: "Deep layers of dark chocolate sponge under a mirror-gloss ganache. For the uncompromising.",
  },
];

type CartItem = Product & { quantity: number };

function CakeryPageV5() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState<"ALL" | "CAKES" | "COOKIES">("ALL");
  const [visibleItems, setVisibleItems] = useState<Set<string>>(new Set());
  const itemRefs = useRef<Map<string, HTMLElement>>(new Map());

  useEffect(() => {
    const count = cart.reduce((sum, item) => sum + item.quantity, 0);
    localStorage.setItem("bakebook-cart-count", String(count));
    window.dispatchEvent(new CustomEvent("bakebook-cart-update", { detail: count }));
  }, [cart]);

  useEffect(() => {
    const handleOpenCart = () => setIsCartOpen(true);
    window.addEventListener("bakebook-open-cart", handleOpenCart);
    return () => window.removeEventListener("bakebook-open-cart", handleOpenCart);
  }, []);

  // Intersection observer for scroll reveals
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisibleItems((prev) => new Set(prev).add(entry.target.id));
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -60px 0px" }
    );
    itemRefs.current.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [activeFilter]);

  const addToCart = (product: Product) => {
    if (product.category === "Custom") {
      window.open("https://wa.me/919773889591?text=Hi!%20I%20would%20like%20to%20commission%20a%20custom%20cake.", "_blank");
      return;
    }
    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) return prev.map((item) => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      return [...prev, { ...product, quantity: 1 }];
    });
    setIsCartOpen(true);
  };

  const updateQuantity = (id: string, delta: number) => {
    setCart((prev) =>
      prev.map((item) => item.id === id ? { ...item, quantity: Math.max(0, item.quantity + delta) } : item)
        .filter((item) => item.quantity > 0)
    );
  };

  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const filtered = PRODUCTS.filter((p) => {
    if (activeFilter === "ALL") return true;
    if (activeFilter === "CAKES") return p.category === "Cake";
    if (activeFilter === "COOKIES") return p.category === "Cookie";
    return true;
  });

  return (
    /* Brand palette: #f0f1f1 (bone) background, #000000 text, #00aeef blue accents, #ff6647 coral warmth */
    <div className="min-h-screen text-[#0a0a0a]" style={{ backgroundColor: "#f0f1f1" }}>

      {/* ─── FULL-BLEED HERO ─────────────────────────────────────────────── */}
      <section className="relative h-screen overflow-hidden">
        <img
          src={imgHero}
          alt="Bakebook warmth"
          className="absolute inset-0 h-full w-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/35 via-black/15 to-black/65" />

        {/* Ghost large text behind hero */}
        <p
          className="absolute left-4 top-1/2 -translate-y-1/2 font-display font-black leading-none tracking-tighter text-white/5 select-none pointer-events-none"
          style={{ fontSize: "clamp(6rem, 22vw, 28rem)" }}
          aria-hidden
        >
          CAKE
        </p>

        <div className="absolute inset-0 flex flex-col justify-end px-8 md:px-16 pb-16 md:pb-24 z-10">
          <p className="text-[9px] font-bold tracking-[0.38em] uppercase text-[#00aeef] mb-4">
            Bakebook Cakery — Artisan Provisions
          </p>
          <h1
            className="font-display font-black leading-[0.88] tracking-tight text-white mb-6"
            style={{ fontSize: "clamp(3rem, 7vw, 9rem)" }}
          >
            Baked to be<br />
            <span className="text-[#00aeef]">remembered.</span>
          </h1>
          <div className="flex items-center gap-8">
            <button
              onClick={() => document.getElementById("v5-menu")?.scrollIntoView({ behavior: "smooth" })}
              className="px-8 py-4 bg-white text-[#0a0a0a] text-[9px] font-bold tracking-[0.25em] uppercase rounded-full hover:bg-[#00aeef] hover:text-white transition-colors duration-300"
            >
              View Provisions
            </button>
            <span className="text-white/45 text-sm font-light">Delivered across Delhi</span>
          </div>
        </div>

        {/* Cart button */}
        <button
          onClick={() => setIsCartOpen(true)}
          className="absolute top-24 right-8 md:right-16 z-20 flex h-12 w-12 items-center justify-center rounded-full bg-white/15 backdrop-blur-md border border-white/20 text-white hover:bg-white/30 transition-all duration-300"
          aria-label="Open cart"
        >
          <ShoppingBag className="h-5 w-5" />
          {cartCount > 0 && (
            <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-[#ff6647] text-[9px] font-bold text-white">
              {cartCount}
            </span>
          )}
        </button>
      </section>

      {/* ─── INTRO PILLARS ───────────────────────────────────────────────── */}
      <section className="py-20 px-8 md:px-16 mx-auto max-w-[1400px] grid grid-cols-1 md:grid-cols-3 gap-10 border-b border-[#0a0a0a]/10">
        {[
          { n: "01", title: "Handcrafted Daily", body: "Every item leaves the oven the day you order. No preservatives, no compromise." },
          { n: "02", title: "Premium Ingredients", body: "Quality chocolate, fresh dairy, and carefully sourced sugars — you taste the difference." },
          { n: "03", title: "Delivered Fresh", body: "Moisture-sealed packaging with same-day delivery across Delhi NCR." },
        ].map((p) => (
          <div key={p.n}>
            <p className="text-[9px] font-bold tracking-[0.32em] uppercase text-[#00aeef] mb-3">{p.n}</p>
            <h3 className="font-display font-bold text-lg mb-2 tracking-tight text-[#0a0a0a]">{p.title}</h3>
            <p className="text-sm font-light leading-relaxed text-[#0a0a0a]/55">{p.body}</p>
          </div>
        ))}
      </section>

      {/* ─── MENU SECTION ─────────────────────────────────────────────────── */}
      <section id="v5-menu" className="mx-auto max-w-[1400px] px-8 md:px-16 pt-24">
        <div className="flex items-end justify-between mb-20">
          <div>
            <p className="text-[9px] font-bold tracking-[0.32em] uppercase text-[#00aeef] mb-3">The Menu</p>
            <h2
              className="font-display font-black tracking-tight leading-none text-[#0a0a0a]"
              style={{ fontSize: "clamp(3rem, 6vw, 7rem)" }}
            >
              Today's<br />Provisions
            </h2>
          </div>
          <div className="flex gap-1 pb-2">
            {(["ALL", "CAKES", "COOKIES"] as const).map((f) => (
              <button
                key={f}
                onClick={() => { setActiveFilter(f); setVisibleItems(new Set()); }}
                className={`px-5 py-2.5 text-[9px] font-bold tracking-[0.2em] uppercase transition-all duration-300 rounded-full border ${
                  activeFilter === f
                    ? "bg-[#0a0a0a] text-white border-[#0a0a0a]"
                    : "border-transparent text-[#0a0a0a]/40 hover:text-[#0a0a0a]"
                }`}
              >
                {f === "ALL" ? "All" : f === "CAKES" ? "Cakes" : "Cookies"}
              </button>
            ))}
          </div>
        </div>

        {/* Alternating editorial rows */}
        <div className="space-y-0">
          {filtered.map((product, idx) => {
            const itemId = `v5-product-${product.id}`;
            const isVisible = visibleItems.has(itemId);
            const isEven = idx % 2 === 0;

            return (
              <article
                id={itemId}
                key={product.id}
                ref={(el) => { if (el) itemRefs.current.set(product.id, el); }}
                className={`grid grid-cols-1 md:grid-cols-2 border-t border-[#0a0a0a]/10 transition-all duration-1000 ease-out ${
                  isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
                }`}
              >
                {/* Image */}
                <div className={`relative py-12 ${isEven ? "md:pr-10" : "md:order-2 md:pl-10"}`}>
                  <div className="relative aspect-[3/2] w-full overflow-hidden rounded-2xl bg-white">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="h-full w-full object-cover transition-transform duration-700 hover:scale-[1.04]"
                      loading="lazy"
                    />
                    {product.origin && (
                      <div className="absolute top-5 left-5 bg-white border border-[#00aeef] px-4 py-1.5 rounded-full">
                        <span className="text-[9px] font-bold tracking-[0.2em] uppercase text-[#00aeef]">
                          {product.origin}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Copy */}
                <div className={`flex flex-col justify-center py-12 ${isEven ? "md:pl-16" : "md:order-1 md:pr-16"}`}>
                  <span className="text-[9px] font-bold tracking-[0.32em] uppercase text-[#0a0a0a]/30 mb-4">
                    {product.category} — ₹{product.price}
                  </span>
                  <h3
                    className="font-display font-black leading-[0.9] tracking-tight text-[#0a0a0a] mb-6"
                    style={{ fontSize: "clamp(2rem, 3vw, 3.5rem)" }}
                  >
                    {product.name}
                  </h3>

                  {/* Pull-quote with blue left border */}
                  <div className="border-l-2 border-[#00aeef] pl-6 mb-10">
                    <p className="text-base font-light leading-relaxed text-[#0a0a0a]/60 italic">
                      "{product.description}"
                    </p>
                  </div>

                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => addToCart(product)}
                      className="flex items-center gap-3 px-8 py-4 bg-[#0a0a0a] text-white rounded-full text-[9px] font-bold tracking-[0.2em] uppercase hover:bg-[#00aeef] transition-colors duration-300"
                    >
                      Add to Basket
                    </button>
                    <span className="font-display font-black text-2xl tracking-tight text-[#0a0a0a]">
                      ₹{product.price}
                    </span>
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        {/* Custom Cake CTA — full-width dark card */}
        {activeFilter === "ALL" && (
          <div className="border-t border-[#0a0a0a]/10 py-20">
            <div className="rounded-3xl overflow-hidden relative bg-[#0a0a0a]">
              <div className="absolute inset-0 opacity-15">
                <img src={imgGalleryBread} alt="" className="h-full w-full object-cover mix-blend-luminosity" />
              </div>
              <div className="relative z-10 px-12 md:px-20 py-20 md:py-24 flex flex-col md:flex-row items-start md:items-center justify-between gap-10">
                <div>
                  <p className="text-[9px] font-bold tracking-[0.32em] uppercase text-[#00aeef] mb-4">Commission</p>
                  <h3
                    className="font-display font-black leading-none tracking-tight text-white mb-4"
                    style={{ fontSize: "clamp(2.5rem, 5vw, 6rem)" }}
                  >
                    Your cake,<br />
                    <span className="text-[#00aeef]">your story.</span>
                  </h3>
                  <p className="text-white/50 font-light text-base max-w-sm">
                    Celebrating a birthday, anniversary, or milestone? We create bespoke cakes tailored entirely to you.
                  </p>
                </div>
                <button
                  onClick={() => window.open("https://wa.me/919773889591?text=Hi!%20I%20would%20like%20to%20commission%20a%20custom%20cake.", "_blank")}
                  className="flex-shrink-0 px-10 py-5 bg-white text-[#0a0a0a] rounded-full text-[9px] font-bold tracking-[0.25em] uppercase hover:bg-[#00aeef] hover:text-white transition-colors duration-300"
                >
                  Inquire on WhatsApp
                </button>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* ─── PHOTO FEATURE GRID ──────────────────────────────────────────── */}
      <section className="py-24 px-8 md:px-16 mx-auto max-w-[1400px]">
        <div className="grid grid-cols-12 gap-5">
          <div className="col-span-12 md:col-span-7 aspect-[4/3] overflow-hidden rounded-3xl">
            <img src={imgGalleryPour} alt="Pour" className="h-full w-full object-cover hover:scale-105 transition-transform duration-1000" />
          </div>
          <div className="col-span-12 md:col-span-5 flex flex-col gap-5">
            <div className="flex-1 aspect-square overflow-hidden rounded-3xl">
              <img src={imgFeatureCake} alt="Cake feature" className="h-full w-full object-cover hover:scale-105 transition-transform duration-1000" />
            </div>
            <div className="p-8 rounded-3xl bg-[#0a0a0a] flex flex-col justify-center">
              <p className="text-[9px] font-bold tracking-[0.32em] uppercase text-[#00aeef] mb-3">Visit Us</p>
              <p className="font-display font-bold text-xl leading-tight text-white mb-1">
                Maharaja Surajmal Marg
              </p>
              <p className="text-sm font-light text-white/45">
                Rishabh Vihar, New Delhi — Tue–Sun, 12pm–11pm
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ─── PULL QUOTE FOOTER ───────────────────────────────────────────── */}
      <section className="py-24 px-8 md:px-24 mx-auto max-w-[1400px] border-t border-[#0a0a0a]/10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <blockquote
            className="font-display font-black leading-[0.9] tracking-tight text-[#0a0a0a]"
            style={{ fontSize: "clamp(2.5rem, 4vw, 5rem)" }}
          >
            "Not fast food.<br />
            <em className="not-italic text-[#ff6647]">Slow baking.</em>"
          </blockquote>
          <div>
            <p className="text-base font-light leading-relaxed text-[#0a0a0a]/55 mb-8">
              At Bakebook we believe every celebration deserves something sweet, beautiful, and unforgettable. From handcrafted cakes to freshly baked treats, we create desserts made with passion, premium ingredients, and a whole lot of love.
            </p>
            <a
              href="/about"
              className="inline-flex items-center gap-2 text-[9px] font-bold tracking-[0.22em] uppercase text-[#00aeef] border-b border-[#00aeef]/50 pb-1 hover:gap-4 transition-all duration-300"
            >
              Our Story →
            </a>
          </div>
        </div>
      </section>

      {/* ─── CART SHEET ──────────────────────────────────────────────────── */}
      <Sheet open={isCartOpen} onOpenChange={setIsCartOpen}>
        <SheetContent
          className="flex w-full flex-col sm:max-w-md p-0 border-l border-[#0a0a0a]/10 overflow-hidden"
          style={{ backgroundColor: "#f0f1f1" }}
        >
          <SheetHeader className="border-b border-[#0a0a0a]/10 px-8 py-8">
            <SheetTitle className="font-display text-3xl font-black tracking-tight text-[#0a0a0a]">
              Your Basket
            </SheetTitle>
          </SheetHeader>
          <div className="flex-1 overflow-y-auto px-8 py-8">
            {cart.length === 0 ? (
              <div className="flex h-full flex-col items-center justify-center text-center gap-4">
                <ShoppingBag className="h-8 w-8 text-[#0a0a0a]/15" />
                <p className="text-[9px] font-bold tracking-[0.25em] uppercase text-[#0a0a0a]/25">Empty basket</p>
              </div>
            ) : (
              <div className="flex flex-col gap-8">
                {cart.map((item) => (
                  <div key={item.id} className="flex gap-5 border-b border-[#0a0a0a]/10 pb-8">
                    <div className="h-24 w-20 flex-shrink-0 overflow-hidden rounded-xl bg-white">
                      <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
                    </div>
                    <div className="flex flex-1 flex-col justify-between">
                      <div className="flex justify-between items-start">
                        <h4 className="font-display text-base font-bold tracking-tight leading-tight pr-4 text-[#0a0a0a]">
                          {item.name}
                        </h4>
                        <button
                          onClick={() => updateQuantity(item.id, -item.quantity)}
                          className="text-[#0a0a0a]/25 hover:text-[#0a0a0a] transition-colors"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3 border border-[#0a0a0a]/12 rounded-full px-3 py-1.5 bg-white">
                          <button onClick={() => updateQuantity(item.id, -1)} className="text-[#0a0a0a] hover:text-[#00aeef] transition-colors">
                            <Minus className="h-3 w-3" />
                          </button>
                          <span className="text-sm font-medium w-5 text-center">{item.quantity}</span>
                          <button onClick={() => updateQuantity(item.id, 1)} className="text-[#0a0a0a] hover:text-[#00aeef] transition-colors">
                            <Plus className="h-3 w-3" />
                          </button>
                        </div>
                        <span className="font-display font-black tracking-tight text-[#0a0a0a]">
                          ₹{item.price * item.quantity}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          {cart.length > 0 && (
            <div className="border-t border-[#0a0a0a]/10 px-8 py-8">
              <div className="flex justify-between items-center mb-6">
                <span className="text-[9px] font-bold tracking-[0.22em] uppercase text-[#0a0a0a]/30">Subtotal</span>
                <span className="font-display text-2xl font-black tracking-tight text-[#00aeef]">₹{cartTotal}</span>
              </div>
              <button className="w-full bg-[#0a0a0a] text-white py-5 text-[9px] font-bold tracking-[0.25em] uppercase rounded-full hover:bg-[#00aeef] transition-colors duration-300">
                Proceed to Checkout
              </button>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
