import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { predictRequestSchema, backtestRequestSchema } from "@shared/schema";
import { predict, listModels, runBacktest } from "./forecasting";
import { fromError } from "zod-validation-error";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {

  app.get("/api/v1/health", (_req, res) => {
    const models = listModels();
    res.json({
      status: "ok",
      version: "v0.1.0",
      models_available: models.length,
      timestamp: new Date().toISOString(),
    });
  });

  app.get("/api/v1/models", (_req, res) => {
    res.json(listModels());
  });

  app.post("/api/v1/predict", async (req, res) => {
    try {
      const parsed = predictRequestSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({
          error: fromError(parsed.error).toString(),
        });
      }

      const { ticker, horizon, target, features } = parsed.data;
      const asOfDate = parsed.data.asOfDate || new Date().toISOString().split("T")[0];

      const modelId = req.body.model || undefined;
      const result = predict(ticker.toUpperCase(), horizon, target, modelId);

      const prediction = await storage.createPrediction({
        ticker: ticker.toUpperCase(),
        horizon,
        target,
        asOfDate,
        forecast: result.forecast,
        intervalLow: result.intervalLow,
        intervalHigh: result.intervalHigh,
        modelUsed: result.modelUsed,
        featuresUsed: result.featuresUsed,
        dataWindow: result.dataWindow,
        traceId: result.traceId,
        explanation: result.explanation,
      });

      res.json(prediction);
    } catch (err: any) {
      res.status(500).json({ error: err.message || "Internal error" });
    }
  });

  app.post("/api/v1/backtest", async (req, res) => {
    try {
      const parsed = backtestRequestSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({
          error: fromError(parsed.error).toString(),
        });
      }

      const { tickers, horizon, startDate, endDate, baseline } = parsed.data;

      const run = await storage.createBacktestRun({
        tickers,
        horizon,
        startDate,
        endDate,
        baseline,
        status: "running",
        mae: null,
        mape: null,
        directionalAccuracy: null,
        hitRate: null,
        resultSeries: null,
      });

      const metrics = runBacktest(tickers, horizon, startDate, endDate, baseline);

      const updated = await storage.updateBacktestRun(run.id, {
        status: "completed",
        mae: metrics.mae,
        mape: metrics.mape,
        directionalAccuracy: metrics.directionalAccuracy,
        hitRate: metrics.hitRate,
        resultSeries: metrics.resultSeries,
      } as any);

      res.json(updated || run);
    } catch (err: any) {
      res.status(500).json({ error: err.message || "Internal error" });
    }
  });

  app.get("/api/v1/predictions", async (_req, res) => {
    try {
      const predictions = await storage.listPredictions(50);
      res.json(predictions);
    } catch (err: any) {
      res.status(500).json({ error: err.message || "Internal error" });
    }
  });

  app.get("/api/v1/backtests", async (_req, res) => {
    try {
      const runs = await storage.listBacktestRuns(20);
      res.json(runs);
    } catch (err: any) {
      res.status(500).json({ error: err.message || "Internal error" });
    }
  });

  return httpServer;
}
