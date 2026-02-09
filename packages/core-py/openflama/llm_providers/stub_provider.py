"""Stub provider for CI and local development without an LLM."""

import json

from .base import LLMProvider

STUB_ANALYSIS = json.dumps(
    {
        "thesis": {
            "summary": "Stub analysis - no LLM connected. Install Ollama and set FLAMA_LLM_PROVIDER=ollama for real analysis.",
            "sector": "Technology",
            "competitive_position": "Placeholder - requires LLM for real analysis",
        },
        "financials_summary": {
            "revenue_growth": "N/A (stub)",
            "margin_trend": "N/A (stub)",
            "debt_level": "N/A (stub)",
            "cash_flow_quality": "N/A (stub)",
        },
        "valuation": {
            "method": "stub",
            "intrinsic_value_low": 0,
            "intrinsic_value_high": 0,
            "current_price": 0,
            "margin_of_safety": "N/A",
        },
        "moat_analysis": {
            "moat_type": "N/A (stub)",
            "moat_durability": "N/A (stub)",
            "management_quality": "N/A (stub)",
        },
        "risks": [
            "This is a stub response - no real analysis performed",
            "Connect an LLM provider for actual value investing analysis",
        ],
        "recommendation": {
            "action": "watch",
            "confidence": 0.0,
            "reasoning": "Stub provider - no real analysis available",
        },
    },
    indent=2,
)


class OpenAIStubProvider(LLMProvider):
    """Deterministic stub provider for testing and CI.

    Returns a fixed placeholder response so tests pass without
    requiring an actual LLM server. Not for production use.
    """

    def __init__(self, model: str | None = None, **kwargs):
        self._model = model or "stub-v1"

    @property
    def provider_name(self) -> str:
        return "openai_stub"

    @property
    def model_name(self) -> str:
        return self._model

    def generate(
        self,
        system_prompt: str,
        user_prompt: str,
        temperature: float = 0.2,
    ) -> str:
        return STUB_ANALYSIS
