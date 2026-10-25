# taskflow-api — Project Memory
## 1. Snapshot
taskflow-api is the backend REST API for TaskFlow, an internal
task-and-project tracker. It exposes JSON endpoints under /v1 for
creating projects, tasks, and comments, and is consumed by the
TaskFlow web client. It is a stateless service; all data lives in
PostgreSQL and is accessed only through Prisma.
## 2. Stack (pinned)
- Runtime: Node.js 20.11 LTS, TypeScript 5.4
- Web: Express 4.19
- Data: PostgreSQL 16, Prisma 5.11
- Validation: Zod 3.22
- Tests: Jest 29 + supertest 6
- Lint/format: ESLint 8 + Prettier 3
- Package mgr: npm 10+ (do NOT use pnpm or yarn here)

## 3. Commands (verified)
- Install: npm install
- Run (dev): npm run dev # http://localhost:3000
- Build: npm run build # fails on any type error
- Test: npm test # all tests must pass before commit
- Test (watch): npm run test:watch
- Lint: npm run lint / npm run lint:fix
- Optional migrate: npx prisma migrate dev --name <change> # only with approved
PostgreSQL setup
- Optional regen client: npx prisma generate # after editing prisma/schema.prisma

## 4. Architecture map
- src/api/ HTTP layer: Express routers + thin controllers.
One folder per resource (tasks/, projects/, comments/).
Input is validated here with Zod. See docs/api.md.
- src/services/ Business logic. No req/res here — pure functions
that the controllers call. This is where features live.
- src/db/ Prisma client singleton + query helpers.
All database access goes through this module.
- src/middleware/ Auth, request logging, and the central error handler.
- src/lib/ Framework-free utilities (dates, ids, result types).
- prisma/ schema.prisma + migrations. Source of truth for data.
- tests/ Jest unit tests (services) + integration tests (api).
EXPECTED

## 5. Conventions
Naming
- Files: kebab-case (task-service.ts). Types/classes: PascalCase.
- Functions/vars: camelCase. DB columns: snake_case (Prisma @map).
Error handling
- Throw AppError(status, message); never return raw error strings.
- Let the central error middleware format the response. Never swallow
an error with an empty catch.
Testing
- Every new service function ships with a Jest unit test.
- Every new endpoint ships with a supertest integration test.
- Run npm test and npm run lint before every commit.
## 5a. Forbidden patterns (never do these)
1. No raw SQL string building — use Prisma’s typed, parameterized API.
2. No `any` in new code — type it, or use `unknown` + a Zod parse.
3. No business logic in src/api controllers — delegate to src/services.
4. No console.log in committed code — use the shared logger.
5. No secrets or connection strings in code — read from config/env.