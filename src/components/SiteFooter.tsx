import { Link } from "@tanstack/react-router";
import { Logomark } from "./Logo";

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-background text-foreground">
      <div className="mx-auto max-w-[1600px] px-6 pb-12 pt-24 md:px-10 md:pt-32">
        {/* Big quiet wordmark & Columns */}
        <div className="border-b border-border pb-16 md:pb-24">
          <div className="grid grid-cols-1 gap-12 md:grid-cols-[1.5fr_1fr_1fr_1fr]">
            <div className="max-w-md space-y-4">
              <div className="flex items-center gap-2">
                <span className="font-display text-xl font-bold uppercase tracking-wider text-foreground">
                  Bakebook
                </span>
                <Logomark className="h-5 w-auto" color="var(--color-bakebook-blue)" />
                <span className="font-display text-xl font-bold uppercase tracking-wider text-foreground">
                  Bakery
                </span>
              </div>
              <p className="font-display text-2xl leading-[1.15] tracking-[-0.02em] text-foreground/90 md:text-3xl">
                Baked to be remembered. Artisanal provisions for the city of Delhi.
              </p>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Single-origin Arabica coffee, ceremonial Uji matcha, 72-hour sourdoughs, and bespoke cakes baked fresh every morning.
              </p>
            </div>

            <FooterCol
              title="Visit Us"
              items={[
                { label: "78 Maharaja Surajmal Marg" },
                { label: "Rishabh Vihar, Anand Vihar" },
                { label: "Delhi — 110092" },
              ]}
            />
            <FooterCol
              title="Opening Hours"
              items={[
                { label: "Mon – Fri  ·  8:00 – 22:00" },
                { label: "Sat – Sun  ·  9:00 – 23:00" },
                { label: "Fresh batches daily" },
              ]}
            />
            <FooterCol
              title="Sitemap"
              items={[
                { label: "Cafe & Menu", to: "/cafe" },
                { label: "The Cakery", to: "/cakery" },
                { label: "About Bakebook", to: "/about" },
                { label: "Visit & Contact", to: "/contact" },
              ]}
            />
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-10 flex flex-col items-start justify-between gap-6 text-[0.7rem] uppercase tracking-[0.14em] text-muted-foreground md:flex-row md:items-end">
          <div className="flex items-center gap-3">
            <Logomark className="h-5 w-auto" color="var(--color-bakebook-blue)" />
            <span>© {new Date().getFullYear()} Bakebook Bakery. All rights reserved.</span>
          </div>
          <div className="flex gap-8">
            <a
              href="https://instagram.com/bakebookbakery"
              target="_blank"
              rel="noreferrer"
              className="poilane-link hover:text-bakebook-blue transition-colors"
            >
              Instagram
            </a>
            <Link to="/contact" className="poilane-link hover:text-bakebook-blue transition-colors">
              Directions
            </Link>
            <Link to="/about" className="poilane-link hover:text-bakebook-blue transition-colors">
              Our Story
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({
  title,
  items,
}: {
  title: string;
  items: { label: string; to?: "/cafe" | "/cakery" | "/about" | "/contact" }[];
}) {
  return (
    <div>
      <p className="editorial-label text-bakebook-blue font-semibold">{title}</p>
      <ul className="mt-6 space-y-3 text-sm text-foreground/80 font-light">
        {items.map((item) =>
          item.to ? (
            <li key={item.label}>
              <Link to={item.to} className="poilane-link transition-colors hover:text-bakebook-blue">
                {item.label}
              </Link>
            </li>
          ) : (
            <li key={item.label}>{item.label}</li>
          ),
        )}
      </ul>
    </div>
  );
}
