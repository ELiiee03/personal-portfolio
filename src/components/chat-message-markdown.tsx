"use client";

import ReactMarkdown, { type Components } from "react-markdown";
import remarkGfm from "remark-gfm";
import { cn } from "@/lib/utils";

const markdownComponents: Components = {
  p: ({ children }) => <p className="mb-2 last:mb-0 [&:only-child]:mb-0">{children}</p>,
  ul: ({ children }) => (
    <ul className="my-2 list-disc space-y-1.5 pl-4">{children}</ul>
  ),
  ol: ({ children }) => (
    <ol className="my-2 list-decimal space-y-1.5 pl-4">{children}</ol>
  ),
  li: ({ children }) => <li className="leading-snug [&>p]:mb-0">{children}</li>,
  strong: ({ children }) => (
    <strong className="font-semibold text-foreground">{children}</strong>
  ),
  em: ({ children }) => <em className="italic">{children}</em>,
  a: ({ href, children }) => (
    <a
      href={href}
      className="text-accent underline underline-offset-2 hover:text-lc-highlight"
      target="_blank"
      rel="noopener noreferrer"
    >
      {children}
    </a>
  ),
  h1: ({ children }) => (
    <h4 className="mb-2 mt-3 first:mt-0 text-sm font-headline font-bold text-foreground">
      {children}
    </h4>
  ),
  h2: ({ children }) => (
    <h4 className="mb-2 mt-3 first:mt-0 text-sm font-headline font-bold text-foreground">
      {children}
    </h4>
  ),
  h3: ({ children }) => (
    <h4 className="mb-1.5 mt-2 first:mt-0 text-sm font-headline font-semibold text-foreground">
      {children}
    </h4>
  ),
  pre: ({ children }) => (
    <pre className="my-2 overflow-x-auto rounded-lg border border-lc-border bg-lc-surface p-2">
      {children}
    </pre>
  ),
  code: ({ className, children }) => {
    const isBlock = Boolean(className?.includes("language-"));
    if (isBlock) {
      return (
        <code
          className={cn(
            "block whitespace-pre-wrap font-code text-[11px] leading-relaxed text-foreground/95",
            className,
          )}
        >
          {children}
        </code>
      );
    }
    return (
      <code className="rounded border border-lc-border bg-lc-surface px-1 py-0.5 font-code text-[11px] text-foreground/95">
        {children}
      </code>
    );
  },
  hr: () => <hr className="my-3 border-lc-border" />,
  blockquote: ({ children }) => (
    <blockquote className="my-2 border-l-2 border-accent/40 pl-3 text-muted-foreground">
      {children}
    </blockquote>
  ),
};

export function ChatMessageMarkdown({ content }: { content: string }) {
  return (
    <div className="break-words">
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={markdownComponents}>
        {content}
      </ReactMarkdown>
    </div>
  );
}
