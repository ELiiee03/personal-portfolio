/**
 * Runs once per Node server process before handling requests (see Next.js instrumentation).
 * Ensures LangSmith env flags are applied before LangChain / LangGraph modules initialize.
 */
export async function register() {
  if (process.env.NEXT_RUNTIME !== "nodejs") return;
  const { syncLangSmithTracingFromEnv } = await import("@/ai/langsmith-env");
  syncLangSmithTracingFromEnv();
}
