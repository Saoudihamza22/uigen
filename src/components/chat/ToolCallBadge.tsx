"use client";

import { Loader2 } from "lucide-react";

interface ToolInvocation {
  toolName: string;
  toolCallId: string;
  args: Record<string, unknown>;
  state: string;
  result?: unknown;
}

interface ToolCallBadgeProps {
  toolInvocation: ToolInvocation;
}

function getFilename(path: string): string {
  return path.split("/").pop() || path;
}

function getFriendlyLabel(toolName: string, args: Record<string, unknown>): string {
  const path = typeof args.path === "string" ? args.path : "";
  const filename = getFilename(path);
  const command = args.command as string | undefined;

  if (toolName === "str_replace_editor") {
    switch (command) {
      case "create":
        return `Creating ${filename}`;
      case "str_replace":
      case "insert":
        return `Editing ${filename}`;
      case "view":
        return `Reading ${filename}`;
      default:
        return filename || toolName;
    }
  }

  if (toolName === "file_manager") {
    const newPath = typeof args.new_path === "string" ? args.new_path : "";
    const newFilename = getFilename(newPath);
    switch (command) {
      case "rename":
        return `Renaming ${filename} to ${newFilename}`;
      case "delete":
        return `Deleting ${filename}`;
      default:
        return filename || toolName;
    }
  }

  return toolName;
}

export function ToolCallBadge({ toolInvocation }: ToolCallBadgeProps) {
  const { toolName, args, state, result } = toolInvocation;
  const label = getFriendlyLabel(toolName, args);
  const isDone = state === "result" && result != null;

  return (
    <div className="inline-flex items-center gap-2 mt-2 px-3 py-1.5 bg-zinc-900/80 rounded-lg text-xs font-mono border border-white/[0.08]">
      {isDone ? (
        <>
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
          <span className="text-zinc-400">{label}</span>
        </>
      ) : (
        <>
          <Loader2 className="w-3 h-3 animate-spin text-indigo-400" />
          <span className="text-zinc-400">{label}</span>
        </>
      )}
    </div>
  );
}

export { getFriendlyLabel, getFilename };
