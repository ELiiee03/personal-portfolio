import "@/ai/langsmith-bootstrap";

import {
  AIMessage,
  BaseMessage,
  HumanMessage,
  SystemMessage,
  ToolMessage,
} from "@langchain/core/messages";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { tool } from "@langchain/core/tools";
import {
  Annotation,
  END,
  MessagesAnnotation,
  START,
  StateGraph,
} from "@langchain/langgraph";
import { ToolNode } from "@langchain/langgraph/prebuilt";
import * as z from "zod";

import {
  createNvidiaChatModel,
  createNvidiaEmbeddings,
} from "./nvidia";
import { loadResumeEmbeddingsSync, topKByCosine } from "./static-store";

export const SYSTEM_PROMPT = `You are Ellie, the personal AI assistant of Lieca Jane "Elliee" Eleccion — an Agentic AI Engineer and RAG developer based in Butuan City, Philippines. You represent her portfolio and help visitors learn about her background, skills, projects, and contacts.

You are warm, professional, and knowledgeable about Elliee's work. For facts about her experience, education, projects, and skills, call the retrieve_resume tool with a focused search query instead of guessing.

You can also use send_email_to_owner when the visitor wants to email her: collect name, email, and message one step at a time. Summarize everything and wait for explicit confirmation before calling send_email_to_owner.

Do NOT call send_email_to_owner unless name, email, and message are collected and the user explicitly confirms.

Do NOT make up information. If retrieve_resume returns nothing useful, say you don't have that detail and suggest reaching out directly.

Contact: lieca.eleccion03@gmail.com | +63 950 218 4401`;

const emailSchema = z.object({
  name: z.string().describe("The user's name."),
  email: z.string().email().describe("The user's email address."),
  message: z.string().describe("The user's message for Elliee."),
});

async function searchResume(query: string, k: number): Promise<string> {
  const store = loadResumeEmbeddingsSync();
  if (store.length === 0) {
    return "(No resume index found. Ask the site owner to run npm run ingest:resume.)";
  }
  const embedder = createNvidiaEmbeddings();
  const qv = await embedder.embedQuery(query);
  const hits = topKByCosine(qv, store, k);
  return hits.map((h) => h.text).join("\n\n---\n\n");
}

export const retrieveResumeTool = tool(
  async ({ query }) => searchResume(query, 5),
  {
    name: "retrieve_resume",
    description:
      "Semantic search over Elliee's resume (experience, projects like LeafSense, skills, education, certifications). Use for factual questions.",
    schema: z.object({
      query: z
        .string()
        .describe("Short search query capturing what to look up in the resume."),
    }),
  },
);

export const sendEmailToOwnerTool = tool(
  async (input) => {
    console.log(
      `Simulating sending email:\n      Name: ${input.name}\n      Email: ${input.email}\n      Message: ${input.message}`,
    );
    return "Email sending initiated successfully.";
  },
  {
    name: "send_email_to_owner",
    description:
      "Send an email to Elliee with name, email, and message. ONLY after the user explicitly confirms all three fields.",
    schema: emailSchema,
  },
);

const tools = [retrieveResumeTool, sendEmailToOwnerTool];
const toolNode = new ToolNode(tools);

const StateAnnotation = Annotation.Root({
  ...MessagesAnnotation.spec,
});

type AgentState = typeof StateAnnotation.State;

function msgContentToString(msg: BaseMessage | undefined): string {
  if (!msg) return "";
  const c = msg.content;
  if (typeof c === "string") return c;
  if (Array.isArray(c)) {
    return c
      .map((p) => {
        if (typeof p === "object" && p !== null && "text" in p) {
          return String((p as { text: string }).text);
        }
        return "";
      })
      .join("");
  }
  return String(c);
}

function getLastHumanMessage(messages: BaseMessage[]): string {
  for (let i = messages.length - 1; i >= 0; i--) {
    const m = messages[i]!;
    if (HumanMessage.isInstance(m)) return msgContentToString(m);
  }
  return "";
}

function findLastAiWithToolCalls(
  messages: BaseMessage[],
): AIMessage | undefined {
  for (let i = messages.length - 1; i >= 0; i--) {
    const m = messages[i]!;
    if (AIMessage.isInstance(m) && m.tool_calls?.length) {
      return m;
    }
  }
  return undefined;
}

