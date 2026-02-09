# OpenFlama

An open-source agentic finance runtime and forecasting engine.

OpenFlama provides quantitative forecasting with baseline models, walk-forward
backtesting, and a pluggable architecture for financial agents.

## Features

- 4 baseline forecasting models (Random Walk, Momentum, Mean Reversion, Feature-Based)
- Walk-forward backtesting with MAE, MAPE, directional accuracy, and hit rate
- REST API for predictions and backtesting
- Web dashboard with dark theme
- PostgreSQL persistence via Drizzle ORM
- TypeScript SDK for API access
- Pluggable agent architecture (coming soon)

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
- PostgreSQL 15+

### Setup

```bash
git clone https://github.com/maquenflow/openflama.git
cd openflama
npm install
```

Set your environment variables:

```bash
export DATABASE_URL="postgresql://user:pass@localhost:5432/openflama"
export SESSION_SECRET="your-secret"
```

Push the database schema:

```bash
npm run db:push
```

Start the development server:

```bash
npm run dev
```

The app will be available at `http://localhost:5000`.

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

## Documentation

- [Architecture](docs/architecture.md)
- [Roadmap](docs/roadmap.md)
- [Contributing](CONTRIBUTING.md)
- [Security](SECURITY.md)

## Contributing

We welcome contributions! Please read our [Contributing Guide](CONTRIBUTING.md)
and [Code of Conduct](CODE_OF_CONDUCT.md) before getting started.

## License

[MIT](LICENSE)
