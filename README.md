# OpenFlama

An open-source agentic finance runtime and forecasting engine.

OpenFlama provides quantitative forecasting with baseline models, walk-forward
backtesting, and a pluggable architecture for financial agents.

## Start Here

- **New contributor?** Read the [Contributing Guide](CONTRIBUTING.md) to get set up.
- **Looking for something to work on?** Browse [open issues](https://github.com/maquenflow/openflama/issues) filtered by:
  - [`good first issue`](https://github.com/maquenflow/openflama/labels/good%20first%20issue) - great for first-time contributors
  - [`help wanted`](https://github.com/maquenflow/openflama/labels/help%20wanted) - we'd love your help here
- **Questions?** Open an issue or start a discussion.

## Features

- 4 baseline forecasting models (Random Walk, Momentum, Mean Reversion, Feature-Based)
- Walk-forward backtesting with MAE, MAPE, directional accuracy, and hit rate
- REST API for predictions and backtesting
- Web dashboard with dark theme
- PostgreSQL persistence via Drizzle ORM
- TypeScript SDK for API access
- Python core library with pluggable LLM providers
- Value Investing Agent with DCF-lite valuation

## Project Structure

```
openflama/
  apps/
    api/            Express.js API server
    web/            React + Vite frontend
  packages/
    sdk-ts/         TypeScript SDK (@openflama/sdk-ts)
    core-py/        Python core library (openflama-core)
  agents/           Pluggable financial agents
  docs/             Documentation
  server/           API source (Express routes, forecasting engine)
  client/           Frontend source (React components)
  shared/           Shared types and schemas
```

## Quick Start

### Prerequisites

- Node.js 20+
- PostgreSQL 15+ (or use [Docker](docs/local-db.md))

### Setup

```bash
git clone https://github.com/maquenflow/openflama.git
cd openflama
cp .env.example .env    # edit with your DB credentials
npm install
npm run db:push         # apply schema to database
npm run dev             # start dev server
```

The app will be available at `http://localhost:5000`.

For local Postgres via Docker, see [docs/local-db.md](docs/local-db.md).

## API

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/v1/health` | Health check |
| `GET` | `/api/v1/models` | List forecasting models |
| `POST` | `/api/v1/predict` | Generate prediction |
| `POST` | `/api/v1/backtest` | Run walk-forward backtest |
| `GET` | `/api/v1/predictions` | List recent predictions |
| `GET` | `/api/v1/backtests` | List backtest runs |

### Example: Generate a Prediction

```bash
curl -X POST http://localhost:5000/api/v1/predict \
  -H "Content-Type: application/json" \
  -d '{"ticker": "AAPL", "horizon": "5d", "target": "return"}'
```

## Models

| Model | Strategy | Description |
|-------|----------|-------------|
| Random Walk | No-change baseline | Assumes price follows random walk with drift = 0 |
| Simple Momentum | Mean recent returns | Extrapolates last 20 daily returns over horizon |
| Mean Reversion | Short vs long-term mean | Detects deviation with RSI confirmation |
| Feature-Based | Multi-signal | Momentum crossover + RSI + volatility regime |

## How to Contribute

1. Browse [open issues](https://github.com/maquenflow/openflama/issues) and pick one that interests you.
2. Comment on the issue to claim it (e.g., "I'd like to work on this").
3. Fork the repo and create a branch: `feat/your-feature` or `fix/your-bugfix`.
4. Make your changes, run `npm run check`, and commit.
5. Open a Pull Request against `main` and link it to the issue.
6. Wait for review and address feedback.

See [CONTRIBUTING.md](CONTRIBUTING.md) for full details on setup, coding standards, and PR process.

## Community Roadmap

We're working toward the **v0.1 Community Launch** milestone. Key goals:

- Request validation and consistent API error shapes
- OpenAPI spec with Swagger UI
- Strongly typed SDK client with error handling
- Dashboard improvements (predictions table, backtest metrics)
- Python core unit tests for baseline models
- Model registry auto-discovery
- Pluggable agent architecture docs

See [docs/community-launch.md](docs/community-launch.md) for the full plan
with issues and acceptance criteria.

## Discussions

> **Note:** Enable GitHub Discussions in the repo settings (Settings > General > Features > Discussions)
> for a dedicated Q&A and community space. Until then, use Issues for questions.

## Documentation

- [Architecture](docs/architecture.md)
- [Local Database Setup](docs/local-db.md)
- [Creating Agents](docs/agents/creating-agents.md)
- [Roadmap](docs/roadmap.md)
- [Community Launch Plan](docs/community-launch.md)
- [Contributing](CONTRIBUTING.md)
- [Security](SECURITY.md)
- [Code of Conduct](CODE_OF_CONDUCT.md)

## License

[MIT](LICENSE)
