import { createFileRoute, Link } from "@tanstack/react-router";
import { HeroSection } from "@/components/poilane/HeroSection";
import { AboutSection } from "@/components/poilane/AboutSection";
import { OurProductsSection } from "@/components/poilane/OurProductsSection";
import { LatestLaunchesSection } from "@/components/poilane/LatestLaunchesSection";
import { InstagramSection } from "@/components/poilane/InstagramSection";
import { ScrollReveal } from "@/components/poilane/ScrollReveal";
import { Logomark } from "@/components/Logo";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Bakebook Bakery — Baked to be remembered" },
      {
        name: "description",
        content:
          "A bakery, a cafe, a cakery. Specialty coffee, Uji matcha, sourdough sandwiches and bespoke celebration cakes — Delhi, baked fresh daily.",
      },
      { property: "og:title", content: "Bakebook Bakery — Baked to be remembered" },
      {
        property: "og:description",
        content: "Specialty coffee, matcha, sourdough sandwiches and bespoke cakes. Delhi.",
      },
    ],
  }),
  component: IndexPage,
});

function IndexPage() {
  return (
    <div className="w-full bg-background text-foreground selection:bg-bakebook-blue selection:text-white">
      {/* 1. Hero / Video */}
      <HeroSection />

      {/* 2. Our Latest Launches */}
      <LatestLaunchesSection />

      {/* 3. Our Products */}
      <OurProductsSection />

      {/* 4. About Us / Bakebook Story + Instagram */}
      <AboutSection />
      <InstagramSection />
    </div>
  );
}

