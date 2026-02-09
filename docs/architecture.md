# Architecture

## Overview

OpenFlama is structured as a monorepo combining a full-stack web application
with SDK packages, a Python core library, and pluggable financial agents.

## Repository Layout

```
openflama/
  apps/
    api/              API documentation and READMEs
    web/              Web frontend documentation
  packages/
    sdk-ts/           TypeScript SDK (@openflama/sdk-ts)
    core-py/          Python core library (openflama-core)
  agents/
    value-investing-agent/   Value investing agent with LLM providers
  docs/               Architecture, roadmap, contributing docs
  server/             Express.js API source
    routes.ts           API route handlers
    forecasting.ts      Forecasting engine (4 baseline models)
    storage.ts          Database storage layer (IStorage interface)
    seed.ts             Database seeding
  client/             React frontend source
    src/pages/
      landing.tsx       Landing page
      dashboard.tsx     Dashboard with prediction form
      docs.tsx          Documentation page
  shared/
    schema.ts           Drizzle ORM schema + Zod validation
  .github/
    workflows/ci.yml    CI pipeline
    ISSUE_TEMPLATE/     Issue templates
```

## Request Flow

### POST /api/v1/predict

```
Client (Dashboard)
  |
  |  POST { ticker, horizon, target }
  v
Express Router (server/routes.ts)
  |
  |  Validate with Zod schema
  v
Forecasting Engine (server/forecasting.ts)
  |
  |  1. Generate synthetic price data (deterministic seed)
  |  2. Run all 4 models against data
  |  3. Select best model by lowest interval width
  |  4. Build prediction result with trace ID
  v
Storage Layer (server/storage.ts)
  |
  |  INSERT INTO predictions
  v
PostgreSQL (predictions table)
  |
  v
Response: { ticker, forecast, intervalLow, intervalHigh,
            modelUsed, explanation, traceId, ... }
```

### POST /api/v1/backtest

```
Client
  |
  |  POST { ticker, model, horizon, windows }
  v
Express Router (server/routes.ts)
  |
  |  Validate with Zod schema
  v
Forecasting Engine (server/forecasting.ts)
  |
  |  Walk-forward loop:
  |    for each window in 1..windows:
  |      1. Expand training set by one step
  |      2. Run selected model on training data
  |      3. Record forecast vs actual
  |  Compute aggregate metrics:
  |    MAE, MAPE, directional accuracy, hit rate
  v
Storage Layer (server/storage.ts)
  |
  |  INSERT INTO backtest_runs
  v
PostgreSQL (backtest_runs table)
  |
  v
Response: { model, horizon, windows, mae, mape,
            directionalAccuracy, hitRate, ... }
```

### GET /api/v1/models

```
Client
  |
  v
Express Router -> Forecasting Engine
  |
  |  Return static model registry
  v
Response: [
  { id: "random_walk",      name: "Random Walk",      type: "baseline" },
  { id: "simple_momentum",  name: "Simple Momentum",  type: "baseline" },
  { id: "mean_reversion",   name: "Mean Reversion",   type: "baseline" },
  { id: "feature_based",    name: "Feature-Based",    type: "composite" }
]
```

## Forecasting Engine

The engine provides four baseline models:

| Model | Strategy | Use Case |
|-------|----------|----------|
| Random Walk | No-change baseline (drift = 0) | Benchmark |
| Simple Momentum | Mean of recent returns | Trend following |
| Mean Reversion | Short vs long-term mean deviation + RSI | Contrarian |
| Feature-Based | Momentum crossover + RSI + volatility regime | Multi-signal |

All models:
- Accept ticker, horizon, and target parameters
- Return point forecast with prediction interval
- Include trace ID and explanation for auditability
- Use a pluggable registry pattern for extensibility

## Walk-Forward Backtesting

Backtests use a walk-forward methodology:
1. Split data into train/test sets
2. Expand training window by one step
3. Generate forecast for next horizon period
4. Record actual vs predicted
5. Compute MAE, MAPE, directional accuracy, and hit rate

## Database Schema

- `predictions`: Stores all prediction results with model metadata
- `backtest_runs`: Stores backtest configurations and aggregate metrics

Schema defined in `shared/schema.ts` using Drizzle ORM with Zod validation.

## Agent Architecture

Agents are pluggable modules in `agents/`. Each agent:
- Uses the LLM provider abstraction (`packages/core-py/openflama/llm_providers/`)
- Supports multiple providers: Ollama, llama.cpp (stub), OpenAI (stub)
- Produces structured JSON output for integration with the forecasting engine

See [Creating Agents](agents/creating-agents.md) for details.

## Technology Stack

| Layer | Technology |
|-------|-----------|
| Runtime | Node.js 20 with TypeScript (tsx) |
| API | Express.js |
| Frontend | React + Vite + TanStack Query |
| Database | PostgreSQL with Drizzle ORM |
| Styling | Tailwind CSS + shadcn/ui |
| SDK | TypeScript (@openflama/sdk-ts) |
| Core Library | Python (openflama-core) |
| CI | GitHub Actions |
