import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { X, Plus, Minus, ShoppingBag, ArrowRight } from "lucide-react";

import imgHero from "@/assets/hero-bakery-cozy.png";
import imgNutellaCookie from "@/assets/product-cookie-nutella.png";
import imgDoubleChoc from "@/assets/product-cookie-double.png";
import imgVanillaCake from "@/assets/product-cake-vanilla.png";
import imgDevilsCake from "@/assets/product-cake-devil.png";
import imgCustomCake from "@/assets/custom-cake.jpg";
import imgGallerySlice from "@/assets/gallery-slice.jpg";

export const Route = createFileRoute("/cakery-v4")({
  head: () => ({ meta: [{ title: "The Cakery V4 — Bakebook Bakery" }] }),
  component: CakeryPageV4,
});

type Product = {
  id: string;
  name: string;
  price: number;
  image: string;
  category: "Cookie" | "Cake" | "Custom";
  description: string;
  note?: string;
  badge?: string;
};

const PRODUCTS: Product[] = [
  {
    id: "cookie-nutella",
    name: "Nutella Sea Salt Cookie",
    price: 250,
    image: imgNutellaCookie,
    category: "Cookie",
    description: "Thick-edge, gooey-centre. Dark chocolate chunks folded through Nutella dough, finished with Maldon flakes.",
    note: "Best Seller",
    badge: "No. 01",
  },
  {
    id: "cake-vanilla",
    name: "Vanilla Caramel Cake",
    price: 880,
    image: imgVanillaCake,
    category: "Cake",
    description: "Vanilla sponge, house-made salted caramel, toasted almonds. A Bakebook signature — restrained, elegant, unforgettable.",
    note: "Signature",
    badge: "No. 02",
  },
  {
    id: "cookie-double",
    name: "Double Chocolate Cookie",
    price: 250,
    image: imgDoubleChoc,
    category: "Cookie",
    description: "Dutch-process cocoa dough studded with semi-sweet chips and a dark chocolate core.",
    badge: "No. 03",
  },
  {
    id: "cake-devil",
    name: "Devil's Chocolate Cake",
    price: 780,
    image: imgDevilsCake,
    category: "Cake",
    description: "Deep, brooding layers of dark chocolate sponge beneath a mirror-finish ganache.",
    badge: "No. 04",
  },
];

type CartItem = Product & { quantity: number };

