import { Link, useLocation } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ShoppingBag, X } from "lucide-react";
import { Logomark } from "./Logo";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { number: "01", label: "Cafe & Drinks", to: "/cafe" as const },
  { number: "02", label: "The Cakery", to: "/cakery" as const },
  { number: "03", label: "Our Story", to: "/about" as const },
  { number: "04", label: "Visit & Contact", to: "/contact" as const },
];

export function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const location = useLocation();

  const isCakeryPage = location.pathname.startsWith("/cakery");
  const isOverlayHero =
    location.pathname === "/" || location.pathname === "/about" || isCakeryPage;
  const headerScrolled = scrolled || !isOverlayHero || open;
  const hasDarkHero =
    (location.pathname === "/" || location.pathname === "/about") && !scrolled && !open;

  useEffect(() => { setOpen(false); }, [location.pathname]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [isOverlayHero]);

  useEffect(() => {
    const stored = localStorage.getItem("bakebook-cart-count");
    if (stored) setCartCount(Number(stored));
    const handle = (e: Event) => setCartCount((e as CustomEvent).detail || 0);
    window.addEventListener("bakebook-cart-update", handle);
    return () => window.removeEventListener("bakebook-cart-update", handle);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    if (open) window.addEventListener("keydown", onKey);
    return () => { window.removeEventListener("keydown", onKey); };
  }, [open]);

  const handleBasketClick = () => {
    window.dispatchEvent(new CustomEvent("bakebook-open-cart"));
  };

  const inkClass = hasDarkHero ? "text-white" : "text-foreground";

  return (
    <>
      {/* ── Header bar ── */}
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-50 transition-all duration-500",
          headerScrolled
            ? "border-b border-border/60 bg-white/95 backdrop-blur-xl py-3 shadow-sm"
            : "border-transparent bg-transparent py-4 md:py-5"
        )}
      >
        {/* Desktop nav */}
        <div className="mx-auto hidden max-w-[1600px] items-center justify-between px-10 md:grid md:grid-cols-3">
          <div className="flex justify-start">
            <BrandLink className={inkClass} />
          </div>

          <nav className="flex items-center justify-center gap-10">
            {NAV_LINKS.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className={cn(
                  "poilane-link editorial-label tracking-[0.18em] text-[0.7rem] font-medium transition-colors duration-300",
                  headerScrolled
                    ? "text-foreground/80 hover:text-bakebook-blue"
                    : hasDarkHero
                      ? "text-white/85 hover:text-white"
                      : "text-foreground/80 hover:text-bakebook-blue"
                )}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center justify-end">
            {isCakeryPage ? (
              <button
                onClick={handleBasketClick}
                className={cn(
                  "editorial-label rounded-full border px-5 py-2 text-[0.7rem] font-semibold tracking-[0.12em] transition-all duration-300",
                  headerScrolled
                    ? "border-foreground text-foreground hover:bg-bakebook-blue hover:border-bakebook-blue hover:text-white"
                    : hasDarkHero
                      ? "border-white text-white hover:bg-white hover:text-black"
                      : "border-foreground text-foreground hover:bg-bakebook-blue hover:border-bakebook-blue hover:text-white"
                )}
              >
                Basket ({cartCount})
              </button>
            ) : (
              <Link
                to="/cakery"
                className={cn(
                  "editorial-label inline-flex rounded-full border px-6 py-2.5 text-[0.7rem] font-semibold tracking-[0.14em] transition-all duration-300",
                  headerScrolled
                    ? "border-foreground bg-foreground text-background hover:bg-bakebook-blue hover:border-bakebook-blue hover:text-white"
                    : hasDarkHero
                      ? "border-white bg-white text-black hover:bg-bakebook-blue hover:border-bakebook-blue hover:text-white"
                      : "border-foreground bg-foreground text-background hover:bg-bakebook-blue hover:border-bakebook-blue hover:text-white"
                )}
              >
                Order Online
              </Link>
            )}
          </div>
        </div>

        {/* Mobile top bar */}
        <div className="mx-auto grid max-w-[1600px] grid-cols-3 items-center px-5 md:hidden">
          {/* Burger */}
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            className={cn(
              "flex h-10 w-10 items-center justify-center rounded-full border transition-all duration-300",
              headerScrolled
                ? "bg-foreground/10 border-foreground/20"
                : "bg-black/30 backdrop-blur-sm border-white/20"
            )}
          >
            <span className="relative block h-4 w-5">
              <span
                className={cn(
                  "absolute left-0 right-0 top-0 h-[1.5px] transition-transform duration-300",
                  open && "translate-y-[7px] rotate-45",
                  headerScrolled ? "bg-foreground" : "bg-white"
                )}
              />
              <span
                className={cn(
                  "absolute bottom-0 left-0 right-0 h-[1.5px] transition-transform duration-300",
                  open && "-translate-y-[9px] -rotate-45",
                  headerScrolled ? "bg-foreground" : "bg-white"
                )}
              />
            </span>
          </button>

          {/* Logo */}
          <div className="justify-self-center">
            <BrandLink className={inkClass} />
          </div>

          {/* Basket / Shop */}
          {isCakeryPage ? (
            <button
              type="button"
              onClick={handleBasketClick}
              aria-label={`Basket, ${cartCount} items`}
              className={cn(
                "justify-self-end flex h-10 w-10 items-center justify-center rounded-full border transition-all duration-300 relative",
                headerScrolled
                  ? "bg-foreground/10 border-foreground/20 text-foreground"
                  : "bg-black/30 backdrop-blur-sm border-white/20 text-white"
              )}
            >
              <ShoppingBag className="h-[18px] w-[18px]" strokeWidth={1.75} />
              {cartCount > 0 && (
                <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-bakebook-blue text-[9px] font-bold text-white">
                  {cartCount}
                </span>
              )}
            </button>
          ) : (
            <Link
              to="/cakery"
              aria-label="Order online"
              className={cn(
                "justify-self-end flex h-10 w-10 items-center justify-center rounded-full border transition-all duration-300",
                headerScrolled
                  ? "bg-foreground/10 border-foreground/20 text-foreground"
                  : "bg-black/30 backdrop-blur-sm border-white/20 text-white"
              )}
            >
              <ShoppingBag className="h-[18px] w-[18px]" strokeWidth={1.75} />
            </Link>
          )}
        </div>
      </header>

      {/* ── Mobile menu drawer (outside header so no clipping) ── */}

      {/* Dim backdrop */}
      <div
        onClick={() => setOpen(false)}
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 9998,
          background: "rgba(0,0,0,0.5)",
          pointerEvents: open ? "auto" : "none",
          opacity: open ? 1 : 0,
          transition: "opacity 0.3s ease",
          display: "block",
        }}
        className="md:hidden"
        aria-hidden
      />

      {/* Drawer panel */}
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          bottom: 0,
          width: "75vw",
          maxWidth: "320px",
          zIndex: 9999,
          backgroundColor: "#ffffff",
          transform: open ? "translateX(0)" : "translateX(-100%)",
          transition: "transform 0.3s ease",
          display: "flex",
          flexDirection: "column",
          boxShadow: "4px 0 24px rgba(0,0,0,0.15)",
          overflowY: "auto",
        }}
        className="md:hidden"
      >
        {/* Close button */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "20px 24px 16px",
            borderBottom: "1px solid #f0f0f0",
          }}
        >
          <span style={{ fontSize: "11px", fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "#00aeef" }}>
            Bakebook Bakery
          </span>
          <button
            onClick={() => setOpen(false)}
            style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 32, height: 32, borderRadius: "50%", background: "#f5f5f5", border: "none", cursor: "pointer" }}
            aria-label="Close menu"
          >
            <X size={16} color="#333" />
          </button>
        </div>

        {/* Nav links */}
        <nav style={{ flex: 1, padding: "16px 0" }}>
          {NAV_LINKS.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              onClick={() => setOpen(false)}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "16px 24px",
                borderBottom: "1px solid #f5f5f5",
                textDecoration: "none",
                color: "#111",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <span style={{ fontSize: "10px", fontWeight: 700, color: "#aaa", letterSpacing: "0.15em" }}>
                  {item.number}
                </span>
                <span style={{ fontSize: "20px", fontWeight: 600, color: "#111", fontFamily: "var(--font-display, serif)" }}>
                  {item.label}
                </span>
              </div>
              <span style={{ color: "#ccc", fontSize: 14 }}>→</span>
            </Link>
          ))}
        </nav>

        {/* Bottom CTA */}
        <div style={{ padding: "20px 24px", borderTop: "1px solid #f0f0f0" }}>
          {isCakeryPage ? (
            <button
              onClick={() => { setOpen(false); handleBasketClick(); }}
              style={{
                display: "block",
                width: "100%",
                padding: "14px",
                borderRadius: 999,
                background: "#111",
                color: "#fff",
                fontSize: "11px",
                fontWeight: 700,
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                border: "none",
                cursor: "pointer",
                textAlign: "center",
              }}
            >
              View Basket ({cartCount})
            </button>
          ) : (
            <Link
              to="/cakery"
              onClick={() => setOpen(false)}
              style={{
                display: "block",
                width: "100%",
                padding: "14px",
                borderRadius: 999,
                background: "#111",
                color: "#fff",
                fontSize: "11px",
                fontWeight: 700,
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                textAlign: "center",
                textDecoration: "none",
              }}
            >
              Order Online →
            </Link>
          )}

          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 16 }}>
            <div>
              <p style={{ fontSize: 13, fontWeight: 600, color: "#222", margin: 0 }}>78 Maharaja Surajmal Marg</p>
              <p style={{ fontSize: 11, color: "#888", margin: "2px 0 0" }}>Anand Vihar, Delhi · 8am–10pm</p>
            </div>
            <a href="tel:+919773889591" style={{ fontSize: 10, fontWeight: 700, color: "#00aeef", textDecoration: "none", letterSpacing: "0.1em" }}>
              CALL
            </a>
          </div>
        </div>
      </div>
    </>
  );
}

function BrandLink({ className }: { className: string }) {
  return (
    <Link to="/" className="group flex items-center gap-2" aria-label="Bakebook home">
      <span
        className={cn(
          "font-display text-[1.15rem] font-bold uppercase tracking-[0.06em] transition-colors duration-300",
          className
        )}
      >
        Bakebook
      </span>
      <Logomark
        className="h-[1.25em] w-auto translate-y-[-1px] transition-transform duration-300 group-hover:scale-110"
        color="var(--color-bakebook-blue)"
      />
      <span
        className={cn(
          "font-display text-[1.15rem] font-bold uppercase tracking-[0.06em] transition-colors duration-300",
          className
        )}
      >
        Bakery
      </span>
    </Link>
  );
}
