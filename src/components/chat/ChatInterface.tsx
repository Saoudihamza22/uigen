"use client";

import { useEffect, useRef } from "react";
import { MessageList } from "./MessageList";
import { MessageInput } from "./MessageInput";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useChat } from "@/lib/contexts/chat-context";
import { Sparkles, ArrowRight } from "lucide-react";

const EXAMPLE_PROMPTS = [
  "A pricing card with three tiers and a highlighted popular plan",
  "An animated login form with gradient background",
  "A dashboard stat card with trend indicator and sparkline",
];

function EmptyState({ setInput }: { setInput: (v: string) => void }) {
  return (
    <div className="flex flex-col items-center justify-center h-full px-6 text-center animate-fade-in-up">
      <div className="relative mb-5">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-2xl shadow-indigo-500/30">
          <Sparkles className="h-6 w-6 text-white" />
        </div>
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 blur-xl opacity-30 animate-glow-pulse" />
      </div>

      <h2 className="text-white font-semibold text-base mb-1.5 tracking-tight">
        What would you like to build?
      </h2>
      <p className="text-zinc-500 text-sm max-w-[220px] leading-relaxed mb-7">
        Describe a React component and watch it render live.
      </p>

      <div className="flex flex-col gap-2 w-full">
        {EXAMPLE_PROMPTS.map((prompt) => (
          <button
            key={prompt}
            onClick={() => setInput(prompt)}
            className="group text-left px-4 py-3 rounded-xl bg-zinc-800/50 border border-white/[0.06] text-zinc-400 text-xs leading-relaxed hover:bg-zinc-800 hover:border-indigo-500/30 hover:text-zinc-200 transition-all duration-150"
          >
            <span className="flex items-start gap-2.5">
              <ArrowRight className="h-3 w-3 mt-0.5 shrink-0 text-zinc-600 group-hover:text-indigo-400 transition-colors" />
              {prompt}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}

export function ChatInterface() {
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const { messages, input, handleInputChange, handleSubmit, status, setInput } = useChat();

  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector(
        "[data-radix-scroll-area-viewport]"
      );
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
      }
    }
  }, [messages]);

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {messages.length === 0 ? (
        <div className="flex-1 overflow-hidden">
          <EmptyState setInput={setInput} />
        </div>
      ) : (
        <ScrollArea ref={scrollAreaRef} className="flex-1 overflow-hidden">
          <MessageList messages={messages} isLoading={status === "streaming"} />
        </ScrollArea>
      )}
      <div className="flex-shrink-0">
        <MessageInput
          input={input}
          handleInputChange={handleInputChange}
          handleSubmit={handleSubmit}
          isLoading={status === "submitted" || status === "streaming"}
        />
      </div>
    </div>
  );
}
