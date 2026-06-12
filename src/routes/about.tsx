import { createFileRoute } from "@tanstack/react-router";
import { ComingSoon } from "@/components/ComingSoon";

export const Route = createFileRoute("/about")({
  head: () => ({ meta: [{ title: "About — Bakebook Bakery" }] }),
  component: () => (
    <ComingSoon
      eyebrow="About"
      title="The room, the bread, the people."
      body="The full story is being written. Coming in Phase 2."
    />
  ),
});
