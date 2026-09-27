import { createFileRoute } from "@tanstack/react-router";
import { IdeaLandingPage } from "@/components/IdeaLandingPage";

export const Route = createFileRoute("/idea1")({
  head: () => ({ meta: [{ title: "Bakebook — Idea 1" }] }),
  component: () => (
    <IdeaLandingPage
      layout="morning"
      idea={{
        id: "idea1",
        title: "fresh loaf",
        line: "warm room",
        text: "espresso / bread / good morning",
        accent: "#a48763",
        shell: "#f3efe9",
        surface: "#f7f3ee",
        panel: "#fffdf9",
        textColor: "#171512",
        muted: "#5f5a55",
        border: "rgba(23,21,18,0.12)",
        button: "#171512",
        buttonText: "#f8f5f1",
      }}
    />
  ),
});
