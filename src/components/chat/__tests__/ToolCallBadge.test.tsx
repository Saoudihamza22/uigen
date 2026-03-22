import { test, expect, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import { ToolCallBadge, getFriendlyLabel, getFilename } from "../ToolCallBadge";

afterEach(() => {
  cleanup();
});

function makeInvocation(overrides: {
  toolName?: string;
  args?: Record<string, unknown>;
  state?: string;
  result?: unknown;
} = {}) {
  return {
    toolCallId: "test-id",
    toolName: "str_replace_editor",
    args: { command: "create", path: "src/App.jsx" } as Record<string, unknown>,
    state: "result",
    result: "Success",
    ...overrides,
  };
}

// --- getFilename ---

test("getFilename extracts the last segment of a path", () => {
  expect(getFilename("src/components/Button.tsx")).toBe("Button.tsx");
});

test("getFilename returns the value as-is when there is no slash", () => {
  expect(getFilename("App.jsx")).toBe("App.jsx");
});

test("getFilename returns the path when the last segment is empty", () => {
  expect(getFilename("")).toBe("");
});

// --- getFriendlyLabel: str_replace_editor ---

test("getFriendlyLabel returns 'Creating <file>' for create command", () => {
  expect(getFriendlyLabel("str_replace_editor", { command: "create", path: "src/App.jsx" })).toBe("Creating App.jsx");
});

test("getFriendlyLabel returns 'Editing <file>' for str_replace command", () => {
  expect(getFriendlyLabel("str_replace_editor", { command: "str_replace", path: "src/Button.tsx" })).toBe("Editing Button.tsx");
});

test("getFriendlyLabel returns 'Editing <file>' for insert command", () => {
  expect(getFriendlyLabel("str_replace_editor", { command: "insert", path: "src/index.ts" })).toBe("Editing index.ts");
});

test("getFriendlyLabel returns 'Reading <file>' for view command", () => {
  expect(getFriendlyLabel("str_replace_editor", { command: "view", path: "src/App.jsx" })).toBe("Reading App.jsx");
});

// --- getFriendlyLabel: file_manager ---

test("getFriendlyLabel returns 'Renaming <file> to <file>' for rename command", () => {
  expect(
    getFriendlyLabel("file_manager", { command: "rename", path: "src/Old.tsx", new_path: "src/New.tsx" })
  ).toBe("Renaming Old.tsx to New.tsx");
});

test("getFriendlyLabel returns 'Deleting <file>' for delete command", () => {
  expect(getFriendlyLabel("file_manager", { command: "delete", path: "src/Unused.tsx" })).toBe("Deleting Unused.tsx");
});

// --- getFriendlyLabel: unknown tool ---

test("getFriendlyLabel returns the tool name for an unknown tool", () => {
  expect(getFriendlyLabel("unknown_tool", { command: "foo", path: "src/App.jsx" })).toBe("unknown_tool");
});

// --- ToolCallBadge rendering ---

test("renders the friendly label for a create invocation", () => {
  render(<ToolCallBadge toolInvocation={makeInvocation({ args: { command: "create", path: "src/App.jsx" } })} />);
  expect(screen.getByText("Creating App.jsx")).toBeDefined();
});

test("renders the friendly label for an edit invocation", () => {
  render(
    <ToolCallBadge
      toolInvocation={makeInvocation({ args: { command: "str_replace", path: "src/components/Card.tsx" } })}
    />
  );
  expect(screen.getByText("Editing Card.tsx")).toBeDefined();
});

test("renders the friendly label for a rename invocation", () => {
  render(
    <ToolCallBadge
      toolInvocation={makeInvocation({
        toolName: "file_manager",
        args: { command: "rename", path: "src/Old.tsx", new_path: "src/New.tsx" },
      })}
    />
  );
  expect(screen.getByText("Renaming Old.tsx to New.tsx")).toBeDefined();
});

test("renders the friendly label for a delete invocation", () => {
  render(
    <ToolCallBadge
      toolInvocation={makeInvocation({
        toolName: "file_manager",
        args: { command: "delete", path: "src/Unused.tsx" },
      })}
    />
  );
  expect(screen.getByText("Deleting Unused.tsx")).toBeDefined();
});

test("shows green dot when invocation is complete", () => {
  const { container } = render(<ToolCallBadge toolInvocation={makeInvocation()} />);
  expect(container.querySelector(".bg-emerald-500")).toBeDefined();
  expect(container.querySelector(".animate-spin")).toBeNull();
});

test("shows spinner when invocation is pending", () => {
  const { container } = render(
    <ToolCallBadge toolInvocation={makeInvocation({ state: "call", result: undefined })} />
  );
  expect(container.querySelector(".animate-spin")).toBeDefined();
  expect(container.querySelector(".bg-emerald-500")).toBeNull();
});
