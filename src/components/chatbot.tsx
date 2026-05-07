"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Send,
  X,
  Sparkles,
  Brain,
  ChevronDown,
  ChevronUp,
  Clock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { ChatMessageMarkdown } from "@/components/chat-message-markdown";

interface Message {
  role: "user" | "model";
  content: string;
  thoughts?: string;
  inferenceMs?: number;
  isStreaming?: boolean;
}

function formatMs(ms: number): string {
  return ms < 1000 ? `${ms}ms` : `${(ms / 1000).toFixed(1)}s`;
}

function TypingIndicator() {
  return (
    <div className="flex items-center gap-1.5 px-1 py-1">
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="h-2 w-2 rounded-full bg-accent animate-bounce"
          style={{ animationDelay: `${i * 160}ms`, animationDuration: "800ms" }}
        />
      ))}
    </div>
  );
}

function ThinkingPanel({
  thoughts,
  isStreaming,
}: {
  thoughts: string;
  isStreaming?: boolean;
}) {
  const lines = thoughts.split("\n").filter(Boolean);
  return (
    <div className={cn(
      "mb-2 overflow-hidden rounded-xl border-l-2 border border-accent/50 border-l-accent bg-accent/5 p-3",
      isStreaming && "shadow-[0_0_16px_0_hsl(var(--accent)/0.18)]",
    )}>
      <div className="mb-2.5 flex items-center gap-2">
        <Brain className={cn("h-3.5 w-3.5 text-accent", isStreaming && "animate-pulse")} />
        <span className="font-code text-[11px] font-bold uppercase tracking-widest text-accent">
          Thinking
        </span>
        {isStreaming && (
          <span className="ml-auto flex items-center gap-1 font-code text-[9px] text-accent animate-pulse">
            <span className="h-1.5 w-1.5 rounded-full bg-accent" />
            live
          </span>
        )}
      </div>
      <div className="space-y-1.5">
        {lines.map((line, i) => (
          <div
            key={i}
            className={cn(
              "flex items-start gap-2 font-code text-[11px] leading-relaxed",
              i === lines.length - 1 && isStreaming
                ? "text-accent"
                : "text-foreground/60",
            )}
          >
            <span className="mt-px select-none text-accent/60">›</span>
            <span>{line}</span>
            {i === lines.length - 1 && isStreaming && (
              <span className="ml-0.5 inline-block h-3 w-0.5 animate-pulse rounded-sm bg-accent align-middle" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

interface SseData {
  type: "thought_step" | "token" | "done" | "error";
  content?: string;
  inferenceMs?: number;
}

export function Chatbot({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [expandedThoughts, setExpandedThoughts] = useState<Set<number>>(
    new Set(),
  );
  const scrollRef = useRef<HTMLDivElement>(null);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([
        {
          role: "model",
          content:
            "Hi! I'm Ellie 👋 Elliee's personal AI assistant. Ask me about her work, skills, projects, or how to get in touch!",
        },
      ]);
    }
  }, [isOpen, messages.length]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const toggleThoughts = (idx: number) => {
    setExpandedThoughts((prev) => {
      const next = new Set(prev);
      if (next.has(idx)) next.delete(idx);
      else next.add(idx);
      return next;
    });
  };

  const updateLastModel = (updater: (prev: Message) => Message) => {
    setMessages((prev) => {
      const msgs = [...prev];
      const last = msgs[msgs.length - 1];
      if (!last || last.role !== "model") return prev;
      msgs[msgs.length - 1] = updater(last);
      return msgs;
    });
  };

  const handleSendMessage = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!inputValue.trim() || isLoading) return;

    const userMsg: Message = { role: "user", content: inputValue };
    const historyForApi = [...messages, userMsg];

    setMessages((prev) => [
      ...prev,
      userMsg,
      { role: "model", content: "", isStreaming: true },
    ]);
    setInputValue("");
    setIsLoading(true);

    const abort = new AbortController();
    abortRef.current = abort;

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: historyForApi.map((m) => ({
            role: m.role,
            content: m.content,
          })),
        }),
        signal: abort.signal,
      });

      if (!response.ok || !response.body) {
        throw new Error(`Server error: ${response.status}`);
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const parts = buffer.split("\n\n");
        buffer = parts.pop() ?? "";

        for (const part of parts) {
          for (const line of part.split("\n")) {
            if (!line.startsWith("data: ")) continue;
            try {
              const data = JSON.parse(line.slice(6)) as SseData;

              if (data.type === "token") {
                updateLastModel((m) => ({
                  ...m,
                  content: m.content + (data.content ?? ""),
                }));
              } else if (data.type === "thought_step") {
                updateLastModel((m) => ({
                  ...m,
                  thoughts: m.thoughts
                    ? `${m.thoughts}\n${data.content ?? ""}`
                    : (data.content ?? ""),
                }));
              } else if (data.type === "done") {
                updateLastModel((m) => ({
                  ...m,
                  isStreaming: false,
                  inferenceMs: data.inferenceMs,
                }));
              } else if (data.type === "error") {
                updateLastModel((m) => ({
                  ...m,
                  content:
                    data.content ??
                    "An error occurred. Please try again or reach out to Elliee directly.",
                  isStreaming: false,
                }));
              }
            } catch {
              // skip malformed SSE lines
            }
          }
        }
      }
    } catch (err) {
      if ((err as Error).name !== "AbortError") {
        updateLastModel((m) => ({
          ...m,
          content:
            "I encountered an error. Please try again or reach out to Elliee directly.",
          isStreaming: false,
        }));
      }
    } finally {
      setIsLoading(false);
      abortRef.current = null;
    }
  };

  const handleClose = () => {
    abortRef.current?.abort();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="chatbot-title"
    >
      <button
        type="button"
        className="absolute inset-0 bg-black/50 backdrop-blur-[2px]"
        aria-label="Close chat"
        onClick={handleClose}
      />
      <div
        className="relative z-[1] flex w-full max-w-xl flex-col overflow-hidden rounded-2xl border border-lc-border bg-lc-surface shadow-2xl animate-in zoom-in-95 fade-in duration-200 h-[min(85dvh,680px)] min-h-[min(520px,85dvh)]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="shrink-0 flex items-center justify-between border-b border-lc-border bg-lc-surface-2 p-4">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="flex h-10 w-10 items-center justify-center rounded-full border border-accent/20 bg-accent/10 text-accent">
                <Sparkles className="h-5 w-5" />
              </div>
              <div className="absolute bottom-0 right-0 h-3 w-3 animate-pulse rounded-full border-2 border-lc-surface-2 bg-accent" />
            </div>
            <div>
              <h3
                id="chatbot-title"
                className="font-headline text-sm font-bold text-foreground"
              >
                Ellie — AI Assistant
              </h3>
              <p className="font-code text-[9px] uppercase tracking-widest text-muted-foreground">
                // elliee&apos;s personal agent
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleClose}
            className="h-8 w-8 text-muted-foreground hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Messages */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto p-4">
          <div className="space-y-4">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={cn(
                  "flex w-full max-w-[88%]",
                  msg.role === "user"
                    ? "ml-auto justify-end"
                    : "justify-start",
                )}
              >
                {msg.role === "user" ? (
                  <div className="rounded-2xl rounded-tr-none border border-accent/20 bg-accent/10 p-3 text-sm font-body leading-relaxed text-foreground">
                    {msg.content}
                  </div>
                ) : (
                  <div className="flex w-full flex-col">
                    {/* Thinking panel — auto-visible while streaming, toggle after */}
                    {msg.thoughts && (msg.isStreaming || expandedThoughts.has(i)) && (
                      <ThinkingPanel thoughts={msg.thoughts} isStreaming={msg.isStreaming} />
                    )}

                    {/* Response bubble */}
                    <div className={cn(
                      "rounded-2xl rounded-tl-none border border-lc-border bg-lc-surface-2 p-3 text-sm font-body leading-relaxed text-foreground/90",
                      !msg.content && msg.isStreaming && "self-start",
                    )}>
                      {msg.content ? (
                        <>
                          <ChatMessageMarkdown content={msg.content} />
                          {msg.isStreaming && (
                            <span className="ml-0.5 inline-block h-3.5 w-0.5 animate-pulse rounded-sm bg-accent align-middle" />
                          )}
                        </>
                      ) : msg.isStreaming ? (
                        <TypingIndicator />
                      ) : null}
                    </div>

                    {/* Meta row: inference time + thinking toggle */}
                    {!msg.isStreaming && (msg.inferenceMs !== undefined || msg.thoughts) && (
                      <div className="mt-1.5 flex items-center gap-3 px-1">
                        {msg.inferenceMs !== undefined && (
                          <span className="flex items-center gap-1 font-code text-[10px] text-muted-foreground">
                            <Clock className="h-2.5 w-2.5" />
                            {formatMs(msg.inferenceMs)}
                          </span>
                        )}
                        {msg.thoughts && (
                          <button
                            type="button"
                            onClick={() => toggleThoughts(i)}
                            className="flex items-center gap-1 font-code text-[10px] text-accent/60 transition-colors hover:text-accent"
                          >
                            <Brain className="h-2.5 w-2.5" />
                            Thinking
                            {expandedThoughts.has(i) ? (
                              <ChevronUp className="h-2.5 w-2.5" />
                            ) : (
                              <ChevronDown className="h-2.5 w-2.5" />
                            )}
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Input */}
        <form
          onSubmit={handleSendMessage}
          className="shrink-0 border-t border-lc-border bg-lc-surface-2 p-4"
        >
          <div className="relative">
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Ask about Elliee's work, skills, or projects…"
              disabled={isLoading}
              className="h-11 rounded-xl border-lc-border bg-lc-surface pr-12 text-sm focus:border-accent"
            />
            <Button
              type="submit"
              disabled={!inputValue.trim() || isLoading}
              size="icon"
              className="absolute right-1 top-1 h-9 w-9 rounded-lg bg-accent transition-all hover:bg-lc-highlight"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
          <div className="mt-2 text-center">
            <span className="font-code text-[8px] uppercase tracking-widest text-muted-foreground">
              Ellie AI can make mistakes. Please double-check responses.
            </span>
          </div>
        </form>
      </div>
    </div>
  );
}
