import {
  type Prediction,
  type InsertPrediction,
  type BacktestRun,
  type InsertBacktestRun,
  predictions,
  backtestRuns,
} from "@shared/schema";
import { db } from "./db";
import { desc, eq } from "drizzle-orm";

export interface IStorage {
  createPrediction(data: InsertPrediction): Promise<Prediction>;
  listPredictions(limit?: number): Promise<Prediction[]>;
  getPrediction(id: string): Promise<Prediction | undefined>;

  createBacktestRun(data: InsertBacktestRun): Promise<BacktestRun>;
  listBacktestRuns(limit?: number): Promise<BacktestRun[]>;
  getBacktestRun(id: string): Promise<BacktestRun | undefined>;
  updateBacktestRun(id: string, data: Partial<InsertBacktestRun>): Promise<BacktestRun | undefined>;
}

export class DatabaseStorage implements IStorage {
  async createPrediction(data: InsertPrediction): Promise<Prediction> {
    const [result] = await db.insert(predictions).values(data).returning();
    return result;
  }

  async listPredictions(limit: number = 50): Promise<Prediction[]> {
    return db.select().from(predictions).orderBy(desc(predictions.createdAt)).limit(limit);
  }

  async getPrediction(id: string): Promise<Prediction | undefined> {
    const [result] = await db.select().from(predictions).where(eq(predictions.id, id));
    return result;
  }

  async createBacktestRun(data: InsertBacktestRun): Promise<BacktestRun> {
    const [result] = await db.insert(backtestRuns).values(data).returning();
    return result;
  }

  async listBacktestRuns(limit: number = 20): Promise<BacktestRun[]> {
    return db.select().from(backtestRuns).orderBy(desc(backtestRuns.createdAt)).limit(limit);
  }

  async getBacktestRun(id: string): Promise<BacktestRun | undefined> {
    const [result] = await db.select().from(backtestRuns).where(eq(backtestRuns.id, id));
    return result;
  }

  async updateBacktestRun(id: string, data: Partial<InsertBacktestRun>): Promise<BacktestRun | undefined> {
    const [result] = await db.update(backtestRuns).set(data).where(eq(backtestRuns.id, id)).returning();
    return result;
  }
}

export const storage = new DatabaseStorage();
