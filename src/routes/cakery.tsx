import { createFileRoute } from "@tanstack/react-router";
import { ComingSoon } from "@/components/ComingSoon";

export const Route = createFileRoute("/cakery")({
  head: () => ({ meta: [{ title: "Cakery — Bakebook Bakery" }] }),
  component: () => (
    <ComingSoon
      eyebrow="The Cakery"
      title="Cakes, made the long way."
      body="Shop and custom cake commissions arrive in Phase 2."
    />
  ),
});
