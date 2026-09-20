import { createFileRoute } from "@tanstack/react-router";
import { HomeScreen } from "@/components/chat-shell";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Amani AI — Create with AI" },
      { name: "description", content: "Plan, write, and build with a friendly AI workspace." },
      { property: "og:title", content: "Amani AI — Create with AI" },
      { property: "og:description", content: "Plan, write, and build with a friendly AI workspace." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: HomeScreen,
});
