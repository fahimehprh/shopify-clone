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
JWT_EXPIRES_IN=86400
PORT=3001
```

Apply migrations and generate the Prisma client:

```bash
cd backend
npx prisma migrate dev
npx prisma generate
```

Seed the database with sample products:

```bash
npx prisma db seed
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

Validation across all endpoints below is handled by a global `ValidationPipe`
(see `src/main.ts`) with `whitelist` + `forbidNonWhitelisted`, so unknown
properties are rejected with a `400` rather than silently ignored.

### Products

- `GET /products` — list all products
- `POST /products` — create a product

  ```jsonc
  // request body
  {
    "name": "Wool Sweater", // required, non-empty after trimming, max 255 chars
    "stock": 15             // optional integer >= 0, defaults to 0
  }
  ```

### Users

- `GET /users` — list all users (password omitted)
- `GET /users/:id` — look up one user by id (password omitted)
- `POST /users` — create a user

  ```jsonc
  // request body
  { "name": "Jane Doe", "password": "at-least-something" } // both required, max 255 chars
  ```

### Auth

- `POST /auth/login` — exchange `userId` + `password` for a JWT

  ```jsonc
  // request body
  { "userId": "<user id>", "password": "..." }
  ```

  Returns the user (password omitted) plus a `token`. Send it on protected
  routes as `Authorization: Bearer <token>`.

### Basket

All basket routes require a valid JWT and always act on the authenticated
user (from the token), never a caller-supplied id.

- `GET /basket` — get (or create) the caller's pending basket, with items
- `POST /basket/add-item` — add a product to the basket

  ```jsonc
  { "productId": "<product id>", "quantity": 1 } // quantity: integer >= 1
  ```

- `POST /basket/update-item` — set a basket item's quantity

  ```jsonc
  { "productId": "<product id>", "quantity": 2 } // quantity: integer >= 1
  ```

- `POST /basket/remove-item` — remove a product from the basket

  ```jsonc
  { "productId": "<product id>" }
  ```

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
- Seed data lives in `prisma/seed.ts` (run via `npx prisma db seed`, configured in `prisma.config.ts` to use `tsx`). It's idempotent — re-running it updates stock on existing products by name instead of duplicating them.
