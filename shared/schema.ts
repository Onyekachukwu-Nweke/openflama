import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, real, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const predictions = pgTable("predictions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  ticker: text("ticker").notNull(),
  horizon: text("horizon").notNull(),
  target: text("target").notNull().default("return"),
  asOfDate: text("as_of_date").notNull(),
  forecast: real("forecast").notNull(),
  intervalLow: real("interval_low").notNull(),
  intervalHigh: real("interval_high").notNull(),
  modelUsed: text("model_used").notNull(),
  featuresUsed: text("features_used").array().notNull(),
  dataWindow: text("data_window").notNull(),
  traceId: varchar("trace_id").notNull(),
  explanation: text("explanation"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const backtestRuns = pgTable("backtest_runs", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  tickers: text("tickers").array().notNull(),
  horizon: text("horizon").notNull(),
  startDate: text("start_date").notNull(),
  endDate: text("end_date").notNull(),
  baseline: text("baseline").notNull(),
  status: text("status").notNull().default("pending"),
  mae: real("mae"),
  mape: real("mape"),
  directionalAccuracy: real("directional_accuracy"),
  hitRate: real("hit_rate"),
  resultSeries: jsonb("result_series"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertPredictionSchema = createInsertSchema(predictions).omit({
  id: true,
  createdAt: true,
});

export const insertBacktestRunSchema = createInsertSchema(backtestRuns).omit({
  id: true,
  createdAt: true,
});

export const predictRequestSchema = z.object({
  ticker: z.string().min(1).max(10),
  horizon: z.enum(["1d", "5d", "20d"]),
  asOfDate: z.string().optional(),
  target: z.enum(["return", "price"]).default("return"),
  features: z.array(z.string()).optional(),
});

export const backtestRequestSchema = z.object({
  tickers: z.array(z.string().min(1)).min(1),
  horizon: z.enum(["1d", "5d", "20d"]),
  startDate: z.string(),
  endDate: z.string(),
  baseline: z.string().default("random_walk"),
});

export type Prediction = typeof predictions.$inferSelect;
export type InsertPrediction = z.infer<typeof insertPredictionSchema>;
export type BacktestRun = typeof backtestRuns.$inferSelect;
export type InsertBacktestRun = z.infer<typeof insertBacktestRunSchema>;
export type PredictRequest = z.infer<typeof predictRequestSchema>;
export type BacktestRequest = z.infer<typeof backtestRequestSchema>;
