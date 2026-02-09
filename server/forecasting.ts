import { randomUUID } from "crypto";

export interface ForecastResult {
  forecast: number;
  intervalLow: number;
  intervalHigh: number;
  modelUsed: string;
  featuresUsed: string[];
  dataWindow: string;
  traceId: string;
  explanation: string;
}

export interface ModelInfo {
  id: string;
  name: string;
  type: string;
  description: string;
}

export interface BacktestMetrics {
  mae: number;
  mape: number;
  directionalAccuracy: number;
  hitRate: number;
  resultSeries: Array<{
    date: string;
    actual: number;
    predicted: number;
    intervalLow: number;
    intervalHigh: number;
  }>;
}

function generateSyntheticReturns(ticker: string, days: number): number[] {
  let seed = 0;
  for (let i = 0; i < ticker.length; i++) {
    seed += ticker.charCodeAt(i);
  }
  const returns: number[] = [];
  for (let i = 0; i < days; i++) {
    seed = (seed * 1103515245 + 12345) & 0x7fffffff;
    const u1 = (seed % 10000) / 10000;
    seed = (seed * 1103515245 + 12345) & 0x7fffffff;
    const u2 = (seed % 10000) / 10000;
    const z = Math.sqrt(-2 * Math.log(Math.max(u1, 0.0001))) * Math.cos(2 * Math.PI * u2);
    returns.push(z * 0.02);
  }
  return returns;
}

function laggedReturns(returns: number[], lag: number): number[] {
  return returns.slice(0, returns.length - lag);
}

function rollingMean(returns: number[], window: number): number[] {
  const result: number[] = [];
  for (let i = window - 1; i < returns.length; i++) {
    let sum = 0;
    for (let j = i - window + 1; j <= i; j++) {
      sum += returns[j];
    }
    result.push(sum / window);
  }
  return result;
}

function rollingVolatility(returns: number[], window: number): number[] {
  const means = rollingMean(returns, window);
  const result: number[] = [];
  for (let i = window - 1; i < returns.length; i++) {
    const mean = means[i - window + 1];
    let sumSqDiff = 0;
    for (let j = i - window + 1; j <= i; j++) {
      sumSqDiff += (returns[j] - mean) ** 2;
    }
    result.push(Math.sqrt(sumSqDiff / window));
  }
  return result;
}

function computeRSI(returns: number[], period: number = 14): number {
  if (returns.length < period) return 50;
  const recent = returns.slice(-period);
  let gains = 0;
  let losses = 0;
  for (const r of recent) {
    if (r > 0) gains += r;
    else losses += Math.abs(r);
  }
  if (losses === 0) return 100;
  const rs = gains / losses;
  return 100 - 100 / (1 + rs);
}

export function randomWalkForecast(
  ticker: string,
  horizon: string,
  target: string,
): ForecastResult {
  const returns = generateSyntheticReturns(ticker, 252);
  const vol = rollingVolatility(returns, 20);
  const lastVol = vol[vol.length - 1] || 0.02;
  const horizonDays = parseInt(horizon) || 5;
  const scaledVol = lastVol * Math.sqrt(horizonDays);

  return {
    forecast: 0,
    intervalLow: -1.96 * scaledVol,
    intervalHigh: 1.96 * scaledVol,
    modelUsed: "random_walk",
    featuresUsed: ["rolling_volatility_20d"],
    dataWindow: "252 trading days",
    traceId: randomUUID(),
    explanation: `Random Walk model assumes no predictable change. The ${horizon} prediction interval is based on 20-day rolling volatility scaled by sqrt(${horizonDays}).`,
  };
}

