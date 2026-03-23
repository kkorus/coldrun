# NestJS MongoDB Application

Bootstrap NestJS application with MongoDB and Docker Compose.

## Prerequisites

- Docker and Docker Compose (`docker compose`)
- Node.js 24.x (if running locally)
- MongoDB reachable at `MONGO_URI` when running tests or the app outside Compose

## Getting Started

### Using Docker Compose (recommended)

1. Copy environment file: `cp .env.example .env`
2. Start the stack:

```bash
docker compose up
```

3. HTTP API: `http://localhost:3000` (e.g. `GET /trucks`)
4. MongoDB from the host: `mongodb://localhost:27017` (port published from the `db` service)

The app container skips `npm install` when `node_modules` already exists (faster restarts). First run may take longer while dependencies install.

### Running locally

1. Ensure MongoDB is running and `MONGO_URI` in `.env` points to it (e.g. `mongodb://localhost:27017/coldrun_db` for a local daemon).
2. `npm install`
3. `npm run start:dev`

## Available scripts

- `npm run start` — production-style `nest start`
- `npm run start:dev` — watch mode
- `npm run start:debug` — debug + watch
- `npm run build` — compile to `dist/`
- `npm run lint` — ESLint
- `npm run test` — unit tests (`*.spec.ts` under `src/`)
- `npm run test:e2e` — e2e tests (current suite imports the trucks feature only and does not require MongoDB; add full-app e2e against `AppModule` when you need DB integration)

## Environment variables

Copy `.env.example` to `.env` and adjust:

```bash
cp .env.example .env
```

`MONGO_URI` must match your runtime: under Docker Compose the hostname is the service name `db` (see `.env.example`).

## Project structure

```
├── src/
│   ├── trucks/
│   │   ├── trucks.controller.ts
│   │   └── trucks.module.ts
│   ├── app.module.ts
│   └── main.ts
├── test/
│   ├── app.e2e-spec.ts
│   └── jest-e2e.json
├── docker-compose.yml
├── package.json
└── ...
```

There is no root `AppController`; the sample route lives under the **trucks** feature module (`GET /trucks`).

## Docker commands

- Start: `docker compose up`
- Detached: `docker compose up -d`
- Stop: `docker compose down`
- Logs: `docker compose logs -f`
- Rebuild images: `docker compose build --no-cache` (if you add a `Dockerfile` later)
