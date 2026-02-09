"""llama.cpp LLM provider stub.

This provider is a scaffold for connecting to a llama.cpp server.
See the README for wiring instructions.
"""

import os

from .base import LLMProvider


class LlamaCppProvider(LLMProvider):
    """Provider stub for llama.cpp HTTP server.

    To use this provider:

    1. Build and run llama.cpp server:
       ```
       ./llama-server -m model.gguf --host 0.0.0.0 --port 8080
       ```

    2. Set environment variables:
       ```
       FLAMA_LLM_PROVIDER=llamacpp
       FLAMA_LLAMACPP_URL=http://localhost:8080
       ```

    3. Implement the generate() method below to call the /completion
       or /v1/chat/completions endpoint on your llama.cpp server.
    """

    def __init__(
        self,
        model: str | None = None,
        base_url: str | None = None,
    ):
        self._model = model or os.environ.get("FLAMA_LLAMACPP_MODEL", "local-gguf")
        self._base_url = (
            base_url or os.environ.get("FLAMA_LLAMACPP_URL", "http://localhost:8080")
        ).rstrip("/")

    @property
    def provider_name(self) -> str:
        return "llamacpp"

    @property
    def model_name(self) -> str:
        return self._model

    def generate(
        self,
        system_prompt: str,
        user_prompt: str,
        temperature: float = 0.2,
    ) -> str:
        raise NotImplementedError(
            "LlamaCppProvider is a stub. To implement:\n"
            "1. Run llama.cpp server: ./llama-server -m model.gguf --port 8080\n"
            f"2. POST to {self._base_url}/v1/chat/completions with messages\n"
            "3. Parse the response and return the content string.\n"
            "See agents/value-investing-agent/README.md for details."
        )
