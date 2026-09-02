# Backend — CLAUDE.md

NestJS + Prisma API. Part of a pnpm workspace (see `../pnpm-workspace.yaml`); always install/add packages with `pnpm --filter backend ...` from the repo root, not plain `npm`/`yarn` inside `backend/`.

## Stack specifics that matter here

- **Prisma 7**, using the newer `prisma-client` generator (not the classic `@prisma/client` package). The client is generated into `generated/prisma/`, imported directly by path (see `src/prisma/prisma.service.ts`), not from `node_modules/@prisma/client`.
- The generator is configured with `moduleFormat = "cjs"` in `prisma/schema.prisma`. Do not remove this — the default is ESM (`import.meta.url`), which crashes at runtime because this project compiles to CommonJS. If `generated/prisma` is ever regenerated after removing that line, the app will fail at startup with `ReferenceError: exports is not defined`.
- Prisma 7 removed automatic `datasource.url` reading from `schema.prisma`. The connection URL lives in `prisma.config.ts` (used by the Prisma CLI) and is passed explicitly to `PrismaClient` via a driver adapter (`@prisma/adapter-pg` + `pg`) in `src/prisma/prisma.service.ts`.
- Nest does **not** load `.env` automatically. `src/main.ts` imports `dotenv/config` at the top for that reason — don't remove it, and don't assume `@nestjs/config` is in use (it isn't).

## Structure

- `src/prisma/` — `PrismaModule` (global) + `PrismaService` (extends the generated `PrismaClient`, connects/disconnects on module lifecycle hooks).
- `src/products/` — `ProductsModule` / `ProductsController` / `ProductsService`, the reference pattern for feature modules here (controller → service → `PrismaService`).
- `prisma/schema.prisma` — models: `User`, `Product`, `Basket`, `BasketItem`. `Basket` belongs to `User`; `BasketItem` is the join model between `Basket` and `Product`.

## Local dev database

Whatever Postgres instance `DATABASE_URL` in `.env` points to must actually have the role/database it names — this was previously a mismatch (`.env` assumed a `postgres`/`postgres` role that didn't exist locally) and has been reconciled once already. If Prisma errors with `P1010` (access denied) or a query fails with "relation does not exist" for a table you know was migrated, suspect the app is connecting to the wrong database rather than a code bug — check `psql -l` against `DATABASE_URL`.

## Adding a new endpoint

Follow the `products` module as the template: a `*.module.ts`/`*.controller.ts`/`*.service.ts` triplet, inject `PrismaService` into the service, register the module in `app.module.ts`. No repository layer or DTO validation library is set up yet — match existing simplicity unless the task calls for more.
