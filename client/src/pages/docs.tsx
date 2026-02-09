import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Activity,
  BarChart3,
  BookOpen,
  Brain,
  ChevronRight,
  Code2,
  Copy,
  Check,
  Database,
  FileText,
  Layers,
  LineChart,
  Menu,
  Terminal,
  Wrench,
  X,
  Zap,
} from "lucide-react";
import { SiGithub } from "react-icons/si";

const sections = [
  {
    id: "overview",
    label: "Overview",
    icon: BookOpen,
    children: [
      { id: "what-is-openflama", label: "What is OpenFlama?" },
      { id: "why-openflama", label: "Why OpenFlama?" },
      { id: "core-concepts", label: "Core Concepts" },
    ],
  },
  {
    id: "quickstart",
    label: "Quickstart",
    icon: Zap,
    children: [
      { id: "prerequisites", label: "Prerequisites" },
      { id: "setup", label: "Setup" },
      { id: "running-locally", label: "Running Locally" },
    ],
  },
  {
    id: "architecture",
    label: "Architecture",
    icon: Layers,
    children: [
      { id: "project-structure", label: "Project Structure" },
      { id: "data-flow", label: "Data Flow" },
      { id: "forecasting-engine", label: "Forecasting Engine" },
      { id: "database-schema", label: "Database Schema" },
    ],
  },
  {
    id: "api-reference",
    label: "API Reference",
    icon: Code2,
    children: [
      { id: "endpoints", label: "Endpoints" },
      { id: "predict-api", label: "Predict" },
      { id: "backtest-api", label: "Backtest" },
    ],
  },
  {
    id: "howto",
    label: "How-To Guides",
    icon: Wrench,
    children: [
      { id: "configure-llm", label: "Configure LLM Providers" },
      { id: "run-value-agent", label: "Run the Value Investing Agent" },
      { id: "troubleshooting", label: "Troubleshooting" },
    ],
  },
  {
    id: "agents",
    label: "Agents",
    icon: Brain,
    children: [
      { id: "agents-overview", label: "Agents Overview" },
      { id: "value-investing-agent", label: "Value Investing Agent" },
      { id: "creating-agents", label: "Creating a New Agent" },
    ],
  },
  {
    id: "roadmap",
    label: "Roadmap",
    icon: LineChart,
    children: [],
  },
];

function CodeBlock({ children, language = "bash" }: { children: string; language?: string }) {
  const [copied, setCopied] = useState(false);

  function handleCopy() {
    navigator.clipboard.writeText(children.trim());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="relative group my-4 rounded-md border border-border/50 bg-card/80 overflow-hidden">
      <div className="flex items-center justify-between px-4 py-2 border-b border-border/30 bg-card/40">
        <span className="text-xs font-mono text-muted-foreground">{language}</span>
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity"
          onClick={handleCopy}
          data-testid="button-copy-code"
        >
          {copied ? <Check className="h-3.5 w-3.5 text-green-500" /> : <Copy className="h-3.5 w-3.5" />}
        </Button>
      </div>
      <pre className="p-4 overflow-x-auto text-sm font-mono text-foreground/90 leading-relaxed">
        <code>{children.trim()}</code>
      </pre>
    </div>
  );
}

function InlineCode({ children }: { children: string }) {
  return (
    <code className="px-1.5 py-0.5 rounded bg-card border border-border/40 text-sm font-mono text-primary/90">
      {children}
    </code>
  );
}

function SectionHeading({ id, children }: { id: string; children: React.ReactNode }) {
  return (
    <h2 id={id} className="text-2xl font-bold tracking-tight mt-12 mb-4 scroll-mt-20 flex items-center gap-2">
      {children}
    </h2>
  );
}

function SubHeading({ id, children }: { id: string; children: React.ReactNode }) {
  return (
    <h3 id={id} className="text-lg font-semibold tracking-tight mt-8 mb-3 scroll-mt-20 text-foreground/90">
      {children}
    </h3>
  );
}

function Paragraph({ children }: { children: React.ReactNode }) {
  return <p className="text-muted-foreground leading-relaxed mb-4">{children}</p>;
}

