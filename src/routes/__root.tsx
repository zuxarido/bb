import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  useLocation,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { cn } from "@/lib/utils";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-6">
      <div className="max-w-md text-center">
        <p className="editorial-label text-muted-foreground">404</p>
        <h1 className="mt-6 font-display text-5xl uppercase tracking-tight text-foreground">
          Not Found
        </h1>
        <p className="mt-4 text-sm text-muted-foreground">
          The page you're looking for has been moved, renamed, or never existed.
        </p>
        <Link
          to="/"
          className="editorial-label mt-10 inline-block border border-foreground px-5 py-3 text-foreground transition-colors hover:bg-foreground hover:text-background"
        >
          Return Home
        </Link>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-6">
      <div className="max-w-md text-center">
        <p className="editorial-label text-muted-foreground">Something broke</p>
        <h1 className="mt-6 font-display text-3xl uppercase tracking-tight text-foreground">
          This page didn't load
        </h1>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="editorial-label border border-foreground bg-foreground px-5 py-3 text-background"
          >
            Try Again
          </button>
          <a
            href="/"
            className="editorial-label border border-foreground px-5 py-3 text-foreground"
          >
            Go Home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Bakebook Bakery — Baked to be remembered" },
      {
        name: "description",
        content:
          "Bakebook Bakery, Delhi. Specialty coffee, matcha, sandwiches and bespoke cakes — baked fresh daily on Maharaja Surajmal Marg.",
      },
      { name: "author", content: "Bakebook Bakery" },
      { property: "og:title", content: "Bakebook Bakery — Baked to be remembered" },
      {
        property: "og:description",
        content: "Specialty coffee, matcha, sandwiches and bespoke cakes. Delhi.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Inter+Tight:wght@300;400;500;600&family=Inter:wght@300;400;500&display=swap",
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  const location = useLocation();
  const isHome = location.pathname === "/";

  return (
    <QueryClientProvider client={queryClient}>
      <div className="flex min-h-screen flex-col bg-background text-foreground">
        <SiteHeader />
        <main className={cn("flex-1", !isHome && "pt-16 md:pt-20")}>
          <Outlet />
        </main>
        <SiteFooter />
      </div>
    </QueryClientProvider>
  );
}
