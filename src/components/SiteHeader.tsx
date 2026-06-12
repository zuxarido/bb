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
  const location = useLocation();

  const isHome = location.pathname === "/";
  const headerScrolled = scrolled || !isHome || open;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

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
        <nav className="hidden items-center gap-8 md:flex md:justify-start">
          {NAV.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className={cn(
                "editorial-label tracking-[0.15em] text-[0.7rem] font-semibold transition-colors duration-200",
                headerScrolled
                  ? "text-foreground/80 hover:text-foreground"
                  : "text-white/80 hover:text-white"
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex justify-start md:justify-center">
          <Link to="/" className="group flex items-center gap-2" aria-label="Bakebook home">
            <span
              className={cn(
                "font-display text-[0.95rem] font-black uppercase tracking-[0.05em] transition-colors duration-200 md:text-[1.1rem]",
                headerScrolled ? "text-foreground" : "text-white"
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
                headerScrolled ? "text-foreground" : "text-white"
              )}
            >
              Bakery
            </span>
          </Link>
        </div>

        <div className="flex items-center justify-end gap-4">
          <a
            href="https://order.bakebook.example"
            className={cn(
              "editorial-label rounded-full border px-5 py-2 text-[0.7rem] font-semibold tracking-[0.12em] transition-all duration-300 hidden md:inline-flex",
              headerScrolled
                ? "border-foreground text-foreground hover:bg-foreground hover:text-background"
                : "border-white text-white hover:bg-white hover:text-black"
            )}
          >
            Order Now
          </a>

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
                  headerScrolled ? "bg-foreground" : "bg-white",
                  open && "translate-y-[6px] rotate-45"
                )}
              />
              <span
                className={cn(
                  "absolute bottom-0 left-0 right-0 h-px transition-transform duration-200",
                  headerScrolled ? "bg-foreground" : "bg-white",
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
          <a
            href="https://order.bakebook.example"
            className="editorial-label mt-4 inline-block self-start border border-foreground px-5 py-3 text-foreground"
          >
            Order Now
          </a>
        </div>
      </div>
    </header>
  );
}
