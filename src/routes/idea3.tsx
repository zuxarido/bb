import { createFileRoute } from "@tanstack/react-router";
import { IdeaLandingPage } from "@/components/IdeaLandingPage";

export const Route = createFileRoute("/idea3")({
  head: () => ({ meta: [{ title: "Bakebook — Idea 3" }] }),
  component: () => (
    <IdeaLandingPage
      layout="window"
      idea={{
        id: "idea3",
        title: "soft light",
        line: "window / room / stay",
        text: "bread / butter / warm stillness",
        accent: "#7b9883",
        shell: "#f3f0ea",
        surface: "#f6f2ed",
        panel: "#ffffff",
        textColor: "#171815",
        muted: "#5d5f5d",
        border: "rgba(23,24,21,0.1)",
        button: "#171815",
        buttonText: "#faf8f5",
      }}
    />
  ),
});
