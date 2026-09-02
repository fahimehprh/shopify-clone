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
pnpm dev:backend    # NestJS API, watch mode
pnpm dev:frontend   # Next.js app, dev mode
pnpm build          # builds both backend and frontend
```

See `backend/README.md` and `frontend/README.md` for package-specific details.
