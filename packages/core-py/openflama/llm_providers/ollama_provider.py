"""Ollama LLM provider - connects to a local Ollama instance."""

import os
import json

import requests

from .base import LLMProvider


class OllamaProvider(LLMProvider):
    """Provider for Ollama running locally.

    Requires Ollama to be running at the configured endpoint.
    Install: https://ollama.ai
    Default endpoint: http://localhost:11434
    """

    def __init__(
        self,
        model: str | None = None,
        base_url: str | None = None,
    ):
        self._model = model or os.environ.get("FLAMA_OLLAMA_MODEL", "qwen2.5:7b")
        self._base_url = (
            base_url or os.environ.get("FLAMA_OLLAMA_URL", "http://localhost:11434")
        ).rstrip("/")

    @property
    def provider_name(self) -> str:
        return "ollama"

    @property
    def model_name(self) -> str:
        return self._model

    def generate(
        self,
        system_prompt: str,
        user_prompt: str,
        temperature: float = 0.2,
    ) -> str:
        url = f"{self._base_url}/api/chat"
        payload = {
            "model": self._model,
            "messages": [
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt},
            ],
            "stream": False,
            "options": {"temperature": temperature},
        }

        try:
            resp = requests.post(url, json=payload, timeout=120)
        except requests.ConnectionError:
            raise ConnectionError(
                f"Cannot connect to Ollama at {self._base_url}. "
                f"Make sure Ollama is running: `ollama serve`\n"
                f"Then pull the model: `ollama pull {self._model}`"
            )

        if resp.status_code != 200:
            raise RuntimeError(
                f"Ollama returned {resp.status_code}: {resp.text[:500]}"
            )

        data = resp.json()
        return data.get("message", {}).get("content", "")
