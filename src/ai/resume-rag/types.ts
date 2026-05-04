export type ResumeEmbeddingRecord = {
  id: string;
  text: string;
  metadata: Record<string, unknown>;
  embedding: number[];
};
