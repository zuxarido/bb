import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { X, ShoppingBag, Plus, Minus } from "lucide-react";

import heroVideo from "@/assets/Create_a_cinematic_luxury_webs.mp4";
import imgNutellaCookie from "@/assets/product-cookie-nutella.png";
import imgDoubleChoc from "@/assets/product-cookie-double.png";
import imgVanillaCake from "@/assets/product-cake-vanilla.png";
import imgDevilsCake from "@/assets/product-cake-devil.png";

export const Route = createFileRoute("/cakery-v2")({
  head: () => ({ meta: [{ title: "The Cakery V2 — Bakebook Bakery" }] }),
  component: CakeryPageV2,
});

type Product = {
  id: string;
  name: string;
  price: number;
  image: string;
  category: "Cookie" | "Cake" | "Custom";
  description: string;
};

const PRODUCTS: Product[] = [
  {
    id: "cookie-nutella",
    name: "Nutella Sea Salt Cookie",
    price: 250,
    image: imgNutellaCookie,
    category: "Cookie",
    description: "Thick, gooey centre with dark chocolate chunks and flaky sea salt.",
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

function CakeryPageV2() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

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

  const recommendations = PRODUCTS.filter(p => !cart.some(c => c.id === p.id)).slice(0, 2);

  return (
    <div className="min-h-screen bg-[#F7F5F2] text-foreground selection:bg-bakebook-blue selection:text-background">
      
      {/* Floating Cart Button */}
      <div className={`fixed bottom-8 right-8 z-50 transition-all duration-700 ease-out ${isMounted ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'}`}>
        <button
          onClick={() => setIsCartOpen(true)}
          className="relative flex h-16 w-16 items-center justify-center rounded-full bg-bakebook-blue text-background shadow-xl hover:scale-105 transition-transform duration-300 focus:outline-none focus:ring-4 focus:ring-bakebook-blue/40"
          aria-label="Open Cart"
        >
          <ShoppingBag className="h-6 w-6" strokeWidth={2.5} />
          {cartCount > 0 && (
            <span className="absolute -top-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-foreground text-[10px] font-bold text-background ring-2 ring-[#F7F5F2] animate-in zoom-in duration-300">
              {cartCount}
            </span>
          )}
        </button>
      </div>

      {/* Cart Sheet */}
      <Sheet open={isCartOpen} onOpenChange={setIsCartOpen}>
        <SheetContent className="flex w-full flex-col sm:max-w-md p-0 border-l border-border bg-[#F7F5F2] shadow-2xl overflow-hidden">
          <SheetHeader className="border-b border-border/50 p-8 pb-6 bg-[#F7F5F2] z-10">
            <SheetTitle className="display-caps text-3xl tracking-tight text-foreground">Your Bag</SheetTitle>
          </SheetHeader>
          
          <div className="flex-1 overflow-y-auto p-8 relative">
            {cart.length === 0 ? (
              <div className="flex h-full flex-col items-center justify-center text-center animate-in fade-in duration-500">
                <div className="rounded-full bg-bakebook-blue/10 p-6 mb-6">
                  <ShoppingBag className="h-8 w-8 text-bakebook-blue" />
                </div>
                <p className="editorial-label text-muted-foreground">Your bag is empty.</p>
              </div>
            ) : (
              <div className="flex flex-col gap-10 animate-in fade-in duration-500">
                {cart.map((item) => (
                  <div key={item.id} className="flex gap-6">
                    <div className="h-28 w-24 flex-shrink-0 overflow-hidden bg-background rounded-lg border border-border/50">
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
                    <h4 className="editorial-label text-bakebook-blue mb-6">You might also like</h4>
                    <div className="flex flex-col gap-6">
                      {recommendations.map((rec) => (
                        <div key={rec.id} className="flex gap-4 items-center bg-background/50 p-4 rounded-xl border border-bakebook-blue/10 hover:border-bakebook-blue/40 transition-colors shadow-sm">
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
                            aria-label="Add to bag"
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
            <div className="border-t border-border/50 p-8 bg-[#F7F5F2] shadow-[0_-10px_40px_rgba(0,0,0,0.02)] z-10">
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

      {/* Cinematic Hero Section */}
      <section className="relative h-[85vh] w-full overflow-hidden bg-foreground">
        <div className="grain grain-strong absolute inset-0 h-full w-full">
          <video
            src={heroVideo}
            className="h-full w-full object-cover object-center opacity-70 mix-blend-overlay"
            autoPlay
            loop
            muted
            playsInline
          />
          {/* Overlay to ensure text readability */}
          <div className="pointer-events-none absolute inset-0 z-[1] bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
        </div>

        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center text-center px-6">
          <p className="editorial-label text-bakebook-blue tracking-[0.25em] mb-6 animate-in fade-in slide-in-from-bottom-4 duration-1000 ease-out fill-mode-both">
            — Provisions —
          </p>
          <h1 className="display-caps text-[15vw] sm:text-[12vw] md:text-[10vw] lg:text-[160px] leading-[0.8] tracking-tighter text-background animate-in fade-in slide-in-from-bottom-8 duration-1000 ease-out fill-mode-both delay-150">
            CITYWIDE<br />DELIVERY.
          </h1>
          <p className="mt-8 max-w-lg text-lg md:text-xl font-light leading-relaxed text-background/80 animate-in fade-in slide-in-from-bottom-8 duration-1000 ease-out fill-mode-both delay-300">
            Dry goods, fresh bakes, and custom cakes. Packed with care and shipped across Delhi.
          </p>
        </div>
      </section>

      {/* Product Grid - Soft, Airy, Borderless with Blue Accents */}
      <section className="mx-auto max-w-[1600px] px-6 py-32 md:px-12 md:py-48">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-24 gap-x-12 lg:gap-x-20">
          
          {PRODUCTS.map((product, idx) => (
            <article 
              key={product.id} 
              className={`group flex flex-col animate-in fade-in slide-in-from-bottom-16 duration-1000 ease-out fill-mode-both delay-[${(idx + 1) * 200}ms]`}
              style={{ animationDelay: `${(idx + 1) * 150}ms` }}
            >
              <div className="relative aspect-[4/5] w-full overflow-hidden bg-background rounded-2xl mb-8 shadow-sm transition-shadow duration-500 hover:shadow-xl cursor-pointer">
                {/* Image without zoom animation on hover */}
                <img
                  src={product.image}
                  alt={product.name}
                  className="h-full w-full object-cover"
                  loading="lazy"
                />
                
                {/* Elegant Hover Overlay */}
                <div className="absolute inset-0 bg-bakebook-blue/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                <div className="absolute inset-x-0 bottom-0 p-6 translate-y-full opacity-0 transition-all duration-500 ease-out group-hover:translate-y-0 group-hover:opacity-100 flex justify-center">
                  <button 
                    onClick={() => addToCart(product)}
                    className="flex items-center gap-2 bg-bakebook-blue text-background px-8 py-4 editorial-label rounded-full shadow-xl hover:bg-bakebook-ink transition-colors duration-300"
                  >
                    Add to Bag
                    <Plus className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>

              <div className="flex flex-col flex-1 px-2 text-center md:text-left">
                <div className="flex flex-col md:flex-row justify-between items-center md:items-start gap-4 mb-4">
                  <h3 className="font-display text-2xl md:text-3xl tracking-tight leading-tight group-hover:text-bakebook-blue transition-colors duration-300">
                    {product.name}
                  </h3>
                  <span className="editorial-label text-bakebook-blue bg-bakebook-blue/10 px-4 py-1.5 rounded-full shadow-sm shrink-0">
                    ₹{product.price}
                  </span>
                </div>
                <p className="text-base md:text-lg font-light leading-relaxed text-foreground/60">
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

          {/* Custom Cake Card - Blue Accent Design */}
          <article 
            className="group flex flex-col animate-in fade-in slide-in-from-bottom-16 duration-1000 ease-out fill-mode-both"
            style={{ animationDelay: `${(PRODUCTS.length + 1) * 150}ms` }}
          >
            <div className="relative aspect-[4/5] w-full overflow-hidden bg-bakebook-blue rounded-2xl mb-8 flex flex-col items-center justify-center p-10 text-center shadow-lg transition-all duration-500 hover:shadow-2xl hover:bg-bakebook-ink text-background">
              <div className="h-20 w-20 rounded-full border-2 border-dashed border-background/40 flex items-center justify-center mb-8 group-hover:border-background/80 group-hover:scale-110 transition-all duration-500">
                <Plus className="h-8 w-8 text-background/80 group-hover:text-background transition-colors duration-500" />
              </div>
              <h3 className="font-display text-4xl tracking-tight leading-[1.1] mb-6">
                Bespoke<br />Cakes
              </h3>
              <p className="text-base md:text-lg font-light leading-relaxed text-background/80 transition-colors duration-500 max-w-[280px]">
                Celebrating something special? We bake custom cakes tailored to your occasion.
              </p>
            </div>
            
            <div className="flex flex-col flex-1 px-2">
              <button 
                onClick={() => window.open("https://wa.me/919773889591?text=Hi!%20I%20would%20like%20to%20commission%20a%20custom%20cake.", "_blank")}
                className="w-full bg-transparent border border-bakebook-blue text-bakebook-blue py-4 editorial-label rounded-full hover:bg-bakebook-blue hover:text-background transition-colors duration-300"
              >
                Inquire on WhatsApp
              </button>
            </div>
          </article>

        </div>
      </section>

    </div>
  );
}
