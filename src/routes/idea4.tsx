import { createFileRoute } from "@tanstack/react-router";
import { IdeaLandingPage } from "@/components/IdeaLandingPage";

export const Route = createFileRoute("/idea4")({
  head: () => ({ meta: [{ title: "Bakebook — Idea 4" }] }),
  component: () => (
    <IdeaLandingPage
      layout="shelf"
      idea={{
        id: "idea4",
        title: "bread shelf",
        line: "loaf / pour / layer",
        text: "fresh stack / warm crust / slow ease",
        accent: "#78786c",
        shell: "#f1efe9",
        surface: "#faf7f2",
        panel: "#ffffff",
        textColor: "#1b1a17",
        muted: "#5f5d5a",
        border: "rgba(27,26,23,0.12)",
        button: "#1b1a17",
        buttonText: "#f7f4ee",
      }}
    />
  ),
});
