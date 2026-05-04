'use server';
/**
 * @fileOverview Server chat for the portfolio assistant: LangGraph agentic RAG
 * over static resume embeddings (NVIDIA nv-embed-v1) + ChatOpenAI aimed at
 * NVIDIA's OpenAI-compatible glm-4.7 endpoint. Includes send_email_to_owner tool.
 */

import { AIMessage, HumanMessage } from '@langchain/core/messages';
import * as z from 'zod';

import {
  extractEmailOutcome,
  getFinalAiText,
  invokePortfolioRag,
} from '@/ai/resume-rag/graph';
import {
  requireNvidiaApiKey,
  requireNvidiaChatModel,
  requireNvidiaEmbeddingModel,
} from '@/ai/resume-rag/nvidia';

const ChatbotMessageSchema = z.object({
  role: z.enum(['user', 'model', 'tool']),
  content: z.string(),
});
export type ChatbotMessage = z.infer<typeof ChatbotMessageSchema>;

const ChatbotSendEmailInputSchema = z.object({
  messages: z
    .array(ChatbotMessageSchema)
    .describe(
      'The full conversation history, with the latest user message as the last item.',
    ),
});
export type ChatbotSendEmailInput = z.infer<typeof ChatbotSendEmailInputSchema>;

const ChatbotSendEmailOutputSchema = z.object({
  response: z.string().describe("The AI's conversational response."),
  emailSent: z
    .boolean()
    .optional()
    .describe('True if the email was successfully "sent" via the tool.'),
  emailDetails: z
    .object({
      name: z.string().describe("The user's name."),
      email: z.string().email().describe("The user's email address."),
      message: z.string().describe("The user's message for Elliee."),
    })
    .optional()
    .describe('Details of the email if it was sent.'),
});
export type ChatbotSendEmailOutput = z.infer<
  typeof ChatbotSendEmailOutputSchema
>;

function toBaseMessages(input: ChatbotSendEmailInput['messages']) {
  return input.map((msg) => {
    if (msg.role === 'user') {
      return new HumanMessage(msg.content);
    }
    return new AIMessage(msg.content);
  });
}

export async function sendChatbotEmail(
  input: ChatbotSendEmailInput,
): Promise<ChatbotSendEmailOutput> {
  requireNvidiaApiKey();
  requireNvidiaChatModel();
  requireNvidiaEmbeddingModel();
  const result = await invokePortfolioRag(toBaseMessages(input.messages));
  const { emailSent, emailDetails } = extractEmailOutcome(result.messages);
  return {
    response: getFinalAiText(result.messages),
    emailSent,
    emailDetails,
  };
}
