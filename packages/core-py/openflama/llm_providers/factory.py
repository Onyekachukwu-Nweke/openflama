"""Factory for creating LLM provider instances from config."""

import os

from .base import LLMProvider
from .ollama_provider import OllamaProvider
from .llamacpp_provider import LlamaCppProvider
from .stub_provider import OpenAIStubProvider

PROVIDER_MAP = {
    "ollama": OllamaProvider,
    "llamacpp": LlamaCppProvider,
    "openai_stub": OpenAIStubProvider,
}


def create_provider(
    provider: str | None = None,
    model: str | None = None,
    **kwargs,
) -> LLMProvider:
    """Create an LLM provider instance.

    Args:
        provider: Provider name. One of: ollama, llamacpp, openai_stub.
                  Falls back to FLAMA_LLM_PROVIDER env var, then openai_stub.
        model: Model identifier. Falls back to provider-specific env vars.
        **kwargs: Additional provider-specific arguments.

    Returns:
        An initialized LLMProvider instance.

    Raises:
        ValueError: If the provider name is not recognized.
    """
    provider_name = provider or os.environ.get("FLAMA_LLM_PROVIDER", "openai_stub")
    provider_cls = PROVIDER_MAP.get(provider_name)

    if provider_cls is None:
        available = ", ".join(sorted(PROVIDER_MAP.keys()))
        raise ValueError(
            f"Unknown LLM provider '{provider_name}'. Available: {available}"
        )

    return provider_cls(model=model, **kwargs)
