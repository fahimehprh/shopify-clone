# Shopify Clone

A pnpm monorepo with a NestJS/Prisma backend and a Next.js frontend.

## Structure

```
backend/    NestJS API (Prisma + PostgreSQL) — see backend/README.md
frontend/   Next.js app — see frontend/README.md
```

## Prerequisites

- Node.js >= 20
- pnpm
- A running PostgreSQL instance (for the backend)

## Setup

```bash
pnpm install
```

Then follow `backend/README.md` to configure `backend/.env` and run migrations.

## Running

```bash
pnpm dev:backend    # NestJS API, watch mode  → http://localhost:3001
pnpm dev:frontend   # Next.js app, dev mode   → http://localhost:3000
pnpm build          # builds both backend and frontend
```

The two run on different ports, and the API is **not** on 3000:

| Service | Port | Set by |
| --- | --- | --- |
| Next.js frontend | 3000 | Next.js default |
| NestJS API | 3001 | `PORT` in `backend/.env` (falls back to 3000 if unset) |

Because Next.js answers any path with a page, hitting an API route on port 3000
returns `200` and an HTML document instead of JSON — a confusing failure when
testing endpoints by hand. Point `curl` at 3001:

```bash
curl http://localhost:3001/products
```

See `backend/README.md` and `frontend/README.md` for package-specific details.