function DocTable({ headers, rows }: { headers: string[]; rows: string[][] }) {
  return (
    <div className="my-4 overflow-x-auto rounded-md border border-border/50">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border/50 bg-card/40">
            {headers.map((h) => (
              <th key={h} className="px-4 py-2.5 text-left font-semibold text-foreground/90">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} className="border-b border-border/30 last:border-0">
              {row.map((cell, j) => (
                <td key={j} className="px-4 py-2.5 text-muted-foreground font-mono text-xs">
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function OverviewSection() {
  return (
    <>
      <SectionHeading id="overview">Overview</SectionHeading>

      <SubHeading id="what-is-openflama">What is OpenFlama?</SubHeading>
      <Paragraph>
        OpenFlama is an open-source agentic finance runtime and forecasting engine. It provides
        quantitative forecasting with baseline models, walk-forward backtesting, and a pluggable
        architecture for financial agents. The name stands for <strong>Financial Large-Language
        Agentic Model Agora</strong> - an open marketplace for financial AI tools.
      </Paragraph>

      <SubHeading id="why-openflama">Why OpenFlama?</SubHeading>
      <Paragraph>
        Existing quantitative finance tools are either proprietary, require expensive data feeds,
        or lack auditability. OpenFlama addresses this by providing:
      </Paragraph>
      <ul className="list-disc list-inside space-y-2 text-muted-foreground mb-4 ml-2">
        <li><strong className="text-foreground/90">Reproducibility</strong> - Every prediction is stored with full trace data (model, inputs, parameters, timestamps)</li>
        <li><strong className="text-foreground/90">No lookahead bias</strong> - Walk-forward backtesting ensures evaluation integrity</li>
        <li><strong className="text-foreground/90">Local-first</strong> - LLM providers like Ollama run entirely on your machine. No data leaves your network</li>
        <li><strong className="text-foreground/90">Pluggable architecture</strong> - Swap models, LLM backends, or data sources without changing the core</li>
        <li><strong className="text-foreground/90">Open source</strong> - MIT licensed. Inspect, modify, and contribute freely</li>
      </ul>

      <SubHeading id="core-concepts">Core Concepts</SubHeading>

      <div className="grid sm:grid-cols-2 gap-4 my-4">
        {[
          {
            icon: Brain,
            title: "Agentic Runtime",
            desc: "Agents are autonomous modules that consume data, apply strategies, use LLMs for reasoning, and produce structured output. They follow a standard I/O contract.",
          },
          {
            icon: Layers,
            title: "Pluggable LLM Providers",
            desc: "Switch between Ollama (local inference), llama.cpp, or stubs for testing. Add new providers by implementing a simple interface.",
          },
          {
            icon: LineChart,
            title: "Forecasting Engine",
            desc: "Four baseline models (Random Walk, Momentum, Mean Reversion, Feature-Based) that generate point forecasts with prediction intervals.",
          },
          {
            icon: BarChart3,
            title: "Walk-Forward Backtesting",
            desc: "Expand the training window one step at a time, forecast, and record results. No future data leaks. Metrics include MAE, MAPE, and directional accuracy.",
          },
        ].map((item) => (
          <Card key={item.title}>
            <CardContent className="p-4">
              <div className="flex items-center gap-2.5 mb-2">
                <div className="p-1.5 rounded-md bg-primary/10">
                  <item.icon className="h-4 w-4 text-primary" />
                </div>
                <span className="font-semibold text-sm">{item.title}</span>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </>
  );
}

function QuickstartSection() {
  return (
    <>
      <SectionHeading id="quickstart">Quickstart</SectionHeading>

      <SubHeading id="prerequisites">Prerequisites</SubHeading>
      <ul className="list-disc list-inside space-y-2 text-muted-foreground mb-4 ml-2">
        <li><strong className="text-foreground/90">Node.js 20+</strong> - Runtime for the API server and frontend</li>
        <li><strong className="text-foreground/90">PostgreSQL 15+</strong> - Database for predictions and backtest storage</li>
        <li><strong className="text-foreground/90">Python 3.10+</strong> - Required for running agents and the core library</li>
        <li><strong className="text-foreground/90">Ollama</strong> (optional) - For local LLM inference with the Value Investing Agent</li>
      </ul>

      <SubHeading id="setup">Setup</SubHeading>
      <Paragraph>Clone the repository and install dependencies:</Paragraph>
      <CodeBlock language="bash">{`git clone https://github.com/maquenflow/openflama.git
cd openflama
npm install`}</CodeBlock>

      <Paragraph>Set your environment variables:</Paragraph>
      <CodeBlock language="bash">{`export DATABASE_URL="postgresql://user:pass@localhost:5432/openflama"
export SESSION_SECRET="your-secret"`}</CodeBlock>

      <Paragraph>Push the database schema:</Paragraph>
      <CodeBlock language="bash">{`npm run db:push`}</CodeBlock>

      <SubHeading id="running-locally">Running Locally</SubHeading>
      <Paragraph>Start the development server:</Paragraph>
      <CodeBlock language="bash">{`npm run dev`}</CodeBlock>
      <Paragraph>
        The web dashboard will be available at <InlineCode>http://localhost:5000</InlineCode> and
        the API at <InlineCode>http://localhost:5000/api/v1/</InlineCode>.
      </Paragraph>

      <Paragraph>Test the API with a quick prediction:</Paragraph>
      <CodeBlock language="bash">{`curl -X POST http://localhost:5000/api/v1/predict \\
  -H "Content-Type: application/json" \\
  -d '{"ticker": "AAPL", "horizon": "5d", "target": "return"}'`}</CodeBlock>
    </>
  );
}

function ArchitectureSection() {
  return (
    <>
      <SectionHeading id="architecture">Architecture</SectionHeading>

      <SubHeading id="project-structure">Project Structure</SubHeading>
      <CodeBlock language="text">{`openflama/
  apps/
    api/            Express.js API server docs
    web/            React + Vite frontend docs
  packages/
    sdk-ts/         TypeScript SDK (@openflama/sdk-ts)
    core-py/        Python core library (openflama-core)
  agents/           Pluggable financial agents
  docs/             Documentation
  server/           API source (Express routes, forecasting engine)
  client/           Frontend source (React components)
  shared/           Shared types and schemas`}</CodeBlock>

      <SubHeading id="data-flow">Data Flow</SubHeading>
      <CodeBlock language="text">{`User Request
    |
    v
[Web Dashboard] --HTTP--> [API Server] ---> [Forecasting Engine]
                                |                    |
                                v                    v
                          [PostgreSQL]        [Model Registry]
                          (persistence)       (4 baseline models)`}</CodeBlock>

      <SubHeading id="forecasting-engine">Forecasting Engine</SubHeading>
      <Paragraph>The engine provides four baseline models:</Paragraph>
      <DocTable
        headers={["Model", "Strategy", "Use Case"]}
        rows={[
          ["Random Walk", "No-change baseline (drift = 0)", "Benchmark"],
          ["Simple Momentum", "Mean of recent returns", "Trend following"],
          ["Mean Reversion", "Short vs long-term mean deviation + RSI", "Contrarian"],
          ["Feature-Based", "Momentum crossover + RSI + volatility regime", "Multi-signal"],
        ]}
      />
      <Paragraph>
        All models accept ticker, horizon, and target parameters. They return a point forecast
        with prediction interval, include a trace ID and explanation for auditability, and use
        a pluggable registry pattern for extensibility.
      </Paragraph>

      <SubHeading id="database-schema">Database Schema</SubHeading>
      <ul className="list-disc list-inside space-y-2 text-muted-foreground mb-4 ml-2">
        <li><InlineCode>predictions</InlineCode> - Stores all prediction results with model metadata</li>
        <li><InlineCode>backtest_runs</InlineCode> - Stores backtest configurations and aggregate metrics</li>
      </ul>

      <Paragraph>Technology stack:</Paragraph>
      <DocTable
        headers={["Layer", "Technology"]}
        rows={[
          ["Runtime", "Node.js with TypeScript (tsx)"],
          ["API", "Express.js"],
          ["Frontend", "React + Vite + TanStack Query"],
          ["Database", "PostgreSQL with Drizzle ORM"],
          ["Styling", "Tailwind CSS + shadcn/ui"],
          ["Agents", "Python 3.10+ with pluggable LLM providers"],
        ]}
      />
    </>
  );
}

function ApiReferenceSection() {
  return (
    <>
      <SectionHeading id="api-reference">API Reference</SectionHeading>

      <SubHeading id="endpoints">Endpoints</SubHeading>
      <DocTable
        headers={["Method", "Endpoint", "Description"]}
        rows={[
          ["GET", "/api/v1/health", "Health check"],
          ["GET", "/api/v1/models", "List forecasting models"],
          ["POST", "/api/v1/predict", "Generate prediction"],
          ["POST", "/api/v1/backtest", "Run walk-forward backtest"],
          ["GET", "/api/v1/predictions", "List recent predictions"],
          ["GET", "/api/v1/backtests", "List backtest runs"],
        ]}
      />

      <SubHeading id="predict-api">Predict</SubHeading>
      <Paragraph>Generate a price or return forecast for a given ticker and horizon.</Paragraph>
      <CodeBlock language="bash">{`curl -X POST http://localhost:5000/api/v1/predict \\
  -H "Content-Type: application/json" \\
  -d '{
    "ticker": "AAPL",
    "horizon": "5d",
    "target": "return"
  }'`}</CodeBlock>

      <Paragraph>Request body parameters:</Paragraph>
      <DocTable
        headers={["Field", "Type", "Description"]}
        rows={[
          ["ticker", "string", "Stock ticker symbol (e.g., AAPL, MSFT)"],
          ["horizon", "string", "Forecast horizon (1d, 5d, 21d, 63d)"],
          ["target", "string", "Prediction target: 'return' or 'price'"],
          ["model", "string (optional)", "Specific model to use (defaults to best available)"],
        ]}
      />

      <Paragraph>Response includes:</Paragraph>
      <CodeBlock language="json">{`{
  "id": 1,
  "ticker": "AAPL",
  "horizon": "5d",
  "target": "return",
  "model": "feature_based",
  "forecast": 0.0123,
  "lower_bound": -0.015,
  "upper_bound": 0.040,
  "explanation": "Multi-signal model output...",
  "trace_id": "abc123..."
}`}</CodeBlock>

      <SubHeading id="backtest-api">Backtest</SubHeading>
      <Paragraph>Run a walk-forward backtest to evaluate model performance.</Paragraph>
      <CodeBlock language="bash">{`curl -X POST http://localhost:5000/api/v1/backtest \\
  -H "Content-Type: application/json" \\
  -d '{
    "ticker": "AAPL",
    "model": "simple_momentum",
    "horizon": "5d",
    "steps": 50
  }'`}</CodeBlock>

      <Paragraph>
        The backtest uses walk-forward methodology: expand the training window by one step,
        generate a forecast, record the actual result, and repeat. Metrics computed include
        MAE, MAPE, directional accuracy, and hit rate.
      </Paragraph>
    </>
  );
}

function HowToSection() {
  return (
    <>
      <SectionHeading id="howto">How-To Guides</SectionHeading>

      <SubHeading id="configure-llm">Configure LLM Providers</SubHeading>
      <Paragraph>
        OpenFlama agents use a pluggable LLM provider layer. You can switch providers via
        environment variables or CLI flags.
      </Paragraph>

      <DocTable
        headers={["Provider", "Env Var", "Description"]}
        rows={[
          ["openai_stub", "Default", "Deterministic stub for CI and testing"],
          ["ollama", "FLAMA_OLLAMA_MODEL", "Local Ollama server (Qwen, Llama, Mistral)"],
          ["llamacpp", "FLAMA_LLAMACPP_URL", "llama.cpp HTTP server (stub, ready for impl)"],
        ]}
      />

      <Paragraph>Set the provider globally via environment variable:</Paragraph>
      <CodeBlock language="bash">{`export FLAMA_LLM_PROVIDER=ollama
export FLAMA_OLLAMA_MODEL=qwen2.5:7b
export FLAMA_OLLAMA_URL=http://localhost:11434`}</CodeBlock>

      <Paragraph>Or pass it directly on the CLI:</Paragraph>
      <CodeBlock language="bash">{`python agent.py --ticker AAPL --provider ollama --model qwen2.5:7b`}</CodeBlock>

      <SubHeading id="run-value-agent">Run the Value Investing Agent</SubHeading>
      <Paragraph>
        The Value Investing Agent performs fundamental analysis following the principles of
        Warren Buffett, Charlie Munger, and Benjamin Graham. Here is an end-to-end walkthrough:
      </Paragraph>

      <Paragraph><strong>Step 1:</strong> With the stub provider (no LLM needed):</Paragraph>
      <CodeBlock language="bash">{`cd agents/value-investing-agent
python agent.py --ticker AAPL --provider openai_stub`}</CodeBlock>

      <Paragraph><strong>Step 2:</strong> With Ollama for real LLM analysis:</Paragraph>
      <CodeBlock language="bash">{`# Install Ollama: https://ollama.ai
ollama pull qwen2.5:7b
cd agents/value-investing-agent
python agent.py --ticker AAPL --provider ollama --model qwen2.5:7b`}</CodeBlock>

      <Paragraph><strong>Step 3:</strong> Full CLI with all options:</Paragraph>
      <CodeBlock language="bash">{`python agent.py \\
  --ticker MSFT \\
  --provider ollama \\
  --model qwen2.5:7b \\
  --as-of-date 2025-01-15 \\
  --discount-rate 0.10 \\
  --safety-margin 0.25 \\
  --output analysis.json`}</CodeBlock>

      <Paragraph>
        The output is a structured JSON object containing thesis, financials summary, valuation
        (intrinsic value range), recommendation (buy/hold/watch/avoid), and a full trace of the
        analysis.
      </Paragraph>

      <SubHeading id="troubleshooting">Troubleshooting</SubHeading>

      <div className="space-y-4 my-4">
        {[
          {
            q: "Cannot connect to Ollama",
            a: "Make sure Ollama is running (ollama serve). Check the URL: default is http://localhost:11434. Verify with: curl http://localhost:11434/api/tags",
          },
          {
            q: "Model not found",
            a: "Pull the model first: ollama pull qwen2.5:7b. List available models: ollama list",
          },
          {
            q: "JSON parse errors in agent output",
            a: "Some models produce inconsistent JSON. Try a different model or lower temperature. The agent falls back to structured output with raw LLM text if parsing fails.",
          },
          {
            q: "Database connection errors",
            a: "Verify your DATABASE_URL environment variable is set correctly. Ensure PostgreSQL is running and the database exists.",
          },
        ].map((item) => (
          <Card key={item.q}>
            <CardContent className="p-4">
              <p className="font-semibold text-sm mb-1.5">{item.q}</p>
              <p className="text-sm text-muted-foreground leading-relaxed">{item.a}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </>
  );
}

function AgentsSection() {
  return (
    <>
      <SectionHeading id="agents">Agents</SectionHeading>

      <SubHeading id="agents-overview">Agents Overview</SubHeading>
      <Paragraph>
        An agent is a self-contained module that consumes market data or model outputs, applies a
        strategy or decision rule, uses an LLM for reasoning and narrative generation, and produces
        structured, actionable output. All agents follow a standard I/O contract (ticker in,
        structured JSON out).
      </Paragraph>

      <DocTable
        headers={["Agent", "Description", "Status"]}
        rows={[
          ["Value Investing Agent", "Fundamental analysis following Buffett/Graham principles", "Ready"],
        ]}
      />

      <SubHeading id="value-investing-agent">Value Investing Agent</SubHeading>
      <Paragraph>
        A production-quality financial agent that performs fundamental analysis. It produces:
      </Paragraph>
      <ul className="list-disc list-inside space-y-2 text-muted-foreground mb-4 ml-2">
        <li><strong className="text-foreground/90">Business quality assessment</strong> - Sector, competitive position, moat analysis</li>
        <li><strong className="text-foreground/90">Financial health review</strong> - Revenue growth, margins, leverage, cash flow quality</li>
        <li><strong className="text-foreground/90">Valuation analysis</strong> - P/E, P/B, EV/EBITDA, FCF yield, intrinsic value estimates</li>
        <li><strong className="text-foreground/90">Risk identification</strong> - Business, valuation, and macro risks</li>
        <li><strong className="text-foreground/90">Investment recommendation</strong> - buy/hold/watch/avoid with confidence level</li>
      </ul>

      <Paragraph>Data flow through the agent:</Paragraph>
      <CodeBlock language="text">{`Ticker Input
    |
    v
[Data Tools] --> Company Profile, Financials, Price History
    |
    v
[Metric Engine] --> P/E, P/B, EV/EBITDA, FCF Yield, ROIC
    |
    v
[Valuation] --> DCF-lite, Multiples, Intrinsic Value Range
    |
    v
[LLM Provider] --> Narrative Analysis + Recommendation
    |
    v
Structured JSON Output`}</CodeBlock>

      <Paragraph>Example output (abbreviated):</Paragraph>
      <CodeBlock language="json">{`{
  "ticker": "AAPL",
  "as_of_date": "2025-01-15",
  "thesis": {
    "summary": "Strong business with durable competitive advantages...",
    "sector": "Technology",
    "competitive_position": "Wide moat from ecosystem lock-in..."
  },
  "valuation": {
    "intrinsic_value_low": 145.20,
    "intrinsic_value_high": 198.50,
    "current_price": 172.30,
    "margin_of_safety": "8.2%"
  },
  "recommendation": {
    "action": "hold",
    "confidence": 0.4,
    "reasoning": "Fair value range suggests limited upside..."
  },
  "trace": {
    "llm_provider": "ollama",
    "llm_model": "qwen2.5:7b",
    "tools_called": ["get_company_profile", "get_financial_statements", "..."],
    "timings": { "total": 3.2 }
  }
}`}</CodeBlock>

      <Paragraph>
        The MVP uses synthetic data generated deterministically from ticker symbols, so results
        are reproducible and no external API keys are required.
      </Paragraph>

      <SubHeading id="creating-agents">Creating a New Agent</SubHeading>
      <Paragraph>
        Create a new directory under <InlineCode>agents/</InlineCode> with the following structure:
      </Paragraph>
      <CodeBlock language="text">{`agents/
  your-agent-name/
    __init__.py
    __main__.py          # For python -m support
    agent.py             # Main orchestration
    tools.py             # Data tools and computations
    config.example.yaml  # Configuration template
    README.md            # Documentation
    prompts/
      system.txt         # System prompt
      *.txt              # Additional prompt templates
    tests/
      __init__.py
      test_agent.py      # Tests`}</CodeBlock>

      <Paragraph>Every agent must implement a main function with this return schema:</Paragraph>
      <CodeBlock language="python">{`def run_your_agent(
    ticker: str,
    as_of_date: str | None = None,
    provider: str | None = None,
    model: str | None = None,
    options: dict | None = None,
) -> dict:
    """
    Returns a dict with keys:
    - ticker, as_of_date, thesis, financials_summary, valuation
    - moat_management, risks, recommendation, assumptions, sources
    - trace (llm_provider, llm_model, tools_called, timings)
    """
    ...`}</CodeBlock>

      <Paragraph>Use the shared LLM provider layer:</Paragraph>
      <CodeBlock language="python">{`import sys
from pathlib import Path

sys.path.insert(0, str(
    Path(__file__).resolve().parent.parent.parent / "packages" / "core-py"
))

from openflama.llm_providers import create_provider

llm = create_provider(provider="ollama", model="qwen2.5:7b")
response = llm.generate(
    system_prompt="You are a financial analyst.",
    user_prompt="Analyze AAPL's competitive position.",
    temperature=0.2,
)`}</CodeBlock>

      <Paragraph>
        Every agent must include tests that validate the output schema, test provider selection,
        run end-to-end with <InlineCode>openai_stub</InlineCode> (so CI passes), and verify data
        tool outputs. See the{" "}
        <a
          href="https://github.com/maquenflow/openflama/blob/main/docs/agents/creating-agents.md"
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary underline underline-offset-4"
        >
          full guide on GitHub
        </a>{" "}
        for complete details.
      </Paragraph>
    </>
  );
}

function RoadmapSection() {
  const milestones = [
    {
      version: "v0.1.0",
      title: "MVP",
      status: "current" as const,
      items: [
        { done: true, text: "Forecasting engine with 4 baseline models" },
        { done: true, text: "REST API for predictions and backtesting" },
        { done: true, text: "Walk-forward backtesting with metrics" },
        { done: true, text: "PostgreSQL persistence" },
        { done: true, text: "Web dashboard with dark theme" },
        { done: true, text: "TypeScript SDK scaffold" },
        { done: true, text: "Value Investing Agent with pluggable LLM providers" },
      ],
    },
    {
      version: "v0.2.0",
      title: "Data & Models",
      status: "planned" as const,
      items: [
        { done: false, text: "Real market data integration (Yahoo Finance, Alpha Vantage)" },
        { done: false, text: "ARIMA / exponential smoothing models" },
        { done: false, text: "Model comparison endpoint" },
        { done: false, text: "Historical data caching layer" },
      ],
    },
    {
      version: "v0.3.0",
      title: "Agents Framework",
      status: "planned" as const,
      items: [
        { done: false, text: "Agent protocol specification" },
        { done: false, text: "Momentum Scanner agent" },
        { done: false, text: "Agent orchestration runtime" },
        { done: false, text: "Inter-agent messaging" },
      ],
    },
    {
      version: "v0.4.0",
      title: "Production Readiness",
      status: "planned" as const,
      items: [
        { done: false, text: "Authentication and API keys" },
        { done: false, text: "Rate limiting" },
        { done: false, text: "Async backtest execution with job queue" },
        { done: false, text: "Webhook notifications" },
      ],
    },
  ];

  return (
    <>
      <SectionHeading id="roadmap">Roadmap</SectionHeading>
      <Paragraph>
        OpenFlama follows a milestone-based development plan. Contributions to any milestone are
        welcome.
      </Paragraph>

      <div className="space-y-4 my-4">
        {milestones.map((m) => (
          <Card key={m.version}>
            <CardContent className="p-4">
              <div className="flex items-center gap-2.5 mb-3 flex-wrap">
                <Badge
                  variant={m.status === "current" ? "default" : "outline"}
                  className={m.status === "current" ? "" : "text-muted-foreground"}
                >
                  {m.version}
                </Badge>
                <span className="font-semibold text-sm">{m.title}</span>
                {m.status === "current" && (
                  <Badge variant="outline" className="border-primary/30 text-primary text-xs">Current</Badge>
                )}
              </div>
              <ul className="space-y-1.5">
                {m.items.map((item) => (
                  <li key={item.text} className="flex items-start gap-2 text-sm">
                    <span className={`mt-0.5 ${item.done ? "text-green-500" : "text-muted-foreground/50"}`}>
                      {item.done ? <Check className="h-3.5 w-3.5" /> : <span className="inline-block h-3.5 w-3.5 rounded-full border border-current" />}
                    </span>
                    <span className={item.done ? "text-muted-foreground" : "text-muted-foreground/70"}>
                      {item.text}
                    </span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        ))}
      </div>
    </>
  );
}

function Sidebar({ activeSection, onSelect, mobileOpen, onCloseMobile }: {
  activeSection: string;
  onSelect: (id: string) => void;
  mobileOpen: boolean;
  onCloseMobile: () => void;
}) {
  return (
    <>
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm lg:hidden"
          onClick={onCloseMobile}
        />
      )}
      <aside
        className={`
          fixed top-14 left-0 bottom-0 z-50 w-64 border-r border-border/30 bg-background overflow-y-auto
          transition-transform duration-200
          lg:translate-x-0 lg:z-30
          ${mobileOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        <div className="flex items-center justify-between p-4 lg:hidden">
          <span className="font-semibold text-sm">Navigation</span>
          <Button variant="ghost" size="icon" onClick={onCloseMobile} data-testid="button-close-sidebar">
            <X className="h-4 w-4" />
          </Button>
        </div>
        <nav className="px-3 pb-8 pt-2 lg:pt-4">
          {sections.map((section) => {
            const isActive = activeSection === section.id ||
              section.children.some((c) => activeSection === c.id);
            return (
              <div key={section.id} className="mb-1">
                <button
                  onClick={() => { onSelect(section.id); onCloseMobile(); }}
                  className={`
                    w-full flex items-center gap-2.5 px-3 py-2 rounded-md text-sm font-medium transition-colors
                    ${isActive ? "bg-primary/10 text-primary" : "text-muted-foreground hover-elevate"}
                  `}
                  data-testid={`button-nav-${section.id}`}
                >
                  <section.icon className="h-4 w-4 shrink-0" />
                  <span>{section.label}</span>
                </button>
                {isActive && section.children.length > 0 && (
                  <div className="ml-5 mt-1 space-y-0.5 border-l border-border/40 pl-3">
                    {section.children.map((child) => (
                      <button
                        key={child.id}
                        onClick={() => { onSelect(child.id); onCloseMobile(); }}
                        className={`
                          w-full text-left px-2 py-1.5 rounded-md text-xs transition-colors
                          ${activeSection === child.id
                            ? "text-primary font-medium"
                            : "text-muted-foreground/80 hover:text-foreground"
                          }
                        `}
                        data-testid={`button-nav-${child.id}`}
                      >
                        {child.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </nav>
      </aside>
    </>
  );
}

export default function DocsPage() {
  const [activeSection, setActiveSection] = useState("overview");
  const [mobileOpen, setMobileOpen] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  function scrollToSection(id: string) {
    setActiveSection(id);
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        }
      },
      { rootMargin: "-80px 0px -70% 0px", threshold: 0 }
    );

    const allIds = sections.flatMap((s) => [s.id, ...s.children.map((c) => c.id)]);
    allIds.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border/30 bg-background/80 backdrop-blur-xl">
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setMobileOpen(true)}
              data-testid="button-open-sidebar"
            >
              <Menu className="h-4 w-4" />
            </Button>
            <Link href="/" className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-primary" />
              <span className="font-bold text-base">
                Open<span className="text-primary">Flama</span>
              </span>
            </Link>
            <span className="hidden sm:inline text-xs text-muted-foreground">/</span>
            <span className="hidden sm:inline text-sm font-medium text-muted-foreground">Docs</span>
          </div>
          <div className="flex items-center gap-3">
            <a href="https://github.com/maquenflow/openflama" target="_blank" rel="noopener noreferrer">
              <Button variant="ghost" size="icon" data-testid="button-docs-github">
                <SiGithub className="h-4 w-4" />
              </Button>
            </a>
            <Link href="/dashboard">
              <Button size="sm" data-testid="button-docs-dashboard">
                Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      <Sidebar
        activeSection={activeSection}
        onSelect={scrollToSection}
        mobileOpen={mobileOpen}
        onCloseMobile={() => setMobileOpen(false)}
      />

      <main ref={contentRef} className="pt-14 lg:pl-64">
        <div className="max-w-3xl mx-auto px-6 py-10">
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-3">
              <FileText className="h-5 w-5 text-primary" />
              <Badge variant="outline" className="text-xs font-mono border-primary/30 text-primary">
                v0.1.0
              </Badge>
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
              Open<span className="text-primary">Flama</span> Documentation
            </h1>
            <p className="mt-3 text-muted-foreground leading-relaxed">
              Complete reference for the agentic finance runtime and forecasting engine.
            </p>
          </div>

          <OverviewSection />
          <ApiReferenceSection />
          <QuickstartSection />
          <ArchitectureSection />
          <HowToSection />
          <AgentsSection />
          <RoadmapSection />

          <div className="mt-16 pt-8 border-t border-border/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <p className="text-sm text-muted-foreground">
              Found an issue? Edit this page on{" "}
              <a
                href="https://github.com/maquenflow/openflama/tree/main/docs"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary underline underline-offset-4"
              >
                GitHub
              </a>
            </p>
            <div className="flex items-center gap-3">
              <Link href="/">
                <Button variant="outline" size="sm" data-testid="button-back-home">
                  Home
                </Button>
              </Link>
              <Link href="/dashboard">
                <Button size="sm" data-testid="button-go-dashboard">
                  Dashboard
                  <ChevronRight className="ml-1 h-3.5 w-3.5" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