function getRetrieveToolContents(messages: BaseMessage[]): string {
  let aiIdx = -1;
  let aiMsg: AIMessage | undefined;
  for (let i = messages.length - 1; i >= 0; i--) {
    const m = messages[i]!;
    if (
      AIMessage.isInstance(m) &&
      m.tool_calls?.some((t) => t.name === "retrieve_resume")
    ) {
      aiIdx = i;
      aiMsg = m;
      break;
    }
  }
  if (aiIdx === -1 || !aiMsg?.tool_calls?.length) return "";
  const ids = new Set(
    aiMsg.tool_calls
      .filter((t) => t.name === "retrieve_resume")
      .map((t) => t.id),
  );
  const chunks: string[] = [];
  for (let j = aiIdx + 1; j < messages.length; j++) {
    const m = messages[j]!;
    if (AIMessage.isInstance(m)) break;
    if (ToolMessage.isInstance(m) && ids.has(m.tool_call_id)) {
      chunks.push(msgContentToString(m));
    }
  }
  return chunks.join("\n\n---\n\n");
}

async function generateQueryOrRespond(
  state: AgentState,
): Promise<Partial<AgentState>> {
  const model = createNvidiaChatModel({ temperature: 0.7 }).bindTools(tools);
  const response = await model.invoke([
    new SystemMessage(SYSTEM_PROMPT),
    ...state.messages,
  ]);
  return { messages: [response] };
}

function shouldExecuteTools(state: AgentState): "tools" | typeof END {
  const last = state.messages.at(-1);
  if (AIMessage.isInstance(last) && (last.tool_calls?.length ?? 0) > 0) {
    return "tools";
  }
  return END;
}

function routeAfterTools(
  state: AgentState,
): "generate" | "generateQueryOrRespond" {
  const ai = findLastAiWithToolCalls(state.messages);
  const names = ai?.tool_calls?.map((t) => t.name) ?? [];
  if (names.includes("retrieve_resume")) return "generate";
  return "generateQueryOrRespond";
}

const generatePrompt = ChatPromptTemplate.fromTemplate(
  `{system}

Answer using the retrieved context when it applies. If context is empty or irrelevant, say you could not find that in Elliee's resume and offer contact options.

Retrieved context:
-------
{context}
-------

User question:
{question}`,
);

async function generateAnswer(
  state: AgentState,
): Promise<Partial<AgentState>> {
  const question = getLastHumanMessage(state.messages);
  const context =
    getRetrieveToolContents(state.messages) ||
    msgContentToString(state.messages.at(-1));
  const model = createNvidiaChatModel({ temperature: 0.35 });
  const msg = await generatePrompt.pipe(model).invoke({
    system: SYSTEM_PROMPT,
    context,
    question,
  });
  return { messages: [msg as BaseMessage] };
}

let compiled: ReturnType<typeof buildAndCompile> | undefined;

function buildAndCompile() {
  return new StateGraph(StateAnnotation)
    .addNode("generateQueryOrRespond", generateQueryOrRespond)
    .addNode("tools", toolNode)
    .addNode("generate", generateAnswer)
    .addEdge(START, "generateQueryOrRespond")
    .addConditionalEdges("generateQueryOrRespond", shouldExecuteTools)
    .addConditionalEdges("tools", routeAfterTools)
    .addEdge("generate", END)
    .compile();
}

export function getPortfolioRagGraph() {
  if (!compiled) {
    compiled = buildAndCompile();
  }
  return compiled;
}

export async function invokePortfolioRag(
  messages: BaseMessage[],
): Promise<AgentState> {
  return getPortfolioRagGraph().invoke(
    { messages } as AgentState,
    { recursionLimit: 20 },
  );
}

export function getFinalAiText(messages: BaseMessage[]): string {
  const last = messages.at(-1);
  if (last && AIMessage.isInstance(last)) {
    return msgContentToString(last) || "I apologize, I could not generate a response.";
  }
  return "I apologize, I could not generate a response.";
}

export function extractEmailOutcome(messages: BaseMessage[]): {
  emailSent: boolean;
  emailDetails?: z.infer<typeof emailSchema>;
} {
  for (let i = 0; i < messages.length; i++) {
    const m = messages[i]!;
    if (!AIMessage.isInstance(m) || !m.tool_calls?.length) continue;
    for (const tc of m.tool_calls) {
      if (tc.name !== "send_email_to_owner") continue;
      const id = tc.id;
      for (let j = i + 1; j < messages.length; j++) {
        const tm = messages[j]!;
        if (ToolMessage.isInstance(tm) && tm.tool_call_id === id) {
          return {
            emailSent: true,
            emailDetails: tc.args as z.infer<typeof emailSchema>,
          };
        }
      }
    }
  }
  return { emailSent: false };
}
