# CLAUDE.md

Инструкции для Claude Code по работе с этим репозиторием.

Инструкции для конкретных приложений:
- `apps/web/CLAUDE.md` — фронтенд (Next.js, FSD, Tailwind)
- `apps/api/CLAUDE.md` — бэкенд (NestJS, Prisma, PostgreSQL)

## Стек

- **Runtime / пакетный менеджер:** Bun workspaces (без Turborepo/Nx)
- **Фронтенд (`apps/web`):** Next.js, React, Tailwind CSS v4, TypeScript
- **Бэкенд (`apps/api`):** NestJS, Prisma, PostgreSQL, TypeScript
- **Общие пакеты:** `@expense-tracker/shared-types`, `@expense-tracker/eslint-config`, `@expense-tracker/tsconfig`

## Структура монорепо

```
apps/web   → Next.js фронтенд
apps/api   → NestJS бэкенд
packages/
  shared-types   → TypeScript-типы, общие для web и api
  tsconfig       → пресеты base.json / nextjs.json / nestjs.json
  eslint-config  → пресеты base.js / next.js / nest.js
```

## Команды

Все команды запускаются из **корня репозитория**.

```bash
bun install          # установить зависимости

bun run dev:web      # запустить фронтенд  http://localhost:3000
bun run dev:api      # запустить бэкенд    http://localhost:3001

bun run db:up        # запустить postgres:16-alpine (docker-compose)
bun run db:down      # остановить postgres

bun run build        # собрать все пакеты
```

## Настройка окружения

```bash
cp .env.example .env                       # POSTGRES_USER / POSTGRES_PASSWORD / POSTGRES_DB
cp apps/api/.env.example apps/api/.env     # DATABASE_URL / PORT
cp apps/web/.env.example apps/web/.env     # NEXT_PUBLIC_API_URL
```

`DATABASE_URL` в `apps/api/.env` должен совпадать с учётными данными postgres из корневого `.env`.

## Общие типы

`packages/shared-types` используется как сырой TypeScript — отдельного шага компиляции нет, оба приложения компилируют его самостоятельно. Любой тип, пересекающий границу API, должен быть здесь.

---

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

## Git-коммиты

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
- Описание в нижнем регистре, без точки, на английском. Длина заголовка ≤ 72 символа.
- Breaking change: `feat(api)!: ...` + строка `BREAKING CHANGE:` в теле коммита.
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

### Тело PR

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
