import { Link } from "@tanstack/react-router";
import { Logomark } from "./Logo";

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-background">
      <div className="mx-auto max-w-[1600px] px-6 pb-12 pt-24 md:px-10 md:pt-32">
        {/* Big quiet wordmark */}
        <div className="border-b border-border pb-16 md:pb-24">
          <div className="grid grid-cols-1 gap-12 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
            <div className="max-w-md">
              <p className="editorial-label text-muted-foreground">Bakebook Bakery</p>
              <p className="mt-6 font-display text-2xl leading-[1.15] tracking-[-0.02em] text-foreground md:text-3xl">
                Baked to be remembered. Best things are always in between the bread.
              </p>
            </div>

            <FooterCol
              title="Visit"
              items={[
                { label: "78 Maharaja Surajmal Marg" },
                { label: "Rishabh Vihar, Anand Vihar" },
                { label: "Delhi, 110092" },
              ]}
            />
            <FooterCol
              title="Hours"
              items={[
                { label: "Mon – Fri  ·  8 – 10" },
                { label: "Sat – Sun  ·  9 – 11" },
              ]}
            />
            <FooterCol
              title="Sitemap"
              items={[
                { label: "Cafe", to: "/cafe" },
                { label: "Cakery", to: "/cakery" },
                { label: "About", to: "/about" },
                { label: "Contact", to: "/contact" },
              ]}
            />
          </div>
        </div>

        <div className="mt-10 flex flex-col items-start justify-between gap-6 text-[0.7rem] uppercase tracking-[0.12em] text-muted-foreground md:flex-row md:items-end">
          <div className="flex items-center gap-3">
            <Logomark className="h-5 w-auto" color="var(--color-bakebook-blue)" />
            <span>© {new Date().getFullYear()} Bakebook Bakery</span>
          </div>
          <div className="flex gap-6">
            <a href="#" className="transition-colors hover:text-foreground">
              Instagram
            </a>
            <a href="#" className="transition-colors hover:text-foreground">
              Privacy
            </a>
            <a href="#" className="transition-colors hover:text-foreground">
              Terms
            </a>
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
      <p className="editorial-label text-muted-foreground">{title}</p>
      <ul className="mt-6 space-y-2.5 text-sm text-foreground/90">
        {items.map((item) =>
          item.to ? (
            <li key={item.label}>
              <Link to={item.to} className="transition-colors hover:text-bakebook-blue">
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
