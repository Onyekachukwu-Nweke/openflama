import { db } from "./db";
import { predictions, backtestRuns } from "@shared/schema";
import { predict, runBacktest } from "./forecasting";
import { randomUUID } from "crypto";
import { sql } from "drizzle-orm";

export async function seedDatabase() {
  const existingPredictions = await db.select({ count: sql<number>`count(*)` }).from(predictions);
  const count = Number(existingPredictions[0]?.count || 0);

  if (count > 0) {
    return;
  }

  const seedTickers = [
    { ticker: "AAPL", horizon: "5d" as const, target: "return" as const },
    { ticker: "MSFT", horizon: "1d" as const, target: "return" as const },
    { ticker: "GOOGL", horizon: "20d" as const, target: "return" as const },
    { ticker: "TSLA", horizon: "5d" as const, target: "return" as const },
    { ticker: "AMZN", horizon: "1d" as const, target: "return" as const },
  ];

  for (const s of seedTickers) {
    const result = predict(s.ticker, s.horizon, s.target);
    await db.insert(predictions).values({
      ticker: s.ticker,
      horizon: s.horizon,
      target: s.target,
      asOfDate: new Date().toISOString().split("T")[0],
      forecast: result.forecast,
      intervalLow: result.intervalLow,
      intervalHigh: result.intervalHigh,
      modelUsed: result.modelUsed,
      featuresUsed: result.featuresUsed,
      dataWindow: result.dataWindow,
      traceId: result.traceId,
      explanation: result.explanation,
    });
  }

  const btMetrics = runBacktest(["AAPL"], "5d", "2024-01-01", "2024-06-30", "random_walk");
  await db.insert(backtestRuns).values({
    tickers: ["AAPL"],
    horizon: "5d",
    startDate: "2024-01-01",
    endDate: "2024-06-30",
    baseline: "random_walk",
    status: "completed",
    mae: btMetrics.mae,
    mape: btMetrics.mape,
    directionalAccuracy: btMetrics.directionalAccuracy,
    hitRate: btMetrics.hitRate,
    resultSeries: btMetrics.resultSeries,
  });

  console.log("Database seeded with sample predictions and backtest run.");
}
