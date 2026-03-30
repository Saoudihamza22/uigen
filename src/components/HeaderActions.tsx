"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Plus, LogOut, FolderOpen, ChevronDown } from "lucide-react";
import { AuthDialog } from "@/components/auth/AuthDialog";
import { signOut } from "@/actions";
import { getProjects } from "@/actions/get-projects";
import { createProject } from "@/actions/create-project";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";

interface HeaderActionsProps {
  user?: {
    id: string;
    email: string;
  } | null;
  projectId?: string;
}

interface Project {
  id: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

export function HeaderActions({ user, projectId }: HeaderActionsProps) {
  const router = useRouter();
  const [authDialogOpen, setAuthDialogOpen] = useState(false);
  const [authMode, setAuthMode] = useState<"signin" | "signup">("signin");
  const [projectsOpen, setProjectsOpen] = useState(false);
  const [projects, setProjects] = useState<Project[]>([]);
  const [initialLoading, setInitialLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (user && projectId) {
      getProjects()
        .then(setProjects)
        .catch(console.error)
        .finally(() => setInitialLoading(false));
    }
  }, [user, projectId]);

  useEffect(() => {
    if (user && projectsOpen) {
      getProjects().then(setProjects).catch(console.error);
    }
  }, [projectsOpen, user]);

  const filteredProjects = projects.filter((project) =>
    project.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const currentProject = projects.find((p) => p.id === projectId);

  const handleSignInClick = () => {
    setAuthMode("signin");
    setAuthDialogOpen(true);
  };

  const handleSignUpClick = () => {
    setAuthMode("signup");
    setAuthDialogOpen(true);
  };

  const handleSignOut = async () => {
    await signOut();
  };

  const handleNewDesign = async () => {
    const project = await createProject({
      name: `Design #${~~(Math.random() * 100000)}`,
      messages: [],
      data: {},
    });
    router.push(`/${project.id}`);
  };

  if (!user) {
    return (
      <>
        <div className="flex items-center gap-2">
          <button
            onClick={handleSignInClick}
            className="h-8 px-3.5 text-xs font-medium text-zinc-400 hover:text-white rounded-lg hover:bg-zinc-800 transition-all duration-150"
          >
            Sign In
          </button>
          <button
            onClick={handleSignUpClick}
            className="h-8 px-3.5 text-xs font-medium rounded-lg bg-gradient-to-br from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white shadow-md shadow-indigo-500/20 transition-all duration-150 hover:shadow-indigo-500/30 hover:scale-[1.02]"
          >
            Sign Up
          </button>
        </div>
        <AuthDialog
          open={authDialogOpen}
          onOpenChange={setAuthDialogOpen}
          defaultMode={authMode}
        />
      </>
    );
  }

  return (
    <div className="flex items-center gap-2">
      {!initialLoading && (
        <Popover open={projectsOpen} onOpenChange={setProjectsOpen}>
          <PopoverTrigger asChild>
            <button className="h-8 px-3 flex items-center gap-2 text-xs font-medium text-zinc-400 hover:text-white rounded-lg border border-white/[0.08] hover:border-white/[0.16] hover:bg-zinc-800/60 transition-all duration-150">
              <FolderOpen className="h-3.5 w-3.5" />
              <span>{currentProject ? currentProject.name : "Projects"}</span>
              <ChevronDown className="h-3 w-3 opacity-50" />
            </button>
          </PopoverTrigger>
          <PopoverContent
            className="w-[280px] p-0 bg-zinc-900 border border-white/[0.08] shadow-xl shadow-black/50 rounded-xl"
            align="end"
          >
            <Command className="bg-transparent">
              <CommandInput
                placeholder="Search projects..."
                value={searchQuery}
                onValueChange={setSearchQuery}
                className="text-zinc-300 placeholder:text-zinc-600 border-b border-white/[0.06]"
              />
              <CommandList>
                <CommandEmpty className="py-6 text-xs text-zinc-600 text-center">
                  No projects found.
                </CommandEmpty>
                <CommandGroup>
                  {filteredProjects.map((project) => (
                    <CommandItem
                      key={project.id}
                      value={project.name}
                      onSelect={() => {
                        router.push(`/${project.id}`);
                        setProjectsOpen(false);
                        setSearchQuery("");
                      }}
                      className="text-zinc-300 hover:text-white hover:bg-zinc-800 rounded-lg mx-1 my-0.5"
                    >
                      <span className="text-sm font-medium">{project.name}</span>
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      )}

      <button
        onClick={handleNewDesign}
        className="h-8 px-3.5 flex items-center gap-1.5 text-xs font-medium rounded-lg bg-gradient-to-br from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white shadow-md shadow-indigo-500/20 transition-all duration-150 hover:scale-[1.02]"
      >
        <Plus className="h-3.5 w-3.5" />
        New Design
      </button>

      <button
        onClick={handleSignOut}
        title="Sign out"
        className="h-8 w-8 flex items-center justify-center rounded-lg text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800 transition-all duration-150"
      >
        <LogOut className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}
