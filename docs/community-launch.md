# Community Launch Plan

This document contains the label plan, milestone, starter issues, and
promotion copy for the OpenFlama v0.1 community launch.

---

## 1. Label Plan

Create the following labels in the GitHub repository.

### Difficulty

| Label | Color | Description |
|-------|-------|-------------|
| `good first issue` | `#7057ff` | Good for newcomers |
| `help wanted` | `#008672` | Extra attention is needed |
| `first-timers-only` | `#e4e669` | Reserved for first-time contributors |
| `up-for-grabs` | `#bfdadc` | Open for anyone to pick up |

### Area

| Label | Color | Description |
|-------|-------|-------------|
| `area:api` | `#d4c5f9` | API server (Express routes, middleware) |
| `area:web` | `#f9d0c4` | Web dashboard (React frontend) |
| `area:sdk` | `#c5def5` | TypeScript SDK (sdk-ts) |
| `area:core-py` | `#bfd4f2` | Python core library |
| `area:db` | `#fef2c0` | Database schema, migrations, storage |
| `area:docs` | `#0e8a16` | Documentation |
| `area:ci` | `#e6e6e6` | CI/CD, GitHub Actions, build |
| `area:agents` | `#d93f0b` | Pluggable financial agents |

### Type

| Label | Color | Description |
|-------|-------|-------------|
| `type:bug` | `#d73a4a` | Something isn't working |
| `type:enhancement` | `#a2eeef` | New feature or improvement |
| `type:chore` | `#e6e6e6` | Maintenance, refactoring, tooling |
| `type:security` | `#b60205` | Security-related issue |

---

## 2. Milestone

### v0.1 Community Launch

**Description:** First community-ready release with contributor onboarding,
validated API, SDK improvements, and dashboard features.

**Target date:** 4-6 weeks from creation.

**Issues included:** See section 3 below (issues 1-12).

---

## 3. Issues (Copy/Paste Ready)

### Issue 1: Add .env.example and first-run sanity checklist

**Labels:** `good first issue`, `area:docs`, `type:chore`
**Difficulty:** 1-2 hours

**Context:**
New contributors need a clear `.env.example` file and a checklist to verify
their local setup works before diving into code.

**Acceptance Criteria:**
- [ ] `.env.example` exists at repo root with all required env vars documented
- [ ] README Quick Start references `cp .env.example .env`
- [ ] A "Sanity Check" section in CONTRIBUTING.md or README lists verification steps:
  - `npm run check` passes
  - `npm run dev` starts without errors
  - `curl localhost:5000/api/v1/health` returns `200`
- [ ] All values in `.env.example` have descriptive comments

---

### Issue 2: Docker Compose for Postgres and local-db docs

**Labels:** `good first issue`, `area:db`, `area:docs`, `type:chore`
**Difficulty:** 1-2 hours

**Context:**
Contributors without a local PostgreSQL installation should be able to
`docker compose up -d` and have a working database in seconds.

**Acceptance Criteria:**
- [ ] `docker-compose.yml` at repo root with Postgres 15+ and named volume
- [ ] `docs/local-db.md` with step-by-step setup instructions
- [ ] Database credentials in docker-compose match `.env.example` defaults
- [ ] README links to `docs/local-db.md`
- [ ] `docker compose down -v` cleanly removes everything

---

### Issue 3: GitHub issue templates and PR template

**Labels:** `good first issue`, `area:ci`, `type:chore`
**Difficulty:** 1-2 hours

**Context:**
Structured issue templates reduce friction for reporters and ensure we get
the information needed to reproduce bugs and evaluate features.

**Acceptance Criteria:**
- [ ] `.github/ISSUE_TEMPLATE/bug_report.yml` with structured fields
- [ ] `.github/ISSUE_TEMPLATE/feature_request.yml` with structured fields
- [ ] `.github/ISSUE_TEMPLATE/docs.yml` for documentation issues
- [ ] `.github/ISSUE_TEMPLATE/config.yml` with contact links
- [ ] `.github/PULL_REQUEST_TEMPLATE.md` with checklist and testing section
- [ ] Old `.md` templates removed (if any)

---

### Issue 4: Curate 6 "good first issues" pack

**Labels:** `help wanted`, `area:docs`, `type:chore`
**Difficulty:** 2-3 hours

**Context:**
Having a curated set of well-scoped, clearly described starter issues makes
the project approachable for new contributors.

**Acceptance Criteria:**
- [ ] 6 issues created with `good first issue` label
- [ ] Each issue has clear context, scope, and acceptance criteria
- [ ] Issues span different areas (API, web, docs, SDK, tests)
- [ ] No issue requires deep domain knowledge
- [ ] Each estimated at 1-3 hours of work

---

### Issue 5: Request validation for /predict and /backtest with consistent error shape

