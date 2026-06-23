import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { X, ShoppingBag, Plus, Minus, ChevronDown } from "lucide-react";

import imgHero from "@/assets/hero-bakery-cozy.png";
import imgNutellaCookie from "@/assets/product-cookie-nutella.png";
import imgDoubleChoc from "@/assets/product-cookie-double.png";
import imgVanillaCake from "@/assets/product-cake-vanilla.png";
import imgDevilsCake from "@/assets/product-cake-devil.png";

export const Route = createFileRoute("/cakery-v3")({
  head: () => ({ meta: [{ title: "The Cakery V3 — Bakebook Bakery" }] }),
  component: CakeryPageV3,
});

type Product = {
  id: string;
  name: string;
  price: number;
  image: string;
  category: "Cookie" | "Cake" | "Custom";
  description: string;
  badge?: string;
  isSoldOut?: boolean;
};

const PRODUCTS: Product[] = [
  {
    id: "cookie-nutella",
    name: "Nutella Sea Salt Cookie",
    price: 250,
    image: imgNutellaCookie,
    category: "Cookie",
    description: "Thick, gooey centre with dark chocolate chunks and flaky sea salt.",
    badge: "BEST SELLER",
  },
  {
    id: "cookie-double",
    name: "Double Chocolate Cookie",
    price: 250,
    image: imgDoubleChoc,
    category: "Cookie",
    description: "Rich cocoa dough studded with semi-sweet chocolate morsels.",
  },
  {
    id: "cake-vanilla",
    name: "Vanilla Caramel Cake",
    price: 880,
    image: imgVanillaCake,
    category: "Cake",
    description: "Vanilla sponge layered with house-made caramel and roasted almonds.",
    badge: "SIGNATURE",
  },
  {
    id: "cake-devil",
    name: "Devil's Chocolate Cake",
    price: 780,
    image: imgDevilsCake,
    category: "Cake",
    description: "Dark, decadent chocolate sponge finished with a smooth ganache.",
  },
];

type CartItem = Product & { quantity: number };

