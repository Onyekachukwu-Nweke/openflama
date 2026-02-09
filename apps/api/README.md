# OpenFlama API

Express.js backend providing the forecasting and backtesting API.

## Endpoints

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/api/v1/health` | Health check |
| `GET` | `/api/v1/models` | List available forecasting models |
| `POST` | `/api/v1/predict` | Generate a prediction |
| `POST` | `/api/v1/backtest` | Run walk-forward backtest |
| `GET` | `/api/v1/predictions` | List recent predictions |
| `GET` | `/api/v1/backtests` | List backtest runs |

## Predict Request

```json
{
  "ticker": "AAPL",
  "horizon": "5d",
  "target": "return",
  "model": "simple_momentum"
}
```

## Backtest Request

```json
{
  "tickers": ["AAPL"],
  "horizon": "5d",
  "startDate": "2024-01-01",
  "endDate": "2024-06-30",
  "baseline": "random_walk"
}
```

## Running Locally

```bash
npm install
npm run dev
```

Requires a PostgreSQL database. Set `DATABASE_URL` in your environment.