function CakeryPageV4() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState<"ALL" | "CAKES" | "COOKIES">("ALL");

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
    /* Brand palette: White (#ffffff) bg, near-black text, Bakebook Blue (#00aeef) accents, Coral (#ff6647) for warmth */
    <div className="min-h-screen bg-white text-[#0a0a0a]">

      {/* ─── SPLIT-SCREEN HERO ─────────────────────────────────────────── */}
      <section className="relative flex h-screen overflow-hidden">
        {/* Left: photograph */}
        <div className="relative w-1/2 overflow-hidden">
          <img
            src={imgHero}
            alt="Bakebook bakery"
            className="absolute inset-0 h-full w-full object-cover object-center scale-[1.04] transition-transform duration-[10s] ease-out"
            style={{ transformOrigin: "55% 50%" }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/10 to-transparent" />
        </div>

        {/* Right: white editorial panel */}
        <div className="relative w-1/2 flex flex-col justify-between bg-white px-14 py-20">
          <div className="h-px w-12 bg-[#00aeef]" />

          <div className="flex-1 flex flex-col justify-center">
            <p className="text-[9px] font-bold tracking-[0.32em] uppercase text-[#00aeef] mb-8">
              Bakebook Cakery — Delhi
            </p>
            <h1
              className="font-display leading-[0.88] tracking-tight text-[#0a0a0a] mb-10"
              style={{ fontSize: "clamp(3.5rem, 5.5vw, 7rem)", fontWeight: 800 }}
            >
              Made<br />
              with<br />
              <em className="not-italic" style={{ color: "#00aeef" }}>intent.</em>
            </h1>
            <p className="text-sm font-light leading-relaxed text-[#0a0a0a]/55 max-w-xs mb-12">
              Every provision is weighed by hand and baked fresh each morning on Maharaja Surajmal Marg.
            </p>
            <button
              onClick={() => document.getElementById("v4-provisions")?.scrollIntoView({ behavior: "smooth" })}
              className="group flex items-center gap-3 self-start"
            >
              <span className="text-[9px] font-bold tracking-[0.22em] uppercase text-[#0a0a0a]">
                Explore Provisions
              </span>
              <span className="flex h-8 w-8 items-center justify-center rounded-full border border-[#0a0a0a] group-hover:bg-[#00aeef] group-hover:border-[#00aeef] group-hover:text-white transition-all duration-300">
                <ArrowRight className="h-3.5 w-3.5" />
              </span>
            </button>
          </div>

          <p className="text-[9px] tracking-[0.22em] uppercase text-[#0a0a0a]/25 self-end">
            Season 2025 — Ongoing
          </p>
        </div>

        {/* Floating cart */}
        <button
          onClick={() => setIsCartOpen(true)}
          className="absolute bottom-10 right-10 z-20 flex h-14 w-14 items-center justify-center rounded-full bg-[#0a0a0a] text-white shadow-xl hover:bg-[#00aeef] hover:scale-105 transition-all duration-300"
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

      {/* ─── MARQUEE STRIP ─────────────────────────────────────────────── */}
      <div className="overflow-hidden border-y border-[#0a0a0a] bg-[#0a0a0a] py-4">
        <div className="flex animate-[v4marquee_20s_linear_infinite] whitespace-nowrap gap-16">
          {Array(6).fill(0).map((_, i) => (
            <span key={i} className="text-[9px] font-bold tracking-[0.32em] uppercase text-[#00aeef] flex items-center gap-16">
              Baked Fresh Daily
              <span className="h-1 w-1 rounded-full bg-[#00aeef]/50 inline-block" />
              Delivered Across Delhi
              <span className="h-1 w-1 rounded-full bg-[#00aeef]/50 inline-block" />
              Artisan Provisions
              <span className="h-1 w-1 rounded-full bg-[#00aeef]/50 inline-block" />
            </span>
          ))}
        </div>
      </div>

      {/* ─── PROVISIONS HEADER ─────────────────────────────────────────── */}
      <section id="v4-provisions" className="mx-auto max-w-[1400px] px-8 md:px-16 pt-24 pb-10">
        <div className="flex items-end justify-between">
          <div>
            <p className="text-[9px] font-bold tracking-[0.32em] uppercase text-[#00aeef] mb-3">The Collection</p>
            <h2 className="font-display text-5xl md:text-7xl font-black tracking-tight leading-none text-[#0a0a0a]">
              Provisions
            </h2>
          </div>
          {/* Filter pills — brand blue for active, light gray bg */}
          <div className="flex gap-2">
            {(["ALL", "CAKES", "COOKIES"] as const).map((f) => (
              <button
                key={f}
                onClick={() => setActiveFilter(f)}
                className={`px-5 py-2 text-[9px] font-bold tracking-[0.2em] uppercase rounded-full border transition-all duration-300 ${
                  activeFilter === f
                    ? "bg-[#00aeef] text-white border-[#00aeef]"
                    : "border-[#0a0a0a]/15 text-[#0a0a0a]/50 hover:border-[#00aeef] hover:text-[#00aeef]"
                }`}
              >
                {f === "ALL" ? "All" : f === "CAKES" ? "Cakes" : "Cookies"}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ─── LOOKBOOK PRODUCT ROWS ─────────────────────────────────────── */}
      <section className="mx-auto max-w-[1400px] px-8 md:px-16 pb-40">
        {filtered.map((product, idx) => (
          <article
            key={product.id}
            className="group relative grid grid-cols-1 md:grid-cols-2 border-t border-[#0a0a0a]/8 py-14 gap-10 md:gap-0"
          >
            <span className="absolute top-14 left-0 text-[9px] font-bold tracking-[0.22em] uppercase text-[#0a0a0a]/15">
              {product.badge}
            </span>

            {/* Image — alternates sides */}
            <div className={`relative overflow-hidden rounded-2xl ${idx % 2 === 1 ? "md:order-2" : "md:order-1"}`}>
              <div className="aspect-[4/3] w-full overflow-hidden bg-[#f0f1f1]">
                <img
                  src={product.image}
                  alt={product.name}
                  className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                  loading="lazy"
                />
              </div>
              {product.note && (
                <span className="absolute top-4 left-4 bg-white border border-[#00aeef] text-[#00aeef] text-[9px] font-bold tracking-[0.18em] uppercase px-3 py-1.5 rounded-sm">
                  {product.note}
                </span>
              )}
            </div>

            {/* Copy */}
            <div className={`flex flex-col justify-center ${idx % 2 === 1 ? "md:order-1 md:pr-20" : "md:order-2 md:pl-20"}`}>
              <p className="text-[9px] font-bold tracking-[0.32em] uppercase text-[#00aeef] mb-4">
                {product.category}
              </p>
              <h3
                className="font-display font-black leading-none tracking-tight text-[#0a0a0a] mb-6"
                style={{ fontSize: "clamp(2rem, 3.5vw, 4rem)" }}
              >
                {product.name}
              </h3>
              <p className="text-base font-light leading-relaxed text-[#0a0a0a]/55 mb-10 max-w-md">
                {product.description}
              </p>
              <div className="flex items-center gap-6">
                <span className="font-display text-3xl font-black tracking-tight text-[#0a0a0a]">
                  ₹{product.price}
                </span>
                <button
                  onClick={() => addToCart(product)}
                  className="flex items-center gap-3 px-8 py-4 bg-[#0a0a0a] text-white rounded-full text-[9px] font-bold tracking-[0.2em] uppercase hover:bg-[#00aeef] transition-colors duration-300"
                >
                  Add to Bag
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          </article>
        ))}

        {/* Custom Cake Row */}
        {activeFilter === "ALL" && (
          <article className="group relative border-t border-[#0a0a0a]/8 py-14">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-0">
              <div className="relative overflow-hidden rounded-2xl">
                <div className="aspect-[4/3] w-full overflow-hidden bg-[#f0f1f1]">
                  <img
                    src={imgCustomCake}
                    alt="Custom bespoke cake"
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                    loading="lazy"
                  />
                </div>
              </div>
              <div className="flex flex-col justify-center md:pl-20">
                <p className="text-[9px] font-bold tracking-[0.32em] uppercase text-[#ff6647] mb-4">Commission</p>
                <h3
                  className="font-display font-black leading-none tracking-tight text-[#0a0a0a] mb-6"
                  style={{ fontSize: "clamp(2rem, 3.5vw, 4rem)" }}
                >
                  Bespoke<br />Cakes
                </h3>
                <p className="text-base font-light leading-relaxed text-[#0a0a0a]/55 mb-10 max-w-md">
                  Celebrating a milestone? We design and bake cakes for your occasion — flavour, size, and finish, entirely yours.
                </p>
                <button
                  onClick={() => window.open("https://wa.me/919773889591?text=Hi!%20I%20would%20like%20to%20commission%20a%20custom%20cake.", "_blank")}
                  className="flex items-center gap-3 self-start px-8 py-4 border border-[#0a0a0a] text-[#0a0a0a] rounded-full text-[9px] font-bold tracking-[0.2em] uppercase hover:bg-[#0a0a0a] hover:text-white transition-colors duration-300"
                >
                  Inquire on WhatsApp
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          </article>
        )}

        <div className="border-t border-[#0a0a0a]/8" />
      </section>

      {/* ─── EDITORIAL QUOTE SECTION — ink background ──────────────────── */}
      <section className="bg-[#0a0a0a] py-28 px-8 md:px-16 text-center">
        <p className="text-[9px] font-bold tracking-[0.32em] uppercase text-[#00aeef] mb-8">Our Philosophy</p>
        <blockquote
          className="mx-auto max-w-3xl font-display font-black leading-[1.05] tracking-tight text-white"
          style={{ fontSize: "clamp(2rem, 4vw, 5rem)" }}
        >
          "Good baking is an act of<br />
          <span className="text-[#00aeef]">patience,</span> not performance."
        </blockquote>
        <div className="mt-10 h-px w-14 bg-[#00aeef]/40 mx-auto" />
      </section>

      {/* ─── GALLERY STRIP ─────────────────────────────────────────────── */}
      <section className="py-20 px-8 md:px-16 mx-auto max-w-[1400px]">
        <div className="grid grid-cols-3 gap-4">
          <div className="aspect-[3/4] overflow-hidden rounded-2xl col-span-1">
            <img src={imgGallerySlice} alt="Cake slice" className="h-full w-full object-cover hover:scale-105 transition-transform duration-700" />
          </div>
          <div className="aspect-[3/4] overflow-hidden rounded-2xl col-span-1 mt-12">
            <img src={imgDevilsCake} alt="Devil's cake" className="h-full w-full object-cover hover:scale-105 transition-transform duration-700" />
          </div>
          <div className="aspect-[3/4] overflow-hidden rounded-2xl col-span-1">
            <img src={imgNutellaCookie} alt="Nutella cookie" className="h-full w-full object-cover hover:scale-105 transition-transform duration-700" />
          </div>
        </div>
      </section>

      {/* ─── CART SHEET ────────────────────────────────────────────────── */}
      <Sheet open={isCartOpen} onOpenChange={setIsCartOpen}>
        <SheetContent className="flex w-full flex-col sm:max-w-md p-0 border-l border-[#0a0a0a]/10 bg-white overflow-hidden">
          <SheetHeader className="border-b border-[#0a0a0a]/8 px-8 py-8">
            <SheetTitle className="font-display text-3xl font-black tracking-tight text-[#0a0a0a]">
              Your Basket
            </SheetTitle>
          </SheetHeader>
          <div className="flex-1 overflow-y-auto px-8 py-8">
            {cart.length === 0 ? (
              <div className="flex h-full flex-col items-center justify-center text-center">
                <ShoppingBag className="h-8 w-8 text-[#0a0a0a]/15 mb-4" />
                <p className="text-[9px] font-bold tracking-[0.22em] uppercase text-[#0a0a0a]/30">
                  Your basket is empty
                </p>
              </div>
            ) : (
              <div className="flex flex-col gap-8">
                {cart.map((item) => (
                  <div key={item.id} className="flex gap-5 border-b border-[#0a0a0a]/8 pb-8">
                    <div className="h-24 w-20 flex-shrink-0 overflow-hidden rounded-xl bg-[#f0f1f1]">
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
                        <div className="flex items-center gap-3 border border-[#0a0a0a]/12 rounded-full px-3 py-1.5">
                          <button onClick={() => updateQuantity(item.id, -1)} className="hover:text-[#00aeef] transition-colors">
                            <Minus className="h-3 w-3" />
                          </button>
                          <span className="text-sm font-medium w-5 text-center">{item.quantity}</span>
                          <button onClick={() => updateQuantity(item.id, 1)} className="hover:text-[#00aeef] transition-colors">
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
            <div className="border-t border-[#0a0a0a]/8 px-8 py-8">
              <div className="flex justify-between items-center mb-6">
                <span className="text-[9px] font-bold tracking-[0.22em] uppercase text-[#0a0a0a]/35">Subtotal</span>
                <span className="font-display text-2xl font-black tracking-tight text-[#00aeef]">₹{cartTotal}</span>
              </div>
              <button className="w-full bg-[#0a0a0a] text-white py-5 text-[9px] font-bold tracking-[0.25em] uppercase rounded-full hover:bg-[#00aeef] transition-colors duration-300">
                Proceed to Checkout
              </button>
            </div>
          )}
        </SheetContent>
      </Sheet>

      <style>{`
        @keyframes v4marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  );
}
