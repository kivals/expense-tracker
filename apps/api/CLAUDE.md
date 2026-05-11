# CLAUDE.md — apps/api

Backend instructions for Claude Code. See root `CLAUDE.md` for project-wide conventions.

## Stack

- **Framework:** NestJS 11
- **ORM:** Prisma 6
- **Database:** PostgreSQL 16
- **Language:** TypeScript
- **Pattern:** CQRS (via `@nestjs/cqrs`) for queries and commands

## Commands

Run from the **repo root** unless noted.

```bash
bun run dev:api                          # start dev server http://localhost:3001
bun --filter @expense-tracker/api typecheck

# Database — run from apps/api/
bun run prisma:migrate   # create migration and apply to DB
bun run prisma:generate  # regenerate @prisma/client after schema changes
bun run prisma:studio    # open Prisma Studio GUI
```

## TypeScript config

Uses `packages/tsconfig/nestjs.json`: `module: commonjs`, `emitDecoratorMetadata: true`. This is incompatible with the Next.js config — never mix them.

---

## Prisma

Schema: `apps/api/prisma/schema.prisma`.

After any schema change:
1. `bun run prisma:migrate` — creates a migration file and updates the DB.
2. `bun run prisma:generate` — regenerates `@prisma/client`.

`PrismaService` (`src/prisma/prisma.service.ts`) extends `PrismaClient` and is registered as a `@Global()` module — inject it anywhere in the API without re-importing `PrismaModule`.

---

## Module structure

Each domain module lives in `src/<module>/` and follows this layout:

```
<module>/
  dto/           → request DTOs (validation via class-validator + class-transformer)
  commands/      → CQRS commands + handlers (writes)
    handlers/
  queries/       → CQRS queries + handlers (reads)
    handlers/
  <module>.controller.ts
  <module>.service.ts    → thin orchestration layer, delegates to commandBus / queryBus
  <module>.module.ts
```

### CQRS conventions

- **Commands** handle writes (create, update, delete) — throw `HttpException` (or NestJS built-ins) on failure.
- **Queries** handle reads — always return typed response objects, never throw on empty results (return empty arrays / null).
- The service layer only calls `commandBus.execute()` / `queryBus.execute()` and forwards the result — no business logic in the service itself.

---

## Auth

- JWT strategy: `src/auth/strategies/jwt.strategy.ts` — validates the bearer token and populates `req.user` with `PublicUser`.
- Guard: `JwtAuthGuard` (`src/auth/guards/jwt-auth.guard.ts`) — apply with `@UseGuards(JwtAuthGuard)`.
- Current user: inject via `@CurrentUser()` decorator (`src/common/decorators/current-user.decorator.ts`).

Protected route example:

```ts
@UseGuards(JwtAuthGuard)
@Get('me')
me(@CurrentUser() user: PublicUser): PublicUser {
  return user;
}
```

---

## Validation

All DTOs use `class-validator` decorators. `ValidationPipe` is applied globally with `transform: true` (enables `@Type()` coercions from `class-transformer`).

Query params that must be numbers need `@Type(() => Number)` in addition to `@IsInt()` / `@IsNumber()`.

---

## Response types

Types that cross the API boundary (request payloads and response shapes) live in `packages/shared-types/src/index.ts`. Import them from `@expense-tracker/shared-types`.
