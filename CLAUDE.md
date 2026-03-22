# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev
npm run dev:daemon   # background; logs to logs.txt
npm run build
npm run start        # production server
npm run test
npx vitest run src/lib/__tests__/file-system.test.ts
npm run lint
npm run setup        # first-time: install + prisma generate + migrate
npm run db:reset     # destructive
```

All npm scripts require `node-compat.cjs` (via `NODE_OPTIONS='--require ./node-compat.cjs'`). This removes `globalThis.localStorage/sessionStorage` on the server to prevent false positives from Node 25+'s experimental Web Storage API breaking SSR guards.

## Environment variables

| Variable | Required | Notes |
|----------|----------|-------|
| `ANTHROPIC_API_KEY` | No | Falls back to `MockLanguageModel` if absent |
| `JWT_SECRET` | Production | Defaults to `"development-secret-key"` if unset |

## Architecture

UIGen is an AI-powered React component generator. Users describe components in natural language; Claude generates code that renders live in an iframe — no files are written to disk.

### Core data flow

1. **Chat → API → AI tools → Virtual FS → Preview**
   - User message → `ChatProvider` (Vercel AI SDK `useChat`) → `POST /api/chat`
   - `/api/chat/route.ts` calls Claude with two tools: `str_replace_editor` (create/edit files) and `file_manager` (rename/delete)
   - Tool calls are streamed back and handled by `FileSystemProvider.handleToolCall()`
   - `VirtualFileSystem` (in-memory class) is updated; React context triggers re-render
   - `PreviewFrame` detects FS changes, transforms files with Babel (standalone), builds an import map pointing to esm.sh, and sets `iframe.srcdoc`

2. **Persistence** (authenticated users only)
   - On chat `onFinish`, messages and the full serialized FS are saved to the `Project` row in SQLite via Prisma
   - `data` column = JSON of VFS state; `messages` column = JSON of chat history

### Key files

| File | Role |
|------|------|
| `src/app/api/chat/route.ts` | AI endpoint; tool execution loop |
| `src/lib/file-system.ts` | `VirtualFileSystem` class — all FS operations |
| `src/lib/transform/jsx-transformer.ts` | Babel JSX→JS + import map generation for preview |
| `src/lib/provider.ts` | Selects real Claude (`claude-haiku-4-5`) or `MockLanguageModel` |
| `src/lib/prompts/generation.tsx` | System prompt given to Claude |
| `src/lib/contexts/file-system-context.tsx` | React context wrapping VFS; exposes `handleToolCall` |
| `src/lib/contexts/chat-context.tsx` | Vercel AI SDK integration; wires chat to FS context |
| `src/app/main-content.tsx` | Top-level UI: resizable panels (Chat 35% | Preview/Code 65%) |
| `src/components/preview/PreviewFrame.tsx` | Iframe renderer; watches FS refresh trigger |
| `src/middleware.ts` | JWT verification for protected routes |
| `src/lib/auth.ts` | `jose`-based JWT session (httpOnly cookie, 7-day expiry) |

### MockLanguageModel

Defined in `src/lib/provider.ts`, implements `LanguageModelV1` from `@ai-sdk/provider`. Activated when `ANTHROPIC_API_KEY` is absent. Simulates a 4-step tool call progression (creates files with Tailwind-styled components), streaming character-by-character with 15–30 ms delays. `maxSteps` is 4 for mock, 40 for real Claude.

### Authentication

- Sign up/in via `AuthDialog` → server actions in `src/actions/index.ts`
- Passwords hashed with bcrypt; session stored as JWT in httpOnly cookie
- `getUser()` server action is the standard way to read the current user
- Unauthenticated users get a fully functional anonymous session; `src/lib/anon-work-tracker.ts` persists their work (messages + serialized VFS) to `sessionStorage` so it survives page reloads within the same session

### Database

SQLite via Prisma. Schema defined in `prisma/schema.prisma`. Two models:

- **User**: `id`, `email`, `password`, `projects[]`
- **Project**: `id`, `name`, `userId`, `messages` (JSON string), `data` (JSON string of VFS)

Generated client outputs to `src/generated/prisma/` (not the default location).

### Preview rendering

`PreviewFrame` uses Babel standalone in the browser to transform JSX. It:
1. Builds a native ES module import map (React/ReactDOM from esm.sh, third-party packages from esm.sh)
2. Generates blob URLs for each virtual file
3. Looks for entry point: `App.jsx` → `App.tsx` → `index.jsx` → `index.tsx`
4. Injects Tailwind CSS from CDN into the iframe document

### Testing

Vitest with jsdom, `@vitejs/plugin-react`, and `vite-tsconfig-paths` (so `@/` aliases resolve). Test files live in `__tests__/` directories co-located with the code they test. Key test areas: `VirtualFileSystem`, JSX transformer, chat context, and chat/editor components.
