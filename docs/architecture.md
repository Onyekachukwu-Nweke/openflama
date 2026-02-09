# Architecture

## Overview

OpenFlama is structured as a monorepo with the following layout:

```
openflama/
  apps/
    api/          Express.js API server
    web/          React frontend
  packages/
    sdk-ts/       TypeScript SDK
    core-py/      Python core library
  agents/         Pluggable financial agents
  docs/           Documentation
```

## Data Flow

```
User Request
    |
    v
[Web Dashboard] --HTTP--> [API Server] ---> [Forecasting Engine]
                                |                    |
                                v                    v
                          [PostgreSQL]        [Model Registry]
                          (persistence)       (4 baseline models)
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

## Technology Stack

- **Runtime**: Node.js with TypeScript (tsx)
- **API**: Express.js
- **Frontend**: React + Vite + TanStack Query
- **Database**: PostgreSQL with Drizzle ORM
- **Styling**: Tailwind CSS + shadcn/ui