**Labels:** `help wanted`, `area:api`, `type:enhancement`
**Difficulty:** 3-4 hours

**Context:**
API endpoints should validate request bodies using Zod schemas and return
consistent error responses with a standard shape for all error types.

**Acceptance Criteria:**
- [ ] All POST endpoints validate request body with Zod before processing
- [ ] Invalid requests return `400` with shape: `{ error: string, details?: object }`
- [ ] Missing required fields return descriptive messages
- [ ] Unknown fields are stripped (not rejected)
- [ ] Existing valid requests continue to work unchanged
- [ ] Error shape documented in README API section

---

### Issue 6: OpenAPI spec and /docs Swagger UI

**Labels:** `help wanted`, `area:api`, `area:docs`, `type:enhancement`
**Difficulty:** 4-6 hours

**Context:**
An OpenAPI 3.0 spec with Swagger UI at `/api/docs` makes the API
self-documenting and easier to explore.

**Acceptance Criteria:**
- [ ] OpenAPI 3.0 spec covers all `/api/v1/` endpoints
- [ ] Request/response schemas match Zod definitions
- [ ] Swagger UI served at `/api/docs`
- [ ] Spec file committed as `docs/openapi.yaml` or generated from code
- [ ] README links to the Swagger UI endpoint

---

### Issue 7: TypeScript SDK strongly typed client with error handling

**Labels:** `help wanted`, `area:sdk`, `type:enhancement`
**Difficulty:** 4-6 hours

**Context:**
The SDK in `packages/sdk-ts` should provide a strongly typed client that
mirrors the API and handles errors gracefully.

**Acceptance Criteria:**
- [ ] All API endpoints have corresponding SDK methods
- [ ] Request/response types are exported and match the API
- [ ] Errors are wrapped in a typed `OpenFlamaError` class
- [ ] Network errors and API errors are distinguished
- [ ] Usage examples in `packages/sdk-ts/README.md`
- [ ] `npx tsc --noEmit` passes in the SDK directory

---

### Issue 8: Dashboard predictions table with detail drawer

**Labels:** `help wanted`, `area:web`, `type:enhancement`
**Difficulty:** 4-6 hours

**Context:**
The dashboard currently shows recent predictions in a basic table. Add a
detail drawer that opens when clicking a prediction row, showing full
prediction details including explanation and features used.

**Acceptance Criteria:**
- [ ] Clicking a prediction row opens a slide-out drawer
- [ ] Drawer shows all prediction fields (forecast, interval, model, trace ID, explanation, features)
- [ ] Drawer is dismissible (close button + click outside)
- [ ] Table remains functional while drawer is open
- [ ] Responsive on mobile (drawer takes full width on small screens)

---

### Issue 9: Dashboard backtests list with metric chips

**Labels:** `help wanted`, `area:web`, `type:enhancement`
**Difficulty:** 3-4 hours

**Context:**
Add a backtests section to the dashboard that lists recent backtest runs
with key metrics displayed as color-coded chips/badges.

**Acceptance Criteria:**
- [ ] New "Recent Backtests" section on the dashboard
- [ ] Each backtest row shows: model, horizon, windows, date
- [ ] Metric chips for MAE, MAPE, directional accuracy, hit rate
- [ ] Chips are color-coded (green for good metrics, red for poor)
- [ ] Empty state shown when no backtests exist
- [ ] Data fetched from `GET /api/v1/backtests`

---

### Issue 10: Python core forecasting unit tests for baseline models

**Labels:** `good first issue`, `area:core-py`, `type:chore`
**Difficulty:** 3-4 hours

**Context:**
The Python core library in `packages/core-py` needs unit tests for the
baseline forecasting models to ensure correctness and prevent regressions.

**Acceptance Criteria:**
- [ ] Test file at `packages/core-py/tests/test_models.py`
- [ ] Tests cover each baseline model (random walk, momentum, mean reversion, feature-based)
- [ ] Tests verify forecast output shape and types
- [ ] Tests verify prediction interval is valid (low < forecast < high)
- [ ] Tests run with `python -m pytest` from the `packages/core-py` directory
- [ ] CI updated to run Python tests (if pytest available)

---

### Issue 11: Model registry auto-discovery powering /models endpoint

**Labels:** `help wanted`, `area:api`, `type:enhancement`
**Difficulty:** 3-4 hours

**Context:**
Currently, the model list in `GET /api/v1/models` is hardcoded. Implement
auto-discovery so new models added to the forecasting engine are
automatically registered and returned by the endpoint.

**Acceptance Criteria:**
- [ ] Models are registered via a registry pattern (map or decorator)
- [ ] `GET /api/v1/models` reads from the registry, not a static array
- [ ] Adding a new model to the engine automatically makes it appear in `/models`
- [ ] Each model entry includes: id, name, type, description
- [ ] Existing models continue to work unchanged
- [ ] Documentation updated to explain how to add a new model

