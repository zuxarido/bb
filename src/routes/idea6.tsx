import { createFileRoute } from "@tanstack/react-router";
import { IdeaLandingPage } from "@/components/IdeaLandingPage";

export const Route = createFileRoute("/idea6")({
  head: () => ({ meta: [{ title: "Bakebook — Idea 6" }] }),
  component: () => (
    <IdeaLandingPage
      layout="monolith"
      idea={{
        id: "idea6",
        title: "hot room",
        line: "milk / bean / steam",
        text: "bread / room / stay",
        accent: "#8aaec2",
        shell: "#0d1418",
        surface: "#111d22",
        panel: "#182830",
        textColor: "#edf5f8",
        muted: "#b7c9cf",
        border: "rgba(237,245,248,0.12)",
        button: "#8aaec2",
        buttonText: "#0d1418",
      }}
    />
  ),
});
