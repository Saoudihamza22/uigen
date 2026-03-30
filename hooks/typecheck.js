#!/usr/bin/env node
// PostToolUse hook: runs tsc --noEmit after any TypeScript file edit.
// Exits 2 (feedback to Claude) when type errors exist so Claude fixes them.
import { execSync } from "child_process";

async function main() {
  const chunks = [];
  for await (const chunk of process.stdin) chunks.push(chunk);
  const input = JSON.parse(Buffer.concat(chunks).toString());

  const filePath =
    input.tool_input?.file_path || input.tool_input?.path || "";

  if (!filePath.match(/\.(ts|tsx)$/)) process.exit(0);

  try {
    execSync("npx tsc --noEmit --skipLibCheck", {
      encoding: "utf8",
      stdio: ["ignore", "pipe", "pipe"],
    });
  } catch (err) {
    const output = (err.stdout || "") + (err.stderr || "");
    console.error(
      "TypeScript type errors found — please fix before continuing:\n\n" +
        output
    );
    process.exit(2);
  }

  process.exit(0);
}

main();
