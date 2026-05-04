import fs from "fs";
import path from "path";

import type { ResumeEmbeddingRecord } from "./types";

let cached: ResumeEmbeddingRecord[] | null = null;

function embeddingsPath(): string {
  return path.join(process.cwd(), "content", "resume-embeddings.json");
}

export function loadResumeEmbeddingsSync(): ResumeEmbeddingRecord[] {
  if (cached) return cached;
  const file = embeddingsPath();
  if (!fs.existsSync(file)) {
    return [];
  }
  const raw = fs.readFileSync(file, "utf-8");
  const data = JSON.parse(raw) as ResumeEmbeddingRecord[];
  if (!Array.isArray(data)) {
    throw new Error("resume-embeddings.json must be a JSON array");
  }
  cached = data;
  return cached;
}

export function cosineSimilarity(a: number[], b: number[]): number {
  if (a.length !== b.length || a.length === 0) return 0;
  let dot = 0;
  let na = 0;
  let nb = 0;
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    na += a[i] * a[i];
    nb += b[i] * b[i];
  }
  const denom = Math.sqrt(na) * Math.sqrt(nb);
  return denom === 0 ? 0 : dot / denom;
}

export function topKByCosine(
  queryEmbedding: number[],
  records: ResumeEmbeddingRecord[],
  k: number,
): ResumeEmbeddingRecord[] {
  if (records.length === 0) return [];
  const scored = records.map((r) => ({
    r,
    score: cosineSimilarity(queryEmbedding, r.embedding),
  }));
  scored.sort((x, y) => y.score - x.score);
  return scored.slice(0, k).map((s) => s.r);
}
