import { chunkArray } from "@langchain/core/utils/chunk_array";
import { ChatOpenAI, OpenAIEmbeddings } from "@langchain/openai";

const DEFAULT_BASE_URL = "https://integrate.api.nvidia.com/v1";

/**
 * NVIDIA integrate OpenAI-compatible /v1/embeddings expects extra fields
 * (input_type, truncate). The official cURL uses input_type "query" vs "passage"
 * for retrieval quality.
 *
 * @see https://docs.api.nvidia.com/nim/reference/nvidia-nv-embed-v1-infer
 */
class NvidiaIntegrateEmbeddings extends OpenAIEmbeddings {
  constructor(
    fields?: ConstructorParameters<typeof OpenAIEmbeddings>[0],
  ) {
    super({
      encodingFormat: "float",
      stripNewLines: false,
      ...fields,
    });
  }

  async embedDocuments(texts: string[]): Promise<number[][]> {
    const batches = chunkArray(
      this.stripNewLines ? texts.map((t) => t.replace(/\n/g, " ")) : texts,
      this.batchSize,
    );
    const batchRequests = batches.map((batch) =>
      this.embeddingWithRetry({
        model: this.model,
        input: batch,
        encoding_format: "float",
        input_type: "passage",
        truncate: "NONE",
      } as Parameters<OpenAIEmbeddings["embeddingWithRetry"]>[0]),
    );
    const batchResponses = await Promise.all(batchRequests);
    const embeddings: number[][] = [];
    for (let i = 0; i < batchResponses.length; i += 1) {
      const batch = batches[i]!;
      const { data: batchResponse } = batchResponses[i]!;
      for (let j = 0; j < batch.length; j += 1) {
        embeddings.push(batchResponse[j]!.embedding as number[]);
      }
    }
    return embeddings;
  }

  async embedQuery(text: string): Promise<number[]> {
    const { data } = await this.embeddingWithRetry({
      model: this.model,
      input: this.stripNewLines ? text.replace(/\n/g, " ") : text,
      encoding_format: "float",
      input_type: "query",
      truncate: "NONE",
    } as Parameters<OpenAIEmbeddings["embeddingWithRetry"]>[0]);
    return data[0]!.embedding as number[];
  }
}

export function getNvidiaBaseUrl(): string {
  return (process.env.NVIDIA_BASE_URL?.trim() || DEFAULT_BASE_URL).replace(
    /\/$/,
    "",
  );
}

export function requireNvidiaApiKey(): string {
  const key = process.env.NVIDIA_API_KEY?.trim();
  if (!key) {
    throw new Error(
      "NVIDIA_API_KEY is required for the portfolio chatbot. Set it in .env.local",
    );
  }
  return key;
}

export function requireNvidiaChatModel(): string {
  const id = process.env.NVIDIA_CHAT_MODEL?.trim();
  if (!id) {
    throw new Error(
      "NVIDIA_CHAT_MODEL is required (exact catalog model id from NVIDIA build).",
    );
  }
  return id;
}

export function requireNvidiaEmbeddingModel(): string {
  const id = process.env.NVIDIA_EMBEDDING_MODEL?.trim();
  if (!id) {
    throw new Error(
      "NVIDIA_EMBEDDING_MODEL is required (e.g. nv-embed-v1 catalog id).",
    );
  }
  return id;
}

export function createNvidiaChatModel(options?: { temperature?: number }) {
  return new ChatOpenAI({
    model: requireNvidiaChatModel(),
    temperature: options?.temperature ?? 0.7,
    apiKey: requireNvidiaApiKey(),
    configuration: { baseURL: getNvidiaBaseUrl() },
  });
}

export function createNvidiaEmbeddings() {
  return new NvidiaIntegrateEmbeddings({
    model: requireNvidiaEmbeddingModel(),
    apiKey: requireNvidiaApiKey(),
    configuration: { baseURL: getNvidiaBaseUrl() },
  });
}
