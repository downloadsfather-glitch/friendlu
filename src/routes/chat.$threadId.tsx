import { ChatShell } from "@/components/chat-shell";
import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";

export const Route = createFileRoute("/chat/$threadId")({
  validateSearch: z.object({ prompt: z.string().optional() }),
  head: () => ({
    meta: [
      { title: "Chat — Friendlu AI" },
      { name: "description", content: "A focused AI chat workspace for planning and building." },
      { property: "og:title", content: "Chat — Friendlu AI" },
      { property: "og:description", content: "A focused AI chat workspace for planning and building." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ChatRoute,
});

function ChatRoute() {
  const { threadId } = Route.useParams();
  const { prompt } = Route.useSearch();
  return <ChatShell {...(prompt ? { initialPrompt: prompt } : {})} threadId={threadId} />;
}