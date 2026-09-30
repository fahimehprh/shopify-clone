# Backend — CLAUDE.md

NestJS + Prisma API. Part of a pnpm workspace (see `../pnpm-workspace.yaml`); always install/add packages with `pnpm --filter backend ...` from the repo root, not plain `npm`/`yarn` inside `backend/`.

## Stack specifics that matter here

- **Prisma 7**, using the newer `prisma-client` generator (not the classic `@prisma/client` package). The client is generated into `generated/prisma/`, imported directly by path (see `src/prisma/prisma.service.ts`), not from `node_modules/@prisma/client`.
- The generator is configured with `moduleFormat = "cjs"` in `prisma/schema.prisma`. Do not remove this — the default is ESM (`import.meta.url`), which crashes at runtime because this project compiles to CommonJS. If `generated/prisma` is ever regenerated after removing that line, the app will fail at startup with `ReferenceError: exports is not defined`.
- Prisma 7 removed automatic `datasource.url` reading from `schema.prisma`. The connection URL lives in `prisma.config.ts` (used by the Prisma CLI) and is passed explicitly to `PrismaClient` via a driver adapter (`@prisma/adapter-pg` + `pg`) in `src/prisma/prisma.service.ts`.
- Nest does **not** load `.env` automatically. `src/main.ts` imports `dotenv/config` at the top for that reason — don't remove it, and don't assume `@nestjs/config` is in use (it isn't).

## Port — the API is on 3001, not 3000

`src/main.ts` listens on `process.env.PORT ?? 3000`, and `.env` sets `PORT=3001`.
Port 3000 is the Next.js frontend. Always use `http://localhost:3001` for the API:

```bash
curl http://localhost:3001/products
```

Sending an API request to port 3000 does not fail loudly — Next.js serves a page
for any path, so you get `HTTP 200` and an HTML document where you expected JSON.
If a request to a known-good endpoint returns HTML, or a `POST` returns `200`
instead of Nest's `201`, you're talking to the frontend, not the API.

## Structure

- `src/prisma/` — `PrismaModule` (global) + `PrismaService` (extends the generated `PrismaClient`, connects/disconnects on module lifecycle hooks).
- `src/products/` — `ProductsModule` / `ProductsController` / `ProductsService`, the reference pattern for feature modules here (controller → service → `PrismaService`).
- `src/users/`, `src/basket/` — same controller/service/`PrismaService` pattern, plus `class-validator`/`class-transformer` DTOs enforced by the global `ValidationPipe` in `src/main.ts`.
- `src/auth/` — `AuthModule` (JWT auth via `passport-jwt` + `passport-local`, `bcrypt` for password hashing):
  - `auth.controller.ts` — `POST /auth/login`, guarded by `AuthGuard('local')`.
  - `strategies/local.strategies.ts` — validates `userId` + `password` against `UsersService`.
  - `strategies/jwt.strategy.ts` — validates the bearer token; reads `JWT_SECRET` from `process.env` directly (no `ConfigService` — see below) and throws at construction if it's unset.
  - `config/jwt.config.ts` — a plain factory (`(): JwtModuleOptions => ({...})`) consumed directly, e.g. `JwtModule.register(jwtConfig())` in `auth.module.ts`. **Do not** reintroduce `@nestjs/config` (`registerAs`, `ConfigModule`) here — it isn't a dependency of this project and has been removed from this file twice already; it breaks the build immediately.
  - To protect a route elsewhere, add `@UseGuards(AuthGuard('jwt'))` and read the caller's id off `req.user.id` (set by `JwtStrategy.validate`) — never from a route param, to avoid one user reading/mutating another's data. `src/basket/basket.controller.ts` is the reference example.
- `prisma/schema.prisma` — models: `User`, `Product`, `Basket`, `BasketItem`. `Basket` belongs to `User`; `BasketItem` is the join model between `Basket` and `Product`.

## Local dev database

Whatever Postgres instance `DATABASE_URL` in `.env` points to must actually have the role/database it names — this was previously a mismatch (`.env` assumed a `postgres`/`postgres` role that didn't exist locally) and has been reconciled once already. If Prisma errors with `P1010` (access denied) or a query fails with "relation does not exist" for a table you know was migrated, suspect the app is connecting to the wrong database rather than a code bug — check `psql -l` against `DATABASE_URL`.

## Adding a new endpoint

Follow the `products` module as the template: a `*.module.ts`/`*.controller.ts`/`*.service.ts` triplet, inject `PrismaService` into the service, register the module in `app.module.ts`. No repository layer is set up — match existing simplicity unless the task calls for more. Use `class-validator`/`class-transformer` DTOs for request bodies (see `src/basket/dto/` or `src/users/dto/`) — the global `ValidationPipe` enforces them. If the endpoint should only be usable by the logged-in caller, guard it with `AuthGuard('jwt')` (see `src/auth/` above).
