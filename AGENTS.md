<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# SalonBook frontend

Small Next.js 16 (App Router) app; code lives under `src/` (`app/`, `components/ui/`, `lib/`).

## Commands
- `npm run dev` — Turbopack dev server on localhost:3000
- `npm run lint` — ESLint 9 flat config (`eslint.config.mjs`); running it with no args lints the whole repo
- `npx tsc --noEmit` — typecheck; there is no `typecheck` script
- `npm run build` / `npm run start`
- No test framework is configured; don't invent test commands.

## Config quirks
- `next.config.ts` enables `cacheComponents`, `partialPrefetching`, and `reactCompiler` (React Compiler 1.0): async data fetching needs Suspense boundaries / `use cache` per Next 16 rules, and React Compiler auto-memoizes — don't add manual `useMemo`/`useCallback`/`React.memo` unless profiling shows a need.
- Tailwind CSS v4, CSS-first: theme tokens live in `src/app/globals.css`; there is no `tailwind.config` file. Compiled through `@tailwindcss/turbopack` via turbopack rules in `next.config.ts`.
- shadcn/ui uses the `base-nova` style backed by Base UI (`@base-ui/react`) — not Radix, so component APIs differ from older shadcn examples. UI primitives live in `src/components/ui`; add new ones with `npx shadcn add <component>` (aliases configured in `components.json`), don't hand-roll them.
- Path alias `@/*` → `./src/*` (tsconfig `paths`).
