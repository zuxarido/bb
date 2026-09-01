import { createFileRoute } from "@tanstack/react-router";
import { IdeaLandingPage } from "@/components/IdeaLandingPage";

export const Route = createFileRoute("/idea2")({
  head: () => ({ meta: [{ title: "Bakebook — Idea 2" }] }),
  component: () => (
    <IdeaLandingPage
      layout="cut"
      idea={{
        id: "idea2",
        title: "slow roast",
        line: "milk / steam / cut",
        text: "coffee / cream / warm light",
        accent: "#c39e6b",
        shell: "#171413",
        surface: "#1d1b1a",
        panel: "#231f1d",
        textColor: "#f4efe8",
        muted: "#d6c8b9",
        border: "rgba(255,255,255,0.12)",
        button: "#d9c39e",
        buttonText: "#171413",
      }}
    />
  ),
});