function CakeryPageV3() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [activeCategory, setActiveCategory] = useState<"ALL" | "CAKES" | "COOKIES">("ALL");

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Sync cart count with global SiteHeader
  useEffect(() => {
    const count = cart.reduce((sum, item) => sum + item.quantity, 0);
    localStorage.setItem("bakebook-cart-count", String(count));
    window.dispatchEvent(new CustomEvent("bakebook-cart-update", { detail: count }));
  }, [cart]);

  // Listen to open-cart event from global header
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
      if (existing) {
        return prev.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
    setIsCartOpen(true);
  };

  const updateQuantity = (id: string, delta: number) => {
    setCart((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const newQuantity = Math.max(0, item.quantity + delta);
          return { ...item, quantity: newQuantity };
        }
        return item;
      }).filter(item => item.quantity > 0)
    );
  };

  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const filteredProducts = PRODUCTS.filter((product) => {
    if (activeCategory === "ALL") return true;
    if (activeCategory === "CAKES") return product.category === "Cake";
    if (activeCategory === "COOKIES") return product.category === "Cookie";
    return true;
  });

  const recommendations = PRODUCTS.filter(p => !cart.some(c => c.id === p.id)).slice(0, 2);

  return (
    <div className="min-h-screen bg-muted text-foreground selection:bg-bakebook-blue selection:text-background">
      
      {/* Hero Section with Cozy Bakery Background */}
      <section className="relative h-[65vh] w-full overflow-hidden bg-zinc-950">
        <div className="absolute inset-0 h-full w-full">
          <img
            src={imgHero}
            alt="Warm and cozy bakery kitchen"
            className="h-full w-full object-cover object-center opacity-70"
          />
          {/* Subtle vignette */}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/40" />
        </div>

        {/* Hero Title overlay with Brand typography (relies on global SiteHeader for menu) */}
        <div className="absolute bottom-12 left-0 w-full px-6 md:px-10 flex justify-between items-end text-white z-10">
          <div>
            <p className="editorial-label text-bakebook-blue tracking-[0.25em] mb-2">Artisanal Provisions</p>
            <h2 className="display-caps text-4xl md:text-5xl leading-none">Cakes & Cookies</h2>
          </div>
          <span className="hidden md:inline editorial-label tracking-[0.2em] opacity-60">Delivered Across Delhi</span>
        </div>
      </section>

      {/* Category Sub-navigation Filter Bar */}
      <section className="sticky top-16 md:top-20 z-30 bg-muted/95 border-b border-border/70 backdrop-blur-md">
        <div className="mx-auto max-w-[1600px] px-6 md:px-10 py-5 flex items-center justify-between overflow-x-auto">
          <div className="flex items-center gap-8 md:gap-12 text-[10px] font-bold tracking-[0.18em] uppercase whitespace-nowrap">
            <button 
              onClick={() => setActiveCategory("ALL")}
              className={`pb-1 transition-colors ${activeCategory === "ALL" ? "text-bakebook-blue border-b-2 border-bakebook-blue" : "text-muted-foreground hover:text-foreground"}`}
            >
              All Provisions
            </button>
            <button 
              onClick={() => setActiveCategory("CAKES")}
              className={`pb-1 transition-colors ${activeCategory === "CAKES" ? "text-bakebook-blue border-b-2 border-bakebook-blue" : "text-muted-foreground hover:text-foreground"}`}
            >
              Cakes
            </button>
            <button 
              onClick={() => setActiveCategory("COOKIES")}
              className={`pb-1 transition-colors ${activeCategory === "COOKIES" ? "text-bakebook-blue border-b-2 border-bakebook-blue" : "text-muted-foreground hover:text-foreground"}`}
            >
              Cookies
            </button>
          </div>

          <button className="flex items-center gap-2 border border-border/70 bg-background/50 px-5 py-2.5 rounded-sm text-[10px] font-bold tracking-[0.1em] uppercase hover:bg-background transition-colors">
            Filters
            <ChevronDown className="h-3.5 w-3.5 opacity-60" />
          </button>
        </div>
      </section>

      {/* Main Title Section */}
      <section className="mx-auto max-w-[1600px] px-6 pt-16 pb-8 md:px-10 text-center md:text-left">
        <h1 className="display-caps text-4xl md:text-5xl leading-none text-foreground">
          {activeCategory === "ALL" && "All Provisions"}
          {activeCategory === "CAKES" && "Cakery Menu"}
          {activeCategory === "COOKIES" && "Signature Cookies"}
        </h1>
        <p className="mt-4 text-sm font-light leading-relaxed text-foreground/60 max-w-xl">
          Crafted with stone-ground flour, organic sugars, and premium chocolates. Every provision is baked fresh and packaged to retain moisture during transit.
        </p>
      </section>

      {/* Floating Cart Button */}
      <div className={`fixed bottom-8 right-8 z-50 transition-all duration-700 ease-out ${isMounted ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'}`}>
        <button
          onClick={() => setIsCartOpen(true)}
          className="relative flex h-16 w-16 items-center justify-center rounded-full bg-bakebook-blue text-background shadow-xl hover:scale-105 transition-transform duration-300 focus:outline-none focus:ring-4 focus:ring-bakebook-blue/30"
          aria-label="Open Cart"
        >
          <ShoppingBag className="h-6 w-6" strokeWidth={2.5} />
          {cartCount > 0 && (
            <span className="absolute -top-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-foreground text-[10px] font-bold text-background ring-2 ring-muted animate-in zoom-in duration-300">
              {cartCount}
            </span>
          )}
        </button>
      </div>

      {/* Cart Sheet */}
      <Sheet open={isCartOpen} onOpenChange={setIsCartOpen}>
        <SheetContent className="flex w-full flex-col sm:max-w-md p-0 border-l border-border bg-background shadow-2xl overflow-hidden">
          <SheetHeader className="border-b border-border/50 p-8 pb-6 bg-background z-10">
            <SheetTitle className="display-caps text-3xl tracking-tight text-foreground">Your Basket</SheetTitle>
          </SheetHeader>
          
          <div className="flex-1 overflow-y-auto p-8 relative">
            {cart.length === 0 ? (
              <div className="flex h-full flex-col items-center justify-center text-center animate-in fade-in duration-500">
                <div className="rounded-full bg-bakebook-blue/10 p-6 mb-6">
                  <ShoppingBag className="h-8 w-8 text-bakebook-blue" />
                </div>
                <p className="editorial-label text-muted-foreground">Your basket is empty.</p>
              </div>
            ) : (
              <div className="flex flex-col gap-10 animate-in fade-in duration-500">
                {cart.map((item) => (
                  <div key={item.id} className="flex gap-6">
                    <div className="h-28 w-24 flex-shrink-0 overflow-hidden bg-muted rounded-lg border border-border/50">
                      <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
                    </div>
                    <div className="flex flex-1 flex-col justify-between py-1">
                      <div>
                        <div className="flex justify-between items-start">
                          <h4 className="font-display text-lg tracking-tight leading-tight pr-4">{item.name}</h4>
                          <button 
                            onClick={() => updateQuantity(item.id, -item.quantity)}
                            className="text-muted-foreground hover:text-bakebook-blue transition-colors mt-0.5"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                        <p className="editorial-label text-bakebook-blue mt-2">₹{item.price}</p>
                      </div>
                      <div className="flex items-center justify-between mt-4">
                        <div className="flex items-center border border-bakebook-blue/20 rounded-full bg-background">
                          <button onClick={() => updateQuantity(item.id, -1)} className="p-2 hover:bg-bakebook-blue hover:text-background rounded-l-full transition-colors">
                            <Minus className="h-3 w-3" />
                          </button>
                          <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                          <button onClick={() => updateQuantity(item.id, 1)} className="p-2 hover:bg-bakebook-blue hover:text-background rounded-r-full transition-colors">
                            <Plus className="h-3 w-3" />
                          </button>
                        </div>
                        <p className="font-display text-lg tracking-tight">₹{item.price * item.quantity}</p>
                      </div>
                    </div>
                  </div>
                ))}

                {/* Recommendations Engine */}
                {recommendations.length > 0 && (
                  <div className="mt-4 pt-10 border-t border-border/50">
                    <h4 className="editorial-label text-bakebook-blue mb-6">Suggested Additions</h4>
                    <div className="flex flex-col gap-6">
                      {recommendations.map((rec) => (
                        <div key={rec.id} className="flex gap-4 items-center bg-muted/50 p-4 rounded-xl border border-bakebook-blue/10 hover:border-bakebook-blue/40 transition-colors shadow-sm">
                          <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-md bg-background">
                            <img src={rec.image} alt={rec.name} className="h-full w-full object-cover" />
                          </div>
                          <div className="flex-1">
                            <h5 className="font-display text-sm tracking-tight">{rec.name}</h5>
                            <p className="editorial-label text-bakebook-blue text-[10px] mt-1">₹{rec.price}</p>
                          </div>
                          <button 
                            onClick={() => addToCart(rec)}
                            className="h-8 w-8 flex items-center justify-center rounded-full bg-bakebook-blue text-background hover:bg-bakebook-ink transition-colors shadow-sm"
                            aria-label="Add to basket"
                          >
                            <Plus className="h-4 w-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {cart.length > 0 && (
            <div className="border-t border-border/50 p-8 bg-background shadow-[0_-10px_40px_rgba(0,0,0,0.02)] z-10">
              <div className="flex justify-between items-end mb-8">
                <span className="editorial-label text-muted-foreground">Subtotal</span>
                <span className="display-caps text-3xl tracking-tight text-bakebook-blue">₹{cartTotal}</span>
              </div>
              <button className="w-full bg-bakebook-blue text-background py-5 text-sm font-semibold tracking-[0.15em] uppercase rounded-full hover:bg-bakebook-ink hover:text-background transition-colors shadow-lg hover:shadow-xl hover:-translate-y-0.5 transform duration-300">
                Checkout
              </button>
            </div>
          )}
        </SheetContent>
      </Sheet>

      {/* Product Grid - Airy, Borderless, Rectangular Images */}
      <section className="mx-auto max-w-[1600px] px-6 pb-40 md:px-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-24 gap-x-12 lg:gap-x-20">
          
          {filteredProducts.map((product, idx) => (
            <article 
              key={product.id} 
              className="group flex flex-col animate-in fade-in slide-in-from-bottom-8 duration-700 ease-out fill-mode-both"
              style={{ animationDelay: `${idx * 100}ms` }}
            >
              {/* Rectangular Image Container - No zoom animation */}
              <div className="relative aspect-[4/5] w-full overflow-hidden bg-background/50 rounded-2xl mb-8 shadow-sm transition-shadow duration-500 hover:shadow-xl cursor-pointer">
                <img
                  src={product.image}
                  alt={product.name}
                  className="h-full w-full object-cover"
                  loading="lazy"
                />

                {/* Badge Overlay */}
                {product.badge && (
                  <span className="absolute top-4 left-4 bg-background border border-bakebook-blue text-bakebook-blue px-3 py-1.5 rounded-sm text-[9px] font-bold tracking-[0.15em]">
                    {product.badge}
                  </span>
                )}

                {/* Elegant Hover Overlay */}
                <div className="absolute inset-0 bg-bakebook-blue/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                <div className="absolute inset-x-0 bottom-0 p-6 translate-y-full opacity-0 transition-all duration-500 ease-out group-hover:translate-y-0 group-hover:opacity-100 flex justify-center">
                  <button 
                    onClick={() => addToCart(product)}
                    className="flex items-center gap-2 bg-bakebook-blue text-background px-8 py-4 editorial-label rounded-full shadow-lg hover:bg-bakebook-ink transition-colors duration-300"
                  >
                    Add to Bag
                    <Plus className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>

              {/* Product Info */}
              <div className="flex flex-col px-2 text-center md:text-left">
                <div className="flex flex-col md:flex-row justify-between items-center md:items-start gap-4 mb-4">
                  <h3 className="font-display text-2xl md:text-3xl tracking-tight leading-tight group-hover:text-bakebook-blue transition-colors duration-300">
                    {product.name}
                  </h3>
                  <span className="editorial-label text-bakebook-blue bg-bakebook-blue/10 px-4 py-1.5 rounded-full shadow-sm shrink-0">
                    ₹{product.price}
                  </span>
                </div>
                <p className="text-base font-light leading-relaxed text-foreground/65">
                  {product.description}
                </p>
                
                {/* Mobile Add to Cart Button */}
                <button 
                  onClick={() => addToCart(product)}
                  className="mt-8 md:hidden w-full bg-bakebook-blue text-background py-4 editorial-label rounded-full shadow-lg hover:bg-bakebook-ink transition-colors"
                >
                  Add to Bag
                </button>
              </div>
            </article>
          ))}

          {/* Custom Cake Commission Card - Round Motif Adapted to Rectangular layout */}
          {activeCategory === "ALL" && (
            <article 
              className="group flex flex-col animate-in fade-in slide-in-from-bottom-8 duration-700 ease-out fill-mode-both"
              style={{ animationDelay: `${filteredProducts.length * 100}ms` }}
            >
              <div className="relative aspect-[4/5] w-full overflow-hidden bg-background rounded-2xl mb-8 flex flex-col items-center justify-center p-10 text-center shadow-sm hover:shadow-xl transition-all duration-500 hover:bg-bakebook-blue group-hover:text-background border border-border/50">
                <div className="h-20 w-20 rounded-full border border-dashed border-bakebook-blue/30 flex items-center justify-center mb-8 group-hover:border-background/30 group-hover:scale-110 transition-all duration-500">
                  <Plus className="h-8 w-8 text-bakebook-blue group-hover:text-background transition-colors duration-500" />
                </div>
                <h3 className="font-display text-4xl tracking-tight leading-none mb-6">
                  Bespoke<br />Cakes
                </h3>
                <p className="text-base font-light leading-relaxed text-muted-foreground group-hover:text-background/80 transition-colors duration-500 max-w-[250px]">
                  Celebrating a special moment? Commission a cake baked exclusively for your occasion.
                </p>
              </div>
              
              <div className="flex flex-col px-2">
                <button 
                  onClick={() => window.open("https://wa.me/919773889591?text=Hi!%20I%20would%20like%20to%20commission%20a%20custom%20cake.", "_blank")}
                  className="w-full bg-transparent border border-foreground/20 text-foreground py-4 editorial-label rounded-full hover:bg-bakebook-blue hover:text-background hover:border-bakebook-blue transition-colors duration-300 text-center"
                >
                  Inquire on WhatsApp
                </button>
              </div>
            </article>
          )}

        </div>
      </section>

    </div>
  );
}