export function momentumForecast(
  ticker: string,
  horizon: string,
  target: string,
): ForecastResult {
  const returns = generateSyntheticReturns(ticker, 252);
  const horizonDays = parseInt(horizon) || 5;

  const recentReturns = returns.slice(-20);
  const meanReturn = recentReturns.reduce((a, b) => a + b, 0) / recentReturns.length;
  const forecast = meanReturn * horizonDays;

  const vol = rollingVolatility(returns, 20);
  const lastVol = vol[vol.length - 1] || 0.02;
  const scaledVol = lastVol * Math.sqrt(horizonDays);

  return {
    forecast,
    intervalLow: forecast - 1.96 * scaledVol,
    intervalHigh: forecast + 1.96 * scaledVol,
    modelUsed: "simple_momentum",
    featuresUsed: ["lagged_returns_20d", "rolling_mean_20d", "rolling_volatility_20d"],
    dataWindow: "252 trading days",
    traceId: randomUUID(),
    explanation: `Simple Momentum uses mean of last 20 daily returns (${(meanReturn * 100).toFixed(4)}%) extrapolated over ${horizonDays} days. Interval based on 20-day rolling volatility.`,
  };
}

export function meanReversionForecast(
  ticker: string,
  horizon: string,
  target: string,
): ForecastResult {
  const returns = generateSyntheticReturns(ticker, 252);
  const horizonDays = parseInt(horizon) || 5;

  const longMean = returns.reduce((a, b) => a + b, 0) / returns.length;
  const recentMean = returns.slice(-20).reduce((a, b) => a + b, 0) / 20;
  const reversionStrength = 0.3;
  const forecast = (longMean - recentMean) * reversionStrength * horizonDays;

  const vol = rollingVolatility(returns, 20);
  const lastVol = vol[vol.length - 1] || 0.02;
  const scaledVol = lastVol * Math.sqrt(horizonDays);

  const rsi = computeRSI(returns);

  return {
    forecast,
    intervalLow: forecast - 1.96 * scaledVol,
    intervalHigh: forecast + 1.96 * scaledVol,
    modelUsed: "mean_reversion",
    featuresUsed: [
      "long_term_mean_252d",
      "short_term_mean_20d",
      "rolling_volatility_20d",
      `rsi_14d_${rsi.toFixed(0)}`,
    ],
    dataWindow: "252 trading days",
    traceId: randomUUID(),
    explanation: `Mean Reversion model detects deviation of short-term (20d) mean from long-term (252d) mean. RSI(14)=${rsi.toFixed(1)}. Reversion strength: ${(reversionStrength * 100).toFixed(0)}%. Forecast over ${horizonDays} days.`,
  };
}

export function featureBasedForecast(
  ticker: string,
  horizon: string,
  target: string,
): ForecastResult {
  const returns = generateSyntheticReturns(ticker, 252);
  const horizonDays = parseInt(horizon) || 5;

  const rm20 = rollingMean(returns, 20);
  const rm5 = rollingMean(returns, 5);
  const rv20 = rollingVolatility(returns, 20);
  const rsi = computeRSI(returns);

  const lastRm20 = rm20[rm20.length - 1] || 0;
  const lastRm5 = rm5[rm5.length - 1] || 0;
  const lastRv20 = rv20[rv20.length - 1] || 0.02;

  const momentumSignal = lastRm5 - lastRm20;
  const volAdj = lastRv20 > 0.03 ? -0.3 : lastRv20 < 0.01 ? 0.2 : 0;
  const rsiSignal = rsi > 70 ? -0.002 : rsi < 30 ? 0.002 : 0;

  const forecast = (momentumSignal * 2 + rsiSignal + volAdj * lastRv20) * horizonDays;
  const scaledVol = lastRv20 * Math.sqrt(horizonDays);

  return {
    forecast,
    intervalLow: forecast - 1.65 * scaledVol,
    intervalHigh: forecast + 1.65 * scaledVol,
    modelUsed: "feature_based",
    featuresUsed: [
      "rolling_mean_5d",
      "rolling_mean_20d",
      "rolling_volatility_20d",
      `rsi_14d_${rsi.toFixed(0)}`,
      "momentum_crossover",
      "volatility_regime",
    ],
    dataWindow: "252 trading days",
    traceId: randomUUID(),
    explanation: `Feature-based model combines momentum crossover (5d vs 20d mean), RSI(14)=${rsi.toFixed(1)}, and volatility regime (${(lastRv20 * 100).toFixed(2)}% daily vol). Uses 80% prediction interval.`,
  };
}

