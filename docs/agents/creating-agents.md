# Creating OpenFlama Agents

This guide explains how to create a new agent for the OpenFlama ecosystem.

## What Is an Agent?

An agent is a self-contained module that:
1. Consumes market data or model outputs
2. Applies a strategy or decision rule
3. Uses an LLM for reasoning and narrative generation
4. Produces structured, actionable output

## Folder Structure

Create your agent under `/agents/`:

```
agents/
  your-agent-name/
    __init__.py
    __main__.py          # For `python -m` support
    agent.py             # Main orchestration
    tools.py             # Data tools and computations
    config.example.yaml  # Configuration template
    README.md            # Documentation
    prompts/
      system.txt         # System prompt
      *.txt              # Additional prompt templates
    tests/
      __init__.py
      test_agent.py      # Tests
```

## Agent I/O Schema

Every agent must implement a main function that returns a dict with this structure:

```python
def run_your_agent(
    ticker: str,
    as_of_date: str | None = None,
    provider: str | None = None,
    model: str | None = None,
    options: dict | None = None,
) -> dict:
    """
    Returns:
    {
        "ticker": "AAPL",
        "as_of_date": "2025-01-15",
        "thesis": {...},
        "financials_summary": {...},
        "valuation": {...},
        "moat_management": {...},
        "risks": [...],
        "recommendation": {
            "action": "buy|hold|watch|avoid",
            "margin_of_safety": "...",
            "confidence": 0.0-1.0
        },
        "assumptions": [...],
        "sources": [...],
        "trace": {
            "llm_provider": "...",
            "llm_model": "...",
            "tools_called": [...],
            "timings": {...}
        }
    }
    """
```

## Using LLM Providers

Import and use the provider layer from `packages/core-py`:

```python
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent.parent.parent / "packages" / "core-py"))

from openflama.llm_providers import create_provider

llm = create_provider(provider="ollama", model="qwen2.5:7b")
response = llm.generate(
    system_prompt="You are a financial analyst.",
    user_prompt="Analyze AAPL's competitive position.",
    temperature=0.2,
)
```

### Available Providers

| Provider | Env Var | Description |
|----------|---------|-------------|
| `openai_stub` | Default | Deterministic stub for CI/testing |
| `ollama` | `FLAMA_OLLAMA_MODEL` | Local Ollama server |
| `llamacpp` | `FLAMA_LLAMACPP_URL` | llama.cpp HTTP server (stub) |

### Adding a New Provider

1. Create a new file in `packages/core-py/openflama/llm_providers/`:

```python
from .base import LLMProvider

class MyProvider(LLMProvider):
    def __init__(self, model=None, **kwargs):
        self._model = model or "default"

    @property
    def provider_name(self) -> str:
        return "my_provider"

    @property
    def model_name(self) -> str:
        return self._model

    def generate(self, system_prompt, user_prompt, temperature=0.2) -> str:
        # Your implementation here
        ...
```

2. Register it in `factory.py`:

```python
from .my_provider import MyProvider

PROVIDER_MAP = {
    ...
    "my_provider": MyProvider,
}
```

3. Export it in `__init__.py`.

## Creating Tools

Tools are functions that fetch data or compute metrics:

```python
def get_company_profile(ticker: str) -> dict:
    """Get basic company information."""
    ...

def compute_value_metrics(financials: dict, price_data: dict) -> dict:
    """Compute key financial metrics."""
    ...
```

Guidelines:
- Keep tools pure functions when possible
- Return dicts with consistent schemas
- Handle errors gracefully
- Support both real and synthetic data sources

## Prompt Design

### System Prompt (`prompts/system.txt`)

Define the agent's persona, analysis framework, and output rules.

### Template Prompts (`prompts/*.txt`)

Use Python format strings for data injection:

```
Analyze {ticker} as of {as_of_date}.

FINANCIAL DATA:
{financials_json}

Return a JSON object with this structure: ...
```

## Testing

Every agent must include tests that:
1. Validate output schema keys exist
2. Test provider selection works
3. Run end-to-end with `openai_stub` (so CI passes)
4. Verify data tool outputs

```python
def test_full_agent_stub():
    result = run_your_agent(ticker="AAPL", provider="openai_stub")
    assert "ticker" in result
    assert "recommendation" in result
    assert result["trace"]["llm_provider"] == "openai_stub"
```

Run tests:
```bash
cd agents/your-agent-name
python tests/test_agent.py
```

## Configuration

Provide a `config.example.yaml` with all configurable options:

```yaml
provider: ollama
model: qwen2.5:7b
temperature: 0.2

# Agent-specific options
your_option: value
```

Support environment variable overrides for all provider settings.

## Publishing Changes

1. Create a feature branch:
   ```bash
   git checkout -b feature/your-agent-name
   ```

2. Commit your changes:
   ```bash
   git add agents/your-agent-name/
   git commit -m "feat: add your-agent-name agent"
   ```

3. Open a Pull Request using the PR template.

4. Ensure tests pass:
   ```bash
   cd agents/your-agent-name
   python tests/test_agent.py
   ```
