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

  const isHome = location.pathname === "/" || location.pathname.startsWith("/cakery") || location.pathname === "/about";
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
  const hasDarkHero = (location.pathname === "/" && !scrolled) || (location.pathname === "/about" && !scrolled);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-500",
        headerScrolled
          ? "border-b border-border/60 bg-background/80 backdrop-blur-xl py-3.5 shadow-sm"
          : "border-transparent bg-transparent py-5"
      )}
    >
      <div className="mx-auto flex max-w-[1600px] items-center justify-between px-6 md:grid md:grid-cols-3 md:px-10">
        
        {/* LOGO LEFT */}
        <div className="flex justify-start md:col-span-1">
          <Link to="/" className="group flex items-center gap-2" aria-label="Bakebook home">
            <span
              className={cn(
                "font-display text-[1rem] font-bold uppercase tracking-[0.06em] transition-colors duration-300 md:text-[1.15rem]",
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
              className="h-[1.25em] w-auto translate-y-[-1px] transition-transform duration-300 group-hover:scale-110"
              color="var(--color-bakebook-blue)"
            />
            <span
              className={cn(
                "font-display text-[1rem] font-bold uppercase tracking-[0.06em] transition-colors duration-300 md:text-[1.15rem]",
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
        <nav className="hidden items-center gap-10 md:flex md:justify-center md:col-span-1">
          {NAV.map((item) => (
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

        {/* ACTIONS RIGHT */}
        <div className="flex items-center justify-end gap-4 md:col-span-1">
          {isCakeryPage ? (
            <button
              onClick={handleBasketClick}
              className={cn(
                "editorial-label rounded-full border px-5 py-2 text-[0.7rem] font-semibold tracking-[0.12em] transition-all duration-300 shadow-sm",
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
                "editorial-label rounded-full border px-6 py-2.5 text-[0.7rem] font-semibold tracking-[0.14em] transition-all duration-300 hidden md:inline-flex shadow-sm",
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

          {/* Mobile Hamburger Button */}
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-label="Menu"
            aria-expanded={open}
            className="grid h-10 w-10 place-items-center md:hidden focus:outline-none"
          >
            <span className="relative block h-3.5 w-6">
              <span
                className={cn(
                  "absolute left-0 right-0 top-0 h-[1.5px] transition-transform duration-300 ease-out",
                  headerScrolled
                    ? "bg-foreground"
                    : hasDarkHero
                      ? "bg-white"
                      : "bg-foreground",
                  open && "translate-y-[6.5px] rotate-45"
                )}
              />
              <span
                className={cn(
                  "absolute bottom-0 left-0 right-0 h-[1.5px] transition-transform duration-300 ease-out",
                  headerScrolled
                    ? "bg-foreground"
                    : hasDarkHero
                      ? "bg-white"
                      : "bg-foreground",
                  open && "-translate-y-[6.5px] -rotate-45"
                )}
              />
            </span>
          </button>
        </div>
      </div>

      {/* Mobile Drawer Overlay */}
      <div
        className={cn(
          "overflow-hidden border-b border-border/70 bg-background/95 backdrop-blur-2xl transition-all duration-500 ease-out md:hidden",
          open ? "max-h-[85vh] opacity-100" : "max-h-0 opacity-0"
        )}
      >
        <div className="flex flex-col gap-6 px-8 py-12">
          <span className="editorial-label text-bakebook-blue">— Navigation</span>
          {NAV.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              onClick={() => setOpen(false)}
              className="font-display text-4xl font-medium tracking-tight text-foreground transition-colors hover:text-bakebook-blue"
            >
              {item.label}
            </Link>
          ))}
          <div className="pt-6 border-t border-border/60">
            {isCakeryPage ? (
              <button
                onClick={() => {
                  setOpen(false);
                  handleBasketClick();
                }}
                className="editorial-label w-full rounded-full bg-bakebook-blue px-6 py-4 text-center font-bold text-white shadow-md"
              >
                Basket ({cartCount})
              </button>
            ) : (
              <Link
                to="/cakery"
                onClick={() => setOpen(false)}
                className="editorial-label block w-full rounded-full bg-bakebook-blue px-6 py-4 text-center font-bold text-white shadow-md"
              >
                Order Online
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
