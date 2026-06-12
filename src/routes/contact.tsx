import { createFileRoute } from "@tanstack/react-router";
import { ComingSoon } from "@/components/ComingSoon";

export const Route = createFileRoute("/contact")({
  head: () => ({ meta: [{ title: "Contact — Bakebook Bakery" }] }),
  component: () => (
    <ComingSoon
      eyebrow="Contact"
      title="Come say hello."
      body="78 Maharaja Surajmal Marg, Anand Vihar, Delhi 110092. Full contact page in Phase 2."
    />
  ),
});
