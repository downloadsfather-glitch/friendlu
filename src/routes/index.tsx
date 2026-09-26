import { createFileRoute } from "@tanstack/react-router";
import { LandingPage } from "@/components/landing";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Friendlu AI — Create with AI" },
      { name: "description", content: "Plan, write, and build with a friendly AI workspace." },
      { property: "og:title", content: "Friendlu AI — Create with AI" },
      { property: "og:description", content: "Plan, write, and build with a friendly AI workspace." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: LandingPage,
});
