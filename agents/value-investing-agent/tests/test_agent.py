"""Tests for the Value Investing Agent."""

import json
import os
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))
sys.path.insert(0, str(Path(__file__).resolve().parent.parent.parent.parent / "packages" / "core-py"))

from tools import (
    get_company_profile,
    get_financial_statements,
    get_price_history,
    compute_value_metrics,
    intrinsic_value_estimate,
)
from openflama.llm_providers import create_provider, OpenAIStubProvider


def test_company_profile():
    profile = get_company_profile("AAPL")
    assert profile["ticker"] == "AAPL"
    assert "sector" in profile
    assert "market_cap_millions" in profile
    assert profile["data_source"] == "synthetic"


def test_financial_statements():
    fin = get_financial_statements("AAPL")
    required_keys = [
        "revenue_ttm", "gross_margin", "operating_margin", "net_margin",
        "ebitda", "free_cash_flow", "debt_to_equity", "roic",
    ]
    for key in required_keys:
        assert key in fin, f"Missing key: {key}"
        assert isinstance(fin[key], (int, float)), f"{key} should be numeric"


def test_price_history():
    prices = get_price_history("AAPL", window=100)
    assert prices["ticker"] == "AAPL"
    assert prices["current_price"] > 0
    assert prices["data_points"] == 100


def test_compute_value_metrics():
    fin = get_financial_statements("MSFT")
    prices = get_price_history("MSFT")
    metrics = compute_value_metrics(fin, prices)

    required_keys = [
        "market_cap", "enterprise_value", "eps",
        "pe_ratio", "pb_ratio", "ev_ebitda", "fcf_yield_pct",
        "roic_pct", "gross_margin_pct", "debt_to_equity",
    ]
    for key in required_keys:
        assert key in metrics, f"Missing key: {key}"


def test_intrinsic_value_estimate():
    fin = get_financial_statements("GOOG")
    prices = get_price_history("GOOG")
    metrics = compute_value_metrics(fin, prices)
    val = intrinsic_value_estimate(metrics, fin)

    assert "intrinsic_value_low" in val
    assert "intrinsic_value_mid" in val
    assert "intrinsic_value_high" in val
    assert val["intrinsic_value_low"] <= val["intrinsic_value_mid"] <= val["intrinsic_value_high"]
    assert "assumptions" in val


def test_stub_provider():
    provider = create_provider(provider="openai_stub")
    assert isinstance(provider, OpenAIStubProvider)
    assert provider.provider_name == "openai_stub"

    response = provider.generate("system", "user")
    data = json.loads(response)
    assert "recommendation" in data
    assert "risks" in data


def test_provider_selection_ollama():
    provider = create_provider(provider="ollama", model="test-model")
    assert provider.provider_name == "ollama"
    assert provider.model_name == "test-model"


def test_provider_selection_invalid():
    try:
        create_provider(provider="nonexistent")
        assert False, "Should have raised ValueError"
    except ValueError as e:
        assert "nonexistent" in str(e)


def test_full_agent_stub():
    from agent import run_value_investing_agent

    result = run_value_investing_agent(
        ticker="AAPL",
        provider="openai_stub",
    )

    required_top_keys = [
        "ticker", "as_of_date", "thesis", "financials_summary",
        "valuation", "moat_management", "risks", "recommendation",
        "assumptions", "sources", "trace",
    ]
    for key in required_top_keys:
        assert key in result, f"Missing top-level key: {key}"

    assert result["ticker"] == "AAPL"
    assert result["trace"]["llm_provider"] == "openai_stub"
    assert len(result["trace"]["tools_called"]) >= 5
    assert result["trace"]["timings"]["total"] > 0


def test_deterministic_data():
    p1 = get_company_profile("TSLA")
    p2 = get_company_profile("TSLA")
    assert p1 == p2

    f1 = get_financial_statements("TSLA")
    f2 = get_financial_statements("TSLA")
    assert f1 == f2


if __name__ == "__main__":
    tests = [
        test_company_profile,
        test_financial_statements,
        test_price_history,
        test_compute_value_metrics,
        test_intrinsic_value_estimate,
        test_stub_provider,
        test_provider_selection_ollama,
        test_provider_selection_invalid,
        test_full_agent_stub,
        test_deterministic_data,
    ]

    passed = 0
    failed = 0
    for test in tests:
        try:
            test()
            print(f"  PASS  {test.__name__}")
            passed += 1
        except Exception as e:
            print(f"  FAIL  {test.__name__}: {e}")
            failed += 1

    print(f"\n{passed} passed, {failed} failed out of {len(tests)} tests")
    sys.exit(1 if failed > 0 else 0)
