# Local Database Setup

This guide helps you set up a local PostgreSQL database for OpenFlama
development using Docker Compose.

## Prerequisites

- [Docker](https://docs.docker.com/get-docker/) and Docker Compose installed

## Quick Start

### 1. Start PostgreSQL

From the repository root:

```bash
docker compose up -d
```

This starts a PostgreSQL 15 instance with:

| Setting | Value |
|---------|-------|
| Host | `localhost` |
| Port | `5432` |
| User | `openflama` |
| Password | `openflama` |
| Database | `openflama` |

### 2. Configure Environment

Copy the example environment file and it will already have the correct
`DATABASE_URL` for the Docker setup:

```bash
cp .env.example .env
```

The default `DATABASE_URL` in `.env.example` matches the Docker Compose
configuration:

```
DATABASE_URL=postgresql://openflama:openflama@localhost:5432/openflama
```

### 3. Install Dependencies

```bash
npm install
```

### 4. Apply Database Schema

```bash
npm run db:push
```

This uses Drizzle Kit to push the schema defined in `shared/schema.ts` to your
local database.

### 5. Start the Dev Server

```bash
npm run dev
```

The app will be available at `http://localhost:5000`.

## Managing the Database

### Stop

```bash
docker compose down
```

### Stop and Remove Data

```bash
docker compose down -v
```

### View Logs

```bash
docker compose logs -f postgres
```

### Connect via psql

```bash
docker compose exec postgres psql -U openflama
```

## Troubleshooting

### Port 5432 Already in Use

If you have a local PostgreSQL running, either stop it or change the port
mapping in `docker-compose.yml`:

```yaml
ports:
  - "5433:5432"  # maps to localhost:5433
```

Then update your `DATABASE_URL` accordingly:

```
DATABASE_URL=postgresql://openflama:openflama@localhost:5433/openflama
```

### Permission Denied

Make sure Docker is running and your user has permission to use it. On Linux,
you may need to add your user to the `docker` group.
