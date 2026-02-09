# Value Investing Agent

A production-quality financial agent that performs fundamental analysis following the principles of Warren Buffett, Charlie Munger, and Benjamin Graham.

## What It Does

The agent produces a structured company analysis including:

- **Business quality assessment** - sector, competitive position, moat analysis
- **Financial health review** - revenue growth, margins, leverage, cash flow quality
- **Valuation analysis** - P/E, P/B, EV/EBITDA, FCF yield, intrinsic value estimates
- **Risk identification** - business, valuation, and macro risks
- **Investment recommendation** - buy/hold/watch/avoid with confidence level

## Quick Start

### With Stub Provider (no LLM required)

```bash
cd agents/value-investing-agent
python agent.py --ticker AAPL --provider openai_stub
```

### With Ollama

1. Install Ollama: https://ollama.ai
2. Pull a model:
   ```bash
   ollama pull qwen2.5:7b
   ```
3. Run the agent:
   ```bash
   cd agents/value-investing-agent
   python agent.py --ticker AAPL --provider ollama --model qwen2.5:7b
   ```

### Switching Models in Ollama

```bash
# Use Llama 3
ollama pull llama3
python agent.py --ticker MSFT --provider ollama --model llama3

# Use Mistral
ollama pull mistral
python agent.py --ticker GOOG --provider ollama --model mistral

# Use Qwen (default)
ollama pull qwen2.5:7b
python agent.py --ticker AMZN --provider ollama --model qwen2.5:7b
```

### Environment Variables

```bash
export FLAMA_LLM_PROVIDER=ollama          # or llamacpp, openai_stub
export FLAMA_OLLAMA_MODEL=qwen2.5:7b      # model for Ollama
export FLAMA_OLLAMA_URL=http://localhost:11434  # Ollama endpoint
```

## CLI Usage

```bash
python agent.py \
  --ticker AAPL \
  --provider ollama \
  --model qwen2.5:7b \
  --as-of-date 2025-01-15 \
  --discount-rate 0.10 \
  --safety-margin 0.25 \
  --output analysis.json
```

## Example Output

```json
{
  "ticker": "AAPL",
  "as_of_date": "2025-01-15",
  "thesis": {
    "summary": "Strong business with durable competitive advantages...",
    "sector": "Technology",
    "competitive_position": "Wide moat from ecosystem lock-in..."
  },
  "financials_summary": {
    "revenue_growth": "Moderate growth at 12%...",
    "margin_trend": "Expanding operating margins...",
    "debt_level": "Conservative leverage...",
    "cash_flow_quality": "Strong FCF generation..."
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
    "tools_called": ["get_company_profile", "get_financial_statements", ...],
    "timings": {"total": 3.2}
  }
}
```

## Configuration

Copy `config.example.yaml` and customize:

```yaml
provider: ollama
model: qwen2.5:7b
temperature: 0.2

valuation:
  discount_rate: 0.10
  terminal_growth: 0.03
  safety_margin: 0.25
  projection_years: 10
```

## Architecture

```
value-investing-agent/
  agent.py              Main orchestration
  tools.py              Data fetching and metric computation
  config.example.yaml   Configuration template
  prompts/
    system.txt          System prompt for LLM
    analysis_template.txt  Analysis request template
  tests/
    test_agent.py       Unit and integration tests
```

### Data Flow

```
Ticker Input
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
Structured JSON Output
```

## Running Tests

```bash
cd agents/value-investing-agent
python tests/test_agent.py
```

## LLM Providers

| Provider | Status | Use Case |
|----------|--------|----------|
| `openai_stub` | Ready | CI, testing, development without LLM |
| `ollama` | Ready | Local LLM inference (Qwen, Llama, Mistral) |
| `llamacpp` | Stub | Direct llama.cpp server integration |

## Troubleshooting

**"Cannot connect to Ollama"**
- Make sure Ollama is running: `ollama serve`
- Check the URL: default is `http://localhost:11434`
- Verify with: `curl http://localhost:11434/api/tags`

**"Model not found"**
- Pull the model first: `ollama pull qwen2.5:7b`
- List available models: `ollama list`

**JSON parse errors in output**
- Some models produce inconsistent JSON. Try a different model or lower temperature.
- The agent will fall back to a structured output with raw LLM text if parsing fails.

## Data Sources

The MVP uses **synthetic data** generated deterministically from ticker symbols. This means:
- Results are reproducible (same ticker = same data)
- No external API dependencies
- No API keys required

Future versions will integrate real market data via yfinance or Alpha Vantage.
