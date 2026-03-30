"use client";

import { Message } from "ai";
import { cn } from "@/lib/utils";
import { User, Bot } from "lucide-react";
import { MarkdownRenderer } from "./MarkdownRenderer";
import { ToolCallBadge } from "./ToolCallBadge";

interface MessageListProps {
  messages: Message[];
  isLoading?: boolean;
}

export function MessageList({ messages, isLoading }: MessageListProps) {
  return (
    <div className="flex flex-col px-4 py-5 space-y-5">
      {messages.map((message) => (
        <div
          key={message.id || message.content}
          className={cn(
            "flex gap-3 animate-fade-in-up",
            message.role === "user" ? "justify-end" : "justify-start"
          )}
        >
          {message.role === "assistant" && (
            <div className="flex-shrink-0 mt-0.5">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-md shadow-indigo-500/20">
                <Bot className="h-3.5 w-3.5 text-white" />
              </div>
            </div>
          )}

          <div
            className={cn(
              "flex flex-col gap-1.5 max-w-[85%]",
              message.role === "user" ? "items-end" : "items-start"
            )}
          >
            <div
              className={cn(
                "rounded-2xl px-4 py-3 text-sm leading-relaxed",
                message.role === "user"
                  ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/20 rounded-br-sm"
                  : "bg-zinc-800 text-zinc-100 border border-white/[0.06] shadow-sm rounded-bl-sm"
              )}
            >
              {message.parts ? (
                <>
                  {message.parts.map((part, partIndex) => {
                    switch (part.type) {
                      case "text":
                        return message.role === "user" ? (
                          <span key={partIndex} className="whitespace-pre-wrap">
                            {part.text}
                          </span>
                        ) : (
                          <MarkdownRenderer
                            key={partIndex}
                            content={part.text}
                            className="prose-sm prose-invert"
                          />
                        );
                      case "reasoning":
                        return (
                          <div
                            key={partIndex}
                            className="mt-3 p-3 bg-zinc-900/60 rounded-lg border border-white/[0.06]"
                          >
                            <span className="text-xs font-medium text-zinc-500 block mb-1 uppercase tracking-wide">
                              Reasoning
                            </span>
                            <span className="text-xs text-zinc-400">
                              {part.reasoning}
                            </span>
                          </div>
                        );
                      case "tool-invocation":
                        return (
                          <ToolCallBadge
                            key={partIndex}
                            toolInvocation={part.toolInvocation}
                          />
                        );
                      case "source":
                        return (
                          <div
                            key={partIndex}
                            className="mt-2 text-xs text-zinc-600"
                          >
                            Source: {JSON.stringify(part.source)}
                          </div>
                        );
                      case "step-start":
                        return partIndex > 0 ? (
                          <hr
                            key={partIndex}
                            className="my-3 border-white/[0.06]"
                          />
                        ) : null;
                      default:
                        return null;
                    }
                  })}
                  {isLoading &&
                    message.role === "assistant" &&
                    messages.indexOf(message) === messages.length - 1 && (
                      <div className="flex items-center gap-1.5 mt-3">
                        <span className="typing-dot w-1.5 h-1.5 rounded-full bg-indigo-400 inline-block" />
                        <span className="typing-dot w-1.5 h-1.5 rounded-full bg-indigo-400 inline-block" />
                        <span className="typing-dot w-1.5 h-1.5 rounded-full bg-indigo-400 inline-block" />
                      </div>
                    )}
                </>
              ) : message.content ? (
                message.role === "user" ? (
                  <span className="whitespace-pre-wrap">{message.content}</span>
                ) : (
                  <MarkdownRenderer
                    content={message.content}
                    className="prose-sm prose-invert"
                  />
                )
              ) : isLoading &&
                message.role === "assistant" &&
                messages.indexOf(message) === messages.length - 1 ? (
                <div className="flex items-center gap-1.5">
                  <span className="typing-dot w-1.5 h-1.5 rounded-full bg-indigo-400 inline-block" />
                  <span className="typing-dot w-1.5 h-1.5 rounded-full bg-indigo-400 inline-block" />
                  <span className="typing-dot w-1.5 h-1.5 rounded-full bg-indigo-400 inline-block" />
                </div>
              ) : null}
            </div>
          </div>

          {message.role === "user" && (
            <div className="flex-shrink-0 mt-0.5">
              <div className="w-7 h-7 rounded-lg bg-zinc-700 border border-white/[0.08] flex items-center justify-center">
                <User className="h-3.5 w-3.5 text-zinc-300" />
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
