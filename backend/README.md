# Shopify Clone — Backend

NestJS API for the Shopify Clone project, using Prisma (with the `pg` driver adapter) against PostgreSQL.

## Prerequisites

- Node.js >= 20
- pnpm
- A running PostgreSQL instance

## Setup

```bash
# from the repo root
pnpm install
```

Create `backend/.env` (see `.env` for the current values):

```bash
DATABASE_URL="postgresql://user@localhost:5432/shopify_clone?schema=public"
JWT_SECRET="change-me-in-production"
JWT_EXPIRES_IN="1d"
PORT=3001
```

Apply migrations and generate the Prisma client:

```bash
cd backend
npx prisma migrate dev
npx prisma generate
```

## Running the app

```bash
# from the repo root
pnpm dev:backend

# or from backend/
pnpm start:dev   # watch mode
pnpm start       # no watch
pnpm start:prod  # runs dist/main after `pnpm build`
```

The server listens on `PORT` from `.env` (defaults to 3000 if unset). With the default `.env`, that's `http://localhost:3001`.

## Endpoints

- `GET /products` — list all products

## Tests

```bash
pnpm test       # unit tests
pnpm test:e2e   # e2e tests
pnpm test:cov   # coverage
```

## Prisma notes

- Schema: `prisma/schema.prisma`
- Client is generated to `generated/prisma` (not `node_modules/@prisma/client`) with `moduleFormat = "cjs"`, since this project compiles to CommonJS.
- After changing `schema.prisma`, run `npx prisma generate` (and `npx prisma migrate dev` if the change affects the database schema).
