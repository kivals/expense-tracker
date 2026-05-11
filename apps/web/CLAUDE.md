# CLAUDE.md — apps/web

Инструкции для Claude Code по работе с фронтендом. Общие соглашения проекта — в корневом `CLAUDE.md`.

## Стек

- **Фреймворк:** Next.js 16 (App Router)
- **UI:** React 19, Tailwind CSS v4, shadcn/ui
- **Формы:** react-hook-form + zod
- **Язык:** TypeScript

## Команды

Запускать из **корня репозитория**.

```bash
bun run dev:web                              # запустить dev-сервер http://localhost:3000
bun --filter @expense-tracker/web typecheck  # проверка типов
```

## TypeScript-конфиг

Используется `packages/tsconfig/nextjs.json`: `module: ESNext`, `moduleResolution: bundler`. Несовместим с конфигом NestJS — никогда не смешивать.

---

## Архитектура: Feature Slice Design

`apps/web/src/` следует **Feature Slice Design** (FSD). Слои от высшего к низшему:

```
app/          → Next.js App Router — только тонкие page.tsx-оболочки
views/        → Полные страничные компоненты, составленные из features + widgets
              (называется views/, а не pages/ — конфликт с Next.js Pages Router)
features/     → Слайсы пользовательской функциональности
  <slice>/
    api/      → fetch-вызовы для этого слайса
    model/    → состояние, контексты, хуки, zod-схемы
    ui/       → компоненты, используемые только внутри этого слайса
widgets/      → Сложные переиспользуемые композиции (header-nav и т.д.)
entities/     → Компоненты и хуки бизнес-сущностей
shared/       → Сквозные утилиты
  api/        → Базовый fetch-клиент (client.ts) и auth-storage.ts
  ui/         → Все компоненты shadcn/ui
  lib/        → Утилиты (utils.ts с cn())
  hooks/      → Общие React-хуки
```

### Правила импортов

- Верхние слои могут импортировать из нижних; **нижние слои никогда не импортируют из верхних**.
- Страницы в `app/` импортируют **только** из `views/`. Напрямую импортировать features, widgets или shared в `app/` запрещено.
- `features/<slice>` может импортировать из `shared/` и `entities/`, но не из других features или widgets.
- `widgets/` может импортировать из `features/`, `entities/` и `shared/`.

### Добавление нового слайса

```
features/<name>/
  api/        → например, <name>-api.ts
  model/      → например, use-<name>.ts
  ui/         → например, <name>-form.tsx
```

Если фиче нужна полная страница — создать `views/<name>/ui/<name>-page.tsx` и подключить в `app/<name>/page.tsx`.

---

## Tailwind CSS v4

- Файла `tailwind.config.ts` нет — сканирование контента автоматическое.
- PostCSS-плагин: `@tailwindcss/postcss` (не `tailwindcss`).
- Точка входа: `src/app/globals.css` — использует `@import "tailwindcss"` (не директивы `@tailwind`).

## shadcn/ui

Добавлять компоненты командой:

```bash
bunx shadcn@latest add <component>
```

Компоненты попадают в `src/shared/ui/`. Алиасы в `components.json` указывают на `@/shared/ui` и `@/shared/lib/utils`.

---

## API-клиент

`src/shared/api/client.ts` — функция `apiRequest<T>(path, options)`:
- Автоматически добавляет заголовок `Authorization: Bearer <token>` из `localStorage` (через `auth-storage.ts`).
- При 401 выбрасывает `UnauthorizedError` (подкласс `ApiError`) и диспатчит `CustomEvent("auth:unauthorized")` — `AuthProvider` слушает это событие и сбрасывает состояние авторизации.
- При других не-2xx ответах выбрасывает `ApiError`.
- При статусе 204 возвращает `undefined`.

Хелперы для работы с токеном находятся в `src/shared/api/auth-storage.ts` (SSR-безопасны: проверяют `typeof window === "undefined"`).

## Авторизация

`AuthProvider` (`features/auth/model/auth-context.tsx`) восстанавливает сессию при монтировании через вызов `GET /auth/me`. В views и pages для защиты маршрутов использовать `useRequireAuth()` — он редиректит на `/login` при отсутствии токена.
