# Relaydesk

A multi-tenant helpdesk. Teams create workspaces, log customer tickets, and reply to them from a shared queue.

## Stack

- `package/common`: shared schemas, types, route constants and service interfaces.
- `package/server`: Express API. Workspaces, members and tickets live in PostgreSQL; ticket conversations live in MongoDB.
- `package/frontend`: React, MUI and TanStack Query.

## Start locally

1. Copy `package/server/.env.example` to `package/server/.env`.
2. Run `npm install`.
3. Run `docker compose up -d postgres mongo` and then `npm run db:migrate`.
4. Run `npm run dev:server` and `npm run dev:frontend` in separate terminals.

The frontend runs on `http://localhost:5173` and the API on `http://localhost:5174`.
