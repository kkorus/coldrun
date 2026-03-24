# Coldrun

NestJS API (CQRS) with MongoDB — **trucks** module (list, CRUD, truck status rules).

## HTTP API (base: `http://localhost:3000`)

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/trucks/ping` | Simple ping (`{ "message": "pong" }`) |
| `GET` | `/trucks` | Paginated list with filters: `skip`, `limit`, `status`, `codeContains`, `nameContains`, `sortField`, `sortOrder` |
| `GET` | `/trucks/:id` | Single truck by MongoDB ObjectId (24 hex characters) |
| `POST` | `/trucks` | Create (body: `code`, `name`, `status`, optional `description`) → `201` |
| `PATCH` | `/trucks/:id` | Partial update (`code`, `name`, `status`, `description`; empty `description` clears the field) |
| `DELETE` | `/trucks/:id` | Delete → `204` |

## Run

**Docker (recommended):** `cp .env.example .env` → `docker compose up` → API on port **3000**, Mongo on host **27017**.

**Local:** Mongo reachable at `MONGO_URI` in `.env`, then `npm install` → `npm run start:dev`.

## Environment

Copy `.env.example` to `.env`. Main variable: **`MONGO_URI`** (in Compose the DB host is `db`). Optional: **`PORT`**, **`CORS_ORIGIN`** (comma-separated origins; empty / `*` = permissive CORS).

## Scripts

`npm run start:dev` · `build` · `lint` · `test` (unit) · `test:e2e` (requires MongoDB, e.g. a dedicated `*_e2e` database)
