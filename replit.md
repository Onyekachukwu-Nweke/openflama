# OpenFlama - Agentic Finance Runtime & Forecasting Engine

## Overview
OpenFlama is an open-source agentic finance runtime and forecasting engine. It provides quantitative forecasting with baseline models, walk-forward backtesting, and a pluggable architecture for financial agents.

## Architecture
- **Frontend**: React + TypeScript with dark theme (black + red)
  - Landing page at `/` - product showcase
  - Dashboard at `/dashboard` - prediction form + recent predictions + models
- **Backend**: Express.js with TypeScript
  - API endpoints under `/api/v1/`
  - Forecasting engine with 4 baseline models
  - PostgreSQL for persistence (predictions + backtest runs)
- **Database**: PostgreSQL with Drizzle ORM
  - `predictions` table: stores all prediction results
  - `backtest_runs` table: stores backtest configurations and metrics

## Monorepo Structure (for GitHub)
```
openflama/
  apps/api/         API READMEs and documentation
  apps/web/         Web frontend READMEs and documentation
  packages/sdk-ts/  TypeScript SDK with full API client
  packages/core-py/ Python core library scaffold
  agents/           Pluggable financial agents (scaffold)
  docs/             Architecture, roadmap, contributing docs
  .github/          Issue templates, PR template, CI workflows
```

## API Endpoints
- `GET /api/v1/health` - Health check
- `GET /api/v1/models` - List available forecasting models
- `POST /api/v1/predict` - Generate a prediction (ticker, horizon, target)
- `POST /api/v1/backtest` - Run walk-forward backtest
- `GET /api/v1/predictions` - List recent predictions
- `GET /api/v1/backtests` - List backtest runs

## Forecasting Models
1. **Random Walk** - No-change baseline
2. **Simple Momentum** - Mean of last 20 daily returns
3. **Mean Reversion** - Short-term vs long-term mean deviation with RSI
4. **Feature-Based** - Momentum crossover + RSI + volatility regime

## Value Investing Agent
- Located at `agents/value-investing-agent/`
- Pluggable LLM providers: Ollama, llama.cpp (stub), OpenAI stub
- Provider layer at `packages/core-py/openflama/llm_providers/`
- Run with: `cd agents/value-investing-agent && python agent.py --ticker AAPL --provider openai_stub`
- Tests: `cd agents/value-investing-agent && python tests/test_agent.py`
- Docs: `docs/agents/creating-agents.md`

## Key Files
- `shared/schema.ts` - Database schema and Zod validation
- `server/forecasting.ts` - Forecasting engine with all models
- `server/routes.ts` - API route handlers
- `server/storage.ts` - Database storage layer
- `server/seed.ts` - Database seeding
- `client/src/pages/landing.tsx` - Landing page
- `client/src/pages/dashboard.tsx` - Dashboard page
- `packages/sdk-ts/src/index.ts` - TypeScript SDK client
- `agents/value-investing-agent/agent.py` - Value Investing Agent
- `agents/value-investing-agent/tools.py` - Financial data tools
- `packages/core-py/openflama/llm_providers/` - LLM provider layer

## OSS Files
- `README.md` - Root project README
- `LICENSE` - MIT License
- `CODE_OF_CONDUCT.md` - Contributor Covenant
- `CONTRIBUTING.md` - Contribution guidelines
- `SECURITY.md` - Security policy
- `.github/workflows/ci.yml` - GitHub Actions CI pipeline

## Design
- Dark-first theme (black background + red primary accents)
- Font: Inter for sans, JetBrains Mono for code
- All CSS variables are dark-mode compatible

## GitHub Push
- Run `./push-to-github.sh` to push to GitHub (requires GITHUB_TOKEN, GITHUB_OWNER, GITHUB_REPO secrets)
