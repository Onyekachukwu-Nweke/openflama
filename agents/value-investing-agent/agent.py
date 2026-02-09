"""Value Investing Agent - main orchestration module.

Produces a structured company analysis with valuation estimates
and an investment recommendation using pluggable LLM providers.
"""

import json
import os
import sys
import time
from datetime import datetime
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent.parent.parent / "packages" / "core-py"))

from openflama.llm_providers import create_provider
from tools import (
    get_company_profile,
    get_financial_statements,
    get_price_history,
    compute_value_metrics,
    intrinsic_value_estimate,
)

PROMPTS_DIR = Path(__file__).parent / "prompts"


def _load_prompt(name: str) -> str:
    return (PROMPTS_DIR / name).read_text()


def _load_config(config_path: str | None = None) -> dict:
    if config_path and os.path.exists(config_path):
        import yaml
        with open(config_path) as f:
            return yaml.safe_load(f) or {}
    return {}


def run_value_investing_agent(
    ticker: str,
    as_of_date: str | None = None,
    provider: str | None = None,
    model: str | None = None,
    options: dict | None = None,
) -> dict:
    """Run the Value Investing Agent.

    Args:
        ticker: Stock ticker symbol (e.g., "AAPL").
        as_of_date: Analysis date (defaults to today).
        provider: LLM provider name (ollama, llamacpp, openai_stub).
        model: LLM model identifier.
        options: Additional options (discount_rate, safety_margin, etc.).

    Returns:
        Structured analysis dict with stable schema.
    """
    options = options or {}
    as_of_date = as_of_date or datetime.now().strftime("%Y-%m-%d")
    timings: dict[str, float] = {}
    tools_called: list[str] = []

    t0 = time.time()

    llm = create_provider(provider=provider, model=model)

    t1 = time.time()
    profile = get_company_profile(ticker)
    tools_called.append("get_company_profile")
    timings["get_company_profile"] = round(time.time() - t1, 3)

    t1 = time.time()
    financials = get_financial_statements(ticker)
    tools_called.append("get_financial_statements")
    timings["get_financial_statements"] = round(time.time() - t1, 3)

    t1 = time.time()
    price_data = get_price_history(ticker, window=options.get("price_window", 252))
    tools_called.append("get_price_history")
    timings["get_price_history"] = round(time.time() - t1, 3)

    t1 = time.time()
    metrics = compute_value_metrics(financials, price_data)
    tools_called.append("compute_value_metrics")
    timings["compute_value_metrics"] = round(time.time() - t1, 3)

    t1 = time.time()
    valuation_assumptions = {
        "discount_rate": options.get("discount_rate", 0.10),
        "terminal_growth": options.get("terminal_growth", 0.03),
        "safety_margin": options.get("safety_margin", 0.25),
        "projection_years": options.get("projection_years", 10),
    }
    valuation = intrinsic_value_estimate(metrics, financials, valuation_assumptions)
    tools_called.append("intrinsic_value_estimate")
    timings["intrinsic_value_estimate"] = round(time.time() - t1, 3)

    system_prompt = _load_prompt("system.txt")
    analysis_template = _load_prompt("analysis_template.txt")

    user_prompt = analysis_template.format(
        ticker=ticker.upper(),
        as_of_date=as_of_date,
        profile_json=json.dumps(profile, indent=2),
        financials_json=json.dumps(financials, indent=2),
        price_json=json.dumps(price_data, indent=2),
        metrics_json=json.dumps(metrics, indent=2),
        valuation_json=json.dumps(valuation, indent=2),
    )

    t1 = time.time()
    raw_response = llm.generate(
        system_prompt=system_prompt,
        user_prompt=user_prompt,
        temperature=options.get("temperature", 0.2),
    )
    timings["llm_generate"] = round(time.time() - t1, 3)

    try:
        cleaned = raw_response.strip()
        if cleaned.startswith("```"):
            lines = cleaned.split("\n")
            cleaned = "\n".join(lines[1:-1] if lines[-1].strip() == "```" else lines[1:])
        analysis = json.loads(cleaned)
    except json.JSONDecodeError:
        analysis = {
            "thesis": {"summary": raw_response[:500], "sector": profile.get("sector", "Unknown"), "competitive_position": "See raw LLM output"},
            "financials_summary": {"revenue_growth": "See raw output", "margin_trend": "See raw output", "debt_level": "See raw output", "cash_flow_quality": "See raw output"},
            "valuation": {"method": "See raw output", "intrinsic_value_low": valuation["intrinsic_value_low"], "intrinsic_value_high": valuation["intrinsic_value_high"], "current_price": valuation["current_price"], "margin_of_safety": f"{valuation['margin_of_safety_pct']}%"},
            "moat_analysis": {"moat_type": "See raw output", "moat_durability": "See raw output", "management_quality": "See raw output"},
            "risks": ["LLM response could not be parsed as JSON"],
            "recommendation": {"action": "watch", "confidence": 0.0, "reasoning": "Response parsing failed - review raw output"},
            "_raw_llm_response": raw_response[:2000],
        }

    total_time = round(time.time() - t0, 3)

    return {
        "ticker": ticker.upper(),
        "as_of_date": as_of_date,
        "thesis": analysis.get("thesis", {}),
        "financials_summary": analysis.get("financials_summary", {}),
        "valuation": analysis.get("valuation", {
            "method": "dcf_lite + multiples",
            "intrinsic_value_low": valuation["intrinsic_value_low"],
            "intrinsic_value_high": valuation["intrinsic_value_high"],
            "current_price": valuation["current_price"],
            "margin_of_safety": f"{valuation['margin_of_safety_pct']}%",
        }),
        "moat_management": analysis.get("moat_analysis", {}),
        "risks": analysis.get("risks", []),
        "recommendation": analysis.get("recommendation", {"action": "watch", "confidence": 0.0}),
        "assumptions": [
            f"Discount rate: {valuation_assumptions['discount_rate']*100}%",
            f"Terminal growth: {valuation_assumptions['terminal_growth']*100}%",
            f"Safety margin: {valuation_assumptions['safety_margin']*100}%",
            f"Projection years: {valuation_assumptions['projection_years']}",
            "Data source: synthetic (MVP)",
        ],
        "sources": [
            {"type": "synthetic", "description": "Generated financial data for MVP demonstration"},
        ],
        "trace": {
            "llm_provider": llm.provider_name,
            "llm_model": llm.model_name,
            "tools_called": tools_called,
            "timings": {**timings, "total": total_time},
        },
    }


def main():
    import argparse

    parser = argparse.ArgumentParser(description="OpenFlama Value Investing Agent")
    parser.add_argument("--ticker", required=True, help="Stock ticker (e.g., AAPL)")
    parser.add_argument("--provider", default=None, help="LLM provider (ollama, llamacpp, openai_stub)")
    parser.add_argument("--model", default=None, help="LLM model name")
    parser.add_argument("--as-of-date", default=None, help="Analysis date (YYYY-MM-DD)")
    parser.add_argument("--discount-rate", type=float, default=0.10)
    parser.add_argument("--safety-margin", type=float, default=0.25)
    parser.add_argument("--output", default=None, help="Output file path (default: stdout)")

    args = parser.parse_args()

    options = {
        "discount_rate": args.discount_rate,
        "safety_margin": args.safety_margin,
    }

    result = run_value_investing_agent(
        ticker=args.ticker,
        as_of_date=args.as_of_date,
        provider=args.provider,
        model=args.model,
        options=options,
    )

    output = json.dumps(result, indent=2)

    if args.output:
        with open(args.output, "w") as f:
            f.write(output)
        print(f"Analysis written to {args.output}")
    else:
        print(output)


if __name__ == "__main__":
    main()