const modelRegistry: Record<string, (ticker: string, horizon: string, target: string) => ForecastResult> = {
  random_walk: randomWalkForecast,
  simple_momentum: momentumForecast,
  mean_reversion: meanReversionForecast,
  feature_based: featureBasedForecast,
};

export function listModels(): ModelInfo[] {
  return [
    {
      id: "random_walk",
      name: "Random Walk",
      type: "baseline",
      description: "No-change forecast. Assumes price follows a random walk with drift = 0.",
    },
    {
      id: "simple_momentum",
      name: "Simple Momentum",
      type: "baseline",
      description: "Mean of last 20 daily returns extrapolated over the forecast horizon.",
    },
    {
      id: "mean_reversion",
      name: "Mean Reversion",
      type: "baseline",
      description: "Predicts reversion of short-term mean toward long-term mean with RSI confirmation.",
    },
    {
      id: "feature_based",
      name: "Feature-Based",
      type: "ml_proxy",
      description: "Combines momentum crossover, RSI, and volatility regime signals for prediction.",
    },
  ];
}

export function predict(
  ticker: string,
  horizon: string,
  target: string,
  modelId?: string,
): ForecastResult {
  const fn = modelRegistry[modelId || "simple_momentum"];
  if (!fn) {
    return momentumForecast(ticker, horizon, target);
  }
  return fn(ticker, horizon, target);
}

export function runBacktest(
  tickers: string[],
  horizon: string,
  startDate: string,
  endDate: string,
  baseline: string,
): BacktestMetrics {
  const ticker = tickers[0];
  const returns = generateSyntheticReturns(ticker, 500);
  const horizonDays = parseInt(horizon) || 5;

  const fn = modelRegistry[baseline] || randomWalkForecast;

  const testSize = Math.min(60, Math.floor(returns.length * 0.2));
  const trainEnd = returns.length - testSize;

  const results: BacktestMetrics["resultSeries"] = [];
  let totalAbsError = 0;
  let totalAbsPctError = 0;
  let correctDirection = 0;
  let withinInterval = 0;

  for (let i = 0; i < testSize - horizonDays; i++) {
    const trainReturns = returns.slice(0, trainEnd + i);
    const actualReturn = returns
      .slice(trainEnd + i, trainEnd + i + horizonDays)
      .reduce((a, b) => a + b, 0);

    const result = fn(ticker, horizon, "return");
    const predicted = result.forecast;

    const absError = Math.abs(actualReturn - predicted);
    totalAbsError += absError;
    totalAbsPctError += Math.abs(actualReturn) > 0.0001
      ? absError / Math.abs(actualReturn)
      : 0;

    if ((actualReturn >= 0 && predicted >= 0) || (actualReturn < 0 && predicted < 0)) {
      correctDirection++;
    }

    if (actualReturn >= result.intervalLow && actualReturn <= result.intervalHigh) {
      withinInterval++;
    }

    const baseDate = new Date(startDate);
    baseDate.setDate(baseDate.getDate() + i);

    results.push({
      date: baseDate.toISOString().split("T")[0],
      actual: parseFloat(actualReturn.toFixed(6)),
      predicted: parseFloat(predicted.toFixed(6)),
      intervalLow: parseFloat(result.intervalLow.toFixed(6)),
      intervalHigh: parseFloat(result.intervalHigh.toFixed(6)),
    });
  }

  const n = results.length || 1;

  return {
    mae: parseFloat((totalAbsError / n).toFixed(6)),
    mape: parseFloat(((totalAbsPctError / n) * 100).toFixed(2)),
    directionalAccuracy: parseFloat(((correctDirection / n) * 100).toFixed(2)),
    hitRate: parseFloat(((withinInterval / n) * 100).toFixed(2)),
    resultSeries: results,
  };
}
