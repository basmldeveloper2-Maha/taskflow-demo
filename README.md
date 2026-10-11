# taskflow-api

A small task-management REST API. Projects contain tasks; tasks have comments.
This repo is the sample codebase for **Claude Code Hands-on 3 — Project Memory
with `CLAUDE.md`**.

## Stack

| Concern     | Choice                      |
| ----------- | --------------------------- |
| Runtime     | Node 20.11 LTS              |
| Language    | TypeScript 5.4 (strict)     |
| HTTP        | Express 4.19                |
| Database    | PostgreSQL 16 + Prisma 5.11 |
| Validation  | Zod 3.22                    |
| Testing     | Jest 29 + supertest 6       |
| Lint/format | ESLint 8 + Prettier 3       |
| Package mgr | pnpm 8                      |

## Getting started

```bash
git clone https://github.com/your-org/taskflow-api.git
cd taskflow-api
pnpm install
cp .env.example .env
docker compose up -d db
pnpm prisma migrate dev
pnpm prisma generate
pnpm dev
```

The API listens on `http://localhost:3000`. Health check: `GET /v1/health`.

> `your-org` in the clone URL is a placeholder — replace it with wherever you
> host this repo.

## Commands

| Command           | What it does                               |
| ----------------- | ------------------------------------------ |
| `pnpm dev`        | Start with hot reload (nodemon) on `:3000` |
| `pnpm build`      | Type-check and emit `dist/` via `tsc`      |
| `pnpm start`      | Run the compiled server from `dist/`       |
| `pnpm test`       | Run the Jest + supertest suite             |
| `pnpm test:watch` | Run tests in watch mode                    |
| `pnpm lint`       | Lint with ESLint                           |
| `pnpm lint:fix`   | Lint and auto-fix                          |

Prisma: `pnpm prisma migrate dev` applies/creates migrations, `pnpm prisma
generate` regenerates the typed client.

> **Tests run without a database.** The suite mocks the Prisma repo layer, so
> `pnpm test` passes without Postgres running. You still need
> `pnpm prisma generate` once so the `@prisma/client` types exist.

## Project structure

```
src/
  api/          Express routers + thin controllers (one folder per resource)
    tasks/      tasks.router.ts, tasks.controller.ts, tasks.schema.ts, tasks.dto.ts
    projects/
    comments/
    router.ts   mounts resource routers under /v1
  services/     business logic — pure functions, no req/res
  db/           Prisma client singleton + typed query helpers (all DB access)
  middleware/   auth, request logging, central error handler
  lib/          framework-free utilities (AppError, logger, dates, ids, result)
prisma/         schema.prisma + migrations
tests/          unit tests (services) + integration tests (api, supertest)
docs/api.md     endpoint reference
```

See [`docs/api.md`](docs/api.md) for the endpoint reference.

## Conventions

- Errors: throw `AppError(status, message)`; the central error middleware maps
  it to a response. Never send errors ad hoc.
- Logging: use the shared `logger` from `src/lib/logger.ts`. No `console.log`.
- Database: Prisma typed API only — no raw SQL. All access lives in `src/db/`.
- Responses: map Prisma models through a DTO in the controller. Never leak raw
  models.
- Routes are versioned under `/v1`.
- Naming: kebab-case files, PascalCase types, camelCase functions, snake_case DB
  columns (via Prisma `@map`).
