import { createFileRoute } from "@tanstack/react-router";
import { IdeaLandingPage } from "@/components/IdeaLandingPage";

export const Route = createFileRoute("/idea5")({
  head: () => ({ meta: [{ title: "Bakebook — Idea 5" }] }),
  component: () => (
    <IdeaLandingPage
      layout="drift"
      idea={{
        id: "idea5",
        title: "good day",
        line: "bake / brew / stay",
        text: "soft crumb / warm mug / slow hour",
        accent: "#b67d5e",
        shell: "#f0eae4",
        surface: "#f7f0ea",
        panel: "#fffdfb",
        textColor: "#1d1a17",
        muted: "#5d514b",
        border: "rgba(29,26,23,0.12)",
        button: "#b67d5e",
        buttonText: "#fffaf7",
      }}
    />
  ),
});
