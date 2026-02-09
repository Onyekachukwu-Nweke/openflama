export interface PredictRequest {
  ticker: string;
  horizon: string;
  target: string;
  model?: string;
  asOfDate?: string;
}

export interface PredictResponse {
  id: string;
  ticker: string;
  horizon: string;
  target: string;
  asOfDate: string;
  forecast: number;
  intervalLow: number;
  intervalHigh: number;
  modelUsed: string;
  featuresUsed: string[];
  dataWindow: string;
  traceId: string;
  explanation: string;
  createdAt: string;
}

export interface BacktestRequest {
  tickers: string[];
  horizon: string;
  startDate: string;
  endDate: string;
  baseline: string;
}

export interface BacktestResponse {
  id: string;
  tickers: string[];
  horizon: string;
  startDate: string;
  endDate: string;
  baseline: string;
  status: string;
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

export interface ModelInfo {
  id: string;
  name: string;
  type: string;
  description: string;
}

export interface HealthResponse {
  status: string;
  version: string;
  models_available: number;
  timestamp: string;
}

export class OpenFlama {
  private baseUrl: string;

  constructor(options: { baseUrl: string }) {
    this.baseUrl = options.baseUrl.replace(/\/$/, "");
  }

  async health(): Promise<HealthResponse> {
    const res = await fetch(`${this.baseUrl}/api/v1/health`);
    if (!res.ok) throw new Error(`Health check failed: ${res.status}`);
    return res.json();
  }

  async listModels(): Promise<ModelInfo[]> {
    const res = await fetch(`${this.baseUrl}/api/v1/models`);
    if (!res.ok) throw new Error(`Failed to list models: ${res.status}`);
    return res.json();
  }

  async predict(request: PredictRequest): Promise<PredictResponse> {
    const res = await fetch(`${this.baseUrl}/api/v1/predict`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(request),
    });
    if (!res.ok) throw new Error(`Prediction failed: ${res.status}`);
    return res.json();
  }

  async backtest(request: BacktestRequest): Promise<BacktestResponse> {
    const res = await fetch(`${this.baseUrl}/api/v1/backtest`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(request),
    });
    if (!res.ok) throw new Error(`Backtest failed: ${res.status}`);
    return res.json();
  }

  async listPredictions(): Promise<PredictResponse[]> {
    const res = await fetch(`${this.baseUrl}/api/v1/predictions`);
    if (!res.ok) throw new Error(`Failed to list predictions: ${res.status}`);
    return res.json();
  }

  async listBacktests(): Promise<BacktestResponse[]> {
    const res = await fetch(`${this.baseUrl}/api/v1/backtests`);
    if (!res.ok) throw new Error(`Failed to list backtests: ${res.status}`);
    return res.json();
  }
}
