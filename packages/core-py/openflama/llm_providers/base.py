"""Base LLM provider interface."""

from abc import ABC, abstractmethod


class LLMProvider(ABC):
    """Abstract base class for LLM providers.

    All providers must implement the `generate` method which accepts
    a system prompt, user prompt, and temperature parameter.
    """

    @abstractmethod
    def generate(
        self,
        system_prompt: str,
        user_prompt: str,
        temperature: float = 0.2,
    ) -> str:
        """Generate a completion from the LLM.

        Args:
            system_prompt: Instructions for the LLM's behavior.
            user_prompt: The user's query or data to analyze.
            temperature: Sampling temperature (0.0 = deterministic, 1.0 = creative).

        Returns:
            The generated text response.
        """
        ...

    @property
    @abstractmethod
    def provider_name(self) -> str:
        """Return the name of this provider."""
        ...

    @property
    @abstractmethod
    def model_name(self) -> str:
        """Return the model identifier being used."""
        ...
