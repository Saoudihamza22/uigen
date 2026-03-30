"use client";

import { useEffect, useRef, useState } from "react";
import { useFileSystem } from "@/lib/contexts/file-system-context";
import {
  createImportMap,
  createPreviewHTML,
} from "@/lib/transform/jsx-transformer";
import { AlertCircle, Zap } from "lucide-react";

export function PreviewFrame() {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const { getAllFiles, refreshTrigger } = useFileSystem();
  const [error, setError] = useState<string | null>(null);
  const [entryPoint, setEntryPoint] = useState<string>("/App.jsx");
  const [isFirstLoad, setIsFirstLoad] = useState(true);

  useEffect(() => {
    const updatePreview = () => {
      try {
        const files = getAllFiles();

        if (files.size > 0 && error) {
          setError(null);
        }

        let foundEntryPoint = entryPoint;
        const possibleEntries = [
          "/App.jsx",
          "/App.tsx",
          "/index.jsx",
          "/index.tsx",
          "/src/App.jsx",
          "/src/App.tsx",
        ];

        if (!files.has(entryPoint)) {
          const found = possibleEntries.find((path) => files.has(path));
          if (found) {
            foundEntryPoint = found;
            setEntryPoint(found);
          } else if (files.size > 0) {
            const firstJSX = Array.from(files.keys()).find(
              (path) => path.endsWith(".jsx") || path.endsWith(".tsx")
            );
            if (firstJSX) {
              foundEntryPoint = firstJSX;
              setEntryPoint(firstJSX);
            }
          }
        }

        if (files.size === 0) {
          if (isFirstLoad) {
            setError("firstLoad");
          } else {
            setError("No files to preview");
          }
          return;
        }

        if (isFirstLoad) {
          setIsFirstLoad(false);
        }

        if (!foundEntryPoint || !files.has(foundEntryPoint)) {
          setError(
            "No React component found. Create an App.jsx or index.jsx file to get started."
          );
          return;
        }

        const { importMap, styles, errors } = createImportMap(files);
        const previewHTML = createPreviewHTML(foundEntryPoint, importMap, styles, errors);

        if (iframeRef.current) {
          const iframe = iframeRef.current;
          iframe.setAttribute(
            "sandbox",
            "allow-scripts allow-same-origin allow-forms"
          );
          iframe.srcdoc = previewHTML;
          setError(null);
        }
      } catch (err) {
        console.error("Preview error:", err);
        setError(err instanceof Error ? err.message : "Unknown preview error");
      }
    };

    updatePreview();
  }, [refreshTrigger, getAllFiles, entryPoint, error, isFirstLoad]);

  if (error) {
    if (error === "firstLoad") {
      return (
        <div className="h-full flex items-center justify-center bg-zinc-950 relative overflow-hidden">
          {/* Dot grid background */}
          <div className="absolute inset-0 dot-grid-bg opacity-40" />
          {/* Radial gradient vignette */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_transparent_30%,_#09090b_80%)]" />

          <div className="relative text-center max-w-sm animate-fade-in-up">
            {/* Glowing icon */}
            <div className="relative inline-flex mb-6">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-2xl shadow-indigo-500/40">
                <Zap className="h-8 w-8 text-white" />
              </div>
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 blur-2xl opacity-40 animate-glow-pulse" />
            </div>

            <h3 className="text-lg font-semibold text-white mb-2 tracking-tight">
              Your canvas awaits
            </h3>
            <p className="text-zinc-500 text-sm leading-relaxed">
              Describe a component in the chat and it will render here instantly — no setup, no files.
            </p>

            {/* Feature pills */}
            <div className="flex items-center justify-center gap-2 mt-6 flex-wrap">
              {["Live Preview", "Tailwind CSS", "React 18"].map((f) => (
                <span
                  key={f}
                  className="text-[11px] font-medium px-2.5 py-1 rounded-full bg-zinc-800/80 border border-white/[0.06] text-zinc-400"
                >
                  {f}
                </span>
              ))}
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="h-full flex items-center justify-center bg-zinc-950 relative overflow-hidden">
        <div className="absolute inset-0 dot-grid-bg opacity-30" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_transparent_30%,_#09090b_80%)]" />

        <div className="relative text-center max-w-sm animate-fade-in-up">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-zinc-800 border border-white/[0.06] mb-5">
            <AlertCircle className="h-7 w-7 text-zinc-500" />
          </div>
          <h3 className="text-base font-semibold text-white mb-2">
            Preview unavailable
          </h3>
          <p className="text-sm text-zinc-500 leading-relaxed mb-1">{error}</p>
          <p className="text-xs text-zinc-600">
            Ask the AI to create a component to see it here.
          </p>
        </div>
      </div>
    );
  }

  return (
    <iframe
      ref={iframeRef}
      className="w-full h-full border-0 bg-white"
      title="Preview"
    />
  );
}
