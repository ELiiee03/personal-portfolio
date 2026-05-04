# Personal Portfolio

A personal developer portfolio built with Next.js 15, featuring an AI-powered chatbot that answers questions about my resume using a RAG (Retrieval-Augmented Generation) pipeline.

## Tech Stack

- **Framework** — Next.js 15 (App Router, Turbopack)
- **AI / LLM** — LangChain, LangGraph, OpenAI, Genkit
- **UI** — Tailwind CSS, shadcn/ui, Framer Motion, Lucide
- **Language** — TypeScript

## Getting Started

1. **Install dependencies**

   ```bash
   npm install
   ```

2. **Set up environment variables**

   Copy `.env.example` to `.env` and fill in your API keys.

   ```bash
   cp .env.example .env
   ```

3. **Ingest resume for the chatbot RAG**

   ```bash
   npm run ingest:resume
   ```

4. **Run the development server**

   ```bash
   npm run dev
   ```

   Open [http://localhost:9002](http://localhost:9002) in your browser.

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start dev server on port 9002 |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run ingest:resume` | Re-generate resume embeddings for the chatbot |
| `npm run lint` | Run ESLint |
| `npm run typecheck` | Run TypeScript type check |
