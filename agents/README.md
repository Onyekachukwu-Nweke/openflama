# OpenFlama Agents

Pluggable financial agents that extend the forecasting engine.

## Architecture

Each agent is a self-contained module that:

1. Consumes market data or model outputs
2. Applies a strategy or decision rule
3. Uses an LLM for reasoning and narrative generation
4. Produces structured, actionable output

## Available Agents

| Agent | Description | Status |
|-------|-------------|--------|
| [Value Investing Agent](value-investing-agent/) | Fundamental analysis following Buffett/Graham principles | Ready |

## Creating an Agent

See [docs/agents/creating-agents.md](../docs/agents/creating-agents.md) for the full guide.

Quick summary:

1. Create a directory under `agents/` with the required structure
2. Implement the standard I/O contract (ticker in, structured JSON out)
3. Use the shared LLM provider layer from `packages/core-py`
4. Add prompts, tools, tests, and documentation
5. Submit a PR

## LLM Providers

All agents share a pluggable LLM provider layer:

| Provider | Description |
|----------|-------------|
| `openai_stub` | Deterministic stub for CI and testing |
| `ollama` | Local inference via Ollama (Qwen, Llama, Mistral) |
| `llamacpp` | Direct llama.cpp server (stub, ready for implementation) |

Set via environment: `FLAMA_LLM_PROVIDER=ollama`
