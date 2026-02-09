# Contributing to OpenFlama

Thank you for your interest in contributing to OpenFlama! This guide will help
you get set up and make your first contribution.

## Table of Contents

- [Quick Start](#quick-start)
- [Picking an Issue](#picking-an-issue)
- [Development Setup](#development-setup)
- [Coding Standards](#coding-standards)
- [Branch Naming & PR Process](#branch-naming--pr-process)
- [Database Workflow](#database-workflow)
- [Commit Messages](#commit-messages)
- [First-Time Contributors](#first-time-contributors)

## Quick Start

```bash
git clone https://github.com/maquenflow/openflama.git
cd openflama
cp .env.example .env          # edit with your DB credentials
npm install
npm run db:push               # apply schema to your database
npm run dev                   # start dev server on http://localhost:5000
```

For local Postgres via Docker, see [docs/local-db.md](docs/local-db.md).

## Picking an Issue

1. Browse [open issues](https://github.com/maquenflow/openflama/issues).
2. Look for labels: `good first issue`, `help wanted`, or `first-timers-only`.
3. **Comment on the issue** to claim it (e.g., "I'd like to work on this").
4. Wait for a maintainer to assign it to you before starting work.
5. If no one responds within 48 hours, feel free to start.

> **First time contributing to open source?** Check the
> [First-Time Contributors](#first-time-contributors) section below.

## Sanity Check

After setup, verify everything works:

```bash
npm run check                                    # TypeScript types pass
npm run dev                                      # Dev server starts
curl -s http://localhost:5000/api/v1/health       # Returns {"status":"ok",...}
```

If all three succeed, you're ready to contribute.

## Development Setup

### Prerequisites

- Node.js 20+
- PostgreSQL 15+ (local or via Docker)
- Python 3.10+ (only for `packages/core-py` and `agents/`)
- Git

### Install Dependencies

```bash
npm install
```

### Environment Variables

Copy the example file and fill in your values:

```bash
cp .env.example .env
```

Required variables:

| Variable | Description | Example |
|----------|-------------|---------|
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://openflama:openflama@localhost:5432/openflama` |
| `SESSION_SECRET` | Express session secret | Any random string |

### Running the Dev Server

```bash
npm run dev
```

This starts both the Express API and the Vite frontend on `http://localhost:5000`.

### Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Production build |
| `npm run check` | TypeScript type checking |
| `npm run db:push` | Push Drizzle schema to database |

## Coding Standards

### TypeScript (server, client, SDK)

- Use TypeScript strict mode.
- Prefer `const` over `let`; avoid `var`.
- Use explicit return types on exported functions.
- Follow existing patterns in the codebase.
- Run `npm run check` before committing to catch type errors.

### Python (core-py, agents)

- Follow PEP 8.
- Use type hints on all function signatures.
- Keep dependencies minimal.

### General

- No `console.log` in production code (use proper logging).
- No secrets or credentials in source files.
- Keep files focused; prefer small, composable modules.

## Branch Naming & PR Process

### Branch Naming

Use the format: `<type>/<short-description>`

| Type | When |
|------|------|
| `feat/` | New feature |
| `fix/` | Bug fix |
| `docs/` | Documentation only |
| `chore/` | Maintenance, refactoring, CI |
| `test/` | Adding or fixing tests |

Examples:
- `feat/arima-model`
- `fix/backtest-interval-calc`
- `docs/api-examples`

### PR Process

1. Fork the repository and clone your fork.
2. Create a branch from `main` using the naming convention above.
3. Make your changes in small, focused commits.
4. Run `npm run check` to verify types.
5. Push to your fork and open a Pull Request against `main`.
6. Fill in the PR template completely.
7. Wait for review; address feedback promptly.

### PR Requirements

- [ ] Types pass (`npm run check`)
- [ ] No unrelated changes included
- [ ] Documentation updated if needed
- [ ] PR description explains the "why" and "what"
- [ ] References the issue number (e.g., `Closes #42`)

## Database Workflow

OpenFlama uses [Drizzle ORM](https://orm.drizzle.team/) with PostgreSQL.

### Schema Location

All database schemas live in `shared/schema.ts`.

### Applying Schema Changes

After modifying `shared/schema.ts`, push the changes to your database:

```bash
npm run db:push
```

This uses `drizzle-kit push` to sync your schema without generating migration
files.

### Guidelines

- Always update the Zod insert schemas when changing table columns.
- Test schema changes locally before opening a PR.
- Document any new tables or significant column changes in your PR description.

## Commit Messages

Use [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>: <short description>

[optional body]
[optional footer]
```

Types: `feat`, `fix`, `docs`, `test`, `chore`, `refactor`, `style`, `perf`

Examples:
- `feat: add ARIMA model to forecasting engine`
- `fix: correct interval calculation in mean reversion`
- `docs: update API endpoint documentation`
- `test: add backtest validation tests`
- `chore: update CI to Node 20`

## First-Time Contributors

Never contributed to open source before? Welcome! Here's how to get started:

1. **Find an issue** labeled `good first issue` or `first-timers-only`.
2. **Comment** on the issue to claim it.
3. **Fork** the repo and clone your fork locally.
4. **Set up** your dev environment (see [Development Setup](#development-setup)).
5. **Create a branch**, make your changes, and commit.
6. **Open a PR** and link it to the issue.
7. **Respond to feedback** from reviewers.

Resources:
- [GitHub's guide to forking](https://docs.github.com/en/get-started/quickstart/fork-a-repo)
- [How to write a good PR](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/proposing-changes-to-your-work-with-pull-requests/creating-a-pull-request)

## Code of Conduct

Please read and follow our [Code of Conduct](CODE_OF_CONDUCT.md). We are
committed to providing a welcoming and inclusive experience for everyone.

## License

By contributing, you agree that your contributions will be licensed under the
[MIT License](LICENSE).
