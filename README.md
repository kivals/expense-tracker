# expense-tracker

Монорепозиторий трекера расходов.

## Стек

- **Монорепо:** Bun workspaces
- **Frontend:** Next.js (App Router) + Tailwind CSS — `apps/web`
- **Backend:** Nest.js — `apps/api`
- **БД:** PostgreSQL (через docker-compose) + Prisma ORM
- **Shared:** `packages/shared-types`, `packages/eslint-config`, `packages/tsconfig`

## Структура

```
apps/
  web/    # Next.js
  api/    # Nest.js + Prisma
packages/
  shared-types/
  eslint-config/
  tsconfig/
```

## Старт (после установки зависимостей)

```sh
cp .env.example .env
cp apps/api/.env.example apps/api/.env
cp apps/web/.env.example apps/web/.env

bun install
bun run db:up        # postgres в docker
bun run dev:api      # http://localhost:3001
bun run dev:web      # http://localhost:3000
```

> На этом шаге зависимости ещё не установлены — только структура проекта.
