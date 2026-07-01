import { Link, useLocation } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Logomark } from "./Logo";
import { cn } from "@/lib/utils";

const NAV = [
  { label: "Cafe", to: "/cafe" as const },
  { label: "Cakery", to: "/cakery" as const },
  { label: "About", to: "/about" as const },
  { label: "Contact", to: "/contact" as const },
];

export function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const location = useLocation();

  const isHome = location.pathname === "/" || location.pathname.startsWith("/cakery");
  const headerScrolled = scrolled || !isHome || open;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [isHome]);

  // Sync cart count from localStorage / custom events
  useEffect(() => {
    const storedCount = localStorage.getItem("bakebook-cart-count");
    if (storedCount) {
      setCartCount(Number(storedCount));
    }

    const handleCartUpdate = (e: Event) => {
      const customEvent = e as CustomEvent;
      setCartCount(customEvent.detail || 0);
    };

    window.addEventListener("bakebook-cart-update", handleCartUpdate);
    return () => window.removeEventListener("bakebook-cart-update", handleCartUpdate);
  }, []);

  const handleBasketClick = () => {
    window.dispatchEvent(new CustomEvent("bakebook-open-cart"));
  };

  const isCakeryPage = location.pathname.startsWith("/cakery");
  const hasDarkHero = location.pathname === "/" || location.pathname === "/cakery-v2" || location.pathname === "/cakery-v3" || location.pathname === "/cakery-v4" || location.pathname === "/cakery-v5";

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 border-b transition-all duration-300",
        headerScrolled
          ? "border-border/70 bg-background/85 backdrop-blur-md"
          : "border-transparent bg-transparent"
      )}
    >
      <div className="mx-auto flex h-16 max-w-[1600px] items-center justify-between px-6 md:grid md:h-20 md:grid-cols-3 md:px-10">
        
        {/* LOGO LEFT */}
        <div className="flex justify-start md:col-span-1">
          <Link to="/" className="group flex items-center gap-2" aria-label="Bakebook home">
            <span
              className={cn(
                "font-display text-[0.95rem] font-black uppercase tracking-[0.05em] transition-colors duration-200 md:text-[1.1rem]",
                headerScrolled
                  ? "text-foreground"
                  : hasDarkHero
                    ? "text-white"
                    : "text-foreground"
              )}
            >
              Bakebook
            </span>
            <Logomark
              className="h-[1.3em] w-auto translate-y-[-1px]"
              color="var(--color-bakebook-blue)"
            />
            <span
              className={cn(
                "font-display text-[0.95rem] font-black uppercase tracking-[0.05em] transition-colors duration-200 md:text-[1.1rem]",
                headerScrolled
                  ? "text-foreground"
                  : hasDarkHero
                    ? "text-white"
                    : "text-foreground"
              )}
            >
              Bakery
            </span>
          </Link>
        </div>

        {/* NAVIGATION CENTER */}
        <nav className="hidden items-center gap-8 md:flex md:justify-center md:col-span-1">
          {NAV.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className={cn(
                "editorial-label tracking-[0.15em] text-[0.7rem] font-semibold transition-colors duration-200",
                headerScrolled
                  ? "text-foreground/80 hover:text-foreground"
                  : hasDarkHero
                    ? "text-white/80 hover:text-white"
                    : "text-foreground/80 hover:text-foreground"
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* ACTIONS RIGHT */}
        <div className="flex items-center justify-end gap-4 md:col-span-1">
          {isCakeryPage ? (
            <button
              onClick={handleBasketClick}
              className={cn(
                "editorial-label rounded-full border px-5 py-2 text-[0.7rem] font-semibold tracking-[0.12em] transition-all duration-300",
                headerScrolled
                  ? "border-foreground text-foreground hover:bg-foreground hover:text-background"
                  : hasDarkHero
                    ? "border-white text-white hover:bg-white hover:text-black"
                    : "border-foreground text-foreground hover:bg-foreground hover:text-background"
              )}
            >
              Basket ({cartCount})
            </button>
          ) : (
            <a
              href="/cakery"
              className={cn(
                "editorial-label rounded-full border px-5 py-2 text-[0.7rem] font-semibold tracking-[0.12em] transition-all duration-300 hidden md:inline-flex",
                headerScrolled
                  ? "border-foreground text-foreground hover:bg-foreground hover:text-background"
                  : hasDarkHero
                    ? "border-white text-white hover:bg-white hover:text-black"
                    : "border-foreground text-foreground hover:bg-foreground hover:text-background"
              )}
            >
              Order Now
            </a>
          )}

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-label="Menu"
            aria-expanded={open}
            className="grid h-10 w-10 place-items-center md:hidden"
          >
            <span className="relative block h-3 w-5">
              <span
                className={cn(
                  "absolute left-0 right-0 top-0 h-px transition-transform duration-200",
                  headerScrolled
                    ? "bg-foreground"
                    : hasDarkHero
                      ? "bg-white"
                      : "bg-foreground",
                  open && "translate-y-[6px] rotate-45"
                )}
              />
              <span
                className={cn(
                  "absolute bottom-0 left-0 right-0 h-px transition-transform duration-200",
                  headerScrolled
                    ? "bg-foreground"
                    : hasDarkHero
                      ? "bg-white"
                      : "bg-foreground",
                  open && "-translate-y-[6px] -rotate-45"
                )}
              />
            </span>
          </button>
        </div>
      </div>

      {/* Mobile sheet */}
      <div
        className={cn(
          "overflow-hidden border-t border-border/70 bg-background transition-[max-height] duration-300 md:hidden",
          open ? "max-h-[80vh]" : "max-h-0"
        )}
      >
        <div className="flex flex-col gap-6 px-6 py-10">
          {NAV.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              onClick={() => setOpen(false)}
              className="font-display text-3xl font-medium tracking-tight"
            >
              {item.label}
            </Link>
          ))}
          {isCakeryPage ? (
            <button
              onClick={() => {
                setOpen(false);
                handleBasketClick();
              }}
              className="editorial-label mt-4 inline-block self-start border border-foreground px-5 py-3 text-foreground"
            >
              Basket ({cartCount})
            </button>
          ) : (
            <a
              href="/cakery"
              className="editorial-label mt-4 inline-block self-start border border-foreground px-5 py-3 text-foreground"
            >
              Order Now
            </a>
          )}
        </div>
      </div>
    </header>
  );
}