---

### Issue 12: Pluggable agent architecture interface, example agent, and docs

**Labels:** `help wanted`, `area:agents`, `type:enhancement`
**Difficulty:** 6-8 hours

**Context:**
Define a clear interface for pluggable financial agents and document how
to create new agents that integrate with the OpenFlama forecasting engine.

**Acceptance Criteria:**
- [ ] Agent interface defined (Python abstract class or protocol)
- [ ] Interface includes: `analyze(ticker)`, `get_signals()`, `generate_report()`
- [ ] Value Investing Agent implements the interface
- [ ] `docs/agents/creating-agents.md` documents the interface and step-by-step guide
- [ ] Example agent template/scaffold in `agents/example-agent/`
- [ ] Tests for the interface contract
- [ ] README references the agent architecture

---

## 4. Promotion Copy

### Reddit / Discord Post

```
Launching OpenFlama -- an open-source agentic finance runtime and
forecasting engine.

What it does:
- 4 baseline quant models (random walk, momentum, mean reversion, feature-based)
- Walk-forward backtesting with MAE/MAPE/directional accuracy
- REST API + TypeScript SDK + Python core library
- Pluggable LLM-powered financial agents (Value Investing Agent ships first)
- Web dashboard with dark theme

Stack: Node.js, Express, React, PostgreSQL, Drizzle ORM, Python

We have 12 starter issues labeled "good first issue" and "help wanted"
across API, frontend, SDK, Python, and docs. First-time contributors welcome.

Repo: github.com/maquenflow/openflama
Issues: github.com/maquenflow/openflama/issues
```

### Show HN

**Title:** Show HN: OpenFlama -- Open-source agentic finance runtime with
pluggable LLM agents

**First comment outline:**
```
Hi HN! I built OpenFlama because I wanted a reproducible, explainable
forecasting engine where every prediction has a trace ID and audit trail.

Key design decisions:
- Synthetic data for the MVP (deterministic, no external API dependencies)
- Pluggable LLM provider layer (Ollama, llama.cpp, OpenAI stubs)
- Walk-forward backtesting (not look-ahead-biased)
- Agent architecture for financial analysis (Value Investing Agent ships first)

Tech stack: Express + React + PostgreSQL + Drizzle + Python core
All TypeScript, dark-theme dashboard, MIT licensed.

Looking for contributors in: API validation, OpenAPI spec, SDK improvements,
dashboard features, Python model tests, and agent architecture.

12 starter issues up: github.com/maquenflow/openflama/issues
```

### Dev.to Post Outline

**Title:** Building an Open-Source Agentic Finance Runtime: Lessons and
Architecture

**Sections:**

1. **Why OpenFlama?**
   - Gap in open-source quant tooling for LLM-powered financial agents
   - Need for reproducible, explainable predictions with audit trails

2. **Architecture Overview**
   - Monorepo structure: apps, packages, agents
   - Request flow: API -> Forecasting Engine -> DB -> Dashboard
   - Pluggable model registry and agent system

3. **The Forecasting Engine**
   - 4 baseline models and why they matter
   - Walk-forward backtesting methodology
   - Synthetic data approach for the MVP

4. **Agent Architecture**
   - LLM provider abstraction (Ollama, llama.cpp, OpenAI)
   - Value Investing Agent: DCF-lite valuation + structured output
   - How to build your own agent

5. **Contributor Experience**
   - Docker Compose local setup
   - Issue templates and PR process
   - 12 starter issues across 6 areas
   - CI pipeline with smoke tests

6. **What's Next**
   - OpenAPI spec and Swagger UI
   - Real market data integration
   - Additional agents (momentum, sentiment)
   - Community-driven model contributions

7. **Get Involved**
   - Link to repo and issues page
   - How to claim an issue and submit a PR
   - Join the discussion

---

## Manual GitHub Steps Required

The following steps require manual action in the GitHub UI:

1. **Create Labels** -- Go to Settings > Labels and create all labels
   listed in section 1 above.

2. **Create Milestone** -- Go to Issues > Milestones > New Milestone.
   Name: "v0.1 Community Launch". Set target date 4-6 weeks out.

3. **Create Issues** -- Copy each issue from section 3 into a new GitHub
   issue. Apply the recommended labels and assign to the milestone.

4. **Enable Discussions** -- Go to Settings > General > Features and check
   "Discussions" to enable the community Q&A space.

5. **Add Topics** -- Go to the repo main page and add topics:
   `finance`, `forecasting`, `quantitative-finance`, `machine-learning`,
   `open-source`, `typescript`, `python`, `agents`, `llm`
