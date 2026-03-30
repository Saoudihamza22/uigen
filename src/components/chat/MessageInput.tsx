"use client";

import { ChangeEvent, FormEvent, KeyboardEvent } from "react";
import { ArrowUp, Loader2 } from "lucide-react";

interface MessageInputProps {
  input: string;
  handleInputChange: (e: ChangeEvent<HTMLTextAreaElement>) => void;
  handleSubmit: (e: FormEvent<HTMLFormElement>) => void;
  isLoading: boolean;
}

export function MessageInput({
  input,
  handleInputChange,
  handleSubmit,
  isLoading,
}: MessageInputProps) {
  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      const form = e.currentTarget.form;
      if (form) {
        form.requestSubmit();
      }
    }
  };

  const canSubmit = !isLoading && input.trim().length > 0;

  return (
    <form
      onSubmit={handleSubmit}
      className="p-4 border-t border-white/[0.06] bg-zinc-900/60"
    >
      <div className="relative">
        <textarea
          value={input}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          placeholder="Describe the component you want to create..."
          disabled={isLoading}
          rows={3}
          className="w-full min-h-[80px] max-h-[200px] pl-4 pr-14 py-3.5 rounded-xl border border-white/[0.08] bg-zinc-800/60 text-zinc-100 resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500/25 focus:border-indigo-500/40 transition-all placeholder:text-zinc-600 text-sm leading-relaxed disabled:opacity-50"
        />
        <button
          type="submit"
          disabled={!canSubmit}
          className={`absolute right-3 bottom-3 p-2 rounded-lg transition-all duration-150 ${
            canSubmit
              ? "bg-gradient-to-br from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white shadow-lg shadow-indigo-500/30 scale-100 hover:scale-105"
              : "bg-zinc-700/60 text-zinc-600 cursor-not-allowed"
          }`}
        >
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <ArrowUp className="h-4 w-4" />
          )}
        </button>
      </div>
      <div className="flex items-center justify-end mt-2 px-1">
        <span className="text-[10px] text-zinc-600">
          Press <kbd className="font-mono text-zinc-500">Enter</kbd> to send,{" "}
          <kbd className="font-mono text-zinc-500">Shift+Enter</kbd> for newline
        </span>
      </div>
    </form>
  );
}
