import { createFileRoute } from "@tanstack/react-router";
import { ComingSoon } from "@/components/ComingSoon";

export const Route = createFileRoute("/cafe")({
  head: () => ({ meta: [{ title: "Cafe — Bakebook Bakery" }] }),
  component: () => (
    <ComingSoon
      eyebrow="The Cafe"
      title="Coffee, matcha, sandwiches."
      body="The cafe experience is being built next. Coming in Phase 2."
    />
  ),
});
