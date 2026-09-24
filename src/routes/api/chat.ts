import {
  createLovableAiGatewayRunIdFetch,
  getLovableAiGatewayRunId,
} from "@/lib/ai-gateway.server";
import { createOpenAI } from "@ai-sdk/openai";
import { createFileRoute } from "@tanstack/react-router";
import {
  convertToModelMessages,
  stepCountIs,
  streamText,
  tool,
  type UIMessage,
} from "ai";
import { z } from "zod";

type ChatBody = {
  messages: UIMessage[];
  mode?: "plan" | "build";
  memory?: { label: string; value: string }[];
};

const systemPrompt = (
  mode: "plan" | "build",
  memory: { label: string; value: string }[],
) => {
  const known = memory.length
    ? memory.map((item) => `- ${item.label}: ${item.value}`).join("\n")
    : "- nothing saved yet";

  return `You are Friendlu AI, a warm, thoughtful assistant that helps people think, write, plan and build.

How you work:
- Before doing substantial work on a vague request, ask targeted clarifying questions (1-3 at a time, numbered) about goals, audience, constraints, tone and format. Never dump a long questionnaire.
- When a question is simple or the details are already known, answer directly without interrogating the user.
- Whenever the user tells you a durable, reusable detail about themselves or their project (name, role, product, audience, tech stack, tone preference, deadlines, do-nots), call the save_detail tool once per detail so you can rely on it later. Do not save one-off trivia or secrets.
- Reuse saved details silently instead of asking again.
- Use markdown: short paragraphs, headings and bullets where useful.

Current mode: ${mode === "plan" ? "Plan — explore the problem, ask questions, outline an approach before details." : "Build — produce the concrete deliverable, with code or copy ready to use."}

Details already saved about the user:
${known}`;
};

export const Route = createFileRoute("/api/chat")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const apiKey = process.env["LOVABLE_API_KEY"];
        if (!apiKey) {
          return new Response(
            JSON.stringify({ error: "AI is not configured yet." }),
            { status: 500, headers: { "content-type": "application/json" } },
          );
        }

        const body = (await request.json()) as ChatBody;
        const mode = body.mode === "build" ? "build" : "plan";
        const memory = Array.isArray(body.memory) ? body.memory.slice(0, 40) : [];

        const runIdFetch = createLovableAiGatewayRunIdFetch(
          getLovableAiGatewayRunId(request),
        );
        const lovable = createOpenAI({
          baseURL: "https://ai.gateway.lovable.dev/v1",
          apiKey,
          headers: {
            "Lovable-API-Key": apiKey,
            "X-Lovable-AIG-SDK": "vercel-ai-sdk",
          },
          fetch: runIdFetch.fetch,
        });

        try {
          const result = streamText({
            model: lovable.responses("openai/gpt-6-astra"),
            system: systemPrompt(mode, memory),
            messages: await convertToModelMessages(body.messages ?? []),
            stopWhen: stepCountIs(50),
            tools: {
              save_detail: tool({
                description:
                  "Save a durable detail about the user or their project so it can be reused in later messages.",
                inputSchema: z.object({
                  label: z
                    .string()
                    .describe("Short name for the detail, e.g. 'Product' or 'Tone'"),
                  value: z.string().describe("The detail itself, kept concise."),
                }),
                execute: async ({ label, value }) => ({
                  saved: true,
                  label,
                  value,
                }),
              }),
            },
            providerOptions: {
              openai: {
                forceReasoning: true,
                reasoningEffort: "low",
                store: false,
                include: ["reasoning.encrypted_content"],
              },
            },
          });

          return result.toUIMessageStreamResponse({
            originalMessages: body.messages ?? [],
          });
        } catch (error) {
          const message =
            error instanceof Error ? error.message : "AI request failed.";
          return new Response(JSON.stringify({ error: message }), {
            status: 502,
            headers: { "content-type": "application/json" },
          });
        }
      },
    },
  },
});
