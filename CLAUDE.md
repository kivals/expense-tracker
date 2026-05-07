# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Stack

- **Runtime / package manager:** Bun workspaces (no Turborepo/Nx)
- **Frontend (`apps/web`):** Next.js 16 (App Router), React 19, Tailwind CSS v4, TypeScript, shadcn/ui, react-hook-form, zod
- **Backend (`apps/api`):** Nest.js 11, Prisma 6, PostgreSQL, TypeScript
- **Shared packages:** `@expense-tracker/shared-types`, `@expense-tracker/eslint-config`, `@expense-tracker/tsconfig`

## Commands

All commands run from the **repo root** unless noted.

```bash
# Install dependencies
bun install

# Start dev servers
bun run dev:web          # http://localhost:3000
bun run dev:api          # http://localhost:3001

# Database (docker-compose)
bun run db:up            # start postgres:16-alpine
bun run db:down          # stop postgres

# Build all
bun run build

# From apps/api only
bun run prisma:generate  # regenerate Prisma client after schema changes
bun run prisma:migrate   # run migrations (dev)
bun run prisma:studio    # open Prisma Studio

# Typecheck (per package)
bun --filter @expense-tracker/web typecheck
bun --filter @expense-tracker/api typecheck
```

## Environment setup

```bash
cp .env.example .env                       # POSTGRES_USER / POSTGRES_PASSWORD / POSTGRES_DB
cp apps/api/.env.example apps/api/.env     # DATABASE_URL / PORT
cp apps/web/.env.example apps/web/.env     # NEXT_PUBLIC_API_URL
```

The `DATABASE_URL` in `apps/api/.env` must match the postgres credentials in the root `.env`.

## Architecture

### Monorepo layout

```
apps/web   → Next.js frontend
apps/api   → Nest.js backend
packages/
  shared-types   → TypeScript types shared between web and api
  tsconfig       → base.json / nextjs.json / nestjs.json presets
  eslint-config  → base.js / next.js / nest.js presets
```

### Shared types

`packages/shared-types` is consumed as raw TypeScript (no separate compile step). Both apps compile it themselves — this is why `apps/web/next.config.ts` has `transpilePackages: ["@expense-tracker/shared-types"]`. Any type that crosses the API boundary belongs here.

### Nest.js vs Next.js TypeScript config

The two apps require incompatible compiler settings. `nestjs.json` uses `module: commonjs` + `emitDecoratorMetadata: true`; `nextjs.json` uses `module: ESNext` + `moduleResolution: bundler`. Both extend `packages/tsconfig/base.json`.

### Prisma

Schema lives in `apps/api/prisma/schema.prisma`. After any schema change:
1. `bun run prisma:migrate` — creates migration and updates the DB
2. `bun run prisma:generate` — regenerates `@prisma/client`

`PrismaService` (`apps/api/src/prisma/prisma.service.ts`) extends `PrismaClient` and is registered as a `@Global()` module, so it can be injected anywhere in the API without re-importing `PrismaModule`.

### Frontend architecture (Feature Slice Design)

`apps/web/src/` follows Feature Slice Design with these layers (from high to low):

```
app/          → Next.js App Router (routing shell only — thin page.tsx files)
views/        → Full page components composed from features/widgets (NOT pages/ — conflicts with Next.js Pages Router)
features/     → User-facing functionality slices (e.g. features/auth)
  <slice>/
    api/      → API calls for this feature
    model/    → State, context, hooks, zod schemas
    ui/       → React components specific to this feature
widgets/      → Complex reusable compositions (not yet used)
entities/     → Business entity components/hooks (not yet used)
shared/       → Cross-cutting: API client, shadcn UI components, utils
  api/        → Base fetch client (client.ts)
  ui/         → shadcn/ui components (all shadcn components live here)
  lib/        → Utilities (utils.ts with cn())
  hooks/      → Shared React hooks
```

**Rules:**
- Upper layers can import from lower ones; lower layers must not import from upper.
- `app/` pages import only from `views/` layer, never directly from `features/`.
- shadcn components are added via `bunx shadcn@latest add <component>` and land in `src/shared/ui/`.
- `components.json` is configured with aliases pointing to `@/shared/ui` and `@/shared/lib/utils`.

## Git workflow

Проект использует **GitHub Flow**.

### Правила

- `main` — всегда стабильная, деплоябельная ветка. Прямые коммиты в `main` запрещены.
- Любая новая работа — в отдельной ветке, созданной от актуального `main`.
- Ветка живёт столько, сколько нужно для одной фичи / фикса. Мёртвые ветки удаляются после мержа.
- Слияние в `main` — только через Pull Request (с ревью или self-merge).
- После мержа PR ветку удалять (`git branch -d <branch>`).

### Именование веток

```
feat/<short-description>    # новая функциональность
fix/<short-description>     # исправление бага
chore/<short-description>   # зависимости, конфиги, CI
docs/<short-description>    # только документация
refactor/<short-description>
```

`<short-description>` — kebab-case, коротко, на английском. Примеры:

```
feat/main-screen
feat/transaction-filters
fix/register-form-validation
chore/update-dependencies
```

---

## Git commits

Используй **Conventional Commits** (`<type>(<scope>): <description>`).

### Типы

| Тип | Когда |
|-----|-------|
| `feat` | новая функциональность |
| `fix` | исправление бага |
| `refactor` | рефакторинг без изменения поведения |
| `chore` | обновление зависимостей, конфиги, CI |
| `docs` | только документация |
| `test` | добавление / правка тестов |
| `perf` | улучшение производительности |

### Scope (необязательно, но желательно)

Используй имя затронутого пакета или модуля: `api`, `web`, `shared-types`, `auth`, `categories`, `transactions`, `prisma`.

### Правила

- Описание — в **нижнем регистре**, без точки в конце, на **английском** языке.
- Длина заголовка ≤ 72 символа.
- Если изменение ломает обратную совместимость — добавь `!` после типа: `feat(api)!: ...` и опиши в теле коммита `BREAKING CHANGE: ...`.
- Один коммит — одна логическая единица изменений. Не смешивай `feat` и `fix` в одном коммите.

### Примеры

```
feat(api): add transaction module with CQRS handlers
fix(web): align checkbox label text in register form
chore(prisma): add transaction model and migration
refactor(shared-types): replace Expense with Transaction types
docs: add commit conventions to CLAUDE.md
```

### Tailwind CSS v4

- No `tailwind.config.ts` — content scanning is automatic in v4.
- PostCSS plugin is `@tailwindcss/postcss` (not `tailwindcss`).
- Entry point: `apps/web/src/app/globals.css` uses `@import "tailwindcss"` (not `@tailwind` directives).
