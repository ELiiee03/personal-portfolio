import { config } from "dotenv";
import fs from "fs/promises";
import path from "path";

import { Document } from "@langchain/core/documents";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";

import type { ResumeEmbeddingRecord } from "../src/ai/resume-rag/types";
import { createNvidiaEmbeddings } from "../src/ai/resume-rag/nvidia";

config({ path: path.join(process.cwd(), ".env.local") });
config({ path: path.join(process.cwd(), ".env") });

async function main() {
  const mdPath = path.join(process.cwd(), "content", "resume.md");
  const outPath = path.join(process.cwd(), "content", "resume-embeddings.json");

  const raw = await fs.readFile(mdPath, "utf-8");
  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 900,
    chunkOverlap: 120,
  });
  const docs = await splitter.splitDocuments([
    new Document({
      pageContent: raw,
      metadata: { source: "resume.md" },
    }),
  ]);

  const embeddings = createNvidiaEmbeddings();
  const texts = docs.map((d) => d.pageContent);
  const vectors = await embeddings.embedDocuments(texts);

  const records: ResumeEmbeddingRecord[] = docs.map((d, i) => ({
    id: `resume-${i}`,
    text: d.pageContent,
    metadata: { ...(d.metadata as Record<string, unknown>), chunkIndex: i },
    embedding: vectors[i]!,
  }));

  await fs.writeFile(outPath, JSON.stringify(records, null, 2), "utf-8");
  const dim = vectors[0]?.length ?? 0;
  console.log(
    `Wrote ${records.length} chunks (${dim} dims) to ${path.relative(process.cwd(), outPath)}`,
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
