/**
 * Toggle LangSmith tracing with LANGSMITH_ENABLED so you can keep API keys in .env
 * but turn traces off in production.
 *
 * When LANGSMITH_ENABLED=true:
 * - Set LANGSMITH_TRACING / LANGCHAIN_TRACING_V2 (LangChain reads both)
 * - Use LANGCHAIN_API_KEY or LANGSMITH_API_KEY (either is copied so LangChain sees a key)
 * - Optional: LANGCHAIN_PROJECT or LANGSMITH_PROJECT for the LangSmith project name
 * - Optional: LANGSMITH_WORKSPACE_ID if your key spans workspaces
 * - Optional: LANGCHAIN_CALLBACKS_BACKGROUND=true on dedicated Node servers to upload traces
 *   asynchronously (slightly lower latency); leave unset/false for Vercel-style lambdas so
 *   batches flush before the worker freezes.
 */

const TRUE = new Set(["1", "true", "yes", "on"]);

function isTruthyEnv(value: string | undefined): boolean {
  if (value == null || value === "") return false;
  return TRUE.has(value.trim().toLowerCase());
}

let warnedMissingKey = false;

export function syncLangSmithTracingFromEnv(): void {
  const enabled = isTruthyEnv(process.env.LANGSMITH_ENABLED);

  if (!enabled) {
    process.env.LANGSMITH_TRACING = "false";
    process.env.LANGCHAIN_TRACING_V2 = "false";
    return;
  }

  const apiKey =
    process.env.LANGCHAIN_API_KEY?.trim() ||
    process.env.LANGSMITH_API_KEY?.trim();
  if (!apiKey) {
    if (!warnedMissingKey) {
      warnedMissingKey = true;
      console.warn(
        "[LangSmith] LANGSMITH_ENABLED is true but neither LANGCHAIN_API_KEY nor LANGSMITH_API_KEY is set — tracing disabled.",
      );
    }
    process.env.LANGSMITH_TRACING = "false";
    process.env.LANGCHAIN_TRACING_V2 = "false";
    return;
  }

  process.env.LANGCHAIN_API_KEY = apiKey;
  process.env.LANGSMITH_API_KEY = apiKey;
  process.env.LANGSMITH_TRACING = "true";
  process.env.LANGCHAIN_TRACING_V2 = "true";

  const project =
    process.env.LANGCHAIN_PROJECT?.trim() ||
    process.env.LANGSMITH_PROJECT?.trim();
  if (project) {
    process.env.LANGCHAIN_PROJECT = project;
    process.env.LANGSMITH_PROJECT = project;
  }

  const workspaceId = process.env.LANGSMITH_WORKSPACE_ID?.trim();
  if (workspaceId) {
    process.env.LANGSMITH_WORKSPACE_ID = workspaceId;
  }

  const background =
    process.env.LANGCHAIN_CALLBACKS_BACKGROUND ??
    process.env.LANGSMITH_BACKGROUND_CALLBACKS;
  if (background !== undefined && background !== "") {
    process.env.LANGCHAIN_CALLBACKS_BACKGROUND = background.trim();
  }
}
