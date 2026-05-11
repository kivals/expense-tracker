# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

For app-specific instructions see:
- `apps/web/CLAUDE.md` — frontend (Next.js, FSD, Tailwind)
- `apps/api/CLAUDE.md` — backend (NestJS, Prisma, PostgreSQL)

## Stack

- **Runtime / package manager:** Bun workspaces (no Turborepo/Nx)
- **Frontend (`apps/web`):** Next.js, React, Tailwind CSS v4, TypeScript
- **Backend (`apps/api`):** NestJS, Prisma, PostgreSQL, TypeScript
- **Shared packages:** `@expense-tracker/shared-types`, `@expense-tracker/eslint-config`, `@expense-tracker/tsconfig`

## Monorepo layout

```
apps/web   → Next.js frontend
apps/api   → NestJS backend
packages/
  shared-types   → TypeScript types shared between web and api
  tsconfig       → base.json / nextjs.json / nestjs.json presets
  eslint-config  → base.js / next.js / nest.js presets
```

## Commands

All commands run from the **repo root**.

```bash
bun install          # install all dependencies

bun run dev:web      # start frontend  http://localhost:3000
bun run dev:api      # start backend   http://localhost:3001

bun run db:up        # start postgres:16-alpine (docker-compose)
bun run db:down      # stop postgres

bun run build        # build all packages
```

## Environment setup

```bash
cp .env.example .env                       # POSTGRES_USER / POSTGRES_PASSWORD / POSTGRES_DB
cp apps/api/.env.example apps/api/.env     # DATABASE_URL / PORT
cp apps/web/.env.example apps/web/.env     # NEXT_PUBLIC_API_URL
```

`DATABASE_URL` in `apps/api/.env` must match the postgres credentials in the root `.env`.

## Shared types

`packages/shared-types` is consumed as raw TypeScript (no separate compile step). Both apps compile it themselves. Any type that crosses the API boundary belongs here.

## Git workflow

Проект использует **GitHub Flow**.

### Правила

- `main` — всегда стабильная, деплоябельная ветка. Прямые коммиты в `main` запрещены.
- Любая новая работа — в отдельной ветке, созданной от актуального `main`.
- Слияние в `main` — только через Pull Request (с ревью или self-merge).
- После мержа PR ветку удалять (`git branch -d <branch>`).

### Именование веток

```
feat/<short-description>
fix/<short-description>
chore/<short-description>
docs/<short-description>
refactor/<short-description>
```

`<short-description>` — kebab-case, на английском. Примеры: `feat/main-screen`, `fix/register-form-validation`.

---

## Git commits

Используй **Conventional Commits** (`<type>(<scope>): <description>`).

| Тип | Когда |
|-----|-------|
| `feat` | новая функциональность |
| `fix` | исправление бага |
| `refactor` | рефакторинг без изменения поведения |
| `chore` | зависимости, конфиги, CI |
| `docs` | только документация |
| `test` | тесты |
| `perf` | производительность |

**Scope** — имя пакета или модуля: `api`, `web`, `shared-types`, `auth`, `categories`, `transactions`, `prisma`.

**Правила:**
- Описание в нижнем регистре, без точки, на английском. Длина ≤ 72 символа.
- Breaking change: `feat(api)!: ...` + `BREAKING CHANGE:` в теле коммита.
- Один коммит — одна логическая единица изменений.

```
feat(api): add transaction module with CQRS handlers
fix(web): align checkbox label text in register form
chore(prisma): add transaction model and migration
```

---

## Pull Requests

### Подготовка

Перед созданием PR всегда смотреть полный diff от `main`:

```bash
git diff main...HEAD --stat        # список затронутых файлов
git diff main...HEAD               # полный diff для описания
git log main..HEAD --oneline       # список коммитов в ветке
```

### Заголовок

Следует Conventional Commits: `<type>(<scope>): <description>`.

```
feat: add dashboard screen with transactions and pagination
feat(api): add GET /auth/me endpoint
fix(web): reset auth context on 401 mid-session
```

### Тело PR (структура)

```markdown
## Summary
- что реализовано (bullet points)

## API changes
- новые / изменённые endpoints (если есть)

## Test plan
- [ ] шаги для ручной проверки
```

### Правила

- Перед `gh pr create` убедиться, что ветка запушена: `git push -u origin <branch>`.
- После мержа PR — удалить ветку: `git branch -d <branch>`.
- Один PR — одна логическая единица: не смешивать несвязанные фичи.
