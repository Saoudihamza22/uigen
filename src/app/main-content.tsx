"use client";

import { useState } from "react";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { FileSystemProvider } from "@/lib/contexts/file-system-context";
import { ChatProvider } from "@/lib/contexts/chat-context";
import { ChatInterface } from "@/components/chat/ChatInterface";
import { FileTree } from "@/components/editor/FileTree";
import { CodeEditor } from "@/components/editor/CodeEditor";
import { PreviewFrame } from "@/components/preview/PreviewFrame";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { HeaderActions } from "@/components/HeaderActions";
import { Sparkles } from "lucide-react";

interface MainContentProps {
  user?: {
    id: string;
    email: string;
  } | null;
  project?: {
    id: string;
    name: string;
    messages: any[];
    data: any;
    createdAt: Date;
    updatedAt: Date;
  };
}

export function MainContent({ user, project }: MainContentProps) {
  const [activeView, setActiveView] = useState<"preview" | "code">("preview");

  return (
    <FileSystemProvider initialData={project?.data}>
      <ChatProvider projectId={project?.id} initialMessages={project?.messages}>
        <div className="h-screen w-screen overflow-hidden bg-zinc-950">
          <ResizablePanelGroup direction="horizontal" className="h-full">
            {/* Left Panel — Chat */}
            <ResizablePanel defaultSize={35} minSize={25} maxSize={50}>
              <div className="h-full flex flex-col bg-zinc-900 border-r border-white/[0.06]">
                {/* Chat Header */}
                <div className="h-14 flex items-center px-5 border-b border-white/[0.06] shrink-0">
                  <div className="flex items-center gap-2.5">
                    <div className="relative flex items-center justify-center w-7 h-7 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 shadow-lg shadow-indigo-500/30">
                      <Sparkles className="h-3.5 w-3.5 text-white" />
                    </div>
                    <span className="text-sm font-semibold text-white tracking-tight">UIGen</span>
                    <span className="text-xs text-zinc-500">don't click here</span>
                    <span className="text-xs text-zinc-500">don't test this</span>
                    <span className="ml-0.5 text-[10px] font-medium px-1.5 py-0.5 rounded-full bg-indigo-500/15 text-indigo-400 border border-indigo-500/20 tracking-wide uppercase">
                      Beta
                    </span>
                  </div>
                </div>

                {/* Chat Content */}
                <div className="flex-1 overflow-hidden">
                  <ChatInterface />
                </div>
              </div>
            </ResizablePanel>

            <ResizableHandle className="w-px bg-white/[0.06] hover:bg-indigo-500/30 transition-colors duration-200 cursor-col-resize" />

            {/* Right Panel — Preview/Code */}
            <ResizablePanel defaultSize={65}>
              <div className="h-full flex flex-col bg-zinc-950">
                {/* Top Bar */}
                <div className="h-14 border-b border-white/[0.06] px-5 flex items-center justify-between bg-zinc-900/40 backdrop-blur-sm shrink-0">
                  <Tabs
                    value={activeView}
                    onValueChange={(v) =>
                      setActiveView(v as "preview" | "code")
                    }
                  >
                    <TabsList className="bg-zinc-800/70 border border-white/[0.06] p-0.5 h-8 gap-0.5 rounded-lg">
                      <TabsTrigger
                        value="preview"
                        className="h-7 px-4 text-xs font-medium rounded-md text-zinc-400 transition-all data-[state=active]:bg-zinc-700 data-[state=active]:text-white data-[state=active]:shadow-sm"
                      >
                        Preview
                      </TabsTrigger>
                      <TabsTrigger
                        value="code"
                        className="h-7 px-4 text-xs font-medium rounded-md text-zinc-400 transition-all data-[state=active]:bg-zinc-700 data-[state=active]:text-white data-[state=active]:shadow-sm"
                      >
                        Code
                      </TabsTrigger>
                    </TabsList>
                  </Tabs>
                  <HeaderActions user={user} projectId={project?.id} />
                </div>

                {/* Content Area */}
                <div className="flex-1 overflow-hidden">
                  {activeView === "preview" ? (
                    <div className="h-full">
                      <PreviewFrame />
                    </div>
                  ) : (
                    <ResizablePanelGroup
                      direction="horizontal"
                      className="h-full"
                    >
                      <ResizablePanel
                        defaultSize={30}
                        minSize={20}
                        maxSize={50}
                      >
                        <div className="h-full bg-zinc-900 border-r border-white/[0.06]">
                          <FileTree />
                        </div>
                      </ResizablePanel>

                      <ResizableHandle className="w-px bg-white/[0.06] hover:bg-indigo-500/30 transition-colors duration-200" />

                      <ResizablePanel defaultSize={70}>
                        <div className="h-full bg-zinc-950">
                          <CodeEditor />
                        </div>
                      </ResizablePanel>
                    </ResizablePanelGroup>
                  )}
                </div>
              </div>
            </ResizablePanel>
          </ResizablePanelGroup>
        </div>
      </ChatProvider>
    </FileSystemProvider>
  );
}
