# CLAUDE.md — apps/web

Frontend instructions for Claude Code. See root `CLAUDE.md` for project-wide conventions.

## Stack

- **Framework:** Next.js 16 (App Router)
- **UI:** React 19, Tailwind CSS v4, shadcn/ui
- **Forms:** react-hook-form + zod
- **Language:** TypeScript

## Commands

Run from the **repo root**.

```bash
bun run dev:web                          # start dev server http://localhost:3000
bun --filter @expense-tracker/web typecheck
```

## TypeScript config

Uses `packages/tsconfig/nextjs.json`: `module: ESNext`, `moduleResolution: bundler`. This is incompatible with NestJS config — never mix them.

---

## Architecture: Feature Slice Design

`apps/web/src/` follows **Feature Slice Design** (FSD). Layers from high to low:

```
app/          → Next.js App Router — thin page.tsx shells only
views/        → Full page components composed from features + widgets
              (named views/ to avoid conflict with Next.js pages/)
features/     → User-facing functionality slices
  <slice>/
    api/      → fetch calls for this feature
    model/    → state, context, hooks, zod schemas
    ui/       → components used only within this feature
widgets/      → Complex reusable compositions (header-nav, etc.)
entities/     → Business entity components/hooks
shared/       → Cross-cutting utilities
  api/        → Base fetch client (client.ts) and auth-storage.ts
  ui/         → All shadcn/ui components
  lib/        → Utils (utils.ts with cn())
  hooks/      → Shared React hooks
```

### Import rules

- Upper layers may import from lower layers; **lower layers must never import from upper**.
- `app/` pages import **only** from `views/`. Never import features, widgets, or shared directly in `app/`.
- `features/<slice>` may import from `shared/` and `entities/`, not from other features or widgets.
- `widgets/` may import from `features/`, `entities/`, and `shared/`.

### Adding a new feature slice

```
features/<name>/
  api/        → e.g. <name>-api.ts
  model/      → e.g. use-<name>.ts
  ui/         → e.g. <name>-form.tsx
```

If the feature needs a full page, create `views/<name>/ui/<name>-page.tsx` and wire it in `app/<name>/page.tsx`.

---

## Tailwind CSS v4

- No `tailwind.config.ts` — content scanning is automatic.
- PostCSS plugin: `@tailwindcss/postcss` (not `tailwindcss`).
- Entry point: `src/app/globals.css` — uses `@import "tailwindcss"` (not `@tailwind` directives).

## shadcn/ui

Add components via:

```bash
bunx shadcn@latest add <component>
```

Components land in `src/shared/ui/`. `components.json` aliases point to `@/shared/ui` and `@/shared/lib/utils`.

---

## API client

`src/shared/api/client.ts` — `apiRequest<T>(path, options)`:
- Automatically attaches `Authorization: Bearer <token>` from `localStorage` (via `auth-storage.ts`).
- Throws `UnauthorizedError` (subclass of `ApiError`) on 401 and dispatches `CustomEvent("auth:unauthorized")` — `AuthProvider` listens for this event and resets auth state.
- Throws `ApiError` on other non-2xx responses.
- Returns `undefined` on 204.

Token helpers live in `src/shared/api/auth-storage.ts` (SSR-safe: guards against `typeof window === "undefined"`).

## Auth

`AuthProvider` (`features/auth/model/auth-context.tsx`) bootstraps the session on mount by calling `GET /auth/me`. Use `useRequireAuth()` in views/pages to guard protected routes — it redirects to `/login` when there is no token.
