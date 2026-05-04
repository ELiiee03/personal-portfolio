import { AIMessage, HumanMessage } from "@langchain/core/messages";
import { NextRequest } from "next/server";

import { getPortfolioRagGraph } from "@/ai/resume-rag/graph";
import {
  requireNvidiaApiKey,
  requireNvidiaChatModel,
  requireNvidiaEmbeddingModel,
} from "@/ai/resume-rag/nvidia";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

interface SseEvent {
  type: "thought_step" | "token" | "done" | "error";
  content?: string;
  inferenceMs?: number;
}

function extractToken(chunk: unknown): string {
  if (!chunk) return "";
  const c = chunk as {
    content?: string | Array<{ type?: string; text?: string }>;
  };
  if (typeof c.content === "string") return c.content;
  if (Array.isArray(c.content)) {
    return c.content
      .map((p) => {
        if (typeof p === "object" && p !== null && "text" in p) {
          return String((p as { text: string }).text);
        }
        return "";
      })
      .join("");
  }
  return "";
}

export async function POST(req: NextRequest) {
  let messages: Array<{ role: string; content: string }>;
  try {
    const body = await req.json() as { messages?: Array<{ role: string; content: string }> };
    messages = body.messages ?? [];
  } catch {
    return new Response("Bad request", { status: 400 });
  }

  try {
    requireNvidiaApiKey();
    requireNvidiaChatModel();
    requireNvidiaEmbeddingModel();
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Missing NVIDIA config";
    return new Response(JSON.stringify({ error: msg }), { status: 500 });
  }

  const encoder = new TextEncoder();

  const readable = new ReadableStream({
    async start(controller) {
      const send = (event: SseEvent) => {
        controller.enqueue(
          encoder.encode(`data: ${JSON.stringify(event)}\n\n`),
        );
      };

      const startTime = Date.now();

      try {
        const baseMessages = messages.map((m) =>
          m.role === "user"
            ? new HumanMessage(m.content)
            : new AIMessage(m.content),
        );

        const graph = getPortfolioRagGraph();
        const eventStream = graph.streamEvents(
          { messages: baseMessages },
          { version: "v2", recursionLimit: 20 },
        );

        // Buffer tokens from generateQueryOrRespond — we only emit them
        // as a response if the model answered directly (no tool calls).
        let directBuffer = "";

        for await (const event of eventStream) {
          const node = event.metadata?.langgraph_node as string | undefined;

          switch (event.event) {
            case "on_chain_start": {
              if (node === "generateQueryOrRespond") {
                send({ type: "thought_step", content: "🧠 Analyzing your question..." });
              } else if (node === "generate") {
                send({ type: "thought_step", content: "✍️ Composing response..." });
              }
              break;
            }

            case "on_tool_start": {
              const toolName = event.name as string;
              if (toolName === "retrieve_resume") {
                const query =
                  (event.data?.input as { query?: string } | undefined)?.query ?? "";
                send({
                  type: "thought_step",
                  content: `🔍 Searching resume: "${query}"`,
                });
              } else if (toolName === "send_email_to_owner") {
                send({ type: "thought_step", content: "📧 Preparing email..." });
              }
              break;
            }

            case "on_tool_end": {
              const toolName = event.name as string;
              if (toolName === "retrieve_resume") {
                send({ type: "thought_step", content: "📄 Context retrieved" });
              } else if (toolName === "send_email_to_owner") {
                send({ type: "thought_step", content: "✅ Email sent" });
              }
              break;
            }

            case "on_chat_model_stream": {
              const token = extractToken(event.data?.chunk);
              if (!token) break;
              if (node === "generate") {
                send({ type: "token", content: token });
              } else if (node === "generateQueryOrRespond") {
                directBuffer += token;
              }
              break;
            }

            case "on_chat_model_end": {
              if (node === "generateQueryOrRespond" && directBuffer.trim()) {
                const output = event.data?.output as
                  | {
                      tool_calls?: unknown[];
                      additional_kwargs?: { tool_calls?: unknown[] };
                    }
                  | undefined;
                const toolCalls =
                  output?.tool_calls ??
                  output?.additional_kwargs?.tool_calls ??
                  [];
                const isToolCall =
                  Array.isArray(toolCalls) && toolCalls.length > 0;
                if (!isToolCall) {
                  // Direct answer — flush the buffer as the response
                  send({ type: "token", content: directBuffer });
                }
                directBuffer = "";
              }
              break;
            }
          }
        }

        send({ type: "done", inferenceMs: Date.now() - startTime });
      } catch (err) {
        const msg =
          err instanceof Error ? err.message : "An unexpected error occurred";
        send({ type: "error", content: msg });
      } finally {
        controller.close();
      }
    },
  });

  return new Response(readable, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
      "X-Accel-Buffering": "no",
    },
  });
}
