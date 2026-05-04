'use server';
/**
 * @fileOverview This file implements a Genkit flow that acts as Elliee's personal AI assistant.
 * It answers questions about her experience, projects, skills, education, and contact information.
 *
 * - chatbotPortfolioInformation - The main function to interact with the AI assistant.
 * - ChatbotPortfolioInformationInput - The input type for the chatbotPortfolioInformation function.
 * - ChatbotPortfolioInformationOutput - The return type for the chatbotPortfolioInformation function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

// Define the input schema for the chatbot flow.
const ChatbotPortfolioInformationInputSchema = z
  .object({
    userMessage: z.string().describe("The user's message or question to Elliee's AI assistant."),
    chatHistory: z
      .array(
        z.object({
          role: z.enum(['user', 'model']),
          content: z.string(),
        })
      )
      .optional()
      .describe('Optional chat history for multi-turn conversations.'),
  })
  .describe('Input for the chatbot portfolio information flow, including current message and optional history.');

export type ChatbotPortfolioInformationInput = z.infer<typeof ChatbotPortfolioInformationInputSchema>;

// Define the output schema for the chatbot flow.
const ChatbotPortfolioInformationOutputSchema = z
  .object({
    response: z.string().describe("Elliee's AI assistant's response."),
  })
  .describe('Output from the chatbot portfolio information flow, containing the AI assistant\'s response.');

export type ChatbotPortfolioInformationOutput = z.infer<typeof ChatbotPortfolioInformationOutputSchema>;

// The system prompt provides the AI with its persona and knowledge base.
const systemPromptContent = `You are Ellie, the personal AI assistant of Lieca Jane "Elliee" Eleccion — an Agentic AI Engineer and RAG developer based in Butuan City, Philippines. You represent her portfolio and help visitors learn about her background, skills, projects, and contacts.

You are warm, professional, and knowledgeable about Elliee's work. Answer questions about:
- Her experience at MyRepsoft (Agentic AI Engineer), Exon (AI & Mobile Developer), and her internship at Butuan City Tourism
- Her projects: Agentic RAG System, SQL Agent, LeafSense (undergraduate thesis)
- Her technical skills: LangChain, LangGraph, RAG, FastAPI, computer vision, MobileNetV3, SVM, n8n, ChromaDB, Pinecone, Qdrant, PyTorch, and more
- Her education at Caraga State University (Cum Laude, GPA 1.71, BS Information Technology, 2021–2025)
- Her achievements: AI Hackathon 3rd place (ICT Davao 2025), Civil Service Eligible
- How to contact her: lieca.eleccion03@gmail.com | +63 950 218 4401

If someone wants to send her an email, collect their name, email address, and message — one field at a time conversationally. Then confirm before sending. Use a friendly, smart tone — like a helpful colleague who knows Elliee well, not a corporate bot. Keep responses concise and scannable.

Do NOT make up information. If you don't know something specific about Elliee, say so and suggest they reach out directly.`;

// Define the Genkit flow for the chatbot.
const chatbotPortfolioInformationFlow = ai.defineFlow(
  {
    name: 'chatbotPortfolioInformationFlow',
    inputSchema: ChatbotPortfolioInformationInputSchema,
    outputSchema: ChatbotPortfolioInformationOutputSchema,
  },
  async (input) => {
    // Construct the messages array for the AI model, including system prompt and chat history.
    const messages: Array<{ role: 'user' | 'model' | 'system'; content: string }> = [
      { role: 'system', content: systemPromptContent },
    ];

    // Add previous chat history to maintain conversation context.
    if (input.chatHistory && input.chatHistory.length > 0) {
      messages.push(...input.chatHistory.map((msg) => ({ role: msg.role, content: msg.content })));
    }

    // Add the current user's message.
    messages.push({ role: 'user', content: input.userMessage });

    // Call the Gemini 1.5 Flash model with the constructed messages.
    const { output } = await ai.generate({
      model: 'googleai/gemini-1.5-flash', // Use Gemini 1.5 Flash as specified
      messages: messages,
    });

    // Return the AI's response.
    return { response: output?.text || 'I apologize, I could not generate a response.' };
  }
);

// Wrapper function to expose the Genkit flow as a standard TypeScript function.
export async function chatbotPortfolioInformation(
  input: ChatbotPortfolioInformationInput
): Promise<ChatbotPortfolioInformationOutput> {
  return chatbotPortfolioInformationFlow(input);
}
