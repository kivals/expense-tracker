# CLAUDE.md — apps/api

Инструкции для Claude Code по работе с бэкендом. Общие соглашения проекта — в корневом `CLAUDE.md`.

## Стек

- **Фреймворк:** NestJS 11
- **ORM:** Prisma 6
- **База данных:** PostgreSQL 16
- **Язык:** TypeScript
- **Паттерн:** CQRS (через `@nestjs/cqrs`) для запросов и команд

## Команды

Запускать из **корня репозитория**, если не указано иное.

```bash
bun run dev:api                              # запустить dev-сервер http://localhost:3001
bun --filter @expense-tracker/api typecheck  # проверка типов

# База данных — запускать из apps/api/
bun run prisma:migrate   # создать миграцию и применить к БД
bun run prisma:generate  # перегенерировать @prisma/client после изменений схемы
bun run prisma:studio    # открыть Prisma Studio
```

## TypeScript-конфиг

Используется `packages/tsconfig/nestjs.json`: `module: commonjs`, `emitDecoratorMetadata: true`. Несовместим с конфигом Next.js — никогда не смешивать.

---

## Prisma

Схема: `apps/api/prisma/schema.prisma`.

После любого изменения схемы:
1. `bun run prisma:migrate` — создаёт файл миграции и применяет изменения к БД.
2. `bun run prisma:generate` — перегенерирует `@prisma/client`.

`PrismaService` (`src/prisma/prisma.service.ts`) расширяет `PrismaClient` и зарегистрирован как `@Global()`-модуль — его можно инжектировать в любое место без повторного импорта `PrismaModule`.

---

## Структура модуля

Каждый доменный модуль находится в `src/<module>/` и следует такой структуре:

```
<module>/
  dto/           → DTO для запросов (валидация через class-validator + class-transformer)
  commands/      → CQRS-команды и хендлеры (запись)
    handlers/
  queries/       → CQRS-запросы и хендлеры (чтение)
    handlers/
  <module>.controller.ts
  <module>.service.ts    → тонкий слой оркестрации, делегирует в commandBus / queryBus
  <module>.module.ts
```

### Соглашения CQRS

- **Команды** обрабатывают запись (create, update, delete) — при ошибке выбрасывают `HttpException` или встроенные исключения NestJS.
- **Запросы** обрабатывают чтение — всегда возвращают типизированные объекты-ответы, при пустом результате не бросают исключений (возвращают пустые массивы / null).
- Сервисный слой только вызывает `commandBus.execute()` / `queryBus.execute()` и пробрасывает результат — никакой бизнес-логики в сервисе.

---

## Авторизация

- JWT-стратегия: `src/auth/strategies/jwt.strategy.ts` — валидирует bearer-токен и кладёт `PublicUser` в `req.user`.
- Гард: `JwtAuthGuard` (`src/auth/guards/jwt-auth.guard.ts`) — применять через `@UseGuards(JwtAuthGuard)`.
- Текущий пользователь: инжектировать через декоратор `@CurrentUser()` (`src/common/decorators/current-user.decorator.ts`).

Пример защищённого роута:

```ts
@UseGuards(JwtAuthGuard)
@Get('me')
me(@CurrentUser() user: PublicUser): PublicUser {
  return user;
}
```

---

## Валидация

Все DTO используют декораторы `class-validator`. `ValidationPipe` применяется глобально с `transform: true` (включает приведение типов через `class-transformer`).

Query-параметры, которые должны быть числами, требуют `@Type(() => Number)` вместе с `@IsInt()` / `@IsNumber()`.

---

## Типы ответов

Типы, пересекающие границу API (тела запросов и формы ответов), находятся в `packages/shared-types/src/index.ts`. Импортировать из `@expense-tracker/shared-types`.
